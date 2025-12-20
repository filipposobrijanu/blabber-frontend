import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  CSSProperties,
} from "react";
import { User } from "../../types/chat";
import { useShopContext } from "../../hooks/useShopContext";
import { loginTranslations } from "./LoginTranslations";
import "./Login.css";
import logo1 from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { GoogleLoginButton } from "../GoogleLoginButton/GoogleLoginButton";
import { motion } from "framer-motion";

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const { selectedLanguage } = useShopContext();

  const [errorMessage, setErrorMessage] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const t =
    loginTranslations[selectedLanguage.code as keyof typeof loginTranslations];
  // Add this with your other state declarations

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);
  const [username, setUsername] = useState("");
  const [whatState, setWhatState] = useState("Login");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [image, setImage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordText, setPasswordText] = useState("password");

  const [errorUsernameMessage, setErrorUsernameMessage] = useState("");
  const [errorEmailMessage, setErrorEmailMessage] = useState("");
  const [errorPasswordMessage, setErrorPasswordMessage] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");
  const handleGoogleAuth = useCallback(
    async (code: string) => {
      setIsGoogleLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (data.success) {
          onLogin(data.user);
        } else {
          setErrorMessage(data.message || "Google login failed");
        }
      } catch (error: any) {
        console.error("Google OAuth error:", error);
        setErrorMessage("Google login failed. Please try again.");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    [API_URL, onLogin]
  );
  // Add this useEffect to handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (code) {
      handleGoogleAuth(code);
    } else if (error) {
      setErrorMessage("Google login cancelled or failed");
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [handleGoogleAuth]);

  // Memoize form control style
  const formControlStyle: CSSProperties = useMemo(
    () => ({
      backgroundColor: "transparent",
      color: "white",
    }),
    []
  );

  // Memoize input style
  const inputStyle: CSSProperties = useMemo(
    () => ({
      outline: "none",
      background: "transparent",
    }),
    []
  );

  // Memoize date input style
  const dateInputStyle: CSSProperties = useMemo(
    () => ({
      outline: "none",
      background: "transparent",
      color: "white",
    }),
    []
  );

  // Memoize responsive class based on window width
  const responsiveClass = useMemo(
    () => (window.innerWidth < 768 ? "mt-3" : ""),
    []
  );

  const responsiveDisplayClass = useMemo(
    () => (window.innerWidth < 768 ? "d-block" : "d-block"),
    []
  );

  // Memoized event handlers
  const handleShowPassword = useCallback(() => {
    setShowPassword((prev) => {
      const newShowPassword = !prev;
      setPasswordText(newShowPassword ? "text" : "password");
      return newShowPassword;
    });
  }, []);

  const [isModalClosing, setIsModalClosing] = useState(false);

  // Update the handleClosePasswordModal to include fade-out
  const handleClosePasswordModal = useCallback(() => {
    if (showPasswordModal && !isModalClosing) {
      setIsModalClosing(true);
      // Wait for animation to complete before actually closing
      setTimeout(() => {
        setShowPasswordModal(false);
        setIsModalClosing(false);
        setForgotPasswordError("");
        setForgotPasswordEmail("");
      }, 250); // Match this with your CSS animation duration
    }
  }, [showPasswordModal, isModalClosing]);

  const handleForgotPassword = useCallback(async () => {
    setForgotPasswordError("");
    setForgotPasswordSuccess("");
    setErrorEmailMessage("");

    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordError(t.enterEmail);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
      setForgotPasswordError(t.invalidEmail);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || t.failedToSendInstructions);
      }

      setShowPasswordModal(true);
      setForgotPasswordError("");
      setForgotPasswordSuccess(t.resetInstructionsSent);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setForgotPasswordError(error.message || t.failedToSendInstructions);
      setForgotPasswordSuccess("");
    } finally {
      setIsLoading(false);
    }
  }, [forgotPasswordEmail, API_URL, t]);

  const clearForm = useCallback(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setImage("");
    setDateOfBirth("");
    setErrorMessage("");
    setForgotPasswordSuccess("");
    setErrorUsernameMessage("");
    setErrorEmailMessage("");
    setForgotPasswordError("");
    setErrorPasswordMessage("");
    setPasswordText("password");
    setShowPassword(false);
  }, []);

  const clearErrors = useCallback(() => {
    setErrorMessage("");
    setErrorUsernameMessage("");
    setErrorEmailMessage("");
    setErrorPasswordMessage("");
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      clearErrors();

      try {
        if (whatState === "Login") {
          if (!email.trim() || !password.trim()) {
            setErrorMessage(t.pleaseEnterBoth);
            setIsLoading(false);
            return;
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
          if (!emailRegex.test(email)) {
            setErrorEmailMessage(t.invalidEmail);
            setIsLoading(false);
            return;
          }

          const response = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Login failed");
          }

          const { user } = await response.json();
          onLogin(user);
          return;
        } else {
          if (
            !username.trim() ||
            !email.trim() ||
            !password.trim() ||
            !dateOfBirth.trim()
          ) {
            setErrorMessage(t.allFieldsRequired);
            setIsLoading(false);
            return;
          }

          const birthDate = new Date(dateOfBirth);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          if (age < 13) {
            setErrorMessage(t.mustBe13YearsOld);
            setIsLoading(false);
            return;
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
          if (!emailRegex.test(email)) {
            setErrorEmailMessage(t.invalidEmail);
            setIsLoading(false);
            return;
          }

          const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
          if (!usernameRegex.test(username)) {
            setErrorUsernameMessage(t.usernameRequirements);
            setIsLoading(false);
            return;
          }

          const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
          if (!passwordRegex.test(password)) {
            setErrorPasswordMessage(t.passwordMinRequirements);
            setIsLoading(false);
            return;
          }

          const response = await fetch(`${API_URL}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username,
              email,
              password,
              image,
              dateOfBirth,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Registration failed");
          }

          const { user } = await response.json();
          onLogin(user);
        }
      } catch (error: any) {
        console.error("Authentication error:", error);
        setErrorMessage(error.message || "Authentication failed");
      } finally {
        setIsLoading(false);
      }
    },
    [
      whatState,
      username,
      email,
      password,
      dateOfBirth,
      image,
      API_URL,
      onLogin,
      clearErrors,
      t,
    ]
  );

  const handleStateChange = useCallback(
    (newState: string) => {
      clearForm();
      setWhatState(newState);
    },
    [clearForm]
  );

  // Memoize field change handlers
  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setErrorEmailMessage("");
    setErrorMessage("");
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    setErrorPasswordMessage("");
    setErrorMessage("");
  }, []);

  const handleUsernameChange = useCallback((value: string) => {
    setUsername(value);
    setErrorUsernameMessage("");
    setErrorMessage("");
  }, []);

  const handleDateOfBirthChange = useCallback((value: string) => {
    setDateOfBirth(value);
    setErrorMessage("");
  }, []);

  const handleForgotPasswordEmailChange = useCallback((value: string) => {
    setForgotPasswordEmail(value);
    setForgotPasswordError("");
    setForgotPasswordSuccess("");
  }, []);

  // Memoize skeleton loader to prevent recreation - MUST BE BEFORE ANY CONDITIONAL RETURNS
  const SkeletonLoader = useMemo(
    () => () =>
      (
        <div className="login-content d-flex flex-column align-items-center justify-content-center justify-content-md-start gap-0 mb-5">
          {whatState === "Login" && (
            <div className="d-flex align-items-center justify-content-center">
              <div className="mb-3">
                <div
                  className="d-flex login-container glass p-4 p-sm-4 px-1 px-sm-5 flex-column mt-5 text-start align-items-center"
                  style={{ maxWidth: "550px" }}
                >
                  <form
                    onSubmit={handleSubmit}
                    className="login-form px-3 py-2"
                  >
                    <div className="text-center mb-4 d-flex gap-2 flex-column justify-content-center align-items-center">
                      <div
                        className="skeleton-blink2 rounded-5  d-flex justify-content-center align-items-center"
                        style={{
                          width: "250px",
                          height: "35px",
                          backgroundColor: "#ffffffec",
                        }}
                      ></div>
                      <div
                        className={`skeleton-blink rounded-5 justify-content-center align-items-center ${
                          window.innerWidth < 768 ? "d-none" : "d-flex"
                        } `}
                        style={{
                          width: "300px",
                          height: "25px",
                          backgroundColor: "#adadade8",
                        }}
                      ></div>
                    </div>
                    <div className="d-flex flex-column gap-2 flex-wrap">
                      <div className="d-flex flex-column gap-2 flex-wrap">
                        <div
                          className="skeleton-blink2 rounded-5 d-flex justify-content-center align-items-center"
                          style={{
                            width: "325px",
                            height: "40px",
                            backgroundColor: "#ffffffec",
                          }}
                        ></div>
                      </div>
                      <div className="d-flex flex-column gap-2 mt-2 flex-wrap">
                        <div
                          className="skeleton-blink2 rounded-5 d-flex justify-content-center align-items-center"
                          style={{
                            width: "325px",
                            height: "40px",
                            backgroundColor: "#ffffffec",
                          }}
                        ></div>
                      </div>
                      <div className="d-flex">
                        <div
                          className="skeleton-blink rounded-5 d-flex justify-content-start align-items-center"
                          style={{
                            width: "150px",
                            height: "20px",
                            backgroundColor: "#adadade8",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div
                      className="skeleton-blink2 rounded-4 mt-4 mb-2  d-flex justify-content-center align-items-center"
                      style={{
                        width: "325px",
                        height: "40px",
                        backgroundColor: "#ffffffec",
                      }}
                    ></div>

                    <div className="d-flex gap-2 m-0 mt-3">
                      <div
                        className="skeleton-blink rounded-5  d-flex justify-content-center align-items-center"
                        style={{
                          width: "325px",
                          height: "20px",
                          backgroundColor: "#adadade8",
                        }}
                      ></div>
                    </div>
                    <div
                      className="skeleton-blink2 rounded-4 mt-3  d-flex justify-content-center align-items-center"
                      style={{
                        width: "325px",
                        height: "40px",
                        backgroundColor: "#ffffffec",
                      }}
                    ></div>

                    <div className="d-flex gap-2 m-0 mt-2 mb-2">
                      <div
                        className="skeleton-blink rounded-5  d-flex justify-content-start align-items-center"
                        style={{
                          width: "300px",
                          height: "20px",
                          backgroundColor: "#adadade8",
                        }}
                      ></div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    [whatState, responsiveClass, handleSubmit]
  );

  // Effects
  useEffect(() => {
    if (whatState === "Login") {
      document.title = `Blabber - ${t.loginTon}`;
    } else {
      document.title = `Blabber - ${t.createAnAccount}`;
    }
  }, [whatState]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingSkeleton(false);
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  // NOW the conditional return can happen after all hooks are called
  if (isLoadingSkeleton) {
    return <SkeletonLoader />;
  }

  return (
    <>
      {/* Login content */}
      <div className="login-content d-flex flex-column align-items-center justify-content-center justify-content-md-start gap-0 mb-5">
        {whatState === "Login" && (
          <LoginForm
            email={email}
            password={password}
            passwordText={passwordText}
            showPassword={showPassword}
            errorMessage={errorMessage}
            errorEmailMessage={errorEmailMessage}
            errorPasswordMessage={errorPasswordMessage}
            isLoading={isLoading}
            isGoogleLoading={isGoogleLoading} // ADD THIS
            responsiveDisplayClass={responsiveDisplayClass}
            formControlStyle={formControlStyle}
            inputStyle={inputStyle}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onShowPassword={handleShowPassword}
            onSubmit={handleSubmit}
            onGoogleError={(error) => setErrorMessage(error)}
            onShowPasswordModal={() => setShowPasswordModal(true)}
            onStateChange={handleStateChange}
            t={t}
          />
        )}

        {whatState === "Register" && (
          <RegisterForm
            username={username}
            email={email}
            password={password}
            dateOfBirth={dateOfBirth}
            passwordText={passwordText}
            showPassword={showPassword}
            errorMessage={errorMessage}
            errorUsernameMessage={errorUsernameMessage}
            errorEmailMessage={errorEmailMessage}
            errorPasswordMessage={errorPasswordMessage}
            isLoading={isLoading}
            isGoogleLoading={isGoogleLoading} // ΠΡΟΣΘΗΚΗ
            formControlStyle={formControlStyle}
            inputStyle={inputStyle}
            dateInputStyle={dateInputStyle}
            onUsernameChange={handleUsernameChange}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onGoogleError={(error) => setErrorMessage(error)} // ΠΡΟΣΘΗΚΗ
            onDateOfBirthChange={handleDateOfBirthChange}
            onShowPassword={handleShowPassword}
            onSubmit={handleSubmit}
            onStateChange={handleStateChange}
            t={t}
          />
        )}
      </div>

      {showPasswordModal && (
        <PasswordModal
          forgotPasswordEmail={forgotPasswordEmail}
          forgotPasswordError={forgotPasswordError}
          forgotPasswordSuccess={forgotPasswordSuccess}
          isLoading={isLoading}
          formControlStyle={formControlStyle}
          inputStyle={inputStyle}
          onEmailChange={handleForgotPasswordEmailChange}
          onClose={handleClosePasswordModal}
          onSubmit={handleForgotPassword}
          isClosing={isModalClosing}
          t={t}
        />
      )}
    </>
  );
};

// Extracted Login Form Component
interface LoginFormProps {
  email: string;
  password: string;
  passwordText: string;
  showPassword: boolean;
  errorMessage: string;
  errorEmailMessage: string;
  isGoogleLoading: boolean; // ADD THIS
  errorPasswordMessage: string;
  isLoading: boolean;
  responsiveDisplayClass: string;
  formControlStyle: CSSProperties;
  inputStyle: CSSProperties;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onShowPassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onShowPasswordModal: () => void;
  onGoogleError: (error: string) => void; // ADD THIS
  onStateChange: (state: string) => void;
  t: any;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  passwordText,
  showPassword,
  errorMessage,
  errorEmailMessage,
  errorPasswordMessage,
  isLoading,
  isGoogleLoading,
  responsiveDisplayClass,
  formControlStyle,
  inputStyle,
  onEmailChange,
  onPasswordChange,
  onShowPassword,
  onSubmit,
  onGoogleError,
  onShowPasswordModal,
  onStateChange,
  t,
}) => (
  <div className="d-flex align-items-center justify-content-center">
    <div className="mb-3">
      <div
        className="d-flex login-container glass p-4 p-sm-4 px-1 px-sm-5 flex-column mt-5 text-start align-items-center"
        style={{ maxWidth: "550px" }}
      >
        <div
          className={`d-flex  top-header-logo align-items-end justify-content-center p-0 gap-2 rounded-4`}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className={`d-flex top-header-logo align-items-end justify-content-center p-0 gap-2 rounded-4`}
          >
            <img src={logo1} width="56" height="56" alt="Friends" />
          </motion.div>
        </div>
        <form onSubmit={onSubmit} className="login-form px-3 py-2 pt-1">
          <div className="text-center mb-4">
            <h3>{t.welcomeBack}</h3>
            <p
              className={responsiveDisplayClass}
              style={{ color: "#ffffffa8" }}
            >
              {t.happyToSeeYouAgain}
            </p>
          </div>
          <div className="d-flex flex-column gap-2 flex-wrap">
            <div className="d-flex flex-column gap-2 flex-wrap">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                whileHover={{ scale: 1.01 }}
                className="form-control p-2 px-3 border border-1 shadow-sm rounded-5 d-flex align-items-center"
                style={formControlStyle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="white"
                  className="bi bi-envelope-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
                </svg>
                <input
                  type="text"
                  className="border-0 px-2 flex-grow-1"
                  style={inputStyle}
                  placeholder={t.emailAddress}
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </motion.div>
              <motion.small
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-danger "
              >
                {errorEmailMessage}
              </motion.small>
            </div>
            <div className="d-flex flex-column gap-2 mt-2 flex-wrap">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                whileHover={{ scale: 1.01 }}
                className="form-control p-2 px-3 border border-1 shadow-sm rounded-5 d-flex align-items-center"
                style={formControlStyle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="white"
                  className="bi bi-lock-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"
                  />
                </svg>
                <input
                  placeholder={t.password}
                  type={passwordText}
                  className="border-0 px-2 flex-grow-1"
                  style={inputStyle}
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  required
                  disabled={isLoading}
                />
                {!showPassword && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    onClick={onShowPassword}
                    fill="white"
                    className="bi bi-eye eyething"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                  </svg>
                )}
                {showPassword && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    onClick={onShowPassword}
                    fill="white"
                    className="bi bi-eye-slash eyething"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                    <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                  </svg>
                )}
              </motion.div>
            </div>
            <div className="d-flex">
              <small
                onClick={onShowPasswordModal}
                id="hover-opacity"
                className="m-0 mb-2"
                style={{
                  color: "#ffffffa8",
                  cursor: "pointer",
                }}
              >
                {t.forgotPassword}
              </small>
            </div>
          </div>
          {errorMessage && (
            <motion.small
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-danger mt-3"
            >
              {errorMessage}
            </motion.small>
          )}

          <button
            className="btn  btn-light  p-2 px-3 mt-3 shadow-sm rounded-4 fw-bold text-uppercase w-100"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? t.loading : t.login}
          </button>
          {/* Divider */}
          <div className="login-divider">
            <small>{t.or}</small>
          </div>

          {/* Google Login Button */}
          <GoogleLoginButton
            onSuccess={() => {}} // Not used in manual implementation
            onError={onGoogleError} // USE THE PASSED PROP
            isLoading={isGoogleLoading} // USE THE PASSED PROP
          />
          <div className="d-flex flex-wrap gap-1 gap-sm-2 m-0 mt-2 mb-2 text-start">
            <small>{t.doYouNeedAccount}</small>
            <small
              id="hover-opacity"
              style={{
                color: "#ffffffa8",
                cursor: "pointer",
              }}
              onClick={() => onStateChange("Register")}
            >
              {t.createAccount}
            </small>
          </div>
        </form>
      </div>
    </div>
  </div>
);

// Extracted Register Form Component
interface RegisterFormProps {
  username: string;
  email: string;
  password: string;
  dateOfBirth: string;
  passwordText: string;
  showPassword: boolean;
  errorMessage: string;
  errorUsernameMessage: string;
  errorEmailMessage: string;
  errorPasswordMessage: string;
  isLoading: boolean;
  isGoogleLoading: boolean; // ΠΡΟΣΘΗΚΗ
  formControlStyle: CSSProperties;
  inputStyle: CSSProperties;
  dateInputStyle: CSSProperties;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onDateOfBirthChange: (value: string) => void;
  onShowPassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onStateChange: (state: string) => void;
  onGoogleError: (error: string) => void; // ΠΡΟΣΘΗΚΗ
  t: any;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  username,
  email,
  password,
  dateOfBirth,
  passwordText,
  showPassword,
  errorMessage,
  errorUsernameMessage,
  errorEmailMessage,
  errorPasswordMessage,
  isLoading,
  formControlStyle,
  inputStyle,
  dateInputStyle,
  isGoogleLoading,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onDateOfBirthChange,
  onShowPassword,
  onSubmit,
  onStateChange,
  onGoogleError,
  t,
}) => (
  <div className="d-flex align-items-center justify-content-center">
    <div className="mb-3">
      <div
        className="d-flex login-container glass p-4 p-sm-4 px-1 px-sm-5 flex-column mt-5 text-start align-items-center"
        style={{ maxWidth: "550px" }}
      >
        <div
          className={`d-flex  top-header-logo align-items-end justify-content-center p-0 gap-2 rounded-4`}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className={`d-flex top-header-logo align-items-end justify-content-center p-0 gap-2 rounded-4`}
          >
            <img src={logo1} width="56" height="56" alt="Friends" />
          </motion.div>
        </div>
        <form onSubmit={onSubmit} className="login-form px-3 py-2 pt-1">
          <div className="text-center mb-4">
            <h3>{t.createAnAccount}</h3>
          </div>
          <div className="d-flex flex-column gap-2 flex-wrap">
            <div className="d-flex flex-column gap-2 flex-wrap">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                whileHover={{ scale: 1.01 }}
                className="form-control p-2 px-3 border border-1 shadow-sm rounded-5 d-flex align-items-center"
                style={formControlStyle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="white"
                  className="bi bi-person-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                </svg>
                <input
                  disabled={isLoading}
                  placeholder={t.username}
                  type="text"
                  className="border-0 px-2 flex-grow-1"
                  style={inputStyle}
                  value={username}
                  onChange={(e) => onUsernameChange(e.target.value)}
                  required
                />
              </motion.div>
              <motion.small
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-danger "
              >
                {errorUsernameMessage}
              </motion.small>
            </div>
            <div className="d-flex flex-column gap-2 mt-2 flex-wrap">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                whileHover={{ scale: 1.01 }}
                className="form-control p-2 px-3 border border-1 shadow-sm rounded-5 d-flex align-items-center"
                style={formControlStyle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="white"
                  className="bi bi-envelope-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
                </svg>
                <input
                  disabled={isLoading}
                  placeholder={t.emailAddress}
                  type="text"
                  className="border-0 px-2 flex-grow-1"
                  style={inputStyle}
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  required
                />
              </motion.div>
              <motion.small
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-danger "
              >
                {errorEmailMessage}
              </motion.small>
            </div>
            <div className="d-flex flex-column gap-2 mt-2 flex-wrap">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                whileHover={{ scale: 1.01 }}
                className="form-control p-2 px-3 border border-1 shadow-sm rounded-5 d-flex align-items-center"
                style={formControlStyle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="white"
                  className="bi bi-lock-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"
                  />
                </svg>
                <input
                  disabled={isLoading}
                  type={passwordText}
                  className="border-0 px-2 flex-grow-1"
                  style={inputStyle}
                  value={password}
                  placeholder={t.password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  required
                />
                {!showPassword && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    onClick={onShowPassword}
                    fill="white"
                    className="bi bi-eye eyething"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                  </svg>
                )}
                {showPassword && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    onClick={onShowPassword}
                    fill="white"
                    className="bi bi-eye-slash eyething"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                    <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                  </svg>
                )}
              </motion.div>
              <motion.small
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-danger "
              >
                {errorPasswordMessage}
              </motion.small>
            </div>
            <div className="d-flex  flex-column gap-2 mt-2 flex-wrap">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                whileHover={{ scale: 1.01 }}
                className="form-control p-2 px-3 border border-1 shadow-sm rounded-5 d-flex align-items-center"
                style={formControlStyle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="white"
                  className="bi bi-calendar3"
                  viewBox="0 0 16 16"
                >
                  <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
                  <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                </svg>
                <input
                  disabled={isLoading}
                  type="date"
                  className="border-0 px-2 flex-grow-1"
                  style={dateInputStyle}
                  placeholder={t.dateOfBirth}
                  value={dateOfBirth}
                  onChange={(e) => onDateOfBirthChange(e.target.value)}
                  required
                />
              </motion.div>
              <small style={{ color: "#ffffffa8", fontSize: "0.8rem" }}>
                {t.mustBe13YearsOld}
              </small>
            </div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <input
                disabled={isLoading}
                id="hover-opacity"
                type="checkbox"
                className="form-check-input border-0 shadow-sm rounded-5"
                style={{
                  filter:
                    "invert(0) brightness(1) saturate(0) contrast(80%) hue-rotate(240deg)",
                }}
                required
              />
              <label htmlFor="checkbox">
                <small>
                  {t.iHaveRead}{" "}
                  <Link
                    to={`/tos`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <span
                      id="hover-opacity"
                      style={{
                        color: "#ffffffa8",
                        cursor: "pointer",
                      }}
                    >
                      {t.termsOfService}
                    </span>
                  </Link>{" "}
                  {t.and}{" "}
                  <Link
                    to={`/privacy`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <span
                      id="hover-opacity"
                      style={{
                        color: "#ffffffa8",
                        cursor: "pointer",
                      }}
                    >
                      {t.privacyPolicy}
                    </span>
                  </Link>
                  .
                </small>
              </label>
            </div>
          </div>
          {errorMessage && (
            <motion.small
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-danger mt-3"
            >
              {errorMessage}
            </motion.small>
          )}

          <button
            className="btn btn-light p-2 px-3 mt-3 shadow-sm rounded-4 fw-bold text-uppercase w-100"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? t.creating : t.createAccountButton}
          </button>
          <div className="login-divider">
            <small>{t.or}</small>
          </div>

          {/* Google Login Button */}
          <GoogleLoginButton
            onSuccess={() => {}} // Not used in manual implementation
            onError={onGoogleError} // USE THE PASSED PROP
            isLoading={isGoogleLoading} // USE THE PASSED PROP
            mode="signup"
          />
          <div className="d-flex gap-2 m-0 mt-2 mb-2">
            <small>{t.alreadyHaveAccount}</small>
            <small
              id="hover-opacity"
              style={{
                color: "#ffffffa8",
                cursor: "pointer",
              }}
              onClick={() => onStateChange("Login")}
            >
              {t.loginTon}
            </small>
          </div>
        </form>
      </div>
    </div>
  </div>
);

// Extracted Password Modal Component
interface PasswordModalProps {
  forgotPasswordEmail: string;
  forgotPasswordError: string;
  forgotPasswordSuccess: string;
  isLoading: boolean;
  formControlStyle: CSSProperties;
  inputStyle: CSSProperties;
  onEmailChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isClosing?: boolean;
  t: any;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  forgotPasswordEmail,
  forgotPasswordError,
  forgotPasswordSuccess,
  isLoading,
  formControlStyle,
  inputStyle,
  onEmailChange,
  onClose,
  onSubmit,
  isClosing = false,
  t,
}) => (
  <div
    className={`modal ${isClosing ? "fade-out" : "fade-in"} ${
      !isClosing ? "show" : ""
    } pb-5`}
    style={{
      display: isClosing ? "block" : "block",
      background: "#020e0ac7",
      backdropFilter: "blur(5px)",
    }}
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}
  >
    <div
      className="modal-dialog modal-dialog-centered"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-content text-white glass-popup rounded-5 m-0 mt-1 mt-md-0">
        <div className="modal-header d-flex flex-column justify-content-center align-items-center text-center">
          <h3 className="modal-title">{t.forgotPasswordTitle}</h3>
        </div>
        <div className="modal-body d-flex flex-column gap-3 p-3 py-4">
          <div className="d-flex flex-column gap-2">
            <small style={{ color: "#c0c0c0ff" }}>{t.resetInstructions}</small>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="form-control p-2 px-3 border border-1 shadow-sm rounded-5 d-flex align-items-center"
              style={formControlStyle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="white"
                className="bi bi-envelope-fill"
                viewBox="0 0 16 16"
              >
                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
              </svg>
              <input
                disabled={isLoading || isClosing}
                type="email"
                className="border-0 px-2 flex-grow-1"
                style={inputStyle}
                placeholder={t.enterEmail}
                value={forgotPasswordEmail}
                onChange={(e) => onEmailChange(e.target.value)}
              />
            </motion.div>
          </div>
          {forgotPasswordError && (
            <motion.small
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-danger m-0 text-start"
            >
              {forgotPasswordError}
            </motion.small>
          )}
          {forgotPasswordSuccess && (
            <motion.small
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ color: "#20b92d" }}
              className="m-0 text-start"
            >
              {forgotPasswordSuccess}
            </motion.small>
          )}
        </div>
        <div className="modal-footer mt-0">
          <button
            type="button"
            className="btn btn-outline-light fw-bold order-md-first order-last rounded-4 text-uppercase p-2 px-4"
            onClick={onClose}
            disabled={isClosing}
          >
            {t.cancel}
          </button>
          <button
            type="button"
            className="btn btn-light fw-bold rounded-4 order-md-last order-first text-uppercase p-2 px-4"
            onClick={onSubmit}
            disabled={isLoading || isClosing}
          >
            {isLoading ? t.sending : t.sendInstructions}
          </button>
        </div>
      </div>
    </div>
  </div>
);
