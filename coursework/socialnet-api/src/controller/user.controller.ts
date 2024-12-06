import { Body, Controller, Post } from '@nestjs/common'
import { CreateUserDto } from 'lib-core/src/dto/user.dto'
import { UserService } from 'src/service/user.service'

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.userService.createUser(createUserDto)
  }
}
