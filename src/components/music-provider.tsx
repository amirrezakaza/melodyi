"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { assetPath, songs, starterPlaylists, type Playlist, type Song } from "@/lib/music-data";

export type MockUser = { name: string; username: string; email: string; bio: string; followers: number };
export type UploadedTrack = { id: string; title: string; genre: string; cover: string; plays: number; likes: number; date: string; fileName: string };
export type Plan = "Free" | "Premium" | "Artist";
export type RepeatMode = "off" | "all" | "one";

const demoUser: MockUser = { name: "امیر کارا", username: "amir.kara", email: "amir@example.com", bio: "موسیقی، حال خوب هر روز من 🎧", followers: 124 };

export type MusicContextValue = {
  currentSong: Song;
  currentSongId: string;
  isPlaying: boolean;
  elapsed: number;
  duration: number;
  volume: number;
  muted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  queue: string[];
  favorites: string[];
  playlistFavorites: string[];
  playlists: Playlist[];
  recent: string[];
  following: string[];
  recentSearches: string[];
  searchQuery: string;
  user: MockUser | null;
  subscription: Plan;
  uploads: UploadedTrack[];
  toast: string;
  playlistPickerSongId: string | null;
  createPlaylistOpen: boolean;
  playSong: (id: string, contextIds?: string[]) => void;
  playPlaylist: (ids: string[]) => void;
  togglePlay: () => void;
  nextTrack: (fromEnded?: boolean) => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleFavorite: (id: string) => void;
  togglePlaylistFavorite: (id: string) => void;
  addToQueue: (id: string) => void;
  removeFromQueue: (id: string) => void;
  moveQueueItem: (id: string, direction: -1 | 1) => void;
  createPlaylist: (name: string, description?: string) => string;
  renamePlaylist: (id: string, name: string) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, songId: string) => void;
  removeFromPlaylist: (playlistId: string, songId: string) => void;
  toggleFollow: (artistId: string) => void;
  setSearchQuery: (query: string) => void;
  saveSearch: (query: string) => void;
  clearSearches: () => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateUser: (update: Partial<MockUser>) => void;
  changePlan: (plan: Plan) => void;
  addUpload: (track: Omit<UploadedTrack, "id" | "plays" | "likes" | "date">) => void;
  removeUpload: (id: string) => void;
  notify: (message: string) => void;
  openPlaylistPicker: (songId: string) => void;
  closePlaylistPicker: () => void;
  setCreatePlaylistOpen: (open: boolean) => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentSongId, setCurrentSongId] = useState(songs[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(30);
  const [volume, setVolumeState] = useState(0.75);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [queue, setQueue] = useState<string[]>(songs.slice(0, 8).map((song) => song.id));
  const [favorites, setFavorites] = useState<string[]>(["good-days"]);
  const [playlistFavorites, setPlaylistFavorites] = useState<string[]>(["relax-chill"]);
  const [playlists, setPlaylists] = useState<Playlist[]>(starterPlaylists);
  const [recent, setRecent] = useState<string[]>(["good-days", "lofi-dreams", "shab-e-tanhaei"]);
  const [following, setFollowing] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<MockUser | null>(demoUser);
  const [subscription, setSubscription] = useState<Plan>("Premium");
  const [uploads, setUploads] = useState<UploadedTrack[]>([]);
  const [toast, setToast] = useState("");
  const [playlistPickerSongId, setPlaylistPickerSongId] = useState<string | null>(null);
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSong = songs.find((song) => song.id === currentSongId) ?? songs[0];

  useEffect(() => {
    try {
      const raw = localStorage.getItem("melody-state-v1");
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.favorites)) setFavorites(saved.favorites);
        if (Array.isArray(saved.playlistFavorites)) setPlaylistFavorites(saved.playlistFavorites);
        if (Array.isArray(saved.playlists)) setPlaylists(saved.playlists);
        if (Array.isArray(saved.recent)) setRecent(saved.recent);
        if (Array.isArray(saved.following)) setFollowing(saved.following);
        if (Array.isArray(saved.recentSearches)) setRecentSearches(saved.recentSearches);
        if (Array.isArray(saved.uploads)) setUploads(saved.uploads);
        if (saved.user === null) setUser(null);
        else if (saved.user && typeof saved.user.name === "string") setUser({ ...saved.user, followers: Number(saved.user.followers) || 0 });
        if (["Free", "Premium", "Artist"].includes(saved.subscription)) setSubscription(saved.subscription);
        if (typeof saved.volume === "number") setVolumeState(saved.volume);
      }
    } catch (error) {
      console.warn("Could not restore Melody preferences", error);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("melody-state-v1", JSON.stringify({ favorites, playlistFavorites, playlists, recent, following, recentSearches, user, subscription, uploads, volume }));
    } catch (error) {
      console.warn("Could not save Melody preferences", error);
    }
  }, [hydrated, favorites, playlistFavorites, playlists, recent, following, recentSearches, user, subscription, uploads, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSongId]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = useCallback((message: string) => setToast(message), []);
  const markPlayed = useCallback((id: string) => setRecent((prev) => [id, ...prev.filter((item) => item !== id)].slice(0, 12)), []);

  const playSong = useCallback((id: string, contextIds?: string[]) => {
    if (!songs.some((song) => song.id === id)) return;
    if (contextIds?.length) setQueue([...new Set(contextIds.filter((songId) => songs.some((song) => song.id === songId)))]);
    else setQueue((prev) => prev.includes(id) ? prev : [...prev, id]);
    if (id === currentSongId && isPlaying) {
      setIsPlaying(false);
    } else {
      if (id !== currentSongId) { setElapsed(0); setDuration(30); }
      setCurrentSongId(id);
      setIsPlaying(true);
      markPlayed(id);
    }
  }, [currentSongId, isPlaying, markPlayed]);

  const playPlaylist = useCallback((ids: string[]) => {
    const valid = ids.filter((id) => songs.some((song) => song.id === id));
    if (!valid.length) { notify("این پلی‌لیست هنوز آهنگی ندارد."); return; }
    setQueue(valid);
    if (valid[0] === currentSongId && audioRef.current) audioRef.current.currentTime = 0;
    setCurrentSongId(valid[0]);
    setElapsed(0);
    setDuration(30);
    setIsPlaying(true);
    markPlayed(valid[0]);
  }, [currentSongId, markPlayed, notify]);

  const togglePlay = useCallback(() => {
    if (!isPlaying) markPlayed(currentSongId);
    setIsPlaying((playing) => !playing);
  }, [currentSongId, isPlaying, markPlayed]);

  const nextTrack = useCallback((fromEnded = false) => {
    if (fromEnded) {
      try {
        const settings = JSON.parse(localStorage.getItem("melody-settings-v1") || "{}");
        if (settings.autoplay === false) { setIsPlaying(false); if (audioRef.current) audioRef.current.currentTime = 0; setElapsed(0); return; }
      } catch { /* use the default autoplay behavior */ }
    }
    const list = queue.length ? queue : songs.map((song) => song.id);
    const index = list.indexOf(currentSongId);
    if (fromEnded && index === list.length - 1 && repeat === "off" && !shuffle) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.currentTime = 0;
      setElapsed(0);
      return;
    }
    const alternatives = list.filter((id) => id !== currentSongId);
    const nextId = shuffle && alternatives.length
      ? alternatives[Math.floor(Math.random() * alternatives.length)]
      : list[(index + 1 + list.length) % list.length];
    if (nextId === currentSongId && audioRef.current) audioRef.current.currentTime = 0;
    setCurrentSongId(nextId);
    setElapsed(0);
    setDuration(30);
    setIsPlaying(true);
    markPlayed(nextId);
  }, [queue, currentSongId, repeat, shuffle, markPlayed]);

  const prevTrack = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setElapsed(0);
      return;
    }
    const list = queue.length ? queue : songs.map((song) => song.id);
    const index = list.indexOf(currentSongId);
    const prevId = list[(index - 1 + list.length) % list.length];
    setCurrentSongId(prevId);
    setElapsed(0);
    setDuration(30);
    setIsPlaying(true);
    markPlayed(prevId);
  }, [queue, currentSongId, markPlayed]);

  const seek = useCallback((seconds: number) => {
    if (audioRef.current && Number.isFinite(seconds)) {
      audioRef.current.currentTime = Math.max(0, Math.min(seconds, audioRef.current.duration || duration));
      setElapsed(audioRef.current.currentTime);
    }
  }, [duration]);

  const setVolume = useCallback((nextVolume: number) => { setVolumeState(Math.max(0, Math.min(1, nextVolume))); setMuted(false); }, []);
  const toggleMute = useCallback(() => setMuted((prev) => !prev), []);
  const toggleShuffle = useCallback(() => setShuffle((prev) => !prev), []);
  const cycleRepeat = useCallback(() => setRepeat((prev) => prev === "off" ? "all" : prev === "all" ? "one" : "off"), []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  }, []);
  const togglePlaylistFavorite = useCallback((id: string) => {
    setPlaylistFavorites((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  }, []);
  const addToQueue = useCallback((id: string) => {
    setQueue((prev) => [...prev, id]);
    notify("به صف پخش اضافه شد");
  }, [notify]);
  const removeFromQueue = useCallback((id: string) => {
    setQueue((prev) => {
      const index = prev.findIndex((item) => item === id && item !== currentSongId);
      return index < 0 ? prev : prev.filter((_, i) => i !== index);
    });
  }, [currentSongId]);
  const moveQueueItem = useCallback((id: string, direction: -1 | 1) => {
    setQueue((prev) => {
      const index = prev.indexOf(id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }, []);

  const createPlaylist = useCallback((name: string, description = "پلی‌لیست شخصی من") => {
    const id = `my-playlist-${Date.now()}`;
    setPlaylists((prev) => [{ id, name: name.trim(), description, cover: assetPath("/images/cover-lofi.jpg"), songIds: [], likes: 0, owner: user?.name ?? "شما", isCustom: true }, ...prev]);
    setCreatePlaylistOpen(false);
    notify("پلی‌لیست جدید ساخته شد ✨");
    return id;
  }, [user, notify]);
  const renamePlaylist = useCallback((id: string, name: string) => {
    setPlaylists((prev) => prev.map((item) => item.id === id ? { ...item, name: name.trim() } : item));
    notify("نام پلی‌لیست تغییر کرد");
  }, [notify]);
  const deletePlaylist = useCallback((id: string) => {
    setPlaylists((prev) => prev.filter((item) => item.id !== id));
    setPlaylistFavorites((prev) => prev.filter((item) => item !== id));
    notify("پلی‌لیست حذف شد");
  }, [notify]);
  const addToPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists((prev) => prev.map((item) => item.id === playlistId && !item.songIds.includes(songId) ? { ...item, songIds: [...item.songIds, songId] } : item));
    setPlaylistPickerSongId(null);
    notify("آهنگ به پلی‌لیست اضافه شد");
  }, [notify]);
  const removeFromPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists((prev) => prev.map((item) => item.id === playlistId ? { ...item, songIds: item.songIds.filter((id) => id !== songId) } : item));
    notify("آهنگ از پلی‌لیست حذف شد");
  }, [notify]);
  const toggleFollow = useCallback((id: string) => setFollowing((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]), []);
  const saveSearch = useCallback((query: string) => { const clean = query.trim(); if (clean) setRecentSearches((prev) => [clean, ...prev.filter((item) => item !== clean)].slice(0, 6)); }, []);
  const clearSearches = useCallback(() => setRecentSearches([]), []);
  const login = useCallback((email: string, name?: string) => {
    const fallback = email.split("@")[0].replace(/[._-]/g, " ");
    setUser({ name: name?.trim() || fallback || "کاربر ملودی", username: email.split("@")[0], email, bio: "موسیقی، حال خوب هر روز من 🎧", followers: 0 });
    notify("خوش اومدی! از موسیقی لذت ببر 🎧");
  }, [notify]);
  const logout = useCallback(() => { setUser(null); setSubscription("Free"); notify("با موفقیت خارج شدی"); }, [notify]);
  const updateUser = useCallback((update: Partial<MockUser>) => { setUser((prev) => prev ? { ...prev, ...update } : null); notify("پروفایل به‌روزرسانی شد"); }, [notify]);
  const changePlan = useCallback((plan: Plan) => { setSubscription(plan); notify(`پلن ${plan} برای نسخهٔ نمایشی فعال شد`); }, [notify]);
  const addUpload = useCallback((track: Omit<UploadedTrack, "id" | "plays" | "likes" | "date">) => {
    setUploads((prev) => [{ ...track, id: `upload-${Date.now()}`, plays: 0, likes: 0, date: new Intl.DateTimeFormat("fa-IR").format(new Date()) }, ...prev]);
    notify("دموی آهنگ با موفقیت ثبت شد");
  }, [notify]);
  const removeUpload = useCallback((id: string) => { setUploads((prev) => prev.filter((item) => item.id !== id)); notify("آهنگ از داشبورد حذف شد"); }, [notify]);
  const openPlaylistPicker = useCallback((songId: string) => setPlaylistPickerSongId(songId), []);
  const closePlaylistPicker = useCallback(() => setPlaylistPickerSongId(null), []);

  const value: MusicContextValue = {
    currentSong, currentSongId, isPlaying, elapsed, duration, volume, muted, shuffle, repeat, queue, favorites, playlistFavorites, playlists, recent, following, recentSearches, searchQuery, user, subscription, uploads, toast, playlistPickerSongId, createPlaylistOpen,
    playSong, playPlaylist, togglePlay, nextTrack, prevTrack, seek, setVolume, toggleMute, toggleShuffle, cycleRepeat, toggleFavorite, togglePlaylistFavorite, addToQueue, removeFromQueue, moveQueueItem,
    createPlaylist, renamePlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist, toggleFollow, setSearchQuery, saveSearch, clearSearches, login, logout, updateUser, changePlan, addUpload, removeUpload, notify, openPlaylistPicker, closePlaylistPicker, setCreatePlaylistOpen,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={currentSong.audio}
        preload="metadata"
        onTimeUpdate={(event) => { const time = Math.floor(event.currentTarget.currentTime); setElapsed((prev) => prev === time ? prev : time); }}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 30)}
        onEnded={() => { if (repeat === "one" && audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play().catch(() => setIsPlaying(false)); } else nextTrack(true); }}
        onError={() => { setIsPlaying(false); notify("پخش این فایل ممکن نیست. لطفاً آهنگ دیگری انتخاب کن."); }}
      />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used inside MusicProvider");
  return context;
}
