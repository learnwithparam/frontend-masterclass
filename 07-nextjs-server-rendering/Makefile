.PHONY: setup dev smoke clean help

help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-30s\033[0m %s\n", $$1, $$2}'

setup: ## Install dependencies
	npm install

dev: ## Run the dev server (starts backend automatically)
	@bash ../scripts/dev-with-backend.sh ../../backend-masterclass/05-auth-and-security "npm run dev"

smoke: ## Run E2E smoke test
	@bash scripts/smoke-test.sh

clean: ## Remove node_modules
	rm -rf node_modules .next
