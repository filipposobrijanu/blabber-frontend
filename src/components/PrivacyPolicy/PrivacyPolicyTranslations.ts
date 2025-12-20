// privacyTranslations.ts

// Define the type for Privacy Policy translation keys
export type PrivacyTranslationKeys = {
  privacyPolicy: string;
  lastUpdated: string;
  informationWeCollect: string;
  informationWeCollectText: string;
  accountInformation: string;
  profileInformation: string;
  messagesContent: string;
  technicalInformation: string;
  howWeUseInformation: string;
  howWeUseInformationText: string;
  provideServices: string;
  createManageAccount: string;
  facilitateCommunication: string;
  sendUpdates: string;
  ensureSecurity: string;
  informationSharing: string;
  informationSharingText: string;
  withConsent: string;
  withOtherUsers: string;
  complyLegal: string;
  serviceProviders: string;
  dataSecurity: string;
  dataSecurityText: string;
  yourRights: string;
  yourRightsText: string;
  accessUpdate: string;
  deleteAccount: string;
  optOutPromo: string;
  exportData: string;
  dataRetention: string;
  dataRetentionText: string;
  childrenPrivacy: string;
  childrenPrivacyText: string;
  contactUs: string;
  contactUsText: string;
  iUnderstand: string;
  termsOfService: string;
};

// Define the type for language codes
export type PrivacyLanguageCode =
  | "us"
  | "gr"
  | "ru"
  | "md"
  | "es"
  | "fr"
  | "de";

// Define the translations object with proper typing
export const privacyTranslations: Record<
  PrivacyLanguageCode,
  PrivacyTranslationKeys
