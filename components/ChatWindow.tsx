"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, RefreshCw, ShoppingBag, Search } from "lucide-react";
import MessageBubble from "./MessageBubble";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWindow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [input, setInput] = useState("");
  const initialMessage = "Welcome to Velourah 🎁\n\nI can help you:\n\n1️⃣ Place a new hamper order\n2️⃣ Track an existing order\n\nType:\n**Order** to place a new order\nor\n**Track #OrderID** to check your order status";
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

      // Set quick buttons if provided by the API
      if (data.quickButtons) {
        setQuickButtons(data.quickButtons);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again later." }]);
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Chat Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md h-[100dvh] sm:h-[650px] sm:max-h-[85vh] flex flex-col bg-[#0f172a] sm:border border-white/20 sm:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary/30 to-secondary/30 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-lg">🎁</span>
                </div>
                <div>
                  <h3 className="font-bold text-white tracking-tight">Velourah Chat</h3>
                  <p className="text-xs text-green-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span>
                    Online & AI Powered
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleReset} className="p-2 hover:bg-white/10 rounded-full text-white/60 transition-colors" title="Reset Chat">
                  <RefreshCw size={16} />
                </button>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/60 transition-colors" title="Close">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 scroll-smooth">
              {messages.map((m, i) => (
                <MessageBubble key={i} message={m} />
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start mb-4">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Buttons */}
            {quickButtons.length > 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 pb-2 flex gap-2"
              >
                {quickButtons.map((label) => (
                  <button
                    key={label}
                    onClick={() => handleQuickButton(label)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full text-sm font-semibold text-white hover:from-primary/40 hover:to-secondary/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  >
                    {label === "Place Order" ? <ShoppingBag size={14} /> : <Search size={14} />}
                    {label}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1.5 p-2 bg-primary text-white rounded-xl hover:bg-secondary disabled:opacity-50 disabled:grayscale transition-all shadow-lg"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
