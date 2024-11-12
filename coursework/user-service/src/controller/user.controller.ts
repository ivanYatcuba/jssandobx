import { Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto, UserCreatedDto } from 'src/dto/user.dto';
import { UserService } from 'src/service/user.service';

export class UserController {
  constructor(@Inject() private readonly userService: UserService) {}

  @MessagePattern('user.create')
  async createUser(createUserDto: CreateUserDto): Promise<UserCreatedDto> {
    return await this.userService.createUser(createUserDto);
  }
}
