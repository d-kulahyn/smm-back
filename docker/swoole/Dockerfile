FROM php:8.2-cli-alpine

# Install system dependencies for OpenSwoole
RUN apk update && apk add --no-cache \
    bash \
    curl \
    git \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-dev \
    postgresql-client \
    supervisor \
    autoconf \
    gcc \
    g++ \
    make \
    linux-headers \
    openssl-dev \
    pcre-dev \
    icu-dev \
    nodejs \
    npm \
    && rm -rf /var/cache/apk/*

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_pgsql \
    pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    opcache \
    sockets \
    intl

# Install OpenSwoole extension (latest version)
RUN pecl install openswoole-25.2.0 \
    && docker-php-ext-enable openswoole

# Install Redis extension for caching
RUN pecl install redis \
    && docker-php-ext-enable redis

# Install and configure Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create project directory and install chokidar locally as well (fallback)
WORKDIR /var/www/html

RUN npm i chokidar


# Configure OPcache for maximum performance
#RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
#    && echo "opcache.enable_cli=1" >> /usr/local/etc/php/conf.d/opcache.ini \
#    && echo "opcache.memory_consumption=512" >> /usr/local/etc/php/conf.d/opcache.ini \
#    && echo "opcache.interned_strings_buffer=64" >> /usr/local/etc/php/conf.d/opcache.ini \
#    && echo "opcache.max_accelerated_files=20000" >> /usr/local/etc/php/conf.d/opcache.ini \
#    && echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/opcache.ini \
#    && echo "opcache.save_comments=0" >> /usr/local/etc/php/conf.d/opcache.ini \
#    && echo "opcache.fast_shutdown=1" >> /usr/local/etc/php/conf.d/opcache.ini


RUN pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.client_host = host.docker.internal" >> /usr/local/etc/php/conf.d/xdebug.ini

# Configure PHP for high performance
RUN echo "memory_limit=1G" >> /usr/local/etc/php/conf.d/performance.ini \
    && echo "max_execution_time=0" >> /usr/local/etc/php/conf.d/performance.ini \
    && echo "max_input_vars=5000" >> /usr/local/etc/php/conf.d/performance.ini \
    && echo "post_max_size=100M" >> /usr/local/etc/php/conf.d/performance.ini \
    && echo "upload_max_filesize=100M" >> /usr/local/etc/php/conf.d/performance.ini

# Special settings for OpenSwoole
RUN echo "openswoole.use_shortname=Off" >> /usr/local/etc/php/conf.d/openswoole.ini \
    && echo "openswoole.unixsock_buffer_size=262144" >> /usr/local/etc/php/conf.d/openswoole.ini \
    && echo "openswoole.socket_buffer_size=131072" >> /usr/local/etc/php/conf.d/openswoole.ini

# Configure permissions for www-data (Alpine Linux compatible commands)
RUN addgroup -g 1000 -S www-data || true \
    && adduser -u 1000 -D -S -G www-data www-data || true

COPY startup.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/startup.sh

# Healthcheck for OpenSwoole
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080 || exit 1

# Start
CMD ["/usr/local/bin/startup.sh"]
