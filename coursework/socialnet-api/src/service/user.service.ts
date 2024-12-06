import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { CreateUserDto } from 'lib-core/src/dto/user.dto'
import { firstValueFrom, timeout } from 'rxjs'

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    return await firstValueFrom(this.client.send<void, CreateUserDto>('user.create', createUserDto).pipe(timeout(5000)))
  }
}
