"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface Props {
  onUploadComplete: (doc: {
    id: string;
    filename: string;
    num_chunks: number;
  }) => void;
  uploading: boolean;
  setUploading: (v: boolean) => void;
}

export default function UploadBox({
  onUploadComplete,
  uploading,
  setUploading,
}: Props) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".pdf")) {
        setError("Only PDF files are supported");
        return;
      }

      setError("");
      setSuccess("");
      setUploading(true);

      try {
        const form = new FormData();
        form.append("file", file);

        const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
        const res = await fetch(`${API}/upload`, {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ detail: "Upload failed" }));
          throw new Error(err.detail);
        }

        const data = await res.json();
        setSuccess(`Processed ${data.num_chunks} chunks`);
        onUploadComplete({
          id: data.document_id,
          filename: data.filename,
          num_chunks: data.num_chunks,
        });

        setTimeout(() => setSuccess(""), 3000);
      } catch (e: any) {
        setError(e.message ?? "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUploadComplete, setUploading],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="px-3 pb-2">
      <motion.div
        {...getRootProps()}
        whileHover={{ scale: uploading ? 1 : 1.01 }}
        whileTap={{ scale: uploading ? 1 : 0.98 }}
        className={`
          relative cursor-pointer rounded-xl p-4 text-center transition-all duration-300
          ${isDragActive
            ? "glass-strong border-brand-purple/50 glow-sm"
            : "glass hover:border-white/20"}
          ${uploading ? "opacity-60 pointer-events-none" : ""}
        `}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex flex-col items-center gap-2 py-1"
            >
              <Loader2 className="w-7 h-7 text-brand-purple animate-spin" />
              <p className="text-xs text-gray-400">Processing document…</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex flex-col items-center gap-2 py-1"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 flex items-center justify-center">
                <Upload className="w-5 h-5 text-brand-purple" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-300">
                  {isDragActive ? "Drop PDF here" : "Upload PDF"}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Drag & drop or click
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Status messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 mt-2 px-2 text-red-400 text-[11px]"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 mt-2 px-2 text-emerald-400 text-[11px]"
          >
            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}