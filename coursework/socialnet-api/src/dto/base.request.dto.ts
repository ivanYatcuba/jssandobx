export interface UserRequest extends Request {
  user: UserSessionDto
}

export interface UserSessionDto {
  username: string
  sub: string
  clientId: string
}
