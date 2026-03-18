"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function renderContent(text: string, isUser: boolean) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <strong
          key={i}
          className={clsx("font-semibold", isUser ? "text-white" : "text-zinc-900")}
        >
          {part}
        </strong>
      );
    }
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
      initial={{ opacity: 0, y: 15, scale: 0.95, transformOrigin: isUser ? "bottom right" : "bottom left" }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 22, stiffness: 300 }}
      layout
      className={clsx(
        "flex w-full mb-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "max-w-[80%] px-5 py-3.5 shadow-sm transition-all duration-300 relative text-[14.5px] leading-[1.6] font-medium tracking-tight",
          isUser
            ? "bg-zinc-900 text-zinc-100 rounded-[20px] rounded-br-[4px] shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
            : "bg-white border border-zinc-100/80 text-zinc-700 rounded-[20px] rounded-bl-[4px] shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)]"
        )}
      >
        {renderContent(message.content, isUser)}
      </div>
    </motion.div>
  );
}