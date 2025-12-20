// privacyTranslations.ts

// Define the type for Privacy Policy translation keys
export type GifPickerTranslationsKeys = {
  loading: string;
  connecting: string;
  chooseGif: string; // ADD THIS
  searchGifs: string; // ADD THIS
  noGifsFound: string; // ADD THIS
};

// Define the type for language codes
export type GifPickerTranslationsCode =
  | "us"
  | "gr"
  | "ru"
  | "md"
  | "es"
  | "fr"
  | "de";

// Define the translations object with proper typing
export const GifPickerTranslations: Record<
  GifPickerTranslationsCode,
  GifPickerTranslationsKeys
> = {
  us: {
    loading: "Loading...",
    connecting: "Connecting with Google...",
    chooseGif: "Choose a GIF", // ADD THIS
    searchGifs: "Search GIFs...", // ADD THIS
    noGifsFound: "No GIFs found", // ADD THIS
  },
  gr: {
    loading: "Φόρτωση...",
    connecting: "Σύνδεση με Google...",
    chooseGif: "Επιλέξτε ένα GIF", // ADD THIS
    searchGifs: "Αναζήτηση GIF...", // ADD THIS
    noGifsFound: "Δεν βρέθηκαν GIF", // ADD THIS
  },
  ru: {
    loading: "Загрузка...",
    connecting: "Подключение к Google...",
    chooseGif: "Выберите GIF", // ADD THIS
    searchGifs: "Поиск GIF...", // ADD THIS
    noGifsFound: "GIF не найдены", // ADD THIS
  },
  md: {
    loading: "Se încarcă...",
    connecting: "Conectare cu Google...",
    chooseGif: "Alegeți un GIF", // ADD THIS
    searchGifs: "Căutați GIF-uri...", // ADD THIS
    noGifsFound: "Nu s-au găsit GIF-uri", // ADD THIS
  },
  es: {
    loading: "Cargando...",
    connecting: "Conectando con Google...",
    chooseGif: "Elige un GIF",
    searchGifs: "Buscar GIFs...",
    noGifsFound: "No se encontraron GIFs",
  },
  fr: {
    loading: "Chargement...",
    connecting: "Connexion avec Google...",
    chooseGif: "Choisir un GIF",
    searchGifs: "Rechercher des GIFs...",
    noGifsFound: "Aucun GIF trouvé",
  },
  de: {
    loading: "Lädt...",
    connecting: "Verbinde mit Google...",
    chooseGif: "Wähle ein GIF",
    searchGifs: "GIFs suchen...",
    noGifsFound: "Keine GIFs gefunden",
  },
};
