export type LoginTranslationKeys = {
  welcomeBack: string;
  happyToSeeYouAgain: string;
  emailAddress: string;
  password: string;
  forgotPassword: string;
  login: string;
  loginTon: string;
  loading: string;
  doYouNeedAccount: string;
  createAccount: string;
  createAnAccount: string;
  username: string;
  dateOfBirth: string;
  mustBe13YearsOld: string;
  alreadyHaveAccount: string;
  iHaveRead: string;
  termsOfService: string;
  and: string;
  privacyPolicy: string;
  creating: string;
  forgotPasswordTitle: string;
  resetInstructions: string;
  cancel: string;
  sendInstructions: string;
  sending: string;
  enterEmail: string;
  invalidEmail: string;
  pleaseEnterBoth: string;
  allFieldsRequired: string;
  passwordMinRequirements: string;
  usernameRequirements: string;
  resetInstructionsSent: string;
  failedToSendInstructions: string;
  createAccountButton: string;
  continueWithGoogle: string;
  signUpWithGoogle: string;
  or: string;
};

export type LoginLanguageCode = "us" | "gr" | "ru" | "md" | "es" | "fr" | "de";

export const loginTranslations: Record<
  LoginLanguageCode,
  LoginTranslationKeys
> = {
  us: {
    signUpWithGoogle: "Sign up with Google",
    continueWithGoogle: "Continue with Google",
    or: "OR",
    welcomeBack: "Welcome back!",
    happyToSeeYouAgain: "We are very happy to see you again!",
    emailAddress: "Email Address *",
    password: "Password *",
    forgotPassword: "Forgot Your Password?",
    login: "Login",
    loginTon: "Login",
    loading: "Loading...",
    doYouNeedAccount: "Do you need an account?",
    createAccount: "Create an Account",
    createAccountButton: "Create an Account",
    createAnAccount: "Create an Account",
    username: "Username *",
    dateOfBirth: "Date of Birth *",
    mustBe13YearsOld: "You must be at least 13 years old to register",
    alreadyHaveAccount: "Already have an account?",
    iHaveRead: "I have read and agree to the Blabber",
    termsOfService: "Terms of Service",
    and: "and",
    privacyPolicy: "Privacy Policy",
    creating: "Creating...",
    forgotPasswordTitle: "Forgot Password",
    resetInstructions:
      "Enter your email address and we'll send you instructions to reset your password.",
    cancel: "Cancel",
    sendInstructions: "Send Instructions",
    sending: "Sending...",
    enterEmail: "Email Address *",
    invalidEmail: "Invalid email format",
    pleaseEnterBoth: "Please enter both email and password",
    allFieldsRequired: "Please fill in all required fields",
    passwordMinRequirements:
      "Password must be at least 6 characters with letters and numbers",
    usernameRequirements:
      "Username must be 4-20 characters and can only contain letters, numbers, and underscores",
    resetInstructionsSent: "Reset instructions sent successfully",
    failedToSendInstructions: "Failed to send reset instructions",
  },
  gr: {
    signUpWithGoogle: "Εγγραφή με Google",
    continueWithGoogle: "Συνέχεια με Google",
    or: "Ή",
    welcomeBack: "Καλώς ήρθες πίσω!",
    happyToSeeYouAgain: "Είμαστε πολύ χαρούμενοι που σε ξαναβλέπουμε!",
    emailAddress: "Διεύθυνση Email *",
    password: "Κωδικός *",
    forgotPassword: "Ξέχασες τον Κωδικό σου;",
    login: "Συνδεση",
    loginTon: "Σύνδεση",
    loading: "Φορτωση...",
    doYouNeedAccount: "Χρειάζεσαι ένα λογαριασμό;",
    createAccount: "Δημιουργία Λογαριασμού",
    createAccountButton: "Δημιουργια Λογαριασμου",
    createAnAccount: "Δημιουργία Λογαριασμού",
    username: "Όνομα χρήστη *",
    dateOfBirth: "Ημερομηνία Γέννησης *",
    mustBe13YearsOld: "Πρέπει να είσαι τουλάχιστον 13 ετών για να εγγραφείς",
    alreadyHaveAccount: "Έχεις ήδη ένα λογαριασμό;",
    iHaveRead: "Έχω διαβάσει και συμφωνώ με τους",
    termsOfService: "Όρους Υπηρεσίας",
    and: "και",
    privacyPolicy: "Πολιτική Ιδιωτικότητας",
    creating: "Δημιουργία...",
    forgotPasswordTitle: "Ξέχασες τον Κωδικό",
    resetInstructions:
      "Εισάγετε την διεύθυνση ηλεκτρονικού ταχυδρομείου σας και θα σας στείλουμε οδηγίες για επαναφορά του κωδικού σας.",
    cancel: "Ακυρωση",
    sendInstructions: "Αποστολη Οδηγιων",
    sending: "Αποστολή...",
    enterEmail: "Διεύθυνση Email *",
    invalidEmail: "Μη έγκυρη μορφή email",
    pleaseEnterBoth: "Παρακαλώ εισάγετε ηλεκτρονικό ταχυδρομείο και κωδικό",
    allFieldsRequired: "Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία",
    passwordMinRequirements:
      "Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες με γράμματα και αριθμούς",
    usernameRequirements:
      "Το όνομα χρήστη πρέπει να είναι 4-20 χαρακτήρες και μπορεί να περιέχει μόνο γράμματα, αριθμούς και κάτω παύλες",
    resetInstructionsSent: "Οι οδηγίες επαναφοράς στάλθησαν με επιτυχία",
    failedToSendInstructions: "Αποτυχία αποστολής οδηγιών επαναφοράς",
  },
  ru: {
    signUpWithGoogle: "Зарегистрироваться через Google",
    continueWithGoogle: "Продолжить с Google",
    or: "Или",
    welcomeBack: "Добро пожаловать обратно!",
    happyToSeeYouAgain: "Мы очень рады вас видеть снова!",
    emailAddress: "Адрес электронной почты *",
    password: "Пароль *",
    forgotPassword: "Забыли пароль?",
    login: "Вход",
    loginTon: "Вход",
    loading: "Загрузка...",
    doYouNeedAccount: "Вам нужна учетная запись?",
    createAccount: "Создать учетную запись",
    createAccountButton: "Создать учетную запись",
    createAnAccount: "Создать учетную запись",
    username: "Имя пользователя *",
    dateOfBirth: "Дата рождения *",
    mustBe13YearsOld: "Вы должны быть не моложе 13 лет для регистрации",
    alreadyHaveAccount: "Уже есть учетная запись?",
    iHaveRead: "Я прочитал и согласен с",
    termsOfService: "Условиями обслуживания",
    and: "и",
    privacyPolicy: "Политикой конфиденциальности",
    creating: "Создание...",
    forgotPasswordTitle: "Забыли пароль",
    resetInstructions:
      "Введите свой адрес электронной почты, и мы отправим вам инструкции по сбросу пароля.",
    cancel: "Отмена",
    sendInstructions: "Отправить инструкции",
    sending: "Отправка...",
    enterEmail: "Адрес электронной почты *",
    invalidEmail: "Неверный формат электронной почты",
    pleaseEnterBoth: "Пожалуйста, введите электронную почту и пароль",
    allFieldsRequired: "Пожалуйста, заполните все обязательные поля",
    passwordMinRequirements:
      "Пароль должен содержать не менее 6 символов с буквами и цифрами",
    usernameRequirements:
      "Имя пользователя должно быть 4-20 символов и может содержать только буквы, цифры и подчеркивания",
    resetInstructionsSent: "Инструкции по сбросу успешно отправлены",
    failedToSendInstructions: "Ошибка отправки инструкций по сбросу",
  },
  md: {
    signUpWithGoogle: "Înregistrare cu Google",
    continueWithGoogle: "Continuă cu Google",
    or: "Sau",
    welcomeBack: "Bine ai revenit!",
    happyToSeeYouAgain: "Suntem foarte bucuroși să te revenim!",
    emailAddress: "Adresă de email *",
    password: "Parolă *",
    forgotPassword: "Ai uitat parola?",
    login: "Conectare",
    loginTon: "Conectare",
    loading: "Se încarcă...",
    doYouNeedAccount: "Ai nevoie de un cont?",
    createAccount: "Creează un cont",
    createAccountButton: "Creează un cont",
    createAnAccount: "Creează un cont",
    username: "Nume utilizator *",
    dateOfBirth: "Data nașterii *",
    mustBe13YearsOld: "Trebuie să ai cel puțin 13 ani pentru a te înregistra",
    alreadyHaveAccount: "Ai deja un cont?",
    iHaveRead: "Am citit și sunt de acord cu",
    termsOfService: "Termenii de utilizare",
    and: "și",
    privacyPolicy: "Politica de confidențialitate",
    creating: "Se creează...",
    forgotPasswordTitle: "Ai uitat parola",
    resetInstructions:
      "Introduceți adresa de e-mail și vă vom trimite instrucțiuni pentru resetarea parolei.",
    cancel: "Anulare",
    sendInstructions: "Trimite instrucțiuni",
    sending: "Se trimite...",
    enterEmail: "Adresă de email *",
    invalidEmail: "Format de e-mail nevalid",
    pleaseEnterBoth: "Vă rugăm să introduceți e-mailul și parola",
    allFieldsRequired: "Vă rugăm să completați toate câmpurile obligatorii",
    passwordMinRequirements:
      "Parola trebuie să aibă cel puțin 6 caractere cu litere și numere",
    usernameRequirements:
      "Numele de utilizator trebuie să aibă 4-20 de caractere și poate conține doar litere, numere și sublinieri",
    resetInstructionsSent: "Instrucțiuni de resetare trimise cu succes",
    failedToSendInstructions:
      "Eroare la trimiterea instrucțiunilor de resetare",
  },
  es: {
    signUpWithGoogle: "Registrarse con Google",
    continueWithGoogle: "Continuar con Google",
    or: "O",
    welcomeBack: "¡Bienvenido de nuevo!",
    happyToSeeYouAgain: "¡Estamos muy contentos de verte de nuevo!",
    emailAddress: "Dirección de correo *",
    password: "Contraseña *",
    forgotPassword: "¿Olvidaste tu contraseña?",
    login: "Iniciar sesión",
    loginTon: "Iniciar sesión",
    loading: "Cargando...",
    doYouNeedAccount: "¿Necesitas una cuenta?",
    createAccount: "Crear una cuenta",
    createAccountButton: "Crear una cuenta",
    createAnAccount: "Crear una cuenta",
    username: "Nombre de usuario *",
    dateOfBirth: "Fecha de nacimiento *",
    mustBe13YearsOld: "Debes tener al menos 13 años para registrarte",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    iHaveRead: "He leído y acepto los",
    termsOfService: "Términos de servicio",
    and: "y",
    privacyPolicy: "Política de privacidad",
    creating: "Creando...",
    forgotPasswordTitle: "Olvidé mi contraseña",
    resetInstructions:
      "Ingresa tu dirección de correo y te enviaremos instrucciones para restablecer tu contraseña.",
    cancel: "Cancelar",
    sendInstructions: "Enviar instrucciones",
    sending: "Enviando...",
    enterEmail: "Dirección de correo *",
    invalidEmail: "Formato de correo inválido",
    pleaseEnterBoth: "Por favor ingresa correo y contraseña",
    allFieldsRequired: "Por favor completa todos los campos obligatorios",
    passwordMinRequirements:
      "La contraseña debe tener al menos 6 caracteres con letras y números",
    usernameRequirements:
      "El nombre de usuario debe tener 4-20 caracteres y solo puede contener letras, números y guiones bajos",
    resetInstructionsSent:
      "Instrucciones de restablecimiento enviadas con éxito",
    failedToSendInstructions:
      "Error al enviar instrucciones de restablecimiento",
  },
  fr: {
    signUpWithGoogle: "S'inscrire avec Google",
    continueWithGoogle: "Continuer avec Google",
    or: "OU",
    welcomeBack: "Bon retour !",
    happyToSeeYouAgain: "Nous sommes très heureux de vous revoir !",
    emailAddress: "Adresse e-mail *",
    password: "Mot de passe *",
    forgotPassword: "Mot de passe oublié ?",
    login: "Connexion",
    loginTon: "Connexion",
    loading: "Chargement...",
    doYouNeedAccount: "Vous avez besoin d'un compte ?",
    createAccount: "Créer un compte",
    createAccountButton: "Créer un compte",
    createAnAccount: "Créer un compte",
    username: "Nom d'utilisateur *",
    dateOfBirth: "Date de naissance *",
    mustBe13YearsOld: "Vous devez avoir au moins 13 ans pour vous inscrire",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    iHaveRead: "J'ai lu et j'accepte les",
    termsOfService: "Conditions d'utilisation",
    and: "et",
    privacyPolicy: "Politique de confidentialité",
    creating: "Création...",
    forgotPasswordTitle: "Mot de passe oublié",
    resetInstructions:
      "Entrez votre adresse e-mail et nous vous enverrons des instructions pour réinitialiser votre mot de passe.",
    cancel: "Annuler",
    sendInstructions: "Envoyer les instructions",
    sending: "Envoi...",
    enterEmail: "Adresse e-mail *",
    invalidEmail: "Format d'e-mail invalide",
    pleaseEnterBoth: "Veuillez saisir l'e-mail et le mot de passe",
    allFieldsRequired: "Veuillez remplir tous les champs obligatoires",
    passwordMinRequirements:
      "Le mot de passe doit contenir au moins 6 caractères avec des lettres et des chiffres",
    usernameRequirements:
      "Le nom d'utilisateur doit comporter 4-20 caractères et ne peut contenir que des lettres, des chiffres et des underscores",
    resetInstructionsSent:
      "Instructions de réinitialisation envoyées avec succès",
    failedToSendInstructions:
      "Échec de l'envoi des instructions de réinitialisation",
  },
  de: {
    signUpWithGoogle: "Mit Google registrieren",
    continueWithGoogle: "Mit Google fortfahren",
    or: "ODER",
    welcomeBack: "Willkommen zurück!",
    happyToSeeYouAgain: "Wir freuen uns sehr, Sie wiederzusehen!",
    emailAddress: "E-Mail-Adresse *",
    password: "Passwort *",
    forgotPassword: "Passwort vergessen?",
    login: "Anmelden",
    loginTon: "Anmelden",
    loading: "Lädt...",
    doYouNeedAccount: "Benötigen Sie ein Konto?",
    createAccount: "Konto erstellen",
    createAccountButton: "Konto erstellen",
    createAnAccount: "Konto erstellen",
    username: "Benutzername *",
    dateOfBirth: "Geburtsdatum *",
    mustBe13YearsOld:
      "Sie müssen mindestens 13 Jahre alt sein, um sich zu registrieren",
    alreadyHaveAccount: "Haben Sie bereits ein Konto?",
    iHaveRead: "Ich habe die gelesen und stimme den zu",
    termsOfService: "Nutzungsbedingungen",
    and: "und",
    privacyPolicy: "Datenschutzrichtlinie",
    creating: "Wird erstellt...",
    forgotPasswordTitle: "Passwort vergessen",
    resetInstructions:
      "Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen Anweisungen zum Zurücksetzen Ihres Passworts.",
    cancel: "Abbrechen",
    sendInstructions: "Anweisungen senden",
    sending: "Wird gesendet...",
    enterEmail: "E-Mail-Adresse *",
    invalidEmail: "Ungültiges E-Mail-Format",
    pleaseEnterBoth: "Bitte geben Sie E-Mail und Passwort ein",
    allFieldsRequired: "Bitte füllen Sie alle erforderlichen Felder aus",
    passwordMinRequirements:
      "Das Passwort muss mindestens 6 Zeichen mit Buchstaben und Zahlen enthalten",
    usernameRequirements:
      "Der Benutzername muss 4-20 Zeichen lang sein und darf nur Buchstaben, Zahlen und Unterstriche enthalten",
    resetInstructionsSent: "Anweisungen zum Zurücksetzen erfolgreich gesendet",
    failedToSendInstructions: "Fehler beim Senden der Zurücksetzanweisungen",
  },
};
