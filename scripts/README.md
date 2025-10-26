# Developer Scripts

This directory contains utility scripts for development, deployment, and maintenance of the DoleSe Wonderland FX platform.

## Scripts Overview

### Database Scripts

#### `seed_database.py`

Seeds the database with initial development data.

**Usage:**

```bash
python scripts/seed_database.py
```

**What it does:**

- Creates sample users (regular users, instructors, admins)
- Adds sample courses and trading strategies
- Generates mock backtest data
- Populates the database for development/testing

#### `migrate.py`

Manages database schema migrations.

**Usage:**

```bash
# Run all pending migrations
python scripts/migrate.py up

# Create a new migration
python scripts/migrate.py create migration_name

# Check migration status
python scripts/migrate.py status
```

**Commands:**

- `up`: Apply all pending migrations
- `create <name>`: Create a new migration template
- `status`: Show applied and pending migrations

### Code Generation Scripts

#### `generate.py`

Generates boilerplate code for common patterns.

**Usage:**

```bash
# Generate API endpoints
python scripts/generate.py api users GET,POST,PUT,DELETE

# Generate SQLAlchemy model
python scripts/generate.py model user id:int,name:str,email:str,created_at:datetime

# Generate Pydantic schema
python scripts/generate.py schema user id:int,name:str,email:str,created_at:datetime

# Generate React component
python scripts/generate.py component UserCard functional
```

**Supported Types:**

- `api`: FastAPI route handlers
- `model`: SQLAlchemy database models
- `schema`: Pydantic validation schemas
- `component`: React UI components

## Migration Files

Database migration files should be placed in `data/migrations/` and follow the naming convention:

```
YYYYMMDD_HHMMSS_migration_name.sql
```

Example migration file:

```sql
-- Migration: add_user_preferences
-- Created: 2024-01-15T10:30:00

ALTER TABLE users ADD COLUMN preferences JSON DEFAULT '{}';
CREATE INDEX idx_users_preferences ON users USING GIN (preferences);
```

## Best Practices

### Database Operations

- Always backup the database before running migrations
- Test migrations on a copy of production data first
- Use descriptive migration names
- Keep migrations small and focused

### Code Generation

- Use generated code as a starting point, not final implementation
- Review and customize generated code for your specific needs
- Follow the project's coding standards and patterns

### Development Workflow

1. Use `migrate.py create` to create new migrations
2. Write SQL migration scripts
3. Test migrations with `migrate.py up`
4. Use `seed_database.py` to populate development data
5. Use `generate.py` to create boilerplate code quickly

## Troubleshooting

### Migration Issues

- If a migration fails, check the SQL syntax
- Ensure all referenced tables/columns exist
- Check database permissions

### Code Generation Issues

- Verify the output directory exists and is writable
- Check that all required dependencies are available
- Review generated code for syntax errors

### Database Seeding Issues

- Ensure the database schema is up to date
- Check foreign key constraints
- Verify data types match the schema

## Contributing

When adding new scripts:

1. Include comprehensive documentation
2. Add error handling and validation
3. Follow the existing code style
4. Update this README with usage examples
