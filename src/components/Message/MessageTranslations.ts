// messageTranslations.ts

// Define the type for Message translation keys
export type MessageTranslationKeys = {
  sent: string;
  seenByAll: string;
  seenBy: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  editMessage: string;
  currentImage: string;
  unknownUser: string;
  // Add month translations
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;
  // Add suffix translations
  st: string;
  nd: string;
  rd: string;
  th: string;
};

// Define the type for language codes
export type MessageLanguageCode =
  | "us"
  | "gr"
  | "ru"
  | "md"
  | "es"
  | "fr"
  | "de";

// Define the translations object with proper typing
export const messageTranslations: Record<
  MessageLanguageCode,
  MessageTranslationKeys
> = {
  us: {
    sent: "Sent",
    seenByAll: "Seen by all",
    seenBy: "Seen by",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    editMessage: "Edit message...",
    currentImage: "Current image",
    unknownUser: "Unknown User",
    // English months
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",
    // English suffixes
    st: "st",
    nd: "nd",
    rd: "rd",
    th: "th",
  },
  gr: {
    sent: "Στάλθηκε",
    seenByAll: "Διαβάστηκε από όλους",
    seenBy: "Διαβάστηκε από",
    edit: "Επεξεργασία",
    delete: "Διαγραφή",
    save: "Αποθηκευση",
    cancel: "Ακυρωση",
    editMessage: "Επεξεργασία μηνύματος...",
    currentImage: "Τρέχουσα εικόνα",
    unknownUser: "Άγνωστος χρήστης",
    // Greek months
    january: "Ιανουαρίου",
    february: "Φεβρουαρίου",
    march: "Μαρτίου",
    april: "Απριλίου",
    may: "Μαΐου",
    june: "Ιουνίου",
    july: "Ιουλίου",
    august: "Αυγούστου",
    september: "Σεπτεμβρίου",
    october: "Οκτωβρίου",
    november: "Νοεμβρίου",
    december: "Δεκεμβρίου",
    // Greek suffixes (ordinal indicators)
    st: "",
    nd: "",
    rd: "",
    th: "",
  },
  ru: {
    sent: "Отправлено",
    seenByAll: "Просмотрено всеми",
    seenBy: "Просмотрено",
    edit: "Редактировать",
    delete: "Удалить",
    save: "Сохранить",
    cancel: "Отмена",
    editMessage: "Редактировать сообщение...",
    currentImage: "Текущее изображение",
    unknownUser: "Неизвестный пользователь",
    // Russian months
    january: "Января",
    february: "Февраля",
    march: "Марта",
    april: "Апреля",
    may: "Мая",
    june: "Июня",
    july: "Июля",
    august: "Августа",
    september: "Сентября",
    october: "Октября",
    november: "Ноября",
    december: "Декабря",
    // Russian suffixes (ordinal indicators)
    st: "",
    nd: "",
    rd: "",
    th: "",
  },
  md: {
    sent: "Trimis",
    seenByAll: "Văzut de toți",
    seenBy: "Văzut de",
    edit: "Editează",
    delete: "Șterge",
    save: "Salvează",
    cancel: "Anulează",
    editMessage: "Editează mesajul...",
    currentImage: "Imagine curentă",
    unknownUser: "Utilizator necunoscut",
    // Romanian months
    january: "Ianuarie",
    february: "Februarie",
    march: "Martie",
    april: "Aprilie",
    may: "Mai",
    june: "Iunie",
    july: "Iulie",
    august: "August",
    september: "Septembrie",
    october: "Octombrie",
    november: "Noiembrie",
    december: "Decembrie",
    // Romanian suffixes (ordinal indicators)
    st: "",
    nd: "",
    rd: "",
    th: "",
  },
  es: {
    sent: "Enviado",
    seenByAll: "Visto por todos",
    seenBy: "Visto por",
    edit: "Editar",
    delete: "Eliminar",
    save: "Guardar",
    cancel: "Cancelar",
    editMessage: "Editar mensaje...",
    currentImage: "Imagen actual",
    unknownUser: "Usuario desconocido",
    // Spanish months
    january: "Enero",
    february: "Febrero",
    march: "Marzo",
    april: "Abril",
    may: "Mayo",
    june: "Junio",
    july: "Julio",
    august: "Agosto",
    september: "Septiembre",
    october: "Octubre",
    november: "Noviembre",
    december: "Diciembre",
    // Spanish suffixes (ordinal indicators - not commonly used in dates)
    st: "",
    nd: "",
    rd: "",
    th: "",
  },
  fr: {
    sent: "Envoyé",
    seenByAll: "Vu par tous",
    seenBy: "Vu par",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Sauvegarder",
    cancel: "Annuler",
    editMessage: "Modifier le message...",
    currentImage: "Image actuelle",
    unknownUser: "Utilisateur inconnu",
    // French months
    january: "Janvier",
    february: "Février",
    march: "Mars",
    april: "Avril",
    may: "Mai",
    june: "Juin",
    july: "Juillet",
    august: "Août",
    september: "Septembre",
    october: "Octobre",
    november: "Novembre",
    december: "Décembre",
    // French suffixes (ordinal indicators - not commonly used in dates)
    st: "",
    nd: "",
    rd: "",
    th: "",
  },
  de: {
    sent: "Gesendet",
    seenByAll: "Von allen gesehen",
    seenBy: "Gesehen von",
    edit: "Bearbeiten",
    delete: "Löschen",
    save: "Speichern",
    cancel: "Abbrechen",
    editMessage: "Nachricht bearbeiten...",
    currentImage: "Aktuelles Bild",
    unknownUser: "Unbekannter Benutzer",
    // German months
    january: "Januar",
    february: "Februar",
    march: "März",
    april: "April",
    may: "Mai",
    june: "Juni",
    july: "Juli",
    august: "August",
    september: "September",
    october: "Oktober",
    november: "November",
    december: "Dezember",
    // German suffixes (ordinal indicators - not commonly used in dates)
    st: "",
    nd: "",
    rd: "",
    th: "",
  },
};
