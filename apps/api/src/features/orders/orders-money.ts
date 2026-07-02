interface OrderMoneyItemInput {
  unitPrice: string | number;
  quantity: number;
  discount: number;
}

interface CalculateOrderMoneyInput {
  freight: string | number;
  items: OrderMoneyItemInput[];
}

function toMoneyString(value: number) {
  return value.toFixed(2);
}

export function calculateOrderMoney(input: CalculateOrderMoneyInput) {
  let itemsTotal = 0;
  const items = input.items.map((item) => {
    const lineTotal =
      Number(item.unitPrice) * item.quantity * (1 - item.discount);

    itemsTotal += lineTotal;

    return {
      ...item,
      unitPrice: toMoneyString(Number(item.unitPrice)),
      lineTotal: toMoneyString(lineTotal)
    };
  });
  const freight = Number(input.freight);

  return {
    items,
    itemsTotal: toMoneyString(itemsTotal),
    freight: toMoneyString(freight),
    orderTotal: toMoneyString(itemsTotal + freight)
  };
}
