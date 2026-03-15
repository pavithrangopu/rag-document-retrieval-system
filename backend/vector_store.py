"""
DocuMind AI – Vector Store
Creates and queries FAISS indices.
"""

from langchain_community.vectorstores import FAISS
from embeddings import get_embeddings
from config import TOP_K


def create_vector_store(chunks) -> FAISS:
    """Build an in-memory FAISS index from document chunks."""
    embeddings = get_embeddings()
    vector_store = FAISS.from_documents(chunks, embeddings)
    return vector_store


def similarity_search(vector_store: FAISS, query: str, k: int = TOP_K):
    """Return the top-k most similar chunks to *query*."""
    results = vector_store.similarity_search_with_score(query, k=k)
    return results