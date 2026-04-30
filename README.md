# EarningsLensAI

Ask natural language questions about any earnings call transcript.

Upload a PDF — an earnings call, 10-K, or analyst transcript — and ask anything. CallSight chunks the document, stores it in a vector database, retrieves the most relevant passages, and uses Claude to generate a grounded answer with source citations.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React · TypeScript · Vite · Tailwind CSS |
| Backend | FastAPI · Python 3.12 |
| Vector DB | ChromaDB (persistent, in-process) |
| LLM | Claude (claude-sonnet-4-6) |
| PDF Parsing | pdfplumber |

---

## How It Works

```
PDF Upload
  → extract text (pdfplumber)
  → split into 500-word chunks with 50-word overlap
  → embed + store in ChromaDB

User Question
  → embed question
  → find top 5 similar chunks (ChromaDB)
  → build prompt with retrieved context
  → Claude generates answer
  → return answer + source chunks
```

---

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # Windows
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:

```
ANTHROPIC_API_KEY=your-key-here
```

Start the server:

```bash
uvicorn main:app --reload
```

API runs at `http://127.0.0.1:8000` — interactive docs at `/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

---

## Usage

1. Go to `http://localhost:5173`
2. Upload an earnings call PDF (find transcripts at SEC.gov or a company's investor relations page)
3. Ask any question about the document

Example questions:
- *"What did management say about revenue guidance?"*
- *"What risks were mentioned in the call?"*
- *"How did the CFO explain the margin decline?"*
