# Event Flow Documentation

## Tổng quan

Booking System sử dụng event-driven architecture với Apache Kafka để xử lý các business events một cách asynchronous và scalable.

## 🔄 Event Flow Diagram

```
┌─────────────────┐    booking-requested    ┌─────────────────┐
│ Booking Service │ ──────────────────────► │ Kafka Broker    │
└─────────────────┘                         └─────────────────┘
                                                    |
                                                    | booking-requested
                                                    V
┌─────────────────┐                         ┌─────────────────┐
│ Payment Service │ ◄────────────────────────│ Ticket Service  │
└─────────────────┘                         └─────────────────┘
        |                                           |
        | payment-succeeded                         | ticket-updated
        V                                           V
┌─────────────────┐                         ┌─────────────────┐
│ Notification    │                         │ Ticket Update   │
│ Service         │                         │ Worker          │
└─────────────────┘                         └─────────────────┘
```

## 📋 Event Definitions

### 1. booking-requested
**Trigger**: Khi user tạo booking mới
**Producer**: Booking Service
**Consumers**: Payment Service, Ticket Service
**Payload**:
```json
{
  "event_id": "uuid",
  "event_type": "booking-requested",
  "timestamp": "2023-10-27T10:00:00.000Z",
  "data": {
    "booking_id": "uuid",
    "user_id": "uuid",
    "ticket_ids": ["uuid1", "uuid2"],
    "total_amount": 150.00,
    "currency": "USD",
    "booking_date": "2023-11-15"
  }
}
```

### 2. payment-succeeded
**Trigger**: Khi payment được xử lý thành công
**Producer**: Payment Service
**Consumers**: Notification Service, Booking Service
**Payload**:
```json
{
  "event_id": "uuid",
  "event_type": "payment-succeeded",
  "timestamp": "2023-10-27T10:05:00.000Z",
  "data": {
    "booking_id": "uuid",
    "payment_id": "uuid",
    "amount": 150.00,
    "currency": "USD",
    "payment_method": "credit_card",
    "transaction_id": "txn_123456"
  }
}
```

### 3. ticket-updated
**Trigger**: Khi ticket availability thay đổi
**Producer**: Ticket Service
**Consumers**: Ticket Update Worker, Notification Service
**Payload**:
```json
{
  "event_id": "uuid",
  "event_type": "ticket-updated",
  "timestamp": "2023-10-27T10:10:00.000Z",
  "data": {
    "ticket_id": "uuid",
    "event_id": "uuid",
    "available_seats": 45,
    "price": 75.00,
    "status": "available"
  }
}
```

### 4. notification-sent
**Trigger**: Khi notification được gửi thành công
**Producer**: Notification Service
**Consumers**: Analytics Service, Audit Service
**Payload**:
```json
{
  "event_id": "uuid",
  "event_type": "notification-sent",
  "timestamp": "2023-10-27T10:15:00.000Z",
  "data": {
    "user_id": "uuid",
    "notification_type": "email",
    "template_id": "booking_confirmation",
    "delivery_status": "delivered",
    "booking_id": "uuid"
  }
}
```

## 🔄 Event Flow Scenarios

### Scenario 1: New Booking Flow
```
1. User creates booking
   └── Booking Service
       └── Publishes: booking-requested

2. Payment Service receives booking-requested
   └── Initiates payment processing
   └── Publishes: payment-succeeded (on success)

3. Notification Service receives payment-succeeded
   └── Sends confirmation email/SMS
   └── Publishes: notification-sent

4. Ticket Service receives booking-requested
   └── Updates ticket availability
   └── Publishes: ticket-updated
```

### Scenario 2: Payment Failure Flow
```
1. Payment Service processes payment
   └── Payment fails
   └── Publishes: payment-failed

2. Booking Service receives payment-failed
   └── Updates booking status to "cancelled"
   └── Releases reserved tickets

3. Notification Service receives payment-failed
   └── Sends failure notification
   └── Publishes: notification-sent
```

### Scenario 3: Ticket Cancellation Flow
```
1. User cancels booking
   └── Booking Service
   └── Publishes: booking-cancelled

2. Payment Service receives booking-cancelled
   └── Initiates refund process
   └── Publishes: refund-processed

3. Ticket Service receives booking-cancelled
   └── Updates ticket availability
   └── Publishes: ticket-updated

4. Notification Service receives refund-processed
   └── Sends refund confirmation
   └── Publishes: notification-sent
```

## 🏗️ Event Infrastructure

### Kafka Topics
```
booking-system.bookings
booking-system.payments
booking-system.tickets
booking-system.notifications
booking-system.audit
```

