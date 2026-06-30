import { useState, useRef, useCallback } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  Image,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Table2,
  Rows,
} from "lucide-react";

const UPLOAD_URL =
  "https://www.urusverify.com/v1/factory/project/a84bc421-28d0-4551-81af-7aec26e13526/upload-data";
const FACTORY_KEY = "factory2026";

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
  if (!file) return <File className="w-8 h-8" />;
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsx") || name.endsWith(".xls"))
    return <FileSpreadsheet className="w-8 h-8 text-emerald-400" />;
  if (name.endsWith(".csv"))
    return <FileSpreadsheet className="w-8 h-8 text-teal-400" />;
  if (name.endsWith(".pdf"))
    return <FileText className="w-8 h-8 text-red-400" />;
  if (name.endsWith(".png") || name.endsWith(".jpg"))
    return <Image className="w-8 h-8 text-blue-400" />;
  return <File className="w-8 h-8 text-gray-400" />;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function isFileAccepted(file) {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export default function ImportarDatos() {
  const [status, setStatus] = useState("idle"); // idle | dragging | uploading | success | error
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);
  const xhrRef = useRef(null);

  const handleReset = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setStatus("idle");
    setSelectedFile(null);
    setProgress(0);
    setResult(null);
    setErrorMsg("");
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleFileSelect = useCallback((file) => {
    setFileError("");
    setResult(null);
    setErrorMsg("");
    if (!file) return;
    if (!isFileAccepted(file)) {
      setFileError(
        `Tipo de archivo no permitido. Acepta: ${ACCEPTED_EXTENSIONS.join(", ")}`
      );
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setFileError("El archivo supera el límite de 50 MB.");
      return;
    }
    setSelectedFile(file);
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
    setStatus((prev) => (prev === "dragging" ? "idle" : prev));
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setStatus("idle");
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
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
    xhr.setRequestHeader("x-factory-key", FACTORY_KEY);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setProgress(pct);
      }
    });

    xhr.addEventListener("load", () => {
      xhrRef.current = null;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          setResult(data);
          setStatus("success");
          setProgress(100);
        } catch {
          setResult({ raw: xhr.responseText });
          setStatus("success");
          setProgress(100);
        }
      } else {
        let msg = `Error ${xhr.status}`;
        try {
          const data = JSON.parse(xhr.responseText);
          msg = data.message || data.error || msg;
        } catch {}
        setErrorMsg(msg);
        setStatus("error");
      }
    });

    xhr.addEventListener("error", () => {
      xhrRef.current = null;
      setErrorMsg("Error de red. Verifica tu conexión e inténtalo nuevamente.");
      setStatus("error");
    });

    xhr.addEventListener("abort", () => {
      xhrRef.current = null;
    });

    xhr.send(formData);
  }, [selectedFile]);

  const isDragging = status === "dragging";
  const isUploading = status === "uploading";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-[#6C63FF]/20 border border-[#6C63FF]/30">
              <UploadCloud className="w-6 h-6 text-[#6C63FF]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Importar Datos
            </h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base ml-[52px]">
            Sube archivos y sincroniza información con el sistema t.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
            ${isDragging
              ? "border-[#6C63FF] bg-[#6C63FF]/10 scale-[1.01]"
              : "border-[#1A1A2E] bg-[#1A1A2E]/60 hover:border-[#6C63FF]/60 hover:bg-[#6C63FF]/5"
            }
            ${isUploading ? "pointer-events-none opacity-80" : ""}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS.join(",")}
            onChange={handleInputChange}
            className="hidden"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center justify-center gap-4 py-14 px-6 text-center">
            <div
              className={`p-5 rounded-full transition-all duration-300
              ${isDragging
                ? "bg-[#6C63FF]/30 shadow-[0_0_30px_#6C63FF55]"
                : "bg-[#0A0A0F]/80 border border-[#1A1A2E]"
              }`}
            >
              <UploadCloud
                className={`w-10 h-10 transition-colors duration-300 ${
                  isDragging ? "text-[#6C63FF]" : "text-gray-500"
                }`}
              />
            </div>

            {isDragging ? (
              <p className="text-[#6C63FF] font-semibold text-lg">
                Suelta el archivo aquí
              </p>
            ) : (
              <>
                <div>
                  <p className="text-white font-semibold text-base sm:text-lg">
                    Arrastra y suelta tu archivo
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    o{" "}
                    <span className="text-[#6C63FF] font-medium underline underline-offset-2">
                      haz clic para seleccionar
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {ACCEPTED_EXTENSIONS.map((ext) => (
                    <span
                      key={ext}
                      className="px-2 py-0.5 rounded-full text-xs font-mono bg-[#0A0A0F] border border-[#1A1A2E] text-gray-400"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-xs">Máximo 50 MB</p>
              </>
            )}
          </div>
        </div>

        {/* File Error */}
        {fileError && (
          <div className="mt-4 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-400 text-sm">{fileError}</p>
          </div>
        )}

        {/* Selected File Card */}
        {selectedFile && !fileError && (
          <div className="mt-5 bg-[#1A1A2E]/80 border border-[#1A1A2E] rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-4">
              <div className="shrink-0">{getFileIcon(selectedFile)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {selectedFile.name}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {formatBytes(selectedFile.size)}
                </p>
              </div>
              {!isUploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="shrink-0 p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {(isUploading || isSuccess) && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-gray-400">
                    {isUploading ? "Subiendo..." : "Completado"}
                  </span>
                  <span className="text-xs font-mono text-[#00D4AA]">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-[#0A0A0F] rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isSuccess
                        ? "bg-[#00D4AA]"
                        : "bg-gradient-to-r from-[#6C63FF] to-[#00D4AA]"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && !fileError && !isSuccess && (
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`mt-4 w-full py-3.5 px-6 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2
              ${isUploading
                ? "bg-[#6C63FF]/40 cursor-not-allowed text-white/60"
                : "bg-[#6C63FF] hover:bg-[#5a52e0] active:scale-[0.98] text-white shadow-[0_0_20px_#6C63FF44] hover:shadow-[0_0_30px_#6C63FF66]"
              }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Subiendo archivo…
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5" />
                Subir archivo
              </>
            )}
          </button>
        )}

        {/* Success Result */}
        {isSuccess && result && (
          <div className="mt-5 bg-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-[#00D4AA]" />
              <h3 className="text-[#00D4AA] font-semibold">
                Importación exitosa
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.tabla !== undefined && (
                <div className="bg-[#0A0A0F]/60 rounded-xl p-3 flex items-center gap-3">
                  <Table2 className="w-5 h-5 text-[#6C63FF] shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Tabla destino</p>
                    <p className="text-white font-medium text-sm truncate">
                      {result.tabla}
                    </p>
                  </div>
                </div>
              )}

              {result.filas_insertadas !== undefined && (
                <div className="bg-[#0A0A0F]/60 rounded-xl p-3 flex items-center gap-3">
                  <Rows className="w-5 h-5 text-[#00D4AA] shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Filas insertadas</p>
                    <p className="text-white font-medium text-sm">
                      {result.filas_insertadas.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {result.errores && result.errores.length > 0 && (
              <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
                <p className="text-yellow-400 text-xs font-semibold mb-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Advertencias ({result.errores.length})
                </p>
                <ul className="space-y-1 max-h-32 overflow-y-auto">
                  {result.errores.map((err, i) => (
                    <li key={i} className="text-yellow-300/80 text-xs font-mono">
                      {typeof err === "string" ? err : JSON.stringify(err)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.raw && (
              <div className="mt-3 bg-[#0A0A0F]/60 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Respuesta del servidor</p>
                <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                  {result.raw}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Error Result */}
        {isError && (
          <div className="mt-5 bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h3 className="text-red-400 font-semibold">Error al importar</h3>
            </div>
            <p className="text-red-300/80 text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Reset Button */}
        {(isSuccess || isError) && (
          <button
            onClick={handleReset}
            className="mt-4 w-full py-3 px-6 rounded-2xl font-semibold text-sm border border-[#1A1A2E] text-gray-400 hover:text-white hover:border-[#6C63FF]/50 hover:bg-[#6C63FF]/5 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar y subir otro archivo
          </button>
        )}

        {/* Info Footer */}
        <div className="mt-8 pt-6 border-t border-[#1A1A2E]">
          <p className="text-center text-gray-600 text-xs">
            Sistema t · Los archivos se procesan de forma segura vía API cifrada
          </p>
        </div>
      </div>
    </div>
  );
}