# Protocol Buffers Setup Guide

## Tổng quan
Dự án sử dụng Protocol Buffers (protobuf) để định nghĩa API contracts giữa các microservices. Chúng ta sử dụng `buf` để quản lý và generate code từ proto files với các cải tiến nâng cao.

## Cấu trúc thư mục
```
booking-system/
├── buf.work.yaml                    # Buf workspace configuration
├── Makefile                         # Development commands
├── .github/workflows/
│   └── proto-ci.yml                # CI/CD pipeline
├── scripts/
│   ├── generate-proto.sh           # Generate script (Linux/Mac)
│   ├── generate-proto.ps1          # Generate script (Windows)
│   ├── validate-proto.sh           # Validation script (Linux/Mac)
│   └── validate-proto.ps1          # Validation script (Windows)
├── libs/proto-definitions/
│   ├── buf.yaml                    # Buf configuration
│   ├── buf.lint.yaml              # Lint rules
│   ├── buf.gen.yaml               # Code generation config
│   └── src/
│       ├── user/
│       │   └── user.proto         # User service definition
│       └── generated/             # Generated TypeScript files
│           └── user/
│               └── user.ts
└── apps/
    ├── ticket-service/
    │   ├── proto/                 # Generated Go files
    │   │   └── src/
    │   │       └── user/
    │   │           ├── user.pb.go
    │   │           └── user_grpc.pb.go
    │   └── main.go
    └── user-service/              # NestJS service
```

## Cách sử dụng

### 1. Quick Start
```bash
# Setup development environment
make dev-setup

# Hoặc sử dụng npm
npm run dev:setup
```

### 2. Generate proto files
```bash
# Sử dụng Makefile (recommended)
make proto-generate

# Hoặc sử dụng npm
npm run proto:generate

# Hoặc sử dụng script
./scripts/generate-proto.sh          # Linux/Mac
./scripts/generate-proto.ps1         # Windows
```

### 3. Full validation workflow
```bash
# Validate, format, check breaking changes và generate
make proto-validate

# Hoặc sử dụng npm
npm run proto:validate

# Hoặc sử dụng script
./scripts/validate-proto.sh          # Linux/Mac
./scripts/validate-proto.ps1         # Windows
```

### 4. Build all services
```bash
# Build tất cả services
make build-all

# Hoặc sử dụng npm
npm run build:all
```

## Cấu hình nâng cao

### Buf Workspace
File `buf.work.yaml` cho phép quản lý multiple proto repositories:
```yaml
version: v1
directories:
  - libs/proto-definitions
  - apps/ticket-service/proto
```

### Lint Rules
File `buf.lint.yaml` định nghĩa coding standards:
- Service naming: `*Service`
- Enum values: `UPPER_SNAKE_CASE`
- Field names: `lower_snake_case`
- Package names: `lower_snake_case`

### Breaking Changes Detection
Tự động kiểm tra breaking changes:
```bash
make proto-breaking
```

## CI/CD Pipeline

### GitHub Actions
File `.github/workflows/proto-ci.yml` tự động:
- Lint proto files
- Check breaking changes
- Generate code
- Build services
- Validate generated files

### Pre-commit Hooks
Để setup pre-commit hooks, thêm vào `.git/hooks/pre-commit`:
```bash
#!/bin/bash
make proto-validate
```

## Best Practices

### 1. Development Workflow
```bash
# 1. Thay đổi proto file
# 2. Validate và generate
make proto-validate

# 3. Build và test
make build-all
make test-all

# 4. Commit changes
git add .
git commit -m "feat: update user service proto"
```

### 2. Version Management
- Sử dụng semantic versioning cho proto files
- Tag releases với version numbers
- Document breaking changes

### 3. Code Organization
- Mỗi service có package riêng trong proto
- Sử dụng consistent naming conventions
- Group related messages và services

## Troubleshooting

### Lỗi import không tìm thấy package
```bash
# 1. Kiểm tra go_package option
# 2. Regenerate files
make proto-generate

# 3. Update dependencies
cd apps/ticket-service && go mod tidy
```

### Lỗi breaking changes
```bash
# 1. Review changes
make proto-breaking

# 2. Nếu cần thiết, update version
# 3. Document changes
```

### Lỗi TypeScript compilation
```bash
# 1. Regenerate TypeScript files
npm run proto:generate

# 2. Check tsconfig paths
# 3. Restart TypeScript server
```

## Cải tiến đã triển khai

### ✅ 1. Buf Workspace
- Quản lý multiple proto repositories
- Centralized configuration

### ✅ 2. Breaking Changes Detection
- Tự động kiểm tra backward compatibility
- CI/CD integration

### ✅ 3. CI/CD Pipeline
- GitHub Actions workflow
- Automated validation và testing

### ✅ 4. Lint Rules
- Enforce coding standards
- Consistent naming conventions

### ✅ 5. Development Tools
- Makefile với common commands
- NPM scripts integration
- Cross-platform scripts

### ✅ 6. Documentation
- Comprehensive setup guide
- Troubleshooting section
- Best practices

## Next Steps

### 🔄 Cải tiến tiếp theo
1. **Proto Registry**: Sử dụng Buf Registry để publish packages
2. **Version Management**: Implement semantic versioning workflow
3. **Testing**: Add proto-specific tests
4. **Documentation**: Auto-generate API documentation
5. **Monitoring**: Add proto usage metrics

### 🚀 Advanced Features
1. **Proto Federation**: Multiple proto repositories
2. **Custom Plugins**: Develop custom buf plugins
3. **Performance**: Optimize generation process
4. **Security**: Add proto security scanning 