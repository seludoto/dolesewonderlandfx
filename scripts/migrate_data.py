#!/usr/bin/env python3
"""
Data Migration Script for DoleSe Wonderland FX
Migrates data from local SQLite database to production PostgreSQL format
"""

import os
import sys
import sqlite3
import json
from datetime import datetime
import csv

def create_connection(db_file):
    """Create a database connection to the SQLite database."""
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        print(f"Connected to {db_file}")
    except sqlite3.Error as e:
        print(e)
    return conn

def export_users(conn, output_dir):
    """Export users data to JSON format."""
    sql = """
    SELECT id, username, email, first_name, last_name, role,
           subscription_tier, created_at, last_login, is_active
    FROM users
    """

    try:
        cur = conn.cursor()
        cur.execute(sql)
        rows = cur.fetchall()

        users_data = []
        for row in rows:
            user = {
                "id": row[0],
                "username": row[1],
                "email": row[2],
                "first_name": row[3] or "",
                "last_name": row[4] or "",
                "subscription_tier": row[5] or "free",
                "created_at": row[6],
                "last_login": row[7],
                "is_active": bool(row[8])
            }
            users_data.append(user)

        # Write to JSON file
        with open(os.path.join(output_dir, 'users.json'), 'w') as f:
            json.dump(users_data, f, indent=2, default=str)

        print(f"Exported {len(users_data)} users")

    except sqlite3.Error as e:
        print(f"Error exporting users: {e}")

def export_trades(conn, output_dir):
    """Export trades data to JSON format."""
    sql = """
    SELECT id, user_id, symbol, asset_type, entry_price, exit_price,
           quantity, contract_size, leverage_used, profit_loss,
           entry_time, exit_time, strategy, notes, stop_loss, take_profit
    FROM trades
    """

    try:
        cur = conn.cursor()
        cur.execute(sql)
        rows = cur.fetchall()

        trades_data = []
        for row in rows:
            trade = {
                "id": row[0],
                "user_id": row[1],
                "symbol": row[2],
                "asset_type": row[3],
                "entry_price": float(row[4]) if row[4] else 0,
                "exit_price": float(row[5]) if row[5] else 0,
                "quantity": float(row[6]) if row[6] else 0,
                "contract_size": float(row[7]) if row[7] else 1,
                "leverage_used": int(row[8]) if row[8] else 1,
                "profit_loss": float(row[9]) if row[9] else 0,
                "entry_time": row[10],
                "exit_time": row[11],
                "strategy": row[12] or "",
                "notes": row[13] or "",
                "stop_loss": float(row[14]) if row[14] else 0,
                "take_profit": float(row[15]) if row[15] else 0
            }
            trades_data.append(trade)

        # Write to JSON file
        with open(os.path.join(output_dir, 'trades.json'), 'w') as f:
            json.dump(trades_data, f, indent=2, default=str)

        print(f"Exported {len(trades_data)} trades")

    except sqlite3.Error as e:
        print(f"Error exporting trades: {e}")

def export_courses(conn, output_dir):
    """Export courses data to JSON format."""
    sql = """
    SELECT id, title, description, instructor_id, price, duration_hours,
           level, created_at, updated_at, is_published
    FROM courses
    """

    try:
        cur = conn.cursor()
        cur.execute(sql)
        rows = cur.fetchall()

        courses_data = []
        for row in rows:
            course = {
                "id": row[0],
                "title": row[1],
                "description": row[2],
                "instructor": str(row[3]),
                "price": float(row[4]) if row[4] else 0,
                "duration_hours": int(row[5]) if row[5] else 1,
                "level": row[6] or "beginner",
                "created_at": row[7],
                "updated_at": row[8],
                "is_published": bool(row[9])
            }
            courses_data.append(course)

        # Write to JSON file
        with open(os.path.join(output_dir, 'courses.json'), 'w') as f:
            json.dump(courses_data, f, indent=2, default=str)

        print(f"Exported {len(courses_data)} courses")

    except sqlite3.Error as e:
        print(f"Error exporting courses: {e}")

def export_paper_trading_accounts(conn, output_dir):
    """Export paper trading accounts data to JSON format."""
    sql = """
    SELECT id, user_id, balance, initial_balance, account_currency,
           leverage, margin_used, equity, free_margin, total_pnl,
           created_at, status, allowed_asset_types
    FROM paper_trading_accounts
    """

    try:
        cur = conn.cursor()
        cur.execute(sql)
        rows = cur.fetchall()

        accounts_data = []
        for row in rows:
            account = {
                "id": row[0],
                "user_id": row[1],
                "balance": float(row[2]) if row[2] else 10000,
                "initial_balance": float(row[3]) if row[3] else 10000,
                "account_currency": row[4] or "USD",
                "leverage": int(row[5]) if row[5] else 100,
                "margin_used": float(row[6]) if row[6] else 0,
                "equity": float(row[7]) if row[7] else 10000,
                "free_margin": float(row[8]) if row[8] else 10000,
                "total_pnl": float(row[9]) if row[9] else 0,
                "created_at": row[10],
                "status": row[11] or "active",
                "allowed_asset_types": json.loads(row[12]) if row[12] else ["forex", "stock", "crypto"]
            }
            accounts_data.append(account)

        # Write to JSON file
        with open(os.path.join(output_dir, 'paper_trading_accounts.json'), 'w') as f:
            json.dump(accounts_data, f, indent=2, default=str)

        print(f"Exported {len(accounts_data)} paper trading accounts")

    except sqlite3.Error as e:
        print(f"Error exporting paper trading accounts: {e}")

