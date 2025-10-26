"""
Authentication service for DoleSe Wonderland FX platform.
Handles user authentication, authorization, and JWT token management.
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext
import sqlite3
from contextlib import contextmanager

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()

app = FastAPI(
    title="DoleSe Wonderland FX - Auth Service",
    description="Authentication and authorization service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
@contextmanager
def get_db():
    """Database connection context manager."""
    db_path = os.path.join(os.path.dirname(__file__), "../../data/app.db")
    conn = sqlite3.connect(db_path)
    try:
        yield conn
    finally:
        conn.close()

def verify_password(plain_password, hashed_password):
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Hash a password."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(username: str, password: str):
    """Authenticate a user."""
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT id, username, email, password_hash, role FROM users WHERE username = ?", (username,))
        user = cur.fetchone()

        if not user:
            return False
        if not verify_password(password, user[3]):
            return False

        return {
            "id": user[0],
            "username": user[1],
            "email": user[2],
            "role": user[3]
        }

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get the current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT id, username, email, role FROM users WHERE username = ?", (username,))
        user = cur.fetchone()

        if user is None:
            raise credentials_exception

        return {
            "id": user[0],
            "username": user[1],
            "email": user[2],
            "role": user[3]
        }

@app.post("/api/v1/auth/login")
async def login(username: str, password: str):
    """Login endpoint."""
    user = authenticate_user(username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@app.post("/api/v1/auth/register")
async def register(username: str, email: str, password: str):
    """User registration endpoint."""
    # Check if user already exists
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT id FROM users WHERE username = ? OR email = ?", (username, email))
        if cur.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already registered"
            )

        # Create new user
        hashed_password = get_password_hash(password)
        cur.execute(
            "INSERT INTO users (username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)",
            (username, email, hashed_password, "user", datetime.utcnow())
        )
        conn.commit()

        user_id = cur.lastrowid

    # Create new user
        hashed_password = get_password_hash(password)
        cur.execute(
            "INSERT INTO users (username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)",
            (username, email, hashed_password, "user", datetime.utcnow())
        )
        conn.commit()

        user_id = cur.lastrowid

    return {"message": "User created successfully", "user_id": user_id}

@app.post("/api/v1/auth/register-admin")
async def register_admin(username: str, email: str, password: str, current_user: dict = Depends(get_current_user)):
    """Admin registration endpoint - only admins can create other admins."""
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can create admin accounts"
        )

    # Check if user already exists
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT id FROM users WHERE username = ? OR email = ?", (username, email))
        if cur.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already registered"
            )

        # Create new admin user
        hashed_password = get_password_hash(password)
        cur.execute(
            "INSERT INTO users (username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)",
            (username, email, hashed_password, "admin", datetime.utcnow())
        )
        conn.commit()

        user_id = cur.lastrowid

    return {"message": "Admin user created successfully", "user_id": user_id}

@app.get("/api/v1/auth/users")
async def get_users(current_user: dict = Depends(get_current_user)):
    """Get all users - admin only."""
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT id, username, email, role, created_at FROM users")
        users = cur.fetchall()

    return [
        {
            "id": user[0],
            "username": user[1],
            "email": user[2],
            "role": user[3],
            "created_at": user[4]
        }
        for user in users
    ]

@app.put("/api/v1/auth/users/{user_id}")
async def update_user(user_id: int, user_data: dict, current_user: dict = Depends(get_current_user)):
    """Update user - admin only."""
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    with get_db() as conn:
        cur = conn.cursor()
        # Check if user exists
        cur.execute("SELECT id FROM users WHERE id = ?", (user_id,))
        if not cur.fetchone():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Update user
        cur.execute(
            "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?",
            (user_data.get("username"), user_data.get("email"), user_data.get("role"), user_id)
        )
        conn.commit()

    return {"message": "User updated successfully"}

@app.delete("/api/v1/auth/users/{user_id}")
async def delete_user(user_id: int, current_user: dict = Depends(get_current_user)):
    """Delete user - admin only."""
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    with get_db() as conn:
        cur = conn.cursor()
        # Check if user exists
        cur.execute("SELECT id FROM users WHERE id = ?", (user_id,))
        if not cur.fetchone():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Delete user
        cur.execute("DELETE FROM users WHERE id = ?", (user_id,))
        conn.commit()

    return {"message": "User deleted successfully"}

@app.post("/api/v1/auth/refresh")
async def refresh_token(current_user: dict = Depends(get_current_user)):
    """Refresh access token."""
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "auth"}

if __name__ == "__main__":
    print("Starting auth service...")
    print(f"Database path: {os.path.join(os.path.dirname(__file__), '../../data/app.db')}")
    print(f"Secret key configured: {'yes' if SECRET_KEY else 'no'}")
    uvicorn.run(app, host="0.0.0.0", port=8002)