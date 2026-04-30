# RAG Project Progress

Stack: FastAPI (Python backend) · React + TypeScript (frontend) · ChromaDB (vector store) · Claude API (LLM)

---

## Phase 1 — Crash Course & Planning ✓
- [x] What is RAG (concepts: embeddings, vector DB, retrieval loop)
- [x] What is FastAPI
- [x] How the pieces fit together
- [x] Create this progress file

## Phase 2 — Environment Setup ✓
- [x] Install Python, create virtual environment
- [x] Install FastAPI + Uvicorn
- [x] Install ChromaDB (vector database)
- [x] Install Anthropic SDK
- [x] Set up React + TypeScript frontend (Vite)
- [x] Create project folder structure

## Phase 3 — Ingest Pipeline ✓
- [x] PDF text extraction (pdfplumber)
- [x] Chunking with overlap
- [x] ChromaDB storage
- [x] POST /ingest route

## Phase 4 — Query Pipeline ✓
- [x] ChromaDB similarity search
- [x] Prompt construction with retrieved context
- [x] Claude API call
- [x] POST /query route

## Phase 5 — Frontend ✓
- [x] React + Tailwind setup
- [x] Upload section → POST /ingest
- [x] Query section → POST /query
- [x] Sources display
- [x] Swiss minimalist light theme (Helvetica, high contrast)

---

## Next Steps

### Must Do
- [ ] End-to-end test once Anthropic credits are active
- [ ] Add .gitignore and push to GitHub
- [ ] Deploy backend (Railway or Render)
- [ ] Deploy frontend (Vercel)

### Polish
- [ ] Loading spinner animation while waiting for answer
- [ ] Support uploading multiple PDFs (different companies)
- [ ] Show which company/file each chunk came from
- [ ] Button to clear the vector DB and start fresh
- [ ] Streaming responses (answer appears word by word)

### Nice to Have
- [ ] Dockerfile for the backend
- [ ] Mobile layout fine-tuning
- [ ] Demo video for LinkedIn post

---

## Notes / Decisions
- **Project:** Earnings Call Analyzer — upload earnings call PDFs, ask natural language questions
- **Document type:** PDF only (transcripts, 10-Ks from SEC.gov / investor relations pages)
- Vector DB: ChromaDB (persistent, runs in-process)
- LLM: claude-sonnet-4-6
- Frontend: React + Vite + Tailwind v4
- PDF parsing: pdfplumber
