import data from "@/data/mockData.json";
import PlanningPage from "@/components/Planning/PlanningPage";

export default function Page() {
  return (
    <PlanningPage
      events={data.events}
      defaultFavorites={data.favorites}
    />
  );
}
