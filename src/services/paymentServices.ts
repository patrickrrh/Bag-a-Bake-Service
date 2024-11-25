import { Payment } from "@prisma/client";
import databaseService from "../script";

export interface CreatePaymentInput {
  bakeryId: number;
  paymentMethod: string;
  paymentService: string;
  paymentDetail: string;
}

export class PaymentServices {
  public async insertPayment(payments: CreatePaymentInput[]): Promise<void> {
    try {
      await databaseService.getClient().payment.createMany({
        data: payments,
      });
    } catch (error) {
      console.log("[src][services][PaymentServices][insertPayment]", error);
      throw new Error("Failed to insert payment");
    }
  }

    public async findPaymentInfoByBakeryId(bakeryId: number): Promise<Payment[] | null> {
        try {
            return await databaseService.getClient().payment.findMany({
                where: {
                    bakeryId
                },
                orderBy: {
                    paymentMethod: "desc"
                }
            })
        } catch (error) {
            console.log("[src][services][PaymentServices][findPaymentInfoByBakeryId]", error);
            throw new Error("Failed to find payment info by bakery ID");
        }
    }

    public async updatePayments(payments: CreatePaymentInput[]): Promise<void> {
      console.log("PAYMENT", payments);
      try {
        if (payments.length === 0) {
          throw new Error("No payments provided for update");
        }
  
        const bakeryId = payments[0].bakeryId;
  
        await databaseService.getClient().$transaction(async (prisma) => {
          await prisma.payment.deleteMany({
            where: {
              bakeryId,
            },
          });
  
          await prisma.payment.createMany({
            data: payments.map((payment) => ({
              bakeryId: payment.bakeryId,
              paymentMethod: payment.paymentMethod,
              paymentService: payment.paymentService,
              paymentDetail: payment.paymentDetail,
            })),
          });
        });
  
        console.log(
          "[src][services][PaymentServices][updatePayments] Payments updated successfully"
        );
      } catch (error) {
        console.log("[src][services][PaymentServices][updatePayments] ", error);
        throw new Error("Failed to update payments");
      }
    }
}