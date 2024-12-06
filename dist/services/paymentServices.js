"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServices = void 0;
const script_1 = __importDefault(require("../script"));
class PaymentServices {
    insertPayment(payments) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield script_1.default.getClient().payment.createMany({
                    data: payments,
                });
            }
            catch (error) {
                console.log("[src][services][PaymentServices][insertPayment]", error);
                throw new Error("Failed to insert payment");
            }
        });
    }
    findPaymentInfoByBakeryId(bakeryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().payment.findMany({
                    where: {
                        bakeryId
                    },
                    orderBy: {
                        paymentMethod: "desc"
                    }
                });
            }
            catch (error) {
                console.log("[src][services][PaymentServices][findPaymentInfoByBakeryId]", error);
                throw new Error("Failed to find payment info by bakery ID");
            }
        });
    }
    updatePayments(payments) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("PAYMENT", payments);
            try {
                if (payments.length === 0) {
                    throw new Error("No payments provided for update");
                }
                const bakeryId = payments[0].bakeryId;
                yield script_1.default.getClient().$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                    yield prisma.payment.deleteMany({
                        where: {
                            bakeryId,
                        },
                    });
                    yield prisma.payment.createMany({
                        data: payments.map((payment) => ({
                            bakeryId: payment.bakeryId,
                            paymentMethod: payment.paymentMethod,
                            paymentService: payment.paymentService,
                            paymentDetail: payment.paymentDetail,
                        })),
                    });
                }));
                console.log("[src][services][PaymentServices][updatePayments] Payments updated successfully");
            }
            catch (error) {
                console.log("[src][services][PaymentServices][updatePayments] ", error);
                throw new Error("Failed to update payments");
            }
        });
    }
}
exports.PaymentServices = PaymentServices;
