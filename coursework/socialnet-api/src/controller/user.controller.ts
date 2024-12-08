import { Body, Controller, Post } from '@nestjs/common'
import { ApiHeader, ApiResponse } from '@nestjs/swagger'
import { CreateUserReq } from 'src/dto/request/user.requests.dto'
import { UserService } from 'src/service/user.service'

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiHeader({
    name: 'x-client-id',
    description: 'client identifier',
    required: true,
    schema: {
      example: 'test-client',
    },
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() createUserDto: CreateUserReq): Promise<void> {
    await this.userService.createUser(createUserDto)
  }
}
