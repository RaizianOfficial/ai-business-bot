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
      return <strong key={i} className="font-bold">{part}</strong>;
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
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={clsx(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-lg transition-all duration-300",
          isUser
            ? "bg-gradient-to-br from-primary to-secondary text-white rounded-tr-none"
            : "bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-tl-none shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
        )}
      >
        <div className="text-sm md:text-base leading-relaxed whitespace-pre-line">
          {renderContent(message.content)}
        </div>
      </div>
    </motion.div>
  );
}
