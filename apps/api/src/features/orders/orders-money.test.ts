import { describe, expect, it } from "vitest";
import { calculateOrderMoney } from "./orders-money";

describe("Orders 金额计算 [Money Calculation]", () => {
  it("计算行金额、商品合计与订单总额 [Line Total, Items Total, Order Total]", () => {
    const result = calculateOrderMoney({
      freight: "3.50",
      items: [
        { unitPrice: "10.00", quantity: 3, discount: 0.1 },
        { unitPrice: "5.00", quantity: 2, discount: 0 }
      ]
    });

    expect(result).toEqual({
      items: [
        { unitPrice: "10.00", quantity: 3, discount: 0.1, lineTotal: "27.00" },
        { unitPrice: "5.00", quantity: 2, discount: 0, lineTotal: "10.00" }
      ],
      itemsTotal: "37.00",
      freight: "3.50",
      orderTotal: "40.50"
    });
  });
});
