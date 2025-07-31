#!/bin/bash

# Script để generate proto files cho microservice architecture
# Sử dụng buf để generate code từ proto definitions

echo "🚀 Generating proto files..."

# Di chuyển đến thư mục proto-definitions
cd libs/proto-definitions

# Generate files cho TypeScript (NestJS) và Go
echo "📦 Generating TypeScript files..."
buf generate

echo "✅ Proto files generated successfully!"

# Kiểm tra xem có lỗi gì không
if [ $? -eq 0 ]; then
    echo "🎉 All proto files generated successfully!"
    echo "📁 TypeScript files: libs/proto-definitions/src/generated/"
    echo "📁 Go files: apps/ticket-service/proto/"
else
    echo "❌ Error generating proto files"
    exit 1
fi 