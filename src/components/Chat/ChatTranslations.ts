// chatTranslations.ts

// Define the type for Chat translation keys
export type ChatTranslationKeys = {
  // Sidebar
  directChannels: string;
  friends: string;
  blabber: string;
  online: string;
  offline: string;

  // Swipe hint
  swipeToRight: string;
  media: string;

  // Typing animation texts
  selectChannelToStart: string;
  joinConversation: string;
  startChattingWithFriends: string;
  connectWithCommunity: string;

  // Chat area
  messageFriends: string;
  channelPlaceholder: string;

  // Search
  search: string;
  searchFriendsAndChannels: string;
  noResultsFound: string;

  login: string;
  // Empty states
  noMessagesYet: string;
  startConversation: string;
  noOtherUsersOnline: string;

  // Message actions
  searchMessages: string;
  foundMessage: string;
  foundMessages: string;
  clear: string;

  noFriendRequests: string;
  friendRequests: string;
  friendRequest: string;
  accept: string;
  reject: string;
  wantsToBeYourFriend: string;
  unknownUser: string;

  // Buttons
  send: string;
  logout: string;
  settings: string;
  videoCall: string;
  audioCall: string;
  close: string;
  membersShow: string;

  // Logout modal
  logoutTitle: string;
  confirmLogout: string;
  areYouSureLogout: string;
  inviteName: string;

  // Upload
  uploading: string;
  imageUploadFailed: string;
  selectImageFile: string;
  imageMustBeLessThan: string;

  addFriend: string;
  youCanAddFriends: string;
  confirmAddFriend: string;

  enterUsername: string;
  sending: string;
  sendFriendRequest: string;

  friendRequestsCAP: string;
  addFriendCAP: string;
  // User status
  searchResults: string;
  channels: string;
  users: string;
  results: string;
  all: string;
  noMembersInChannel: string;

  loadingOlderMessages: string;
  noMoreMessages: string;
  noMessagesFoundFor: string;

  // Members sidebar
  members: string;
  closeMembers: string;

  // Friend requests
  friendRequestsTitle: string;

  // Call errors
  noUsersForVideoCall: string;
  noUsersForAudioCall: string;

  // Optional console messages (for consistency)
  loadingOlderMessagesConsole: string;
  noMoreMessagesConsole: string;
  errorLoadingMessagesConsole: string;
};

// Define the type for language codes
export type ChatLanguageCode = "us" | "gr" | "ru" | "md" | "es" | "fr" | "de";

