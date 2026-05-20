COMPOSE = docker compose --env-file .env -f docker/docker-compose.yml

.PHONY: up down restart logs build rebuild ps

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) down
	$(COMPOSE) up -d --build

logs:
	$(COMPOSE) logs -f frontend

build:
	$(COMPOSE) build

rebuild:
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d

ps:
	$(COMPOSE) ps