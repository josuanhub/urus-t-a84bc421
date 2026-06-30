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
  Table,
  Hash,
} from "lucide-react";

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
  "image/jpg",
  "image/jpeg",
];

const UPLOAD_URL =
  "https://www.urusverify.com/v1/factory/project/a84bc421-28d0-4551-81af-7aec26e13526/upload-data";

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileIcon = (name) => {
  const ext = name?.split(".").pop()?.toLowerCase();
  if (["xlsx", "xls", "csv"].includes(ext))
    return <FileSpreadsheet className="w-8 h-8 text-[#00D4AA]" />;
  if (ext === "pdf") return <FileText className="w-8 h-8 text-red-400" />;
  if (["png", "jpg", "jpeg"].includes(ext))
    return <Image className="w-8 h-8 text-[#6C63FF]" />;
  return <File className="w-8 h-8 text-gray-400" />;
};

const getFileExtBadge = (name) => {
  const ext = name?.split(".").pop()?.toUpperCase();
  const colors = {
    XLSX: "bg-emerald-900 text-emerald-300",
    XLS: "bg-emerald-900 text-emerald-300",
    CSV: "bg-teal-900 text-teal-300",
    PDF: "bg-red-900 text-red-300",
    PNG: "bg-purple-900 text-purple-300",
    JPG: "bg-purple-900 text-purple-300",
    JPEG: "bg-purple-900 text-purple-300",
  };
  return (
    <span
      className={`text-xs font-bold px-2 py-0.5 rounded ${colors[ext] || "bg-gray-800 text-gray-300"}`}
    >
      {ext}
    </span>
  );
};

