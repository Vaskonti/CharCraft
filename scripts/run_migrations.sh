#!/bin/bash
if [ ! -f .env ]; then
    echo "❌ Environment file not found!"
    exit 1
fi
source .env  # Load environment variables
MIGRATIONS_DIR="backend/migrations/up"

# Check if MySQL is accessible
if ! command -v mysql &> /dev/null; then
    echo "❌ Error: MySQL is not installed or not in the system PATH."
    exit 1
fi

# Create the database if it does not exist
echo "🚀 Checking if database '$DB_DATABASE' exists..."
DB_EXISTS=$(mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" -se "SHOW DATABASES LIKE '$DB_DATABASE';")

if [ -z "$DB_EXISTS" ]; then
    echo "Database '$DB_DATABASE' not found. Creating..."
    mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "CREATE DATABASE $DB_DATABASE;"
    echo "✅  Database '$DB_DATABASE' created successfully."
else
    echo "✅  Database '$DB_DATABASE' already exists."
    echo "Do you want to drop the database '$DB_DATABASE' and create a new one? [Y/n])"
        read -r response
        if [[ "$response" =~ ^([nN][oO]|[nN])$ ]]; then
            echo "❌ Aborting..."
            exit 1
        fi
        mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "DROP DATABASE $DB_DATABASE;"
        mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "CREATE DATABASE $DB_DATABASE;"
fi


if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "❌ Migrations directory not found!"
    exit 1
fi

# Run all SQL files in the migrations directory sorted by name
for sql_file in $(find "$MIGRATIONS_DIR"/*.sql | sort); do
    if [ -f "$sql_file" ]; then
        echo "🚀 Running migration: $sql_file"
        mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" < "$sql_file"
        mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" -e "INSERT INTO migrations_log (filename) VALUES ('$sql_file');"
        echo "✅  Migration completed: $sql_file"
    fi
done
echo "✅  All migrations executed successfully!"

