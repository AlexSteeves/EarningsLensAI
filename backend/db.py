import os
import chromadb

# Render sets the RENDER env var automatically — use in-memory there
# Locally, persist to disk so re-uploads aren't needed on every restart
if os.getenv("RENDER"):
    client = chromadb.EphemeralClient()
else:
    client = chromadb.PersistentClient(path="./chroma_db")
