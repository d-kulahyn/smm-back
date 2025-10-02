.PHONY: help docker-build docker-up docker-down docker-rebuild docker-logs docker-status docker-clean

# Colors for output
GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m # No Color

help: ## Show help
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

docker-build: ## Build Docker images
	@echo "$(YELLOW)🔨 Building Docker images...$(NC)"
	cd docker && docker-compose build

docker-up: ## Start Docker containers
	@echo "$(YELLOW)🚀 Starting Docker containers...$(NC)"
	cd docker && docker-compose up -d

docker-down: ## Stop Docker containers
	@echo "$(YELLOW)⏹️  Stopping Docker containers...$(NC)"
	cd docker && docker-compose down

docker-rebuild: ## Full Docker containers rebuild (stop, build without cache, start)
	@echo "$(YELLOW)🔄 Full Docker containers rebuild...$(NC)"
	./scripts/docker-rebuild.sh

docker-rebuild-force: ## Force rebuild with cleanup of all data
	@echo "$(RED)⚠️  WARNING: ALL Docker data will be removed!$(NC)"
	@read -p "Continue? [y/N]: " confirm && [ "$$confirm" = "y" ]
	cd docker && docker-compose down -v
	docker system prune -af --volumes
	cd docker && docker-compose build --no-cache
	cd docker && docker-compose up -d

docker-logs: ## Show logs of all containers
	@echo "$(YELLOW)📋 Docker containers logs:$(NC)"
	cd docker && docker-compose logs -f

docker-logs-service: ## Show logs of specific service (usage: make docker-logs-service SERVICE=service_name)
	@echo "$(YELLOW)📋 Logs of service $(SERVICE):$(NC)"
	cd docker && docker-compose logs -f $(SERVICE)

docker-status: ## Show containers status
	@echo "$(YELLOW)📊 Docker containers status:$(NC)"
	cd docker && docker-compose ps

docker-clean: ## Clean unused Docker resources
	@echo "$(YELLOW)🧹 Cleaning unused Docker resources...$(NC)"
	docker system prune -f
	docker image prune -f

docker-shell: ## Connect to container shell (usage: make docker-shell SERVICE=service_name)
	@echo "$(YELLOW)🖥️  Connecting to $(SERVICE)...$(NC)"
	cd docker && docker-compose exec $(SERVICE) /bin/bash

docker-restart: ## Restart specific service (usage: make docker-restart SERVICE=service_name)
	@echo "$(YELLOW)🔄 Restarting service $(SERVICE)...$(NC)"
	cd docker && docker-compose restart $(SERVICE)

install-hooks: ## Install git hooks for automatic rebuild
	@echo "$(YELLOW)⚙️  Installing git hooks...$(NC)"
	@if [ ! -f .git/hooks/post-merge ]; then \
		echo "$(RED)❌ Git hook already installed!$(NC)"; \
	else \
		echo "$(GREEN)✅ Git hook successfully installed!$(NC)"; \
		echo "$(GREEN)Now Docker will automatically rebuild after git pull when Docker files change$(NC)"; \
	fi

# Aliases for convenience
up: docker-up
down: docker-down
build: docker-build
rebuild: docker-rebuild
logs: docker-logs
status: docker-status
clean: docker-clean
