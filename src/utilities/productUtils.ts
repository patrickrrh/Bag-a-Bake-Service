import { Decimal } from "@prisma/client/runtime/library";

export function getTodayPrice(product: any): Decimal {
    const today = new Date().toISOString().split("T")[0];
  
    const todayDiscount = product.discount.find((discount: any) => {
      const discountDateString =
        typeof discount.discountDate === "string"
          ? discount.discountDate
          : discount.discountDate?.toISOString();
  
      return discountDateString?.split("T")[0] === today;
    })?.discountAmount;
  
    return todayDiscount || product.productPrice;
}

export function calculateDiscountPercentage(initialPrice: Decimal, todayPrice: Decimal): Decimal {
    const difference = initialPrice.minus(todayPrice);
    const percentage = difference.dividedBy(initialPrice).times(100);
    return percentage;
}

export function getPriceOnOrderDate(product: any, orderDate: Date): Decimal {
  const orderDateString = orderDate.toISOString().split("T")[0];

  const orderDateDiscount = product.discount.find((discount: any) => {
      const discountDateString =
          typeof discount.discountDate === "string"
              ? discount.discountDate
              : discount.discountDate?.toISOString();

      return discountDateString?.split("T")[0] === orderDateString;
  })?.discountAmount;

  return orderDateDiscount || product.productPrice;
}