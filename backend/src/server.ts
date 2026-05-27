import express from "express";
import cors from "cors";
import { z } from "zod";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Schemas
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

// Routes
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
