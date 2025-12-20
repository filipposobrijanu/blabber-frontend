import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Chat } from "./components/Chat/Chat";
import { InvitePage } from "./components/InvitePage/InvitePage";
import { UsersProvider } from "./context/UsersContext";
import ShopContextProvider from "./context/ShopContext";
import { ResetPassword } from "./components/ResetPassword/ResetPassword";
import { TermsOfService } from "./components/TermsOfService/TermsOfService";
import { PrivacyPolicy } from "./components/PrivacyPolicy/PrivacyPolicy";
import { AuthGoogleCallback } from "./components/OAuthCallback/OAuthCallback";
import { FriendsProvider } from "./context/FriendsContext";
import { LandingPage } from "./components/LandingPage/LandingPage";

const App: React.FC = () => {
  return (
    <Router>
      <ShopContextProvider>
        <UsersProvider>
          <FriendsProvider>
            {/* TextCursor at the root level - will appear on all pages 
          <TextCursor imageSize={16} delay={0.001} spacing={70} maxPoints={8} />*/}

            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/welcome" element={<LandingPage />} />

              <Route
                path="/auth/google/callback"
                element={<AuthGoogleCallback />}
              />
              <Route path="/" element={<Chat />} />
              <Route path="/login" element={<Chat />} />
              <Route path="/channels/@me" element={<Chat />} />
              <Route path="/channel/@:channelName" element={<Chat />} />
              <Route path="/invite/:inviteCode" element={<InvitePage />} />
              <Route path="/channel-settings" element={<Chat />} />
              <Route path="/channel/:channelId/settings" element={<Chat />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/tos" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/settings" element={<Chat />} />
              <Route path="*" element={<Chat />} />
            </Routes>
          </FriendsProvider>
        </UsersProvider>
      </ShopContextProvider>
    </Router>
  );
};

export default App;
