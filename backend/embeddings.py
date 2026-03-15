"""
DocuMind AI – Embeddings
Provides the sentence-transformer embedding model.
"""

from langchain_huggingface import HuggingFaceEmbeddings
from config import EMBEDDING_MODEL

_embeddings_instance = None


def get_embeddings() -> HuggingFaceEmbeddings:
    """Return a singleton embedding model to avoid reloading."""
    global _embeddings_instance
    if _embeddings_instance is None:
        _embeddings_instance = HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )
    return _embeddings_instance