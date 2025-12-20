// LandingPageTranslations.ts

// Define the type for Landing Page translation keys
export type LandingPageTranslationKeys = {
  heroTitle: string;
  heroSubtitle: string;
  downloadWindows: string;
  openInBrowser: string;
  openInBrowserSmall: string;
  loginButton: string;
  copyright: string;
  skipToApp: string;
  windowsDownload: string;
  androidDownload: string;
  iosDownload: string;
  browserAccess: string;
  startChatting: string;
  noDownloadTitle: string;
  noDownloadMessage: string;
  close: string;
  activeUsers: string;
  messagesSent: string;
  uptime: string;
};

// Define the type for language codes
export type LandingPageLanguageCode =
  | "us"
  | "gr"
  | "ru"
  | "md"
  | "es"
  | "fr"
  | "de";

// Define the translations object with proper typing
export const LandingPageTranslations: Record<
  LandingPageLanguageCode,
  LandingPageTranslationKeys
> = {
  us: {
    activeUsers: "Active Users",
    messagesSent: "Messages Sent",
    uptime: "Uptime",
    heroTitle: "Where conversations happen.",
    heroSubtitle:
      "Blabber is perfect for hanging out with friends or even building a global community. Customize your own space to talk and socialize.",
    downloadWindows: "Download for Windows",
    openInBrowser: "Open Blabber in your browser",
    openInBrowserSmall: "Open in Browser",
    loginButton: "LOGIN",
    copyright: "All rights reserved.",
    skipToApp: "Skip to App",
    windowsDownload: "Download for Windows",
    androidDownload: "Download for Android",
    iosDownload: "Download for iOS",
    browserAccess: "Open in Browser",
    startChatting: "Start Chatting",
    noDownloadTitle: "No Download Yet",
    noDownloadMessage:
      "We're still working on the app, so we can't download it yet.",
    close: "CLOSE",
  },
  gr: {
    activeUsers: "Ενεργοί Χρήστες",
    messagesSent: "Μηνύματα Στάλθηκαν",
    uptime: "Διαθεσιμότητα",
    heroTitle: "Όπου συμβαίνουν οι συνομιλίες.",
    heroSubtitle:
      "Το Blabber είναι τέλειο για να αράξεις με φίλους ή ακόμα και για να χτίξεις μια παγκόσμια κοινότητα. Προσάρμοσε τον δικό σου χώρο για να μιλήσεις και να κάνεις παρέα.",
    downloadWindows: "Λήψη για Windows",
    openInBrowser: "Άνοιξε το Blabber από τον περιηγητή ιστού σας",
    openInBrowserSmall: "Ανοιγμα στον Περιηγητή",
    loginButton: "ΣΥΝΔΕΣΗ",
    copyright: "Όλα τα δικαιώματα διατηρούνται.",
    skipToApp: "Παράβλεψη στην Εφαρμογή",
    windowsDownload: "Λήψη για Windows",
    androidDownload: "Λήψη για Android",
    iosDownload: "Λήψη για iOS",
    browserAccess: "Άνοιγμα στον Περιηγητή",
    startChatting: "Έναρξη Συνομιλίας",
    noDownloadTitle: "Δεν Υπάρχει Λήψη Ακόμα",
    noDownloadMessage:
      "Ακόμα εργαζόμαστε στην εφαρμογή, οπότε δεν μπορούμε να την κατεβάσουμε ακόμα.",
    close: "ΚΛΕΙΣΙΜΟ",
  },
  ru: {
    activeUsers: "Активные пользователи",
    messagesSent: "Сообщений отправлено",
    uptime: "Доступность",
    heroTitle: "Там, где происходят разговоры.",
    heroSubtitle:
      "Blabber идеально подходит для общения с друзьями или даже для создания глобального сообщества. Настройте своё пространство для общения и социализации.",
    downloadWindows: "Скачать для Windows",
    openInBrowser: "Открыть Blabber в вашем браузере",
    openInBrowserSmall: "Открыть в браузере",
    loginButton: "ВХОД",
    copyright: "Все права защищены.",
    skipToApp: "Перейти к приложению",
    windowsDownload: "Скачать для Windows",
    androidDownload: "Скачать для Android",
    iosDownload: "Скачать для iOS",
    browserAccess: "Открыть в браузере",
    startChatting: "Начать общение",
    noDownloadTitle: "Загрузка пока недоступна",
    noDownloadMessage:
      "Мы все еще работаем над приложением, поэтому его пока нельзя скачать.",
    close: "ЗАКРЫТЬ",
  },
  md: {
    activeUsers: "Utilizatori Activi",
    messagesSent: "Mesaje Trimise",
    uptime: "Disponibilitate",
    heroTitle: "Unde se întâmplă conversațiile.",
    heroSubtitle:
      "Blabber este perfect pentru a petrece timpul cu prietenii sau chiar pentru a construi o comunitate globală. Personalizează-ți propriul spațiu pentru a vorbi și a socializa.",
    downloadWindows: "Descarcă pentru Windows",
    openInBrowser: "Deschide Blabber în browser-ul tău",
    openInBrowserSmall: "Deschide in browser",
    loginButton: "AUTENTIFICARE",
    copyright: "Toate drepturile rezervate.",
    skipToApp: "Treci la Aplicație",
    windowsDownload: "Descarcă pentru Windows",
    androidDownload: "Descarcă pentru Android",
    iosDownload: "Descarcă pentru iOS",
    browserAccess: "Deschide în Browser",
    startChatting: "Începe Conversația",
    noDownloadTitle: "Descărcare nu este încă disponibilă",
    noDownloadMessage:
      "Încă lucrăm la aplicație, așa că nu o putem descărca încă.",
    close: "ÎNCHIDE",
  },
  es: {
    activeUsers: "Usuarios Activos",
    messagesSent: "Mensajes Enviados",
    uptime: "Tiempo de Actividad",
    heroTitle: "Donde ocurren las conversaciones.",
    heroSubtitle:
      "Blabber es perfecto para pasar el rato con amigos o incluso para construir una comunidad global. Personaliza tu propio espacio para hablar y socializar.",
    downloadWindows: "Descargar para Windows",
    openInBrowser: "Abrir Blabber en tu navegador",
    openInBrowserSmall: "Abrir en Navegador",
    loginButton: "INICIAR SESIÓN",
    copyright: "Todos los derechos reservados.",
    skipToApp: "Ir a la Aplicación",
    windowsDownload: "Descargar para Windows",
    androidDownload: "Descargar para Android",
    iosDownload: "Descargar para iOS",
    browserAccess: "Abrir en Navegador",
    startChatting: "Comenzar a Chatear",
    noDownloadTitle: "Descarga no disponible todavía",
    noDownloadMessage:
      "Todavía estamos trabajando en la aplicación, así que aún no podemos descargarla.",
    close: "CERRAR",
  },
  fr: {
    activeUsers: "Utilisateurs Actifs",
    messagesSent: "Messages Envoyés",
    uptime: "Disponibilité",
    heroTitle: "Là où les conversations se produisent.",
    heroSubtitle:
      "Blabber est parfait pour passer du temps avec des amis ou même pour construire une communauté mondiale. Personnalisez votre propre espace pour parler et socialiser.",
    downloadWindows: "Télécharger pour Windows",
    openInBrowser: "Ouvrir Blabber dans votre navigateur",
    openInBrowserSmall: "Ouvrir dans le Navigateur",
    loginButton: "CONNEXION",
    copyright: "Tous droits réservés.",
    skipToApp: "Passer à l'Application",
    windowsDownload: "Télécharger pour Windows",
    androidDownload: "Télécharger pour Android",
    iosDownload: "Télécharger pour iOS",
    browserAccess: "Ouvrir dans le Navigateur",
    startChatting: "Commencer à Discuter",
    noDownloadTitle: "Téléchargement non disponible encore",
    noDownloadMessage:
      "Nous travaillons encore sur l'application, nous ne pouvons donc pas la télécharger pour le moment.",
    close: "FERMER",
  },
  de: {
    activeUsers: "Aktive Nutzer",
    messagesSent: "Nachrichten Gesendet",
    uptime: "Verfügbarkeit",
    heroTitle: "Wo Gespräche stattfinden.",
    heroSubtitle:
      "Blabber ist perfekt, um mit Freunden abzuhängen oder sogar eine globale Gemeinschaft aufzubauen. Passen Sie Ihren eigenen Raum zum Sprechen und Sozialisieren an.",
    downloadWindows: "Für Windows herunterladen",
    openInBrowser: "Blabber in Ihrem Browser öffnen",
    openInBrowserSmall: "In Browser",
    loginButton: "ANMELDUNG",
    copyright: "Alle Rechte vorbehalten.",
    skipToApp: "Zur App springen",
    windowsDownload: "Für Windows herunterladen",
    androidDownload: "Auf Android herunterladen",
    iosDownload: "Auf iOS herunterladen",
    browserAccess: "Im Browser öffnen",
    startChatting: "Chatten starten",
    noDownloadTitle: "Download noch nicht verfügbar",
    noDownloadMessage:
      "Wir arbeiten noch an der App, daher können wir sie noch nicht herunterladen.",
    close: "SCHLIESSEN",
  },
};
