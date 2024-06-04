export type UserType = {
  uid: string,
  email: string,
  displayName: string,
  isLoggedIn: boolean
}

export type UserResponseType = Omit<UserType, 'isLoggedIn'>
