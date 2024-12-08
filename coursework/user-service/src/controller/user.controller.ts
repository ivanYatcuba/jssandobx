import { Inject } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import {
  CreateUserDto,
  GetUserNamesRequest,
  GetUserNamesResponse,
  UserCreatedDto,
  UserInfo,
  UserValidateRequest,
} from 'lib-core/dist/dto/user.dto'
import { UserService } from 'src/service/user.service'

export class UserController {
  constructor(@Inject() private readonly userService: UserService) {}

  @MessagePattern('user.create')
  async createUser(createUserDto: CreateUserDto): Promise<UserCreatedDto> {
    return await this.userService.createUser(createUserDto)
  }

  @MessagePattern('user.validate')
  async validateUser(userValidateRequest: UserValidateRequest): Promise<UserInfo> {
    return await this.userService.validateUser(userValidateRequest)
  }

  @MessagePattern('user.names')
  async getUserNames(getUserNamesRequest: GetUserNamesRequest): Promise<GetUserNamesResponse> {
    return await this.userService.getUsernames(getUserNamesRequest)
  }
}
