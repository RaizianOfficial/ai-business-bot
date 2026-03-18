"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Gift, Heart, Calendar, ArrowRight, MessageCircle, Menu, X } from "lucide-react";
import ChatWindow from "@/components/ChatWindow";

function Section({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

const hampers = [
  {
    code: "VL001",
    name: "Midnight Velvet",
    price: "$185.00",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop"
  },
  {
    code: "VL002",
    name: "Artisan Dawn",
    price: "$140.00",
    image: "https://images.unsplash.com/photo-1513885535851-8b925b0cb01e?q=80&w=800&auto=format&fit=crop"
  },
  {
    code: "VL003",
    name: "Golden Hour",
    price: "$210.00",
    image: "https://images.unsplash.com/photo-1511216113906-8f56bbce1667?q=80&w=800&auto=format&fit=crop"
  },
  {
    code: "VL004",
    name: "Rosewood Serenity",
    price: "$195.00",
    image: "https://images.unsplash.com/photo-1542452255146-2ae702cb2e1c?q=80&w=800&auto=format&fit=crop"
  },
];

const features = [
  { title: "Hand-Selected Excellence", desc: "Every element is sourced from premium artisans, ensuring unparalleled quality in every box.", icon: <Gift size={22} className="text-primary" /> },
  { title: "Arriving Exactly When It Matters", desc: "Precision delivery schedules because timing is the most important part of the gesture.", icon: <Calendar size={22} className="text-primary" /> },
  { title: "A Personal Touch", desc: "Hand-written notes and bespoke customization options to make your gift truly unique.", icon: <Heart size={22} className="text-primary" /> }
];

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <main className="min-h-screen bg-background text-textDark font-sans relative">
      {/* Navbar Minimalist */}
      <motion.nav
        ref={menuRef}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled || mobileMenuOpen ? "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm text-textDark" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-50">
          <div className="font-heading text-xl font-bold tracking-widest uppercase">
            Velourah
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs tracking-widest font-semibold text-gray-800 uppercase">
            <a href="#" className="hover:text-primary transition-colors">Shop All</a>
            <a href="#" className="hover:text-primary transition-colors">Occasions</a>
            <a href="#" className="hover:text-primary transition-colors">Our Story</a>
            <a href="#" className="hover:text-primary transition-colors">Corporate</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block hover:text-primary transition-colors">Search</button>
            <button className="hover:text-primary transition-colors">Bag</button>
            <button 
              className="md:hidden hover:text-primary transition-colors ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl overflow-hidden absolute top-full left-0 w-full"
            >
              <div className="flex flex-col items-center py-8 gap-6">
                <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-sm tracking-widest font-semibold text-gray-800 uppercase hover:text-primary transition-colors">Shop All</a>
                <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-sm tracking-widest font-semibold text-gray-800 uppercase hover:text-primary transition-colors">Occasions</a>
                <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-sm tracking-widest font-semibold text-gray-800 uppercase hover:text-primary transition-colors">Our Story</a>
                <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-sm tracking-widest font-semibold text-gray-800 uppercase hover:text-primary transition-colors">Corporate</a>
                <button onClick={() => setMobileMenuOpen(false)} className="text-sm tracking-widest font-semibold text-gray-800 uppercase hover:text-primary transition-colors">Search</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Header */}
      <section className="relative w-full h-[85vh] md:h-[95vh] flex items-center bg-gray-200">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-black/20" /> {/* Subtle darkening */}
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-md p-10 md:p-16 max-w-xl shadow-2xl"
          >
            <h1 className="font-heading text-4xl md:text-6xl text-textDark leading-tight mb-4">
              Celebrate Life's Most <br />
              <span className="italic text-primary font-normal">Beautiful Moments</span>
            </h1>
            <p className="text-gray-600 mb-8 max-w-sm leading-relaxed">
              Curated with intention and wrapped in elegance. Discover gift hampers that speak when words aren't enough.
            </p>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-xs font-bold tracking-widest uppercase transition-colors"
            >
              Order Your Hamper
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Row */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {features.map((f, i) => (
            <Section key={i} delay={i * 0.1}>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary/80">
                  {f.icon}
                </div>
              </div>
              <h3 className="font-heading text-xl mb-3">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{f.desc}</p>
            </Section>
          ))}
        </div>
      </div>

      {/* Signature Curations */}
      <Section className="py-24 bg-accent/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2 block">The Collection</span>
              <h2 className="font-heading text-4xl">Signature Curations</h2>
            </div>
            <a href="#" className="hidden md:inline-block text-sm font-semibold border-b border-textDark pb-1 mt-4 hover:text-primary hover:border-primary transition-colors">
              View All Collections
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hampers.map((hamper, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white p-4 shadow-sm hover:shadow-xl transition-shadow group flex flex-col"
              >
                <div className="aspect-square bg-background mb-6 overflow-hidden relative">
                  <img src={hamper.image} alt={hamper.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="font-heading text-lg mb-1">{hamper.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{hamper.price}</p>
                
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="mt-auto w-full py-3 border border-gray-200 text-xs font-semibold tracking-widest text-gray-600 hover:bg-textDark hover:text-white transition-colors"
                >
                  ADD TO SELECTION
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Gifting Made Simple Steps */}
      <Section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-heading text-3xl md:text-4xl mb-16">Gifting Made Simple</h2>
          
          <div className="flex justify-between items-start relative before:absolute before:top-6 before:left-[10%] before:right-[10%] before:-z-10 before:h-[1px] before:bg-gray-200 hidden md:flex">
             {[
               { id: "1", title: "Choose", desc: "Browse our curated collection of theme-based hampers." },
               { id: "2", title: "Personalize", desc: "Add a handwritten note or specific artisanal additions." },
               { id: "3", title: "Deliver", desc: "We ensure it arrives in pristine condition at their doorstep." },
             ].map((step, i) => (
               <div key={i} className="flex flex-col items-center max-w-xs px-4 bg-white">
                 <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center font-heading text-lg text-textDark mb-6 border-4 border-white shadow-sm">
                   {step.id}
                 </div>
                 <h3 className="font-heading text-lg mb-2">{step.title}</h3>
                 <p className="text-sm text-gray-500">{step.desc}</p>
               </div>
             ))}
          </div>

          <div className="md:hidden flex flex-col gap-10">
            {[
               { id: "1", title: "Choose", desc: "Browse our curated collection of theme-based hampers." },
               { id: "2", title: "Personalize", desc: "Add a handwritten note or specific artisanal additions." },
               { id: "3", title: "Deliver", desc: "We ensure it arrives in pristine condition at their doorstep." },
             ].map((step, i) => (
               <div key={i} className="flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center font-heading text-lg text-textDark mb-4">
                   {step.id}
                 </div>
                 <h3 className="font-heading text-lg mb-2">{step.title}</h3>
                 <p className="text-sm text-gray-500">{step.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </Section>

      {/* Occasions Blocks */}
      <Section className="py-4">
        <div className="w-full flex flex-col md:flex-row h-auto md:h-[60vh]">
          {[
            { title: "Birthdays", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop" },
            { title: "Anniversaries", image: "https://images.unsplash.com/photo-1606214041725-aa80ab7e9081?q=80&w=800&auto=format&fit=crop" },
            { title: "New Beginnings", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop" },
          ].map((item, i) => (
            <div key={i} className="flex-1 relative group cursor-pointer overflow-hidden h-64 md:h-auto border-r border-white/10 last:border-0 border-y md:border-y-0">
               <img src={item.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
               <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
               <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-start translate-y-4 group-hover:translate-y-0 transition-transform">
                 <h3 className="font-heading text-2xl text-white mb-2">{item.title}</h3>
                 <span className="text-white/80 text-xs font-semibold tracking-widest uppercase flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   EXPLORE <ArrowRight size={14} />
                 </span>
               </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonial */}
      <Section className="py-24 bg-accent/20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Heart size={24} className="mx-auto text-primary/40 mb-8" />
          <p className="font-heading text-2xl md:text-3xl italic text-textDark leading-relaxed mb-8">
            "Receiving a Velourah hamper was more than just a gift; it was a profound feeling of being seen and cherished. Every detail whispered thoughtfulness."
          </p>
          <p className="text-xs uppercase tracking-widest font-semibold text-gray-500">
            — Elena V., Paris
          </p>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-textDark text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h2 className="font-heading text-2xl font-bold tracking-widest uppercase mb-6">Velourah</h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Crafting emotional connections through the art of luxury gifting. Based in London, delivering elegance worldwide.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-6 uppercase tracking-wider">Shop</h3>
            <div className="flex flex-col gap-3 text-white/50 text-sm">
              <a href="#" className="hover:text-white transition-colors">Best Sellers</a>
              <a href="#" className="hover:text-white transition-colors">Custom Hampers</a>
              <a href="#" className="hover:text-white transition-colors">Corporate Gifting</a>
              <a href="#" className="hover:text-white transition-colors">New Arrivals</a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-6 uppercase tracking-wider">Support</h3>
            <div className="flex flex-col gap-3 text-white/50 text-sm">
              <span onClick={() => setIsChatOpen(true)} className="hover:text-white transition-colors cursor-pointer">Track Order</span>
              <a href="#" className="hover:text-white transition-colors">Shipping Policy</a>
              <a href="#" className="hover:text-white transition-colors">Return Policy</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-6 uppercase tracking-wider">The Journal</h3>
            <p className="text-white/50 text-sm mb-4">Join our inner circle for gifting inspiration and exclusive previews.</p>
            <div className="flex border-b border-white/20 pb-2">
              <input type="email" placeholder="Your Email" className="bg-transparent border-none outline-none text-sm w-full placeholder:text-white/30 text-white" />
              <button className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">JOIN</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-xs text-white/30">
          <p>© 2026 VELOURAH L.L.C. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 mt-4 md:mt-0 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Pinterest</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-30 w-16 h-16 bg-textDark text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-primary transition-colors hover:scale-105 duration-300 group"
        >
          <MessageCircle size={26} className="group-hover:rotate-12 transition-transform" />
        </motion.button>
      )}

      {/* Chat Window Component */}
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </main>
  );
}
