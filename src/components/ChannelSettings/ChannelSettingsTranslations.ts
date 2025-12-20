// channelSettingsTranslations.ts

// Define the type for Channel Settings translation keys
export type ChannelSettingsTranslationKeys = {
  // Tab names
  general: string;
  members: string;
  dangerZone: string;

  // General tab
  channelName: string;
  description: string;
  channelColor: string;
  saveChanges: string;
  saving: string;
  reset: string;

  // Members tab
  addMemberPlaceholder: string;
  addMember: string;
  currentMembers: string;
  noMembers: string;
  online: string;
  offline: string;
  remove: string;

  // Danger zone
  leaveChannel: string;
  leaveChannelDescription: string;
  deleteChannel: string;
  deleteChannelDescription: string;
  typeChannelNameToConfirm: string;
  deleteChannelForever: string;
  channelSettings: string;
  backButton: string;
  whatIsThisChannelAbout: string;
  channelNotFound: string;
  noPermissionMessage: string;
  settingsName: string;
};

// Define the type for language codes
export type ChannelSettingsLanguageCode =
  | "us"
  | "gr"
  | "ru"
  | "md"
  | "es"
  | "fr"
  | "de";

// Define the translations object with proper typing
export const channelSettingsTranslations: Record<
  ChannelSettingsLanguageCode,
  ChannelSettingsTranslationKeys
