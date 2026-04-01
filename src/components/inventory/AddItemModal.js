import { useEffect, useState } from "react";
import "./AddItemModal.css";
import { useTheme } from "../../context/ThemeContext";

const EMPTY_FORM = {
	item_code: "",
	item_name: "",
	category: "",
	quantity: 0
};

export default function AddItemModal({ onSave, onClose, item }) {
	const [form, setForm] = useState(EMPTY_FORM);
	const { theme, themeName } = useTheme();
	const isDark = themeName === "dark";

	const ui = {
		modal: {
			background: theme.card,
			color: theme.text,
			border: `1px solid ${theme.border}`,
		},
		header: {
			borderBottom: `1px solid ${theme.border}`,
		},
		title: {
			color: theme.text,
		},
		closeBtn: {
			color: theme.text,
			opacity: 0.8,
		},
		footer: {
			borderTop: `1px solid ${theme.border}`,
		},
		label: {
			color: theme.text,
			opacity: 0.8,
		},
		input: {
			background: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
			color: theme.text,
			border: `1px solid ${theme.border}`,
		},
		cancelBtn: {
			background: isDark ? "rgba(255,255,255,0.06)" : "#f1f3f4",
			color: theme.text,
			border: `1px solid ${theme.border}`,
		},
	};

	/* 🔹 LOAD DATA WHEN EDITING / RESET WHEN CREATING */
	useEffect(() => {
		if (item) {
			setForm({
				item_code: item.item_code ?? "",
				item_name: item.item_name ?? "",
				category: item.category ?? "",
				quantity: item.quantity ?? 0
			});
		} else {
			setForm(EMPTY_FORM); // ✅ RESET FORM ON CREATE
		}
	}, [item]);

	const handleChange = (e) => {
		const { name, value, type } = e.target;

		setForm(prev => ({
			...prev,
			[name]:
				type === "number"
					? value === "" ? 0 : Number(value)
					: value
		}));
	};

	const handleSave = () => {
		onSave(form);
	};

	return (
		<div className="modal-backdrop">
			<div className="modal" style={ui.modal}>
				<div className="modal-header" style={ui.header}>
					<h3 style={ui.title}>{item ? "Update Inventory Item" : "Add Inventory Item"}</h3>
					<button onClick={onClose} style={ui.closeBtn}>✕</button>
				</div>

				<div className="modal-body">
					<Input ui={ui} label="Item Code" name="item_code" value={form.item_code} onChange={handleChange} />
					<Input ui={ui} label="Item Name" name="item_name" value={form.item_name} onChange={handleChange} />
					<Input ui={ui} label="Category" name="category" value={form.category} onChange={handleChange} />
					<Input ui={ui} label="Quantity" type="number" name="quantity" value={form.quantity} onChange={handleChange} />
				</div>

				<div className="modal-footer" style={ui.footer}>
					<button className="btn cancel" onClick={onClose} style={ui.cancelBtn}>Cancel</button>
					<button className="btn save" onClick={handleSave}>Save</button>
				</div>
			</div>
		</div>
	);
}

function Input({ ui, label, type = "text", name, value, onChange }) {
	return (
		<div className="field">
			<label style={ui?.label}>{label}</label>
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				style={ui?.input}
			/>
		</div>
	);
}
