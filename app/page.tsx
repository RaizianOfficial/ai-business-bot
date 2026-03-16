"use client";

import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Gift, Star, Heart, Truck, ShieldCheck, Sparkles, ChevronRight, Package, MessageCircle, ArrowRight } from "lucide-react";
import ChatWindow from "@/components/ChatWindow";
import { useRef } from "react";

function Section({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

const hampers = [
  {
    code: "301",
    name: "Mini Birthday Hamper",
    price: "₹199",
    tag: "Best Seller",
    gradient: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/20",
    tagColor: "bg-amber-500/20 text-amber-400"
  },
  {
    code: "302",
    name: "Classic Birthday Hamper",
    price: "₹299",
    tag: "Popular",
    gradient: "from-violet-500/20 to-fuchsia-500/20",
    borderColor: "border-violet-500/20",
    tagColor: "bg-violet-500/20 text-violet-400"
  },
  {
    code: "303",
    name: "Premium Birthday Hamper",
    price: "₹499",
    tag: "Premium",
    gradient: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/20",
    tagColor: "bg-emerald-500/20 text-emerald-400"
  },
];

const features = [
  {
    icon: <Gift className="text-primary" size={28} />,
    title: "Handcrafted Hampers",
    desc: "Each hamper is carefully curated with premium items and wrapped with love."
  },
  {
    icon: <Truck className="text-secondary" size={28} />,
    title: "Fast Delivery",
    desc: "Quick delivery across all major cities within 2-3 business days."
  },
  {
    icon: <Heart className="text-pink-400" size={28} />,
    title: "Personalized Touch",
    desc: "Add custom messages and make your gift truly special and memorable."
  },
  {
    icon: <ShieldCheck className="text-emerald-400" size={28} />,
    title: "Quality Assured",
    desc: "Only the finest products make it into our hampers. 100% satisfaction."
  },
];

const steps = [
  { step: "01", title: "Choose Hamper", desc: "Pick from our curated collection of premium hampers.", icon: <Package size={24} /> },
  { step: "02", title: "Chat with AI", desc: "Our AI assistant guides you through the ordering process.", icon: <MessageCircle size={24} /> },
  { step: "03", title: "We Deliver", desc: "Sit back and relax while we deliver happiness to your doorstep.", icon: <Truck size={24} /> },
];

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? "bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 shadow-xl" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Velourah
            </span>
          </div>
          <button
            onClick={() => setIsChatOpen(true)}
            className="px-5 py-2 bg-white/10 border border-white/10 rounded-full text-sm font-semibold hover:bg-primary hover:border-primary transition-all duration-300"
          >
            Order Now
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center px-6 pt-20">
        {/* Animated Background Orbs */}
        <div className="absolute top-[15%] left-[10%] w-[40%] h-[40%] bg-primary/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[15%] right-[10%] w-[35%] h-[35%] bg-secondary/15 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
        <div className="absolute top-[50%] left-[50%] w-[20%] h-[20%] bg-amber-500/10 rounded-full blur-[80px] animate-pulse [animation-delay:2s]" />

        <div className="text-center z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary/80 mb-8">
              <Sparkles size={12} />
              Thoughtful Gifts for Every Occasion
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
          >
            <span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
              Thoughtful{" "}
            </span>
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Gift Hampers
            </span>
            <br />
            <span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
              for Every Special{" "}
            </span>
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Moment
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/50 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Premium curated hampers delivered with love. Order seamlessly through our AI-powered assistant.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => setIsChatOpen(true)}
              className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg rounded-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all duration-500 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Order Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#hampers"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              View Hampers
              <ChevronRight size={20} />
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 flex items-center justify-center gap-8 md:gap-16 text-center"
          >
            {[
              { value: "500+", label: "Hampers Delivered" },
              { value: "4.9★", label: "Customer Rating" },
              { value: "50+", label: "Cities Covered" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-xs text-white/30 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Luxury Hampers */}
      <Section className="py-20 md:py-28 px-6" delay={0.1}>
        <div className="max-w-6xl mx-auto" id="hampers">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 border border-secondary/20 rounded-full text-xs font-semibold text-secondary/80 mb-4">
              <Star size={12} />
              Our Collection
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Featured Luxury Hampers
              </span>
            </h2>
            <p className="text-white/40 max-w-md mx-auto">
              Carefully curated hampers that bring joy to every celebration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hampers.map((hamper, i) => (
              <motion.div
                key={hamper.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`group relative bg-gradient-to-b ${hamper.gradient} rounded-3xl border ${hamper.borderColor} p-6 hover:scale-[1.02] transition-all duration-500 cursor-pointer overflow-hidden`}
                onClick={() => setIsChatOpen(true)}
              >
                {/* Hamper card glow effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 rounded-3xl" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${hamper.tagColor}`}>
                      {hamper.tag}
                    </span>
                    <span className="text-xs text-white/30 font-mono">#{hamper.code}</span>
                  </div>

                  {/* Visual Placeholder */}
                  <div className="w-full h-48 rounded-2xl bg-white/5 border border-white/10 mb-6 flex items-center justify-center group-hover:border-white/20 transition-all">
                    <Gift size={48} className="text-white/10 group-hover:text-white/20 transition-colors" />
                  </div>

                  <h3 className="text-lg font-bold mb-2">{hamper.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                      {hamper.price}
                    </span>
                    <button className="p-2 bg-white/10 rounded-xl hover:bg-primary transition-all duration-300 group-hover:bg-primary">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Why Choose Velourah */}
      <Section className="py-20 md:py-28 px-6" delay={0.1}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400 mb-4">
              <Heart size={12} />
              Why Us
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Why Choose Velourah?
              </span>
            </h2>
            <p className="text-white/40 max-w-md mx-auto">
              We are committed to making every gifting experience extraordinary
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-400 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-bold mb-2 text-base">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Gifting Made Simple */}
      <Section className="py-20 md:py-28 px-6" delay={0.1}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-semibold text-amber-400 mb-4">
              <Sparkles size={12} />
              How It Works
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Gifting Made Simple
              </span>
            </h2>
            <p className="text-white/40 max-w-md mx-auto">
              Three easy steps to deliver happiness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center p-8 rounded-3xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all duration-400"
              >
                <div className="text-5xl font-extrabold bg-gradient-to-b from-primary/30 to-transparent bg-clip-text text-transparent mb-4">
                  {step.step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center mx-auto mb-4 text-white/60">
                  {step.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="py-20 md:py-28 px-6" delay={0.1}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 md:p-16 rounded-[2rem] bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 border border-white/10 overflow-hidden">
            <div className="absolute top-0 left-[20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Ready to Send Happiness?
              </h2>
              <p className="text-white/40 mb-8 max-w-md mx-auto">
                Order your perfect gift hamper today and make someone&apos;s day truly special.
              </p>
              <button
                onClick={() => setIsChatOpen(true)}
                className="group px-10 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg rounded-2xl hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-all duration-500 transform hover:scale-105 inline-flex items-center gap-2"
              >
                Start Ordering
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Velourah</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-white/30">
              <a href="#hampers" className="hover:text-white transition-colors">Hampers</a>
              <button onClick={() => setIsChatOpen(true)} className="hover:text-white transition-colors">Order</button>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-xs text-white/20">
              © 2026 Velourah. Made with 💜
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_30px_rgba(139,92,246,0.4)] flex items-center justify-center hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] hover:scale-110 transition-all duration-300"
        >
          <MessageCircle size={24} className="text-white" />
        </motion.button>
      )}

      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </main>
  );
}
