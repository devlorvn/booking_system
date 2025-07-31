# PowerShell script để generate proto files cho microservice architecture
# Sử dụng buf để generate code từ proto definitions

Write-Host "🚀 Generating proto files..." -ForegroundColor Green

# Di chuyển đến thư mục proto-definitions
Set-Location "libs/proto-definitions"

# Generate files cho TypeScript (NestJS) và Go
Write-Host "📦 Generating TypeScript and Go files..." -ForegroundColor Yellow
buf generate

# Kiểm tra xem có lỗi gì không
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Proto files generated successfully!" -ForegroundColor Green
    Write-Host "📁 TypeScript files: libs/proto-definitions/src/generated/" -ForegroundColor Cyan
    Write-Host "📁 Go files: apps/ticket-service/proto/" -ForegroundColor Cyan
} else {
    Write-Host "❌ Error generating proto files" -ForegroundColor Red
    exit 1
}

# Quay lại thư mục gốc
Set-Location "../.." 