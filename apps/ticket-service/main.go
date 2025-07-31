package main

import (
	"context"
	"fmt"
	"log"
	"net"

	"google.golang.org/grpc"

	pb "booking-system/ticket-service/proto/src/user"
)

const (
	port = ":50052"
)

type server struct {
	pb.UnimplementedUserServiceServer
}

func (s *server) GetUserById(ctx context.Context, in *pb.GetUserByIdRequest) (*pb.GetUserByIdResponse, error) {
	log.Printf("Receiver: %v", in.GetId())
	if in.GetId() == "1" {
		return &pb.GetUserByIdResponse{
			User: &pb.User{
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

func (s *server) CreateUser(ctx context.Context, in *pb.CreateUserRequest) (*pb.CreateUserResponse, error) {
	log.Printf("Creating user: %v", in.GetUsername())
	// TODO: Implement user creation logic
	return &pb.CreateUserResponse{
		User: &pb.User{
			Id:        "new_id",
			Username:  in.GetUsername(),
			Email:     in.GetEmail(),
			CreatedAt: "2023-10-27T10:00:00.000Z",
			UpdatedAt: "2023-10-27T10:00:00.000Z",
		},
	}, nil
}

func (s *server) UpdateUser(ctx context.Context, in *pb.UpdateUserRequest) (*pb.UpdateUserResponse, error) {
	log.Printf("Updating user: %v", in.GetId())
	// TODO: Implement user update logic
	return &pb.UpdateUserResponse{
		User: &pb.User{
			Id:        in.GetId(),
			Username:  in.GetUsername(),
			Email:     in.GetEmail(),
			CreatedAt: "2023-10-27T10:00:00.000Z",
			UpdatedAt: "2023-10-27T10:00:00.000Z",
		},
	}, nil
}

func (s *server) DeleteUser(ctx context.Context, in *pb.DeleteUserRequest) (*pb.DeleteUserResponse, error) {
	log.Printf("Deleting user: %v", in.GetId())
	// TODO: Implement user deletion logic
	return &pb.DeleteUserResponse{
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

	pb.RegisterUserServiceServer(s, &server{})
	log.Printf("Ticket Service (Go gRPC) listening on %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
