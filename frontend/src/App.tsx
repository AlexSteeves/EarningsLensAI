import { useState } from "react";

type Result = {
  answer: string;
  sources: string[];
} | null;

const wrap: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "0 32px",
};

const font = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export default function App() {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState<string>("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    setUploadStatus("");

    try {
      const res = await fetch("http://127.0.0.1:8000/ingest", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploadStatus(res.ok ? data.message : `Error: ${data.detail}`);
    } catch {
      setUploadStatus("Network error — is the backend running?");
    } finally {
      setUploading(false);
    }
  }

  async function handleAsk() {
    if (!question.trim()) return;

    setAsking(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ answer: data.answer, sources: data.sources });
      } else {
        setError(data.detail);
      }
    } catch {
      setError("Network error — is the backend running?");
    } finally {
      setAsking(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f7f5",
        color: "#0d0d0d",
        fontFamily: font,
      }}
    >
      <header style={{ borderBottom: "1px solid #e2e2e0" }}>
        <div
          style={{
            ...wrap,
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "15px",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "#0d0d0d",
            }}
          >
            Earnings Call Analyzer
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#b0b0b0",
            }}
          >
            Claude
          </span>
        </div>
      </header>

      <main style={{ ...wrap, paddingTop: "80px", paddingBottom: "80px" }}>
        <section style={{ marginBottom: "72px" }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "#b0b0b0",
              marginBottom: "20px",
            }}
          >
            Upload Transcript
          </p>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "160px",
              border: "1px dashed #d0d0ce",
              borderRadius: "4px",
              cursor: uploading ? "not-allowed" : "pointer",
              transition: "border-color 0.15s",
              gap: "6px",
              background: "#fff",
            }}
            onMouseEnter={(e) => {
              if (!uploading)
                (e.currentTarget as HTMLElement).style.borderColor = "#0d0d0d";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#d0d0ce";
            }}
          >
            <span
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#0d0d0d",
                letterSpacing: "-0.01em",
              }}
            >
              {uploading ? "Processing..." : "Select PDF"}
            </span>
            <span
              style={{ fontSize: "12px", color: "#b0b0b0", fontWeight: 400 }}
            >
              Earnings calls · 10-Ks · Transcripts
            </span>
            <input
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
          {uploadStatus && (
            <p
              style={{
                marginTop: "12px",
                fontSize: "13px",
                color: "#16a34a",
                fontWeight: 500,
              }}
            >
              {uploadStatus}
            </p>
          )}
        </section>

        <section>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "#b0b0b0",
              marginBottom: "20px",
            }}
          >
            Ask a Question
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !asking && handleAsk()}
              placeholder="What did management say about revenue guidance?"
              style={{
                flex: 1,
                background: "#fff",
                border: "1px solid #e2e2e0",
                borderRadius: "4px",
                padding: "12px 16px",
                fontSize: "15px",
                color: "#0d0d0d",
                outline: "none",
                transition: "border-color 0.15s",
                fontFamily: font,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0d0d0d")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e2e0")}
            />
            <button
              onClick={handleAsk}
              disabled={asking || !question.trim()}
              style={{
                width: "72px",
                background: "#0d0d0d",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.02em",
                cursor: asking || !question.trim() ? "not-allowed" : "pointer",
                opacity: asking || !question.trim() ? 0.25 : 1,
                transition: "opacity 0.15s",
                fontFamily: font,
              }}
            >
              {asking ? "···" : "Ask"}
            </button>
          </div>

          {error && (
            <p
              style={{
                marginTop: "12px",
                fontSize: "13px",
                color: "#dc2626",
                fontWeight: 500,
              }}
            >
              {error}
            </p>
          )}

          {result && (
            <div style={{ marginTop: "28px" }}>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e2e0",
                  borderRadius: "4px",
                  padding: "24px 28px",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.8",
                    color: "#0d0d0d",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {result.answer}
                </p>
              </div>
              <details style={{ marginTop: "16px" }}>
                <summary
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "#b0b0b0",
                    cursor: "pointer",
                    listStyle: "none",
                  }}
                >
                  {result.sources.length} sources retrieved
                </summary>
                <ul
                  style={{
                    marginTop: "10px",
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {result.sources.map((s, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: "12px",
                        color: "#8a8a8a",
                        background: "#fff",
                        border: "1px solid #e2e2e0",
                        borderRadius: "4px",
                        padding: "10px 14px",
                        lineHeight: "1.6",
                      }}
                    >
                      {s.slice(0, 220)}…
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
