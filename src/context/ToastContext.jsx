import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(1);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((opts) => {
    const id = idRef.current++;
    const type = opts?.type || "info";
    const title = opts?.title || "";
    const description = String(opts?.description || "");
    const durationMs = Number.isFinite(opts?.durationMs) ? opts.durationMs : 3500;

    setToasts((prev) => [...prev, { id, type, title, description }]);

    if (durationMs > 0) {
      window.setTimeout(() => remove(id), durationMs);
    }

    return id;
  }, [remove]);

  const api = useMemo(() => ({ push, remove }), [push, remove]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div style={containerStyle}>
        {toasts.map((t) => (
          <div key={t.id} style={{ ...toastStyle, ...typeStyle(t.type) }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {t.title ? <div style={titleStyle}>{t.title}</div> : null}
                <div style={descStyle}>{t.description}</div>
              </div>
              <button onClick={() => remove(t.id)} style={closeBtnStyle} aria-label="Close">
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

const containerStyle = {
  position: "fixed",
  right: 16,
  bottom: 16,
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  width: "min(420px, calc(100vw - 32px))",
};

const toastStyle = {
  borderRadius: 12,
  padding: "12px 12px",
  border: "1px solid rgba(0,0,0,0.12)",
  boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
  background: "#ffffff",
  color: "#0f172a",
};

const titleStyle = {
  fontWeight: 800,
  fontSize: 13,
  marginBottom: 2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const descStyle = {
  fontSize: 13,
  lineHeight: 1.35,
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
};

const closeBtnStyle = {
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(0,0,0,0.04)",
  borderRadius: 10,
  width: 32,
  height: 32,
  cursor: "pointer",
  color: "#0f172a",
  flex: "0 0 auto",
};

function typeStyle(type) {
  switch (String(type || "").toLowerCase()) {
    case "success":
      return { borderColor: "rgba(22,163,74,0.35)", background: "#f0fdf4" };
    case "error":
      return { borderColor: "rgba(220,38,38,0.35)", background: "#fef2f2" };
    case "warning":
      return { borderColor: "rgba(245,158,11,0.45)", background: "#fffbeb" };
    default:
      return { borderColor: "rgba(59,130,246,0.25)", background: "#eff6ff" };
  }
}
