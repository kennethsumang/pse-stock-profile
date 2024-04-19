export interface AuthUser {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  role: string;
  user_id: string;
}

export interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
