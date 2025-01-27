FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev \
    lsb-release \
    zip \
    unzip \
    curl \
    nginx \
    && docker-php-ext-install pdo pdo_mysql

RUN apt-get update && apt-get install -y default-mysql-client default-libmysqlclient-dev


COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
CMD ["chmod", "+x", "/var/www/html/scripts/entrypoint.sh"]
CMD ["chmod", "+x", "/var/www/html/scripts/run_migrations.sh"]

EXPOSE 9000
CMD ["php-fpm", "-D"]
CMD ["nginx", "-g", "daemon off;"]
