export type Song = {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  cover: string;
  duration: string;
  genre: string;
  album: string;
  plays: string;
  audio: string;
};

export type Artist = {
  id: string;
  name: string;
  image: string;
  banner: string;
  followers: string;
  monthlyListeners: string;
  verified: boolean;
  bio: string;
  genres: string[];
};

export type Genre = {
  id: string;
  name: string;
  en: string;
  image: string;
  color: string;
  description: string;
};

export type Playlist = {
  id: string;
  name: string;
  description: string;
  cover: string;
  songIds: string[];
  likes: number;
  owner: string;
  isCustom?: boolean;
};

export function assetPath(path: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${basePath}${path}`;
}

const previews = [assetPath("/audio/preview-30.mp3"), assetPath("/audio/preview-15.mp3"), assetPath("/audio/preview-12.mp3")];

export const songs: Song[] = [
  { id: "good-days", title: "Good Days", artist: "SZA", artistId: "sza", cover: assetPath("/images/cover-good-days.jpg"), duration: "3:38", genre: "R&B", album: "Good Days", plays: "۲.۴ میلیون", audio: previews[0] },
  { id: "lofi-dreams", title: "Lofi Dreams", artist: "Kiarash", artistId: "kiarash", cover: assetPath("/images/cover-lofi.jpg"), duration: "3:12", genre: "Lo-fi", album: "Midnight Stories", plays: "۸۴۰ هزار", audio: previews[1] },
  { id: "shab-e-tanhaei", title: "شبِ تنهایی", artist: "احسان خواجه‌امیری", artistId: "ehsan", cover: assetPath("/images/cover-blue.jpg"), duration: "3:45", genre: "Pop", album: "لحظه‌های من", plays: "۱.۸ میلیون", audio: previews[2] },
  { id: "bazi", title: "بازی", artist: "تتلو", artistId: "tataloo", cover: assetPath("/images/cover-echoes.jpg"), duration: "4:12", genre: "Hip Hop", album: "بازی", plays: "۹۶۰ هزار", audio: previews[0] },
  { id: "beyond", title: "Beyond", artist: "Imagine Dragons", artistId: "imagine-dragons", cover: assetPath("/images/cover-beyond.jpg"), duration: "3:29", genre: "Rock", album: "Evolve", plays: "۳.۱ میلیون", audio: previews[1] },
  { id: "hamin-lahzeh", title: "همین لحظه", artist: "محسن یگانه", artistId: "mohsen", cover: assetPath("/images/cover-city.jpg"), duration: "4:05", genre: "Pop", album: "نگاه من", plays: "۱.۲ میلیون", audio: previews[2] },
  { id: "daylight", title: "Daylight", artist: "David Kushner", artistId: "david", cover: assetPath("/images/cover-beyond.jpg"), duration: "3:34", genre: "Indie", album: "Daylight", plays: "۴.۲ میلیون", audio: previews[0] },
  { id: "blue-hour", title: "Blue Hour", artist: "Kiarash", artistId: "kiarash", cover: assetPath("/images/cover-blue.jpg"), duration: "2:58", genre: "Electronic", album: "After Dark", plays: "۷۲۰ هزار", audio: previews[1] },
  { id: "midnight-city", title: "Midnight City", artist: "M83", artistId: "m83", cover: assetPath("/images/cover-city.jpg"), duration: "4:03", genre: "Electronic", album: "Hurry Up, We're Dreaming", plays: "۳.۶ میلیون", audio: previews[2] },
  { id: "delam-gerefte", title: "دلم گرفته", artist: "احسان خواجه‌امیری", artistId: "ehsan", cover: assetPath("/images/cover-lofi.jpg"), duration: "4:06", genre: "Pop", album: "لحظه‌های من", plays: "۱.۱ میلیون", audio: previews[0] },
  { id: "pulse", title: "Pulse", artist: "Nova", artistId: "nova", cover: assetPath("/images/cover-party.jpg"), duration: "3:18", genre: "Electronic", album: "Electric Nights", plays: "۶۵۰ هزار", audio: previews[1] },
  { id: "run-wild", title: "Run Wild", artist: "The Motion", artistId: "motion", cover: assetPath("/images/cover-workout.jpg"), duration: "3:26", genre: "Hip Hop", album: "No Limits", plays: "۵۸۰ هزار", audio: previews[2] },
  { id: "moonlight", title: "Moonlight", artist: "SZA", artistId: "sza", cover: assetPath("/images/cover-good-days.jpg"), duration: "3:02", genre: "R&B", album: "Good Days", plays: "۱.۵ میلیون", audio: previews[0] },
  { id: "safar", title: "سفر", artist: "محسن یگانه", artistId: "mohsen", cover: assetPath("/images/cover-city.jpg"), duration: "3:55", genre: "Pop", album: "نگاه من", plays: "۷۸۰ هزار", audio: previews[1] },
];

export const artists: Artist[] = [
  { id: "ehsan", name: "احسان خواجه‌امیری", image: assetPath("/images/artist-ehsan.jpg"), banner: assetPath("/images/artist-ehsan.jpg"), followers: "۲.۴ میلیون", monthlyListeners: "۲.۴ میلیون", verified: true, bio: "احسان خواجه‌امیری، خواننده و آهنگساز ایرانی، با صدایی ماندگار و قطعاتی که برای نسل‌های مختلف خاطره ساخته است. موسیقی او ترکیبی از احساس، روایت و ملودی‌های فراموش‌نشدنی است.", genres: ["پاپ", "سنتی"] },
  { id: "sza", name: "SZA", image: assetPath("/images/cover-good-days.jpg"), banner: assetPath("/images/cover-good-days.jpg"), followers: "۱۲.۸ میلیون", monthlyListeners: "۴۱ میلیون", verified: true, bio: "SZA با صدایی منحصربه‌فرد و ترانه‌هایی صمیمی، یکی از تأثیرگذارترین چهره‌های موسیقی R&B معاصر است.", genres: ["R&B", "Soul"] },
  { id: "kiarash", name: "Kiarash", image: assetPath("/images/cover-lofi.jpg"), banner: assetPath("/images/cover-lofi.jpg"), followers: "۸۶۰ هزار", monthlyListeners: "۱.۲ میلیون", verified: true, bio: "کیارش، سازندهٔ فضاهای آرام و شبانه؛ موسیقی برای لحظه‌هایی که می‌خواهی کمی از شلوغی دنیا فاصله بگیری.", genres: ["Lo-fi", "Electronic"] },
  { id: "mohsen", name: "محسن یگانه", image: assetPath("/images/cover-city.jpg"), banner: assetPath("/images/cover-city.jpg"), followers: "۳.۱ میلیون", monthlyListeners: "۴.۶ میلیون", verified: true, bio: "محسن یگانه با ترانه‌های عاشقانه و ملودی‌های آشنا، سال‌هاست همراه لحظه‌های موسیقایی شنونده‌های فارسی‌زبان است.", genres: ["پاپ"] },
  { id: "imagine-dragons", name: "Imagine Dragons", image: assetPath("/images/cover-beyond.jpg"), banner: assetPath("/images/cover-beyond.jpg"), followers: "۱۸.۲ میلیون", monthlyListeners: "۵۶ میلیون", verified: true, bio: "گروهی که با صدایی پرانرژی، مرزهای راک و پاپ را جابه‌جا می‌کند و اجراهای زندهٔ به‌یادماندنی می‌سازد.", genres: ["Rock", "Alternative"] },
  { id: "tataloo", name: "تتلو", image: assetPath("/images/cover-echoes.jpg"), banner: assetPath("/images/cover-echoes.jpg"), followers: "۱.۹ میلیون", monthlyListeners: "۲.۸ میلیون", verified: false, bio: "هنرمندی با سبک‌های متنوع و آثار پرطرفدار در موسیقی فارسی.", genres: ["Hip Hop", "Pop"] },
  { id: "david", name: "David Kushner", image: assetPath("/images/cover-blue.jpg"), banner: assetPath("/images/cover-blue.jpg"), followers: "۵.۳ میلیون", monthlyListeners: "۱۷ میلیون", verified: true, bio: "ترانه‌هایی عمیق و فضایی سینمایی که در هر گوشهٔ جهان شنونده‌های تازه پیدا می‌کنند.", genres: ["Indie", "Pop"] },
  { id: "m83", name: "M83", image: assetPath("/images/cover-city.jpg"), banner: assetPath("/images/cover-city.jpg"), followers: "۲.۱ میلیون", monthlyListeners: "۸.۴ میلیون", verified: true, bio: "سفر به دنیای موسیقی الکترونیک با صداهایی رؤیایی و سینمایی.", genres: ["Electronic", "Indie"] },
  { id: "nova", name: "Nova", image: assetPath("/images/cover-party.jpg"), banner: assetPath("/images/cover-party.jpg"), followers: "۴۲۰ هزار", monthlyListeners: "۶۸۰ هزار", verified: false, bio: "ریتم‌های تازه برای شب‌هایی که تمام نمی‌شوند.", genres: ["Electronic"] },
  { id: "motion", name: "The Motion", image: assetPath("/images/cover-workout.jpg"), banner: assetPath("/images/cover-workout.jpg"), followers: "۳۱۵ هزار", monthlyListeners: "۵۲۰ هزار", verified: false, bio: "موسیقی برای حرکت، انرژی و عبور از مرزها.", genres: ["Hip Hop", "Electronic"] },
];

export const genres: Genre[] = [
  { id: "pop", name: "پاپ", en: "Pop", image: assetPath("/images/cover-good-days.jpg"), color: "#8a2ce3", description: "ملودی‌هایی که همیشه همراهت می‌مانند" },
  { id: "hip-hop", name: "هیپ‌هاپ", en: "Hip Hop", image: assetPath("/images/cover-echoes.jpg"), color: "#a26136", description: "ریتم‌های جسور و داستان‌های واقعی" },
  { id: "electronic", name: "الکترونیک", en: "Electronic", image: assetPath("/images/cover-party.jpg"), color: "#175bcf", description: "فراتر از مرزهای صدا و ریتم" },
  { id: "rock", name: "راک", en: "Rock", image: assetPath("/images/cover-beyond.jpg"), color: "#5131a5", description: "انرژی بی‌پایان در هر نت" },
  { id: "rnb", name: "آر‌اند‌بی", en: "R&B", image: assetPath("/images/cover-blue.jpg"), color: "#b82c65", description: "احساس، ریتم و صدایی عمیق" },
  { id: "classical", name: "کلاسیک", en: "Classical", image: assetPath("/images/cover-city.jpg"), color: "#7e6b52", description: "زیبایی جاودانهٔ موسیقی" },
  { id: "lofi", name: "لوفای", en: "Lo-fi", image: assetPath("/images/cover-lofi.jpg"), color: "#294f8b", description: "برای آرامش و تمرکز بیشتر" },
  { id: "indie", name: "ایندی", en: "Indie", image: assetPath("/images/cover-workout.jpg"), color: "#315d8d", description: "صداهایی متفاوت برای سلیقه‌های متفاوت" },
];

export const starterPlaylists: Playlist[] = [
  { id: "relax-chill", name: "Relax & Chill", description: "نفس عمیق بکش و به موسیقی بسپار", cover: assetPath("/images/cover-good-days.jpg"), songIds: ["good-days", "lofi-dreams", "daylight", "blue-hour", "moonlight"], likes: 90, owner: "Melody" },
  { id: "workout", name: "Workout Music", description: "انرژی بیشتر برای هر حرکت", cover: assetPath("/images/cover-workout.jpg"), songIds: ["run-wild", "pulse", "bazi", "midnight-city", "beyond"], likes: 75, owner: "Melody" },
  { id: "road-trip", name: "Road Trip", description: "جاده، موسیقی و یک مسیر تازه", cover: assetPath("/images/cover-city.jpg"), songIds: ["safar", "beyond", "hamin-lahzeh", "daylight", "good-days"], likes: 62, owner: "Melody" },
  { id: "focus", name: "Focus", description: "تمرکز عمیق، بدون حواس‌پرتی", cover: assetPath("/images/cover-lofi.jpg"), songIds: ["lofi-dreams", "blue-hour", "daylight", "midnight-city"], likes: 40, owner: "Melody" },
  { id: "love-songs", name: "Love Songs", description: "برای همهٔ حرف‌های نگفته", cover: assetPath("/images/cover-blue.jpg"), songIds: ["shab-e-tanhaei", "delam-gerefte", "hamin-lahzeh", "moonlight"], likes: 120, owner: "Melody" },
  { id: "party-hits", name: "Party Hits", description: "امشب فقط وقت خوش‌گذرانیه", cover: assetPath("/images/cover-party.jpg"), songIds: ["pulse", "midnight-city", "run-wild", "bazi", "good-days"], likes: 80, owner: "Melody" },
  { id: "sad-vibes", name: "Sad Vibes", description: "گاهی فقط باید گوش داد", cover: assetPath("/images/cover-beyond.jpg"), songIds: ["daylight", "shab-e-tanhaei", "delam-gerefte", "lofi-dreams"], likes: 67, owner: "Melody" },
  { id: "persian-classics", name: "Persian Classics", description: "آهنگ‌هایی که همیشه تازه‌اند", cover: assetPath("/images/cover-echoes.jpg"), songIds: ["shab-e-tanhaei", "hamin-lahzeh", "delam-gerefte", "safar"], likes: 54, owner: "Melody" },
];

export const getSong = (id: string) => songs.find((song) => song.id === id);
export const getArtist = (id: string) => artists.find((artist) => artist.id === id);
export const getGenre = (id: string) => genres.find((genre) => genre.id === id);
export const songById = (id: string) => getSong(id) ?? songs[0];

export function toPersianNumber(value: number | string) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}
