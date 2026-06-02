"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SectionHeading from "@/components/ui/SectionHeading";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";

const schema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters"),
  email:   z.string().email("Please enter a valid email"),
  phone:   z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type FormData = z.infer<typeof schema>;

const contactInfo = [
  { icon: MapPin, label: "Address",   value: "42, Anna Salai, Nungambakkam, Chennai – 600 006, Tamil Nadu" },
  { icon: Phone,  label: "Phone",     value: "+91 98765 43210" },
  { icon: Mail,   label: "Email",     value: "hello@linzbaking.in" },
  { icon: Clock,  label: "Hours",     value: "Mon–Sat 8AM–9PM · Sun 9AM–6PM" },
];

export default function ContactPage() {
  const [submitStatus, setSubmitStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitStatus("loading");
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitStatus("success");
        setStatusMsg(json.message);
        reset();
      } else {
        setSubmitStatus("error");
        setStatusMsg(json.message || "Something went wrong.");
      }
    } catch {
      setSubmitStatus("error");
      setStatusMsg("Network error. Please try again.");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 bg-white";
  const inputStyle = { borderColor: "#e5e7eb", color: "var(--color-text)" };

  return (
    <>
      {/* Page hero */}
      <section
        className="py-24 text-center"
        style={{ background: "linear-gradient(135deg,#1a1008 0%,#3a1e08 100%)" }}
      >
        <span
          className="block text-5xl mb-3"
          style={{ fontFamily: "var(--font-script)", color: "var(--color-primary)" }}
        >
          Get In Touch
        </span>
        <h1
          className="text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Contact Us
        </h1>
      </section>

      <section className="py-20" style={{ backgroundColor: "var(--color-secondary)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left — info */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <SectionHeading subtitle="Say Hello" title="We'd Love to Hear From You" align="left" />
            <ul className="flex flex-col gap-5">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex gap-4 items-start">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    <Icon size={18} color="#fff" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-lg">
            <h2
              className="text-2xl font-semibold mb-6"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
            >
              Send a Message
            </h2>

            {submitStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-12 text-center"
              >
                <CheckCircle2 size={52} style={{ color: "var(--color-primary)" }} />
                <p className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>{statusMsg}</p>
                <button
                  onClick={() => setSubmitStatus("idle")}
                  className="text-sm underline"
                  style={{ color: "var(--color-primary)" }}
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form id="contact-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <input id="contact-name" placeholder="Your Name" {...register("name")}
                      className={inputClass} style={inputStyle} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <input id="contact-email" type="email" placeholder="Email Address" {...register("email")}
                      className={inputClass} style={inputStyle} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <input id="contact-phone" type="tel" placeholder="Phone (optional)" {...register("phone")}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <input id="contact-subject" placeholder="Subject" {...register("subject")}
                      className={inputClass} style={inputStyle} />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                  </div>
                </div>
                <div>
                  <textarea id="contact-message" rows={5} placeholder="Your message..." {...register("message")}
                    className={`${inputClass} resize-none`} style={inputStyle} />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                {submitStatus === "error" && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle size={16} />{statusMsg}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={submitStatus === "loading"}
                  id="contact-submit-btn"
                  className="flex items-center justify-center gap-2 text-white font-semibold py-4 rounded-xl transition-opacity disabled:opacity-60"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <Send size={16} />
                  {submitStatus === "loading" ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
