# Variables
COMPOSE_FILE := .docker/docker-compose.yml

# Default target
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  build       Build the Docker images"
	@echo "  up          Start the containers"
	@echo "  down        Stop and remove the containers"
	@echo "  restart     Restart the containers"
	@echo "  logs        View container logs"
	@echo "  clean       Remove all containers, networks, and volumes"
	@echo "  help        Show this help message"

# Build the Docker images
build:
	docker-compose -f $(COMPOSE_FILE) build --no-cache

# Start the containers
up:
	docker-compose -f $(COMPOSE_FILE) up -d

# Stop and remove the containers
down:
	docker-compose -f $(COMPOSE_FILE) down

# Restart the containers
restart:
	docker-compose -f $(COMPOSE_FILE) restart

# View container logs
logs:
	docker-compose -f $(COMPOSE_FILE) logs -f

# Clean up everything
clean:
	docker-compose -f $(COMPOSE_FILE) down -v --remove-orphans
	docker system prune -a --volumes

.PHONY: help build up down restart logs clean
