# Bellaria Bakery E-Commerce Platform

Welcome to the integrated frontend and backend repository for **Bellaria Bakery**, a next-generation e-commerce platform beautifully tailored for the Indian market. Designed with a stunning **White & Pink** aesthetic, the application leverages cutting-edge web technologies to provide an engaging, interactive, and highly performant user experience.

---

## 🌟 Key Features

1. **Custom Cake Previewer**
   An interactive builder module allowing users to design their dream cake. Users can select shapes, sizes, sponges, and frostings, visually confirming their choices through a dynamic preview system before seamlessly adding the product to their cart.

2. **Group-Gifting Campaigns**
   A viral growth and customer retention engine that enables users to create a "Group Gift" campaign. A unique, shareable link is generated, allowing multiple friends and family members to collaboratively chip in and crowdfund a premium cake or gift.

3. **AI-Driven Cake Personality Quiz**
   A highly gamified user engagement feature. Users answer fun, targeted questions, and the platform algorithmically matches them with their "Cake Personality," automatically recommending specific products tailored exactly to their tastes.

4. **Robust E-Commerce & Payment Flow**
   Natively integrated with **Razorpay** to support India's primary payment methods (UPI, Cards, and Netbanking). The platform handles local market complexities out-of-the-box, including precise GST logic, accurate INR (₹) formatting, and incredibly secure checkout workflows.

5. **Modern, Responsive White & Pink UI**
   Built with a mobile-first philosophy, the platform embraces an elegant, professional white and pink theme. It is enriched with thoughtful micro-animations, glassmorphism overlays, and smooth layout transitions powered by Framer Motion.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router for both Frontend Pages & Backend API Routes)
- **Styling**: Tailwind CSS v4, Shadcn UI
- **Animations**: Framer Motion, tw-animate-css
- **Forms & Validation**: React Hook Form, Zod
- **Payment Gateway**: Razorpay Integration (Client SDK + Server-side validation)
- **Language**: TypeScript

---

## 🔄 Overall Workflow & User Journey

1. **Discovery & Onboarding**: 
   Users land on the dynamic homepage (`/`). They are greeted with stunning visuals and smooth scroll interactions. From here, they can explore the menu (`/menu`), take the fun cake quiz (`/quiz`), or dive directly into creating a bespoke custom cake (`/custom-cake`).

2. **Engagement & Personalization**:
   - **Quiz Flow**: Navigating the quiz guides the user through interactive prompts, ultimately revealing a personalized product recommendation to drive conversions.
   - **Group Gifting Flow**: A user selects a high-end cake, initiates a campaign (`/group-gift`), and receives a unique URL. Peers visiting this link can securely contribute fractional amounts towards the final goal.

3. **Customization (The Custom Cake Builder)**:
   Users step through a multi-phase form to architect their cake. The UI updates dynamically, reflecting cost adjustments and configuration choices in real-time.

4. **Checkout & Secure Payment**:
   Once items are added to the slide-out Cart Drawer, the user proceeds to checkout (`/checkout`). 
   - A secure request is dispatched to the Next.js API Route (`/api/payment/create-order`) to generate a registered Razorpay order ID.
   - The Razorpay checkout modal opens natively, prompting the user for their payment details via UPI or Cards.
   - Upon a successful transaction, the frontend immediately calls the verification route (`/api/payment/verify`) to cryptographically confirm the payment signature (HMAC validation), officially finalizing the order.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Environment Variables:
   Create a `.env.local` file in the root directory and add your Razorpay credentials (alongside any other required secrets).
   ```env
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

3. Run the Development Server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser. The application will instantly auto-reload as you make changes.

---

## 📂 Project Structure Highlights

- **`app/`**: Contains the Next.js App Router structure, including all public pages (`/menu`, `/quiz`, `/custom-cake`, `/checkout`) and backend API routes (`/api/...`).
- **`components/ui/`**: Highly customized, reusable Shadcn UI elements (Buttons, Inputs, CartDrawer, etc.).
- **`components/layout/`**: Structural wrappers like `Header.tsx`, `Footer.tsx`, and `MobileMenu.tsx`.
- **`components/sections/`**: Modular, landing-page sections (e.g., `HeroSection.tsx`, `NewsletterSection.tsx`).
- **`lib/`**: Core utilities, global configurations, and static data stores (`menuData.ts`).
