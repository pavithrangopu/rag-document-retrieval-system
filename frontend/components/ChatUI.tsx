"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Menu,
  Loader2,
  Trash2,
  RotateCcw,
} from "lucide-react";
import Sidebar, { type Doc } from "./Sidebar";
import AnimatedBackground from "./AnimatedBackground";
import WelcomeScreen from "./WelcomeScreen";
import MessageBubble, { type Message } from "./MessageBubble";
import { askQuestionStream, deleteDocument, type SourceText } from "@/lib/api";

export default function ChatUI() {
  /* ── State ────────────────────────────────────── */
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* ── Auto-scroll ──────────────────────────────── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Handlers ─────────────────────────────────── */
  const handleUpload = useCallback((doc: Doc) => {
    setDocuments((prev) => [...prev, doc]);
    setActiveDocId(doc.id);
    setMessages([
      {
        id: "welcome-" + doc.id,
        role: "assistant",
        content: `📄 **${doc.filename}** has been processed successfully!\n\nI split it into **${doc.num_chunks} chunks** and built a semantic index. Ask me anything about this document.`,
      },
    ]);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteDocument(id);
      } catch {
        /* ignore */
      }
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (activeDocId === id) {
        setActiveDocId(null);
        setMessages([]);
      }
    },
    [activeDocId],
  );

  const handleSelect = useCallback(
    (id: string) => {
      if (id === activeDocId) return;
      setActiveDocId(id);
      const doc = documents.find((d) => d.id === id);
      setMessages([
        {
          id: "switch-" + id,
          role: "assistant",
          content: `Switched to **${doc?.filename ?? "document"}**. Ask me a question!`,
        },
      ]);
    },
    [activeDocId, documents],
  );

  const handleSend = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      const q = input.trim();
      if (!q || !activeDocId || isAsking) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: q,
      };
      const aiMsgId = (Date.now() + 1).toString();
      const aiMsg: Message = {
        id: aiMsgId,
        role: "assistant",
        content: "",
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, aiMsg]);
      setInput("");
      setIsAsking(true);

      await askQuestionStream(
        activeDocId,
        q,
        /* onToken */
        (token: string) => {
          setMessages((prev) => {
            const copy = [...prev];
            const last = { ...copy[copy.length - 1] };
            last.content += token;
            copy[copy.length - 1] = last;
            return copy;
          });
        },
        /* onDone */
        (sources: string[], sourceTexts: SourceText[]) => {
          setMessages((prev) => {
            const copy = [...prev];
            const last = { ...copy[copy.length - 1] };
            last.isStreaming = false;
            last.sources = sources;
            last.sourceTexts = sourceTexts;
            copy[copy.length - 1] = last;
            return copy;
          });
          setIsAsking(false);
        },
        /* onError */
        (err: Error) => {
          setMessages((prev) => {
            const copy = [...prev];
            const last = { ...copy[copy.length - 1] };
            last.content = `⚠️ Error: ${err.message}`;
            last.isStreaming = false;
            copy[copy.length - 1] = last;
            return copy;
          });
          setIsAsking(false);
        },
      );
    },
    [input, activeDocId, isAsking],
  );

  const clearChat = () => {
    setMessages([]);
  };

  /* ── Key handler ──────────────────────────────── */
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ── Auto-resize textarea ─────────────────────── */
  useEffect(() => {
    const el = inputRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 150) + "px";
    }
  }, [input]);

  const activeDoc = documents.find((d) => d.id === activeDocId);

  /* ── Render ───────────────────────────────────── */
  return (
    <div className="flex h-screen w-screen overflow-hidden relative">
      <AnimatedBackground />

      {/* Sidebar */}
      <Sidebar
        documents={documents}
        activeDocId={activeDocId}
        onSelect={handleSelect}
        onDelete={handleDelete}
        onUpload={handleUpload}
        uploading={uploading}
        setUploading={setUploading}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main area */}
      <main className="flex-1 flex flex-col relative z-10 min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 lg:px-6 py-3 border-b border-white/5 glass">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            {activeDoc ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-sm font-medium text-gray-200 truncate">
                  {activeDoc.filename}
                </p>
                <span className="text-[10px] text-gray-500 hidden sm:inline">
                  ({activeDoc.num_chunks} chunks)
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No document selected</p>
            )}
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </header>

        {/* Chat body */}
        {!activeDocId ? (
          <WelcomeScreen />
        ) : (
          <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-5">
            <AnimatePresence>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
            </AnimatePresence>

            {/* Thinking indicator */}
            <AnimatePresence>
              {isAsking && messages[messages.length - 1]?.content === "" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-gray-500 text-xs pl-11"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-purple" />
                  Thinking…
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={chatEndRef} />
          </div>
        )}

        {/* Input bar */}
        {activeDocId && (
          <div className="border-t border-white/5 p-3 lg:p-4">
            <form
              onSubmit={handleSend}
              className="max-w-4xl mx-auto flex items-end gap-2"
            >
              <div className="flex-1 glass rounded-xl gradient-border overflow-hidden">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask a question about the document…"
                  rows={1}
                  disabled={isAsking}
                  className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-500 px-4 py-3 resize-none outline-none disabled:opacity-50"
                />
              </div>

              <motion.button
                type="submit"
                disabled={!input.trim() || isAsking}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`
                  flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
                  transition-all duration-200
                  ${input.trim() && !isAsking
                    ? "bg-gradient-to-r from-brand-purple to-brand-blue text-white glow-sm"
                    : "bg-dark-300 text-gray-600 cursor-not-allowed"}
                `}
              >
                {isAsking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </motion.button>
            </form>

            <p className="text-center text-[10px] text-gray-600 mt-2">
              Answers are generated only from the uploaded document context.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}