### Event Schema Registry
- **Apache Avro**: Schema definition và validation
- **Schema Evolution**: Backward compatibility
- **Version Management**: Schema versioning

### Event Storage
- **Kafka**: Primary event store
- **Event Sourcing**: Complete event history
- **CQRS**: Command Query Responsibility Segregation

## 🔧 Event Processing

### Event Producers
- **Booking Service**: booking-requested, booking-cancelled
- **Payment Service**: payment-succeeded, payment-failed
- **Ticket Service**: ticket-updated, ticket-created
- **Notification Service**: notification-sent

### Event Consumers
- **Payment Service**: Consumes booking-requested
- **Notification Service**: Consumes payment-succeeded, payment-failed
- **Ticket Update Worker**: Consumes ticket-updated
- **Analytics Service**: Consumes all events
- **Audit Service**: Consumes all events

### Event Handlers
```typescript
// Example: Payment Service Event Handler
@EventHandler('booking-requested')
async handleBookingRequested(event: BookingRequestedEvent) {
  const { booking_id, total_amount, currency } = event.data;
  
  // Process payment
  const payment = await this.paymentProcessor.process({
    booking_id,
    amount: total_amount,
    currency
  });
  
  if (payment.status === 'succeeded') {
    await this.eventBus.publish('payment-succeeded', {
      booking_id,
      payment_id: payment.id,
      amount: total_amount,
      currency
    });
  } else {
    await this.eventBus.publish('payment-failed', {
      booking_id,
      error: payment.error
    });
  }
}
```

## 📊 Event Monitoring

### Event Metrics
- **Event Throughput**: Events per second
- **Event Latency**: Processing time
- **Event Failure Rate**: Failed events percentage
- **Consumer Lag**: Processing delay

### Event Tracing
- **Correlation IDs**: Track events across services
- **Distributed Tracing**: End-to-end event flow
- **Event Logging**: Complete event audit trail

### Event Dead Letter Queue
- **Failed Events**: Events that couldn't be processed
- **Retry Logic**: Automatic retry with exponential backoff
- **Manual Processing**: Manual intervention for failed events

## 🔐 Event Security

### Event Encryption
- **At Rest**: Encrypted event storage
- **In Transit**: TLS encryption
- **Event Signing**: Digital signatures for event integrity

### Event Access Control
- **Topic Permissions**: Service-specific topic access
- **Event Filtering**: Filter sensitive data
- **Audit Logging**: Complete access audit trail

## 🚀 Event Scalability

### Horizontal Scaling
- **Kafka Partitions**: Parallel event processing
- **Consumer Groups**: Load balancing across consumers
- **Auto-scaling**: Dynamic scaling based on load

### Performance Optimization
- **Event Batching**: Batch multiple events
- **Compression**: Reduce event size
- **Caching**: Cache frequently accessed events

## 🔄 Event Testing

### Event Testing Strategies
- **Unit Testing**: Test event handlers
- **Integration Testing**: Test event flow
- **End-to-End Testing**: Test complete scenarios

### Event Mocking
```typescript
// Example: Event Mock for Testing
const mockEventBus = {
  publish: jest.fn(),
  subscribe: jest.fn()
};

// Test event handler
it('should process booking-requested event', async () => {
  const event = {
    event_type: 'booking-requested',
    data: { booking_id: 'test-id', total_amount: 100 }
  };
  
  await paymentService.handleBookingRequested(event);
  
  expect(mockEventBus.publish).toHaveBeenCalledWith(
    'payment-succeeded',
    expect.objectContaining({
      booking_id: 'test-id'
    })
  );
});
```

## 📈 Event Analytics

### Business Intelligence
- **Booking Analytics**: Booking patterns và trends
- **Payment Analytics**: Payment success rates
- **User Behavior**: User interaction patterns

### Operational Intelligence
- **System Health**: Service performance metrics
- **Error Tracking**: Event processing errors
- **Capacity Planning**: Resource utilization

## 🎯 Best Practices

### Event Design
- **Event Naming**: Use past tense verbs
- **Event Size**: Keep events small và focused
- **Event Immutability**: Events should be immutable
- **Event Versioning**: Handle schema evolution

### Event Processing
- **Idempotency**: Handle duplicate events
- **Error Handling**: Graceful error handling
- **Retry Logic**: Implement retry mechanisms
- **Dead Letter Queue**: Handle failed events

### Event Monitoring
- **Health Checks**: Monitor event processing health
- **Alerting**: Set up alerts for failures
- **Dashboards**: Real-time event monitoring
- **Logging**: Comprehensive event logging 