export default function ImportarDatos() {
  const [state, setState] = useState("idle");
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const dragCounter = useRef(0);

  const isValidFile = (f) => {
    const ext = "." + f.name.split(".").pop().toLowerCase();
    return ACCEPTED_TYPES.includes(ext) || ACCEPTED_MIME.includes(f.type);
  };

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (!isValidFile(f)) {
      setError(
        `Tipo de archivo no permitido. Acepta: ${ACCEPTED_TYPES.join(", ")}`
      );
      setState("error");
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
    setState("idle");
  }, []);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    dragCounter.current = 0;
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleInputChange = (e) => {
    const selected = e.target.files[0];
    if (selected) handleFile(selected);
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!file) return;
    setState("uploading");
    setProgress(0);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await new Promise((resolve) => {
        let p = 0;
        const interval = setInterval(() => {
          p += Math.random() * 18;
          if (p >= 85) {
            clearInterval(interval);
            setProgress(85);
            resolve();
          } else {
            setProgress(Math.min(p, 85));
          }
        }, 200);
      });

      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: {
          "x-factory-key": "factory2026",
        },
        body: formData,
      });

      setProgress(100);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.message || `Error del servidor: ${response.status}`
        );
      }

      const data = await response.json();
      setResult(data);
      setState("success");
    } catch (err) {
      setError(err.message || "Error inesperado al subir el archivo.");
      setState("error");
      setProgress(0);
    }
  };

  const handleClear = () => {
    setFile(null);
    setProgress(0);
    setResult(null);
    setError(null);
    setState("idle");
    setDragging(false);
    dragCounter.current = 0;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white px-4 py-10 md:px-8 lg:px-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center">
              <CloudUpload className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Importar Datos
            </h1>
          </div>
          <p className="text-gray-400 text-sm ml-13 pl-1">
            Sube archivos de forma segura mediante arrastre o selección manual.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !file && inputRef.current?.click()}
          className={`
            relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
            flex flex-col items-center justify-center gap-4 px-6 py-14
            ${dragging
              ? "border-[#6C63FF] bg-[#6C63FF]/10 scale-[1.01]"
              : file
              ? "border-[#00D4AA]/50 bg-[#00D4AA]/5 cursor-default"
              : "border-gray-700 bg-[#1A1A2E]/40 hover:border-[#6C63FF]/60 hover:bg-[#6C63FF]/5"
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleInputChange}
            className="hidden"
          />

          {!file ? (
            <>
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  dragging
                    ? "bg-[#6C63FF]/30 scale-110"
                    : "bg-[#1A1A2E] border border-gray-700"
                }`}
              >
                <Upload
                  className={`w-9 h-9 transition-colors duration-300 ${dragging ? "text-[#6C63FF]" : "text-gray-500"}`}
                />
              </div>

              <div className="text-center">
                <p
                  className={`font-semibold text-base mb-1 transition-colors duration-300 ${dragging ? "text-[#6C63FF]" : "text-gray-200"}`}
                >
                  {dragging
                    ? "Suelta el archivo aquí"
                    : "Arrastra tu archivo aquí"}
                </p>
                <p className="text-gray-500 text-sm">
                  o{" "}
                  <span
                    className="text-[#6C63FF] hover:text-[#00D4AA] font-medium underline underline-offset-2 cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      inputRef.current?.click();
                    }}
                  >
                    selecciona un archivo
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {ACCEPTED_TYPES.map((t) => (
                  <span
                    key={t}
                    className="text-xs text-gray-500 bg-gray-800/60 border border-gray-700/50 px-2 py-0.5 rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </>
          ) : (
            /* File Preview Card */
            <div className="w-full max-w-md">
              <div className="bg-[#1A1A2E] border border-[#00D4AA]/20 rounded-xl p-4 flex items-center gap-4">
                <div className="flex-shrink-0">{getFileIcon(file.name)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-sm text-gray-100 truncate max-w-[200px]">
                      {file.name}
                    </span>
                    {getFileExtBadge(file.name)}
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatBytes(file.size)}
                  </p>
                </div>
                {state !== "uploading" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="flex-shrink-0 p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    title="Quitar archivo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              {state === "uploading" && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>Subiendo archivo...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-[#6C63FF] to-[#00D4AA]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upload Button */}
        {file && state !== "uploading" && state !== "success" && (
          <button
            onClick={handleUpload}
            className="mt-5 w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide
              bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] text-white
              hover:opacity-90 active:scale-[0.98] transition-all duration-200
              flex items-center justify-center gap-2 shadow-lg shadow-[#6C63FF]/20"
          >
            <CloudUpload className="w-4 h-4" />
            Subir archivo
          </button>
        )}

        {/* Success Result */}
        {state === "success" && result && (
          <div className="mt-6 bg-[#1A1A2E] border border-[#00D4AA]/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#00D4AA]">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold text-base">
                Archivo procesado correctamente
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {result.filas_insertadas !== undefined && (
                <div className="bg-[#0A0A0F] border border-gray-800 rounded-xl p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <Hash className="w-3.5 h-3.5" />
                    Filas insertadas
                  </div>
                  <span className="text-2xl font-bold text-[#00D4AA]">
                    {result.filas_insertadas.toLocaleString()}
                  </span>
                </div>
              )}

              {result.tabla && (
                <div className="bg-[#0A0A0F] border border-gray-800 rounded-xl p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <Table className="w-3.5 h-3.5" />
                    Tabla destino
                  </div>
                  <span className="text-base font-semibold text-[#6C63FF] truncate">
                    {result.tabla}
                  </span>
                </div>
              )}

              {result.errores !== undefined && (
                <div className="bg-[#0A0A0F] border border-gray-800 rounded-xl p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Errores
                  </div>
                  <span
                    className={`text-2xl font-bold ${result.errores > 0 ? "text-red-400" : "text-gray-400"}`}
                  >
                    {result.errores}
                  </span>
                </div>
              )}
            </div>

            {result.errores > 0 && result.detalle_errores && (
              <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-400 mb-2">
                  Detalle de errores:
                </p>
                <pre className="text-xs text-red-300/80 whitespace-pre-wrap break-all">
                  {typeof result.detalle_errores === "string"
                    ? result.detalle_errores
                    : JSON.stringify(result.detalle_errores, null, 2)}
                </pre>
              </div>
            )}

            {/* Raw response if extra fields */}
            {Object.keys(result).some(
              (k) => !["filas_insertadas", "tabla", "errores", "detalle_errores"].includes(k)
            ) && (
              <details className="group">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 transition-colors select-none">
                  Ver respuesta completa
                </summary>
                <pre className="mt-2 text-xs text-gray-400 bg-[#0A0A0F] border border-gray-800 rounded-xl p-3 overflow-auto max-h-48 whitespace-pre-wrap break-all">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            )}

            <button
              onClick={handleClear}
              className="w-full mt-2 py-2.5 rounded-xl border border-gray-700 text-sm font-medium
                text-gray-400 hover:text-white hover:border-gray-500 hover:bg-gray-800/40
                transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Limpiar e importar otro archivo
            </button>
          </div>
        )}

        {/* Error State */}
        {state === "error" && error && (
          <div className="mt-5 bg-red-950/30 border border-red-800/50 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-300 text-sm mb-1">
                  Error al procesar el archivo
                </p>
                <p className="text-red-400/80 text-xs leading-relaxed">{error}</p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="mt-4 w-full py-2.5 rounded-xl border border-red-800/50 text-sm font-medium
                text-red-400 hover:text-red-200 hover:border-red-600 hover:bg-red-900/20
                transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Limpiar e intentar de nuevo
            </button>
          </div>
        )}

        {/* Footer hint */}
        <p className="mt-8 text-center text-xs text-gray-600">
          Tamaño máximo recomendado: 50 MB · Los datos se procesan de forma segura.
        </p>
      </div>
    </div>
  );
}