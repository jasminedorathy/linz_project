import { NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

const createOrderSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("INR"),
  receipt: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, receipt } = createOrderSchema.parse(body);

    const options = {
      amount,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid order data", errors: error.issues },
        { status: 400 }
      );
    }
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { success: false, message: "Could not create payment order" },
      { status: 500 }
    );
  }
}
