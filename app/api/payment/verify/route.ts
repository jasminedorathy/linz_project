import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      verifyPaymentSchema.parse(body);

    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const signatureBody = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signatureBody)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("Payment verified successfully:", razorpay_payment_id);
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid verification data", errors: error.issues },
        { status: 400 }
      );
    }
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
