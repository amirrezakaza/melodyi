"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowDown, ArrowLeft, Bell, Check, ChevronDown, ChevronLeft, Crown, Disc3, Download, Heart, Headphones, Home, Library, ListMusic, ListOrdered, Menu, Mic2, MoreHorizontal, Music2, Pause, Play, Plus, Repeat2, Search, Settings2, Shuffle, SkipBack, SkipForward, Sparkles, UsersRound, Volume2, VolumeX, WifiOff, X } from "lucide-react";
import { assetPath, artists, formatTime, getSong, songs, toPersianNumber } from "@/lib/music-data";
import { getMessages } from "@/lib/i18n";
import { useMusic } from "@/components/music-provider";
import { Logo } from "@/components/music-ui";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const copy = getMessages();

const primaryNav = [
  { href: "/", label: copy.nav.home, icon: Home },
  { href: "/search", label: copy.nav.search, icon: Search },
  { href: "/discover", label: copy.nav.discover, icon: Sparkles },
  { href: "/artists", label: copy.nav.artists, icon: UsersRound },
  { href: "/genres", label: copy.nav.genres, icon: Disc3 },
  { href: "/playlists", label: copy.nav.playlists, icon: ListMusic },
];
const libraryNav = [
  { href: "/library", label: copy.nav.library, icon: Library },
  { href: "/favorites", label: copy.nav.favorites, icon: Heart },
  { href: "/queue", label: copy.nav.queue, icon: ListOrdered },
];

function NavLink({ href, label, icon: Icon, pathname }: { href: string; label: string; icon: typeof Home; pathname: string }) {
  const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  return <Link href={href} className={`side-link ${active ? "active" : ""}`}><Icon size={18} strokeWidth={active ? 2.25 : 1.8} /><span>{label}</span>{active && <span className="side-active-dot" />}</Link>;
}

function Avatar({ size = "normal" }: { size?: "normal" | "large" | "tiny" }) {
  const { user } = useMusic();
  return <span className={`user-avatar avatar-${size}`}><span>{user ? user.name.trim().charAt(0) : "م"}</span></span>;
}

function Sidebar({ pathname, onInstall }: { pathname: string; onInstall: () => void }) {
  const { user, subscription, setCreatePlaylistOpen } = useMusic();
  return <aside className="sidebar">
    <div className="sidebar-top"><Logo /><span className="sidebar-tagline">موسیقی به سبک تو</span></div>
    <div className="sidebar-scroll">
      <p className="nav-caption">منوی اصلی</p>
      <nav className="side-nav" aria-label="منوی اصلی">{primaryNav.map((item) => <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} pathname={pathname} />)}</nav>
      <div className="nav-caption-row"><p className="nav-caption">کتابخانه</p><button className="side-plus" aria-label="ساخت پلی‌لیست" title="ساخت پلی‌لیست" onClick={() => setCreatePlaylistOpen(true)}><Plus size={17} /></button></div>
      <nav className="side-nav" aria-label="کتابخانه">{libraryNav.map((item) => <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} pathname={pathname} />)}</nav>
      <div className="side-divider" />
      <Link href="/artist/dashboard" className={`side-link ${pathname.startsWith("/artist/dashboard") ? "active" : ""}`}><Mic2 size={18} /><span>{copy.nav.dashboard}</span></Link>
      <Link href="/settings" className={`side-link ${pathname === "/settings" ? "active" : ""}`}><Settings2 size={18} /><span>{copy.nav.settings}</span></Link>
    </div>
    <div className="sidebar-bottom">
      <div className="premium-mini"><div className="premium-mini-glow" /><span className="premium-mini-icon"><Crown size={18} fill="currentColor" /></span><strong>موسیقی بدون مرز</strong><p>با Melody Premium، بیشتر از موسیقی لذت ببر.</p><Link href="/premium">ارتقا به پریمیوم <ArrowLeft size={14} /></Link></div>
      <button className="install-sidebar" onClick={onInstall}><Download size={16} /> نصب اپلیکیشن <ArrowLeft size={14} /></button>
      <Link href={user ? "/profile" : "/auth/login"} className="sidebar-profile"><Avatar /><div><strong>{user?.name ?? "مهمان ملودی"}</strong><span>{subscription} Member</span></div><MoreHorizontal size={18} /></Link>
    </div>
  </aside>;
}

