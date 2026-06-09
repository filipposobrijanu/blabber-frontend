export type ChannelListTranslationKeys = {
  addChannel: string;
  joinChannel: string;
  createChannel: string;
  channelName: string;
  channelDescription: string;
  close: string;
  create: string;
  join: string;
  joinChannelTitle: string;
  inviteCode: string;
  pasteFullLink: string;
  inviteToChannel: string;
  copyPasteCode: string;
  copied: string;
  copy: string;
  settings: string;
  invite: string;
  channelPrompt: string;
};

export type ChannelListLanguageCode =
  | "us"
  | "gr"
  | "ru"
  | "md"
  | "es"
  | "fr"
  | "de";

export const channelListTranslations: Record<
  ChannelListLanguageCode,
  ChannelListTranslationKeys
> = {
  us: {
    channelPrompt:
      "Your Channel is where you and your friends hang out. Make yours and start talking!",
    addChannel: "Add Channel",
    joinChannel: "Join Channel",
    createChannel: "Create Channel",
    channelName: "Channel Name *",
    channelDescription: "Channel Description",
    close: "Close",
    create: "Create Channel",
    join: "Join Channel",
    joinChannelTitle: "Join Channel",
    inviteCode: "Channel Invite Code",
    pasteFullLink: "You can also paste a full invite link",
    inviteToChannel: "Invite to",
    copyPasteCode: "Copy paste the code above to invite others",
    copied: "Copied",
    copy: "Copy",
    settings: "Settings",
    invite: "Invite",
  },
  gr: {
    channelPrompt:
      "Το κανάλι σας είναι όπου εσείς και οι φίλοι σας κάνετε παρέα. Δημιουργήστε το δικό σας και αρχίστε να μιλάτε!",
    addChannel: "Προσθήκη Καναλιού",
    joinChannel: "Σύνδεση σε Κανάλι",
    createChannel: "Δημιουργία Καναλιού",
    channelName: "Όνομα Καναλιού *",
    channelDescription: "Περιγραφή Καναλιού",
    close: "Κλεισιμο",
    create: "Δημιουργια Καναλιου",
    join: "Συνδεση σε Καναλι",
    joinChannelTitle: "Σύνδεση σε Κανάλι",
    inviteCode: "Κωδικός Πρόσκλησης Καναλιού",
    pasteFullLink:
      "Μπορείτε επίσης να επικολλήσετε έναν πλήρη σύνδεσμο πρόσκλησης",
    inviteToChannel: "Πρόσκληση στο",
    copyPasteCode:
      "Αντιγράψτε και επικολλήστε τον παραπάνω κωδικό για να προσκαλέσετε άλλους",
    copied: "Αντιγράφηκε",
    copy: "Αντιγραφη",
    settings: "Ρυθμίσεις",
    invite: "Πρόσκληση",
  },
  ru: {
    channelPrompt:
      "Ваш канал - это место, где вы и ваши друзья общаетесь. Создайте свой и начинайте общаться!",
    addChannel: "Добавить канал",
    joinChannel: "Присоединиться к каналу",
    createChannel: "Создать канал",
    channelName: "Имя канала *",
    channelDescription: "Описание канала",
    close: "Закрыть",
    create: "Создать канал",
    join: "Присоединиться",
    joinChannelTitle: "Присоединиться к каналу",
    inviteCode: "Код приглашения канала",
    pasteFullLink: "Вы также можете вставить полную ссылку приглашения",
    inviteToChannel: "Пригласить в",
    copyPasteCode: "Скопируйте и вставьте код выше, чтобы пригласить других",
    copied: "Скопировано",
    copy: "Копировать",
    settings: "Параметры",
    invite: "Приглашение",
  },
  md: {
    channelPrompt:
      "Canalul dvs. este locul în care vă întâlniți cu prietenii. Creați-vă propriul canal și începeți să vorbiți!",
    addChannel: "Adăugați canal",
    joinChannel: "Alăturați-vă canalului",
    createChannel: "Creați un canal",
    channelName: "Numele canalului *",
    channelDescription: "Descrierea canalului",
    close: "Închideți",
    create: "Creați un canal",
    join: "Alăturați-vă",
    joinChannelTitle: "Alăturați-vă canalului",
    inviteCode: "Codul de invitație al canalului",
    pasteFullLink:
      "Puteți, de asemenea, să lipiți un link de invitație complet",
    inviteToChannel: "Invitați la",
    copyPasteCode:
      "Copiați și lipiți codul de mai sus pentru a invita pe alții",
    copied: "Copiat",
    copy: "Copiare",
    settings: "Setări",
    invite: "Invitare",
  },
  es: {
    channelPrompt:
      "Tu Canal es donde tú y tus amigos pasan el rato. ¡Crea el tuyo y empieza a hablar!",
    addChannel: "Agregar Canal",
    joinChannel: "Unirse al Canal",
    createChannel: "Crear Canal",
    channelName: "Nombre del Canal *",
    channelDescription: "Descripción del Canal",
    close: "Cerrar",
    create: "Crear Canal",
    join: "Unirse al Canal",
    joinChannelTitle: "Unirse al Canal",
    inviteCode: "Código de Invitación del Canal",
    pasteFullLink: "También puedes pegar un enlace de invitación completo",
    inviteToChannel: "Invitar a",
    copyPasteCode: "Copia y pega el código de arriba para invitar a otros",
    copied: "Copiado",
    copy: "Copiar",
    settings: "Configuración",
    invite: "Invitar",
  },
  fr: {
    channelPrompt:
      "Votre Chaîne est l'endroit où vous et vos amis passez du temps. Créez la vôtre et commencez à parler !",
    addChannel: "Ajouter un Canal",
    joinChannel: "Rejoindre le Canal",
    createChannel: "Créer un Canal",
    channelName: "Nom du Canal *",
    channelDescription: "Description du Canal",
    close: "Fermer",
    create: "Créer le Canal",
    join: "Rejoindre",
    joinChannelTitle: "Rejoindre le Canal",
    inviteCode: "Code d'Invitation du Canal",
    pasteFullLink: "Vous pouvez également coller un lien d'invitation complet",
    inviteToChannel: "Inviter à",
    copyPasteCode:
      "Copiez et collez le code ci-dessus pour inviter d'autres personnes",
    copied: "Copié",
    copy: "Copier",
    settings: "Paramètres",
    invite: "Inviter",
  },
  de: {
    channelPrompt:
      "Dein Kanal ist der Ort, an dem du und deine Freunde abhängen. Erstelle deinen eigenen und fang an zu reden!",
    addChannel: "Kanal hinzufügen",
    joinChannel: "Kanal beitreten",
    createChannel: "Kanal erstellen",
    channelName: "Kanalname *",
    channelDescription: "Kanalbeschreibung",
    close: "Schließen",
    create: "Kanal erstellen",
    join: "Beitreten",
    joinChannelTitle: "Kanal beitreten",
    inviteCode: "Kanaleinladungscode",
    pasteFullLink:
      "Sie können auch einen vollständigen Einladungslink einfügen",
    inviteToChannel: "Einladen zu",
    copyPasteCode: "Kopieren Sie den Code oben, um andere einzuladen",
    copied: "Kopiert",
    copy: "Kopieren",
    settings: "Einstellungen",
    invite: "Einladen",
  },
};
