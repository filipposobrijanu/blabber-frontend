// imageUploadTranslations.ts

// Define the type for Image Upload translation keys
export type ImageUploadTranslationKeys = {
  currentImage: string;
  uploadChannelImage: string;
  uploading: string;
  uploadFormats: string;
  selectImageFile: string;
  imageMustBeLessThan5MB: string;
  uploadFailed: string;
  uploadFailedMessage: string;
  tryAgain: string;
};

// Define the type for language codes
export type ImageUploadLanguageCode =
  | "us"
  | "gr"
  | "ru"
  | "md"
  | "es"
  | "fr"
  | "de";

// Define the translations object with proper typing
export const imageUploadTranslations: Record<
  ImageUploadLanguageCode,
  ImageUploadTranslationKeys
> = {
  us: {
    currentImage: "Current image",
    uploadChannelImage: "Upload Channel Image",
    uploading: "Uploading...",
    uploadFormats: "JPG, PNG, GIF up to 5MB (will be auto-compressed)",
    selectImageFile: "Please select an image file",
    imageMustBeLessThan5MB: "Image must be less than 5MB",
    uploadFailed: "Upload failed",
    uploadFailedMessage: "Upload failed. Please try again.",
    tryAgain: "Try Again",
  },
  gr: {
    currentImage: "Τρέχουσα εικόνα",
    uploadChannelImage: "Ανέβασμα εικόνας καναλιού",
    uploading: "Ανέβασμα...",
    uploadFormats: "JPG, PNG, GIF έως 5MB (θα συμπιεστεί αυτόματα)",
    selectImageFile: "Παρακαλώ επιλέξτε ένα αρχείο εικόνας",
    imageMustBeLessThan5MB: "Η εικόνα πρέπει να είναι μικρότερη από 5MB",
    uploadFailed: "Το ανέβασμα απέτυχε",
    uploadFailedMessage: "Το ανέβασμα απέτυχε. Παρακαλώ δοκιμάστε ξανά.",
    tryAgain: "Δοκιμάστε ξανά",
  },
  ru: {
    currentImage: "Текущее изображение",
    uploadChannelImage: "Загрузить изображение канала",
    uploading: "Загрузка...",
    uploadFormats: "JPG, PNG, GIF до 5MB (будет автоматически сжато)",
    selectImageFile: "Пожалуйста, выберите файл изображения",
    imageMustBeLessThan5MB: "Изображение должно быть меньше 5MB",
    uploadFailed: "Загрузка не удалась",
    uploadFailedMessage: "Загрузка не удалась. Пожалуйста, попробуйте еще раз.",
    tryAgain: "Попробуйте еще раз",
  },
  md: {
    currentImage: "Imagine curentă",
    uploadChannelImage: "Încarcă imagine canal",
    uploading: "Se încarcă...",
    uploadFormats: "JPG, PNG, GIF până la 5MB (va fi comprimat automat)",
    selectImageFile: "Vă rugăm selectați un fișier imagine",
    imageMustBeLessThan5MB: "Imaginea trebuie să fie mai mică de 5MB",
    uploadFailed: "Încărcarea a eșuat",
    uploadFailedMessage: "Încărcarea a eșuat. Vă rugăm să încercați din nou.",
    tryAgain: "Încearcă din nou",
  },
  es: {
    currentImage: "Imagen actual",
    uploadChannelImage: "Subir imagen del canal",
    uploading: "Subiendo...",
    uploadFormats: "JPG, PNG, GIF hasta 5MB (se comprimirá automáticamente)",
    selectImageFile: "Por favor selecciona un archivo de imagen",
    imageMustBeLessThan5MB: "La imagen debe ser menor a 5MB",
    uploadFailed: "Error al subir",
    uploadFailedMessage: "Error al subir. Por favor intenta de nuevo.",
    tryAgain: "Intentar de nuevo",
  },
  fr: {
    currentImage: "Image actuelle",
    uploadChannelImage: "Télécharger l'image du canal",
    uploading: "Téléchargement...",
    uploadFormats: "JPG, PNG, GIF jusqu'à 5MB (sera automatiquement compressé)",
    selectImageFile: "Veuillez sélectionner un fichier image",
    imageMustBeLessThan5MB: "L'image doit être inférieure à 5MB",
    uploadFailed: "Échec du téléchargement",
    uploadFailedMessage: "Échec du téléchargement. Veuillez réessayer.",
    tryAgain: "Réessayer",
  },
  de: {
    currentImage: "Aktuelles Bild",
    uploadChannelImage: "Kanalbild hochladen",
    uploading: "Wird hochgeladen...",
    uploadFormats: "JPG, PNG, GIF bis zu 5MB (wird automatisch komprimiert)",
    selectImageFile: "Bitte wählen Sie eine Bilddatei aus",
    imageMustBeLessThan5MB: "Bild muss kleiner als 5MB sein",
    uploadFailed: "Upload fehlgeschlagen",
    uploadFailedMessage:
      "Upload fehlgeschlagen. Bitte versuchen Sie es erneut.",
    tryAgain: "Erneut versuchen",
  },
};
