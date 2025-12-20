// channelListTranslations.ts

// Define the type for Channel List translation keys
export type FriendRequestItemTranslationsKeys = {
  wantsToBeYourFriend: string;
  unknownUser: string;
  accept: string;
  reject: string;
  user: string;
};

// Define the type for language codes
export type FriendRequestItemTranslationsCode =
  | "us"
  | "gr"
  | "ru"
  | "md"
  | "es"
  | "fr"
  | "de";

// Define the translations object with proper typing
export const FriendRequestItemTranslations: Record<
  FriendRequestItemTranslationsCode,
  FriendRequestItemTranslationsKeys
> = {
  us: {
    wantsToBeYourFriend: "Wants to be your friend!",
    unknownUser: "Unknown User",
    accept: "ACCEPT",
    reject: "REJECT",
    user: "User",
  },
  gr: {
    wantsToBeYourFriend: "Θέλει να γίνει φίλος σας!",
    unknownUser: "Άγνωστος Χρήστης",
    accept: "ΑΠΟΔΟΧΗ",
    reject: "ΑΠΟΡΡΙΨΗ",
    user: "Χρήστης",
  },
  ru: {
    wantsToBeYourFriend: "Хочет стать вашим другом!",
    unknownUser: "Неизвестный пользователь",
    accept: "ПРИНЯТЬ",
    reject: "ОТКЛОНИТЬ",
    user: "Пользователь",
  },
  md: {
    wantsToBeYourFriend: "Vrea să fie prietenul tău!",
    unknownUser: "Utilizator Necunoscut",
    accept: "ACCEPTĂ",
    reject: "RESPINGE",
    user: "Utilizator",
  },
  es: {
    wantsToBeYourFriend: "Quiere ser tu amigo!",
    unknownUser: "Usuario Desconocido",
    accept: "ACEPTAR",
    reject: "RECHAZAR",
    user: "Usuario",
  },
  fr: {
    wantsToBeYourFriend: "Veut être votre ami!",
    unknownUser: "Utilisateur Inconnu",
    accept: "ACCEPTER",
    reject: "REJETER",
    user: "Utilisateur",
  },
  de: {
    wantsToBeYourFriend: "Möchte dein Freund sein!",
    unknownUser: "Unbekannter Benutzer",
    accept: "ANNEHMEN",
    reject: "ABLEHNEN",
    user: "Benutzer",
  },
};
