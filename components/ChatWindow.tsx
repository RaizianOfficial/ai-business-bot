"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, RefreshCw, Sparkles, Search } from "lucide-react";
import MessageBubble from "./MessageBubble";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWindow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [input, setInput] = useState("");
  const initialMessage = "Welcome to Velourah.\n\nI can help you:\n\n1️⃣ Place a new order\n2️⃣ Track an existing order\n\nType:\n**Order** to place a new order\nor\n**Track #OrderID** to check your order status";
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: initialMessage }]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickButtons, setQuickButtons] = useState<string[]>(["Place Order", "Track Order"]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    setInput("");
    setQuickButtons([]);
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Simulated API Call for visual testing
      await new Promise(resolve => setTimeout(resolve, 1200));
      const mockResponse = "I've pulled up your account. How would you like to proceed?";
      setMessages((prev) => [...prev, { role: "assistant", content: mockResponse }]);
      setQuickButtons(["View Catalog", "Speak to Agent"]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Apologies, we're having trouble connecting. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:p-6 md:items-end md:justify-end antialiased selection:bg-zinc-200">
          {/* Deep Ambient Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/20 backdrop-blur-sm backdrop-saturate-150 transition-all"
          />

          {/* Main Floating Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-[420px] h-[85vh] md:h-[700px] flex flex-col bg-white/70 backdrop-blur-2xl backdrop-saturate-150 border border-white/60 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.5)_inset]"
          >
            {/* Premium Header */}
            <div className="px-6 py-5 flex items-center justify-between bg-gradient-to-b from-white/90 to-white/0 border-b border-zinc-200/50 z-20">
              <div className="flex items-center gap-3.5">
                <div className="relative w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white shadow-md">
                  <span className="font-semibold text-lg tracking-tighter">V</span>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-zinc-900 text-[15px] leading-tight tracking-tight">Velourah Concierge</h3>
                  <p className="text-[11px] text-zinc-500 font-medium tracking-wide">Always here to help</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setMessages([{ role: "assistant", content: initialMessage }])} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors">
                  <RefreshCw size={16} strokeWidth={2.5} />
                </button>
                <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors">
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Scrollable Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar flex flex-col gap-1">
              {messages.map((m, i) => (
                <MessageBubble key={i} message={m} />
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start mb-2 mt-2">
                  <div className="bg-white/90 backdrop-blur-md px-5 py-3.5 rounded-2xl rounded-bl-[4px] border border-white shadow-sm flex items-center h-[46px]">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
                          animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Actions (Floating above input) */}
            <AnimatePresence>
              {quickButtons.length > 0 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                  className="px-6 pb-2 flex flex-wrap gap-2 justify-end z-20"
                >
                  {quickButtons.map((label) => (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      key={label}
                      onClick={() => sendMessage(label)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm border border-zinc-200/80 rounded-full text-[13px] font-medium text-zinc-700 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-colors shadow-sm"
                    >
                      {label.includes("Order") ? <Sparkles size={14} /> : <Search size={14} />}
                      {label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating Dock Input */}
            <div className="p-4 pt-2 bg-gradient-to-t from-white/90 via-white/70 to-transparent z-20 pb-6">
              <div className="relative group flex items-center shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08)] rounded-[24px]">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="Message Velourah..."
                  className="w-full bg-white/90 border border-zinc-200/80 rounded-[24px] py-4 pl-6 pr-14 text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all font-medium text-[15px]"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-2.5 bg-zinc-900 text-white rounded-full disabled:opacity-30 disabled:hover:scale-100 transition-all shadow-md flex items-center justify-center"
                >
                  <Send size={16} className="ml-0.5" strokeWidth={2.5} />
                </motion.button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}