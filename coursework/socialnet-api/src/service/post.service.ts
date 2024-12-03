import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class PostService {
  constructor(@Inject('POST_SERVICE') private readonly client: ClientProxy) {}
}
