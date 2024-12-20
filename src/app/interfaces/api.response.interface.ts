export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  status: number;
  error?: any;
}
export interface AuthResponse {
  id_token: string; // Définir que la réponse contient un id_token
}
