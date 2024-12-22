export interface AuthResponse {
  id_token: string;
}

export interface AuthRequest{
  username: string;
  password: string;
  rememberMe: boolean;

}
