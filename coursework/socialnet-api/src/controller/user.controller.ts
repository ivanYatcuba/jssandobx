import { Body, Controller, Post } from '@nestjs/common'
import { CreateUserReq } from 'src/dto/request/user.requests.dto'
import { UserService } from 'src/service/user.service'

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserReq): Promise<void> {
    await this.userService.createUser(createUserDto)
  }
}
