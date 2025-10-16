export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  avatar?: string;
  clubId?: string;
  lastLoginAt?: Date;
  createdAt: Date;
}

export type UserRole = 'super_admin' | 'caddie_master' | 'profesor';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface AuthResponse {
  access_token: string;
  user: User;
  expires_in: number;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  // Datos del Club
  clubName: string;
  clubAddress: string;
  clubCity: string;
  clubCountry: string;
  totalCourts: number;
  clubContactEmail: string;
  clubContactPhone: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
}