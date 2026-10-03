"use client";

import { usePathname } from "next/navigation";
import { SearchPage, ArtistsPage, ArtistDetailPage, GenresPage, GenreDetailPage, PlaylistsPage, PlaylistDetailPage, LibraryPage, FavoritesPage, QueuePage } from "@/components/catalog-pages";
import { AuthPage, DashboardPage, DiscoverPage, NotFoundPage, PremiumPage, ProfilePage, SettingsPage } from "@/components/feature-pages";

export function PageRouter() {
  const pathname = usePathname();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const normalizedPath = basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) || "/" : pathname;
  const parts = normalizedPath.split("/").filter(Boolean);
  if (normalizedPath === "/search") return <SearchPage />;
  if (normalizedPath === "/artists") return <ArtistsPage />;
  if (parts[0] === "artists" && parts.length === 2) return <ArtistDetailPage id={parts[1]} />;
  if (normalizedPath === "/genres") return <GenresPage />;
  if (parts[0] === "genres" && parts.length === 2) return <GenreDetailPage id={parts[1]} />;
  if (normalizedPath === "/playlists") return <PlaylistsPage />;
  if (parts[0] === "playlists" && parts.length === 2) return <PlaylistDetailPage id={parts[1]} />;
  if (normalizedPath === "/discover") return <DiscoverPage />;
  if (normalizedPath === "/library") return <LibraryPage />;
  if (normalizedPath === "/favorites") return <FavoritesPage />;
  if (normalizedPath === "/queue") return <QueuePage />;
  if (normalizedPath === "/profile") return <ProfilePage />;
  if (normalizedPath === "/settings") return <SettingsPage />;
  if (normalizedPath === "/premium") return <PremiumPage />;
  if (normalizedPath === "/artist/dashboard") return <DashboardPage />;
  if (normalizedPath === "/auth/login") return <AuthPage mode="login" />;
  if (normalizedPath === "/auth/register") return <AuthPage mode="register" />;
  if (normalizedPath === "/auth/forgot-password") return <AuthPage mode="forgot-password" />;
  return <NotFoundPage />;
}