// Define the translations object with proper typing
export const chatTranslations: Record<ChatLanguageCode, ChatTranslationKeys> = {
  us: {
    loadingOlderMessages: "Loading older messages...",
    noMoreMessages: "No more messages to load",
    noMessagesFoundFor: "No messages found for",
    members: "Members",
    closeMembers: "Close",
    friendRequestsTitle: "Friend Requests",
    noUsersForVideoCall:
      "No online users in this channel to call. Try an audio call or invite someone.",
    noUsersForAudioCall:
      "No online users in this channel to call. Invite someone to join.",
    loadingOlderMessagesConsole: "Loading older messages...",
    noMoreMessagesConsole: "No more older messages",
    errorLoadingMessagesConsole: "Error loading older messages:",
    noMembersInChannel: "No members in this channel",
    noFriendRequests: "No Friend Requests Found",
    friendRequests: "Friend Requests",
    friendRequestsCAP: "FRIEND REQUESTS",
    friendRequest: "Friend Request",
    accept: "Accept",
    reject: "Reject",
    wantsToBeYourFriend: "Wants to be your friend",
    unknownUser: "Unknown User",
    enterUsername: "Enter username",
    sending: "Sending...",
    sendFriendRequest: "Send Friend Request",
    inviteName: "Enter the username",
    confirmAddFriend: "SEND FRIEND REQUEST",
    youCanAddFriends: "You can add friends with their Blabber username.",
    addFriend: "Add Friend",
    addFriendCAP: "ADD FRIEND",
    media: "Media",
    login: "Login",
    all: "All",
    directChannels: "Direct Channels",
    friends: "Friends",
    blabber: "Blabber",
    online: "Online",
    offline: "Offline",
    swipeToRight: "← Swipe to Right",
    selectChannelToStart: "Select a Channel to Start Blabbering...",
    joinConversation: "Join a conversation...",
    startChattingWithFriends: "Start chatting with friends...",
    connectWithCommunity: "Connect with your community...",
    messageFriends: "Message @friends",
    channelPlaceholder: "Message @",
    search: "Search...",
    searchFriendsAndChannels: "Search friends and channels...",
    noResultsFound: "No results found for",
    noMessagesYet: "No messages yet. Start the conversation!",
    startConversation: "Start the conversation!",
    noOtherUsersOnline: "No other users online",
    searchMessages: "Search...",
    foundMessage: "Found",
    foundMessages: "Found",
    clear: "Clear",
    send: "Send",
    logout: "Logout",
    settings: "Settings",
    membersShow: "Members List",
    videoCall: "Video Call",
    audioCall: "Audio Call",
    close: "Close",
    logoutTitle: "Logout",
    confirmLogout: "Logout",
    areYouSureLogout: "Are you sure you want to logout?",
    uploading: "Uploading...",
    imageUploadFailed: "Image upload failed:",
    selectImageFile: "Please select an image file",
    imageMustBeLessThan: "Image must be less than 5MB",
    searchResults: "Search Results",
    channels: "Channels",
    users: "Users",
    results: "results",
  },
  gr: {
    noMembersInChannel: "Κανένα μέλος σε αυτό το κανάλι",
    loadingOlderMessages: "Φόρτωση παλαιότερων μηνυμάτων...",
    noMoreMessages: "Δεν υπάρχουν άλλα μηνύματα προς φόρτωση",
    noMessagesFoundFor: "Δεν βρέθηκαν μηνύματα για",
    members: "Μέλη",
    closeMembers: "Κλείσιμο",
    friendRequestsTitle: "Αιτήματα Φιλίας",
    noUsersForVideoCall:
      "Κανένας χρήστης σε σύνδεση σε αυτό το κανάλι για κλήση. Δοκιμάστε μια φωνητική κλήση ή προσκαλέστε κάποιον.",
    noUsersForAudioCall:
      "Κανένας χρήστης σε σύνδεση σε αυτό το κανάλι για κλήση. Προσκαλέστε κάποιον να συμμετάσχει.",
    loadingOlderMessagesConsole: "Φόρτωση παλαιότερων μηνυμάτων...",
    noMoreMessagesConsole: "Δεν υπάρχουν άλλα παλαιότερα μηνύματα",
    errorLoadingMessagesConsole: "Σφάλμα φόρτωσης παλαιότερων μηνυμάτων:",
    membersShow: "Λίστα Μελών",
    addFriendCAP: "ΠΡΟΣΘΗΚΗ ΦΙΛΟΥ",
    friendRequestsCAP: "ΑΙΤΗΜΑΤΑ ΦΙΛΙΑΣ",
    noFriendRequests: "Δεν βρέθηκαν αιτήματα φιλίας",
    friendRequests: "Αιτήματα Φιλίας",
    friendRequest: "Αίτημα Φιλίας",
    accept: "Αποδοχή",
    reject: "Απόρριψη",
    wantsToBeYourFriend: "Θέλει να γίνει φίλος σας",
    unknownUser: "Άγνωστος Χρήστης",
    enterUsername: "Εισάγετε το όνομα χρήστη",
    sending: "Αποστολή...",
    sendFriendRequest: "ΑΠΟΣΤΟΛΗ ΑΙΤΗΜΑΤΟΣ ΦΙΛΙΑΣ",
    inviteName: "Εισάγετε το όνομα χρήστη",
    confirmAddFriend: "ΑΠΟΣΤΟΛΗ ΑΙΤΗΜΑΤΟΣ ΦΙΛΙΑΣ",
    youCanAddFriends:
      "Μπορείτε να προσθέσετε φίλους χρησιμοποιώντας το όνομα χρήστη Blabber τους.",
    addFriend: "Προσθήκη Φίλου",
    media: "Media",
    login: "Σύνδεση",
    all: "'Ολοι",
    directChannels: "Άμεσα Κανάλια",
    friends: "Φίλοι",
    blabber: "Blabber",
    online: "Σε σύνδεση",
    offline: "Εκτός σύνδεσης",
    swipeToRight: "← Σύρετε δεξιά",
    selectChannelToStart:
      "Επιλέξτε ένα κανάλι για να ξεκινήσετε τη συζήτηση...",
    joinConversation: "Συμμετάσχετε σε μια συζήτηση...",
    startChattingWithFriends: "Ξεκινήστε τη συζήτηση με φίλους...",
    connectWithCommunity: "Συνδεθείτε με την κοινότητά σας...",
    messageFriends: "Μήνυμα @φίλοι",
    channelPlaceholder: "Μήνυμα @",
    search: "Αναζήτηση...",
    searchFriendsAndChannels: "Αναζητήστε φίλους και κανάλια...",
    noResultsFound: "Δεν βρέθηκαν αποτελέσματα για",
    noMessagesYet: "Κανένα μήνυμα ακόμα. Ξεκινήστε τη συζήτηση!",
    startConversation: "Ξεκινήστε τη συζήτηση!",
    noOtherUsersOnline: "Κανένας άλλος χρήστης δεν είναι σε σύνδεση",
    searchMessages: "Αναζήτηση...",
    foundMessage: "Βρέθηκε",
    foundMessages: "Βρέθηκαν",
    clear: "Εκκαθάριση",
    send: "Αποστολη",
    logout: "Αποσύνδεση",
    settings: "Ρυθμίσεις",
    videoCall: "Βιντεοκλήση",
    audioCall: "Ηχητική κλήση",
    close: "Κλεισιμο",
    logoutTitle: "Αποσύνδεση",
    confirmLogout: "Αποσυνδεση",
    areYouSureLogout: "Είστε σίγουροι ότι θέλετε να αποσυνδεθείτε;",
    uploading: "Μεταφόρτωση...",
    imageUploadFailed: "Η μεταφόρτωση εικόνας απέτυχε:",
    selectImageFile: "Παρακαλώ επιλέξτε ένα αρχείο εικόνας",
    imageMustBeLessThan: "Η εικόνα πρέπει να είναι μικρότερη από 5MB",
    searchResults: "Αποτελέσματα αναζήτησης",
    channels: "Κανάλια",
    users: "Χρήστες",
    results: "αποτελέσματα",
  },
  ru: {
    loadingOlderMessages: "Загрузка старых сообщений...",
    noMoreMessages: "Больше нет сообщений для загрузки",
    noMessagesFoundFor: "Сообщения не найдены для",
    members: "Участники",
    closeMembers: "Закрыть",
    friendRequestsTitle: "Запросы в друзья",
    noUsersForVideoCall:
      "В этом канале нет пользователей в сети для звонка. Попробуйте аудиозвонок или пригласите кого-нибудь.",
    noUsersForAudioCall:
      "В этом канале нет пользователей в сети для звонка. Пригласите кого-нибудь присоединиться.",
    loadingOlderMessagesConsole: "Загрузка старых сообщений...",
    noMoreMessagesConsole: "Больше нет старых сообщений",
    errorLoadingMessagesConsole: "Ошибка загрузки старых сообщений:",
    noMembersInChannel: "В этом канале нет участников",
    membersShow: "Список участников",
    addFriendCAP: "ДОБАВИТЬ ДРУГА",
    friendRequestsCAP: "ЗАПРОСЫ В ДРУЗЬЯ",
    noFriendRequests: "Запросы в друзья не найдены",
    friendRequests: "Запросы в друзья",
    friendRequest: "Запрос в друзья",
    accept: "Принять",
    reject: "Отклонить",
    wantsToBeYourFriend: "Хочет стать вашим другом",
    unknownUser: "Неизвестный пользователь",
    enterUsername: "Введите имя пользователя",
    sending: "Отправка...",
    sendFriendRequest: "ОТПРАВИТЬ ЗАПРОС НА ДРУЖБУ",
    inviteName: "Введите имя пользователя",
    confirmAddFriend: "ОТПРАВИТЬ ЗАПРОС НА ДРУЖБУ",
    youCanAddFriends:
      "Вы можете добавлять друзей по их имени пользователя в Blabber.",
    addFriend: "Добавить друга",
    media: "СМИ",
    login: "Авторизоваться",
    all: "Все",
    directChannels: "Прямые каналы",
    friends: "Друзья",
    blabber: "Blabber",
    online: "Online",
    offline: "Offline",
    swipeToRight: "← Проведите вправо",
    selectChannelToStart: "Выберите канал, чтобы начать общаться...",
    joinConversation: "Присоединитесь к беседе...",
    startChattingWithFriends: "Начните общаться с друзьями...",
    connectWithCommunity: "Подключитесь к вашему сообществу...",
    messageFriends: "Сообщение @друзья",
    channelPlaceholder: "Сообщение @",
    search: "Поиск...",
    searchFriendsAndChannels: "Поиск друзей и каналов...",
    noResultsFound: "Результаты не найдены для",
    noMessagesYet: "Сообщений нет. Начните беседу!",
    startConversation: "Начните беседу!",
    noOtherUsersOnline: "Других пользователей в сети нет",
    searchMessages: "Поиск...",
    foundMessage: "Найдено",
    foundMessages: "Найдено",
    clear: "Очистить",
    send: "Отправить",
    logout: "Выход",
    settings: "Параметры",
    videoCall: "Видеозвонок",
    audioCall: "Голосовой вызов",
    close: "Закрыть",
    logoutTitle: "Выход",
    confirmLogout: "Выход",
    areYouSureLogout: "Вы уверены, что хотите выйти?",
    uploading: "Загрузка...",
    imageUploadFailed: "Загрузка изображения не удалась:",
    selectImageFile: "Пожалуйста, выберите файл изображения",
    imageMustBeLessThan: "Изображение должно быть менее 5МБ",
    searchResults: "Результаты поиска",
    channels: "Каналы",
    users: "Пользователи",
    results: "результаты",
  },
  md: {
    loadingOlderMessages: "Se încarcă mesajele mai vechi...",
    noMoreMessages: "Nu mai sunt mesaje de încărcat",
    noMessagesFoundFor: "Nu s-au găsit mesaje pentru",
    members: "Membri",
    closeMembers: "Închide",
    friendRequestsTitle: "Cereri de Prietenie",
    noUsersForVideoCall:
      "Niciun utilizator online în acest canal pentru apel. Încercați un apel audio sau invitați pe cineva.",
    noUsersForAudioCall:
      "Niciun utilizator online în acest canal pentru apel. Invitați pe cineva să se alăture.",
    loadingOlderMessagesConsole: "Se încarcă mesajele mai vechi...",
    noMoreMessagesConsole: "Nu mai sunt mesaje vechi",
    errorLoadingMessagesConsole: "Eroare la încărcarea mesajelor vechi:",
    noMembersInChannel: "Niciun membru în acest canal",
    membersShow: "Lista Membrilor",
    addFriendCAP: "ADAUGA PRIETEN",
    friendRequestsCAP: "CERERI DE PRIETENIE",
    noFriendRequests: "Nu s-au găsit cereri de prietenie",
    friendRequests: "Cereri de Prietenie",
    friendRequest: "Cerere de Prietenie",
    accept: "Acceptă",
    reject: "Respinge",
    wantsToBeYourFriend: "Vrea să fie prietenul tău",
    unknownUser: "Utilizator Necunoscut",
    enterUsername: "Introduceți numele de utilizator",
    sending: "Se trimite...",
    sendFriendRequest: "TRIMITE CERERE DE PRIETENIE",
    inviteName: "Introduceți numele de utilizator",
    confirmAddFriend: "TRIMITE CERERE DE PRIETENIE",
    youCanAddFriends:
      "Puteți adăuga prieteni folosind numele lor de utilizator Blabber.",
    addFriend: "Adaugă Prieten",
    media: "Media",
    login: "Log in",
    all: "Toate",
    directChannels: "Canale directe",
    friends: "Prieteni",
    blabber: "Blabber",
    online: "Online",
    offline: "Offline",
    swipeToRight: "← Glisați la dreapta",
    selectChannelToStart: "Selectați un canal pentru a începe conversația...",
    joinConversation: "Alăturați-vă unei conversații...",
    startChattingWithFriends: "Începeți să vorbiți cu prietenii...",
    connectWithCommunity: "Conectați-vă la comunitatea dvs...",
    messageFriends: "Mesaj @prieteni",
    channelPlaceholder: "Mesaj @",
    search: "Căutare...",
    searchFriendsAndChannels: "Căutați prieteni și canale...",
    noResultsFound: "Nu s-au găsit rezultate pentru",
    noMessagesYet: "Niciun mesaj încă. Începeți conversația!",
    startConversation: "Începeți conversația!",
    noOtherUsersOnline: "Niciun alt utilizator online",
    searchMessages: "Căutare...",
    foundMessage: "Găsit",
    foundMessages: "Găsit",
    clear: "Ștergeți",
    send: "Trimiteți",
    logout: "Deconectare",
    settings: "Setări",
    videoCall: "Apel video",
    audioCall: "Apel audio",
    close: "Închideți",
    logoutTitle: "Deconectare",
    confirmLogout: "Deconectare",
    areYouSureLogout: "Sunteți sigur că doriți să vă deconectați?",
    uploading: "Se încarcă...",
    imageUploadFailed: "Încărcarea imaginii a eșuat:",
    selectImageFile: "Selectați un fișier imagine",
    imageMustBeLessThan: "Imaginea trebuie să fie mai mică de 5MB",
    searchResults: "Rezultate căutare",
    channels: "Canale",
    users: "Utilizatori",
    results: "rezultate",
  },
  es: {
    loadingOlderMessages: "Cargando mensajes anteriores...",
    noMoreMessages: "No hay más mensajes para cargar",
    noMessagesFoundFor: "No se encontraron mensajes para",
    members: "Miembros",
    closeMembers: "Cerrar",
    friendRequestsTitle: "Solicitudes de Amistad",
    noUsersForVideoCall:
      "No hay usuarios en línea en este canal para llamar. Intenta una llamada de audio o invita a alguien.",
    noUsersForAudioCall:
      "No hay usuarios en línea en este canal para llamar. Invita a alguien a unirse.",
    loadingOlderMessagesConsole: "Cargando mensajes anteriores...",
    noMoreMessagesConsole: "No hay más mensajes anteriores",
    errorLoadingMessagesConsole: "Error al cargar mensajes anteriores:",
    noMembersInChannel: "No hay miembros en este canal",
    membersShow: "Lista de Miembros",
    addFriendCAP: "AGREGAR AMIGO",
    friendRequestsCAP: "SOLICITUDES DE AMISTAD",
    noFriendRequests: "No se encontraron solicitudes de amistad",
    friendRequests: "Solicitudes de Amistad",
    friendRequest: "Solicitud de Amistad",
    accept: "Aceptar",
    reject: "Rechazar",
    wantsToBeYourFriend: "Quiere ser tu amigo",
    unknownUser: "Usuario Desconocido",
    enterUsername: "Ingresa el nombre de usuario",
    sending: "Enviando...",
    sendFriendRequest: "ENVIAR SOLICITUD DE AMISTAD",
    inviteName: "Ingresa el nombre de usuario",
    confirmAddFriend: "ENVIAR SOLICITUD DE AMISTAD",
    youCanAddFriends:
      "Puedes agregar amigos con su nombre de usuario de Blabber.",
    addFriend: "Agregar Amigo",
    media: "Medios",
    login: "Iniciar sesión",
    all: "Todos",
    directChannels: "Canales Directos",
    friends: "Amigos",
    blabber: "Blabber",
    online: "En línea",
    offline: "Desconectado",
    swipeToRight: "← Desliza a la derecha",
    selectChannelToStart: "Selecciona un canal para empezar a chatear...",
    joinConversation: "Únete a una conversación...",
    startChattingWithFriends: "Empieza a chatear con amigos...",
    connectWithCommunity: "Conéctate con tu comunidad...",
    messageFriends: "Mensaje @amigos",
    channelPlaceholder: "Mensaje @",
    search: "Buscar...",
    searchFriendsAndChannels: "Buscar amigos y canales...",
    noResultsFound: "No se encontraron resultados para",
    noMessagesYet: "Aún no hay mensajes. ¡Inicia la conversación!",
    startConversation: "¡Inicia la conversación!",
    noOtherUsersOnline: "No hay otros usuarios en línea",
    searchMessages: "Buscar...",
    foundMessage: "Encontrado",
    foundMessages: "Encontrados",
    clear: "Limpiar",
    send: "Enviar",
    logout: "Cerrar sesión",
    settings: "Configuración",
    videoCall: "Videollamada",
    audioCall: "Llamada de audio",
    close: "Cerrar",
    logoutTitle: "Cerrar sesión",
    confirmLogout: "Cerrar sesión",
    areYouSureLogout: "¿Estás seguro de que quieres cerrar sesión?",
    uploading: "Subiendo...",
    imageUploadFailed: "Error al subir imagen:",
    selectImageFile: "Por favor selecciona un archivo de imagen",
    imageMustBeLessThan: "La imagen debe ser menor a 5MB",
    searchResults: "Resultados de búsqueda",
    channels: "Canales",
    users: "Usuarios",
    results: "resultados",
  },
  fr: {
    loadingOlderMessages: "Chargement des messages plus anciens...",
    noMoreMessages: "Plus de messages à charger",
    noMessagesFoundFor: "Aucun message trouvé pour",
    members: "Membres",
    closeMembers: "Fermer",
    friendRequestsTitle: "Demandes d'Ami",
    noUsersForVideoCall:
      "Aucun utilisateur en ligne dans ce canal à appeler. Essayez un appel audio ou invitez quelqu'un.",
    noUsersForAudioCall:
      "Aucun utilisateur en ligne dans ce canal à appeler. Invitez quelqu'un à rejoindre.",
    loadingOlderMessagesConsole: "Chargement des messages plus anciens...",
    noMoreMessagesConsole: "Plus de messages anciens",
    errorLoadingMessagesConsole: "Erreur de chargement des messages anciens:",
    noMembersInChannel: "Aucun membre dans ce canal",
    membersShow: "Liste des Membres",
    addFriendCAP: "AJOUTER UN AMI",
    friendRequestsCAP: "DEMANDES D'AMI",
    noFriendRequests: "Aucune demande d'ami trouvée",
    friendRequests: "Demandes d'Ami",
    friendRequest: "Demande d'Ami",
    accept: "Accepter",
    reject: "Rejeter",
    wantsToBeYourFriend: "Veut être votre ami",
    unknownUser: "Utilisateur Inconnu",
    enterUsername: "Entrez le nom d'utilisateur",
    sending: "Envoi en cours...",
    sendFriendRequest: "ENVOYER LA DEMANDE D'AMI",
    inviteName: "Entrez le nom d'utilisateur",
    confirmAddFriend: "ENVOYER LA DEMANDE D'AMI",
    youCanAddFriends:
      "Vous pouvez ajouter des amis avec leur nom d'utilisateur Blabber.",
    addFriend: "Ajouter un Ami",
    media: "Médias",
    login: "Connexion",
    all: "Tous",
    directChannels: "Canaux Directs",
    friends: "Amis",
    blabber: "Blabber",
    online: "En ligne",
    offline: "Hors ligne",
    swipeToRight: "← Glissez vers la droite",
    selectChannelToStart: "Sélectionnez un canal pour commencer à discuter...",
    joinConversation: "Rejoignez une conversation...",
    startChattingWithFriends: "Commencez à discuter avec des amis...",
    connectWithCommunity: "Connectez-vous avec votre communauté...",
    messageFriends: "Message @amis",
    channelPlaceholder: "Message @",
    search: "Rechercher...",
    searchFriendsAndChannels: "Rechercher des amis et des canaux...",
    noResultsFound: "Aucun résultat trouvé pour",
    noMessagesYet: "Aucun message pour l'instant. Commencez la conversation !",
    startConversation: "Commencez la conversation !",
    noOtherUsersOnline: "Aucun autre utilisateur en ligne",
    searchMessages: "Rechercher...",
    foundMessage: "Trouvé",
    foundMessages: "Trouvés",
    clear: "Effacer",
    send: "Envoyer",
    logout: "Déconnexion",
    settings: "Paramètres",
    videoCall: "Appel vidéo",
    audioCall: "Appel audio",
    close: "Fermer",
    logoutTitle: "Déconnexion",
    confirmLogout: "Déconnexion",
    areYouSureLogout: "Êtes-vous sûr de vouloir vous déconnecter ?",
    uploading: "Téléchargement...",
    imageUploadFailed: "Échec du téléchargement d'image :",
    selectImageFile: "Veuillez sélectionner un fichier image",
    imageMustBeLessThan: "L'image doit être inférieure à 5MB",
    searchResults: "Résultats de recherche",
    channels: "Canaux",
    users: "Utilisateurs",
    results: "résultats",
  },
  de: {
    loadingOlderMessages: "Lade ältere Nachrichten...",
    noMoreMessages: "Keine weiteren Nachrichten zum Laden",
    noMessagesFoundFor: "Keine Nachrichten gefunden für",
    members: "Mitglieder",
    closeMembers: "Schließen",
    friendRequestsTitle: "Freundschaftsanfragen",
    noUsersForVideoCall:
      "Keine Online-Benutzer in diesem Kanal zum Anrufen. Versuchen Sie einen Audioanruf oder laden Sie jemanden ein.",
    noUsersForAudioCall:
      "Keine Online-Benutzer in diesem Kanal zum Anrufen. Laden Sie jemanden ein, beizutreten.",
    loadingOlderMessagesConsole: "Lade ältere Nachrichten...",
    noMoreMessagesConsole: "Keine älteren Nachrichten mehr",
    errorLoadingMessagesConsole: "Fehler beim Laden älterer Nachrichten:",
    noMembersInChannel: "Keine Mitglieder in diesem Kanal",
    membersShow: "Mitgliederliste",
    addFriendCAP: "FREUND HINZUFÜGEN",
    friendRequestsCAP: "FREUNDSCHAFTSANFRAGEN",
    noFriendRequests: "Keine Freundschaftsanfragen gefunden",
    friendRequests: "Freundschaftsanfragen",
    friendRequest: "Freundschaftsanfrage",
    accept: "Annehmen",
    reject: "Ablehnen",
    wantsToBeYourFriend: "Möchte dein Freund sein",
    unknownUser: "Unbekannter Benutzer",
    enterUsername: "Benutzernamen eingeben",
    sending: "Wird gesendet...",
    sendFriendRequest: "FREUNDSCHAFTSANFRAGE SENDEN",
    inviteName: "Benutzernamen eingeben",
    confirmAddFriend: "FREUNDSCHAFTSANFRAGE SENDEN",
    youCanAddFriends:
      "Sie können Freunde mit ihrem Blabber-Benutzernamen hinzufügen.",
    addFriend: "Freund Hinzufügen",
    media: "Medien",
    login: "Anmelden",
    all: "Alle",
    directChannels: "Direkte Kanäle",
    friends: "Freunde",
    blabber: "Blabber",
    online: "Online",
    offline: "Offline",
    swipeToRight: "← Nach rechts wischen",
    selectChannelToStart: "Wählen Sie einen Kanal, um zu plaudern...",
    joinConversation: "Einer Konversation beitreten...",
    startChattingWithFriends: "Beginnen Sie mit Freunden zu chatten...",
    connectWithCommunity: "Verbinden Sie sich mit Ihrer Community...",
    messageFriends: "Nachricht @freunde",
    channelPlaceholder: "Nachricht @",
    search: "Suchen...",
    searchFriendsAndChannels: "Freunde und Kanäle suchen...",
    noResultsFound: "Keine Ergebnisse gefunden für",
    noMessagesYet: "Noch keine Nachrichten. Starten Sie die Konversation!",
    startConversation: "Starten Sie die Konversation!",
    noOtherUsersOnline: "Keine anderen Benutzer online",
    searchMessages: "Suchen...",
    foundMessage: "Gefunden",
    foundMessages: "Gefunden",
    clear: "Löschen",
    send: "Senden",
    logout: "Abmelden",
    settings: "Einstellungen",
    videoCall: "Videoanruf",
    audioCall: "Sprachanruf",
    close: "Schließen",
    logoutTitle: "Abmelden",
    confirmLogout: "Abmelden",
    areYouSureLogout: "Sind Sie sicher, dass Sie sich abmelden möchten?",
    uploading: "Wird hochgeladen...",
    imageUploadFailed: "Bild-Upload fehlgeschlagen:",
    selectImageFile: "Bitte wählen Sie eine Bilddatei aus",
    imageMustBeLessThan: "Bild muss kleiner als 5MB sein",
    searchResults: "Suchergebnisse",
    channels: "Kanäle",
    users: "Benutzer",
    results: "Ergebnisse",
  },
};
