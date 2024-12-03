export interface CreateUserDto {
  email: string
  login: string
  password: string
}

export interface UserInfo {
  email: string
  login: string
  createdAt: Date
}

export interface UserInfoWithPass extends UserInfo {
  password: string
}
