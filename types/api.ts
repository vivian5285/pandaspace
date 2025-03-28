export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  total: number;
  data: T[];
}

export interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean;
  showSuccessMessage?: boolean;
} 