// privacyTranslations.ts

// Define the type for Privacy Policy translation keys
export type OAuthCallbackTranslationsKeys = {
  loading: string;
  connecting: string;
};

// Define the type for language codes
export type OAuthCallbackTranslationsCode =
  | "us"
  | "gr"
  | "ru"
  | "md"
  | "es"
  | "fr"
  | "de";

// Define the translations object with proper typing
export const OAuthCallbackTranslations: Record<
  OAuthCallbackTranslationsCode,
  OAuthCallbackTranslationsKeys
> = {
  us: {
    loading: "Loading...",
    connecting: "Connecting with Google...",
  },
  gr: {
    loading: "Φόρτωση...",
    connecting: "Σύνδεση με Google...",
  },
  ru: {
    loading: "Загрузка...",
    connecting: "Подключение к Google...",
  },
  md: {
    loading: "Se încarcă...",
    connecting: "Conectare cu Google...",
  },
  es: {
    loading: "Cargando...",
    connecting: "Conectando con Google...",
  },
  fr: {
    loading: "Chargement...",
    connecting: "Connexion avec Google...",
  },
  de: {
    loading: "Lädt...",
    connecting: "Verbinde mit Google...",
  },
};
