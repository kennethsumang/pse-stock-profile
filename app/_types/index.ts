export interface SuccessResponse<T> {
  data: T;
}

export interface ErrorResponse {
  error: {
    code: number;
    message: string;
  }
}