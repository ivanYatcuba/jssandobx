import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { clientCall } from 'lib-core/dist/client/util'
import { CreateUserDto } from 'lib-core/src/dto/user.dto'

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    return await clientCall(this.client.send<void, CreateUserDto>('user.create', createUserDto))
  }
}
