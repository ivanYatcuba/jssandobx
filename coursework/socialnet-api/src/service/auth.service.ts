import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { clientCall } from 'lib-core/dist/client/util'
import {
  CheckTokenExistsRequest,
  CheckTokenExistsResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  TokenRequest,
  TokenResponse,
} from 'lib-core/src/dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  async token(tokenRequest: TokenRequest): Promise<TokenResponse> {
    return await clientCall(this.client.send<TokenResponse, TokenRequest>('auth.token', tokenRequest))
  }

  async refresh(refreshTokenRequest: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return await clientCall(
      this.client.send<RefreshTokenResponse, RefreshTokenRequest>('auth.refresh', refreshTokenRequest),
    )
  }

  async logout(logoutRequest: LogoutRequest): Promise<LogoutResponse> {
    return await clientCall(this.client.send<LogoutResponse, LogoutRequest>('auth.logout', logoutRequest))
  }

  async checkTokenExists(checkTokenExistsRequest: CheckTokenExistsRequest): Promise<CheckTokenExistsResponse> {
    return await clientCall(
      this.client.send<CheckTokenExistsResponse, CheckTokenExistsRequest>('auth.token-exists', checkTokenExistsRequest),
    )
  }
}
