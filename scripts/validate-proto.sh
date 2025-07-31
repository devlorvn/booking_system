#!/bin/bash

# Script để validate và format proto files
# Sử dụng buf để lint, format và check breaking changes

set -e

echo "🔍 Validating proto files..."

# Di chuyển đến thư mục proto-definitions
cd libs/proto-definitions

# Lint proto files
echo "📋 Linting proto files..."
buf lint

# Format proto files
echo "🎨 Formatting proto files..."
buf format -w

# Check for breaking changes (nếu có git history)
if git rev-parse --verify main >/dev/null 2>&1; then
    echo "🚨 Checking for breaking changes..."
    buf breaking --against '.git#branch=main' || {
        echo "❌ Breaking changes detected!"
        echo "Please review the changes and update version if necessary."
        exit 1
    }
fi

# Generate files
echo "⚙️ Generating proto files..."
buf generate

echo "✅ Proto validation completed successfully!"

# Kiểm tra xem có thay đổi gì không
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Changes detected in generated files:"
    git status --porcelain
    echo "💡 Please commit the generated files if needed."
else
    echo "✨ No changes detected in generated files."
fi 