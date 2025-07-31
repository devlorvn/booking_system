import { Injectable, NotFoundException } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  User,
  GetUserByIdRequest,
  CreateUserRequest,
  UpdateUserRequest,
  DeleteUserRequest,
  DeleteUserResponse,
  GetUserByIdResponse,
  CreateUserResponse,
  UpdateUserResponse,
} from '@app/proto-definitions/generated/user/user';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  @GrpcMethod('UserService', 'GetUserById')
  async getUserById(data: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    console.log('getUserById', data);
    const user = await this.userRepo.findOne({
      where: {
        id: data.id,
      },
    });
    return {
      user: user && {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  }

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await this.userRepo.save({
      username: data.username,
      email: data.email,
      passwordHash: hashedPassword,
    });
    return {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt.toISOString(),
        updatedAt: newUser.updatedAt.toISOString(),
      },
    };
  }

  @GrpcMethod('UserService', 'UpdateUser')
  async updateUser(data: UpdateUserRequest): Promise<UpdateUserResponse> {
    const userEntity = await this.userRepo.findOne({ where: { id: data.id } });
    if (!userEntity) {
      return {
        user: undefined,
      };
    }
    if (data.username) {
      userEntity.username = data.username;
    }
    if (data.email) {
      userEntity.email = data.email;
    }
    const updatedUser = await this.userRepo.save(userEntity);
    return {
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      },
    };
  }

  @GrpcMethod('UserService', 'DeleteUser')
  async deleteUser(data: DeleteUserRequest): Promise<DeleteUserResponse> {
    const deleteResult = await this.userRepo.delete(data.id);
    if (deleteResult.affected === 0) {
      return { success: false, message: `User ${data.id} not found.` };
    }
    return { success: true, message: `User ${data.id} deleted successfully.` };
  }
}
