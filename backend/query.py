import anthropic
from db import client


def query_earnings(question: str, collection_name: str = "earnings") -> dict:
    collection = client.get_or_create_collection(collection_name)

    results = collection.query(
        query_texts=[question],
        n_results=5
    )

    chunks = results["documents"][0]
    if not chunks:
        return {"answer": "No documents have been uploaded yet. Please upload a transcript first.", "sources": []}
    context = "\n\n".join(chunks)

    prompt = f"""
        You are a financial analyst assistant. Your task is to answer questions using only information from earnings call transcript excerpts.

        Here is the context from the earnings call transcript:
        <context>
        {context}
        </context>

        Here is the question to answer:
        <question>
        {question}
        </question>

        Important rules:
        - Answer ONLY using information explicitly stated in the context above
        - If the answer is not in the context, respond with "The answer is not available in the provided context"
        - Be concise and precise - every word must add value
        - Use short, direct sentences
        - Avoid unnecessary elaboration or filler words
        - Format your response using markdown: use **bold** for key figures and percentages, and bullet points for lists
    """
    
    ai_client = anthropic.Anthropic()
    response = ai_client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )

    return {
        "answer": response.content[0].text,
        "sources": chunks
    }

