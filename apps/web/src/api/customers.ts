import type {
  CustomerDetailData,
  CustomerListData,
  CustomerListQuery,
  CustomerOrderListData,
  SuccessResponse
} from "@northwind-admin/shared";
import { http } from "./http";

export async function fetchCustomers(query: CustomerListQuery) {
  const response = await http.get<SuccessResponse<CustomerListData>>(
    "/api/customers",
    { params: query }
  );

  return response.data.data;
}

export async function fetchCustomer(customerId: string) {
  const response = await http.get<SuccessResponse<CustomerDetailData>>(
    `/api/customers/${customerId}`
  );

  return response.data.data;
}

export async function fetchCustomerOrders(customerId: string) {
  const response = await http.get<SuccessResponse<CustomerOrderListData>>(
    `/api/customers/${customerId}/orders`
  );

  return response.data.data;
}
