"use client";

import { motion } from "framer-motion";
import { Upload, MessageSquare, BookOpen, Sparkles } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload PDF",
    desc: "Drag & drop any PDF document",
    color: "from-purple-500/20 to-purple-600/10",
  },
  {
    icon: Sparkles,
    title: "AI Processing",
    desc: "Automatic chunking & embeddings",
    color: "from-blue-500/20 to-blue-600/10",
  },
  {
    icon: MessageSquare,
    title: "Ask Questions",
    desc: "Chat naturally about your document",
    color: "from-cyan-500/20 to-cyan-600/10",
  },
  {
    icon: BookOpen,
    title: "Source Citations",
    desc: "Every answer cites the exact page",
    color: "from-emerald-500/20 to-emerald-600/10",
  },
];

export default function WelcomeScreen() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center glow-md">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold gradient-text mb-3">
            Welcome to DocuMind AI
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-md mx-auto">
            Upload a PDF document in the sidebar, then ask any question.
            The AI will answer using <span className="text-purple-400 font-medium">only</span> the content
            of your document, with precise page citations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass rounded-xl p-4 text-left hover:border-white/10 transition-all group"
            >
              <div
                className={`w-9 h-9 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center mb-2.5`}
              >
                <f.icon className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs font-semibold text-gray-200 mb-0.5">
                {f.title}
              </p>
              <p className="text-[10px] text-gray-500">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-[11px] text-gray-600"
        >
          ← Start by uploading a document in the sidebar
        </motion.p>
      </div>
    </div>
  );
}