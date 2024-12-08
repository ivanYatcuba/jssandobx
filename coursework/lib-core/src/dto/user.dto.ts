export interface UserCredentials {
  login: string
  password: string
}

export interface CreateUserDto {
  email: string
  login: string
  password: string
}

export interface UserInfo {
  uid: string
  email: string
  login: string
}

export interface UserInfoWithPass extends UserInfo {
  password: string
}

export interface UserCreatedDto {}

export interface UserValidateRequest {
  login: string
  password: string
}

export interface GetUserNamesRequest {
  userIds: string[]
}

export interface GetUserNamesResponse {
  users: UserIdToName[]
}

export interface UserIdToName {
  userId: string
  userName: string
}
