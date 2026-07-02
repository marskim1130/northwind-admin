export type SortOrder = "asc" | "desc";

export type MoneyString = string;

export interface HealthCheckData {
  status: "OK";
}

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

export type ProductSortBy =
  | "productId"
  | "productName"
  | "categoryName"
  | "supplierName"
  | "unitPrice";

export interface ProductListItem {
  productId: number;
  productName: string;
  categoryName: string;
  supplierName: string;
  unitPrice: MoneyString;
  lowStock: boolean;
}

export type ProductDetailData = ProductListItem;

export interface ProductListQuery extends PaginationQuery {
  keyword?: string;
  categoryId?: number;
  supplierId?: number;
  discontinued?: boolean;
  lowStock?: boolean;
  sortBy?: ProductSortBy;
}

export type ProductListData = PaginatedData<ProductListItem>;

export type CustomerSortBy =
  | "customerId"
  | "companyName"
  | "contactName"
  | "country"
  | "city"
  | "orderCount"
  | "totalSales";

export interface CustomerListItem {
  customerId: string;
  companyName: string;
  contactName: string;
  country: string;
  city: string;
  orderCount: number;
  totalSales: MoneyString;
}

export interface CustomerDetailData extends CustomerListItem {
  recentOrderDate: string | null;
}

export interface CustomerOrderListItem {
  orderId: number;
  orderDate: string;
  orderTotal: MoneyString;
}

export interface CustomerListQuery extends PaginationQuery {
  keyword?: string;
  country?: string;
  city?: string;
  sortBy?: CustomerSortBy;
}

export type CustomerListData = PaginatedData<CustomerListItem>;
export type CustomerOrderListData = PaginatedData<CustomerOrderListItem>;
