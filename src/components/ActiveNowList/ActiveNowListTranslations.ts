export type ActiveNowTranslationKeys = {
  online: string;
  onlineStatus: string;
  noOneOnline: string;
  noOneOnlineMessage: string;
  message: string;
};

export type ActiveNowLanguageCode =
  | "us"
  | "gr"
  | "ru"
  | "md"
  | "es"
  | "fr"
  | "de";

export const activeNowTranslations: Record<
  ActiveNowLanguageCode,
  ActiveNowTranslationKeys
> = {
  us: {
    online: "Online",
    onlineStatus: "Online",
    noOneOnline: "No one else is online right now",
    noOneOnlineMessage:
      "No one else is online right now, if anyone is, they'll show up here.",
    message: "Message",
  },
  gr: {
    online: "Σε σύνδεση",
    onlineStatus: "Σε σύνδεση",
    noOneOnline: "Κανείς δεν είναι σε σύνδεση αυτή τη στιγμή",
    noOneOnlineMessage:
      "Κανείς δεν είναι σε σύνδεση αυτή τη στιγμή, εάν κάποιος είναι, θα εμφανιστεί εδώ.",
    message: "Μήνυμα",
  },
  ru: {
    online: "Онлайн",
    onlineStatus: "Онлайн",
    noOneOnline: "Никто другой сейчас не в сети",
    noOneOnlineMessage:
      "Никто другой сейчас не в сети, если кто-то будет, он появится здесь.",
    message: "Сообщение",
  },
  md: {
    online: "Online",
    onlineStatus: "Online",
    noOneOnline: "Nimeni altcineva nu este online acum",
    noOneOnlineMessage:
      "Nimeni altcineva nu este online acum, dacă cineva va fi, va apărea aici.",
    message: "Mesaj",
  },
  es: {
    online: "En línea",
    onlineStatus: "En línea",
    noOneOnline: "Nadie más está en línea en este momento",
    noOneOnlineMessage:
      "Nadie más está en línea en este momento, si alguien lo está, aparecerá aquí.",
    message: "Mensaje",
  },
  fr: {
    online: "En ligne",
    onlineStatus: "En ligne",
    noOneOnline: "Personne d'autre n'est en ligne pour le moment",
    noOneOnlineMessage:
      "Personne d'autre n'est en ligne pour le moment, si quelqu'un est en ligne, il apparaîtra ici.",
    message: "Message",
  },
  de: {
    online: "Online",
    onlineStatus: "Online",
    noOneOnline: "Niemand anderes ist gerade online",
    noOneOnlineMessage:
      "Niemand anderes ist gerade online, falls jemand online ist, wird er hier angezeigt.",
    message: "Nachricht",
  },
};
