/*
 * DocuMind AI – API client
 * Communicates with the FastAPI backend.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/* ── Upload ────────────────────────────────────────── */
export async function uploadDocument(file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE}/upload`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail ?? "Upload failed");
  }
  return res.json();
}

/* ── Ask (non-stream) ─────────────────────────────── */
export async function askQuestion(documentId: string, question: string) {
  const res = await fetch(`${BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: documentId, question }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Query failed" }));
    throw new Error(err.detail ?? "Query failed");
  }
  return res.json();
}

/* ── Ask (stream) ──────────────────────────────────── */
export async function askQuestionStream(
  documentId: string,
  question: string,
  onToken: (t: string) => void,
  onDone: (sources: string[], sourceTexts: SourceText[]) => void,
  onError: (e: Error) => void,
) {
  try {
    const res = await fetch(`${BASE}/ask/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ document_id: documentId, question }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Stream failed" }));
      throw new Error(err.detail ?? "Stream failed");
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("ReadableStream not supported");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) continue;
        try {
          const data = JSON.parse(trimmed.slice(6));
          if (data.done) {
            onDone(data.sources ?? [], data.source_texts ?? []);
          } else {
            onToken(data.token);
          }
        } catch {
          /* skip malformed lines */
        }
      }
    }
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}

/* ── Documents ─────────────────────────────────────── */
export async function getDocuments() {
  const res = await fetch(`${BASE}/documents`);
  return res.json();
}

export async function deleteDocument(id: string) {
  const res = await fetch(`${BASE}/documents/${id}`, { method: "DELETE" });
  return res.json();
}

/* ── Types ─────────────────────────────────────────── */
export interface SourceText {
  page: number;
  text: string;
}

export interface DocumentMeta {
  id: string;
  filename: string;
  num_chunks: number;
  size_mb?: number;
}