# Makefile cho Booking System Microservices
# Sử dụng để quản lý proto files và development workflow

.PHONY: help proto-generate proto-lint proto-format proto-breaking proto-validate proto-clean build-go build-ts build-all test-all clean-all

# Default target
help:
	@echo "🚀 Booking System Microservices - Available Commands:"
	@echo ""
	@echo "📦 Proto Management:"
	@echo "  proto-generate    Generate proto files for TypeScript and Go"
	@echo "  proto-lint        Lint proto files"
	@echo "  proto-format      Format proto files"
	@echo "  proto-breaking    Check for breaking changes"
	@echo "  proto-validate    Full proto validation (lint + format + breaking + generate)"
	@echo "  proto-clean       Clean generated proto files"
	@echo ""
	@echo "🔨 Build Commands:"
	@echo "  build-go          Build Go services"
	@echo "  build-ts          Build TypeScript services"
	@echo "  build-all         Build all services"
	@echo ""
	@echo "🧪 Testing:"
	@echo "  test-all          Run all tests"
	@echo ""
	@echo "🧹 Cleanup:"
	@echo "  clean-all         Clean all generated files"

# Proto file management
proto-generate:
	@echo "⚙️ Generating proto files..."
	cd libs/proto-definitions && buf generate

proto-lint:
	@echo "📋 Linting proto files..."
	cd libs/proto-definitions && buf lint

proto-format:
	@echo "🎨 Formatting proto files..."
	cd libs/proto-definitions && buf format -w

proto-breaking:
	@echo "🚨 Checking for breaking changes..."
	cd libs/proto-definitions && buf breaking --against '.git#branch=main'

proto-validate: proto-lint proto-format proto-breaking proto-generate
	@echo "✅ Proto validation completed!"

proto-clean:
	@echo "🧹 Cleaning generated proto files..."
	rm -rf libs/proto-definitions/src/generated
	rm -rf apps/ticket-service/proto

# Build commands
build-go:
	@echo "🔨 Building Go services..."
	cd apps/ticket-service && go build -v ./...

build-ts:
	@echo "🔨 Building TypeScript services..."
	npm run build

build-all: proto-generate build-go build-ts
	@echo "✅ All services built successfully!"



# Testing
test-all:
	@echo "🧪 Running all tests..."
	npm test
	cd apps/ticket-service && go test ./...

# Cleanup
clean-all: proto-clean
	@echo "🧹 Cleaning all generated files..."
	rm -rf node_modules
	rm -rf dist
	rm -rf apps/*/dist
	rm -rf apps/*/node_modules
	cd apps/ticket-service && go clean -cache

# Development helpers
dev-setup:
	@echo "🚀 Setting up development environment..."
	npm install
	cd apps/ticket-service && go mod tidy
	proto-generate
	@echo "✅ Development environment ready!"

# Quick proto update (most common workflow)
proto-update: proto-validate
	@echo "📝 Proto files updated successfully!"
	@echo "💡 Don't forget to commit generated files if needed." 