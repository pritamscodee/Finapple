import { api } from "@/api/api";
import { usefileStore, type FileItem } from "@/Store/FilesDataStore";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  ImageIcon,
  File,
  X,
  Upload,
  Plus,
  Trash2,
  Brain,
  Loader2,
} from "lucide-react";

const FONT_UI = "Helvetica Neue, Helvetica, Arial, sans-serif";
const FONT_BRAND = "IBM Plex Sans, Helvetica, Arial, sans-serif";

type AnalysisResult = {
  fileId: number;
  fileName: string;
  documentType: string;
  summary: string;
  entities: string[];
  dates: string[];
  amounts: string[];
  keyTerms: string[];
  riskFlags: string[];
  confidence: number;
  analyzedAt: string;
};

function FileIcon({ type }: { type: string | null }) {
  const style = { color: "#7132f5" };
  if (type === "raw") return <FileText size={22} style={style} />;
  if (type === "image") return <ImageIcon size={22} style={style} />;
  return <File size={22} style={style} />;
}

function AnalysisPanel({
  result,
  onClose,
}: {
  result: AnalysisResult;
  onClose: () => void;
}) {
  const Section = ({
    title,
    items,
    color,
  }: {
    title: string;
    items: string[];
    color: string;
  }) => {
    if (!items || items.length === 0) return null;
    return (
      <div style={{ marginBottom: "16px" }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#9497a9",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            margin: "0 0 8px",
          }}
        >
          {title}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {items.map((item, i) => (
            <span
              key={i}
              style={{
                backgroundColor: color,
                fontSize: "12px",
                padding: "3px 10px",
                borderRadius: "6px",
                color: "#101114",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(16,17,20,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 60,
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          width: "90vw",
          maxWidth: "600px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "rgba(0,0,0,0.25) 0px 16px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: "1px solid #dedee5",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Brain size={20} color="#7132f5" />
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#101114",
                fontFamily: FONT_BRAND,
              }}
            >
              AI Analysis
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(148,151,169,0.08)",
              border: "none",
              borderRadius: "8px",
              padding: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={18} color="#686b82" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                backgroundColor: "rgba(113,50,245,0.12)",
                color: "#7132f5",
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: "8px",
              }}
            >
              {result.documentType || "Unknown"}
            </span>
            <span
              style={{
                backgroundColor: "rgba(20,158,97,0.12)",
                color: "#149e61",
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: "8px",
              }}
            >
              {Math.round((result.confidence || 0) * 100)}% confidence
            </span>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#9497a9",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: "0 0 8px",
              }}
            >
              Summary
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "#484b5e",
                lineHeight: 1.6,
                margin: 0,
                backgroundColor: "#f8f8fb",
                padding: "12px",
                borderRadius: "10px",
              }}
            >
              {result.summary}
            </p>
          </div>

          <Section
            title="Entities"
            items={result.entities}
            color="rgba(113,50,245,0.08)"
          />
          <Section
            title="Dates"
            items={result.dates}
            color="rgba(20,158,97,0.08)"
          />
          <Section
            title="Amounts"
            items={result.amounts}
            color="rgba(20,158,97,0.12)"
          />
          <Section
            title="Key Terms"
            items={result.keyTerms}
            color="rgba(148,151,169,0.1)"
          />

          {result.riskFlags && result.riskFlags.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#9497a9",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  margin: "0 0 8px",
                }}
              >
                Risk Flags
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {result.riskFlags.map((flag, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: "rgba(239,68,68,0.08)",
                      color: "#ef4444",
                      fontSize: "12px",
                      padding: "3px 10px",
                      borderRadius: "6px",
                    }}
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p
            style={{
              fontSize: "11px",
              color: "#9497a9",
              margin: "16px 0 0",
              textAlign: "right",
            }}
          >
            Analyzed {new Date(result.analyzedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function VaultComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { files, GetFiles, DeleteFile } = usefileStore();

  async function handleUpload() {
    if (!file) return toast("Please select a file first");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post("/vault/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded successfully");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      await GetFiles();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(f: FileItem, e: React.MouseEvent) {
    e.stopPropagation();
    if (!f.publicId) return;
    setDeletingId(f.id);
    try {
      await DeleteFile(f.publicId);
      toast.success("File deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleAnalyze(f: FileItem, e: React.MouseEvent) {
    e.stopPropagation();
    setAnalyzingId(f.id);
    try {
      const res = await api.get(`/analysis/${f.id}`);
      setAnalysisResult(res.data);
    } catch {
      toast.error("Analysis failed");
    } finally {
      setAnalyzingId(null);
    }
  }

  useEffect(() => {
    GetFiles().catch(console.error);
  }, []);

  const getPreviewUrl = (f: FileItem) => {
    if (!f.url) return "";
    if (f.resource_type === "raw")
      return `https://docs.google.com/viewer?url=${encodeURIComponent(f.url)}&embedded=true`;
    return f.url;
  };

  return (
    <div style={{ fontFamily: FONT_UI, maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: FONT_BRAND,
            fontSize: "28px",
            fontWeight: 700,
            color: "#101114",
            letterSpacing: "-0.5px",
            margin: "0 0 6px",
          }}
        >
          My Vault
        </h1>
        <p style={{ fontSize: "14px", color: "#9497a9", margin: 0 }}>
          Upload, manage and analyze your important files
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #dedee5",
          padding: "24px",
          boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px",
          marginBottom: "32px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#101114",
            margin: "0 0 12px",
          }}
        >
          Upload a file
        </p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const dropped = e.dataTransfer.files?.[0];
            if (dropped) setFile(dropped);
          }}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "#7132f5" : file ? "#149e61" : "#dedee5"}`,
            borderRadius: "12px",
            padding: "28px 20px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: dragOver
              ? "rgba(133,91,251,0.04)"
              : file
                ? "rgba(20,158,97,0.04)"
                : "#fafafa",
            transition: "all 0.2s",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: file ? "rgba(20,158,97,0.12)" : "rgba(133,91,251,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <Upload size={20} color={file ? "#149e61" : "#7132f5"} />
          </div>
          {file ? (
            <>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#101114", margin: "0 0 4px" }}>
                {file.name}
              </p>
              <p style={{ fontSize: "12px", color: "#9497a9", margin: 0 }}>
                {(file.size / 1024).toFixed(1)} KB · Click to change
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#101114", margin: "0 0 4px" }}>
                Drag & drop or click to browse
              </p>
              <p style={{ fontSize: "12px", color: "#9497a9", margin: 0 }}>
                PDF, images and more
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {file && (
            <button
              onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ""; }}
              style={{
                padding: "13px 16px",
                borderRadius: "12px",
                border: "1px solid #dedee5",
                backgroundColor: "#ffffff",
                color: "#686b82",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: FONT_UI,
              }}
            >
              Clear
            </button>
          )}
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            style={{
              flex: 1,
              padding: "13px 16px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: file && !uploading ? "#7132f5" : "rgba(133,91,251,0.3)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: file && !uploading ? "pointer" : "not-allowed",
              fontFamily: FONT_UI,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Plus size={16} />
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </div>

      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_BRAND,
            fontSize: "18px",
            fontWeight: 700,
            color: "#101114",
            margin: 0,
            letterSpacing: "-0.3px",
          }}
        >
          Your Files
        </h2>
        <span
          style={{
            backgroundColor: "rgba(104,107,130,0.12)",
            color: "#484b5e",
            fontSize: "12px",
            fontWeight: 500,
            padding: "3px 10px",
            borderRadius: "8px",
          }}
        >
          {files.length} {files.length === 1 ? "file" : "files"}
        </span>
      </div>

      {files.length === 0 ? (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #dedee5",
            padding: "60px 20px",
            textAlign: "center",
            boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(133,91,251,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <File size={24} color="#7132f5" />
          </div>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "#101114", margin: "0 0 6px" }}>
            No files yet
          </p>
          <p style={{ fontSize: "13px", color: "#9497a9", margin: 0 }}>
            Upload your first file above
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {files.map((f: FileItem) => (
            <div
              key={f.id}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #dedee5",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                cursor: "pointer",
                transition: "box-shadow 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "rgba(113,50,245,0.1) 0px 4px 24px";
                e.currentTarget.style.borderColor = "rgba(113,50,245,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "rgba(0,0,0,0.03) 0px 4px 24px";
                e.currentTarget.style.borderColor = "#dedee5";
              }}
              onClick={() => setPreviewFile(f)}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(133,91,251,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileIcon type={f.resource_type} />
              </div>

              <div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#101114",
                    margin: "0 0 4px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {f.publicId ?? "Untitled"}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: "rgba(104,107,130,0.12)",
                    color: "#484b5e",
                    fontSize: "11px",
                    fontWeight: 500,
                    padding: "2px 8px",
                    borderRadius: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  {f.resource_type === "raw" ? "PDF" : (f.resource_type ?? "file")}
                </span>
              </div>

              <div
                style={{ display: "flex", gap: "6px", marginTop: "auto" }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => handleAnalyze(f, e)}
                  disabled={analyzingId === f.id}
                  title="Analyze with AI"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    padding: "7px 8px",
                    borderRadius: "8px",
                    border: "1px solid rgba(113,50,245,0.2)",
                    backgroundColor: "rgba(113,50,245,0.06)",
                    color: "#7132f5",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: analyzingId === f.id ? "not-allowed" : "pointer",
                    fontFamily: FONT_UI,
                  }}
                >
                  {analyzingId === f.id ? (
                    <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
                  ) : (
                    <Brain size={12} />
                  )}
                  {analyzingId === f.id ? "..." : "Analyze"}
                </button>

                <button
                  onClick={(e) => handleDelete(f, e)}
                  disabled={deletingId === f.id}
                  title="Delete file"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "7px 10px",
                    borderRadius: "8px",
                    border: "1px solid rgba(239,68,68,0.2)",
                    backgroundColor: "rgba(239,68,68,0.06)",
                    color: "#ef4444",
                    cursor: deletingId === f.id ? "not-allowed" : "pointer",
                  }}
                >
                  {deletingId === f.id ? (
                    <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
                  ) : (
                    <Trash2 size={12} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {previewFile && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(16,17,20,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setPreviewFile(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              width: "90vw",
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "rgba(0,0,0,0.25) 0px 16px 60px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
                borderBottom: "1px solid #dedee5",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(133,91,251,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FileIcon type={previewFile.resource_type} />
                </div>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#101114", fontFamily: FONT_UI }}>
                  {previewFile.publicId ?? "File Preview"}
                </span>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                style={{
                  background: "rgba(148,151,169,0.08)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={18} color="#686b82" />
              </button>
            </div>

            {previewFile.resource_type === "raw" ? (
              <iframe
                src={getPreviewUrl(previewFile)}
                style={{ flex: 1, border: "none", width: "100%" }}
                title="File Preview"
              />
            ) : (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px",
                  overflow: "auto",
                  backgroundColor: "#f8f8fb",
                }}
              >
                <img
                  src={previewFile.url ?? ""}
                  alt={previewFile.publicId ?? "preview"}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: "12px",
                    boxShadow: "rgba(0,0,0,0.08) 0px 4px 24px",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {analysisResult && (
        <AnalysisPanel
          result={analysisResult}
          onClose={() => setAnalysisResult(null)}
        />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default VaultComponent;
