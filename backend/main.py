from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from ingest import ingest_pdf
from query import query_earnings
from dotenv import load_dotenv


load_dotenv()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/ingest")
async def ingest(file: UploadFile = File (...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try: 
        chunk_count = ingest_pdf(temp_path)
        return {"message": f"Ingested {chunk_count} chunks"}
    finally:
        os.remove(temp_path)


@app.post("/query")
async def query(request: dict):
    question = request.get("question")
    if not question:
        raise HTTPException(status_code=400, detail= "Question is required")
    
    result = query_earnings(question)
    return result

