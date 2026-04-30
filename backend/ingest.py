import pdfplumber
import chromadb
import uuid

def extract_text(pdf_path: str) -> str:
    with pdfplumber.open(pdf_path) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)
    

def chunk_text(text:str, chunk_size: int=500, overlap: int=50) -> list[str]:
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks


def ingest_pdf(pdf_path: str, collection_name: str="earnings") -> int:
    text = extract_text(pdf_path)
    chunks = chunk_text(text)

    client = chromadb.PersistentClient(path="./chroma_db")
    collection = client.get_or_create_collection(collection_name)

    ids = [str(uuid.uuid4()) for _ in chunks]
    collection.add(documents=chunks, ids=ids)

    return len(chunks)


