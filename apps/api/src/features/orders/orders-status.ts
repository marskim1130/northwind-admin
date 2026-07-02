export type OrderStatus = "Pending" | "Shipped" | "Late" | "On Time";

interface DeriveOrderStatusInput {
  shippedDate: string | Date | null;
  requiredDate: string | Date | null;
}

export function deriveOrderStatus(input: DeriveOrderStatusInput): OrderStatus {
  if (!input.shippedDate) {
    return "Pending";
  }

  if (!input.requiredDate) {
    return "Shipped";
  }

  return new Date(input.shippedDate).getTime() > new Date(input.requiredDate).getTime()
    ? "Late"
    : "On Time";
}
