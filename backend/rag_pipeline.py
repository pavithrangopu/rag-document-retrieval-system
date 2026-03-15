"""
DocuMind AI – RAG Pipeline
Orchestrates document ingestion and query answering.
"""

from pdf_loader import load_and_split_pdf
from vector_store import create_vector_store
from query_engine import generate_answer
from config import TOP_K


class RAGPipeline:
    """Per-document RAG pipeline that holds its own FAISS index."""

    def __init__(self):
        self.vector_store = None
        self.chunks = None
        self.num_chunks = 0

    def process_document(self, file_path: str) -> int:
        self.chunks = load_and_split_pdf(file_path)
        self.num_chunks = len(self.chunks)
        self.vector_store = create_vector_store(self.chunks)
        return self.num_chunks

    def query(self, question: str) -> dict:
        if self.vector_store is None:
            return {
                "answer": "No document has been processed yet.",
                "sources": [],
                "source_texts": [],
            }

        relevant = self.vector_store.similarity_search(question, k=TOP_K)
        return generate_answer(question, relevant)