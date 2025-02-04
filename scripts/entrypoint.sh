#!/bin/bash

php /var/www/html/migrations/up/0001_create_migrations_log_table.php
printf "\n✅  Migrations log table created \n";
php /var/www/html/migrations/up/0002_create_tables.php
printf "\n✅  Tables created\n"
php /var/www/html/migrations/up/0003_add_dummy_data.php
printf "\n✅  Dummy data added\n"

exec php-fpm -D