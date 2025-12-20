// allListTranslations.ts

// Define the type for All List translation keys
export type AllListTranslationKeys = {
  allFriends: string;
  online: string;
  offline: string;
  noUsersFound: string;
  failedToLoadUsers: string;
  retry: string;
  message: string; // Added Message translation
};

// Define the type for language codes
export type AllListLanguageCode =
  | "us"
  | "gr"
  | "ru"
  | "md"
  | "es"
  | "fr"
  | "de";

// Define the translations object with proper typing
export const allListTranslations: Record<
  AllListLanguageCode,
  AllListTranslationKeys
> = {
  us: {
    allFriends: "All Friends",
    online: "Online",
    offline: "Offline",
    noUsersFound: "No users found.",
    failedToLoadUsers: "Failed to load users",
    retry: "Retry",
    message: "Message",
  },
  gr: {
    allFriends: "Όλοι οι Φίλοι",
    online: "Σε σύνδεση",
    offline: "Εκτός σύνδεσης",
    noUsersFound: "Δεν βρέθηκαν χρήστες.",
    failedToLoadUsers: "Αποτυχία φόρτωσης χρηστών",
    retry: "Επανάληψη",
    message: "Μήνυμα",
  },
  ru: {
    allFriends: "Все друзья",
    online: "Онлайн",
    offline: "Оффлайн",
    noUsersFound: "Пользователи не найдены.",
    failedToLoadUsers: "Ошибка загрузки пользователей",
    retry: "Повторить",
    message: "Сообщение",
  },
  md: {
    allFriends: "Toți prietenii",
    online: "Online",
    offline: "Offline",
    noUsersFound: "Niciun utilizator găsit.",
    failedToLoadUsers: "Eroare la încărcarea utilizatorilor",
    retry: "Încearcă din nou",
    message: "Mesaj",
  },
  es: {
    allFriends: "Todos los Amigos",
    online: "En línea",
    offline: "Desconectado",
    noUsersFound: "No se encontraron usuarios.",
    failedToLoadUsers: "Error al cargar usuarios",
    retry: "Reintentar",
    message: "Mensaje",
  },
  fr: {
    allFriends: "Tous les Amis",
    online: "En ligne",
    offline: "Hors ligne",
    noUsersFound: "Aucun utilisateur trouvé.",
    failedToLoadUsers: "Échec du chargement des utilisateurs",
    retry: "Réessayer",
    message: "Message",
  },
  de: {
    allFriends: "Alle Freunde",
    online: "Online",
    offline: "Offline",
    noUsersFound: "Keine Benutzer gefunden.",
    failedToLoadUsers: "Fehler beim Laden der Benutzer",
    retry: "Erneut versuchen",
    message: "Nachricht",
  },
};
