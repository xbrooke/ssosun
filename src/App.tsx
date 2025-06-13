import { Routes, Route } from "react-router-dom";
import DeveloperCenter from "@/pages/DeveloperCenter";
import Category from "@/pages/Category";
import AppDetail from "@/pages/AppDetail";
import Featured from "@/pages/Featured";
import Wallpapers from "@/pages/Wallpapers";
import Donate from "@/pages/Donate";
import { Empty } from "@/components/Empty";
import { createContext, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { theme } = useTheme();

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div 
      className={`min-h-screen ${theme} transition-colors duration-300 bg-[var(--color-bg)] text-[var(--color-text-primary)] font-sans`}
      data-testid="app-container"
    >

      <AuthContext.Provider
        value={{ isAuthenticated, setIsAuthenticated, logout }}
      >
        <Routes>
          <Route path="/" element={<Category />} />
          <Route path="/app/:id" element={<AppDetail />} />
          <Route path="/featured" element={<Featured />} />
          <Route path="/tutorial/:id" element={<Featured />} />
          <Route path="/wallpaper" element={<Wallpapers />} />
          <Route path="/wallpaper/:id" element={<Wallpapers />} />
          <Route path="/developer" element={<DeveloperCenter />} />
          <Route path="/donate" element={<Donate />} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}
