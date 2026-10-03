"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Heart, ListMusic, MoreHorizontal, Music2, Play, Plus, Share2, Trash2 } from "lucide-react";
import { type Artist, type Genre, type Playlist, type Song, toPersianNumber } from "@/lib/music-data";
import { useMusic } from "@/components/music-provider";

export function Logo({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className={`brand ${compact ? "brand-compact" : ""}`} aria-label="Melody - خانه">
    <span className="soundmark" aria-hidden="true"><i /><i /><i /><i /><i /></span>
    <span className="brand-word">Melody<span className="brand-dot">.</span></span>
  </Link>;
}

export function SectionHeading({ title, subtitle, href, action = "مشاهده همه", children }: { title: string; subtitle?: string; href?: string; action?: string; children?: ReactNode }) {
  return <div className="section-heading">
    <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
    <div className="section-heading-actions">{children}{href && <Link className="view-all" href={href}>{action}<ArrowLeft size={15} /></Link>}</div>
  </div>;
}

function TrackMenu({ song, playlistId }: { song: Song; playlistId?: string }) {
  const [open, setOpen] = useState(false);
  const { addToQueue, openPlaylistPicker, removeFromPlaylist, notify } = useMusic();
  return <div className="more-wrap">
    <button className="icon-btn subtle-btn" type="button" aria-label={`گزینه‌های ${song.title}`} aria-expanded={open} onClick={(event) => { event.stopPropagation(); setOpen((value) => !value); }}><MoreHorizontal size={19} /></button>
    {open && <><button className="menu-dismiss" aria-label="بستن منو" onClick={() => setOpen(false)} /><div className="track-menu" dir="rtl">
      <button onClick={() => { openPlaylistPicker(song.id); setOpen(false); }}><Plus size={16} /> افزودن به پلی‌لیست</button>
      <button onClick={() => { addToQueue(song.id); setOpen(false); }}><ListMusic size={16} /> افزودن به صف</button>
      <button onClick={async () => { try { await navigator.clipboard.writeText(`${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ""}/search/?q=${encodeURIComponent(song.title)}`); notify("لینک آهنگ کپی شد"); } catch { notify("امکان کپی لینک وجود ندارد"); } setOpen(false); }}><Share2 size={16} /> اشتراک‌گذاری</button>
      {playlistId && <button className="menu-danger" onClick={() => { removeFromPlaylist(playlistId, song.id); setOpen(false); }}><Trash2 size={16} /> حذف از پلی‌لیست</button>}
    </div></>}
  </div>;
}

export function SongCard({ song, contextIds }: { song: Song; contextIds?: string[] }) {
  const { playSong, currentSongId, isPlaying, favorites, toggleFavorite, openPlaylistPicker } = useMusic();
  const liked = favorites.includes(song.id);
  return <article className="song-card">
    <div className="song-art-wrap">
      <img src={song.cover} alt={`کاور ${song.title}`} className="song-art" loading="lazy" />
      <div className="art-shade" />
      <span className="art-duration">{song.duration}</span>
      <button className={`art-heart ${liked ? "liked" : ""}`} type="button" aria-label={liked ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"} onClick={() => toggleFavorite(song.id)}><Heart size={17} fill={liked ? "currentColor" : "none"} /></button>
      <button className="card-play" type="button" aria-label={`پخش ${song.title}`} onClick={() => playSong(song.id, contextIds)}><Play size={19} fill="currentColor" className={currentSongId === song.id && isPlaying ? "playing-icon" : ""} /></button>
    </div>
    <div className="song-card-info"><button className="song-title" onClick={() => playSong(song.id, contextIds)}>{song.title}</button><Link href={`/artists/${song.artistId}`} className="song-artist">{song.artist}</Link></div>
    <div className="card-actions"><button type="button" aria-label="افزودن به پلی‌لیست" onClick={() => openPlaylistPicker(song.id)}><Plus size={16} /></button><TrackMenu song={song} /></div>
  </article>;
}

export function SongRow({ song, index, contextIds, playlistId, compact = false }: { song: Song; index?: number; contextIds?: string[]; playlistId?: string; compact?: boolean }) {
  const { playSong, currentSongId, isPlaying, favorites, toggleFavorite } = useMusic();
  const active = song.id === currentSongId && isPlaying;
  const liked = favorites.includes(song.id);
  return <div className={`song-row ${active ? "row-active" : ""} ${compact ? "song-row-compact" : ""}`}>
    {index !== undefined && <span className="row-index">{active ? <span className="equalizer-mini"><i /><i /><i /></span> : toPersianNumber(index + 1)}</span>}
    <button className="row-cover" type="button" onClick={() => playSong(song.id, contextIds)} aria-label={`پخش ${song.title}`}><img src={song.cover} alt="" loading="lazy" /><span className="row-cover-play"><Play size={16} fill="currentColor" /></span></button>
    <div className="row-main"><button className="row-title" onClick={() => playSong(song.id, contextIds)}>{song.title}</button><Link href={`/artists/${song.artistId}`}>{song.artist}</Link></div>
    {!compact && <span className="row-album">{song.album}</span>}
    <span className="row-time" dir="ltr">{song.duration}</span>
    <button className={`icon-btn row-like ${liked ? "liked" : ""}`} type="button" onClick={() => toggleFavorite(song.id)} aria-label={liked ? "حذف از علاقه‌مندی‌ها" : "علاقه‌مندی"}><Heart size={17} fill={liked ? "currentColor" : "none"} /></button>
    <TrackMenu song={song} playlistId={playlistId} />
  </div>;
}

export function PlaylistCard({ playlist, small = false }: { playlist: Playlist; small?: boolean }) {
  const { playPlaylist, playlistFavorites, togglePlaylistFavorite } = useMusic();
  const liked = playlistFavorites.includes(playlist.id);
  return <article className={`playlist-card ${small ? "playlist-card-small" : ""}`}>
    <div className="playlist-art-wrap"><Link href={`/playlists/${playlist.id}`} aria-label={`دیدن پلی‌لیست ${playlist.name}`}><img src={playlist.cover} alt="" loading="lazy" /></Link><div className="playlist-art-tint" />
      <button className="playlist-card-play" aria-label={`پخش ${playlist.name}`} onClick={() => playPlaylist(playlist.songIds)}><Play size={19} fill="currentColor" /></button>
      <button className={`playlist-heart ${liked ? "liked" : ""}`} aria-label={liked ? "حذف از علاقه‌مندی‌ها" : "علاقه‌مندی"} onClick={() => togglePlaylistFavorite(playlist.id)}><Heart size={17} fill={liked ? "currentColor" : "none"} /></button>
    </div>
    <Link className="playlist-name" href={`/playlists/${playlist.id}`}>{playlist.name}</Link>
    <p>{toPersianNumber(playlist.songIds.length)} آهنگ <span className="dot-sep">·</span> {playlist.owner}</p>
  </article>;
}

export function GenreCard({ genre, small = false }: { genre: Genre; small?: boolean }) {
  return <Link href={`/genres/${genre.id}`} className={`genre-card ${small ? "genre-card-small" : ""}`} style={{ backgroundColor: genre.color }}>
    <img src={genre.image} alt="" loading="lazy" />
    <span className="genre-overlay" />
    <span className="genre-name">{genre.name}</span>
    {!small && <span className="genre-en">{genre.en}</span>}
  </Link>;
}

export function ArtistCard({ artist }: { artist: Artist }) {
  return <Link href={`/artists/${artist.id}`} className="artist-card"><div className="artist-avatar"><img src={artist.image} alt="" loading="lazy" /><span className="artist-play"><Play size={17} fill="currentColor" /></span></div><strong>{artist.name}</strong><span>هنرمند</span></Link>;
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description: string; action?: ReactNode }) {
  return <div className="empty-state"><div className="empty-icon">{icon ?? <Music2 size={28} />}</div><h3>{title}</h3><p>{description}</p>{action}</div>;
}

export function VerifiedBadge() {
  return <span className="verified-badge" title="هنرمند تأییدشده"><Check size={12} strokeWidth={3.5} /></span>;
}
