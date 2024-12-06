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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const paymentServices_1 = require("../services/paymentServices");
const paymentServices = new paymentServices_1.PaymentServices();
class PaymentController {
    findPaymentInfoByBakeryId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bakeryId } = req.body;
                const paymentInfo = yield paymentServices.findPaymentInfoByBakeryId(bakeryId);
                console.log("payment info", paymentInfo);
                res.status(200).json({
                    status: 200,
                    data: paymentInfo
                });
            }
            catch (error) {
                console.log("[src][controllers][PaymentController][findPaymentInfoByBakeryId] ", error);
                next(error);
            }
        });
    }
    updatePayments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payments = req.body;
                yield paymentServices.updatePayments(payments);
                console.log("[src][controllers][PaymentController][updatePayments] Payments updated successfully");
                res.status(200).json({ message: 'Payments updated successfully' });
            }
            catch (error) {
                console.log("[src][controllers][PaymentController][updatePayments] ", error);
                next(error);
            }
        });
    }
}
exports.PaymentController = PaymentController;