function Topbar() {
  const router = useRouter();
  const { user, searchQuery, setSearchQuery, saveSearch, recentSearches } = useMusic();
  const [focused, setFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [read, setRead] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const update = () => {
      try { setNotificationsEnabled(JSON.parse(localStorage.getItem("melody-settings-v1") || "{}").notifications !== false); } catch { setNotificationsEnabled(true); }
    };
    update();
    window.addEventListener("melody-settings-change", update);
    return () => window.removeEventListener("melody-settings-change", update);
  }, []);
  const query = searchQuery.trim().toLocaleLowerCase();
  const songSuggestions = query ? songs.filter((song) => `${song.title} ${song.artist} ${song.album} ${song.genre}`.toLocaleLowerCase().includes(query)).slice(0, 3) : [];
  const artistSuggestions = query ? artists.filter((artist) => artist.name.toLocaleLowerCase().includes(query)).slice(0, 2) : [];
  const showSuggestions = focused && (!!query || recentSearches.length > 0);
  function submit(event: FormEvent) { event.preventDefault(); if (searchQuery.trim()) saveSearch(searchQuery); setFocused(false); inputRef.current?.blur(); router.push(`/search${searchQuery.trim() ? `?q=${encodeURIComponent(searchQuery.trim())}` : ""}`); }
  return <header className="topbar">
    <div className="topbar-greeting"><span>خوش اومدی به Melody</span><strong>امروز چی گوش می‌دیم؟ <span className="greeting-spark">✦</span></strong></div>
    <div className="topbar-mobile-logo"><Logo compact /></div>
    <div className="global-search-wrap"><form className="global-search" onSubmit={submit}><Search size={18} /><input ref={inputRef} value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => setFocused(false), 180)} placeholder={copy.search.placeholder} aria-label={copy.search.action} /><button type="submit" aria-label={copy.search.action}><span>{copy.search.action}</span><ArrowLeft size={14} /></button></form>
      {showSuggestions && <div className="search-suggestions">
        {query ? <>
          {songSuggestions.map((song) => <button key={song.id} onMouseDown={(event) => event.preventDefault()} onClick={() => { setSearchQuery(song.title); saveSearch(song.title); setFocused(false); router.push(`/search?q=${encodeURIComponent(song.title)}`); }}><img src={song.cover} alt="" /><span><strong>{song.title}</strong><small>آهنگ · {song.artist}</small></span><ArrowLeft size={15} /></button>)}
          {artistSuggestions.map((artist) => <button key={artist.id} onMouseDown={(event) => event.preventDefault()} onClick={() => { setFocused(false); router.push(`/artists/${artist.id}`); }}><img src={artist.image} alt="" /><span><strong>{artist.name}</strong><small>هنرمند</small></span><ArrowLeft size={15} /></button>)}
          {!songSuggestions.length && !artistSuggestions.length && <p className="suggestion-empty">برای «{searchQuery}» اینتر بزن تا همهٔ نتایج را ببینی.</p>}
        </> : <><p className="suggestion-label">جستجوهای اخیر</p>{recentSearches.slice(0, 4).map((item) => <button key={item} onMouseDown={(event) => event.preventDefault()} onClick={() => { setSearchQuery(item); setFocused(false); router.push(`/search?q=${encodeURIComponent(item)}`); }}><Search size={17} /><span><strong>{item}</strong></span><ArrowLeft size={15} /></button>)}</>}
      </div>}
    </div>
    <div className="topbar-actions"><Link href="/search" className="icon-btn mobile-search-action" aria-label="جستجو"><Search size={20} /></Link><div className="notification-wrap"><button className="topbar-icon" type="button" aria-label="اعلان‌ها" onClick={() => setNotificationsOpen((prev) => !prev)}><Bell size={20} />{!read && notificationsEnabled && <span className="notification-dot" />}</button>{notificationsOpen && <><button className="menu-dismiss" onClick={() => setNotificationsOpen(false)} aria-label="بستن اعلان‌ها" /><div className="notifications-popover"><div className="pop-heading"><strong>اعلان‌ها</strong><button onClick={() => { setRead(true); setNotificationsOpen(false); }}>همه خوانده شد <Check size={14} /></button></div><div className="notification-item"><span className="notice-icon purple"><Music2 size={17} /></span><span><strong>موسیقی تازه برای تو</strong><small>آهنگ‌های جدید سلیقه‌ات را کشف کن.</small></span></div><div className="notification-item"><span className="notice-icon pink"><Crown size={17} /></span><span><strong>به Melody خوش اومدی!</strong><small>دنیایی از موسیقی منتظر توست.</small></span></div></div></>}</div><Link href={user ? "/profile" : "/auth/login"} className="header-avatar-link" aria-label="پروفایل"><Avatar /></Link></div>
  </header>;
}

