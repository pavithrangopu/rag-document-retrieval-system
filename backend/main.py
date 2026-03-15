"""
DocuMind AI – FastAPI Application
REST endpoints for document upload, querying and management.
"""

from __future__ import annotations

import asyncio
import json
import os
import shutil
import uuid

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from config import MAX_FILE_SIZE_MB, UPLOAD_DIR
from rag_pipeline import RAGPipeline

# ── App ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="DocuMind AI",
    description="Intelligent Document Question Answering System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(UPLOAD_DIR, exist_ok=True)

# In-memory stores (swap for a DB in production)
rag_pipelines: dict[str, RAGPipeline] = {}
documents_meta: dict[str, dict] = {}


# ── Schemas ────────────────────────────────────────────────────────────
class QuestionRequest(BaseModel):
    document_id: str
    question: str


# ── Routes ─────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"message": "DocuMind AI API is running 🚀"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are supported.")

    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(400, f"File exceeds {MAX_FILE_SIZE_MB} MB limit.")

    doc_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{doc_id}.pdf")

    with open(file_path, "wb") as f:
        f.write(contents)

    try:
        pipeline = RAGPipeline()
        num_chunks = pipeline.process_document(file_path)

        rag_pipelines[doc_id] = pipeline
        documents_meta[doc_id] = {
            "id": doc_id,
            "filename": file.filename,
            "num_chunks": num_chunks,
            "size_mb": round(size_mb, 2),
            "file_path": file_path,
        }

        return {
            "document_id": doc_id,
            "filename": file.filename,
            "num_chunks": num_chunks,
            "size_mb": round(size_mb, 2),
            "message": "Document processed successfully",
        }
    except Exception as exc:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(500, f"Processing error: {exc}")


@app.post("/ask")
async def ask_question(req: QuestionRequest):
    if req.document_id not in rag_pipelines:
        raise HTTPException(404, "Document not found – please upload first.")
    return rag_pipelines[req.document_id].query(req.question)


@app.post("/ask/stream")
async def ask_question_stream(req: QuestionRequest):
    if req.document_id not in rag_pipelines:
        raise HTTPException(404, "Document not found.")

    result = rag_pipelines[req.document_id].query(req.question)

    async def event_generator():
        words = result["answer"].split(" ")
        for word in words:
            payload = json.dumps({"token": word + " ", "done": False})
            yield f"data: {payload}\n\n"
            await asyncio.sleep(0.03)

        final = json.dumps(
            {
                "token": "",
                "done": True,
                "sources": result["sources"],
                "source_texts": result["source_texts"],
            }
        )
        yield f"data: {final}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/documents")
async def list_documents():
    return list(documents_meta.values())


@app.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    if document_id not in documents_meta:
        raise HTTPException(404, "Document not found.")

    fp = documents_meta[document_id].get("file_path", "")
    if os.path.exists(fp):
        os.remove(fp)
    rag_pipelines.pop(document_id, None)
    documents_meta.pop(document_id, None)
    return {"message": "Deleted"}