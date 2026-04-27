import EventCard from "@/components/EventCard/EventCard";

const events = [
  {
    id: 1,
    title: "Concert",
    date: "2026-04-28",
    time: "10:00",
    location: "Antananarivo",
  },
  {
    id: 2,
    title: "Conférence Tech",
    date: "2026-04-29",
    time: "14:00",
    location: "Ivandry",
  },
  {
    id: 3,
    title: "Meetup Dev",
    date: "2026-04-30",
    time: "16:00",
    location: "Ankorondrano",
  },
];

export default function EventsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Événements</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            session={{
              ...event,
              room: event.location,
              speakers: [],
            }}
          />
        ))}
      </div>
    </div>
  );
}