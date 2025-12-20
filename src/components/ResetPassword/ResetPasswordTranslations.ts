// resetPasswordTranslations.ts

// Define the type for Reset Password translation keys
export type ResetPasswordTranslationKeys = {
  resetYourPassword: string;
  enterNewPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  resetPassword: string;
  resetting: string;
  backToLogin: string;
  invalidResetLink: string;
  invalidResetLinkMessage: string;
  goToLogin: string;
  passwordsDontMatch: string;
  invalidResetLinkError: string;
  passwordResetFailed: string;
  passwordResetSuccessfully: string;
  redirectingToLogin: string;
};

// Define the type for language codes
export type ResetPasswordLanguageCode =
  | "us"
  | "gr"
  | "ru"
  | "md"
  | "es"
  | "fr"
  | "de";

// Define the translations object with proper typing
export const resetPasswordTranslations: Record<
  ResetPasswordLanguageCode,
  ResetPasswordTranslationKeys
> = {
  us: {
    resetYourPassword: "Reset Your Password",
    enterNewPassword: "Enter your new password below",
    newPassword: "New Password *",
    confirmNewPassword: "Confirm New Password *",
    resetPassword: "Reset Password",
    resetting: "Resetting...",
    backToLogin: "Back to Login",
    invalidResetLink: "Invalid Reset Link",
    invalidResetLinkMessage:
      "The password reset link is invalid or has expired.",
    goToLogin: "Go to Login",
    passwordsDontMatch: "Passwords don't match",
    invalidResetLinkError: "Invalid reset link",
    passwordResetFailed: "Password reset failed",
    passwordResetSuccessfully:
      "✅ Password reset successfully! Redirecting to login...",
    redirectingToLogin: "Redirecting to login...",
  },
  gr: {
    resetYourPassword: "Επαναφέρετε τον κωδικό σας",
    enterNewPassword: "Εισάγετε τον νέο κωδικό σας παρακάτω",
    newPassword: "Νέος κωδικός *",
    confirmNewPassword: "Επιβεβαιώστε τον νέο κωδικό *",
    resetPassword: "Επαναφορα κωδικου",
    resetting: "Επαναφορα...",
    backToLogin: "Πισω στη συνδεση",
    invalidResetLink: "Μη έγκυρος σύνδεσμος επαναφοράς",
    invalidResetLinkMessage:
      "Ο σύνδεσμος επαναφοράς κωδικού είναι μη έγκυρος ή έχει λήξει.",
    goToLogin: "Μεταβαση στη συνδεση",
    passwordsDontMatch: "Οι κωδικοί δεν ταιριάζουν",
    invalidResetLinkError: "Μη έγκυρος σύνδεσμος επαναφοράς",
    passwordResetFailed: "Η επαναφορά κωδικού απέτυχε",
    passwordResetSuccessfully:
      "✅ Ο κωδικός επαναφέρθηκε με επιτυχία! Ανακατεύθυνση στη σύνδεση...",
    redirectingToLogin: "Ανακατεύθυνση στη σύνδεση...",
  },
  ru: {
    resetYourPassword: "Сброс пароля",
    enterNewPassword: "Введите новый пароль ниже",
    newPassword: "Новый пароль *",
    confirmNewPassword: "Подтвердите новый пароль *",
    resetPassword: "Сбросить пароль",
    resetting: "Сброс...",
    backToLogin: "Вернуться к входу",
    invalidResetLink: "Неверная ссылка для сброса",
    invalidResetLinkMessage:
      "Ссылка для сброса пароля недействительна или истекла.",
    goToLogin: "Перейти к входу",
    passwordsDontMatch: "Пароли не совпадают",
    invalidResetLinkError: "Неверная ссылка для сброса",
    passwordResetFailed: "Ошибка сброса пароля",
    passwordResetSuccessfully:
      "✅ Пароль успешно сброшен! Перенаправление на вход...",
    redirectingToLogin: "Перенаправление на вход...",
  },
  md: {
    resetYourPassword: "Resetează-ți parola",
    enterNewPassword: "Introduceți noua parolă mai jos",
    newPassword: "Parola nouă *",
    confirmNewPassword: "Confirmați parola nouă *",
    resetPassword: "Resetează parola",
    resetting: "Se resetează...",
    backToLogin: "Înapoi la conectare",
    invalidResetLink: "Link de resetare nevalid",
    invalidResetLinkMessage:
      "Linkul de resetare a parolei este nevalid sau a expirat.",
    goToLogin: "Mergi la conectare",
    passwordsDontMatch: "Parolele nu se potrivesc",
    invalidResetLinkError: "Link de resetare nevalid",
    passwordResetFailed: "Eroare la resetarea parolei",
    passwordResetSuccessfully:
      "✅ Parola a fost resetată cu succes! Redirecționare la conectare...",
    redirectingToLogin: "Redirecționare la conectare...",
  },
  es: {
    resetYourPassword: "Restablecer tu contraseña",
    enterNewPassword: "Ingresa tu nueva contraseña a continuación",
    newPassword: "Nueva contraseña *",
    confirmNewPassword: "Confirmar nueva contraseña *",
    resetPassword: "Restablecer contraseña",
    resetting: "Restableciendo...",
    backToLogin: "Volver al inicio de sesión",
    invalidResetLink: "Enlace de restablecimiento no válido",
    invalidResetLinkMessage:
      "El enlace de restablecimiento de contraseña no es válido o ha expirado.",
    goToLogin: "Ir al inicio de sesión",
    passwordsDontMatch: "Las contraseñas no coinciden",
    invalidResetLinkError: "Enlace de restablecimiento no válido",
    passwordResetFailed: "Error al restablecer la contraseña",
    passwordResetSuccessfully:
      "✅ ¡Contraseña restablecida con éxito! Redirigiendo al inicio de sesión...",
    redirectingToLogin: "Redirigiendo al inicio de sesión...",
  },
  fr: {
    resetYourPassword: "Réinitialiser votre mot de passe",
    enterNewPassword: "Entrez votre nouveau mot de passe ci-dessous",
    newPassword: "Nouveau mot de passe *",
    confirmNewPassword: "Confirmer le nouveau mot de passe *",
    resetPassword: "Réinitialiser le mot de passe",
    resetting: "Réinitialisation...",
    backToLogin: "Retour à la connexion",
    invalidResetLink: "Lien de réinitialisation invalide",
    invalidResetLinkMessage:
      "Le lien de réinitialisation du mot de passe est invalide ou a expiré.",
    goToLogin: "Aller à la connexion",
    passwordsDontMatch: "Les mots de passe ne correspondent pas",
    invalidResetLinkError: "Lien de réinitialisation invalide",
    passwordResetFailed: "Échec de la réinitialisation du mot de passe",
    passwordResetSuccessfully:
      "✅ Mot de passe réinitialisé avec succès ! Redirection vers la connexion...",
    redirectingToLogin: "Redirection vers la connexion...",
  },
  de: {
    resetYourPassword: "Setzen Sie Ihr Passwort zurück",
    enterNewPassword: "Geben Sie unten Ihr neues Passwort ein",
    newPassword: "Neues Passwort *",
    confirmNewPassword: "Neues Passwort bestätigen *",
    resetPassword: "Passwort zurücksetzen",
    resetting: "Wird zurückgesetzt...",
    backToLogin: "Zurück zur Anmeldung",
    invalidResetLink: "Ungültiger Reset-Link",
    invalidResetLinkMessage:
      "Der Link zum Zurücksetzen des Passworts ist ungültig oder abgelaufen.",
    goToLogin: "Zur Anmeldung gehen",
    passwordsDontMatch: "Passwörter stimmen nicht überein",
    invalidResetLinkError: "Ungültiger Reset-Link",
    passwordResetFailed: "Passwort-Zurücksetzung fehlgeschlagen",
    passwordResetSuccessfully:
      "✅ Passwort erfolgreich zurückgesetzt! Weiterleitung zur Anmeldung...",
    redirectingToLogin: "Weiterleitung zur Anmeldung...",
  },
};
