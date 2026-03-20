import { useEffect, useState } from "react";
import { getProblemReports } from "../../helper/api";

export default function ProblemReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
              <tr key={r.id}>
                <td style={td}>{r.id}</td>
                <td style={td}>{r.student_full_name || r.student_school_id || r.student_id || "—"}</td>
                <td style={td}>{r.student_email || "—"}</td>
                <td style={{ ...td, textAlign: "left", whiteSpace: "pre-wrap", maxWidth: "640px" }}>{r.message}</td>
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
