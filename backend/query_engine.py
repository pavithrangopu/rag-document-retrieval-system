"""
DocuMind AI – Query Engine (Gemini 2.5 Flash)
"""

import google.generativeai as genai
from config import GEMINI_API_KEY

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

PROMPT_TEMPLATE = """You are DocuMind AI, an intelligent document assistant.

Answer the user's question using the CONTEXT provided below.

CONTEXT (from the uploaded document):
---
{context}
---

USER QUESTION:
{question}

RULES:
1. Use information from the CONTEXT to answer the question.
2. You may perform simple reasoning such as counting questions, interpreting ranges (e.g., 11–20), or summarizing information.
3. If the answer truly does not exist in the context, reply exactly:
   "I could not find the answer in the uploaded document."
4. When referencing information, cite the page number in brackets, e.g. [Page 1].
5. Be concise and clear.

ANSWER:
"""


def _build_context(relevant_chunks) -> str:
    parts = []
    for chunk in relevant_chunks:
        page = chunk.metadata.get("page", 0) + 1
        parts.append(f"[Page {page}]: {chunk.page_content}")
    return "\n\n".join(parts)


def _extract_sources(relevant_chunks):
    pages = sorted(set(
        chunk.metadata.get("page", 0) + 1 for chunk in relevant_chunks
    ))
    sources = [f"Page {p}" for p in pages]
    source_texts = [
        {
            "page": chunk.metadata.get("page", 0) + 1,
            "text": chunk.page_content[:300]
            + ("…" if len(chunk.page_content) > 300 else ""),
        }
        for chunk in relevant_chunks
    ]
    return sources, source_texts


def generate_answer(question: str, relevant_chunks) -> dict:
    """Generate an answer using Google Gemini 2.5 Flash."""
    context = _build_context(relevant_chunks)
    prompt = PROMPT_TEMPLATE.format(context=context, question=question)
    sources, source_texts = _extract_sources(relevant_chunks)

    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel("gemini-2.5-flash")
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.1,
                    max_output_tokens=1024,
                ),
            )
            answer = response.text
        except Exception as e:
            answer = f"⚠️ Gemini API Error: {str(e)}"
    else:
        answer = "⚠️ *No Gemini API key configured – showing relevant excerpts.*\n\n"
        for chunk in relevant_chunks:
            page = chunk.metadata.get("page", 0) + 1
            answer += f"**Page {page}:**\n{chunk.page_content}\n\n"

    return {
        "answer": answer,
        "sources": sources,
        "source_texts": source_texts,
    }