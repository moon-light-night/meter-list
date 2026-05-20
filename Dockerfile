FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM nginx:1.27-alpine AS production

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

RUN printf '%s\n' \
    '#!/bin/sh' \
    'set -eu' \
    ': "${VITE_APP_API_URL:?Error: VITE_APP_API_URL environment variable is required}"' \
    > /docker-entrypoint.d/00-check-env.sh \
    && chmod +x /docker-entrypoint.d/00-check-env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]