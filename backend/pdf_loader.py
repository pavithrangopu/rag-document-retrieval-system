"""
DocuMind AI – PDF Loader
Extracts text from PDF files and splits into chunks.
"""

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from config import CHUNK_SIZE, CHUNK_OVERLAP


def load_and_split_pdf(file_path: str):
    """Load a PDF and split it into overlapping text chunks."""
    loader = PyPDFLoader(file_path)
    documents = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    chunks = text_splitter.split_documents(documents)

    for chunk in chunks:
        chunk.metadata.setdefault("source", file_path)

    return chunks