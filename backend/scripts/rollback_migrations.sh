#!/bin/bash

#!/bin/bash
if [ ! -f .env ]; then
    echo "❌ Environment file not found!"
    exit 1
fi
source .env  # Load environment variables
MIGRATIONS_DIR="backend/migrations/down"

# Check if MySQL is accessible
if ! command -v mysql &> /dev/null; then
    echo "❌ Error: MySQL is not installed or not in the system PATH."
    exit 1
fi

# Function to list executed migrations
list_migrations() {
    mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" -se "SELECT filename FROM migrations_log ORDER BY executed_at DESC;" | nl
}

# Function to rollback a specific migration
rollback_migration() {
    local migration="$1"
    migration=$(echo "$migration" | cut -d '/' -f 4)  # Remove leading/trailing whitespace

    # Check if rollback script exists
    rollback_file="$MIGRATIONS_DIR/${migration}"
    if [ -f "$rollback_file" ]; then
        echo "Rolling back: $migration"
        mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" < "$rollback_file"
        mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" -e "DELETE FROM migrations_log WHERE filename='$migration';"
        echo "✅  Migration $migration rolled back successfully!"
    else
        echo "❌  No rollback script found for $migration."
    fi
}
get_migration_by_number() {
    local num="$1"
    mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" -se "SELECT filename FROM migrations_log ORDER BY executed_at DESC LIMIT 1 OFFSET $((num-1));"
}

# User Menu
echo "Select rollback option:"
echo "1) Rollback last migration"
echo "2) Rollback all migrations"
echo "3) Choose a migration to rollback"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        last_migration=$(list_migrations | head -n 1)
        if [ -n "$last_migration" ]; then
            rollback_migration "$last_migration"
        else
            echo "No migrations to rollback."
        fi
        ;;
    2)
        for migration in $(mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" -se "SELECT filename FROM migrations_log ORDER BY executed_at DESC;"); do
                    rollback_migration "$migration"
        done
        ;;
    3)
        echo "Available migrations to rollback:"
        if [[ $(list_migrations) ]]; then
          echo "Available migrations to rollback:"
          list_migrations
        else
            echo "No migrations to rollback."
            exit 1
        fi
        read -p "Enter the number of the migration to rollback: " selected_number
        selected_migration=$(get_migration_by_number "$selected_number")
        rollback_migration "$selected_migration"
        ;;
    *)
        echo "Invalid option."
        ;;
esac
