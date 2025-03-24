export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
  error?: any;
  timestamp: string;
}
