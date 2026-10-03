import { Suspense } from "react";
import { PageRouter } from "@/components/page-router";

const sections = [
  "search", "artists", "genres", "playlists", "discover", "library", "favorites",
  "queue", "profile", "settings", "premium"
];

export function generateStaticParams() {
  return sections.map((section) => ({ section }));
}

export default function SectionPage() {
  return <Suspense fallback={<div className="page-skeleton"><div /><div /><div /></div>}><PageRouter /></Suspense>;
}
