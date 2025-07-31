# System Architecture Documentation

## Tổng quan

Booking System được thiết kế theo kiến trúc microservices với event-driven architecture, sử dụng GraphQL cho API Gateway và gRPC cho inter-service communication.

## 🏗️ Kiến trúc Tổng thể

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

## 🔧 Service Components

### 1. API Gateway (NestJS - GraphQL)
**Vai trò**: Entry point cho tất cả client requests
- **Technology**: NestJS với GraphQL
- **Responsibilities**:
  - GraphQL schema management
  - Request routing và load balancing
  - Authentication/Authorization
  - Rate limiting
  - Request/Response transformation
  - API versioning

### 2. User Service (NestJS)
**Vai trò**: Quản lý người dùng và authentication
- **Technology**: NestJS với gRPC
- **Responsibilities**:
  - User registration/login
  - Profile management
  - Role-based access control
  - JWT token management
  - User preferences

### 3. Ticket Service (Golang)
**Vai trò**: Quản lý vé và inventory
- **Technology**: Go với gRPC
- **Responsibilities**:
  - Ticket inventory management
  - Availability checking
  - Price calculation
  - Seat allocation
  - Real-time updates

### 4. Booking Service (NestJS)
**Vai trò**: Xử lý logic đặt phòng
- **Technology**: NestJS với gRPC
- **Responsibilities**:
  - Booking creation/modification
  - Booking validation
  - Reservation management
  - Booking history
  - Cancellation logic

### 5. Payment Service (NestJS/Golang)
**Vai trò**: Xử lý thanh toán
- **Technology**: NestJS hoặc Go với gRPC
- **Responsibilities**:
  - Payment processing
  - Payment gateway integration
  - Transaction management
  - Refund processing
  - Payment status tracking

### 6. Notification Service (Go)
**Vai trò**: Gửi thông báo
- **Technology**: Go
- **Responsibilities**:
  - Email notifications
  - SMS notifications
  - Push notifications
  - Notification templates
  - Delivery tracking

### 7. Background Workers
**Vai trò**: Xử lý asynchronous tasks

#### Ticket Update Worker (NestJS)
- **Responsibilities**:
  - Process ticket availability updates
  - Handle inventory changes
  - Update booking status
  - Send notifications

#### Payment Status Checker (NestJS/Go)
- **Responsibilities**:
  - Monitor payment status
  - Handle payment timeouts
  - Process failed payments
  - Update booking status

## 🔄 Communication Patterns

### Synchronous Communication

#### gRPC
- **Use Cases**: Inter-service communication
- **Services**: User ↔ Ticket, Ticket ↔ Booking, API Gateway ↔ Services
- **Benefits**: High performance, type safety, bidirectional streaming

#### REST APIs
- **Use Cases**: External integrations, legacy systems
- **Services**: Payment gateways, third-party services
- **Benefits**: Simple, widely supported

#### GraphQL
- **Use Cases**: Client-server communication
- **Services**: Client ↔ API Gateway
- **Benefits**: Flexible queries, single endpoint, real-time subscriptions

### Asynchronous Communication

#### Kafka Events
- **Use Cases**: Event-driven architecture
- **Events**:
  - `booking-requested`: Khi có booking mới
  - `payment-succeeded`: Khi thanh toán thành công
  - `ticket-updated`: Khi ticket được cập nhật
  - `notification-sent`: Khi notification được gửi

## 🗄️ Data Architecture

### Database Strategy
- **User Service**: PostgreSQL (user data, authentication)
- **Ticket Service**: PostgreSQL (inventory, availability)
- **Booking Service**: PostgreSQL (bookings, reservations)
- **Payment Service**: PostgreSQL (transactions, payments)
- **Notification Service**: MongoDB (notification logs)

### Caching Strategy
- **Redis**: Session storage, rate limiting, temporary data
- **In-memory**: Service-level caching
- **CDN**: Static content, images

## 🔐 Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication
- **OAuth 2.0**: Third-party authentication
- **Role-based Access Control**: Fine-grained permissions
- **API Keys**: External service authentication

### Data Protection
- **Encryption**: Data at rest và in transit
- **HTTPS/TLS**: Secure communication
- **Input Validation**: Prevent injection attacks
- **Rate Limiting**: Prevent abuse

## 📊 Monitoring & Observability

### Logging
- **Structured Logging**: JSON format logs
- **Centralized Logging**: ELK Stack hoặc similar
- **Log Levels**: DEBUG, INFO, WARN, ERROR

### Metrics
- **Application Metrics**: Response times, error rates
- **Business Metrics**: Bookings, revenue, user activity
- **Infrastructure Metrics**: CPU, memory, disk usage

### Tracing
- **Distributed Tracing**: Track requests across services
- **Performance Monitoring**: Identify bottlenecks
- **Error Tracking**: Real-time error monitoring

## 🚀 Deployment Architecture

### Container Strategy
- **Docker**: Containerization cho tất cả services
- **Kubernetes**: Orchestration và scaling
- **Service Mesh**: Istio cho advanced networking

### Environment Strategy
- **Development**: Local development với Docker Compose
- **Staging**: Production-like environment
- **Production**: High availability, auto-scaling

## 🔄 Development Workflow

### Code Management
- **Monorepo**: Single repository cho tất cả services
- **Shared Libraries**: Common code và utilities
- **Protocol Buffers**: Contract-first development

### CI/CD Pipeline
- **Automated Testing**: Unit, integration, e2e tests
- **Code Quality**: Linting, formatting, security scanning
- **Deployment**: Automated deployment to environments

## 📈 Scalability Considerations

### Horizontal Scaling
- **Stateless Services**: Easy horizontal scaling
- **Database Sharding**: Distribute data across instances
- **Load Balancing**: Distribute traffic across services

### Performance Optimization
- **Caching**: Reduce database load
- **Connection Pooling**: Efficient database connections
- **Async Processing**: Non-blocking operations

## 🔧 Technology Decisions

### Why NestJS?
- **TypeScript**: Type safety và developer experience
- **Modular Architecture**: Easy to maintain và scale
- **Rich Ecosystem**: Extensive libraries và tools
- **Enterprise Ready**: Built for large applications

### Why Go?
- **Performance**: High performance cho critical services
- **Concurrency**: Excellent for handling multiple requests
- **Memory Efficiency**: Low memory footprint
- **Simple Deployment**: Single binary deployment

### Why gRPC?
- **Performance**: High performance RPC framework
- **Type Safety**: Protocol Buffers provide type safety
- **Bidirectional Streaming**: Real-time communication
- **Code Generation**: Automatic client/server code generation

### Why Kafka?
- **Reliability**: High availability và fault tolerance
- **Scalability**: Handle high throughput
- **Event Sourcing**: Perfect for event-driven architecture
- **Stream Processing**: Real-time data processing

## 🎯 Future Considerations

### Planned Enhancements
- **Service Mesh**: Advanced networking với Istio
- **Event Sourcing**: Complete event-driven architecture
- **CQRS**: Command Query Responsibility Segregation
- **Micro Frontends**: Frontend microservices

### Scalability Roadmap
- **Multi-region Deployment**: Global availability
- **Database Federation**: Distributed data management
- **Advanced Caching**: Multi-level caching strategy
- **Real-time Analytics**: Real-time business intelligence 