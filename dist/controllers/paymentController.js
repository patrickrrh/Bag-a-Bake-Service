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
exports.PaymentController = void 0;
const paymentServices_1 = require("../services/paymentServices");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
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
            var _a, _b;
            try {
                const payments = req.body;
                console.log("payments", payments);
                const prevPaymentMethods = yield paymentServices.findPaymentInfoByBakeryId(payments[0].bakeryId);
                if (!prevPaymentMethods) {
                    console.log("[src][controllers][PaymentController][updatePayments] Payment methods not found");
                    res.status(404).json({ status: 404, error: 'Payment methods not found' });
                    return;
                }
                let userPrevQris = false;
                const hasPrevQris = prevPaymentMethods.some(p => p.paymentMethod === 'QRIS');
                const isQrisInput = payments.some(p => p.paymentMethod === 'QRIS');
                if (hasPrevQris && isQrisInput && (((_a = prevPaymentMethods.find(p => p.paymentMethod === 'QRIS')) === null || _a === void 0 ? void 0 : _a.paymentDetail) === ((_b = payments.find(p => p.paymentMethod === 'QRIS')) === null || _b === void 0 ? void 0 : _b.paymentDetail))) {
                    userPrevQris = true;
                }
                for (const payment of payments) {
                    let qrisImage = undefined;
                    if (!userPrevQris && payment.paymentMethod === 'QRIS') {
                        const prevQris = prevPaymentMethods.find(p => p.paymentMethod === 'QRIS');
                        if (prevQris) {
                            const oldImagePath = path_1.default.join(__dirname, '../../../public_html/uploads/bakery-qris', prevQris.paymentDetail);
                            if (fs_1.default.existsSync(oldImagePath)) {
                                fs_1.default.unlinkSync(oldImagePath);
                            }
                        }
                        const buffer = Buffer.from(payment.paymentDetail, 'base64');
                        const fileName = `qris-${Date.now()}.jpeg`;
                        const filePath = path_1.default.join(__dirname, '../../../public_html/uploads/bakery-qris', fileName);
                        fs_1.default.writeFileSync(filePath, buffer);
                        qrisImage = path_1.default.join(fileName);
                        payment.paymentDetail = qrisImage;
                    }
                }
                yield paymentServices.updatePayments(payments);
                console.log("[src][controllers][PaymentController][updatePayments] Payments updated successfully");
                res.status(200).json({ status: 200, message: 'Payments updated successfully' });
            }
            catch (error) {
                console.log("[src][controllers][PaymentController][updatePayments] ", error);
                next(error);
            }
        });
    }
}
exports.PaymentController = PaymentController;
