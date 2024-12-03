export interface TokenRequest {
  login: string
  password: string
  clientId: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenRequest {
  refreshToken: string
  clientId: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

export interface LogoutRequest {
  accessToken: string
  clientId: string
}

export interface LogoutResponse {}
