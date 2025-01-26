#!/bin/bash
if [ ! -f .env ]; then
    echo "❌  Environment file not found!"
    exit 1
fi
source .env  # Load environment variables
MIGRATIONS_DIR="/migrations/up"

# Check if MySQL is accessible
if ! command -v mysql &> /dev/null; then
    echo "❌  Error: MySQL is not installed or not in the system PATH."
    exit 1
fi

# Create the Database if it does not exist
echo "🚀  Checking if database '$DB_DATABASE' exists..."
DB_EXISTS=$(mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" -se "SHOW DATABASES LIKE '$DB_DATABASE';")

if [ -z "$DB_EXISTS" ]; then
    echo "Database '$DB_DATABASE' not found. Creating..."
    mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "CREATE DATABASE $DB_DATABASE;"
    echo "✅  Database '$DB_DATABASE' created successfully."
else
    echo "✅  Database '$DB_DATABASE' already exists."
    echo "Do you want to drop the database '$DB_DATABASE' and create a new one? [Y/n])"
        read -r response
        if [[ "$response" =~ ^([yY][oO]|[yY])$ ]]; then
            mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "DROP DATABASE $DB_DATABASE;"
            mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "CREATE DATABASE $DB_DATABASE;"
        fi
fi


if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "❌  Migrations directory not found!"
    exit 1
fi

# Function to check if migration has already been run
migration_already_ran() {
    local migration="$1"
    result=$(mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" -se "SELECT COUNT(*) FROM migrations_log WHERE filename='$migration';")
    if [ "$result" -gt 0 ]; then
        return 0  # Migration already ran
    else
        return 1  # Migration has not run yet
    fi
}

# Run migrations in lexicographical order
for migration in $(find "$MIGRATIONS_DIR"/*.sql | sort); do
    filename=$(basename "$migration")

    if migration_already_ran "$filename"; then
        echo "🔹 Skipping $filename (already executed)"
    else
        echo "🚀 Running migration: $filename"
        mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" < "$migration"

        # Log the migration as executed
        mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" -e "INSERT INTO migrations_log (filename) VALUES ('$filename');"

        echo "✅  Migration $filename executed successfully!"
    fi
done
echo "✅  All migrations executed successfully!"

