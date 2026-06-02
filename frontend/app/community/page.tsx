"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Star, Heart, Upload, X, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface Photo {
  id: string;
  dataUrl: string;
  name: string;
  caption: string;
  occasion: string;
  rating: number;
  likes: number;
  createdAt: string;
}

const SEED_PHOTOS: Photo[] = [
  { id: "s1", dataUrl: "/images/cake-1.png", name: "Aarav M.", caption: "Perfect for my son's birthday! The chocolate layers were divine 😍", occasion: "Birthday", rating: 5, likes: 24, createdAt: "12 May 2026" },
  { id: "s2", dataUrl: "/images/cake-2.png", name: "Sneha R.", caption: "Our wedding cake was everything we dreamed of. Bellaria made it magical.", occasion: "Wedding", rating: 5, likes: 41, createdAt: "02 Apr 2026" },
  { id: "s3", dataUrl: "/images/pastry-1.png", name: "Karthik S.", caption: "The almond croissants are absolutely flaky and perfect every single time!", occasion: "Daily Treat", rating: 4, likes: 17, createdAt: "28 Mar 2026" },
];

export default function CommunityPage() {
  const [photos, setPhotos] = useState<Photo[]>(SEED_PHOTOS);
  const [showUpload, setShowUpload] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", caption: "", occasion: "Birthday", rating: 5 });
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bellaria_community") || "[]");
    if (stored.length) setPhotos([...stored, ...SEED_PHOTOS]);
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submitPhoto = () => {
    if (!preview || !form.name.trim() || !form.caption.trim()) return;
    const newPhoto: Photo = {
      id: `u${Date.now()}`,
      dataUrl: preview,
      name: form.name,
      caption: form.caption,
      occasion: form.occasion,
      rating: form.rating,
      likes: 0,
      createdAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    };
    const updated = [newPhoto, ...photos];
    const userPhotos = updated.filter((p) => p.id.startsWith("u"));
    localStorage.setItem("bellaria_community", JSON.stringify(userPhotos));
    setPhotos(updated);
    setSubmitted(true);
    setTimeout(() => { setShowUpload(false); setSubmitted(false); setPreview(null); setForm({ name: "", caption: "", occasion: "Birthday", rating: 5 }); }, 2000);
  };

  const likePhoto = (id: string) => {
    setPhotos((prev) => prev.map((p) => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-pink-200 bg-white";

  return (
    <>
      <section className="py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1008 0%,#3a1e08 100%)" }}>
        <span className="block text-4xl mb-2" style={{ fontFamily: "var(--font-script)", color: "var(--color-primary)" }}>
          Our Sweet Community
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Customer Gallery 📸
        </h1>
        <p className="text-white/50 text-sm mt-2">Real cakes · Real moments · Real love</p>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          {/* Upload CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Share Your Bellaria Moment</h2>
              <p className="text-sm text-gray-400 mt-0.5">Show the world your beautiful cake! 🎂</p>
            </div>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 py-3 px-6 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: "var(--color-primary)" }}>
              <Camera size={18} /> Upload Your Photo
            </motion.button>
          </div>

          {/* Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {photos.map((photo, i) => (
              <motion.div key={photo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="break-inside-avoid bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="relative overflow-hidden">
                  <div className="relative w-full" style={{ paddingBottom: i % 3 === 1 ? "130%" : "100%" }}>
                    <Image src={photo.dataUrl} alt={photo.caption} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" />
                  </div>
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-gray-700">
                    {photo.occasion}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-gray-800">{photo.name}</p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, si) => (
                          <Star key={si} size={10} className={si < photo.rating ? "text-pink-400 fill-pink-400" : "text-gray-200"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-300">{photo.createdAt}</p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{photo.caption}</p>
                  <button onClick={() => likePhoto(photo.id)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-rose-500 transition-colors font-semibold">
                    <Heart size={13} /> {photo.likes} likes
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-pink-950 z-50" onClick={() => setShowUpload(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Share Your Cake Photo</h3>
                  <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={18} /></button>
                </div>

                {submitted ? (
                  <div className="text-center py-6 space-y-3">
                    <CheckCircle2 size={44} className="text-green-500 mx-auto" />
                    <p className="font-bold text-gray-800">Photo added to gallery! 🎉</p>
                  </div>
                ) : (
                  <>
                    {/* File drop zone */}
                    <div onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-pink-300 hover:bg-pink-50/30 transition-all">
                      {preview ? (
                        <div className="relative w-full h-40 rounded-xl overflow-hidden">
                          <Image src={preview} alt="preview" fill className="object-cover" sizes="400px" />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload size={28} className="mx-auto text-gray-300" />
                          <p className="text-sm text-gray-400">Click to upload your cake photo</p>
                          <p className="text-xs text-gray-300">JPG, PNG up to 5MB</p>
                        </div>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                    </div>

                    <input className={inputClass} placeholder="Your Name" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <textarea className={`${inputClass} resize-none`} rows={2}
                      placeholder="Share your experience..." value={form.caption}
                      onChange={(e) => setForm({ ...form, caption: e.target.value })} />

                    <div className="grid grid-cols-2 gap-3">
                      <select className={inputClass} value={form.occasion}
                        onChange={(e) => setForm({ ...form, occasion: e.target.value })}>
                        {["Birthday", "Wedding", "Anniversary", "Corporate", "Daily Treat"].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl bg-white">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <button key={r} onClick={() => setForm({ ...form, rating: r })}>
                            <Star size={18} className={r <= form.rating ? "text-pink-400 fill-pink-400" : "text-gray-200"} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={submitPhoto} disabled={!preview || !form.name.trim() || !form.caption.trim()}
                      className="w-full py-3.5 rounded-2xl text-white font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ backgroundColor: "var(--color-primary)" }}>
                      <Camera size={16} /> Share to Community Gallery
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
