import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length } from 'class-validator'
import { UserPostInput } from 'lib-core/dist/dto/post.dto'

export class UserPostInputReq implements UserPostInput {
  @IsNotEmpty()
  @IsString()
  @Length(10, 255)
  @ApiProperty({ default: 'very useful information', required: true })
  content: string
}
