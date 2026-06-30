import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Image,
  File,
  CheckCircle,
  XCircle,
  Trash2,
  CloudUpload,
  AlertCircle,
  Table2,
  Hash,
} from "lucide-react";

const UPLOAD_URL =
  "https://www.urusverify.com/v1/factory/project/a84bc421-28d0-4551-81af-7aec26e13526/upload-data";

const ACCEPTED_TYPES = [
  ".xlsx",
  ".xls",
  ".csv",
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
];

const ACCEPTED_MIME = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/pdf",
  "image/png",
  "image/jpeg",
];

function getFileIcon(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsx") || name.endsWith(".xls") || name.endsWith(".csv")) {
    return <FileSpreadsheet className="w-8 h-8 text-[#00D4AA]" />;
  }
  if (name.endsWith(".pdf")) {
    return <FileText className="w-8 h-8 text-[#6C63FF]" />;
  }
  if (
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg")
  ) {
    return <Image className="w-8 h-8 text-[#6C63FF]" />;
  }
  return <File className="w-8 h-8 text-gray-400" />;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function isValidFile(file) {
  const name = file.name.toLowerCase();
  return ACCEPTED_TYPES.some((ext) => name.endsWith(ext));
}

export default function ImportarDatos() {
  const [status, setStatus] = useState("idle"); // idle | dragging | uploading | success | error
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragError, setDragError] = useState("");
  const fileInputRef = useRef(null);
  const xhrRef = useRef(null);

  const handleFile = useCallback((file) => {
    setDragError("");
    if (!isValidFile(file)) {
      setDragError(
        `Tipo de archivo no permitido. Acepta: ${ACCEPTED_TYPES.join(", ")}`
      );
      return;
    }
    setSelectedFile(file);
    setResult(null);
    setErrorMsg("");
    setProgress(0);
    setStatus("idle");
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus("dragging");
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus("idle");
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setStatus("idle");
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const handleUpload = useCallback(() => {
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
          setErrorMsg(
            data?.message ||
              data?.error ||
              `Error ${xhr.status}: ${xhr.statusText}`
          );
          setStatus("error");
        }
      } catch {
        setErrorMsg(`Error ${xhr.status}: Respuesta inesperada del servidor.`);
        setStatus("error");
      }
    };

    xhr.onerror = () => {
      setErrorMsg("Error de red. Verifica tu conexión e intenta nuevamente.");
      setStatus("error");
    };

    xhr.ontimeout = () => {
      setErrorMsg("La solicitud expiró. Intenta con un archivo más pequeño.");
      setStatus("error");
    };

    xhr.timeout = 120000;
    xhr.send(formData);
  }, [selectedFile]);

  const handleClear = useCallback(() => {
    if (xhrRef.current && status === "uploading") {
      xhrRef.current.abort();
    }
    setStatus("idle");
    setSelectedFile(null);
    setProgress(0);
    setResult(null);
    setErrorMsg("");
    setDragError("");
  }, [status]);

  const isUploading = status === "uploading";
  const isDragging = status === "dragging";

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#6C63FF]/20">
              <CloudUpload className="w-6 h-6 text-[#6C63FF]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Importar Datos
            </h1>
          </div>
          <p className="text-gray-400 text-sm md:text-base ml-1">
            Sube archivos para procesarlos e insertarlos en el sistema.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`
            relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
            flex flex-col items-center justify-center gap-4 p-10 md:p-16 mb-4
            ${isDragging
              ? "border-[#6C63FF] bg-[#6C63FF]/10 scale-[1.01]"
              : "border-[#2a2a4a] bg-[#1A1A2E]/60 hover:border-[#6C63FF]/60 hover:bg-[#1A1A2E]"
            }
            ${isUploading ? "pointer-events-none opacity-70" : ""}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={handleInputChange}
            disabled={isUploading}
          />

          {/* Animated icon */}
          <div
            className={`p-5 rounded-full transition-all duration-300 ${
              isDragging
                ? "bg-[#6C63FF]/30 scale-110"
                : "bg-[#1A1A2E] border border-[#2a2a4a]"
            }`}
          >
            <Upload
              className={`w-10 h-10 transition-colors duration-300 ${
                isDragging ? "text-[#6C63FF]" : "text-gray-500"
              }`}
            />
          </div>

          <div className="text-center">
            <p className="text-white font-semibold text-base md:text-lg mb-1">
              {isDragging
                ? "Suelta el archivo aquí"
                : "Arrastra y suelta tu archivo"}
            </p>
            <p className="text-gray-400 text-sm">
              o{" "}
              <span className="text-[#6C63FF] font-medium underline underline-offset-2">
                selecciona desde tu dispositivo
              </span>
            </p>
          </div>

          {/* Accepted formats */}
          <div className="flex flex-wrap justify-center gap-2">
            {[".xlsx", ".xls", ".csv", ".pdf", ".png", ".jpg"].map((ext) => (
              <span
                key={ext}
                className="px-2 py-0.5 rounded-md bg-[#0A0A0F] border border-[#2a2a4a] text-gray-400 text-xs font-mono"
              >
                {ext}
              </span>
            ))}
          </div>
        </div>

        {/* Drag error */}
        {dragError && (
          <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-red-400 text-sm">{dragError}</p>
          </div>
        )}

        {/* Selected file card */}
        {selectedFile && (
          <div className="mb-4 rounded-2xl bg-[#1A1A2E] border border-[#2a2a4a] p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-[#0A0A0F] border border-[#2a2a4a] shrink-0">
                {getFileIcon(selectedFile)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {selectedFile.name}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {formatBytes(selectedFile.size)}
                </p>
              </div>
              {!isUploading && status !== "success" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="p-2 rounded-lg hover:bg-[#0A0A0F] text-gray-500 hover:text-red-400 transition-colors"
                  title="Quitar archivo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Progress bar */}
            {(isUploading || status === "success") && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-gray-400">
                    {isUploading ? "Subiendo..." : "Completado"}
                  </span>
                  <span className="text-xs font-mono text-[#00D4AA]">
                    {progress}%
                  </span>
                </div>
                <div className="h-1.5 bg-[#0A0A0F] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      background:
                        status === "success"
                          ? "linear-gradient(90deg, #00D4AA, #6C63FF)"
                          : "linear-gradient(90deg, #6C63FF, #00D4AA)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        {selectedFile && status !== "success" && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleUpload}
              disabled={isUploading || !selectedFile}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200
                ${isUploading
                  ? "bg-[#6C63FF]/50 text-white/60 cursor-not-allowed"
                  : "bg-[#6C63FF] hover:bg-[#5a52e0] text-white shadow-lg shadow-[#6C63FF]/20 active:scale-[0.98]"
                }
              `}
            >
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Subiendo...
                </>
              ) : (
                <>
                  <CloudUpload className="w-4 h-4" />
                  Subir archivo
                </>
              )}
            </button>

            {!isUploading && (
              <button
                onClick={handleClear}
                className="py-3 px-4 rounded-xl border border-[#2a2a4a] text-gray-400 hover:text-white hover:border-[#6C63FF]/40 hover:bg-[#1A1A2E] transition-all duration-200"
                title="Limpiar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Success result */}
        {status === "success" && result && (
          <div className="rounded-2xl bg-[#1A1A2E] border border-[#00D4AA]/30 overflow-hidden mb-4">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-[#00D4AA]/10 border-b border-[#00D4AA]/20">
              <CheckCircle className="w-5 h-5 text-[#00D4AA]" />
              <span className="text-[#00D4AA] font-semibold text-sm">
                Archivo procesado exitosamente
              </span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#2a2a4a]">
              {result.tabla !== undefined && (
                <div className="flex flex-col items-center gap-1 px-4 py-5">
                  <Table2 className="w-5 h-5 text-[#6C63FF] mb-1" />
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    Tabla
                  </span>
                  <span className="text-white font-bold text-sm text-center break-all">
                    {result.tabla}
                  </span>
                </div>
              )}

              {result.filas_insertadas !== undefined && (
                <div className="flex flex-col items-center gap-1 px-4 py-5">
                  <Hash className="w-5 h-5 text-[#00D4AA] mb-1" />
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    Filas insertadas
                  </span>
                  <span className="text-[#00D4AA] font-bold text-2xl">
                    {result.filas_insertadas}
                  </span>
                </div>
              )}

              {result.errores !== undefined && (
                <div className="flex flex-col items-center gap-1 px-4 py-5">
                  <AlertCircle
                    className={`w-5 h-5 mb-1 ${
                      result.errores > 0 ? "text-yellow-400" : "text-gray-500"
                    }`}
                  />
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    Errores
                  </span>
                  <span
                    className={`font-bold text-2xl ${
                      result.errores > 0 ? "text-yellow-400" : "text-gray-500"
                    }`}
                  >
                    {result.errores}
                  </span>
                </div>
              )}
            </div>

            {/* Extra fields */}
            {Object.keys(result).filter(
              (k) =>
                !["tabla", "filas_insertadas", "errores", "message"].includes(k)
            ).length > 0 && (
              <div className="px-5 py-3 border-t border-[#2a2a4a]">
                <div className="space-y-1.5">
                  {Object.entries(result)
                    .filter(
                      ([k]) =>
                        !["tabla", "filas_insertadas", "errores"].includes(k)
                    )
                    .map(([key, val]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center text-xs"
                      >
                        <span className="text-gray-400 capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-gray-200 font-mono">
                          {String(val)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {result.message && (
              <div className="px-5 pb-4">
                <p className="text-gray-300 text-sm">{result.message}</p>
              </div>
            )}

            {/* Clear button in success */}
            <div className="px-5 pb-5 pt-1">
              <button
                onClick={handleClear}
                className="w-full py-2.5 rounded-xl border border-[#2a2a4a] text-gray-400 hover:text-white hover:border-[#6C63FF]/40 hover:bg-[#0A0A0F] transition-all duration-200 flex items-center justify-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Limpiar y subir otro archivo
              </button>
            </div>
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div className="rounded-2xl bg-[#1A1A2E] border border-red-500/30 overflow-hidden mb-4">
            <div className="flex items-start gap-3 px-5 py-4 bg-red-500/10">
              <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-400 font-semibold text-sm mb-1">
                  Error al procesar el archivo
                </p>
                <p className="text-red-300/70 text-sm">{errorMsg}</p>
              </div>
            </div>
            <div className="px-5 py-4">
              <button
                onClick={handleClear}
                className="w-full py-2.5 rounded-xl border border-[#2a2a4a] text-gray-400 hover:text-white hover:border-red-500/40 hover:bg-[#0A0A0F] transition-all duration-200 flex items-center justify-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Limpiar e intentar de nuevo
              </button>
            </div>
          </div>
        )}

        {/* Hint */}
        {status === "idle" && !selectedFile && (
          <p className="text-center text-gray-600 text-xs mt-2">
            Tamaño máximo recomendado: 50 MB · Procesado en el servidor
          </p>
        )}
      </div>
    </div>
  );
}