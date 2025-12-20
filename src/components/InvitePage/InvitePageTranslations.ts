// invitePageTranslations.ts

// Define the type for Invite Page translation keys
export type InvitePageTranslationKeys = {
  youveBeenInvited: string;
  invalidInvite: string;
  invalidInviteMessage: string;
  goHome: string;
  acceptInvite: string;
  joining: string;
  noThanks: string;
  joinChannel: string;
  channelJoinedSuccess: string;
  failedToJoinChannel: string;
  invalidOrExpiredInvite: string;
  join: string;
};

// Define the type for language codes
export type InvitePageLanguageCode =
  | "us"
  | "gr"
  | "ru"
  | "md"
  | "es"
  | "fr"
  | "de";

// Define the translations object with proper typing
export const invitePageTranslations: Record<
  InvitePageLanguageCode,
  InvitePageTranslationKeys
> = {
  us: {
    join: "Join",
    youveBeenInvited: "You've been invited to join",
    invalidInvite: "Invalid Invite",
    invalidInviteMessage: "This invite link is invalid or has expired",
    goHome: "Go Home",
    acceptInvite: "Accept Invite",
    joining: "Joining...",
    noThanks: "No Thanks",
    joinChannel: "Join Channel",
    channelJoinedSuccess: "Successfully joined the channel!",
    failedToJoinChannel: "Failed to join channel",
    invalidOrExpiredInvite: "Invalid or expired invite link",
  },
  gr: {
    join: "Συνδεσου",
    youveBeenInvited: "Έχεις προσκληθεί να συμμετάσχεις",
    invalidInvite: "Μη έγκυρη Πρόσκληση",
    invalidInviteMessage:
      "Αυτός ο σύνδεσμος πρόσκλησης είναι άκυρος ή έχει λήξει",
    goHome: "Πισω στο Σπιτι",
    acceptInvite: "Δεκτη η Προσκληση",
    joining: "Συμμετοχη...",
    noThanks: "οχι Ευχαριστω",
    joinChannel: "Συμμετοχη στο Καναλι",
    channelJoinedSuccess: "Συμμετείχες με επιτυχία στο κανάλι!",
    failedToJoinChannel: "Αποτυχία συμμετοχής στο κανάλι",
    invalidOrExpiredInvite: "Άκυρος ή εξαγορασμένος σύνδεσμος πρόσκλησης",
  },
  ru: {
    join: "Присоединиться",
    youveBeenInvited: "Вам было предложено присоединиться",
    invalidInvite: "Неверное приглашение",
    invalidInviteMessage: "Эта ссылка-приглашение недействительна или истекла",
    goHome: "На главную",
    acceptInvite: "Принять приглашение",
    joining: "Присоединение...",
    noThanks: "Спасибо, не надо",
    joinChannel: "Присоединиться к каналу",
    channelJoinedSuccess: "Вы успешно присоединились к каналу!",
    failedToJoinChannel: "Ошибка присоединения к каналу",
    invalidOrExpiredInvite: "Недействительная или истекшая ссылка-приглашение",
  },
  md: {
    join: "Alăturați-vă",
    youveBeenInvited: "Ai fost invitat să te alături",
    invalidInvite: "Invitație nevalidă",
    invalidInviteMessage: "Acest link de invitație este invalid sau a expirat",
    goHome: "Du-te acasă",
    acceptInvite: "Acceptă invitația",
    joining: "Se alătură...",
    noThanks: "Nu, mulțumesc",
    joinChannel: "Alătură-te canalului",
    channelJoinedSuccess: "Te-ai alăturat cu succes canalului!",
    failedToJoinChannel: "Eroare la alăturarea la canal",
    invalidOrExpiredInvite: "Link de invitație invalid sau expirat",
  },
  es: {
    join: "Unirse",
    youveBeenInvited: "Has sido invitado a unirte a",
    invalidInvite: "Invitación Inválida",
    invalidInviteMessage: "Este enlace de invitación es inválido o ha expirado",
    goHome: "Ir al Inicio",
    acceptInvite: "Aceptar Invitación",
    joining: "Uniéndose...",
    noThanks: "No, Gracias",
    joinChannel: "Unirse al Canal",
    channelJoinedSuccess: "¡Te has unido al canal exitosamente!",
    failedToJoinChannel: "Error al unirse al canal",
    invalidOrExpiredInvite: "Enlace de invitación inválido o expirado",
  },
  fr: {
    join: "Rejoindre",
    youveBeenInvited: "Vous avez été invité à rejoindre",
    invalidInvite: "Invitation Invalide",
    invalidInviteMessage: "Ce lien d'invitation est invalide ou a expiré",
    goHome: "Aller à l'Accueil",
    acceptInvite: "Accepter l'Invitation",
    joining: "Rejoindre...",
    noThanks: "Non Merci",
    joinChannel: "Rejoindre le Canal",
    channelJoinedSuccess: "Vous avez rejoint le canal avec succès !",
    failedToJoinChannel: "Échec de la jonction au canal",
    invalidOrExpiredInvite: "Lien d'invitation invalide ou expiré",
  },
  de: {
    join: "Beitreten",
    youveBeenInvited: "Sie wurden eingeladen, beizutreten",
    invalidInvite: "Ungültige Einladung",
    invalidInviteMessage: "Dieser Einladungslink ist ungültig oder abgelaufen",
    goHome: "Zur Startseite",
    acceptInvite: "Einladung Annehmen",
    joining: "Beitritt...",
    noThanks: "Nein Danke",
    joinChannel: "Kanal Beitreten",
    channelJoinedSuccess: "Sie sind dem Kanal erfolgreich beigetreten!",
    failedToJoinChannel: "Fehler beim Beitritt zum Kanal",
    invalidOrExpiredInvite: "Ungültiger oder abgelaufener Einladungslink",
  },
};
