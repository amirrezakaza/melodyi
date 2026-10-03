import { Suspense } from "react";
import { PageRouter } from "@/components/page-router";

const params = [
  ...["ehsan","sza","kiarash","mohsen","imagine-dragons","tataloo","david","m83","nova","motion"].map((id) => ({ section: "artists", id })),
  ...["pop","hip-hop","electronic","rock","rnb","classical","lofi","indie"].map((id) => ({ section: "genres", id })),
  ...["relax-chill","workout","road-trip","focus","love-songs","party-hits","sad-vibes","persian-classics"].map((id) => ({ section: "playlists", id })),
  { section: "artist", id: "dashboard" },
  { section: "auth", id: "login" },
  { section: "auth", id: "register" },
  { section: "auth", id: "forgot-password" },
];

export function generateStaticParams() {
  return params;
}

export default function DetailPage() {
  return <Suspense fallback={<div className="page-skeleton"><div /><div /><div /></div>}><PageRouter /></Suspense>;
}
