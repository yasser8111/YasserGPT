import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import Sidebar from "./layouts/Sidebar";
import ChatPage from "./pages/ChatPage";
import InfoPage from "./pages/InfoPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "highlight.js/styles/github-dark.css";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Wait for auth state to resolve
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-light-200 dark:bg-dark-100">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />

        <div className="flex-1 flex flex-col min-w-0 h-full">
          <Header
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
          />

          <main className="flex-1 overflow-hidden relative">
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/chat/:chatId?"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage
                      isDarkMode={isDarkMode}
                      onToggleTheme={toggleTheme}
                    />
                  </ProtectedRoute>
                }
              />

              <Route path="/info" element={<InfoPage />} />
              <Route path="/" element={<Navigate to="/chat" />} />
              <Route path="*" element={<Navigate to="/chat" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
