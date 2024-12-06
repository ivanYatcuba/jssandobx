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
  userId: string
}

export interface LogoutResponse {
  success: boolean
}

export interface CheckTokenExistsRequest {
  accessToken: string
  clientId: string
  userId: string
  isTokenRefreshing: boolean
}

export interface CheckTokenExistsResponse {
  exists: boolean
}
