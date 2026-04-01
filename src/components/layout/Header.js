import { useTheme } from "../../context/ThemeContext";

export default function Header({ onMenuClick, showThemeToggle = false }) {
	const { themeName, toggleTheme } = useTheme();
	return (
		<div
			style={{
				height: "56px",
				background: "#0d47a1",
				color: "white",
				display: "flex",
				alignItems: "center",
				padding: "0 16px",
				boxSizing: "border-box",
				justifyContent: "space-between",
			}}
		>
			<div style={{ display: "flex", alignItems: "center" }}>
				<button
					onClick={onMenuClick}
					style={{
						fontSize: "22px",
						background: "transparent",
						border: "none",
						color: "white",
						cursor: "pointer",
						marginRight: "12px"
					}}
				>
					☰
				</button>

				<b>CTHM Inventory System</b>
			</div>

			{showThemeToggle && (
				<button
					onClick={toggleTheme}
					style={{
						border: "1px solid rgba(255,255,255,0.35)",
						background: "rgba(255,255,255,0.12)",
						color: "white",
						borderRadius: "10px",
						padding: "7px 10px",
						cursor: "pointer",
						fontSize: "13px",
						fontWeight: 600,
					}}
				>
					Theme: {themeName === "dark" ? "Dark" : "Light"}
				</button>
			)}
		</div>
	);
}
