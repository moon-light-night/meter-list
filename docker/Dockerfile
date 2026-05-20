FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM nginx:1.27-alpine AS production

COPY nginx/nginx.conf /etc/nginx/templates/default.conf.template
COPY docker/check-env.sh /docker-entrypoint.d/00-check-env.sh
COPY --from=build /app/dist /usr/share/nginx/html

RUN chmod +x /docker-entrypoint.d/00-check-env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
