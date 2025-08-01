package main

import (
	"context"
	"fmt"
	"log"
	"net"

	"github.com/redis/go-redis/v9"
	"google.golang.org/grpc"

	pbTicket "booking-system/ticket-service/proto/src/ticket"
	pbUser "booking-system/ticket-service/proto/src/user"
)

const (
	port        = ":50052"
	redisAddr   = "localhost:6379"
	ticketCount = 100
	eventId     = "event_123"
)

type server struct {
	pbUser.UnimplementedUserServiceServer
	pbTicket.UnimplementedTicketServiceServer
	redisClient *redis.Client
}

func (s *server) GetUserById(ctx context.Context, in *pbUser.GetUserByIdRequest) (*pbUser.GetUserByIdResponse, error) {
	log.Printf("Receiver: %v", in.GetId())
	if in.GetId() == "1" {
		return &pbUser.GetUserByIdResponse{
			User: &pbUser.User{
				Id:        "1",
				Username:  "go_user_1",
				Email:     "go_user_1@example.com",
				CreatedAt: "2023-10-27T10:00:00.000Z",
				UpdatedAt: "2023-10-27T10:00:00.000Z",
			},
		}, nil
	}
	return nil, fmt.Errorf("user not found: %v", in.GetId())
}

func (s *server) CreateUser(ctx context.Context, in *pbUser.CreateUserRequest) (*pbUser.CreateUserResponse, error) {
	log.Printf("Creating user: %v", in.GetUsername())
	// TODO: Implement user creation logic
	return &pbUser.CreateUserResponse{
		User: &pbUser.User{
			Id:        "new_id",
			Username:  in.GetUsername(),
			Email:     in.GetEmail(),
			CreatedAt: "2023-10-27T10:00:00.000Z",
			UpdatedAt: "2023-10-27T10:00:00.000Z",
		},
	}, nil
}

func (s *server) UpdateUser(ctx context.Context, in *pbUser.UpdateUserRequest) (*pbUser.UpdateUserResponse, error) {
	log.Printf("Updating user: %v", in.GetId())
	// TODO: Implement user update logic
	return &pbUser.UpdateUserResponse{
		User: &pbUser.User{
			Id:        in.GetId(),
			Username:  in.GetUsername(),
			Email:     in.GetEmail(),
			CreatedAt: "2023-10-27T10:00:00.000Z",
			UpdatedAt: "2023-10-27T10:00:00.000Z",
		},
	}, nil
}

func (s *server) DeleteUser(ctx context.Context, in *pbUser.DeleteUserRequest) (*pbUser.DeleteUserResponse, error) {
	log.Printf("Deleting user: %v", in.GetId())
	// TODO: Implement user deletion logic
	return &pbUser.DeleteUserResponse{
		Success: true,
		Message: fmt.Sprintf("User %s deleted successfully", in.GetId()),
	}, nil
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()

	pbUser.RegisterUserServiceServer(s, &server{})
	log.Printf("Ticket Service (Go gRPC) listening on %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
