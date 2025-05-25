FROM php:8.2-cli

# Instala dependencias
RUN apt-get update && apt-get install -y \
    unzip \
    curl \
    libzip-dev \
    zip \
    git \
    && docker-php-ext-install pdo_mysql zip

# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

EXPOSE 8000
