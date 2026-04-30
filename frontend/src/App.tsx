import { useState } from "react";
import ReactMarkdown from "react-markdown";

type Result = {
  answer: string;
  sources: string[];
} | null;

const font = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const API_URL = import.meta.env.VITE_API_URL;

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
    setResult(null);
    setError("");

    try {
      const res = await fetch(`${API_URL}/ingest`, {
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
      const res = await fetch(`${API_URL}/query`, {
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
        <div className="header-inner">
          <div className="header-spacer-sidebar" />
          <div className="header-spacer-gap" />
          <span
            style={{
              fontSize: "18px",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              color: "#0d0d0d",
            }}
          >
            Earnings Call Analyzer
          </span>
        </div>
      </header>

      <div className="page-layout">
        {/* Sidebar */}
        <aside className="page-sidebar">
          <p
            style={{
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#c0c0be",
              marginBottom: "14px",
            }}
          >
            How to get a filing
          </p>
          <ol
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {[
              <>
                Go to{" "}
                <a
                  href="https://www.sec.gov/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#a0a09e", textDecoration: "underline" }}
                >
                  SEC EDGAR
                </a>
              </>,
              "Search for your company",
              "Open the 10-K or earnings filing",
              "Click the menu in the top left",
              "Open as HTML",
              "Press Ctrl+P → Save as PDF",
              "Upload below",
            ].map((step, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    color: "#d0d0ce",
                    fontWeight: 600,
                    minWidth: "14px",
                    paddingTop: "1px",
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#b0b0ae",
                    lineHeight: "1.6",
                  }}
                >
                  {step}
                </span>
              </li>
            ))}
          </ol>

          <p
            style={{
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#c0c0be",
              marginBottom: "14px",
              marginTop: "32px",
            }}
          >
            Sample Filings
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { name: "Alphabet (Google)", url: "https://abc.xyz/investor/" },
              { name: "Microsoft", url: "https://www.microsoft.com/en-us/investor/sec-filings" },
            ].map(({ name, url }) => (
              <a key={name} href={url} target="_blank" rel="noreferrer" className="filing-link">
                {name}
                <span className="arrow">→</span>
              </a>
            ))}
          </div>
        </aside>

        <main className="page-main">
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
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#0d0d0d";
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
                fontWeight: 500,
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
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#0d0d0d")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e2e0")}
              />
              <button
                onClick={handleAsk}
                disabled={asking || uploading || !question.trim()}
                style={{
                  width: "72px",
                  background: "#0d0d0d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  cursor:
                    asking || uploading || !question.trim()
                      ? "not-allowed"
                      : "pointer",
                  opacity: asking || uploading || !question.trim() ? 0.25 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                {asking ? "···" : "Ask"}
              </button>
            </div>
            <p
              style={{
                marginTop: "8px",
                fontSize: "10px",
                color: "#c0c0be",
                textAlign: "right",
                letterSpacing: "0.08em",
              }}
            >
              claude-haiku-4-5
            </p>

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
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <p
                          style={{
                            fontSize: "20px",
                            fontWeight: 600,
                            lineHeight: 1.3,
                            letterSpacing: "-0.02em",
                            color: "#0d0d0d",
                            margin: "24px 0 10px 0",
                          }}
                        >
                          {children}
                        </p>
                      ),
                      h2: ({ children }) => (
                        <p
                          style={{
                            fontSize: "17px",
                            fontWeight: 600,
                            lineHeight: 1.35,
                            letterSpacing: "-0.01em",
                            color: "#0d0d0d",
                            margin: "20px 0 8px 0",
                          }}
                        >
                          {children}
                        </p>
                      ),
                      h3: ({ children }) => (
                        <p
                          style={{
                            fontSize: "15px",
                            fontWeight: 600,
                            lineHeight: 1.4,
                            color: "#2a2a2a",
                            margin: "16px 0 6px 0",
                          }}
                        >
                          {children}
                        </p>
                      ),
                      p: ({ children }) => (
                        <p
                          style={{
                            fontSize: "16px",
                            lineHeight: 1.6,
                            color: "#1a1a1a",
                            margin: "0 0 12px 0",
                          }}
                        >
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong style={{ fontWeight: 600, color: "#0d0d0d" }}>
                          {children}
                        </strong>
                      ),
                      ul: ({ children }) => (
                        <ul
                          style={{
                            paddingLeft: "20px",
                            margin: "8px 0 12px 0",
                          }}
                        >
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol
                          style={{
                            paddingLeft: "20px",
                            margin: "8px 0 12px 0",
                          }}
                        >
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li
                          style={{
                            fontSize: "16px",
                            lineHeight: 1.6,
                            color: "#1a1a1a",
                            marginBottom: "6px",
                          }}
                        >
                          {children}
                        </li>
                      ),
                    }}
                  >
                    {result.answer}
                  </ReactMarkdown>
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
    </div>
  );
}
