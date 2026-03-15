"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Brain, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import SourceCard from "./SourceCard";
import type { SourceText } from "@/lib/api";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  sourceTexts?: SourceText[];
  isStreaming?: boolean;
}

export default function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* AI avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center flex-shrink-0 glow-sm mt-1">
          <Brain className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`
          relative max-w-[80%] rounded-2xl px-4 py-3 group
          ${isUser
            ? "bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-tr-md"
            : "glass rounded-tl-md text-gray-200"}
        `}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {msg.content}
          </p>
        ) : (
          <>
            <div className="prose-chat text-sm leading-relaxed">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
              {msg.isStreaming && <span className="typing-cursor" />}
            </div>

            {/* Sources */}
            {!msg.isStreaming &&
              msg.sources &&
              msg.sources.length > 0 && (
                <SourceCard
                  sources={msg.sources}
                  sourceTexts={msg.sourceTexts ?? []}
                />
              )}

            {/* Copy btn */}
            {!msg.isStreaming && msg.content && (
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                title="Copy"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-500" />
                )}
              </button>
            )}
          </>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-dark-300 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-gray-400" />
        </div>
      )}
    </motion.div>
  );
}