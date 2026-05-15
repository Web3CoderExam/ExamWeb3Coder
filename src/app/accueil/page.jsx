"use client";

import { useSearchParams } from "next/navigation";
import data from "@/data/mockData.json";
import EventsList from "@/components/EventsList/EventsList";
import SearchBanner from "@/components/SearchBanner/SearchBanner";

export default function AccueilPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  // Filtrer les événements si une recherche est effectuée
  const filteredEvents = searchQuery
      ? data.events.filter(event =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : data.events;

  return (
      <>
        <SearchBanner />
        <EventsList events={filteredEvents} />
      </>
  );
}