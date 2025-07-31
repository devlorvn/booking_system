# Booking System - Microservices Architecture

Một hệ thống đặt phòng hiệu suất cao sử dụng kiến trúc microservices với NestJS và Go, kết hợp Protocol Buffers để giao tiếp giữa các service.

## 🏗️ Kiến trúc Hệ thống

```
Client (Web/Mobile)
       |
       |  (GraphQL)
       V
+-------------------+
|   API Gateway     |  (NestJS)
| (GraphQL Server)  |
+-------------------+
       |  (gRPC / REST)
       V
+-------------------+      +-------------------+      +-------------------+
| User Service      | <--> | Ticket Service    | <--> | Booking Service   |
| (NestJS)          |      | (Golang - gRPC)   |      | (NestJS - gRPC)   |
+-------------------+      +-------------------+      +-------------------+
       ^                                 |
       |  (gRPC / REST)                  | (Kafka Event: "booking-requested")
       |                                 V
+-------------------+            +-------------------+
| Payment Service   | <--------> | Kafka Broker      |
| (NestJS/Golang)   |            +-------------------+
+-------------------+            ^      ^      ^
       ^                         |      |      |
       | (Kafka Event: "payment-succeeded")
       |                         |      |      |
+-------------------+      +-------------------+      +-------------------+
| Notification      | <----| Ticket Update     | <----| Payment Status    |
| Service (Go)      |      | Worker (NestJS)   |      | Checker (NestJS/Go)|
+-------------------+      +-------------------+      +-------------------+
```

### 🔧 Các Service Components

#### **Frontend Layer**
- **Client (Web/Mobile)**: Giao diện người dùng sử dụng GraphQL

#### **API Gateway Layer**
- **API Gateway (NestJS)**: GraphQL Server làm entry point cho tất cả requests

#### **Core Business Services**
- **User Service (NestJS)**: Quản lý người dùng, authentication, authorization
- **Ticket Service (Golang)**: Quản lý vé, inventory, availability
- **Booking Service (NestJS)**: Xử lý đặt phòng, booking logic

#### **Payment & Event Processing**
- **Payment Service (NestJS/Golang)**: Xử lý thanh toán, payment gateways
- **Kafka Broker**: Message broker cho event-driven architecture
- **Ticket Update Worker (NestJS)**: Background worker xử lý ticket updates
- **Payment Status Checker (NestJS/Go)**: Kiểm tra trạng thái thanh toán

#### **Notification & Communication**
- **Notification Service (Go)**: Gửi email, SMS, push notifications

### 🔄 Communication Patterns

#### **Synchronous Communication**
- **gRPC**: High-performance RPC giữa các microservices
- **REST**: HTTP APIs cho external integrations
- **GraphQL**: Flexible data fetching cho clients

#### **Asynchronous Communication**
- **Kafka Events**: Event-driven architecture
  - `booking-requested`: Khi có booking mới
  - `payment-succeeded`: Khi thanh toán thành công

### 🛡️ Technology Stack

#### **Backend Services**
- **NestJS**: TypeScript framework cho API Gateway, User Service, Booking Service
- **Go**: High-performance language cho Ticket Service, Notification Service
- **gRPC**: High-performance RPC framework
- **Protocol Buffers**: Data serialization

#### **Event Streaming & Messaging**
- **Apache Kafka**: Distributed streaming platform
- **Event Sourcing**: Event-driven architecture patterns

#### **API & Communication**
- **GraphQL**: Flexible API query language
- **REST**: Traditional HTTP APIs
- **gRPC**: High-performance RPC

#### **Development Tools**
- **Buf**: Protocol Buffer toolchain
- **Make**: Build automation
- **GitHub Actions**: CI/CD pipeline
- **Docker**: Containerization (coming soon)

#### **Database & Storage**
- **PostgreSQL**: Primary database (coming soon)
- **Redis**: Caching layer (coming soon)
- **MongoDB**: Document storage (coming soon)

## 🚀 Quick Start

### 1. Setup Development Environment
```bash
# Setup tất cả dependencies và generate proto files
npm run dev:setup
```

### 2. Generate Protocol Buffers
```bash
# Generate proto files cho TypeScript và Go
npm run proto:generate

# Hoặc full validation workflow
npm run proto:validate
```

### 3. Build và Run Services
```bash
# Build tất cả services
npm run build:all

# Hoặc build từng service
npm run build:go    # Build Go services
npm run build:ts    # Build TypeScript services
```