function RangeBar({ className = "" }: { className?: string }) {
  const { elapsed, duration, seek } = useMusic();
  return <input type="range" className={`progress-range ${className}`} min="0" max={duration || 30} step="1" value={Math.min(elapsed, duration || 30)} style={{ "--range-progress": `${Math.min(100, (elapsed / (duration || 30)) * 100)}%` } as CSSProperties} onChange={(event) => seek(Number(event.target.value))} aria-label="موقعیت پخش" />;
}

function PlaybackControls({ large = false }: { large?: boolean }) {
  const { isPlaying, togglePlay, nextTrack, prevTrack, shuffle, toggleShuffle, repeat, cycleRepeat } = useMusic();
  return <div className={`playback-controls ${large ? "playback-controls-large" : ""}`} dir="ltr">
    <button className={`control-btn ${shuffle ? "control-active" : ""}`} title="پخش تصادفی" aria-label="پخش تصادفی" onClick={toggleShuffle}><Shuffle size={large ? 19 : 17} /></button>
    <button className="control-btn skip-btn" title="آهنگ قبلی" aria-label="آهنگ قبلی" onClick={prevTrack}><SkipBack size={large ? 22 : 19} fill="currentColor" /></button>
    <button className="main-play-btn" title={isPlaying ? "توقف" : "پخش"} aria-label={isPlaying ? "توقف" : "پخش"} onClick={togglePlay}>{isPlaying ? <Pause size={large ? 25 : 22} fill="currentColor" /> : <Play size={large ? 25 : 22} fill="currentColor" />}</button>
    <button className="control-btn skip-btn" title="آهنگ بعدی" aria-label="آهنگ بعدی" onClick={() => nextTrack()}><SkipForward size={large ? 22 : 19} fill="currentColor" /></button>
    <button className={`control-btn repeat-btn ${repeat !== "off" ? "control-active" : ""}`} title={repeat === "one" ? "تکرار یک آهنگ" : "تکرار"} aria-label="تکرار" onClick={cycleRepeat}><Repeat2 size={large ? 19 : 17} />{repeat === "one" && <span>1</span>}</button>
  </div>;
}

function DesktopPlayer() {
  const { currentSong, currentSongId, isPlaying, elapsed, duration, favorites, toggleFavorite, volume, muted, setVolume, toggleMute } = useMusic();
  return <div className="desktop-player" role="region" aria-label="پخش‌کنندهٔ موسیقی">
    <div className="player-track" dir="ltr"><img src={currentSong.cover} alt="" /><div dir="rtl"><strong>{currentSong.title}</strong><Link href={`/artists/${currentSong.artistId}`}>{currentSong.artist}</Link></div><button className={`icon-btn player-heart ${favorites.includes(currentSongId) ? "liked" : ""}`} aria-label="علاقه‌مندی" onClick={() => toggleFavorite(currentSongId)}><Heart size={18} fill={favorites.includes(currentSongId) ? "currentColor" : "none"} /></button></div>
    <div className="player-center"><PlaybackControls /><div className="player-progress" dir="ltr"><span>{formatTime(elapsed)}</span><RangeBar /><span>{formatTime(duration)}</span></div></div>
    <div className="player-extras" dir="ltr"><span className="preview-label"><span className={`live-dot ${isPlaying ? "live-dot-active" : ""}`} /> پیش‌نمایش</span><button className="icon-btn" aria-label={muted ? "فعال کردن صدا" : "بی‌صدا کردن"} onClick={toggleMute}>{muted ? <VolumeX size={19} /> : <Volume2 size={19} />}</button><input type="range" className="volume-range" min="0" max="1" step="0.01" value={muted ? 0 : volume} onChange={(event) => setVolume(Number(event.target.value))} style={{ "--range-progress": `${(muted ? 0 : volume) * 100}%` } as CSSProperties} aria-label="بلندی صدا" /><Link href="/queue" className="icon-btn" aria-label="صف پخش" title="صف پخش"><ListOrdered size={20} /></Link></div>
  </div>;
}

