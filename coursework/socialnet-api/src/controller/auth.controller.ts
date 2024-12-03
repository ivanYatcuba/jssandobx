import { Body, Controller, Headers, Post } from '@nestjs/common'
import { LogoutResponse, RefreshTokenResponse, TokenResponse, UserCredentials } from 'src/dto/auth'
import { AuthService } from 'src/service/auth.service'

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  async token(
    @Body() userCredentials: UserCredentials,
    @Headers('x-client-id') clientId: string,
  ): Promise<TokenResponse> {
    return await this.authService.token({ ...userCredentials, clientId })
  }

  @Post('refresh')
  async refreshToken(
    @Headers('authorization') refreshToken: string,
    @Headers('x-client-id') clientId: string,
  ): Promise<RefreshTokenResponse> {
    return await this.authService.refresh({ refreshToken: refreshToken.split('Bearer ')[1], clientId })
  }

  @Post('logout')
  async logout(
    @Headers('authorization') accessToken: string,
    @Headers('x-client-id') clientId: string,
  ): Promise<LogoutResponse> {
    return await this.authService.logout({ accessToken: accessToken.split('Bearer ')[1], clientId })
  }
}
