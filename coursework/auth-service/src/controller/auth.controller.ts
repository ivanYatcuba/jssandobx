import { Inject } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import {
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  TokenRequest,
  TokenResponse,
} from 'src/dto/auth'
import { AuthService } from 'src/service/auth.service'

export class AuthController {
  constructor(@Inject() private readonly authService: AuthService) {}

  @MessagePattern('auth.token')
  async token(loginRequest: TokenRequest): Promise<TokenResponse> {
    return await this.authService.token(loginRequest)
  }

  @MessagePattern('auth.refresh')
  async refresh(refreshTokenRequest: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return await this.authService.refreshAccessToken(refreshTokenRequest)
  }

  @MessagePattern('auth.logout')
  async logout(logoutRequest: LogoutRequest): Promise<LogoutResponse> {
    return await this.authService.logout(logoutRequest)
  }

  @MessagePattern('auth.token-exists')
  async tokenExists(logoutRequest: LogoutRequest): Promise<LogoutResponse> {
    return await this.authService.logout(logoutRequest)
  }
}
