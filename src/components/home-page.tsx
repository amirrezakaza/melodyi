"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, Headphones, Play, Radio, Sparkles, TrendingUp } from "lucide-react";
import { assetPath, artists, genres, getSong, songs, toPersianNumber } from "@/lib/music-data";
import { getMessages } from "@/lib/i18n";
import { useMusic } from "@/components/music-provider";
import { ArtistCard, GenreCard, PlaylistCard, SectionHeading, SongCard, SongRow } from "@/components/music-ui";

const copy = getMessages();

export function HomePage() {
  const { playPlaylist, playlists, recent, user } = useMusic();
  const fresh = songs.slice(0, 6);
  const trending = [songs[0], songs[2], songs[4], songs[6], songs[3]];
  const recentSongs = recent.map(getSong).filter((song): song is NonNullable<typeof song> => !!song).slice(0, 4);
  return <div className="home-page page-enter">
    <section className="home-hero"><img className="hero-image" src={assetPath("/images/hero-melody.jpg")} alt="غروب کوهستان و شنوندهٔ موسیقی" /><div className="hero-vignette" /><div className="hero-content"><span className="hero-eyebrow"><span className="hero-eyebrow-icon"><Radio size={15} /></span> {copy.hero.eyebrow} <span className="eyebrow-line" /></span><h1>{copy.hero.titleOne}<br /><em>{copy.hero.titleTwo}</em></h1><p>{copy.hero.descriptionOne}<br className="hero-break" /> {copy.hero.descriptionTwo}</p><div className="hero-buttons"><Link href="/discover" className="hero-primary"><Sparkles size={18} /> {copy.hero.start} <ArrowLeft size={17} /></Link><button className="hero-secondary" onClick={() => playPlaylist(playlists[0]?.songIds ?? [])}><span><Play size={15} fill="currentColor" /></span> {copy.hero.play}</button></div></div><div className="hero-bottom-tag"><span className="hero-tag-dot" /> YOUR SOUND. YOUR SPACE.</div></section>

    <div className="home-intro-line"><div><span className="welcome-kicker">برای تو، {user?.name?.split(" ")[0] ?? "دوست موسیقی‌دوست"} ✨</span><h2>امروز چی گوش می‌دی؟</h2></div><span className="intro-date">پیشنهادهای تازه، هر روز</span></div>

    <section className="home-section"><SectionHeading title="تازه منتشر شده" subtitle="جدیدترین صداهایی که نباید از دست بدی" href="/search?filter=songs" /><div className="song-grid">{fresh.map((song) => <SongCard key={song.id} song={song} contextIds={fresh.map((item) => item.id)} />)}</div></section>

    <section className="home-two-column"><div className="trending-panel"><SectionHeading title="داغ‌ترین‌ها" subtitle="آهنگ‌هایی که این روزها همه گوش می‌دن" href="/search?filter=songs" /><div className="trending-list">{trending.map((song, index) => <SongRow key={song.id} song={song} index={index} contextIds={trending.map((item) => item.id)} compact />)}</div></div><Link href="/discover" className="discovery-card"><div className="discovery-card-orb"><Sparkles size={35} /></div><span className="discovery-kicker">MELODY AI <span>✦</span></span><h3>هر حسی داری،<br />یه آهنگ براش هست.</h3><p>فقط بگو الان چه حال‌وهوایی داری؛ بقیه‌ش با ما.</p><span className="discovery-link">کشف موسیقی <ArrowUpLeft size={17} /></span><div className="discovery-card-stars">✧ &nbsp; ✦ &nbsp; ✧</div></Link></section>

    <section className="home-section"><SectionHeading title="ژانرهای محبوب" subtitle="دنیای موسیقی رو به سلیقهٔ خودت کشف کن" href="/genres" /><div className="genre-grid-home">{genres.slice(0, 6).map((genre) => <GenreCard key={genre.id} genre={genre} small />)}</div></section>

    <section className="home-section"><SectionHeading title="برای تو چیده شده" subtitle="پلی‌لیست‌هایی برای هر لحظه و هر حال‌وهوا" href="/playlists" /><div className="playlist-grid-home">{playlists.slice(0, 4).map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)}</div></section>

    <section className="home-section"><SectionHeading title="هنرمندان محبوب" subtitle="صداهایی که دوست داری بیشتر بشنوی" href="/artists" /><div className="artists-grid-home">{artists.slice(0, 5).map((artist) => <ArtistCard key={artist.id} artist={artist} />)}</div></section>

    {recentSongs.length > 0 && <section className="home-section home-recent"><SectionHeading title="اخیراً گوش دادی" subtitle="از همون‌جایی که بودی ادامه بده" href="/library" /><div className="recent-grid">{recentSongs.map((song) => <button key={song.id} className="recent-card" onClick={() => playPlaylist([song.id, ...recentSongs.filter((item) => item.id !== song.id).map((item) => item.id)])}><img src={song.cover} alt="" /><span><strong>{song.title}</strong><small>{song.artist}</small></span><span className="recent-play"><Play size={17} fill="currentColor" /></span></button>)}</div></section>}
    <div className="home-footer"><div><span className="footer-wave"><i /><i /><i /><i /><i /></span><strong>Melody</strong><small>بذار موسیقی همراه لحظه‌هات باشه.</small></div><span>ساخته شده برای عاشقان موسیقی <Headphones size={15} /></span></div>
  </div>;
}
