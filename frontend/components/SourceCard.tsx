"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown } from "lucide-react";
import type { SourceText } from "@/lib/api";

interface Props {
  sources: string[];
  sourceTexts: SourceText[];
}

export default function SourceCard({ sources, sourceTexts }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!sources.length) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[11px] text-brand-purple hover:text-purple-300 transition-colors"
      >
        <BookOpen className="w-3 h-3" />
        <span className="font-medium">
          Sources: {sources.join(", ")}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-2">
              {sourceTexts.map((s, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-white/[0.03] border border-white/5 p-3"
                >
                  <p className="text-[10px] font-semibold text-brand-purple mb-1">
                    📄 Page {s.page}
                  </p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}