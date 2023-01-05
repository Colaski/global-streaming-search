FROM alpine:3.16

EXPOSE 8000/tcp

RUN apk update \
  && apk add npm nginx

ADD . "/app"

RUN cd /app \
  # Build the app
  && npm install \
  && API_PROXY='/api' npm run build \
  # Save the build so nginx can serve it
  && cp -r /app/public /var/www/ \
  # Add the nginx configuration
  && cp /app/docker/nginx.conf /etc/nginx/nginx.conf \
  # Create a directory for nginx to cache API responses
  && mkdir -p /var/cache/nginx \
  # We don't need to keep the app files after we have the build
  && rm -rf /app \
  # We don't need npm after we have the build
  && apk del npm \
  # We also don't need the apk cache, we won't be installing any more packages
  && rm -rf /var/cache/apk/

CMD ["nginx", "-g", "daemon off;"]