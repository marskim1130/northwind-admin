import type { ErrorResponse, SuccessResponse } from "@northwind-admin/shared";

export function ok<TData>(data: TData, message = "OK"): SuccessResponse<TData> {
  return {
    success: true,
    data,
    message
  };
}

export function fail(code: string, message: string, details: unknown[] = []): ErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details
    }
  };
}
