// audioVideoSettingsTranslations.ts

export type AudioVideoSettingsTranslationKeys = {
  audioVideoSettings: string;
  microphone: string;
  testMicrophone: string;
  stopTest: string;
  speakIntoMicrophone: string;
  outputDevice: string;
  speakersHeadphones: string;
  camera: string;
  testCamera: string;
  stopPreview: string;
  devicePreferences: string;
  devicePreferencesSaved: string;
  noDevicesFound: string;
  permissionDenied: string;
  selectDevice: string;
  device: string;
};

export type AudioVideoLanguageCode =
  | "us"
  | "gr"
  | "ru"
  | "md"
  | "es"
  | "fr"
  | "de";

export const AudioVideoSettingsTranslations: Record<
  AudioVideoLanguageCode,
  AudioVideoSettingsTranslationKeys
> = {
  us: {
    audioVideoSettings: "Audio & Video Settings",
    microphone: "Microphone",
    testMicrophone: "Test Microphone",
    stopTest: "Stop Test",
    speakIntoMicrophone: "Speak into your microphone to test",
    outputDevice: "Output Device (Speakers/Headphones)",
    speakersHeadphones: "Speakers/Headphones",
    camera: "Camera",
    testCamera: "Test Camera",
    stopPreview: "Stop Preview",
    devicePreferences:
      "Your device preferences are saved locally and will be used for all future calls.",
    devicePreferencesSaved: "Device preferences saved",
    noDevicesFound: "No devices found",
    permissionDenied: "Permission denied",
    selectDevice: "Select device",
    device: "Device",
  },
  gr: {
    audioVideoSettings: "Ρυθμίσεις Ήχου & Βίντεο",
    microphone: "Μικρόφωνο",
    testMicrophone: "Δοκιμη Μικροφωνου",
    stopTest: "Διακοπη Δοκιμης",
    speakIntoMicrophone: "Μιλήστε στο μικρόφωνό σας για δοκιμή",
    outputDevice: "Συσκευή Εξόδου (Ηχεία/Ακουστικά)",
    speakersHeadphones: "Ηχεία/Ακουστικά",
    camera: "Κάμερα",
    testCamera: "Δοκιμη Καμερας",
    stopPreview: "Διακοπη Προεπισκοπησης",
    devicePreferences:
      "Οι προτιμήσεις συσκευής σας αποθηκεύονται τοπικά και θα χρησιμοποιηθούν σε όλες τις μελλοντικές κλήσεις.",
    devicePreferencesSaved: "Οι προτιμήσεις συσκευής αποθηκεύθηκαν",
    noDevicesFound: "Δεν βρέθηκαν συσκευές",
    permissionDenied: "Η άδεια απορρίφθηκε",
    selectDevice: "Επιλογή συσκευής",
    device: "Συσκευή",
  },
  ru: {
    audioVideoSettings: "Настройки Аудио и Видео",
    microphone: "Микрофон",
    testMicrophone: "Тест Микрофона",
    stopTest: "Остановить тест",
    speakIntoMicrophone: "Говорите в микрофон для проверки",
    outputDevice: "Устройство Вывода (Динамики/Наушники)",
    speakersHeadphones: "Динамики/Наушники",
    camera: "Камера",
    testCamera: "Тест Камеры",
    stopPreview: "Остановить предпросмотр",
    devicePreferences:
      "Ваши предпочтения устройств сохраняются локально и будут использованы для всех будущих звонков.",
    devicePreferencesSaved: "Предпочтения устройств сохранены",
    noDevicesFound: "Устройства не найдены",
    permissionDenied: "Доступ запрещен",
    selectDevice: "Выберите устройство",
    device: "Устройство",
  },
  md: {
    audioVideoSettings: "Setări Audio și Video",
    microphone: "Microfon",
    testMicrophone: "Testare Microfon",
    stopTest: "Oprire Test",
    speakIntoMicrophone: "Vorbești în microfonul tău pentru a testa",
    outputDevice: "Dispozitiv de Ieșire (Difuzoare/Căști)",
    speakersHeadphones: "Difuzoare/Căști",
    camera: "Cameră",
    testCamera: "Testare Cameră",
    stopPreview: "Oprire Previzualizare",
    devicePreferences:
      "Preferințele dvs. de dispozitiv sunt salvate local și vor fi utilizate pentru toate apelurile viitoare.",
    devicePreferencesSaved: "Preferințele dispozitivului au fost salvate",
    noDevicesFound: "Niciun dispozitiv găsit",
    permissionDenied: "Permisiune refuzată",
    selectDevice: "Selectați dispozitiv",
    device: "Dispozitiv",
  },
  es: {
    audioVideoSettings: "Configuración de Audio y Video",
    microphone: "Micrófono",
    testMicrophone: "Prueba de Micrófono",
    stopTest: "Detener Prueba",
    speakIntoMicrophone: "Habla en tu micrófono para probar",
    outputDevice: "Dispositivo de Salida (Altavoces/Auriculares)",
    speakersHeadphones: "Altavoces/Auriculares",
    camera: "Cámara",
    testCamera: "Prueba de Cámara",
    stopPreview: "Detener Vista Previa",
    devicePreferences:
      "Tus preferencias de dispositivo se guardan localmente y se utilizarán para todas las llamadas futuras.",
    devicePreferencesSaved: "Preferencias de dispositivo guardadas",
    noDevicesFound: "No se encontraron dispositivos",
    permissionDenied: "Permiso denegado",
    selectDevice: "Seleccionar dispositivo",
    device: "Dispositivo",
  },
  fr: {
    audioVideoSettings: "Paramètres Audio et Vidéo",
    microphone: "Microphone",
    testMicrophone: "Tester le Microphone",
    stopTest: "Arrêter le Test",
    speakIntoMicrophone: "Parlez dans votre microphone pour tester",
    outputDevice: "Appareil de Sortie (Haut-parleurs/Écouteurs)",
    speakersHeadphones: "Haut-parleurs/Écouteurs",
    camera: "Caméra",
    testCamera: "Tester la Caméra",
    stopPreview: "Arrêter l'Aperçu",
    devicePreferences:
      "Vos préférences d'appareil sont enregistrées localement et seront utilisées pour tous les appels futurs.",
    devicePreferencesSaved: "Préférences d'appareil enregistrées",
    noDevicesFound: "Aucun appareil trouvé",
    permissionDenied: "Permission refusée",
    selectDevice: "Sélectionner l'appareil",
    device: "Appareil",
  },
  de: {
    audioVideoSettings: "Audio- und Videoeinstellungen",
    microphone: "Mikrofon",
    testMicrophone: "Mikrofon Testen",
    stopTest: "Test Beenden",
    speakIntoMicrophone: "Sprechen Sie ins Mikrofon, um es zu testen",
    outputDevice: "Ausgabegerät (Lautsprecher/Kopfhörer)",
    speakersHeadphones: "Lautsprecher/Kopfhörer",
    camera: "Kamera",
    testCamera: "Kamera Testen",
    stopPreview: "Vorschau Beenden",
    devicePreferences:
      "Ihre Geräteeinstellungen werden lokal gespeichert und für alle zukünftigen Anrufe verwendet.",
    devicePreferencesSaved: "Geräteeinstellungen gespeichert",
    noDevicesFound: "Keine Geräte gefunden",
    permissionDenied: "Berechtigung verweigert",
    selectDevice: "Gerät auswählen",
    device: "Gerät",
  },
};
