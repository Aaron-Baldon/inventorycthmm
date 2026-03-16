import React, { useState, useRef } from "react";

export default function ChatbotWidget() {

	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState([
		{ from: "bot", text: "Hi! I’m your requisition assistant. How can I help?" }
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);

	const [position, setPosition] = useState({ x: window.innerWidth - 90, y: window.innerHeight - 90 });

	const dragging = useRef(false);

	const sendMessage = async () => {

		if (!input.trim()) return;

		setMessages(prev => [...prev, { from: "user", text: input }]);
		setLoading(true);

		try {

			const response = await fetch("http://localhost:5000/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: input })
			});

			const data = await response.json();

			setMessages(prev => [
				...prev,
				{ from: "bot", text: data.reply }
			]);

		} catch {

			setMessages(prev => [
				...prev,
				{ from: "bot", text: "Server not available." }
			]);

		}

		setLoading(false);
		setInput("");
	};

	const handleMouseDown = () => {
		dragging.current = true;
	};

	const handleMouseMove = (e) => {
		if (!dragging.current) return;

		setPosition({
			x: e.clientX - 30,
			y: e.clientY - 30
		});
	};

	const handleMouseUp = () => {

		dragging.current = false;

		if (position.x < window.innerWidth / 2) {
			setPosition(p => ({ ...p, x: 10 }));
		} else {
			setPosition(p => ({ ...p, x: window.innerWidth - 70 }));
		}
	};

	return (
		<div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>

			{/* Floating Bubble */}

			<div
				onClick={() => setOpen(!open)}
				onMouseDown={handleMouseDown}
				style={{
					position: "fixed",
					left: position.x,
					top: position.y,
					width: "64px",
					height: "64px",
					borderRadius: "50%",

					background: "linear-gradient(135deg, rgba(99,102,241,0.9), rgba(59,130,246,0.9))",

					backdropFilter: "blur(25px)",
					WebkitBackdropFilter: "blur(25px)",

					border: "1px solid rgba(255,255,255,0.25)",

					boxShadow:
						"0 10px 35px rgba(0,0,0,0.4), 0 0 25px rgba(59,130,246,0.7)",

					display: "flex",
					alignItems: "center",
					justifyContent: "center",

					cursor: "grab",
					zIndex: 9999
				}}
			>

				{/* Centered AI Icon */}

				<svg width="28" height="28" viewBox="0 0 24 24" fill="white">
					<path d="M12 2a3 3 0 013 3v1h1a3 3 0 013 3v3a3 3 0 01-3 3h-1v1a3 3 0 01-3 3 3 3 0 01-3-3v-1H8a3 3 0 01-3-3V9a3 3 0 013-3h1V5a3 3 0 013-3z"/>
				</svg>

			</div>

			{/* Chat Window */}

			{open && (

				<div style={{

					position: "fixed",
					right: "20px",
					bottom: "100px",
					width: "360px",
					height: "480px",

					background: "rgba(255,255,255,0.06)",

					backdropFilter: "blur(40px)",
					WebkitBackdropFilter: "blur(40px)",

					borderRadius: "26px",

					border: "1px solid rgba(255,255,255,0.18)",

					boxShadow:
						"0 25px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)",

					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
					zIndex: 9999

				}}>

					{/* Header */}

					<div style={{

						display: "flex",
						alignItems: "center",
						gap: "10px",

						padding: "16px",

						borderBottom: "1px solid rgba(255,255,255,0.1)",

						background: "rgba(255,255,255,0.05)",

						backdropFilter: "blur(20px)"

					}}>

						{/* Back Button */}

						<button
							onClick={() => setOpen(false)}
							style={{
								background: "rgba(255,255,255,0.08)",
								border: "1px solid rgba(255,255,255,0.15)",
								borderRadius: "10px",
								width: "34px",
								height: "34px",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							}}
						>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="white">
								<path d="M15 18l-6-6 6-6"/>
							</svg>
						</button>

						<div style={{
							fontWeight: 600,
							fontSize: "15px"
						}}>
							AI Assistant
						</div>

					</div>

					{/* Messages */}

					<div style={{
						flex: 1,
						padding: "16px",
						overflowY: "auto"
					}}>

						{messages.map((m, i) => (

							<div
								key={i}
								style={{
									textAlign: m.from === "user" ? "right" : "left",
									marginBottom: "12px"
								}}
							>

								<span style={{

									display: "inline-block",
									padding: "10px 16px",

									borderRadius: "18px",

									background:
										m.from === "user"
											? "linear-gradient(135deg,#6366f1,#3b82f6)"
											: "rgba(255,255,255,0.12)",

									backdropFilter: "blur(10px)",

									color: "white",
									fontSize: "14px",
									maxWidth: "75%"

								}}>
									{m.text}
								</span>

							</div>

						))}

						{loading && (
							<div style={{ opacity: 0.6 }}>
								Typing...
							</div>
						)}

					</div>

					{/* Input */}

					<div style={{

						display: "flex",
						padding: "12px",

						borderTop: "1px solid rgba(255,255,255,0.1)",

						background: "rgba(255,255,255,0.04)"

					}}>

						<input
							value={input}
							onChange={e => setInput(e.target.value)}
							onKeyDown={e => e.key === "Enter" && sendMessage()}
							placeholder="Ask something..."
							style={{

								flex: 1,

								padding: "10px 14px",

								borderRadius: "14px",

								border: "1px solid rgba(255,255,255,0.18)",

								background: "rgba(255,255,255,0.08)",

								backdropFilter: "blur(10px)",

								color: "white",

								outline: "none"

							}}
						/>

						<button
							onClick={sendMessage}
							style={{

								marginLeft: "8px",
								width: "44px",

								borderRadius: "12px",

								border: "1px solid rgba(255,255,255,0.2)",

								background:
									"linear-gradient(135deg,#6366f1,#3b82f6)",

								cursor: "pointer"

							}}
						>

							<svg width="18" height="18" viewBox="0 0 24 24" fill="white">
								<path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
							</svg>

						</button>

					</div>

				</div>

			)}

		</div>
	);
}