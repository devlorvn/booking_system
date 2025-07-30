import { Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  User,
  GetUserByIdRequest,
  CreateUserRequest,
  UpdateUserRequest,
  DeleteUserRequest,
  DeleteUserResponse,
} from '@app/proto-definitions/generated/user/user';

@Injectable()
export class UserController {
  private users: User[] = []; // Dữ liệu giả định

  constructor() {
    // Thêm một vài người dùng giả định
    this.users.push({
      id: '1',
      username: 'john_doe',
      email: 'john@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    this.users.push({
      id: '2',
      username: 'jane_smith',
      email: 'jane@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  @GrpcMethod('UserService', 'GetUserById')
  getUserById(data: GetUserByIdRequest): User {
    console.log('GetUserById called with ID:', data.id);
    const user = this.users.find((u) => u.id === data.id);
    if (!user) {
      // Throw an error for gRPC to handle properly
      throw new Error(`User with ID ${data.id} not found.`);
    }
    return user;
  }

  @GrpcMethod('UserService', 'CreateUser')
  createUser(data: CreateUserRequest): User {
    console.log('CreateUser called with data:', data);
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      username: data.username,
      email: data.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  @GrpcMethod('UserService', 'UpdateUser')
  updateUser(data: UpdateUserRequest): User {
    console.log('UpdateUser called with data:', data);
    const index = this.users.findIndex((u) => u.id === data.id);
    if (index === -1) {
      throw new Error(`User with ID ${data.id} not found for update.`);
    }
    const updatedUser = { ...this.users[index] };
    if (data.username) {
      updatedUser.username = data.username;
    }
    if (data.email) {
      updatedUser.email = data.email;
    }
    updatedUser.updatedAt = new Date().toISOString();
    this.users[index] = updatedUser;
    return updatedUser;
  }

  @GrpcMethod('UserService', 'DeleteUser')
  deleteUser(data: DeleteUserRequest): DeleteUserResponse {
    console.log('DeleteUser called with ID:', data.id);
    const initialLength = this.users.length;
    this.users = this.users.filter((u) => u.id !== data.id);
    if (this.users.length < initialLength) {
      return { success: true, message: `User ${data.id} deleted successfully.` };
    }
    return { success: false, message: `User ${data.id} not found.` };
  }
}