> = {
  us: {
    privacyPolicy: "Privacy Policy",
    lastUpdated: "Last updated:",
    informationWeCollect: "1. Information We Collect",
    informationWeCollectText:
      "We collect information you provide directly to us, including:",
    accountInformation: "Account information (username, email, password)",
    profileInformation: "Profile information and preferences",
    messagesContent: "Messages and content you post in channels",
    technicalInformation:
      "Technical information about your device and connection",
    howWeUseInformation: "2. How We Use Your Information",
    howWeUseInformationText: "We use the information we collect to:",
    provideServices: "Provide, maintain, and improve our services",
    createManageAccount: "Create and manage your account",
    facilitateCommunication: "Facilitate communication between users",
    sendUpdates: "Send you important service updates and notifications",
    ensureSecurity: "Ensure the security and safety of our platform",
    informationSharing: "3. Information Sharing",
    informationSharingText:
      "We do not sell your personal information to third parties. We may share your information only in the following circumstances:",
    withConsent: "With your consent or at your direction",
    withOtherUsers:
      "With other users in channels you join (your username and messages)",
    complyLegal: "To comply with legal obligations or protect rights",
    serviceProviders: "With service providers who assist our operations",
    dataSecurity: "4. Data Security",
    dataSecurityText:
      "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction. However, no method of transmission over the internet is 100% secure.",
    yourRights: "5. Your Rights",
    yourRightsText: "You have the right to:",
    accessUpdate: "Access and update your personal information",
    deleteAccount: "Delete your account and associated data",
    optOutPromo: "Opt-out of promotional communications",
    exportData: "Export your data from our service",
    dataRetention: "6. Data Retention",
    dataRetentionText:
      "We retain your personal information for as long as your account is active or as needed to provide our services. You can request account deletion at any time, which will remove your personal data from our systems.",
    childrenPrivacy: "7. Children's Privacy",
    childrenPrivacyText:
      "Blabber is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we learn we have collected such information, we will delete it immediately.",
    contactUs: "8. Contact Us",
    contactUsText:
      "If you have any questions about this Privacy Policy, please contact us at blabber.co.info@gmail.com",
    iUnderstand: "I Understand",
    termsOfService: "Terms of Service",
  },
  gr: {
    privacyPolicy: "Πολιτική Ιδιωτικότητας",
    lastUpdated: "Τελευταία ενημέρωση:",
    informationWeCollect: "1. Πληροφορίες που συλλέγουμε",
    informationWeCollectText:
      "Συλλέγουμε πληροφορίες που μας παρέχετε απευθείας, συμπεριλαμβανομένων:",
    accountInformation:
      "Πληροφορίες λογαριασμού (όνομα χρήστη, email, κωδικός)",
    profileInformation: "Πληροφορίες προφίλ και προτιμήσεις",
    messagesContent: "Μηνύματα και περιεχόμενο που δημοσιεύετε σε κανάλια",
    technicalInformation:
      "Τεχνικές πληροφορίες σχετικά με τη συσκευή και σύνδεση σας",
    howWeUseInformation: "2. Πώς χρησιμοποιούμε τις πληροφορίες σας",
    howWeUseInformationText:
      "Χρησιμοποιούμε τις πληροφορίες που συλλέγουμε για:",
    provideServices: "Παροχή, συντήρηση και βελτίωση των υπηρεσιών μας",
    createManageAccount: "Δημιουργία και διαχείριση του λογαριασμού σας",
    facilitateCommunication: "Διευκόλυνση της επικοινωνίας μεταξύ χρηστών",
    sendUpdates: "Αποστολή σημαντικών ενημερώσεων υπηρεσίας και ειδοποιήσεων",
    ensureSecurity: "Διασφάλιση της ασφάλειας της πλατφόρμας μας",
    informationSharing: "3. Κοινοποίηση Πληροφοριών",
    informationSharingText:
      "Δεν πουλάμε τις προσωπικές σας πληροφορίες σε τρίτους. Ενδέχεται να κοινοποιήσουμε τις πληροφορίες σας μόνο στις ακόλουθες περιπτώσεις:",
    withConsent: "Με τη συναίνεσή σας ή κατά οδηγίες σας",
    withOtherUsers:
      "Με άλλους χρήστες σε κανάλια που συμμετέχετε (το όνομα χρήστη και τα μηνύματά σας)",
    complyLegal:
      "Για συμμόρφωση με νομικές υποχρεώσεις ή προστασία δικαιωμάτων",
    serviceProviders: "Με παρόχους υπηρεσιών που βοηθούν τις λειτουργίες μας",
    dataSecurity: "4. Ασφάλεια Δεδομένων",
    dataSecurityText:
      "Εφαρμόζουμε κατάλληλα μέτρα ασφάλειας για να προστατεύσουμε τις προσωπικές σας πληροφορίες από μη εξουσιοδοτημένη πρόσβαση, τροποποίηση ή καταστροφή. Ωστόσο, καμία μέθοδος μετάδοσης μέσω του διαδικτύου δεν είναι 100% ασφαλής.",
    yourRights: "5. Τα δικαιώματά σας",
    yourRightsText: "Έχετε το δικαίωμα να:",
    accessUpdate:
      "Αποκτήστε πρόσβαση και ενημερώστε τις προσωπικές σας πληροφορίες",
    deleteAccount: "Διαγράψτε το λογαριασμό σας και τα σχετικά δεδομένα",
    optOutPromo: "Εξαιρεθείτε από προωθητικές επικοινωνίες",
    exportData: "Εξάγετε τα δεδομένα σας από την υπηρεσία μας",
    dataRetention: "6. Διατήρηση Δεδομένων",
    dataRetentionText:
      "Διατηρούμε τις προσωπικές σας πληροφορίες για όσο καιρό είναι ενεργός ο λογαριασμός σας ή όπως απαιτείται για την παροχή των υπηρεσιών μας. Μπορείτε να ζητήσετε τη διαγραφή λογαριασμού ανά πάσα στιγμή, η οποία θα καταργήσει τα προσωπικά σας δεδομένα από τα συστήματά μας.",
    childrenPrivacy: "7. Ιδιωτικότητα Παιδιών",
    childrenPrivacyText:
      "Το Blabber δεν προορίζεται για παιδιά κάτω των 13 ετών. Δεν συλλέγουμε σκόπιμα προσωπικές πληροφορίες από παιδιά κάτω των 13 ετών. Εάν μάθουμε ότι έχουμε συλλέξει τέτοιες πληροφορίες, θα τις διαγράψουμε αμέσως.",
    contactUs: "8. Επικοινωνήστε μαζί μας",
    contactUsText:
      "Εάν έχετε ερωτήσεις σχετικά με αυτήν την Πολιτική Ιδιωτικότητας, επικοινωνήστε μαζί μας στο blabber.co.info@gmail.com",
    iUnderstand: "Κατανοω",
    termsOfService: "Οροι Υπηρεσιας",
  },
  ru: {
    privacyPolicy: "Политика конфиденциальности",
    lastUpdated: "Последнее обновление:",
    informationWeCollect: "1. Информация, которую мы собираем",
    informationWeCollectText:
      "Мы собираем информацию, которую вы предоставляете нам напрямую, включая:",
    accountInformation:
      "Информация учетной записи (имя пользователя, электронная почта, пароль)",
    profileInformation: "Информация профиля и предпочтения",
    messagesContent: "Сообщения и контент, которые вы публикуете в каналах",
    technicalInformation:
      "Техническая информация о вашем устройстве и соединении",
    howWeUseInformation: "2. Как мы используем вашу информацию",
    howWeUseInformationText: "Мы используем собираемую информацию для:",
    provideServices: "Предоставления, поддержки и улучшения наших услуг",
    createManageAccount: "Создания и управления вашей учетной записью",
    facilitateCommunication: "Облегчения связи между пользователями",
    sendUpdates: "Отправки вам важных обновлений и уведомлений об услуге",
    ensureSecurity: "Обеспечения безопасности нашей платформы",
    informationSharing: "3. Совместное использование информации",
    informationSharingText:
      "Мы не продаем вашу личную информацию третьим лицам. Мы можем делиться вашей информацией только в следующих случаях:",
    withConsent: "С вашего согласия или по вашему указанию",
    withOtherUsers:
      "С другими пользователями в каналах, к которым вы присоединяетесь (ваше имя пользователя и сообщения)",
    complyLegal: "Для соответствия юридическим обязательствам или защиты прав",
    serviceProviders:
      "С поставщиками услуг, которые помогают нашей деятельности",
    dataSecurity: "4. Безопасность данных",
    dataSecurityText:
      "Мы применяем надлежащие меры безопасности для защиты вашей личной информации от несанкционированного доступа, изменения или уничтожения. Однако ни один метод передачи через Интернет не является 100% безопасным.",
    yourRights: "5. Ваши права",
    yourRightsText: "У вас есть право:",
    accessUpdate: "Получить доступ и обновить вашу личную информацию",
    deleteAccount: "Удалить вашу учетную запись и связанные данные",
    optOutPromo: "Отказаться от рекламных коммуникаций",
    exportData: "Экспортировать ваши данные из нашей услуги",
    dataRetention: "6. Хранение данных",
    dataRetentionText:
      "Мы сохраняем вашу личную информацию до тех пор, пока ваша учетная запись активна или по мере необходимости для предоставления наших услуг. Вы можете запросить удаление учетной записи в любое время, что удалит ваши личные данные из наших систем.",
    childrenPrivacy: "7. Конфиденциальность детей",
    childrenPrivacyText:
      "Blabber не предназначен для детей младше 13 лет. Мы не сознательно собираем личную информацию детей младше 13 лет. Если мы узнаем, что собрали такую информацию, мы немедленно ее удалим.",
    contactUs: "8. Свяжитесь с нами",
    contactUsText:
      "Если у вас есть вопросы об этой Политике конфиденциальности, пожалуйста, свяжитесь с нами по адресу blabber.co.info@gmail.com",
    iUnderstand: "Я согласен",
    termsOfService: "Условия обслуживания",
  },
  md: {
    privacyPolicy: "Politica de confidențialitate",
    lastUpdated: "Ultima actualizare:",
    informationWeCollect: "1. Informații pe care le colectăm",
    informationWeCollectText:
      "Colectăm informații pe care le furnizați direct nouă, inclusiv:",
    accountInformation: "Informații de cont (nume utilizator, email, parolă)",
    profileInformation: "Informații profil și preferințe",
    messagesContent: "Mesaje și conținut pe care le postați în canale",
    technicalInformation:
      "Informații tehnice despre dispozitivul și conexiunea dumneavoastră",
    howWeUseInformation: "2. Cum utilizăm informațiile dumneavoastră",
    howWeUseInformationText: "Folosim informațiile colectate pentru a:",
    provideServices: "Furniza, menține și îmbunătăți serviciile noastre",
    createManageAccount: "Crea și gestiona contul dumneavoastră",
    facilitateCommunication: "Facilita comunicarea între utilizatori",
    sendUpdates:
      "Vă trimite actualizări și notificări importante ale serviciului",
    ensureSecurity: "Asigura securitatea și siguranța platformei noastre",
    informationSharing: "3. Partajarea informațiilor",
    informationSharingText:
      "Nu vândem informațiile dumneavoastră personale terților. Kami pot partaja informațiile dumneavoastră doar în următoarele circumstanțe:",
    withConsent:
      "Cu consimțământul dumneavoastră sau la direcția dumneavoastră",
    withOtherUsers:
      "Cu alți utilizatori din canalele la care vă alăturați (numele dumneavoastră de utilizator și mesajele)",
    complyLegal:
      "Pentru a respecta obligațiile juridice sau proteja drepturile",
    serviceProviders:
      "Cu furnizorii de servicii care ajută operațiunile noastre",
    dataSecurity: "4. Securitatea datelor",
    dataSecurityText:
      "Implementam măsuri de securitate adecvate pentru a vă proteja informațiile personale împotriva accesului, alterării sau distrugerii neautorizate. Cu toate acestea, nicio metodă de transmisie pe internet nu este 100% sigură.",
    yourRights: "5. Drepturile dumneavoastră",
    yourRightsText: "Aveți dreptul să:",
    accessUpdate:
      "Accesati și actualizati informațiile dumneavoastră personale",
    deleteAccount: "Ștergeți contul și datele asociate",
    optOutPromo: "Renunțați la comunicările promiționale",
    exportData: "Exportați datele dumneavoastră din serviciul nostru",
    dataRetention: "6. Retenția datelor",
    dataRetentionText:
      "Reținemm informațiile dumneavoastră personale atât timp cât contul dumneavoastră este activ sau după cum este necesar pentru a furniza serviciile noastre. Puteți solicita ștergerea contului oricând, ceea ce va elimina datele dumneavoastră personale din sistemele noastre.",
    childrenPrivacy: "7. Confidențialitatea copiilor",
    childrenPrivacyText:
      "Blabber nu este destinat copiilor sub 13 ani. Nu colectăm în mod intenționat informații personale de la copiii sub 13 ani. Dacă aflăm că am colectat asemenea informații, le vom șterge imediat.",
    contactUs: "8. Contactați-ne",
    contactUsText:
      "Dacă aveți întrebări despre această Politică de confidențialitate, vă rugăm să ne contactați la blabber.co.info@gmail.com",
    iUnderstand: "Înțeleg",
    termsOfService: "Condiții de utilizare",
  },
  es: {
    privacyPolicy: "Política de Privacidad",
    lastUpdated: "Última actualización:",
    informationWeCollect: "1. Información que Recopilamos",
    informationWeCollectText:
      "Recopilamos información que nos proporcionas directamente, incluyendo:",
    accountInformation: "Información de la cuenta (usuario, email, contraseña)",
    profileInformation: "Información del perfil y preferencias",
    messagesContent: "Mensajes y contenido que publicas en los canales",
    technicalInformation: "Información técnica sobre tu dispositivo y conexión",
    howWeUseInformation: "2. Cómo Utilizamos tu Información",
    howWeUseInformationText: "Utilizamos la información que recopilamos para:",
    provideServices: "Proporcionar, mantener y mejorar nuestros servicios",
    createManageAccount: "Crear y gestionar tu cuenta",
    facilitateCommunication: "Facilitar la comunicación entre usuarios",
    sendUpdates:
      "Enviarte actualizaciones importantes y notificaciones del servicio",
    ensureSecurity: "Garantizar la seguridad de nuestra plataforma",
    informationSharing: "3. Compartir Información",
    informationSharingText:
      "No vendemos tu información personal a terceros. Podemos compartir tu información solo en las siguientes circunstancias:",
    withConsent: "Con tu consentimiento o a tu dirección",
    withOtherUsers:
      "Con otros usuarios en canales que te unes (tu nombre de usuario y mensajes)",
    complyLegal: "Para cumplir con obligaciones legales o proteger derechos",
    serviceProviders:
      "Con proveedores de servicios que asisten nuestras operaciones",
    dataSecurity: "4. Seguridad de Datos",
    dataSecurityText:
      "Implementamos medidas de seguridad apropiadas para proteger tu información personal contra acceso, alteración o destrucción no autorizados. Sin embargo, ningún método de transmisión por internet es 100% seguro.",
    yourRights: "5. Tus Derechos",
    yourRightsText: "Tienes derecho a:",
    accessUpdate: "Acceder y actualizar tu información personal",
    deleteAccount: "Eliminar tu cuenta y datos asociados",
    optOutPromo: "Excluirte de comunicaciones promocionales",
    exportData: "Exportar tus datos de nuestro servicio",
    dataRetention: "6. Retención de Datos",
    dataRetentionText:
      "Retenemos tu información personal mientras tu cuenta esté activa o según sea necesario para proporcionar nuestros servicios. Puedes solicitar la eliminación de la cuenta en cualquier momento, lo que eliminará tus datos personales de nuestros sistemas.",
    childrenPrivacy: "7. Privacidad de los Niños",
    childrenPrivacyText:
      "Blabber no está destinado a niños menores de 13 años. No recopilamos conscientemente información personal de niños menores de 13 años. Si nos enteramos de que hemos recopilado dicha información, la eliminaremos inmediatamente.",
    contactUs: "8. Contáctanos",
    contactUsText:
      "Si tienes alguna pregunta sobre esta Política de Privacidad, por favor contáctanos en blabber.co.info@gmail.com",
    iUnderstand: "Entiendo",
    termsOfService: "Términos de Servicio",
  },
  fr: {
    privacyPolicy: "Politique de Confidentialité",
    lastUpdated: "Dernière mise à jour :",
    informationWeCollect: "1. Informations que nous collectons",
    informationWeCollectText:
      "Nous collectons les informations que vous nous fournissez directement, y compris :",
    accountInformation:
      "Informations du compte (nom d'utilisateur, email, mot de passe)",
    profileInformation: "Informations du profil et préférences",
    messagesContent: "Messages et contenu que vous publiez dans les canaux",
    technicalInformation:
      "Informations techniques sur votre appareil et connexion",
    howWeUseInformation: "2. Comment nous utilisons vos informations",
    howWeUseInformationText:
      "Nous utilisons les informations collectées pour :",
    provideServices: "Fournir, maintenir et améliorer nos services",
    createManageAccount: "Créer et gérer votre compte",
    facilitateCommunication:
      "Faciliter la communication entre les utilisateurs",
    sendUpdates:
      "Vous envoyer des mises à jour importantes et notifications du service",
    ensureSecurity: "Assurer la sécurité de notre plateforme",
    informationSharing: "3. Partage d'informations",
    informationSharingText:
      "Nous ne vendons pas vos informations personnelles à des tiers. Nous pouvons partager vos informations uniquement dans les circonstances suivantes :",
    withConsent: "Avec votre consentement ou à votre direction",
    withOtherUsers:
      "Avec d'autres utilisateurs dans les canaux que vous rejoignez (votre nom d'utilisateur et messages)",
    complyLegal:
      "Pour se conformer aux obligations légales ou protéger les droits",
    serviceProviders:
      "Avec les prestataires de services qui assistent nos opérations",
    dataSecurity: "4. Sécurité des données",
    dataSecurityText:
      "Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles contre l'accès, l'altération ou la destruction non autorisés. Cependant, aucune méthode de transmission sur Internet n'est 100% sûre.",
    yourRights: "5. Vos droits",
    yourRightsText: "Vous avez le droit de :",
    accessUpdate: "Accéder et mettre à jour vos informations personnelles",
    deleteAccount: "Supprimer votre compte et les données associées",
    optOutPromo: "Vous désinscrire des communications promotionnelles",
    exportData: "Exporter vos données de notre service",
    dataRetention: "6. Conservation des données",
    dataRetentionText:
      "Nous conservons vos informations personnelles aussi longtemps que votre compte est actif ou selon les besoins pour fournir nos services. Vous pouvez demander la suppression du compte à tout moment, ce qui supprimera vos données personnelles de nos systèmes.",
    childrenPrivacy: "7. Confidentialité des enfants",
    childrenPrivacyText:
      "Blabber n'est pas destiné aux enfants de moins de 13 ans. Nous ne collectons pas sciemment d'informations personnelles d'enfants de moins de 13 ans. Si nous apprenons que nous avons collecté de telles informations, nous les supprimerons immédiatement.",
    contactUs: "8. Contactez-nous",
    contactUsText:
      "Si vous avez des questions concernant cette Politique de Confidentialité, veuillez nous contacter à blabber.co.info@gmail.com",
    iUnderstand: "Je comprends",
    termsOfService: "Conditions d'Utilisation",
  },
  de: {
    privacyPolicy: "Datenschutzrichtlinie",
    lastUpdated: "Zuletzt aktualisiert:",
    informationWeCollect: "1. Informationen, die wir sammeln",
    informationWeCollectText:
      "Wir sammeln Informationen, die Sie uns direkt zur Verfügung stellen, einschließlich:",
    accountInformation: "Kontoinformationen (Benutzername, E-Mail, Passwort)",
    profileInformation: "Profilinformationen und Präferenzen",
    messagesContent: "Nachrichten und Inhalte, die Sie in Kanälen posten",
    technicalInformation:
      "Technische Informationen über Ihr Gerät und Verbindung",
    howWeUseInformation: "2. Wie wir Ihre Informationen verwenden",
    howWeUseInformationText: "Wir verwenden die gesammelten Informationen, um:",
    provideServices:
      "Unsere Dienste bereitzustellen, zu erhalten und zu verbessern",
    createManageAccount: "Ihr Konto zu erstellen und zu verwalten",
    facilitateCommunication: "Kommunikation zwischen Benutzern zu erleichtern",
    sendUpdates:
      "Ihnen wichtige Dienstupdates und Benachrichtigungen zu senden",
    ensureSecurity: "Die Sicherheit unserer Plattform zu gewährleisten",
    informationSharing: "3. Informationsweitergabe",
    informationSharingText:
      "Wir verkaufen Ihre persönlichen Daten nicht an Dritte. Wir können Ihre Informationen nur in folgenden Umständen teilen:",
    withConsent: "Mit Ihrer Zustimmung oder auf Ihre Anweisung",
    withOtherUsers:
      "Mit anderen Benutzern in Kanälen, denen Sie beitreten (Ihr Benutzername und Nachrichten)",
    complyLegal:
      "Um gesetzlichen Verpflichtungen nachzukommen oder Rechte zu schützen",
    serviceProviders: "Mit Dienstleistern, die unseren Betrieb unterstützen",
    dataSecurity: "4. Datensicherheit",
    dataSecurityText:
      "Wir implementieren angemessene Sicherheitsmaßnahmen, um Ihre persönlichen Daten vor unbefugtem Zugriff, Veränderung oder Zerstörung zu schützen. Allerdings ist keine Übertragungsmethode über das Internet 100% sicher.",
    yourRights: "5. Ihre Rechte",
    yourRightsText: "Sie haben das Recht zu:",
    accessUpdate:
      "Auf Ihre persönlichen Daten zuzugreifen und sie zu aktualisieren",
    deleteAccount: "Ihr Konto und zugehörige Daten zu löschen",
    optOutPromo: "Werbe-Kommunikationen abzubestellen",
    exportData: "Ihre Daten aus unserem Dienst zu exportieren",
    dataRetention: "6. Datenspeicherung",
    dataRetentionText:
      "Wir bewahren Ihre persönlichen Daten so lange auf, wie Ihr Konto aktiv ist oder wie nötig, um unsere Dienste zu erbringen. Sie können jederzeit die Kontolöschung beantragen, was Ihre persönlichen Daten aus unseren Systemen entfernt.",
    childrenPrivacy: "7. Datenschutz für Kinder",
    childrenPrivacyText:
      "Blabber ist nicht für Kinder unter 13 Jahren bestimmt. Wir sammeln nicht wissentlich persönliche Informationen von Kindern unter 13 Jahren. Wenn wir erfahren, dass wir solche Informationen gesammelt haben, werden wir sie sofort löschen.",
    contactUs: "8. Kontaktieren Sie uns",
    contactUsText:
      "Wenn Sie Fragen zu dieser Datenschutzrichtlinie haben, kontaktieren Sie uns bitte unter blabber.co.info@gmail.com",
    iUnderstand: "Ich verstehe",
    termsOfService: "Nutzungsbedingungen",
  },
};
