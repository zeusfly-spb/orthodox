export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  message?: string;
}

interface ApiResponse<T> {
  current_page?: number;
  data: T[];
  last_page?: number;
  per_page?: number;
  total?: number;
}

interface Customer {
  id: number;
  firstname: string;
  lastname: string;
}

export interface Role {
  name: string;
  guard_name: string;
}

export interface User {
  id: number | string;
  uuid?: string;
  email_verified: boolean;
  email: string;
  name: string;
  full_name: string | null;
  phone: string | null;
  avatar?: string | null;
  deleted_at: string | null;
  roles: Role[];
}
