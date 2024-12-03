import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom, timeout } from 'rxjs'
import {
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  TokenRequest,
  TokenResponse,
} from 'src/dto/auth'

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  async token(tokenRequest: TokenRequest): Promise<TokenResponse> {
    return await firstValueFrom(
      this.client.send<TokenResponse, TokenRequest>('auth.token', tokenRequest).pipe(timeout(5000)),
    )
  }

  async refresh(refreshTokenRequest: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return await firstValueFrom(
      this.client
        .send<RefreshTokenResponse, RefreshTokenRequest>('auth.refresh', refreshTokenRequest)
        .pipe(timeout(5000)),
    )
  }

  async logout(logoutRequest: LogoutRequest): Promise<LogoutResponse> {
    return await firstValueFrom(
      this.client.send<LogoutResponse, LogoutRequest>('auth.logout', logoutRequest).pipe(timeout(5000)),
    )
  }
}
