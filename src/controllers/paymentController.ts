import { NextFunction, Request, Response } from "express";
import { PaymentServices, CreatePaymentInput } from "../services/paymentServices";

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

    public async updatePayments(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payments: CreatePaymentInput[] = req.body;
            
            await paymentServices.updatePayments(payments);
            
            console.log("[src][controllers][PaymentController][updatePayments] Payments updated successfully");
            res.status(200).json({ message: 'Payments updated successfully' });
            
        } catch (error) {
            console.log("[src][controllers][PaymentController][updatePayments] ", error);
            next(error);
        }
    }
    
  
}