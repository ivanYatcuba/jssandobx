import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import {
  CreateUserDto,
  GetUserNamesRequest,
  GetUserNamesResponse,
  UserCreatedDto,
  UserIdToName,
  UserInfo,
  UserValidateRequest,
} from 'lib-core/dist/dto/user.dto'
import { UserWrongLoginOrPassError } from 'lib-core/dist/error/auth'
import { UsernameAlreadyExists } from 'lib-core/dist/error/user'
import { UserRepository } from 'src/repository/user.repository'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserCreatedDto> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10)
    try {
      await this.userRepository.createUser(createUserDto)
    } catch (e) {
      if (e.code === '23505') {
        throw new UsernameAlreadyExists()
      }

      throw e
    }

    return {}
  }

  async validateUser(userValidateRequest: UserValidateRequest): Promise<UserInfo> {
    const { login, password } = userValidateRequest

    const user = await this.userRepository.getUserByUsernameOrEmail(login)
    if (!user) {
      throw new UserWrongLoginOrPassError()
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw new UserWrongLoginOrPassError()
    }

    delete user.password

    return user
  }

  async getUsernames(getUserNamesRequest: GetUserNamesRequest): Promise<GetUserNamesResponse> {
    const { userIds } = getUserNamesRequest

    const userMappings = await this.userRepository.getIdToUsername(userIds)

    const users: UserIdToName[] = userMappings.map(({ login, uid }) => {
      return {
        userId: uid,
        userName: login,
      }
    })

    return {
      users,
    }
  }
}
