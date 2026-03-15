<<<<<<< HEAD
<div align="center">

# 🧠 DocuMind AI

### Intelligent Document Question-Answering System

**Upload PDFs · Ask Questions · Get Answers with Source Citations**

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge)
![FAISS](https://img.shields.io/badge/FAISS-0467DF?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 PDF Upload | Drag & drop or click to upload any PDF |
| 🔍 Semantic Search | FAISS vector database with sentence-transformer embeddings |
| 💬 Chat Interface | Beautiful ChatGPT-style conversation UI |
| 📌 Source Citations | Every answer cites the exact page number |
| 🌊 Streaming Responses | Real-time word-by-word answer delivery |
| 🌙 Dark Mode | Modern AI dashboard with glassmorphism |
| ⚡ Fast Processing | Chunks, embeds, and indexes in seconds |

---

## 🏗️ Architecture

```
┌─────────────┐     PDF      ┌─────────────────────────────────┐
│   Frontend   │ ──────────▸ │         FastAPI Backend          │
│  (Next.js)   │             │                                   │
│              │  Question   │  ┌──────────┐   ┌─────────────┐  │
│  Chat UI     │ ──────────▸ │  │PDF Loader│──▸│Text Splitter│  │
│  Upload Box  │             │  └──────────┘   └──────┬──────┘  │
│  Sidebar     │  Stream     │                        │          │
│  Sources     │ ◂────────── │  ┌──────────┐   ┌──────▼──────┐  │
│              │             │  │  OpenAI   │◂──│   FAISS     │  │
│              │             │  │  (LLM)    │   │ VectorStore │  │
│              │             │  └──────────┘   └─────────────┘  │
└─────────────┘             └─────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- (Optional) OpenAI API key for LLM answers

### 1. Clone the repo

```bash
git clone https://github.com/your-username/documind-ai.git
cd documind-ai
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY (optional)

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

> 🔔 First launch downloads the embedding model (~90 MB). Subsequent starts are instant.

### 3. Frontend Setup

```bash
cd frontend
npm install

# Configure environment
cp .env.local.example .env.local

# Start dev server
npm run dev
```

### 4. Open the App

Navigate to **http://localhost:3000**

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Upload & process a PDF |
| `POST` | `/ask` | Ask a question (full response) |
| `POST` | `/ask/stream` | Ask a question (SSE stream) |
| `GET` | `/documents` | List all uploaded documents |
| `DELETE` | `/documents/{id}` | Delete a document |
| `GET` | `/health` | Health check |

### Upload

```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@document.pdf"
```

Response:

```json
{
  "document_id": "uuid",
  "filename": "document.pdf",
  "num_chunks": 42,
  "message": "Document processed successfully"
}
```

### Ask

```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"document_id": "uuid", "question": "What is the main topic?"}'
```

Response:

```json
{
  "answer": "The document discusses...",
  "sources": ["Page 3", "Page 5"],
  "source_texts": [
    { "page": 3, "text": "Relevant excerpt..." },
    { "page": 5, "text": "Another excerpt..." }
  ]
}
```

---

## 🛠️ Tech Stack

**Frontend:** Next.js 14 · TailwindCSS · Framer Motion · Lucide Icons

**Backend:** FastAPI · LangChain · FAISS · SentenceTransformers · PyPDF

**AI Models:**
- Embeddings: `sentence-transformers/all-MiniLM-L6-v2`
- LLM: OpenAI GPT-3.5-turbo (or extractive fallback)

---

## 📁 Project Structure

```
documind-ai/
├── backend/
│   ├── main.py            # FastAPI app & routes
│   ├── config.py           # Environment config
│   ├── pdf_loader.py       # PDF text extraction & chunking
│   ├── embeddings.py       # Sentence-transformer model
│   ├── vector_store.py     # FAISS index management
│   ├── query_engine.py     # LLM prompt & answer generation
│   ├── rag_pipeline.py     # Orchestration layer
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Entry point
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── ChatUI.tsx      # Main chat component
│   │   ├── Sidebar.tsx     # Document sidebar
│   │   ├── UploadBox.tsx   # Drag & drop upload
│   │   ├── MessageBubble.tsx
│   │   ├── SourceCard.tsx
│   │   ├── WelcomeScreen.tsx
│   │   └── AnimatedBackground.tsx
│   └── lib/
│       └── api.ts          # API client
│
└── README.md
```

---

## ⚙️ Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | *(empty)* | OpenAI key for LLM answers |
| `EMBEDDING_MODEL` | `sentence-transformers/all-MiniLM-L6-v2` | HuggingFace model |
| `CHUNK_SIZE` | `500` | Characters per chunk |
| `CHUNK_OVERLAP` | `50` | Overlap between chunks |
| `TOP_K` | `4` | Chunks retrieved per query |
| `MAX_FILE_SIZE_MB` | `50` | Max upload size |

---

## 📸 Screenshots

> After running the app, take screenshots and place them in a `/screenshots` directory.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ using RAG, FAISS, and modern web technologies**

</div>
=======
# rag-document-retrieval-system
An AI-powered Retrieval Augmented Generation (RAG) system that allows users to query documents and retrieve accurate answers using vector embeddings and LLMs.
>>>>>>> 5069b4f8f797c81ec6541b9fd0c9b6a31a68a325