## 📁 Cấu trúc Dự án

```
booking-system/
├── apps/
│   ├── api-gateway/          # API Gateway (NestJS - GraphQL)
│   ├── user-service/         # User Management (NestJS)
│   ├── ticket-service/       # Ticket Management (Go)
│   ├── booking-service/      # Booking Management (NestJS)
│   ├── payment-service/      # Payment Processing (NestJS/Go)
│   ├── notification-service/ # Notifications (Go)
│   └── workers/              # Background Workers
│       ├── ticket-update/    # Ticket Update Worker (NestJS)
│       └── payment-checker/  # Payment Status Checker (NestJS/Go)
├── libs/
│   ├── proto-definitions/    # Protocol Buffer definitions
│   └── shared/              # Shared utilities
├── scripts/                 # Development scripts
├── docs/                    # Documentation
├── kafka/                   # Kafka configurations
└── .github/workflows/       # CI/CD pipelines
```

## 🔧 Development Tools

### NPM Scripts (Cross-platform)
```bash
npm run proto:generate      # Generate proto files
npm run proto:validate      # Validate proto files
npm run build:all           # Build tất cả services
npm run dev:setup           # Setup development environment
npm run test                # Run tests
```

### Makefile Commands (Linux/Mac only)
```bash
make help                    # Hiển thị tất cả commands
make proto-generate         # Generate proto files
make proto-validate         # Full proto validation
make build-all              # Build tất cả services
make test-all               # Run tất cả tests
make clean-all              # Clean generated files
```

## 📋 Protocol Buffers

### Cấu hình nâng cao
- **Buf Workspace**: Quản lý multiple proto repositories
- **Breaking Changes Detection**: Tự động kiểm tra backward compatibility
- **Lint Rules**: Enforce coding standards
- **CI/CD Integration**: Automated validation và testing

### Sử dụng
```bash
# Generate files
npm run proto:generate

# Validate và format
npm run proto:validate

# Check breaking changes
npm run proto:breaking
```

Xem chi tiết tại [docs/PROTO_SETUP.md](docs/PROTO_SETUP.md)

## 🧪 Testing

```bash
# Run tất cả tests
npm run test

# Run TypeScript tests
npm test

# Run Go tests
cd apps/ticket-service && go test ./...
```

## 🚀 Deployment

### Local Development
```bash
# Start API Gateway (GraphQL)
npm run start:dev

# Start User Service
cd apps/user-service && npm run start:dev

# Start Ticket Service (Go)
cd apps/ticket-service && go run main.go

# Start Kafka (Docker)
docker-compose up kafka

# Start Background Workers
cd apps/workers/ticket-update && npm run start:dev
cd apps/workers/payment-checker && npm run start:dev
```

### Production
```bash
# Build production
npm run build:all

# Start production
npm run start:prod
```

## 🔄 CI/CD Pipeline

GitHub Actions tự động:
- ✅ Lint proto files
- ✅ Check breaking changes
- ✅ Generate code
- ✅ Build services
- ✅ Run tests

## 📚 Documentation

- [Protocol Buffers Setup](docs/PROTO_SETUP.md) - Hướng dẫn chi tiết về proto files
- [API Documentation](docs/API.md) - API endpoints documentation
- [Architecture](docs/ARCHITECTURE.md) - Kiến trúc hệ thống
- [Event Flow](docs/EVENT_FLOW.md) - Event-driven architecture patterns

## 🛠️ Tech Stack

### Backend Services
- **NestJS**: TypeScript framework cho API Gateway và User Service
- **Go**: High-performance language cho Ticket Service
- **gRPC**: High-performance RPC framework
- **Protocol Buffers**: Data serialization

### Development Tools
- **Buf**: Protocol Buffer toolchain
- **Make**: Build automation
- **GitHub Actions**: CI/CD pipeline
- **Docker**: Containerization (coming soon)

### Database
- **PostgreSQL**: Primary database (coming soon)
- **Redis**: Caching layer (coming soon)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes và run validation:
   ```bash
   npm run proto:validate
   npm run build:all
   npm run test
   ```
4. Commit changes (`git commit -m 'feat: add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

Nếu gặp vấn đề, hãy:
1. Kiểm tra [Troubleshooting](docs/PROTO_SETUP.md#troubleshooting)
2. Chạy validation: `npm run proto:validate`
3. Tạo issue với thông tin chi tiết

---

**Happy Coding! 🎉**
