
export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  HR = 'HR',
  TRAINER = 'TRAINER',
  USER = 'USER',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface JWTPayload {
  sub: string;
  id: string;
  role?: string;
  roles?: string[];
  authorities?: any[];
  exp: number;
}
