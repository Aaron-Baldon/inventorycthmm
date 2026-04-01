import { useState, useEffect, useCallback } from "react";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";

const FAQ_BASE = process.env.REACT_APP_CHATBOT_BASE_URL || "http://localhost:5001";
const API = `${FAQ_BASE}/faqs`;

/* ================= STYLES ================= */

const th = {
	padding: "14px",
	border: "1px solid #cfd8e3",
	fontWeight: "600",
	fontSize: "14px",
	textAlign: "center",
	background: "#0d47a1",
	color: "#fff"
};

const td = {
	padding: "12px",
	border: "1px solid #e0e6ef",
	fontSize: "13.5px",
	textAlign: "center",
	color: "#102a43",
	background: "#fff"
};

const btnPrimary = {
	padding: "8px 14px",
	background: "#0d47a1",
	color: "#fff",
	border: "none",
	borderRadius: "6px",
	cursor: "pointer"
};

const btnEdit = {
	padding: "7px 12px",
	background: "#f9a825",
	color: "#fff",
	border: "none",
	borderRadius: "6px",
	cursor: "pointer"
};

const btnDelete = {
	padding: "7px 12px",
	background: "#c62828",
	color: "#fff",
	border: "none",
	borderRadius: "6px",
	cursor: "pointer"
};

const backdrop = {
	position: "fixed",
	inset: 0,
	background: "rgba(0,0,0,0.45)",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	zIndex: 20
};

const modal = {
	maxWidth: "92vw",
	width: "520px",
	padding: "26px",
	borderRadius: "10px",
	display: "flex",
	flexDirection: "column",
	gap: "14px"
};

const label = {
	fontSize: "14px",
	fontWeight: "500",
	marginTop: "4px"
};

const input = {
	width: "100%",
	padding: "10px 12px",
	borderRadius: "6px",
	border: "1px solid #6c757d",
	fontSize: "14px",
	boxSizing: "border-box"
};

const textarea = {
	width: "100%",
	padding: "10px 12px",
	borderRadius: "6px",
	border: "1px solid #6c757d",
	fontSize: "14px",
	boxSizing: "border-box",
	height: "120px"
};

const buttonRow = {
	display: "flex",
	justifyContent: "flex-end",
	gap: "10px",
	marginTop: "10px"
};

/* ================= COMPONENT ================= */

