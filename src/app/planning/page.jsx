import data from "@/data/mockData.json";
import PlanningPage from "@/components/Planning/PlanningPage";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const selectedEventId = params?.event;

  return (
    <PlanningPage
      events={data.events}
      selectedEventId={selectedEventId}
      defaultFavorites={data.favorites}
    />
  );
}
