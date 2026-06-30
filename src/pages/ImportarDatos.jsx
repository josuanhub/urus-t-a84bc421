import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  CloudUpload,
} from "lucide-react";

const UPLOAD_URL =
  "https://www.urusverify.com/v1/factory/project/a84bc421-28d0-4551-81af-7aec26e13526/upload-data";

const ACCEPTED_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/pdf",
  "image/png",
  "image/jpeg",
];

const ACCEPTED_EXTENSIONS = [".xlsx", ".xls", ".csv", ".pdf", ".png", ".jpg"];

function getFileIcon(file) {
  if (!file) return <File size={24} />;
  const { type, name } = file;
  if (type.includes("spreadsheet") || name.endsWith(".xlsx") || name.endsWith(".xls") || type === "text/csv" || name.endsWith(".csv")) {
    return <FileSpreadsheet size={24} className="text-emerald-400" />;
  }
  if (type === "application/pdf" || name.endsWith(".pdf")) {
    return <FileText size={24} className="text-red-400" />;
  }
  if (type.startsWith("image/")) {
    return <FileImage size={24} className="text-blue-400" />;
  }
  return <File size={24} className="text-gray-400" />;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function ImportarDatos() {
  const [status, setStatus] = useState("idle"); // idle | dragging | uploading | success | error
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);
  const xhrRef = useRef(null);

  const validateFile = (file) => {
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext) && !ACCEPTED_TYPES.includes(file.type)) {
      return "Tipo de archivo no permitido. Acepta: .xlsx, .xls, .csv, .pdf, .png, .jpg";
    }
    if (file.size > 50 * 1024 * 1024) {
      return "El archivo supera el límite de 50 MB";
    }
    return null;
  };

  const handleFile = (file) => {
    const err = validateFile(file);
    if (err) {
      setErrorMsg(err);
      setStatus("error");
      return;
    }
    setSelectedFile(file);
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
    setProgress(0);
  };

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus("dragging");
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus((prev) => (prev === "dragging" ? "idle" : prev));
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus("idle");
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const uploadFile = () => {
    if (!selectedFile) return;

    setStatus("uploading");
    setProgress(0);
    setResult(null);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.open("POST", UPLOAD_URL, true);
    xhr.setRequestHeader("x-factory-key", "factory2026");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setProgress(pct);
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          setResult(data);
          setStatus("success");
          setProgress(100);
        } else {
          setErrorMsg(data?.message || data?.error || `Error del servidor (${xhr.status})`);
          setStatus("error");
        }
      } catch {
        setErrorMsg("Respuesta inválida del servidor");
        setStatus("error");
      }
    };

    xhr.onerror = () => {
      setErrorMsg("Error de red. Verifica tu conexión e intenta nuevamente.");
      setStatus("error");
    };

    xhr.onabort = () => {
      setStatus("idle");
      setProgress(0);
    };

    xhr.send(formData);
  };

  const handleClear = () => {
    if (xhrRef.current && status === "uploading") {
      xhrRef.current.abort();
    }
    setSelectedFile(null);
    setStatus("idle");
    setProgress(0);
    setResult(null);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isDragging = status === "dragging";
  const isUploading = status === "uploading";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}>
              <CloudUpload size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#6C63FF" }}>
              Importar Datos
            </h1>
          </div>
          <p className="text-gray-400 text-sm ml-13">
            Sube archivos Excel, CSV, PDF o imágenes para importar datos al sistema.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
            transition-all duration-300 select-none
            ${isDragging
              ? "border-[#6C63FF] bg-[#6C63FF]/10 scale-[1.01]"
              : isUploading
              ? "border-[#00D4AA]/50 bg-[#00D4AA]/5 cursor-not-allowed"
              : "border-[#1A1A2E] bg-[#1A1A2E]/60 hover:border-[#6C63FF]/60 hover:bg-[#6C63FF]/5"
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS.join(",")}
            onChange={onInputChange}
            className="hidden"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center gap-4 pointer-events-none">
            <div className={`
              w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
              ${isDragging ? "bg-[#6C63FF]/30 scale-110" : "bg-[#1A1A2E]"}
            `}>
              <Upload
                size={28}
                className={isDragging ? "text-[#6C63FF]" : "text-gray-500"}
              />
            </div>

            {isDragging ? (
              <p className="text-[#6C63FF] font-semibold text-lg">Suelta el archivo aquí</p>
            ) : (
              <>
                <div>
                  <p className="text-gray-200 font-medium text-base">
                    Arrastra un archivo aquí
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    o <span className="text-[#6C63FF] underline underline-offset-2">haz clic para seleccionar</span>
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {ACCEPTED_EXTENSIONS.map((ext) => (
                    <span
                      key={ext}
                      className="text-xs px-2 py-0.5 rounded-full bg-[#0A0A0F] border border-[#1A1A2E] text-gray-500 font-mono"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-xs">Tamaño máximo: 50 MB</p>
              </>
            )}
          </div>
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div className="mt-5 bg-[#1A1A2E] rounded-xl px-5 py-4 flex items-center gap-4 border border-[#6C63FF]/20">
            <div className="shrink-0">
              {getFileIcon(selectedFile)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{formatBytes(selectedFile.size)}</p>
            </div>
            {!isUploading && (
              <button
                onClick={(e) => { e.stopPropagation(); handleClear(); }}
                className="shrink-0 text-gray-600 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {isUploading && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[#00D4AA] text-sm">
                <Loader2 size={14} className="animate-spin" />
                <span>Subiendo archivo...</span>
              </div>
              <span className="text-gray-400 text-sm font-mono">{progress}%</span>
            </div>
            <div className="w-full bg-[#0A0A0F] rounded-full h-2 overflow-hidden border border-[#1A1A2E]">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #6C63FF, #00D4AA)",
                }}
              />
            </div>
          </div>
        )}

        {/* Success Result */}
        {isSuccess && result && (
          <div className="mt-5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={18} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold text-sm">Importación exitosa</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {result.filas_insertadas !== undefined && (
                <div className="bg-[#0A0A0F]/60 rounded-lg px-4 py-3">
                  <p className="text-gray-500 text-xs mb-1">Filas insertadas</p>
                  <p className="text-white font-bold text-xl">{result.filas_insertadas}</p>
                </div>
              )}
              {result.tabla && (
                <div className="bg-[#0A0A0F]/60 rounded-lg px-4 py-3">
                  <p className="text-gray-500 text-xs mb-1">Tabla destino</p>
                  <p className="text-[#6C63FF] font-semibold text-sm truncate">{result.tabla}</p>
                </div>
              )}
              {result.errores !== undefined && (
                <div className="bg-[#0A0A0F]/60 rounded-lg px-4 py-3">
                  <p className="text-gray-500 text-xs mb-1">Errores</p>
                  <p className={`font-bold text-xl ${result.errores > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                    {result.errores}
                  </p>
                </div>
              )}
            </div>
            {result.mensaje && (
              <p className="text-gray-400 text-xs mt-3 border-t border-emerald-500/10 pt-3">{result.mensaje}</p>
            )}
          </div>
        )}

        {/* Error Result */}
        {isError && errorMsg && (
          <div className="mt-5 bg-red-950/40 border border-red-500/30 rounded-xl p-5 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-semibold text-sm mb-1">Error al importar</p>
              <p className="text-gray-400 text-sm">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {selectedFile && !isUploading && (
            <button
              onClick={uploadFile}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}
            >
              <Upload size={16} />
              Importar archivo
            </button>
          )}

          {(selectedFile || isSuccess || isError) && (
            <button
              onClick={handleClear}
              disabled={isUploading}
              className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm text-gray-400 border border-[#1A1A2E] bg-[#1A1A2E]/60 hover:border-red-500/40 hover:text-red-400 hover:bg-red-950/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
              Limpiar
            </button>
          )}
        </div>

        {/* Accepted formats reminder */}
        {status === "idle" && !selectedFile && (
          <p className="text-center text-gray-700 text-xs mt-6">
            Sistema t · Importación segura con cifrado en tránsito
          </p>
        )}
      </div>
    </div>
  );
}