export default function FAQManager() {
	const toast = useToast();
	const { theme, themeName } = useTheme();
	const isDark = themeName === "dark";

	const modalTheme = {
		...modal,
		background: theme.card,
		color: theme.text,
		border: `1px solid ${theme.border}`,
	};

	const labelTheme = {
		...label,
		color: theme.text,
	};

	const inputTheme = {
		...input,
		background: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
		color: theme.text,
		border: `1px solid ${theme.border}`,
	};

	const textareaTheme = {
		...textarea,
		background: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
		color: theme.text,
		border: `1px solid ${theme.border}`,
	};

	const [faqs, setFaqs] = useState([]);
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");

	const [showModal, setShowModal] = useState(false);
	const [editingIndex, setEditingIndex] = useState(null);

	const loadFaqs = useCallback(async () => {
		try {
			const res = await fetch(API);
			if (!res.ok) throw new Error("Failed to load FAQs");
			const data = await res.json();
			setFaqs(Array.isArray(data) ? data : []);
		} catch (e) {
			console.error("loadFaqs error:", e);
			setFaqs([]);
			toast.push({ type: "error", title: "Load failed", description: e.message || "Failed to load FAQs" });
		}
	}, [toast]);

	useEffect(() => {
		loadFaqs();
	}, [loadFaqs]);

	const addFaq = async () => {
		try {
			const res = await fetch(API, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ question, answer })
			});
			if (!res.ok) throw new Error("Failed to add FAQ");
		} catch (e) {
			console.error("addFaq error:", e);
			toast.push({ type: "error", title: "Add failed", description: e.message || "Failed to add FAQ" });
			return;
		}

		setQuestion("");
		setAnswer("");
		setShowModal(false);

		loadFaqs();
	};

	const updateFaq = async () => {
		try {
			const res = await fetch(API + "/" + editingIndex, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ question, answer })
			});
			if (!res.ok) throw new Error("Failed to update FAQ");
		} catch (e) {
			console.error("updateFaq error:", e);
			toast.push({ type: "error", title: "Update failed", description: e.message || "Failed to update FAQ" });
			return;
		}

		setEditingIndex(null);
		setQuestion("");
		setAnswer("");
		setShowModal(false);

		loadFaqs();
	};

	const deleteFaq = async (index) => {
		try {
			const res = await fetch(API + "/" + index, {
				method: "DELETE"
			});
			if (!res.ok) throw new Error("Failed to delete FAQ");
		} catch (e) {
			console.error("deleteFaq error:", e);
			toast.push({ type: "error", title: "Delete failed", description: e.message || "Failed to delete FAQ" });
			return;
		}

		loadFaqs();
	};

	const openEdit = (faq, index) => {
		setQuestion(faq.question);
		setAnswer(faq.answer);
		setEditingIndex(index);
		setShowModal(true);
	};

	const openAdd = ()=>{
		setEditingIndex(null);
		setQuestion("");
		setAnswer("");
		setShowModal(true);
	};

	return (

	<div style={{ color: theme.text }}>

		{/* ADD BUTTON */}
		<div style={{marginBottom:"15px"}}>
			<button style={btnPrimary} onClick={openAdd}>
				+ Add FAQ
			</button>
		</div>

		{/* TABLE */}
		<div style={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch", background: theme.card, borderRadius: "12px" }}>
			<table
				style={{
					width:"100%",
					minWidth: "720px",
					borderCollapse:"collapse",
					background: theme.card,
					color: theme.text,
				}}
			>

			<thead>
			<tr>
				<th style={{...th,width:"35%"}}>Question</th>
				<th style={{...th,width:"45%"}}>Answer</th>
				<th style={{...th,width:"20%"}}>Action</th>
			</tr>
			</thead>

			<tbody>

			{faqs.length === 0 ? (

				<tr>
					<td colSpan="3" style={{padding:"18px",textAlign:"center"}}>
						No FAQs yet
					</td>
				</tr>

			) : (

				faqs.map((faq,index)=>(

				<tr key={index} style={{
					background: index % 2 === 0
						? (isDark ? "rgba(255,255,255,0.02)" : "#ffffff")
						: (isDark ? "rgba(255,255,255,0.04)" : "#eef3fb")
				}}>

					<td style={{...td,textAlign:"left",background: "transparent", color: theme.text}}>
						{faq.question}
					</td>

					<td style={{...td,textAlign:"left",background: "transparent", color: theme.text}}>
						{faq.answer}
					</td>

					<td style={{...td, background: "transparent", color: theme.text}}>

						<div style={{display:"flex",gap:"8px",justifyContent:"center"}}>

							<button
								style={btnEdit}
								onClick={()=>openEdit(faq,index)}
							>
								Edit
							</button>

							<button
								style={btnDelete}
								onClick={()=>deleteFaq(index)}
							>
								Delete
							</button>

						</div>

					</td>

				</tr>

				))

			)}

			</tbody>

			</table>
		</div>


		{/* MODAL */}

		{showModal && (

			<div style={backdrop}>

				<div style={modalTheme}>

					<h3>{editingIndex === null ? "Add FAQ" : "Edit FAQ"}</h3>

                        <label style={labelTheme}>Question</label>
                        <input
                            style={inputTheme}
                            value={question}
                            onChange={(e)=>setQuestion(e.target.value)}
                        />

						<label style={labelTheme}>Answer</label>
                        <textarea
							style={textareaTheme}
                            value={answer}
                            onChange={(e)=>setAnswer(e.target.value)}
                        />

                        <div style={buttonRow}>
                            <button
                                style={{...btnPrimary,background:"#6c757d"}}
                                onClick={()=>setShowModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                style={btnPrimary}
                                onClick={editingIndex === null ? addFaq : updateFaq}
                            >
                                {editingIndex === null ? "Add" : "Update"}
                            </button>
                        </div>

				</div>

			</div>

		)}

	</div>

	);

}