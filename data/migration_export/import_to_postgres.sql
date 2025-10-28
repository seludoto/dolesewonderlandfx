-- PostgreSQL Data Import Script for DoleSe Wonderland FX
-- Run this script after deploying to Digital Ocean to import your data

-- Note: This script assumes the database schema is already created by the application
-- Make sure to run the application first to create all tables

-- Import users
\COPY users(id, username, email, first_name, last_name, subscription_tier, created_at, last_login, is_active)
FROM 'users.json'
WITH (FORMAT json);

-- Import courses
\COPY courses(id, title, description, instructor, price, duration_hours, level, created_at, updated_at, is_published)
FROM 'courses.json'
WITH (FORMAT json);

-- Import trades
\COPY trades(id, user_id, symbol, asset_type, entry_price, exit_price, quantity, contract_size, leverage_used, profit_loss, entry_time, exit_time, strategy, notes, stop_loss, take_profit)
FROM 'trades.json'
WITH (FORMAT json);

-- Import paper trading accounts
\COPY paper_trading_accounts(id, user_id, balance, initial_balance, account_currency, leverage, margin_used, equity, free_margin, total_pnl, created_at, status, allowed_asset_types)
FROM 'paper_trading_accounts.json'
WITH (FORMAT json);

-- Import backtests
\COPY backtests(id, name, strategy_id, start_date, end_date, total_return, max_drawdown, sharpe_ratio, total_trades, status, created_at, user_id, symbol, initial_balance, final_balance)
FROM 'backtests.json'
WITH (FORMAT json);

COMMIT;
