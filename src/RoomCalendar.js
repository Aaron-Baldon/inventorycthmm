import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

function RoomCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(
      `${API_BASE}/api/room-reservations/events?start=2026-02-01&end=2026-02-28`
    )
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>CTHM Lab Room Calendar</h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        slotLabelFormat={{ hour: "numeric", minute: "2-digit", hour12: true }}
        eventTimeFormat={{ hour: "numeric", minute: "2-digit", hour12: true }}
        events={events}
      />
    </div>
  );
}

export default RoomCalendar;