function RightRail() {
  const { currentSong, currentSongId, isPlaying, favorites, toggleFavorite, queue, playSong, elapsed, duration } = useMusic();
  const upcoming = queue.filter((id) => id !== currentSongId).slice(0, 4);
  return <aside className="right-rail"><div className="rail-heading"><div><span className="tiny-eyebrow"><span className="live-dot live-dot-active" /> همین حالا</span><h3>در حال پخش</h3></div><Link href="/queue" aria-label="دیدن صف پخش"><MoreHorizontal size={21} /></Link></div>
    <div className="rail-cover"><img src={currentSong.cover} alt={`کاور ${currentSong.title}`} /><span className="rail-cover-glow" /></div>
    <div className="rail-track-line"><div><strong>{currentSong.title}</strong><Link href={`/artists/${currentSong.artistId}`}>{currentSong.artist}</Link></div><button className={`icon-btn ${favorites.includes(currentSongId) ? "liked" : ""}`} onClick={() => toggleFavorite(currentSongId)} aria-label="علاقه‌مندی"><Heart size={21} fill={favorites.includes(currentSongId) ? "currentColor" : "none"} /></button></div>
    <div className="rail-progress"><RangeBar /><div dir="ltr"><span>{formatTime(elapsed)}</span><span>{formatTime(duration)}</span></div></div><PlaybackControls large />
    <div className="rail-divider" /><div className="rail-upnext-heading"><div><span className="tiny-eyebrow">بعد از این آهنگ</span><h3>صف پخش</h3></div><Link href="/queue">نمایش همه <ArrowLeft size={14} /></Link></div>
    <div className="rail-queue">{upcoming.map((id, index) => { const song = getSong(id); if (!song) return null; return <button key={`${id}-${index}`} className="rail-queue-item" onClick={() => playSong(id)}><img src={song.cover} alt="" /><span><strong>{song.title}</strong><small>{song.artist}</small></span><Play size={15} className="rail-item-play" /></button>; })}</div>
    <Link href="/discover" className="rail-discover"><Sparkles size={19} /><span><strong>موسیقی مناسب حالِ تو</strong><small>با هوش مصنوعی پیداش کن</small></span><ChevronLeft size={17} /></Link>
  </aside>;
}

