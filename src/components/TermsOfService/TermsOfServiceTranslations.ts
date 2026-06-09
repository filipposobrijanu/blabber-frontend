export type TermsTranslationKeys = {
  termsOfService: string;
  lastUpdated: string;
  acceptanceOfTerms: string;
  acceptanceOfTermsText: string;
  userAccounts: string;
  userAccountsText: string;
  acceptableUse: string;
  acceptableUseText: string;
  harassThreaten: string;
  shareIllegal: string;
  impersonate: string;
  distributeSpam: string;
  violateLaws: string;
  contentOwnership: string;
  contentOwnershipText: string;
  privacy: string;
  privacyText: string;
  termination: string;
  terminationText: string;
  changesTerms: string;
  changesTermsText: string;
  contact: string;
  contactText: string;
  iUnderstand: string;
  privacyPolicy: string;
};

export type TermsLanguageCode = "us" | "gr" | "ru" | "md" | "es" | "fr" | "de";

export const termsTranslations: Record<
  TermsLanguageCode,
  TermsTranslationKeys
> = {
  us: {
    termsOfService: "Terms of Service",
    lastUpdated: "Last updated:",
    acceptanceOfTerms: "1. Acceptance of Terms",
    acceptanceOfTermsText:
      "By accessing or using Blabber, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our service.",
    userAccounts: "2. User Accounts",
    userAccountsText:
      "You must be at least 13 years old to use Blabber. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
    acceptableUse: "3. Acceptable Use",
    acceptableUseText: "You agree not to use Blabber to:",
    harassThreaten: "Harass, threaten, or intimidate other users",
    shareIllegal: "Share illegal, harmful, or inappropriate content",
    impersonate: "Impersonate others or provide false information",
    distributeSpam: "Distribute spam or malicious software",
    violateLaws: "Violate any applicable laws or regulations",
    contentOwnership: "4. Content Ownership",
    contentOwnershipText:
      "You retain ownership of the content you create and share on Blabber. However, by posting content, you grant us a license to display and distribute that content through our service.",
    privacy: "5. Privacy",
    privacyText:
      "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.",
    termination: "6. Termination",
    terminationText:
      "We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason at our discretion.",
    changesTerms: "7. Changes to Terms",
    changesTermsText:
      "We may update these Terms of Service from time to time. We will notify users of significant changes through our service or via email.",
    contact: "8. Contact",
    contactText:
      "If you have any questions about these Terms, please contact us at blabber.co.info@gmail.com",
    iUnderstand: "I Understand",
    privacyPolicy: "Privacy Policy",
  },
  gr: {
    termsOfService: "Όροι Υπηρεσίας",
    lastUpdated: "Τελευταία ενημέρωση:",
    acceptanceOfTerms: "1. Αποδοχή Όρων",
    acceptanceOfTermsText:
      "Με την πρόσβαση ή χρήση του Blabber, συμφωνείτε να δεσμεύεστε από τους παρόντες Όρους Υπηρεσίας και όλους τους ισχύοντες νόμους και κανονισμούς. Εάν δεν συμφωνείτε με κάποιους από αυτούς τους όρους, απαγορεύεται η χρήση της υπηρεσίας μας.",
    userAccounts: "2. Λογαριασμοί Χρηστών",
    userAccountsText:
      "Πρέπει να έχετε τουλάχιστον 13 ετών για να χρησιμοποιήσετε το Blabber. Είστε υπεύθυνοι για τη διατήρηση της εμπιστευτικότητας των διαπιστευτηρίων του λογαριασμού σας και για όλες τις δραστηριότητες που πραγματοποιούνται υπό το λογαριασμό σας.",
    acceptableUse: "3. Αποδεκτή Χρήση",
    acceptableUseText: "Συμφωνείτε να μην χρησιμοποιείτε το Blabber για:",
    harassThreaten: "Παρενόχληση, απειλή ή εκφοβισμό άλλων χρηστών",
    shareIllegal:
      "Κοινοποίηση παράνομου, επιβλαβούς ή ακατάλληλου περιεχομένου",
    impersonate:
      "Πρόσωπο που προσποιούνται άλλοι ή παρέχουν ψευδείς πληροφορίες",
    distributeSpam: "Διανομή spam ή κακόβουλου λογισμικού",
    violateLaws: "Παραβίαση οποιουδήποτε ισχύοντα νόμου ή κανονισμού",
    contentOwnership: "4. Ιδιοκτησία Περιεχομένου",
    contentOwnershipText:
      "Διατηρείτε την ιδιοκτησία του περιεχομένου που δημιουργείτε και μοιράζεστε στο Blabber. Ωστόσο, δημοσιεύοντας περιεχόμενο, μας παραχωρείτε άδεια να εμφανίζουμε και να διανέμουμε αυτό το περιεχόμενο μέσω της υπηρεσίας μας.",
    privacy: "5. Ιδιωτικότητα",
    privacyText:
      "Η ιδιωτικότητά σας είναι σημαντική για μας. Παρακαλώ ελέγξτε την Πολιτική Ιδιωτικότητάς μας για να κατανοήσετε πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τις προσωπικές σας πληροφορίες.",
    termination: "6. Τερματισμός",
    terminationText:
      "Διατηρούμε το δικαίωμα να αναστείλουμε ή να τερματίσουμε το λογαριασμό σας ανά πάσα στιγμή για παραβιάσεις αυτών των όρων ή για οποιονδήποτε άλλο λόγο κατά την κρίση μας.",
    changesTerms: "7. Αλλαγές Όρων",
    changesTermsText:
      "Ενδέχεται να ενημερώσουμε αυτούς τους Όρους Υπηρεσίας κατά καιρούς. Θα ενημερώσουμε τους χρήστες σχετικά με σημαντικές αλλαγές μέσω της υπηρεσίας μας ή μέσω ηλεκτρονικού ταχυδρομείου.",
    contact: "8. Επικοινωνία",
    contactText:
      "Εάν έχετε ερωτήσεις σχετικά με αυτούς τους Όρους, επικοινωνήστε μαζί μας στο blabber.co.info@gmail.com",
    iUnderstand: "Κατανοω",
    privacyPolicy: "Πολιτικh Ιδιωτικoτητας",
  },
  ru: {
    termsOfService: "Условия обслуживания",
    lastUpdated: "Последнее обновление:",
    acceptanceOfTerms: "1. Принятие условий",
    acceptanceOfTermsText:
      "Используя Blabber, вы соглашаетесь соблюдать эти Условия обслуживания и все применимые законы и правила. Если вы не согласны с какими-либо из этих условий, вам запрещено использовать нашу услугу.",
    userAccounts: "2. Пользовательские учетные записи",
    userAccountsText:
      "Вы должны быть не моложе 13 лет, чтобы использовать Blabber. Вы несете ответственность за сохранение конфиденциальности ваших учетных данных и за все действия, которые происходят под вашей учетной записью.",
    acceptableUse: "3. Допустимое использование",
    acceptableUseText: "Вы соглашаетесь не использовать Blabber для:",
    harassThreaten:
      "Преследование, угрозы или запугивание других пользователей",
    shareIllegal:
      "Распространение незаконного, вредоносного или неуместного контента",
    impersonate: "Выдача себя за других или предоставление ложной информации",
    distributeSpam: "Распространение спама или вредоносного ПО",
    violateLaws: "Нарушение любых применимых законов или правил",
    contentOwnership: "4. Права собственности на контент",
    contentOwnershipText:
      "Вы сохраняете право собственности на контент, который создаете и делитесь на Blabber. Однако, публикуя контент, вы предоставляете нам лицензию на отображение и распространение этого контента через нашу услугу.",
    privacy: "5. Конфиденциальность",
    privacyText:
      "Ваша конфиденциальность для нас важна. Пожалуйста, ознакомьтесь с нашей Политикой конфиденциальности, чтобы узнать, как мы собираем, используем и защищаем вашу личную информацию.",
    termination: "6. Прекращение",
    terminationText:
      "Мы оставляем за собой право в любое время приостановить или закрыть вашу учетную запись за нарушение этих условий или по любой другой причине по нашему усмотрению.",
    changesTerms: "7. Изменения условий",
    changesTermsText:
      "Мы можем обновлять эти Условия обслуживания время от времени. Мы будем уведомлять пользователей о значительных изменениях через нашу услугу или по электронной почте.",
    contact: "8. Контакты",
    contactText:
      "Если у вас есть вопросы об этих Условиях, свяжитесь с нами по адресу blabber.co.info@gmail.com",
    iUnderstand: "Я согласен",
    privacyPolicy: "Политика конфиденциальности",
  },
  md: {
    termsOfService: "Condiții de utilizare",
    lastUpdated: "Ultima actualizare:",
    acceptanceOfTerms: "1. Acceptarea Termenilor",
    acceptanceOfTermsText:
      "Prin accesarea sau utilizarea Blabber, sunteți de acord să respectați aceste Condiții de utilizare și toate legile și reglementările aplicabile. Dacă nu sunteți de acord cu oricare dintre acești termeni, vă este interzis să utilizați serviciul nostru.",
    userAccounts: "2. Conturi de utilizator",
    userAccountsText:
      "Trebuie să aveți cel puțin 13 ani pentru a utiliza Blabber. Sunteți responsabil pentru menținerea confidențialității datelor de acces ale contului dumneavoastră și pentru toate activitățile care se desfășoară sub contul dumneavoastră.",
    acceptableUse: "3. Utilizare Acceptabilă",
    acceptableUseText: "Sunteți de acord să nu utilizați Blabber pentru:",
    harassThreaten: "Hărțuire, amenințare sau intimidare altor utilizatori",
    shareIllegal: "Partajarea conținutului ilegal, dăunător sau inadecvat",
    impersonate: "Impersonare sau furnizare de informații false",
    distributeSpam: "Distribuirea spam-ului sau software-ului malițios",
    violateLaws: "Încălcarea oricărei legi sau reglementări aplicabile",
    contentOwnership: "4. Proprietatea Conținutului",
    contentOwnershipText:
      "Păstrați proprietatea conținutului pe care îl creați și îl partajați pe Blabber. Cu toate acestea, prin postarea de conținut, ne acordați o licență pentru a afișa și distribui acel conținut prin serviciul nostru.",
    privacy: "5. Confidențialitate",
    privacyText:
      "Confidențialitatea dumneavoastră este importantă pentru noi. Vă rugăm să consultați Politica noastră de confidențialitate pentru a înțelege cum colectăm, folosim și protejăm informațiile dumneavoastră personale.",
    termination: "6. Reziliere",
    terminationText:
      "Ne rezervăm dreptul de a suspenda sau rezilia contul dumneavoastră oricând pentru încălcarea acestor termeni sau din orice alt motiv la discreția noastră.",
    changesTerms: "7. Modificări ale Termenilor",
    changesTermsText:
      "Este posibil să actualizez acești Termeni de utilizare din când în când. Vom notifica utilizatorii cu privire la modificări semnificative prin serviciul nostru sau prin e-mail.",
    contact: "8. Contact",
    contactText:
      "Dacă aveți întrebări cu privire la acești Termeni, vă rugăm să ne contactați la blabber.co.info@gmail.com",
    iUnderstand: "Înțeleg",
    privacyPolicy: "Politica de confidențialitate",
  },
  es: {
    termsOfService: "Términos de Servicio",
    lastUpdated: "Última actualización:",
    acceptanceOfTerms: "1. Aceptación de los Términos",
    acceptanceOfTermsText:
      "Al acceder o utilizar Blabber, aceptas quedar vinculado por estos Términos de Servicio y todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos términos, te prohibimos usar nuestro servicio.",
    userAccounts: "2. Cuentas de Usuario",
    userAccountsText:
      "Debes tener al menos 13 años para usar Blabber. Eres responsable de mantener la confidencialidad de tus credenciales de cuenta y de todas las actividades que ocurran bajo tu cuenta.",
    acceptableUse: "3. Uso Aceptable",
    acceptableUseText: "Aceptas no usar Blabber para:",
    harassThreaten: "Acosar, amenazar o intimidar a otros usuarios",
    shareIllegal: "Compartir contenido ilegal, dañino o inapropiado",
    impersonate: "Suplantar a otros o proporcionar información falsa",
    distributeSpam: "Distribuir spam o software malicioso",
    violateLaws: "Violar cualquier ley o regulación aplicable",
    contentOwnership: "4. Propiedad del Contenido",
    contentOwnershipText:
      "Conservas la propiedad del contenido que creas y compartes en Blabber. Sin embargo, al publicar contenido, nos otorgas una licencia para mostrar y distribuir ese contenido a través de nuestro servicio.",
    privacy: "5. Privacidad",
    privacyText:
      "Tu privacidad es importante para nosotros. Por favor, revisa nuestra Política de Privacidad para entender cómo recopilamos, usamos y protegemos tu información personal.",
    termination: "6. Terminación",
    terminationText:
      "Nos reservamos el derecho de suspender o terminar tu cuenta en cualquier momento por violaciones de estos términos o por cualquier otra razón a nuestra discreción.",
    changesTerms: "7. Cambios en los Términos",
    changesTermsText:
      "Podemos actualizar estos Términos de Servicio de vez en cuando. Notificaremos a los usuarios sobre cambios significativos a través de nuestro servicio o por correo electrónico.",
    contact: "8. Contacto",
    contactText:
      "Si tienes alguna pregunta sobre estos Términos, por favor contáctanos en blabber.co.info@gmail.com",
    iUnderstand: "Entiendo",
    privacyPolicy: "Política de Privacidad",
  },
  fr: {
    termsOfService: "Conditions d'Utilisation",
    lastUpdated: "Dernière mise à jour :",
    acceptanceOfTerms: "1. Acceptation des Conditions",
    acceptanceOfTermsText:
      "En accédant ou utilisant Blabber, vous acceptez d'être lié par ces Conditions d'Utilisation et toutes les lois et réglementations applicables. Si vous n'êtes pas d'accord avec l'une de ces conditions, il vous est interdit d'utiliser notre service.",
    userAccounts: "2. Comptes Utilisateur",
    userAccountsText:
      "Vous devez avoir au moins 13 ans pour utiliser Blabber. Vous êtes responsable du maintien de la confidentialité de vos identifiants de compte et de toutes les activités qui se produisent sous votre compte.",
    acceptableUse: "3. Utilisation Acceptable",
    acceptableUseText: "Vous acceptez de ne pas utiliser Blabber pour :",
    harassThreaten: "Harceler, menacer ou intimider d'autres utilisateurs",
    shareIllegal: "Partager du contenu illégal, nuisible ou inapproprié",
    impersonate:
      "Usurper l'identité d'autrui ou fournir de fausses informations",
    distributeSpam: "Distribuer du spam ou des logiciels malveillants",
    violateLaws: "Violer toute loi ou réglementation applicable",
    contentOwnership: "4. Propriété du Contenu",
    contentOwnershipText:
      "Vous conservez la propriété du contenu que vous créez et partagez sur Blabber. Cependant, en publiant du contenu, vous nous accordez une licence pour afficher et distribuer ce contenu via notre service.",
    privacy: "5. Confidentialité",
    privacyText:
      "Votre vie privée est importante pour nous. Veuillez consulter notre Politique de Confidentialité pour comprendre comment nous collectons, utilisons et protégeons vos informations personnelles.",
    termination: "6. Résiliation",
    terminationText:
      "Nous nous réservons le droit de suspendre ou de résilier votre compte à tout moment pour violation de ces conditions ou pour toute autre raison à notre discrétion.",
    changesTerms: "7. Modifications des Conditions",
    changesTermsText:
      "Nous pouvons mettre à jour ces Conditions d'Utilisation de temps à autre. Nous informerons les utilisateurs des changements significatifs via notre service ou par e-mail.",
    contact: "8. Contact",
    contactText:
      "Si vous avez des questions concernant ces Conditions, veuillez nous contacter à blabber.co.info@gmail.com",
    iUnderstand: "Je comprends",
    privacyPolicy: "Politique de Confidentialité",
  },
  de: {
    termsOfService: "Nutzungsbedingungen",
    lastUpdated: "Zuletzt aktualisiert:",
    acceptanceOfTerms: "1. Annahme der Bedingungen",
    acceptanceOfTermsText:
      "Durch den Zugriff auf oder die Nutzung von Blabber erklären Sie sich damit einverstanden, an diese Nutzungsbedingungen und alle anwendbaren Gesetze und Vorschriften gebunden zu sein. Wenn Sie mit einer dieser Bedingungen nicht einverstanden sind, ist es Ihnen untersagt, unseren Dienst zu nutzen.",
    userAccounts: "2. Benutzerkonten",
    userAccountsText:
      "Sie müssen mindestens 13 Jahre alt sein, um Blabber zu nutzen. Sie sind für die Vertraulichkeit Ihrer Kontozugangsdaten und für alle Aktivitäten verantwortlich, die unter Ihrem Konto stattfinden.",
    acceptableUse: "3. Zulässige Nutzung",
    acceptableUseText:
      "Sie erklären sich damit einverstanden, Blabber nicht zu verwenden, um:",
    harassThreaten:
      "Andere Benutzer zu belästigen, zu bedrohen oder einzuschüchtern",
    shareIllegal: "Illegale, schädliche oder unangemessene Inhalte zu teilen",
    impersonate: "Andere zu imitieren oder falsche Informationen anzugeben",
    distributeSpam: "Spam oder bösartige Software zu verbreiten",
    violateLaws: "Geltende Gesetze oder Vorschriften zu verletzen",
    contentOwnership: "4. Inhalteeigentum",
    contentOwnershipText:
      "Sie behalten das Eigentum an den Inhalten, die Sie auf Blabber erstellen und teilen. Durch das Posten von Inhalten räumen Sie uns jedoch eine Lizenz ein, diese Inhalte über unseren Dienst anzuzeigen und zu verteilen.",
    privacy: "5. Datenschutz",
    privacyText:
      "Ihre Privatsphäre ist uns wichtig. Bitte lesen Sie unsere Datenschutzrichtlinie, um zu verstehen, wie wir Ihre persönlichen Daten sammeln, verwenden und schützen.",
    termination: "6. Kündigung",
    terminationText:
      "Wir behalten uns das Recht vor, Ihr Konto jederzeit wegen Verstößen gegen diese Bedingungen oder aus einem anderen Grund nach unserem Ermessen zu sperren oder zu kündigen.",
    changesTerms: "7. Änderungen der Bedingungen",
    changesTermsText:
      "Wir können diese Nutzungsbedingungen von Zeit zu Zeit aktualisieren. Wir werden Benutzer über bedeutende Änderungen über unseren Dienst oder per E-Mail informieren.",
    contact: "8. Kontakt",
    contactText:
      "Wenn Sie Fragen zu diesen Bedingungen haben, kontaktieren Sie uns bitte unter blabber.co.info@gmail.com",
    iUnderstand: "Ich verstehe",
    privacyPolicy: "Datenschutzrichtlinie",
  },
};
