export type SortOrder = "asc" | "desc";

export type MoneyString = string;

export interface SuccessResponse<TData> {
  success: true;
  data: TData;
  message: string;
}

export interface ErrorPayload {
  code: string;
  message: string;
  details?: unknown[];
}

export interface ErrorResponse {
  success: false;
  error: ErrorPayload;
}

export type ApiResponse<TData> = SuccessResponse<TData> | ErrorResponse;

export interface PaginatedData<TItem> {
  items: TItem[];
  page: number;
  pageSize: number;
  total: number;
}

export type PaginatedResponse<TItem> = SuccessResponse<PaginatedData<TItem>>;

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}
