import sqlite3
from datetime import datetime

conn = sqlite3.connect('data/app.db')
cur = conn.cursor()

# Create users table if it doesn't exist
cur.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

# Check if admin user exists
cur.execute('SELECT COUNT(*) FROM users WHERE username = ?', ('admin',))
if cur.fetchone()[0] == 0:
    # Add admin user with password "admin123"
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_password = pwd_context.hash("admin123")

    cur.execute('''
    INSERT INTO users (username, email, password_hash, role, created_at)
    VALUES (?, ?, ?, ?, ?)
    ''', ('admin', 'admin@dolesewonderlandfx.com', hashed_password, 'admin', datetime.now()))
    print('Admin user created')
else:
    print('Admin user already exists')

conn.commit()

# Check tables
cur.execute('SELECT name FROM sqlite_master WHERE type="table"')
tables = [row[0] for row in cur.fetchall()]
print('Tables:', tables)

cur.execute('SELECT COUNT(*) FROM users')
count = cur.fetchone()[0]
print(f'Users table has {count} records')

conn.close()