export const defaultLocale = "fa" as const;

export const messages = {
  fa: {
    nav: {
      home: "خانه", search: "جستجو", discover: "کشف با هوش مصنوعی", artists: "هنرمندان", genres: "ژانرها", playlists: "پلی‌لیست‌ها", library: "کتابخانه من", favorites: "علاقه‌مندی‌ها", queue: "صف پخش", dashboard: "پنل هنرمندان", settings: "تنظیمات",
    },
    hero: {
      eyebrow: "دنیای موسیقی، همین‌جا شروع می‌شه", titleOne: "موسیقی، همیشه", titleTwo: "همراه تو", descriptionOne: "آهنگ مناسب حال امروزت رو پیدا کن.", descriptionTwo: "هر لحظه، یک حس تازه با Melody.", start: "شروع کنید", play: "پخش آهنگ‌ها",
    },
    search: { placeholder: "آهنگ، هنرمند یا پلی‌لیست مورد علاقت رو پیدا کن...", action: "جستجو" },
    discover: { headline: "AI Music Discovery", description: "بگو الان چه حسی داری تا موسیقی مناسب تو رو پیدا کنیم.", placeholder: "مثلاً: یه موزیک آروم برای شب می‌خوام...", action: "پیدا کن" },
  },
  en: {
    nav: {
      home: "Home", search: "Search", discover: "AI Discovery", artists: "Artists", genres: "Genres", playlists: "Playlists", library: "Your Library", favorites: "Favorites", queue: "Queue", dashboard: "Artist Studio", settings: "Settings",
    },
    hero: {
      eyebrow: "Your music journey begins here", titleOne: "Music, always", titleTwo: "with you", descriptionOne: "Find the music for your mood today.", descriptionTwo: "Every moment, a new feeling with Melody.", start: "Get started", play: "Play music",
    },
    search: { placeholder: "Find a song, artist, or playlist you love...", action: "Search" },
    discover: { headline: "AI Music Discovery", description: "Tell us how you feel and we'll find the right music for you.", placeholder: "For example: I want something calm for tonight...", action: "Discover" },
  },
} as const;

export type Locale = keyof typeof messages;
export function getMessages(locale: Locale = defaultLocale) { return messages[locale]; }
