#!/bin/bash

cp .env.example .env
composer install
./scripts/run_migrations.sh
nginx -g "daemon off;"