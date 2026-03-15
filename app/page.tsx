"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-primary/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] bg-secondary/20 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
          Velourah Gift Hampers
        </h1>
        <p className="max-w-xl mx-auto text-xl text-white/70 mb-10">
          Perfect hampers for every occasion, ordered seamlessly with AI.
        </p>

        {/* Product List */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-10 text-left w-full max-w-sm">
          <h3 className="text-white/50 text-sm font-semibold uppercase tracking-wider mb-4 text-center">Available Hampers</h3>
          <ul className="flex flex-col gap-4">
            <li className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
              <div>
                <span className="text-primary font-bold mr-2">301</span>
                <span className="font-medium">Mini Hamper</span>
              </div>
              <span className="font-bold">₹199</span>
            </li>
            <li className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
              <div>
                <span className="text-primary font-bold mr-2">302</span>
                <span className="font-medium">Classic Hamper</span>
              </div>
              <span className="font-bold">₹299</span>
            </li>
            <li className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
              <div>
                <span className="text-primary font-bold mr-2">303</span>
                <span className="font-medium">Premium Hamper</span>
              </div>
              <span className="font-bold">₹499</span>
            </li>
          </ul>
        </div>

        {/* Order Now Button */}
        <button 
          onClick={() => setIsChatOpen(true)}
          className="px-10 py-4 bg-primary text-white font-black text-lg rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_40px_rgba(var(--primary-rgb),0.5)] transform hover:scale-105"
        >
          Order Now
        </button>
      </motion.div>

      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </main>
  );
}
