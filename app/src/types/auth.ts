import type { Role, User } from './shared';
export type { Role } from './shared';

export interface AuthError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ApiUser extends User {}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: ApiUser;
}

export interface Credentials {
  email: string;
  password: string;
}
