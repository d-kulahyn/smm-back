FROM nginx:1.25-alpine

RUN apk add --no-cache curl wget

RUN mkdir -p /tmp/nginx_cache /tmp/nginx_proxy_cache /tmp/nginx_api_cache /tmp/nginx_fastcgi_cache \
    && mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp \
    && mkdir -p /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp \
    && mkdir -p /var/cache/nginx/scgi_temp

RUN chown -R nginx:nginx /tmp/nginx* /var/cache/nginx /var/log/nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY split_trip.conf /etc/nginx/conf.d/default.conf
COPY fastcgi.conf /etc/nginx/fastcgi.conf

RUN addgroup -g 1001 -S www && \
    adduser -u 1001 -D -S -G www www

EXPOSE 80 443

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/nginx_health || exit 1

CMD ["nginx", "-g", "daemon off;"]
