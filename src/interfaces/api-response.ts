export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data?: T;
  message?: string;
  accessToken?: string;
  meta?: Record<string, unknown>;
}
