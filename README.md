# EarningsLensAI

Ask natural language questions about any earnings call transcript or 10-K filing.

Upload a PDF and ask anything. EarningsLensAI chunks the document, stores it in a vector database, retrieves the most relevant passages, and uses Claude to generate a grounded answer with source citations.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React · TypeScript · Vite |
| Backend | FastAPI · Python 3.12 |
| Vector DB | ChromaDB (in-memory) |
| LLM | Claude (`claude-haiku-4-5`) |
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
  → find top 5 similar chunks (cosine similarity)
  → build prompt with retrieved context
  → Claude generates a grounded answer
  → return answer + source passages
```

---

## Docker (quickest start)

Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) running.

Create `backend/.env` with your API key:

```
ANTHROPIC_API_KEY=your-key-here
```

Then:

```bash
docker compose up --build
```

- Frontend → `http://localhost`
- Backend API → `http://localhost:8000`

ChromaDB data persists between restarts via a named Docker volume. To wipe it: `docker compose down -v`.

---

## Setup (manual)

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

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
```

Create a `.env` file in `frontend/`:

```
VITE_API_URL=http://127.0.0.1:8000
```

Start the dev server:

```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

## Usage

1. Go to `http://localhost:5173`
2. Upload an earnings call PDF (SEC EDGAR, or a company's investor relations page)
3. Ask any question about the document

Example questions:
- *"What did management say about revenue guidance?"*
- *"What risks were mentioned in the call?"*
- *"How did the CFO explain the margin decline?"*

---

## Notes

- Uploading a new PDF replaces the previous document — only one filing is held in memory at a time.
- ChromaDB runs in-memory; the index is lost on server restart, so re-upload after restarting.
- The sidebar includes step-by-step instructions for downloading a 10-K as a PDF from SEC EDGAR.