function MobilePlayer() {
  const [expanded, setExpanded] = useState(false);
  const { currentSong, currentSongId, isPlaying, togglePlay, nextTrack, favorites, toggleFavorite, elapsed, duration, queue } = useMusic();
  return <>
    <div className="mobile-mini-player" onClick={() => setExpanded(true)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") setExpanded(true); }} aria-label="بازکردن پخش‌کننده"><img src={currentSong.cover} alt="" /><div><strong>{currentSong.title}</strong><span>{currentSong.artist}</span></div><button onClick={(event) => { event.stopPropagation(); togglePlay(); }} aria-label={isPlaying ? "توقف" : "پخش"}>{isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button><button onClick={(event) => { event.stopPropagation(); nextTrack(); }} aria-label="آهنگ بعدی"><SkipForward size={20} fill="currentColor" /></button><span className="mini-progress" style={{ width: `${Math.min(100, elapsed / (duration || 30) * 100)}%` }} /></div>
    {expanded && <div className="full-player-mobile"><div className="full-player-bg" style={{ backgroundImage: `url(${currentSong.cover})` }} /><div className="full-player-content"><div className="full-player-top"><button onClick={() => setExpanded(false)} aria-label="بستن پخش‌کننده"><ChevronDown size={27} /></button><span>در حال پخش از Melody</span><Link href="/queue" onClick={() => setExpanded(false)} aria-label="صف پخش"><ListOrdered size={22} /></Link></div><div className="full-player-art"><img src={currentSong.cover} alt="" /></div><div className="full-player-title"><div><h2>{currentSong.title}</h2><p>{currentSong.artist}</p></div><button className={favorites.includes(currentSongId) ? "liked" : ""} onClick={() => toggleFavorite(currentSongId)} aria-label="علاقه‌مندی"><Heart size={24} fill={favorites.includes(currentSongId) ? "currentColor" : "none"} /></button></div><div className="full-player-progress"><RangeBar /><div dir="ltr"><span>{formatTime(elapsed)}</span><span>{formatTime(duration)}</span></div></div><PlaybackControls large /><p className="full-player-note">در حال پخش پیش‌نمایش آهنگ</p><div className="full-upnext"><span>بعدی در صف پخش</span><Link href="/queue" onClick={() => setExpanded(false)}>مشاهده صف <ArrowLeft size={15} /></Link></div>{queue.filter((id) => id !== currentSongId).slice(0, 2).map((id, index) => { const song = getSong(id); return song && <div className="full-queue-row" key={`${id}-${index}`}><img src={song.cover} alt="" /><div><strong>{song.title}</strong><span>{song.artist}</span></div></div>; })}</div></div>}
  </>;
}

function MobileNav({ pathname }: { pathname: string }) {
  const nav = [{ href: "/", label: "خانه", icon: Home }, { href: "/search", label: "جستجو", icon: Search }, { href: "/discover", label: "کشف", icon: Sparkles }, { href: "/library", label: "کتابخانه", icon: Library }, { href: "/profile", label: "پروفایل", icon: UsersRound }];
  return <nav className="mobile-nav" aria-label="منوی موبایل">{nav.map(({ href, label, icon: Icon }) => { const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`); return <Link key={href} href={href} className={active ? "active" : ""}><Icon size={21} strokeWidth={active ? 2.4 : 1.9} /><span>{label}</span></Link>; })}</nav>;
}

function GlobalModals() {
  const router = useRouter();
  const { playlists, playlistPickerSongId, closePlaylistPicker, addToPlaylist, createPlaylist, createPlaylistOpen, setCreatePlaylistOpen } = useMusic();
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const [inlineName, setInlineName] = useState("");
  const [showInline, setShowInline] = useState(false);
  const song = playlistPickerSongId ? getSong(playlistPickerSongId) : null;
  return <>
    {playlistPickerSongId && <div className="modal-backdrop" onMouseDown={closePlaylistPicker}><div className="modal-card picker-modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="افزودن به پلی‌لیست"><button className="modal-close" onClick={closePlaylistPicker} aria-label="بستن"><X size={20} /></button><span className="modal-eyebrow"><ListMusic size={16} /> پلی‌لیست‌های من</span><h2>افزودن به پلی‌لیست</h2><p>«{song?.title}» رو کجا ذخیره کنیم؟</p><div className="picker-list">{playlists.map((playlist) => <button key={playlist.id} onClick={() => addToPlaylist(playlist.id, playlistPickerSongId)}><img src={playlist.cover} alt="" /><span><strong>{playlist.name}</strong><small>{toPersianNumber(playlist.songIds.length)} آهنگ</small></span>{playlist.songIds.includes(playlistPickerSongId) ? <Check size={19} className="picker-check" /> : <Plus size={19} />}</button>)}</div>{showInline ? <form className="picker-inline-form" onSubmit={(event) => { event.preventDefault(); if (!inlineName.trim()) return; const id = createPlaylist(inlineName); addToPlaylist(id, playlistPickerSongId); setInlineName(""); setShowInline(false); }}><input autoFocus value={inlineName} onChange={(event) => setInlineName(event.target.value)} placeholder="نام پلی‌لیست جدید" maxLength={40} /><button className="gradient-btn" type="submit">بساز</button></form> : <button className="picker-create" onClick={() => setShowInline(true)}><Plus size={19} /> ساخت پلی‌لیست جدید</button>}</div></div>}
    {createPlaylistOpen && <div className="modal-backdrop" onMouseDown={() => setCreatePlaylistOpen(false)}><div className="modal-card create-modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="ساخت پلی‌لیست"><button className="modal-close" onClick={() => setCreatePlaylistOpen(false)} aria-label="بستن"><X size={20} /></button><span className="modal-eyebrow"><Sparkles size={16} /> سلیقهٔ تو، موسیقی تو</span><h2>پلی‌لیست جدید بساز</h2><p>برای هر حال‌وهوا یه فضای موسیقی اختصاصی بساز.</p><form onSubmit={(event) => { event.preventDefault(); if (!playlistName.trim()) return; const id = createPlaylist(playlistName, description || undefined); setPlaylistName(""); setDescription(""); router.push(`/playlists/${id}`); }}><label>نام پلی‌لیست<input autoFocus value={playlistName} onChange={(event) => setPlaylistName(event.target.value)} placeholder="مثلاً: شب‌های آرام من" maxLength={40} required /></label><label>توضیح کوتاه <span>(اختیاری)</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="این پلی‌لیست برای چه لحظه‌هاییه؟" maxLength={120} rows={3} /></label><button type="submit" className="gradient-btn"><Plus size={17} /> ساخت پلی‌لیست</button></form></div></div>}
  </>;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const normalizedPathname = basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) || "/" : pathname;
  const { toast, notify } = useMusic();
  const installEvent = useRef<InstallEvent | null>(null);
  const [offline, setOffline] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const isAuth = normalizedPathname.startsWith("/auth");

  useEffect(() => {
    const installed = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (!installed) return;
    try { if (sessionStorage.getItem("melody-splash-seen")) return; sessionStorage.setItem("melody-splash-seen", "1"); } catch { /* splash can still display */ }
    setShowSplash(true);
    const timer = window.setTimeout(() => setShowSplash(false), 850);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const basePath = document.body.dataset.basePath || "";
      navigator.serviceWorker.register(`${basePath}/sw.js`, { scope: `${basePath}/` }).catch(() => {});
    }
    const beforeInstall = (event: Event) => { event.preventDefault(); installEvent.current = event as InstallEvent; };
    const updateConnection = () => setOffline(!navigator.onLine);
    const installFromPage = () => { void handleInstall(); };
    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);
    window.addEventListener("melody-install", installFromPage);
    updateConnection();
    return () => { window.removeEventListener("beforeinstallprompt", beforeInstall); window.removeEventListener("online", updateConnection); window.removeEventListener("offline", updateConnection); window.removeEventListener("melody-install", installFromPage); };
    // Install callback reads from a stable ref; listeners are registered once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleInstall() {
    if (installEvent.current) {
      await installEvent.current.prompt();
      const choice = await installEvent.current.userChoice;
      if (choice.outcome === "accepted") notify("Melody به دستگاهت اضافه شد ✨");
      installEvent.current = null;
    } else {
      notify("برای نصب، از منوی مرورگر گزینهٔ «افزودن به صفحه اصلی» را انتخاب کن.");
    }
  }

  return <>
    {isAuth ? <div className="auth-shell">{children}</div> : <div className="app-shell" dir="rtl"><Sidebar pathname={normalizedPathname} onInstall={handleInstall} /><div className="app-main"><Topbar /><div className={`content-layout ${normalizedPathname === "/" ? "has-rail" : ""}`}><main className="page-content">{children}</main>{normalizedPathname === "/" && <RightRail />}</div></div><DesktopPlayer /><MobilePlayer /><MobileNav pathname={normalizedPathname} /><GlobalModals /></div>}
    {offline && <div className="offline-banner"><WifiOff size={16} /> آفلاین هستی؛ بعضی امکانات ممکن است در دسترس نباشند.</div>}
    {toast && <div className="toast-message" role="status"><span><Check size={16} /></span>{toast}</div>}
    {showSplash && <div className="app-splash" aria-label="در حال باز شدن Melody"><img src={assetPath("/icons/icon-192.png")} alt="" /><strong>Melody</strong><span>موسیقی، همیشه همراه تو</span><div className="splash-bars"><i /><i /><i /><i /><i /></div></div>}
  </>;
}
