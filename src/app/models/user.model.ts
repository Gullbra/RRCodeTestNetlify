export interface User {
  id: string;
  email: string;
  // createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface ITokenPayload {
  accessToken: string;
  refreshToken: string;
}
