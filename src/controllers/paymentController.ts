import { NextFunction, Request, Response } from "express";
import { PaymentServices } from "../services/paymentServices";

const paymentServices = new PaymentServices();

export class PaymentController {
    public async findPaymentInfoByBakeryId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bakeryId } = req.body; 
            const paymentInfo = await paymentServices.findPaymentInfoByBakeryId(bakeryId);
            res.status(200).json({
                status: 200,
                data: paymentInfo
            });
        } catch (error) {
            console.log("[src][controllers][PaymentController][findPaymentInfoByBakeryId] ", error);
            next(error);
        }
    }
}