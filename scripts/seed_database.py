#!/usr/bin/env python3
"""
Database seeding script for DoleSe Wonderland FX platform.
This script populates the database with initial data for development and testing.
"""

import os
import sys
import sqlite3
from datetime import datetime, timedelta
import random

def create_connection(db_file):
    """Create a database connection to the SQLite database."""
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        print(f"Connected to {db_file}")
    except sqlite3.Error as e:
        print(e)
    return conn

def seed_users(conn):
    """Seed the users table with sample data."""
    from passlib.context import CryptContext

    # Password hashing context
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    # Create hashed passwords
    admin_password = pwd_context.hash("admin123")
    user_password = pwd_context.hash("user123")

    users = [
        ('admin', 'admin@dolesewonderlandfx.me', admin_password, 'admin', datetime.now()),
        ('john_doe', 'john@example.com', user_password, 'user', datetime.now()),
        ('jane_smith', 'jane@example.com', user_password, 'user', datetime.now()),
        ('instructor_bob', 'bob@instructor.com', user_password, 'instructor', datetime.now()),
    ]

    sql = '''INSERT INTO users(username, email, password_hash, role, created_at)
             VALUES(?,?,?,?,?)'''

    try:
        cur = conn.cursor()
        cur.executemany(sql, users)
        conn.commit()
        print(f"Seeded {len(users)} users")
    except sqlite3.Error as e:
        print(f"Error seeding users: {e}")

def seed_courses(conn):
    """Seed the courses table with sample data."""
    courses = [
        ('Introduction to Forex Trading', 'Learn the basics of forex trading', 1, 99.99, 'published', datetime.now()),
        ('Advanced Technical Analysis', 'Master technical analysis techniques', 1, 149.99, 'published', datetime.now()),
        ('Risk Management Strategies', 'Essential risk management for traders', 1, 79.99, 'draft', datetime.now()),
        ('Cryptocurrency Trading', 'Trading digital currencies', 1, 129.99, 'published', datetime.now()),
    ]

    sql = '''INSERT INTO courses(title, description, instructor_id, price, status, created_at)
             VALUES(?,?,?,?,?,?)'''

    try:
        cur = conn.cursor()
        cur.executemany(sql, courses)
        conn.commit()
        print(f"Seeded {len(courses)} courses")
    except sqlite3.Error as e:
        print(f"Error seeding courses: {e}")

def seed_trading_strategies(conn):
    """Seed the trading_strategies table with sample data."""
    strategies = [
        ('Moving Average Crossover', 'Simple MA crossover strategy', 'Technical', 'beginner', 1, datetime.now()),
        ('RSI Divergence', 'RSI divergence trading strategy', 'Technical', 'intermediate', 1, datetime.now()),
        ('Support Resistance Breakout', 'Breakout trading strategy', 'Technical', 'advanced', 1, datetime.now()),
        ('News Trading', 'Trading based on economic news', 'Fundamental', 'intermediate', 1, datetime.now()),
    ]

    sql = '''INSERT INTO trading_strategies(name, description, category, difficulty, instructor_id, created_at)
             VALUES(?,?,?,?,?,?)'''

    try:
        cur = conn.cursor()
        cur.executemany(sql, strategies)
        conn.commit()
        print(f"Seeded {len(strategies)} trading strategies")
    except sqlite3.Error as e:
        print(f"Error seeding trading strategies: {e}")

def seed_backtests(conn):
    """Seed the backtests table with sample data."""
    backtests = []
    for i in range(10):
        start_date = datetime.now() - timedelta(days=random.randint(30, 365))
        end_date = start_date + timedelta(days=random.randint(30, 180))
        backtests.append((
            f'Backtest {i+1}',
            random.randint(1, 4),  # strategy_id
            start_date,
            end_date,
            random.uniform(-20, 50),  # total_return
            random.uniform(5, 25),    # max_drawdown
            random.uniform(0.5, 2.5), # sharpe_ratio
            random.randint(50, 500),  # total_trades
            'completed',
            datetime.now()
        ))

    sql = '''INSERT INTO backtests(name, strategy_id, start_date, end_date, total_return, max_drawdown, sharpe_ratio, total_trades, status, created_at)
             VALUES(?,?,?,?,?,?,?,?,?,?)'''

    try:
        cur = conn.cursor()
        cur.executemany(sql, backtests)
        conn.commit()
        print(f"Seeded {len(backtests)} backtests")
    except sqlite3.Error as e:
        print(f"Error seeding backtests: {e}")

def main():
    """Main function to run the seeding script."""
    # Determine database path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    db_path = os.path.join(project_root, 'data', 'app.db')

    # Create database connection
    conn = create_connection(db_path)

    if conn is not None:
        try:
            # Seed all tables
            seed_users(conn)
            seed_courses(conn)
            seed_trading_strategies(conn)
            seed_backtests(conn)

            print("Database seeding completed successfully!")
        except Exception as e:
            print(f"Error during seeding: {e}")
        finally:
            conn.close()
    else:
        print("Error! Cannot create the database connection.")
        sys.exit(1)

if __name__ == '__main__':
    main()