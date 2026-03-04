.PHONY: dev smoke clean help

help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-30s\033[0m %s\n", $$1, $$2}'

dev: ## Open the module in browser
	open index.html

smoke: ## Run E2E smoke test (requires Docker for backend)
	@bash scripts/smoke-test.sh

clean: ## Clean up
	@echo "Nothing to clean for static modules"
