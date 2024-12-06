"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayPrice = getTodayPrice;
exports.calculateDiscountPercentage = calculateDiscountPercentage;
exports.getPriceOnOrderDate = getPriceOnOrderDate;
function getTodayPrice(product) {
    var _a;
    const today = new Date().toISOString().split("T")[0];
    const todayDiscount = (_a = product.discount.find((discount) => {
        var _a;
        const discountDateString = typeof discount.discountDate === "string"
            ? discount.discountDate
            : (_a = discount.discountDate) === null || _a === void 0 ? void 0 : _a.toISOString();
        return (discountDateString === null || discountDateString === void 0 ? void 0 : discountDateString.split("T")[0]) === today;
    })) === null || _a === void 0 ? void 0 : _a.discountAmount;
    return todayDiscount || product.productPrice;
}
function calculateDiscountPercentage(initialPrice, todayPrice) {
    const difference = initialPrice.minus(todayPrice);
    const percentage = difference.dividedBy(initialPrice).times(100);
    return percentage;
}
function getPriceOnOrderDate(product, orderDate) {
    var _a;
    const orderDateString = orderDate.toISOString().split("T")[0];
    const orderDateDiscount = (_a = product.discount.find((discount) => {
        var _a;
        const discountDateString = typeof discount.discountDate === "string"
            ? discount.discountDate
            : (_a = discount.discountDate) === null || _a === void 0 ? void 0 : _a.toISOString();
        return (discountDateString === null || discountDateString === void 0 ? void 0 : discountDateString.split("T")[0]) === orderDateString;
    })) === null || _a === void 0 ? void 0 : _a.discountAmount;
    return orderDateDiscount || product.productPrice;
}
