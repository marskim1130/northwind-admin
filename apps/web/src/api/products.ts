import type {
  ProductDetailData,
  ProductListData,
  ProductListQuery,
  SuccessResponse
} from "@northwind-admin/shared";
import { http } from "./http";

export async function fetchProducts(query: ProductListQuery) {
  const response = await http.get<SuccessResponse<ProductListData>>(
    "/api/products",
    { params: query }
  );

  return response.data.data;
}

export async function fetchProduct(productId: number) {
  const response = await http.get<SuccessResponse<ProductDetailData>>(
    `/api/products/${productId}`
  );

  return response.data.data;
}
