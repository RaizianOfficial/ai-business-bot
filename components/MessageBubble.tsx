"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function renderContent(text: string) {
  // Split by **bold** markers and render accordingly
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-bold text-textDark">{part}</strong>;
    }
    // Handle newlines
    return part.split("\n").map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ));
  });
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      layout
      className={clsx(
        "flex w-full mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "max-w-[75%] rounded-3xl px-5 py-4 shadow-sm transition-all duration-300 relative",
          isUser
            ? "bg-textDark text-white border border-gray-800 rounded-tr-sm"
            : "bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-tl-sm shadow-glass"
        )}
      >
        <div className="text-sm tracking-wide leading-relaxed font-sans">
          {renderContent(message.content)}
        </div>
      </div>
    </motion.div>
  );
}
