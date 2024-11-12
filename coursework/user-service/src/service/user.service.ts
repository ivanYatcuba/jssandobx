import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UserCreatedDto } from 'src/dto/user.dto';
import { UserRepository } from 'src/repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserCreatedDto> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    await this.userRepository.createUser(createUserDto);

    return {};
  }
}