def export_backtests(conn, output_dir):
    """Export backtests data to JSON format."""
    sql = """
    SELECT id, name, strategy_id, start_date, end_date, total_return,
           max_drawdown, sharpe_ratio, total_trades, status, created_at,
           user_id, symbol, initial_balance, final_balance
    FROM backtests
    """

    try:
        cur = conn.cursor()
        cur.execute(sql)
        rows = cur.fetchall()

        backtests_data = []
        for row in rows:
            backtest = {
                "id": row[0],
                "name": row[1],
                "strategy_id": row[2],
                "start_date": row[3],
                "end_date": row[4],
                "total_return": float(row[5]) if row[5] else 0,
                "max_drawdown": float(row[6]) if row[6] else 0,
                "sharpe_ratio": float(row[7]) if row[7] else 0,
                "total_trades": int(row[8]) if row[8] else 0,
                "status": row[9] or "completed",
                "created_at": row[10],
                "user_id": row[11],
                "symbol": row[12] or "EUR/USD",
                "initial_balance": float(row[13]) if row[13] else 10000,
                "final_balance": float(row[14]) if row[14] else 10000
            }
            backtests_data.append(backtest)

        # Write to JSON file
        with open(os.path.join(output_dir, 'backtests.json'), 'w') as f:
            json.dump(backtests_data, f, indent=2, default=str)

        print(f"Exported {len(backtests_data)} backtests")

    except sqlite3.Error as e:
        print(f"Error exporting backtests: {e}")

def generate_postgres_import_script(output_dir):
    """Generate PostgreSQL import script."""
    script_content = """-- PostgreSQL Data Import Script for DoleSe Wonderland FX
-- Run this script after deploying to Digital Ocean to import your data

-- Note: This script assumes the database schema is already created by the application
-- Make sure to run the application first to create all tables

-- Import users
\\COPY users(id, username, email, first_name, last_name, subscription_tier, created_at, last_login, is_active)
FROM 'users.json'
WITH (FORMAT json);

-- Import courses
\\COPY courses(id, title, description, instructor, price, duration_hours, level, created_at, updated_at, is_published)
FROM 'courses.json'
WITH (FORMAT json);

-- Import trades
\\COPY trades(id, user_id, symbol, asset_type, entry_price, exit_price, quantity, contract_size, leverage_used, profit_loss, entry_time, exit_time, strategy, notes, stop_loss, take_profit)
FROM 'trades.json'
WITH (FORMAT json);

-- Import paper trading accounts
\\COPY paper_trading_accounts(id, user_id, balance, initial_balance, account_currency, leverage, margin_used, equity, free_margin, total_pnl, created_at, status, allowed_asset_types)
FROM 'paper_trading_accounts.json'
WITH (FORMAT json);

-- Import backtests
\\COPY backtests(id, name, strategy_id, start_date, end_date, total_return, max_drawdown, sharpe_ratio, total_trades, status, created_at, user_id, symbol, initial_balance, final_balance)
FROM 'backtests.json'
WITH (FORMAT json);

COMMIT;
"""

    with open(os.path.join(output_dir, 'import_to_postgres.sql'), 'w') as f:
        f.write(script_content)

    print("Generated PostgreSQL import script")

def main():
    """Main function to run the migration script."""
    # Determine paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    db_path = os.path.join(project_root, 'data', 'app.db')
    output_dir = os.path.join(project_root, 'data', 'migration_export')

    # Create output directory
    os.makedirs(output_dir, exist_ok=True)

    # Create database connection
    conn = create_connection(db_path)

    if conn is not None:
        try:
            print("Starting data export from SQLite database...")

            # Export all data
            export_users(conn, output_dir)
            export_trades(conn, output_dir)
            export_courses(conn, output_dir)
            export_paper_trading_accounts(conn, output_dir)
            export_backtests(conn, output_dir)

            # Generate PostgreSQL import script
            generate_postgres_import_script(output_dir)

            print(f"\nData migration completed successfully!")
            print(f"Exported data is available in: {output_dir}")
            print("\nNext steps:")
            print("1. Deploy to Digital Ocean using: bash deploy-do.sh")
            print("2. After deployment, copy the exported JSON files to your server")
            print("3. Run the import_to_postgres.sql script in your PostgreSQL database")

        except Exception as e:
            print(f"Error during migration: {e}")
        finally:
            conn.close()
    else:
        print("Error! Cannot create the database connection.")
        sys.exit(1)

if __name__ == '__main__':
    main()