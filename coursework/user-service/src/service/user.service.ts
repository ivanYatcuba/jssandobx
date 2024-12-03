import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { CreateUserDto, UserCreatedDto, UserInfo, UserValidateRequest } from 'src/dto/user.dto'
import { UserRepository } from 'src/repository/user.repository'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserCreatedDto> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10)
    await this.userRepository.createUser(createUserDto)

    return {}
  }

  async validateUser(userValidateRequest: UserValidateRequest): Promise<UserInfo> {
    const { login, password } = userValidateRequest

    const user = await this.userRepository.getUserByUsernameOrEmail(login)
    if (!user) {
      return null
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (passwordMatch) {
      return user
    }

    delete user.password

    return user
  }
}
