import chromadb
import anthropic


def query_earnings(question: str, collection_name: str="earnings") -> dict:
    client = chromadb.PersistentClient(path="./chroma_db")
    collection = client.get_or_create_collection(collection_name)

    results = collection.query(
        query_texts=[question],
        n_results=5
    )

    chunks = results["documents"][0]
    context = "\n\n".join(chunks)

    prompt = f"""
    
    You are a financial analyst assistant. Use the following excerpts from an earnings call transcript to answer the question.
    Context:
    {context}

    Question: {question}

    Answer based only on the context provided. If the answer is not in the context, say so.
    """
    
    ai_client = anthropic.Anthropic()
    response = ai_client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )

    return {
        "answer": response.content[0].text,
        "sources": chunks
    }

