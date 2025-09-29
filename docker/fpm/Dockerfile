FROM php:8.2-fpm-alpine

RUN apk update && apk add --no-cache \
    bash \
    curl \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    libwebp-dev \
    libxpm-dev \
    libzip-dev \
    postgresql-dev \
    zlib-dev \
    libxml2-dev \
    libxslt-dev \
    supervisor \
    && rm -rf /var/cache/apk/*

RUN docker-php-ext-configure gd --with-freetype --with-jpeg

RUN docker-php-ext-install -j$(nproc) \
    gd \
    zip \
    opcache \
    intl \
    bcmath

RUN docker-php-ext-install -j$(nproc) \
    pdo_pgsql \
    pgsql

RUN docker-php-ext-install -j$(nproc) \
    xml

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN addgroup -g 1000 -S www && \
    adduser -u 1000 -D -S -G www www

RUN sed -i 's/user = www-data/user = www/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/group = www-data/group = www/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/listen.owner = www-data/listen.owner = www/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/listen.group = www-data/listen.group = www/' /usr/local/etc/php-fpm.d/www.conf

COPY php.ini /usr/local/etc/php/conf.d/custom.ini

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

WORKDIR /var/www/html

RUN mkdir -p /var/log/supervisor /run/php

RUN chown -R www:www /var/www/html /var/log/supervisor /run/php

EXPOSE 9000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
