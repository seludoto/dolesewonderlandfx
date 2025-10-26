from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="dolesewonderlandfx - API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    username: str
    password: str

# Mock user database
users = {"test": "password"}

@app.post("/login")
async def login(user: User):
    if user.username in users and users[user.username] == user.password:
        return {"token": "mock-jwt-token", "message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/register")
async def register(user: User):
    if user.username in users:
        raise HTTPException(status_code=400, detail="User already exists")
    users[user.username] = user.password
    return {"message": "Registration successful"}


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}


@app.get("/")
async def root():
    return {"message": "dolesewonderlandfx API — replace with real endpoints."}


import sqlite3
from contextlib import contextmanager

# Simple SQLite DB
@contextmanager
def get_db():
    conn = sqlite3.connect('trades.db')
    try:
        yield conn
    finally:
        conn.close()

# Init DB
try:
    with get_db() as conn:
        conn.execute('CREATE TABLE IF NOT EXISTS trades (id INTEGER PRIMARY KEY, pair TEXT, entry REAL, exit REAL, profit REAL)')
    print("Database initialized successfully")
except Exception as e:
    print(f"Database initialization error: {e}")

@app.get("/trades")
async def get_trades():
    with get_db() as conn:
        cursor = conn.execute('SELECT * FROM trades')
        trades = [{"id": row[0], "pair": row[1], "entry": row[2], "exit": row[3], "profit": row[4]} for row in cursor.fetchall()]
    return trades

@app.post("/trades")
async def add_trade(trade: dict):
    with get_db() as conn:
        conn.execute('INSERT INTO trades (pair, entry, exit, profit) VALUES (?, ?, ?, ?)',
                     (trade['pair'], trade['entry'], trade['exit'], trade['profit']))
        conn.commit()
    return {"message": "Trade added"}

if __name__ == "__main__":
    import uvicorn
    print("Starting API service...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
