"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Trash2,
  Brain,
  ChevronLeft,
  Layers,
} from "lucide-react";
import UploadBox from "./UploadBox";

export interface Doc {
  id: string;
  filename: string;
  num_chunks: number;
}

interface Props {
  documents: Doc[];
  activeDocId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUpload: (doc: Doc) => void;
  uploading: boolean;
  setUploading: (v: boolean) => void;
  open: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  documents,
  activeDocId,
  onSelect,
  onDelete,
  onUpload,
  uploading,
  setUploading,
  open,
  onToggle,
}: Props) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : -320 }}
        transition={{ type: "spring", damping: 26, stiffness: 200 }}
        className={`
          fixed lg:relative top-0 left-0 z-40 h-screen w-[280px]
          flex flex-col
          glass border-r border-white/5
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center glow-sm">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold gradient-text tracking-tight">
                DocuMind AI
              </h1>
              <p className="text-[10px] text-gray-500 leading-none mt-0.5">
                Document Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-lg hover:bg-white/5 text-gray-400"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Upload */}
        <div className="pt-4">
          <p className="px-4 pb-2 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
            Upload
          </p>
          <UploadBox
            onUploadComplete={onUpload}
            uploading={uploading}
            setUploading={setUploading}
          />
        </div>

        {/* Documents */}
        <div className="flex-1 overflow-y-auto mt-4">
          <p className="px-4 pb-2 text-[10px] uppercase tracking-widest text-gray-500 font-semibold flex items-center gap-1.5">
            <Layers className="w-3 h-3" />
            Documents ({documents.length})
          </p>

          <div className="px-3 space-y-1">
            <AnimatePresence>
              {documents.map((doc) => (
                <motion.button
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => onSelect(doc.id)}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left
                    transition-all duration-200 group
                    ${activeDocId === doc.id
                      ? "glass-strong border-brand-purple/30 glow-sm"
                      : "hover:bg-white/5"}
                  `}
                >
                  <FileText
                    className={`w-4 h-4 flex-shrink-0 ${
                      activeDocId === doc.id
                        ? "text-brand-purple"
                        : "text-gray-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-200 truncate">
                      {doc.filename}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {doc.num_chunks} chunks
                    </p>
                  </div>
                  <Trash2
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(doc.id);
                    }}
                    className="w-3.5 h-3.5 text-gray-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all flex-shrink-0"
                  />
                </motion.button>
              ))}
            </AnimatePresence>

            {documents.length === 0 && (
              <p className="text-[11px] text-gray-600 text-center py-6">
                No documents yet
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <p className="text-[10px] text-gray-600 text-center">
            Powered by RAG + FAISS
          </p>
        </div>
      </motion.aside>
    </>
  );
}