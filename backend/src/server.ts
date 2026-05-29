import express from "express";
import cors from "cors";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── Razorpay Instance ─────────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// ─── Schemas ───────────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const createOrderSchema = z.object({
  amount: z.number().positive("Amount must be positive"),        // in paise (₹1 = 100 paise)
  currency: z.string().default("INR"),
  receipt: z.string().optional(),
});

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

// ─── Contact Route ─────────────────────────────────────────────────────────────
app.post("/api/contact", (req, res) => {
  try {
    const validatedData = contactSchema.parse(req.body);
    console.log("Contact form submission received:", validatedData);
    res.status(200).json({ success: true, message: "Thank you! Your message has been sent successfully." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "Validation failed", errors: error.issues });
    } else {
      console.error("Contact form error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
});

// ─── Newsletter Route ──────────────────────────────────────────────────────────
app.post("/api/newsletter", (req, res) => {
  try {
    const validatedData = newsletterSchema.parse(req.body);
    console.log("Newsletter subscription received for:", validatedData.email);
    res.status(200).json({ success: true, message: "Successfully subscribed to the newsletter!" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "Please provide a valid email address." });
    } else {
      console.error("Newsletter error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
});

// ─── Razorpay: Create Order ────────────────────────────────────────────────────
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount, currency, receipt } = createOrderSchema.parse(req.body);

    const options = {
      amount,           // already in paise from frontend
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // auto-capture
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "Invalid order data", errors: error.issues });
    } else {
      console.error("Razorpay order creation error:", error);
      res.status(500).json({ success: false, message: "Could not create payment order" });
    }
  }
});

// ─── Razorpay: Verify Payment ──────────────────────────────────────────────────
app.post("/api/payment/verify", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verifyPaymentSchema.parse(req.body);

    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is authentic — mark order as paid in your DB here
      console.log("Payment verified successfully:", razorpay_payment_id);
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
      });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed. Invalid signature." });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "Invalid verification data", errors: error.issues });
    } else {
      console.error("Payment verification error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
});

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Bellaria Backend is running 🍰" });
});

app.listen(PORT, () => {
  console.log(`🍰 Bellaria Backend running on port ${PORT}`);
});
