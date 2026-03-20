import { useEffect, useState } from "react";
import { getProblemReports } from "../../helper/api";

export default function ProblemReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await getProblemReports();
      setReports(Array.isArray(data) ? data : []);
    } catch (e) {
      setReports([]);
      setMessage(e?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(900px, 95vw)",
              maxHeight: "85vh",
              overflow: "auto",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div style={{ fontWeight: 700 }}>
                Report #{selected.id}
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  border: "1px solid #dadce0",
                  background: "#f1f3f4",
                  borderRadius: "10px",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>

            <div style={{ padding: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", rowGap: "10px", columnGap: "12px" }}>
                <div style={label}>Student</div>
                <div>{selected.student_full_name || selected.student_school_id || selected.student_id || "—"}</div>

                <div style={label}>Email</div>
                <div>{selected.student_email || "—"}</div>

                <div style={label}>Status</div>
                <div>{String(selected.status || "").toLowerCase()}</div>

                <div style={label}>Created</div>
                <div>{selected.created_at ? new Date(selected.created_at).toLocaleString() : "—"}</div>
              </div>

              <div style={{ marginTop: "14px" }}>
                <div style={{ ...label, marginBottom: "6px" }}>Message</div>
                <div style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "12px",
                  background: "#fafafa",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.45,
                }}>
                  {selected.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
        <h2 style={{ marginTop: 0 }}>Problem Reports</h2>
        <button
          onClick={load}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #dadce0",
            background: "#f1f3f4",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {message && (
        <div style={{ marginBottom: "12px", color: "#c62828" }}>{message}</div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Student</th>
              <th style={th}>Email</th>
              <th style={th}>Message</th>
              <th style={th}>Status</th>
              <th style={th}>Created</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} style={tdMuted}>
                  Loading...
                </td>
              </tr>
            )}

            {!loading && reports.length === 0 && (
              <tr>
                <td colSpan={6} style={tdMuted}>
                  No reports.
                </td>
              </tr>
            )}

            {!loading && reports.map((r) => (
              <tr
                key={r.id}
                onClick={() => setSelected(r)}
                style={{ cursor: "pointer" }}
              >
                <td style={td}>{r.id}</td>
                <td style={td}>{r.student_full_name || r.student_school_id || r.student_id || "—"}</td>
                <td style={td}>{r.student_email || "—"}</td>
                <td style={{ ...td, textAlign: "left", maxWidth: "640px" }}>
                  <div style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "640px",
                  }}>
                    {r.message}
                  </div>
                </td>
                <td style={td}>{String(r.status || "").toLowerCase()}</td>
                <td style={td}>{r.created_at ? new Date(r.created_at).toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th = {
  padding: "14px",
  border: "1px solid #cfd8e3",
  fontWeight: "600",
  fontSize: "14px",
  textAlign: "center",
  background: "#0d47a1",
  color: "#fff",
  whiteSpace: "nowrap",
};

const td = {
  padding: "12px",
  border: "1px solid #e0e6ef",
  fontSize: "13.5px",
  textAlign: "center",
  color: "#102a43",
  background: "#fff",
  verticalAlign: "top",
};

const tdMuted = {
  ...td,
  color: "#667085",
};

const label = {
  fontSize: "12px",
  fontWeight: 700,
  color: "#475467",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};
