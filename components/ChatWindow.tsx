"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, RefreshCw, HandPlatter, Search } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { clsx } from "clsx";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWindow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [input, setInput] = useState("");
  const initialMessage = "Welcome to Velourah.\n\nI can help you:\n\n1️⃣ Place a new order\n2️⃣ Track an existing order\n\nType:\n**Order** to place a new order\nor\n**Track #OrderID** to check your order status";
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: initialMessage }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickButtons, setQuickButtons] = useState<string[]>(["Place Order", "Track Order"]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    setInput("");
    setQuickButtons([]);
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await response.json();

      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);

      if (data.quickButtons) {
        setQuickButtons(data.quickButtons);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Apologies, we're having trouble connecting. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    await sendMessage(input);
  };

  const handleQuickButton = async (label: string) => {
    if (label === "Place Order") {
      await sendMessage("Order");
    } else if (label === "Track Order") {
      await sendMessage("Track Order");
    } else {
      await sendMessage(label);
    }
  };

  const handleReset = () => {
    setMessages([{ role: "assistant", content: initialMessage }]);
    setQuickButtons(["Place Order", "Track Order"]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:items-end md:justify-end md:p-8">
          {/* Subtle Outer Backdrop for clicking away */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"
          />

          {/* Floating Glassmorphic Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative z-10 w-full max-w-sm h-[85vh] md:h-[650px] flex flex-col bg-white/85 backdrop-blur-xl border border-white/60 rounded-[2rem] overflow-hidden shadow-glass"
          >
            {/* Minimal Header */}
            <div className="px-6 py-5 border-b border-gray-200/50 flex items-center justify-between bg-white/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <span className="font-heading font-bold text-lg">V</span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-textDark text-lg tracking-wide">Velourah</h3>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
                    Assistant
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={handleReset} className="p-2 hover:bg-gray-100/80 rounded-full text-gray-500 transition-colors" title="Reset Chat">
                  <RefreshCw size={15} />
                </button>
                <button onClick={onClose} className="p-2 hover:bg-gray-100/80 rounded-full text-gray-500 transition-colors" title="Close">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 scroll-smooth">
              {messages.map((m, i) => (
                <MessageBubble key={i} message={m} />
              ))}
              
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start mb-6">
                  <div className="bg-white/80 backdrop-blur-md px-5 py-4 rounded-3xl rounded-tl-sm border border-white/60 shadow-sm flex items-center h-[52px]">
                    <div className="flex gap-2">
                       <motion.div className="w-2 h-2 bg-primary/60 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }} />
                       <motion.div className="w-2 h-2 bg-primary/60 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.2 }} />
                       <motion.div className="w-2 h-2 bg-primary/60 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.4 }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Buttons Overlay */}
            {quickButtons.length > 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 pb-4 flex flex-wrap gap-2 justify-end"
              >
                {quickButtons.map((label) => (
                  <button
                    key={label}
                    onClick={() => handleQuickButton(label)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-xs font-semibold tracking-widest uppercase text-textDark hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
                  >
                    {label === "Place Order" ? <HandPlatter size={14} /> : <Search size={14} />}
                    {label}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Input Floating Dock Container */}
            <div className="p-6 pt-2 bg-gradient-to-t from-white/90 to-transparent">
              <div className="relative group flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="w-full bg-white/70 border border-gray-200 rounded-full py-4 pl-6 pr-14 text-textDark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all shadow-sm font-sans tracking-wide"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-2.5 bg-textDark text-white rounded-full hover:bg-primary disabled:opacity-40 transition-all shadow-md group-focus-within:bg-primary"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </div>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
