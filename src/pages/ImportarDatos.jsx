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

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function getFileIcon(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsx") || name.endsWith(".xls") || name.endsWith(".csv")) {
    return <FileSpreadsheet className="w-8 h-8 text-emerald-400" />;
  }
  if (name.endsWith(".pdf")) {
    return <FileText className="w-8 h-8 text-red-400" />;
  }
  if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg")) {
    return <FileImage className="w-8 h-8 text-blue-400" />;
  }
  return <File className="w-8 h-8 text-gray-400" />;
}

function getFileTypeLabel(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsx")) return "Excel (XLSX)";
  if (name.endsWith(".xls")) return "Excel (XLS)";
  if (name.endsWith(".csv")) return "CSV";
  if (name.endsWith(".pdf")) return "PDF";
  if (name.endsWith(".png")) return "PNG";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "JPG";
  return "Archivo";
}

export default function ImportarDatos() {
  const [status, setStatus] = useState("idle");
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const dragCounter = useRef(0);
  const xhrRef = useRef(null);

  const isValidFile = useCallback((file) => {
    const name = file.name.toLowerCase();
    return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
  }, []);

  const handleFile = useCallback(
    (file) => {
      if (!file) return;
      if (!isValidFile(file)) {
        setError(`Tipo de archivo no permitido. Acepta: ${ACCEPTED_EXTENSIONS.join(", ")}`);
        setStatus("error");
        return;
      }
      setSelectedFile(file);
      setStatus("idle");
      setResult(null);
      setError(null);
      setProgress(0);
    },
    [isValidFile]
  );

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (dragCounter.current === 1) setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setDragging(false);
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
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setProgress(pct);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let data = {};
        try {
          data = JSON.parse(xhr.responseText);
        } catch {
          data = { mensaje: "Archivo procesado correctamente." };
        }
        setResult(data);
        setStatus("success");
        setProgress(100);
      } else {
        let msg = `Error ${xhr.status}`;
        try {
          const data = JSON.parse(xhr.responseText);
          msg = data?.mensaje || data?.error || data?.message || msg;
        } catch {}
        setError(msg);
        setStatus("error");
      }
    });

    xhr.addEventListener("error", () => {
      setError("Error de red. Verifica tu conexión e intenta nuevamente.");
      setStatus("error");
    });

    xhr.addEventListener("abort", () => {
      setError("Carga cancelada.");
      setStatus("error");
    });

    xhr.open("POST", UPLOAD_URL);
    xhr.setRequestHeader("x-factory-key", "factory2026");
    xhr.send(formData);
  }, [selectedFile]);

  const handleCancel = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
  }, []);

  const handleClear = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setSelectedFile(null);
    setStatus("idle");
    setProgress(0);
    setResult(null);
    setError(null);
    setDragging(false);
    dragCounter.current = 0;
  }, []);

  const isUploading = status === "uploading";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white px-4 py-8 md:px-8 md:py-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-[#6C63FF]/20 border border-[#6C63FF]/30">
            <CloudUpload className="w-6 h-6 text-[#6C63FF]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Importar Datos
          </h1>
        </div>
        <p className="text-gray-400 text-sm md:text-base ml-1">
          Carga archivos mediante drag &amp; drop o selección manual. Formatos
          permitidos:{" "}
          <span className="text-[#00D4AA] font-medium">
            XLSX, XLS, CSV, PDF, PNG, JPG
          </span>
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Drop Zone */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !isUploading && inputRef.current?.click()}
          className={`
            relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
            flex flex-col items-center justify-center text-center
            min-h-[220px] md:min-h-[280px] p-8 select-none
            ${
              dragging
                ? "border-[#6C63FF] bg-[#6C63FF]/10 scale-[1.01] shadow-lg shadow-[#6C63FF]/20"
                : isSuccess
                ? "border-[#00D4AA]/50 bg-[#00D4AA]/5"
                : isError
                ? "border-red-500/50 bg-red-500/5"
                : "border-[#1A1A2E] bg-[#1A1A2E]/40 hover:border-[#6C63FF]/50 hover:bg-[#6C63FF]/5"
            }
            ${isUploading ? "pointer-events-none" : ""}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS.join(",")}
            onChange={handleInputChange}
            className="hidden"
            disabled={isUploading}
          />

          {!selectedFile ? (
            <>
              <div
                className={`
                  p-5 rounded-full mb-4 transition-all duration-300
                  ${
                    dragging
                      ? "bg-[#6C63FF]/30 scale-110"
                      : "bg-[#1A1A2E] border border-[#6C63FF]/20"
                  }
                `}
              >
                <Upload
                  className={`w-10 h-10 transition-colors duration-300 ${
                    dragging ? "text-[#6C63FF]" : "text-gray-500"
                  }`}
                />
              </div>
              <p className="text-lg font-semibold text-gray-200 mb-1">
                {dragging
                  ? "Suelta el archivo aquí"
                  : "Arrastra y suelta tu archivo"}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                o haz clic para seleccionar desde tu dispositivo
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {ACCEPTED_EXTENSIONS.map((ext) => (
                  <span
                    key={ext}
                    className="px-2.5 py-1 rounded-lg bg-[#0A0A0F] border border-[#1A1A2E] text-xs text-gray-400 font-mono"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 w-full max-w-sm">
              <div className="p-4 rounded-2xl bg-[#0A0A0F] border border-[#1A1A2E]">
                {getFileIcon(selectedFile)}
              </div>
              <div className="text-center">
                <p className="font-semibold text-white text-base break-all leading-tight">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  <span className="text-[#00D4AA] font-medium">
                    {getFileTypeLabel(selectedFile)}
                  </span>{" "}
                  · {formatBytes(selectedFile.size)}
                </p>
              </div>
              {!isUploading && !isSuccess && (
                <p className="text-xs text-gray-500">
                  Haz clic para cambiar el archivo
                </p>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {(isUploading || isSuccess) && (
          <div className="rounded-xl bg-[#1A1A2E] border border-[#6C63FF]/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">
                {isUploading ? "Subiendo archivo..." : "¡Carga completada!"}
              </span>
              <span
                className={`text-sm font-bold ${
                  isSuccess ? "text-[#00D4AA]" : "text-[#6C63FF]"
                }`}
              >
                {progress}%
              </span>
            </div>
            <div className="w-full bg-[#0A0A0F] rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isSuccess
                    ? "bg-gradient-to-r from-[#00D4AA] to-[#6C63FF]"
                    : "bg-gradient-to-r from-[#6C63FF] to-[#00D4AA]"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {isUploading && (
              <p className="text-xs text-gray-500 mt-2">
                {selectedFile?.name} · {formatBytes(selectedFile?.size || 0)}
              </p>
            )}
          </div>
        )}

        {/* Success Result */}
        {isSuccess && result && (
          <div className="rounded-xl border border-[#00D4AA]/30 bg-[#00D4AA]/5 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#00D4AA] flex-shrink-0" />
              <span className="font-semibold text-[#00D4AA]">
                Importación exitosa
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {result.filas_insertadas !== undefined && (
                <div className="rounded-lg bg-[#0A0A0F] border border-[#1A1A2E] p-3 text-center">
                  <p className="text-2xl font-bold text-[#00D4AA]">
                    {result.filas_insertadas}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Filas insertadas
                  </p>
                </div>
              )}
              {result.tabla && (
                <div className="rounded-lg bg-[#0A0A0F] border border-[#1A1A2E] p-3 text-center">
                  <p className="text-sm font-bold text-[#6C63FF] break-all">
                    {result.tabla}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Tabla destino</p>
                </div>
              )}
              {result.errores !== undefined && (
                <div className="rounded-lg bg-[#0A0A0F] border border-[#1A1A2E] p-3 text-center">
                  <p
                    className={`text-2xl font-bold ${
                      result.errores > 0 ? "text-yellow-400" : "text-gray-400"
                    }`}
                  >
                    {result.errores}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Errores</p>
                </div>
              )}
            </div>
            {result.mensaje && (
              <p className="text-sm text-gray-300 bg-[#0A0A0F] rounded-lg p-3 border border-[#1A1A2E]">
                {result.mensaje}
              </p>
            )}
            {/* Raw extra fields */}
            {Object.keys(result).filter(
              (k) =>
                !["filas_insertadas", "tabla", "errores", "mensaje"].includes(k)
            ).length > 0 && (
              <div className="rounded-lg bg-[#0A0A0F] border border-[#1A1A2E] p-3">
                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
                  Detalles adicionales
                </p>
                <pre className="text-xs text-gray-300 overflow-auto max-h-32 whitespace-pre-wrap break-all">
                  {JSON.stringify(
                    Object.fromEntries(
                      Object.entries(result).filter(
                        ([k]) =>
                          !["filas_insertadas", "tabla", "errores", "mensaje"].includes(k)
                      )
                    ),
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Error Result */}
        {isError && error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-400 mb-1">
                  Error al importar
                </p>
                <p className="text-sm text-gray-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {selectedFile && !isUploading && !isSuccess && (
            <button
              onClick={handleUpload}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-200
                bg-gradient-to-r from-[#6C63FF] to-[#5a52e0] hover:from-[#7c74ff] hover:to-[#6C63FF]
                shadow-lg shadow-[#6C63FF]/25 hover:shadow-[#6C63FF]/40 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Upload className="w-5 h-5" />
              Importar archivo
            </button>
          )}

          {isUploading && (
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-200
                bg-[#1A1A2E] border border-red-500/40 hover:bg-red-500/10 hover:border-red-500/70"
            >
              <X className="w-5 h-5 text-red-400" />
              <Loader2 className="w-4 h-4 text-[#6C63FF] animate-spin" />
              Cancelar carga
            </button>
          )}

          {(selectedFile || isSuccess || isError) && (
            <button
              onClick={handleClear}
              disabled={isUploading}
              className={`
                flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200
                border border-[#1A1A2E] text-gray-400 hover:text-white hover:border-red-500/40 hover:bg-red-500/5
                ${isUploading ? "opacity-40 cursor-not-allowed" : ""}
                ${!selectedFile && !isSuccess && !isError ? "hidden" : ""}
              `}
            >
              <Trash2 className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>

        {/* Instructions */}
        {status === "idle" && !selectedFile && (
          <div className="rounded-xl bg-[#1A1A2E]/50 border border-[#1A1A2E] p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Instrucciones
            </p>
            <ul className="space-y-2">
              {[
                "Arrastra un archivo al área de carga o haz clic para seleccionarlo.",
                "Se aceptan archivos Excel (.xlsx, .xls), CSV, PDF e imágenes (.png, .jpg).",
                "Una vez seleccionado, pulsa «Importar archivo» para iniciar la carga.",
                "Podrás ver el progreso en tiempo real y el resultado al finalizar.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#6C63FF]/20 border border-[#6C63FF]/30 text-[#6C63FF] text-xs flex items-center justify-center font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}