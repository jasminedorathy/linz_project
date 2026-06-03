"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SectionHeading from "@/components/ui/SectionHeading";
import { Calendar, Clock, Users, Coffee, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  consultationType: z.enum(["wedding", "milestone", "corporate"]),
  date: z.string().min(1, "Please select a tasting date"),
  time: z.string().min(1, "Please select a time slot"),
  guests: z.string().min(1, "Please select number of guests"),
  notes: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

const consTypes = [
  { id: "wedding", label: "Wedding Cake Tasting", desc: "Private tasting session with our lead pastry chef to design your dream wedding cake.", duration: "60 mins", price: 30 },
  { id: "milestone", label: "Milestone Celebration Tasting", desc: "For large birthdays, anniversaries, or baby showers. Taste and consult layout.", duration: "45 mins", price: 20 },
  { id: "corporate", label: "Corporate Catering Consultation", desc: "Review options for large events, custom branding on items, and cupcakes.", duration: "30 mins", price: 0 },
];

export default function ConsultationBookingPage() {
  const [success, setSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      consultationType: "wedding",
      guests: "2",
    }
  });

  const watchType = watch("consultationType");

  const onSubmit = async (data: BookingForm) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const selectedType = consTypes.find((t) => t.id === data.consultationType);

    const booking = {
      bookingId: `BOOK-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: { name: data.name, email: data.email, phone: data.phone },
      typeLabel: selectedType?.label,
      date: data.date,
      time: data.time,
      guests: data.guests,
      price: selectedType?.price || 0,
      notes: data.notes,
    };

    // Save bookings in localStorage
    const existing = JSON.parse(localStorage.getItem("linz_baking_bookings") || "[]");
    localStorage.setItem("linz_baking_bookings", JSON.stringify([booking, ...existing]));

    setBookingDetails(booking);
    setIsSubmitting(false);
    setSuccess(true);
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 bg-white";
  const inputStyle = { borderColor: "#e5e7eb", color: "var(--color-text)" };

  if (success && bookingDetails) {
    return (
      <div className="py-20 min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full mx-6 bg-white rounded-3xl p-8 shadow-xl text-center flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
            <CheckCircle2 size={44} className="text-rose-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Consultation Booked!
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Your appointment code is{" "}
              <span className="font-semibold text-pink-950">{bookingDetails.bookingId}</span>.
            </p>
          </div>

          <div className="w-full bg-gray-50 rounded-2xl p-6 text-left space-y-4 text-sm">
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-400">Consultation Type</span>
              <span className="font-semibold text-gray-800">{bookingDetails.typeLabel}</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-400">Date & Time</span>
              <span className="font-medium text-gray-800">
                {bookingDetails.date} at {bookingDetails.time}
              </span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-400">Guests attending</span>
              <span className="font-medium text-gray-800">{bookingDetails.guests} persons</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Consultation Fee</span>
              <span className="font-bold text-gray-800">
                {bookingDetails.price > 0 ? `$${bookingDetails.price.toFixed(2)}` : "Free"}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
            A tasting box containing 4 sample sponge combinations and buttercream variants will be prepared for you. We look forward to meeting you!
          </p>

          <Link
            href="/"
            className="py-3.5 px-8 rounded-full text-white text-sm font-semibold transition-all hover:brightness-95"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Go Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <section
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg,#1a1008 0%,#3a1e08 100%)" }}
      >
        <span
          className="block text-4xl mb-2"
          style={{ fontFamily: "var(--font-script)", color: "var(--color-primary)" }}
        >
          Special Events
        </span>
        <h1
          className="text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Book a Tasting Session
        </h1>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Left panel — Consultation packages */}
          <div className="lg:col-span-2 space-y-6">
            <SectionHeading subtitle="Tasting Sessions" title="Select Your Consultation" align="left" />
            <div className="space-y-4">
              {consTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-6 rounded-2xl border bg-white transition-all ${
                    watchType === type.id ? "border-rose-500 ring-2 ring-pink-50" : "border-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-pink-950">{type.label}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Duration: {type.duration} · {type.price > 0 ? `$${type.price} Fee` : "Free"}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                        watchType === type.id
                          ? "bg-rose-600 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {type.id}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 leading-relaxed">{type.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Form panel */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-sm">
            <h3 className="font-bold text-lg mb-6 border-b pb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Reservation Details
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-4">
                {/* Consultation type hidden register */}
                <div className="grid grid-cols-3 gap-2">
                  {consTypes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setValue("consultationType", t.id as any)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                        watchType === t.id ? "bg-rose-600 text-white border-rose-500" : "bg-white text-gray-500 border-gray-200"
                      }`}
                    >
                      {t.id === "wedding" ? "Wedding" : t.id === "milestone" ? "Milestone" : "Corporate"}
                    </button>
                  ))}
                </div>

                <div>
                  <input
                    placeholder="Your Name"
                    {...register("name")}
                    className={inputClass}
                    style={inputStyle}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      {...register("email")}
                      className={inputClass}
                      style={inputStyle}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      {...register("phone")}
                      className={inputClass}
                      style={inputStyle}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-4 text-gray-400" />
                    <input
                      type="date"
                      {...register("date")}
                      className={inputClass}
                      style={inputStyle}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                  </div>

                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-4 text-gray-400" />
                    <select
                      {...register("time")}
                      className={`${inputClass} appearance-none bg-white`}
                      style={inputStyle}
                    >
                      <option value="">Time Slot</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:30 PM">02:30 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                    </select>
                    {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
                  </div>

                  <div className="relative">
                    <Users size={16} className="absolute left-3.5 top-4 text-gray-400" />
                    <select
                      {...register("guests")}
                      className={`${inputClass} appearance-none bg-white`}
                      style={inputStyle}
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                    </select>
                    {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests.message}</p>}
                  </div>
                </div>

                <div>
                  <textarea
                    placeholder="Briefly describe your event theme, estimated headcount, and flavor preferences..."
                    {...register("notes")}
                    className={`${inputClass} resize-none`}
                    rows={4}
                    style={inputStyle}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl text-white font-bold text-sm transition-all hover:brightness-95 flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <Coffee size={16} />
                {isSubmitting ? "Reserving Slot..." : "Confirm Tasting Slot"}
              </motion.button>
            </form>
          </div>

        </div>
      </section>
    </>
  );
}
