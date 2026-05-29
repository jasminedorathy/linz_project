"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SectionHeading from "@/components/ui/SectionHeading";
import { Check, ChevronRight, ChevronLeft, Sparkles, Cake, HelpCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const cakeSchema = z.object({
  shape: z.enum(["round", "square", "heart"]),
  size: z.enum(["6inch", "8inch", "10inch", "2tier"]),
  flavour: z.enum(["vanilla", "chocolate", "redvelvet", "lemon", "caramel"]),
  frosting: z.enum(["buttercream_smooth", "buttercream_rustic", "fondant"]),
  decorations: z.array(z.string()).default([]),
  writing: z.string().max(40, "Writing must be under 40 characters").optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  instructions: z.string().optional(),
});

type CakeForm = z.infer<typeof cakeSchema>;

const shapes = [
  { id: "round", label: "Classic Round", desc: "Perfect for any celebration", extraPrice: 0 },
  { id: "square", label: "Modern Square", desc: "Clean lines and geometric style", extraPrice: 200 },
  { id: "heart", label: "Romantic Heart", desc: "Ideal for anniversaries & weddings", extraPrice: 400 },
];

const sizes = [
  { id: "6inch", label: '6" Round / Square', desc: "Serves 8-10 people", basePrice: 1200 },
  { id: "8inch", label: '8" Round / Square', desc: "Serves 15-20 people", basePrice: 1800 },
  { id: "10inch", label: '10" Round / Square', desc: "Serves 25-30 people", basePrice: 2500 },
  { id: "2tier", label: '2-Tier Cake (6" + 8")', desc: "Serves 35-45 people", basePrice: 4200 },
];

const flavours = [
  { id: "vanilla", label: "Madagascar Vanilla Bean", desc: "Classic white sponge with vanilla seed buttercream", extraPrice: 0 },
  { id: "chocolate", label: "Double Chocolate Decadence", desc: "Rich chocolate sponge with chocolate ganache frosting", extraPrice: 0 },
  { id: "redvelvet", label: "Velvety Red Velvet", desc: "Traditional red velvet sponge with cream cheese filling", extraPrice: 200 },
  { id: "lemon", label: "Zesty Lemon Berry", desc: "Lemon sponge infused with fresh raspberry compote", extraPrice: 300 },
  { id: "caramel", label: "Salted Caramel Drip", desc: "Caramel sponge with buttercream & salted caramel drip", extraPrice: 300 },
];

const frostings = [
  { id: "buttercream_smooth", label: "Smooth Buttercream", desc: "Silky exterior style", extraPrice: 0 },
  { id: "buttercream_rustic", label: "Rustic Semi-Naked", desc: "Thin coat with cake showing through", extraPrice: 0 },
  { id: "fondant", label: "Sleek Fondant Finish", desc: "Perfect canvas for heavy/intricate decoration", extraPrice: 500 },
];

const decorationOptions = [
  { id: "fresh_berries", label: "Fresh Seasonal Berries", desc: "Strawberries, blueberries & raspberries", price: 400 },
  { id: "macarons", label: "Sweet French Macarons", desc: "Artisanal bakery macarons", price: 550 },
  { id: "piped_flowers", label: "Buttercream Piped Flowers", desc: "Hand-piped floral accents", price: 350 },
  { id: "gold_leaf", label: "24K Edible Gold Leaf", desc: "Glamorous metallic flakes", price: 650 },
  { id: "chocolate_drip", label: "Rich Chocolate Ganache Drip", desc: "Classic drip down the sides", price: 280 },
];

export default function CustomCakePage() {
  const [step, setStep] = useState(1);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CakeForm>({
    resolver: zodResolver(cakeSchema),
    defaultValues: {
      shape: "round",
      size: "6inch",
      flavour: "vanilla",
      frosting: "buttercream_smooth",
      decorations: [],
      writing: "",
      instructions: "",
    },
  });

  const watchShape = watch("shape");
  const watchSize = watch("size");
  const watchFlavour = watch("flavour");
  const watchFrosting = watch("frosting");
  const watchDecorations = watch("decorations") || [];

  // Calculate pricing
  const baseSizePrice = sizes.find((s) => s.id === watchSize)?.basePrice || 0;
  const shapeAddon = shapes.find((s) => s.id === watchShape)?.extraPrice || 0;
  const flavourAddon = flavours.find((f) => f.id === watchFlavour)?.extraPrice || 0;
  const frostingAddon = frostings.find((f) => f.id === watchFrosting)?.extraPrice || 0;
  const decorsAddon = watchDecorations.reduce((sum, dId) => {
    const item = decorationOptions.find((o) => o.id === dId);
    return sum + (item ? item.price : 0);
  }, 0);

  const totalPrice = baseSizePrice + shapeAddon + flavourAddon + frostingAddon + decorsAddon;

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data: CakeForm) => {
    // Generate order ID
    const randomId = `CAKE-${Math.floor(100000 + Math.random() * 900000)}`;

    const customCakeOrder = {
      orderId: randomId,
      customer: { name: data.name, email: data.email, phone: data.phone },
      cakeDetails: {
        shape: data.shape,
        size: data.size,
        flavour: data.flavour,
        frosting: data.frosting,
        decorations: data.decorations,
        writing: data.writing,
        instructions: data.instructions,
      },
      price: totalPrice,
      type: "custom_cake",
      status: "pending",
      date: new Date().toLocaleDateString(),
    };

    // Store order mock database
    const existingOrders = JSON.parse(localStorage.getItem("bellaria_orders") || "[]");
    localStorage.setItem("bellaria_orders", JSON.stringify([customCakeOrder, ...existingOrders]));

    setOrderId(randomId);
    setSubmitSuccess(true);
  };

  const inputClass = "w-full pl-4 pr-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 bg-white";
  const inputStyle = { borderColor: "#e5e7eb", color: "var(--color-text)" };

  if (submitSuccess) {
    return (
      <div className="py-20 min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full mx-6 bg-white rounded-3xl p-8 shadow-xl text-center flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 size={44} className="text-green-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Inquiry Received!
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Your custom design query has been submitted. Reference code:{" "}
              <span className="font-semibold text-black">{orderId}</span>.
            </p>
          </div>

          <p className="text-sm text-gray-500 max-w-sm">
            We will contact you within 24 hours to review your selection, confirm cake aesthetics, and finalize deposit payment.
          </p>

          <Link
            href="/menu"
            className="py-3.5 px-8 rounded-full text-white text-sm font-semibold transition-all hover:brightness-95"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Back to Menu
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
          Bespoke Baking
        </span>
        <h1
          className="text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Design Your Own Cake
        </h1>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Form Area */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm relative flex flex-col justify-between min-h-[500px]">
            {/* Step Indicators */}
            <div className="flex items-center justify-between border-b pb-6 mb-8 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <span className={step === 1 ? "text-amber-600 font-bold" : ""}>1. Shape & Size</span>
              <span className={step === 2 ? "text-amber-600 font-bold" : ""}>2. Sponge & Frosting</span>
              <span className={step === 3 ? "text-amber-600 font-bold" : ""}>3. Decorations</span>
              <span className={step === 4 ? "text-amber-600 font-bold" : ""}>4. Checkout details</span>
            </div>

            {/* Steps Content */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between">
              <div>
                <AnimatePresence mode="wait">
                  {/* STEP 1 */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                          Choose Shape
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {shapes.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setValue("shape", item.id as any)}
                              className={`p-5 rounded-2xl border-2 text-left relative transition-all ${
                                watchShape === item.id ? "border-amber-600 bg-amber-50/20" : "border-gray-200"
                              }`}
                            >
                              {watchShape === item.id && (
                                <span className="absolute top-3 right-3 w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center">
                                  <Check size={12} color="#fff" />
                                </span>
                              )}
                              <h4 className="font-bold text-sm text-gray-900">{item.label}</h4>
                              <p className="text-xs text-gray-500 mt-1 leading-normal">{item.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                          Select Size
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {sizes.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setValue("size", item.id as any)}
                              className={`p-5 rounded-2xl border-2 text-left relative transition-all ${
                                watchSize === item.id ? "border-amber-600 bg-amber-50/20" : "border-gray-200"
                              }`}
                            >
                              {watchSize === item.id && (
                                <span className="absolute top-3 right-3 w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center">
                                  <Check size={12} color="#fff" />
                                </span>
                              )}
                              <h4 className="font-bold text-sm text-gray-900">{item.label}</h4>
                              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                              <p className="text-sm font-semibold mt-2" style={{ color: "var(--color-primary)" }}>
                                Base: ₹{item.basePrice}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                          Sponge Flavour
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {flavours.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setValue("flavour", item.id as any)}
                              className={`p-5 rounded-2xl border-2 text-left relative transition-all ${
                                watchFlavour === item.id ? "border-amber-600 bg-amber-50/20" : "border-gray-200"
                              }`}
                            >
                              {watchFlavour === item.id && (
                                <span className="absolute top-3 right-3 w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center">
                                  <Check size={12} color="#fff" />
                                </span>
                              )}
                              <h4 className="font-bold text-sm text-gray-900">{item.label}</h4>
                              <p className="text-xs text-gray-500 mt-1 leading-normal">{item.desc}</p>
                              {item.extraPrice > 0 && (
                                <p className="text-xs font-semibold mt-2 text-amber-600">
                                  +₹{item.extraPrice}
                                </p>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                          Frosting Finish
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {frostings.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setValue("frosting", item.id as any)}
                              className={`p-5 rounded-2xl border-2 text-left relative transition-all ${
                                watchFrosting === item.id ? "border-amber-600 bg-amber-50/20" : "border-gray-200"
                              }`}
                            >
                              {watchFrosting === item.id && (
                                <span className="absolute top-3 right-3 w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center">
                                  <Check size={12} color="#fff" />
                                </span>
                              )}
                              <h4 className="font-bold text-sm text-gray-900">{item.label}</h4>
                              <p className="text-xs text-gray-500 mt-1 leading-normal">{item.desc}</p>
                              {item.extraPrice > 0 && (
                                <p className="text-xs font-semibold mt-2 text-amber-600">
                                  +₹{item.extraPrice}
                                </p>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                          Decorations (Optional Add-ons)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {decorationOptions.map((item) => {
                            const isChecked = watchDecorations.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  if (isChecked) {
                                    setValue(
                                      "decorations",
                                      watchDecorations.filter((id) => id !== item.id)
                                    );
                                  } else {
                                    setValue("decorations", [...watchDecorations, item.id]);
                                  }
                                }}
                                className={`p-5 rounded-2xl border-2 text-left relative transition-all ${
                                  isChecked ? "border-amber-600 bg-amber-50/20" : "border-gray-200"
                                }`}
                              >
                                {isChecked && (
                                  <span className="absolute top-3 right-3 w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center">
                                    <Check size={12} color="#fff" />
                                  </span>
                                )}
                                <h4 className="font-bold text-sm text-gray-900">{item.label}</h4>
                                <p className="text-xs text-gray-500 mt-1 leading-normal">{item.desc}</p>
                                <p className="text-xs font-semibold mt-2 text-amber-600">+₹{item.price}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-gray-800">
                          Custom Message Writing (Piped on top/board)
                        </h3>
                        <input
                          placeholder="e.g. Happy 30th Birthday Jessica! (Max 40 chars)"
                          {...register("writing")}
                          className={inputClass}
                          style={inputStyle}
                        />
                        {errors.writing && <p className="text-red-500 text-xs">{errors.writing.message}</p>}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4 */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                        Confirm Your Order Details
                      </h3>
                      
                      <div className="space-y-4">
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

                        <div>
                          <textarea
                            placeholder="Provide any additional specifications, color details, or theme notes..."
                            {...register("instructions")}
                            className={`${inputClass} resize-none`}
                            rows={4}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center mt-12 border-t pt-6">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 font-bold text-sm text-gray-500 hover:text-black transition-colors"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 py-3 px-8 rounded-full text-white font-bold text-sm transition-all hover:brightness-95"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="py-3.5 px-10 rounded-full text-white font-bold text-sm transition-all hover:brightness-95"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    Submit Custom Order
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Pricing Summary Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-28 space-y-6 border border-gray-100">
              <h3 className="font-bold text-lg border-b pb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Selected Aesthetics
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-800 capitalize">{watchShape} Shape</p>
                    <p className="text-xs text-gray-400">
                      {sizes.find((s) => s.id === watchSize)?.label}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ₹{baseSizePrice + shapeAddon}
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-800 capitalize">
                      {flavours.find((f) => f.id === watchFlavour)?.label}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {frostings.find((f) => f.id === watchFrosting)?.label}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ₹{flavourAddon + frostingAddon}
                  </span>
                </div>

                {watchDecorations.length > 0 && (
                  <div className="border-t pt-4 space-y-2">
                    <p className="font-semibold text-xs text-gray-400 uppercase tracking-wider">Decorations</p>
                    {watchDecorations.map((dId) => {
                      const item = decorationOptions.find((o) => o.id === dId);
                      return (
                        <div key={dId} className="flex justify-between text-xs text-gray-600">
                          <span>{item?.label}</span>
                          <span className="font-medium">+₹{item?.price}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={16} className="text-amber-500" /> Estimate
                  </span>
                  <span style={{ color: "var(--color-primary)" }}>₹{totalPrice.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
