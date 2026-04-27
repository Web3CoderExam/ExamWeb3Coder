import PlanningPage from "@/components/Planning/PlanningPage";

const data = {
  events: [
    {
      id: 1,
      title: "Conférence AgriTech Madagascar",
      sessions: [
        { id: 101, time: "09:00", title: "Intro", speaker: "Ben" },
        { id: 102, time: "11:00", title: "Drones", speaker: "Aina" }
      ]
    }
  ]
};

export default function Page() {
  return <PlanningPage events={data.events} />;
}