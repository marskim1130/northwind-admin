import { describe, expect, it } from "vitest";
import { deriveOrderStatus } from "./orders-status";

describe("Orders 状态推导 [Order Status Derivation]", () => {
  it("按发货日期与要求日期推导订单状态 [Derive Status From Dates]", () => {
    expect(
      deriveOrderStatus({ shippedDate: null, requiredDate: "1997-01-10" })
    ).toBe("Pending");
    expect(
      deriveOrderStatus({
        shippedDate: "1997-01-11",
        requiredDate: "1997-01-10"
      })
    ).toBe("Late");
    expect(
      deriveOrderStatus({
        shippedDate: "1997-01-10",
        requiredDate: "1997-01-10"
      })
    ).toBe("On Time");
    expect(
      deriveOrderStatus({ shippedDate: "1997-01-10", requiredDate: null })
    ).toBe("Shipped");
  });
});
