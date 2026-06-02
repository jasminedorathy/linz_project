"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, LogIn, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const { register: registerSignup, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema)
  });

  const onLogin = async (data: LoginForm) => {
    setErrorMsg("");
    // Look up user in localStorage
    const users = JSON.parse(localStorage.getItem("linz_baking_users") || "[]");
    const user = users.find((u: any) => u.email === data.email);

    if (user && user.password === data.password) {
      localStorage.setItem("linz_baking_current_user", JSON.stringify(user));
      router.push("/profile");
      // Force header update
      window.dispatchEvent(new Event("storage"));
    } else if (data.email === "admin@linzbaking.com" && data.password === "admin123") {
      // Direct Admin shortcut
      const adminUser = { name: "Admin Manager", email: "admin@linzbaking.com", isAdmin: true };
      localStorage.setItem("linz_baking_current_user", JSON.stringify(adminUser));
      router.push("/admin");
    } else {
      setErrorMsg("Invalid email or password.");
    }
  };

  const onSignup = async (data: SignupForm) => {
    setErrorMsg("");
    const users = JSON.parse(localStorage.getItem("linz_baking_users") || "[]");
    const exists = users.some((u: any) => u.email === data.email);

    if (exists) {
      setErrorMsg("Account with this email already exists.");
      return;
    }

    const newUser = {
      name: data.name,
      email: data.email,
      password: data.password,
      loyaltyPoints: 120, // free starter points
      createdAt: new Date().toLocaleDateString(),
    };

    localStorage.setItem("linz_baking_users", JSON.stringify([...users, newUser]));
    localStorage.setItem("linz_baking_current_user", JSON.stringify(newUser));
    router.push("/profile");
    // Force header update
    window.dispatchEvent(new Event("storage"));
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 bg-white";
  const inputStyle = { borderColor: "#e5e7eb", color: "var(--color-text)" };

  return (
    <>
      <section
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg,#1a1008 0%,#3a1e08 100%)" }}
      >
        <h1
          className="text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {isLogin ? "Welcome Back" : "Join Linz Baking Family"}
        </h1>
      </section>

      <section className="py-20 bg-gray-50 flex items-center justify-center min-h-[600px]">
        <div className="max-w-md w-full mx-6 bg-white rounded-3xl p-8 shadow-lg space-y-6">
          <div className="flex border-b text-sm font-semibold">
            <button
              onClick={() => { setIsLogin(true); setErrorMsg(""); }}
              className={`flex-1 pb-3 text-center border-b-2 transition-all ${
                isLogin ? "border-pink-600 text-pink-600 font-bold" : "border-transparent text-gray-400"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setErrorMsg(""); }}
              className={`flex-1 pb-3 text-center border-b-2 transition-all ${
                !isLogin ? "border-pink-600 text-pink-600 font-bold" : "border-transparent text-gray-400"
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <p className="text-red-500 text-xs font-semibold text-center">{errorMsg}</p>
          )}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  {...registerLogin("email")}
                  className={inputClass}
                  style={inputStyle}
                />
                {loginErrors.email && <p className="text-red-500 text-xs mt-1">{loginErrors.email.message}</p>}
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  {...registerLogin("password")}
                  className={inputClass}
                  style={inputStyle}
                />
                {loginErrors.password && <p className="text-red-500 text-xs mt-1">{loginErrors.password.message}</p>}
              </div>

              <div className="text-right text-xs">
                <span className="text-gray-400 italic">Demo admin login: admin@linzbaking.com / admin123</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:brightness-95 flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <LogIn size={16} /> Sign In
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-4">
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-4 text-gray-400" />
                <input
                  placeholder="Your Name"
                  {...registerSignup("name")}
                  className={inputClass}
                  style={inputStyle}
                />
                {signupErrors.name && <p className="text-red-500 text-xs mt-1">{signupErrors.name.message}</p>}
              </div>

              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  {...registerSignup("email")}
                  className={inputClass}
                  style={inputStyle}
                />
                {signupErrors.email && <p className="text-red-500 text-xs mt-1">{signupErrors.email.message}</p>}
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="Create Password"
                  {...registerSignup("password")}
                  className={inputClass}
                  style={inputStyle}
                />
                {signupErrors.password && <p className="text-red-500 text-xs mt-1">{signupErrors.password.message}</p>}
              </div>

              <div className="bg-pink-50 p-4 rounded-2xl flex items-center gap-3 border border-pink-100">
                <Sparkles size={20} className="text-pink-500 flex-shrink-0" />
                <p className="text-xs text-pink-900 leading-normal">
                  Receive **120 loyalty points** instantly upon signing up! Redeemable for a free cookie on your next visit.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:brightness-95"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Sign Up & Claim Rewards
              </motion.button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
