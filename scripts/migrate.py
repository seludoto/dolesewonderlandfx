#!/usr/bin/env python3
"""
Database migration script for DoleSe Wonderland FX platform.
This script manages database schema changes and migrations.
"""

import os
import sys
import sqlite3
from datetime import datetime

def create_connection(db_file):
    """Create a database connection to the SQLite database."""
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        print(f"Connected to {db_file}")
    except sqlite3.Error as e:
        print(e)
    return conn

def create_migrations_table(conn):
    """Create the migrations table if it doesn't exist."""
    sql = '''CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
             )'''
    try:
        cur = conn.cursor()
        cur.execute(sql)
        conn.commit()
        print("Migrations table created/verified")
    except sqlite3.Error as e:
        print(f"Error creating migrations table: {e}")

def get_applied_migrations(conn):
    """Get list of applied migrations."""
    sql = 'SELECT name FROM migrations ORDER BY id'
    try:
        cur = conn.cursor()
        cur.execute(sql)
        return [row[0] for row in cur.fetchall()]
    except sqlite3.Error as e:
        print(f"Error getting applied migrations: {e}")
        return []

def apply_migration(conn, migration_file):
    """Apply a single migration."""
    migration_name = os.path.basename(migration_file)

    # Read migration SQL
    try:
        with open(migration_file, 'r') as f:
            sql = f.read()
    except IOError as e:
        print(f"Error reading migration file {migration_file}: {e}")
        return False

    try:
        # Execute migration
        cur = conn.cursor()
        cur.executescript(sql)
        conn.commit()

        # Record migration
        cur.execute('INSERT INTO migrations (name) VALUES (?)', (migration_name,))
        conn.commit()

        print(f"Applied migration: {migration_name}")
        return True
    except sqlite3.Error as e:
        print(f"Error applying migration {migration_name}: {e}")
        conn.rollback()
        return False

def run_migrations(db_path, migrations_dir):
    """Run all pending migrations."""
    conn = create_connection(db_path)

    if conn is not None:
        try:
            # Create migrations table
            create_migrations_table(conn)

            # Get applied migrations
            applied = get_applied_migrations(conn)

            # Get all migration files
            if not os.path.exists(migrations_dir):
                print(f"Migrations directory {migrations_dir} does not exist")
                return

            migration_files = [f for f in os.listdir(migrations_dir)
                             if f.endswith('.sql') and f not in applied]
            migration_files.sort()

            if not migration_files:
                print("No pending migrations")
                return

            # Apply pending migrations
            applied_count = 0
            for migration_file in migration_files:
                migration_path = os.path.join(migrations_dir, migration_file)
                if apply_migration(conn, migration_path):
                    applied_count += 1
                else:
                    print(f"Failed to apply migration: {migration_file}")
                    break

            print(f"Applied {applied_count} migrations")

        except Exception as e:
            print(f"Error during migration: {e}")
        finally:
            conn.close()
    else:
        print("Error! Cannot create the database connection.")
        sys.exit(1)

def create_migration_template(name):
    """Create a new migration template."""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"{timestamp}_{name}.sql"

    template = f"""-- Migration: {name}
-- Created: {datetime.now().isoformat()}

-- Add your migration SQL here

-- Example:
-- CREATE TABLE example (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- INSERT INTO example (name) VALUES ('Sample Data');
"""

    return filename, template

def main():
    """Main function to run the migration script."""
    if len(sys.argv) < 2:
        print("Usage: python migrate.py <command> [options]")
        print("Commands:")
        print("  up                    - Run all pending migrations")
        print("  create <name>         - Create a new migration template")
        print("  status               - Show migration status")
        sys.exit(1)

    command = sys.argv[1]

    # Determine paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    db_path = os.path.join(project_root, 'data', 'app.db')
    migrations_dir = os.path.join(project_root, 'data', 'migrations')

    if command == 'up':
        run_migrations(db_path, migrations_dir)
    elif command == 'create':
        if len(sys.argv) < 3:
            print("Error: Migration name required")
            sys.exit(1)
        name = sys.argv[2]
        filename, template = create_migration_template(name)

        # Ensure migrations directory exists
        os.makedirs(migrations_dir, exist_ok=True)

        migration_path = os.path.join(migrations_dir, filename)
        try:
            with open(migration_path, 'w') as f:
                f.write(template)
            print(f"Created migration: {migration_path}")
        except IOError as e:
            print(f"Error creating migration file: {e}")
    elif command == 'status':
        conn = create_connection(db_path)
        if conn is not None:
            try:
                applied = get_applied_migrations(conn)
                print(f"Applied migrations ({len(applied)}):")
                for migration in applied:
                    print(f"  ✓ {migration}")

                # Show pending migrations
                if os.path.exists(migrations_dir):
                    all_files = [f for f in os.listdir(migrations_dir) if f.endswith('.sql')]
                    pending = [f for f in all_files if f not in applied]
                    if pending:
                        print(f"\nPending migrations ({len(pending)}):")
                        for migration in sorted(pending):
                            print(f"  ○ {migration}")
                    else:
                        print("\nNo pending migrations")
                else:
                    print(f"\nMigrations directory {migrations_dir} does not exist")

            except Exception as e:
                print(f"Error getting migration status: {e}")
            finally:
                conn.close()
        else:
            print("Error! Cannot create the database connection.")
    else:
        print(f"Unknown command: {command}")

if __name__ == '__main__':
    main()