> = {
  us: {
    settingsName: "Settings",
    general: "General",
    members: "Members",
    dangerZone: "Danger Zone",
    channelName: "Channel Name",
    description: "Description",
    channelColor: "Channel Color",
    saveChanges: "Save Changes",
    saving: "Saving...",
    reset: "Reset",
    addMemberPlaceholder: "Enter username to add",
    addMember: "Add Member",
    currentMembers: "Current Members",
    noMembers: "No members found.",
    online: "Online",
    offline: "Offline",
    remove: "Remove",
    leaveChannel: "Leave Channel",
    leaveChannelDescription:
      "You will no longer have access to this channel. You can rejoin if you have an invite.",
    deleteChannel: "Delete Channel",
    deleteChannelDescription:
      "This action cannot be undone. This will permanently delete the channel and all its messages.",
    typeChannelNameToConfirm: "Type the channel name to confirm deletion:",
    deleteChannelForever: "Delete Channel Forever",
    channelSettings: "Channel Settings",
    backButton: "Back",
    whatIsThisChannelAbout: "What is this channel about?",
    channelNotFound: "Channel not found",
    noPermissionMessage:
      "This channel doesn't exist or you don't have permission to access it.",
  },
  gr: {
    settingsName: "Ρυθμίσεις",
    general: "Γενικά",
    members: "Μέλη",
    dangerZone: "Ζώνη Κινδύνου",
    channelName: "Όνομα Καναλιού",
    description: "Περιγραφή",
    channelColor: "Χρώμα Καναλιού",
    saveChanges: "Αποθηκευση Αλλαγων",
    saving: "Αποθηκευση...",
    reset: "Επαναφορα",
    addMemberPlaceholder: "Εισάγετε όνομα χρήστη για προσθήκη",
    addMember: "Προσθηκη Μελους",
    currentMembers: "Τρέχοντα Μέλη",
    noMembers: "Δεν βρέθηκαν μέλη.",
    online: "Σε σύνδεση",
    offline: "Εκτός σύνδεσης",
    remove: "Αφαίρεση",
    leaveChannel: "Αποχωρηση απο Καναλι",
    leaveChannelDescription:
      "Δεν θα έχετε πλέον πρόσβαση σε αυτό το κανάλι. Μπορείτε να επανενταχθείτε εάν έχετε πρόσκληση.",
    deleteChannel: "Διαγραφή Καναλιού",
    deleteChannelDescription:
      "Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Αυτό θα διαγράψει οριστικά το κανάλι και όλα του τα μηνύματα.",
    typeChannelNameToConfirm:
      "Πληκτρολογήστε το όνομα του καναλιού για επιβεβαίωση διαγραφής:",
    deleteChannelForever: "Διαγραφη Καναλιου Για Παντα",
    channelSettings: "Ρυθμίσεις Καναλιού",
    backButton: "Πισω",
    whatIsThisChannelAbout: "Τι αφορά αυτό το κανάλι;",
    channelNotFound: "Το κανάλι δεν βρέθηκε",
    noPermissionMessage:
      "Αυτό το κανάλι δεν υπάρχει ή δεν έχετε δικαίωμα πρόσβασης.",
  },
  ru: {
    settingsName: "Настройки",
    general: "Основное",
    members: "Участники",
    dangerZone: "Опасная зона",
    channelName: "Имя канала",
    description: "Описание",
    channelColor: "Цвет канала",
    saveChanges: "Сохранить изменения",
    saving: "Сохранение...",
    reset: "Сброс",
    addMemberPlaceholder: "Введите имя пользователя для добавления",
    addMember: "Добавить участника",
    currentMembers: "Текущие участники",
    noMembers: "Участники не найдены.",
    online: "Online",
    offline: "Offline",
    remove: "Удалить",
    leaveChannel: "Покинуть канал",
    leaveChannelDescription:
      "Вы больше не будете иметь доступ к этому каналу. Вы можете присоединиться снова, если у вас есть приглашение.",
    deleteChannel: "Удалить канал",
    deleteChannelDescription:
      "Это действие невозможно отменить. Это навсегда удалит канал и все его сообщения.",
    typeChannelNameToConfirm: "Введите имя канала для подтверждения удаления:",
    deleteChannelForever: "Удалить канал навсегда",
    channelSettings: "Параметры канала",
    backButton: "Назад",
    whatIsThisChannelAbout: "О чем этот канал?",
    channelNotFound: "Канал не найден",
    noPermissionMessage: "Этот канал не существует или у вас нет прав доступа.",
  },
  md: {
    settingsName: "Setări",
    general: "General",
    members: "Membri",
    dangerZone: "Zona Periculoasă",
    channelName: "Numele canalului",
    description: "Descriere",
    channelColor: "Culoarea canalului",
    saveChanges: "Salvați modificările",
    saving: "Se salvează...",
    reset: "Resetare",
    addMemberPlaceholder: "Introduceți numele de utilizator pentru a adăuga",
    addMember: "Adăugați membru",
    currentMembers: "Membri actuali",
    noMembers: "Niciun membru găsit.",
    online: "Online",
    offline: "Offline",
    remove: "Eliminare",
    leaveChannel: "Părăsiți canalul",
    leaveChannelDescription:
      "Nu veți mai avea acces la acest canal. Vă puteți alătura din nou dacă aveți o invitație.",
    deleteChannel: "Ștergeți canalul",
    deleteChannelDescription:
      "Această acțiune nu poate fi anulată. Aceasta va șterge permanent canalul și toate mesajele sale.",
    typeChannelNameToConfirm:
      "Introduceți numele canalului pentru a confirma ștergerea:",
    deleteChannelForever: "Ștergeți canalul pentru totdeauna",
    channelSettings: "Setări canal",
    backButton: "Înapoi",
    whatIsThisChannelAbout: "Despre ce este acest canal?",
    channelNotFound: "Canalul nu a fost găsit",
    noPermissionMessage:
      "Acest canal nu există sau nu aveți permisiune de acces.",
  },
  es: {
    settingsName: "Configuración",
    general: "General",
    members: "Miembros",
    dangerZone: "Zona de Peligro",
    channelName: "Nombre del Canal",
    description: "Descripción",
    channelColor: "Color del Canal",
    saveChanges: "Guardar Cambios",
    saving: "Guardando...",
    reset: "Restablecer",
    addMemberPlaceholder: "Ingresa nombre de usuario para agregar",
    addMember: "Agregar Miembro",
    currentMembers: "Miembros Actuales",
    noMembers: "No se encontraron miembros.",
    online: "En línea",
    offline: "Desconectado",
    remove: "Eliminar",
    leaveChannel: "Abandonar Canal",
    leaveChannelDescription:
      "Ya no tendrás acceso a este canal. Puedes volver a unirte si tienes una invitación.",
    deleteChannel: "Eliminar Canal",
    deleteChannelDescription:
      "Esta acción no se puede deshacer. Esto eliminará permanentemente el canal y todos sus mensajes.",
    typeChannelNameToConfirm:
      "Escribe el nombre del canal para confirmar la eliminación:",
    deleteChannelForever: "Eliminar Canal Para Siempre",
    channelSettings: "Configuración del Canal",
    backButton: "Atrás",
    whatIsThisChannelAbout: "¿De qué trata este canal?",
    channelNotFound: "Canal no encontrado",
    noPermissionMessage:
      "Este canal no existe o no tienes permiso para acceder a él.",
  },
  fr: {
    settingsName: "Paramètres",
    general: "Général",
    members: "Membres",
    dangerZone: "Zone de Danger",
    channelName: "Nom du Canal",
    description: "Description",
    channelColor: "Couleur du Canal",
    saveChanges: "Enregistrer les Modifications",
    saving: "Enregistrement...",
    reset: "Réinitialiser",
    addMemberPlaceholder: "Entrez le nom d'utilisateur à ajouter",
    addMember: "Ajouter un Membre",
    currentMembers: "Membres Actuels",
    noMembers: "Aucun membre trouvé.",
    online: "En ligne",
    offline: "Hors ligne",
    remove: "Supprimer",
    leaveChannel: "Quitter le Canal",
    leaveChannelDescription:
      "Vous n'aurez plus accès à ce canal. Vous pouvez le rejoindre à nouveau si vous avez une invitation.",
    deleteChannel: "Supprimer le Canal",
    deleteChannelDescription:
      "Cette action ne peut pas être annulée. Cela supprimera définitivement le canal et tous ses messages.",
    typeChannelNameToConfirm:
      "Tapez le nom du canal pour confirmer la suppression :",
    deleteChannelForever: "Supprimer le Canal Définitivement",
    channelSettings: "Paramètres du Canal",
    backButton: "Retour",
    whatIsThisChannelAbout: "De quoi parle ce canal ?",
    channelNotFound: "Canal non trouvé",
    noPermissionMessage:
      "Ce canal n'existe pas ou vous n'avez pas l'autorisation d'y accéder.",
  },
  de: {
    settingsName: "Einstellungen",
    general: "Allgemein",
    members: "Mitglieder",
    dangerZone: "Gefahrenzone",
    channelName: "Kanalname",
    description: "Beschreibung",
    channelColor: "Kanal Farbe",
    saveChanges: "Änderungen speichern",
    saving: "Wird gespeichert...",
    reset: "Zurücksetzen",
    addMemberPlaceholder: "Benutzernamen zum Hinzufügen eingeben",
    addMember: "Mitglied hinzufügen",
    currentMembers: "Aktuelle Mitglieder",
    noMembers: "Keine Mitglieder gefunden.",
    online: "Online",
    offline: "Offline",
    remove: "Entfernen",
    leaveChannel: "Kanal verlassen",
    leaveChannelDescription:
      "Sie haben keinen Zugriff mehr auf diesen Kanal. Sie können wieder beitreten, wenn Sie eine Einladung haben.",
    deleteChannel: "Kanal löschen",
    deleteChannelDescription:
      "Diese Aktion kann nicht rückgängig gemacht werden. Dadurch wird der Kanal und alle seine Nachrichten dauerhaft gelöscht.",
    typeChannelNameToConfirm:
      "Geben Sie den Kanalnamen zur Bestätigung der Löschung ein:",
    deleteChannelForever: "Kanal für immer löschen",
    channelSettings: "Kanaleinstellungen",
    backButton: "Zurück",
    whatIsThisChannelAbout: "Worum geht es in diesem Kanal?",
    channelNotFound: "Kanal nicht gefunden",
    noPermissionMessage:
      "Dieser Kanal existiert nicht oder Sie haben keine Zugriffsberechtigung.",
  },
};
