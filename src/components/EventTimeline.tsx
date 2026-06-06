import { Event } from "@/types";

const eventIcon: Record<Event["type"], string> = {
  휴가: "🏖️",
  출장: "✈️",
  미팅: "📅",
  성과: "🏆",
  기타: "📌",
};

const eventColor: Record<Event["type"], string> = {
  휴가: "text-blue-500",
  출장: "text-orange-500",
  미팅: "text-purple-500",
  성과: "text-yellow-500",
  기타: "text-gray-400",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function EventTimeline({ events }: { events: Event[] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">이벤트 로그</h3>
      <ul className="space-y-3">
        {sorted.map((event) => (
          <li key={event.id} className="flex items-start gap-3">
            <span className={`text-xl shrink-0 ${eventColor[event.type]}`}>
              {eventIcon[event.type]}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{event.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(event.date)}</p>
            </div>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full shrink-0">
              {event.type}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
