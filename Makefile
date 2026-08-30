# PulseAI Club site — local development helpers for the Jekyll build.
# GitHub Pages renders the site itself on push; these targets are just
# convenience for previewing locally (see README "Local development").

.PHONY: help build serve check clean

PORT ?= 4000

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) \
		| awk -F':.*?## ' '{printf "  %-8s %s\n", $$1, $$2}'

build: ## Build the site into _site/
	jekyll build

serve: ## Serve locally at http://localhost:$(PORT)
	jekyll serve --port $(PORT)

check: build ## Build once to verify everything compiles

clean: ## Remove generated output (_site/, .jekyll-cache/)
	jekyll clean
