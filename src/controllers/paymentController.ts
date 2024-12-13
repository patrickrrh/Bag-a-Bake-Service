import { NextFunction, Request, Response } from "express";
import { PaymentServices, CreatePaymentInput } from "../services/paymentServices";
import path from "path";
import fs from "fs";

const paymentServices = new PaymentServices();

export class PaymentController {
    public async findPaymentInfoByBakeryId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bakeryId } = req.body;
            const paymentInfo = await paymentServices.findPaymentInfoByBakeryId(bakeryId);
            console.log("payment info", paymentInfo)
            res.status(200).json({
                status: 200,
                data: paymentInfo
            });
        } catch (error) {
            console.log("[src][controllers][PaymentController][findPaymentInfoByBakeryId] ", error);
            next(error);
        }
    }

    public async updatePayments(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payments: CreatePaymentInput[] = req.body;

            console.log("payments", payments)

            const prevPaymentMethods = await paymentServices.findPaymentInfoByBakeryId(payments[0].bakeryId);
            if (!prevPaymentMethods) {
                console.log("[src][controllers][PaymentController][updatePayments] Payment methods not found");
                res.status(404).json({ status: 404, error: 'Payment methods not found' });
                return;
            }

            let userPrevQris = false;
            const hasPrevQris = prevPaymentMethods.some(p => p.paymentMethod === 'QRIS');
            const isQrisInput = payments.some(p => p.paymentMethod === 'QRIS');

            if (hasPrevQris && isQrisInput && (prevPaymentMethods.find(p => p.paymentMethod === 'QRIS')?.paymentDetail === payments.find(p => p.paymentMethod === 'QRIS')?.paymentDetail)) {
                userPrevQris = true;
            }

            for (const payment of payments) {
                let qrisImage: string | undefined = undefined;

                if (!userPrevQris && payment.paymentMethod === 'QRIS') {
                    const prevQris = prevPaymentMethods.find(p => p.paymentMethod === 'QRIS');
                    if (prevQris) {
                        const oldImagePath = path.join(__dirname, '../../../public_html/uploads/bakery-qris', prevQris.paymentDetail);
                        if (fs.existsSync(oldImagePath)) {
                            fs.unlinkSync(oldImagePath);
                        }
                    }

                    const buffer = Buffer.from(payment.paymentDetail, 'base64');
                    const fileName = `qris-${Date.now()}.jpeg`;

                    const filePath = path.join(__dirname, '../../../public_html/uploads/bakery-qris', fileName);
                    fs.writeFileSync(filePath, buffer);

                    qrisImage = path.join(fileName);
                    payment.paymentDetail = qrisImage;
                }
            }

            await paymentServices.updatePayments(payments);

            console.log("[src][controllers][PaymentController][updatePayments] Payments updated successfully");
            res.status(200).json({ status: 200, message: 'Payments updated successfully' });

        } catch (error) {
            console.log("[src][controllers][PaymentController][updatePayments] ", error);
            next(error);
        }
    }


}