#!/bin/bash

php /var/www/html/migrations/up/0001_create_migrations_log_table.php
php /var/www/html/migrations/up/0002_create_tables.php
php /var/www/html/migrations/up/0003_add_dummy_data.php