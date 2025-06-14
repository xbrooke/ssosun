import { Routes, Route, Navigate } from "react-router-dom";
import DeveloperCenter from "@/pages/DeveloperCenter";
import Category from "@/pages/Category";
import AppDetail from "@/pages/AppDetail";
import Featured from "@/pages/Featured";
import Wallpapers from "@/pages/Wallpapers";
import Donate from "@/pages/Donate";
import Settings from "@/pages/Settings";
import { Empty } from "@/components/Empty";
import { createContext, useState, Suspense, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const logout = () => {
    setIsAuthenticated(false);
  };

  // 增强资源加载检查
  useEffect(() => {
    const checkResources = async () => {
      try {
        // 检查关键资源是否加载完成
        await Promise.all([
          // 可以添加其他需要检查的资源
          new Promise(resolve => {
            if (document.readyState === 'complete') {
              resolve(true);
            } else {
              window.addEventListener('load', resolve);
            }
          })
        ]);
      } catch (err) {
        console.error('资源加载失败:', err);
        setError(err instanceof Error ? err : new Error('资源加载失败'));
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      checkResources();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)] p-4">
        <div className="text-center max-w-md">
          <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold mb-2">应用加载失败</h2>
          <p className="text-red-500 mb-4">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[4px]"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme}`}>
        <img 
          src="https://h.xbrooke.cn/img/yg/mona-loading-default.gif" 
          alt="加载中"
          className="w-16 h-16 object-contain"
          onError={(e) => {
            e.currentTarget.src = 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Loading%20animation%2C%20simple%20design&sign=71ca7f3b20de1ffe09dfb6ca05d09f6c';
          }}
        />
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen ${theme} transition-colors duration-300 bg-[var(--color-bg)] text-[var(--color-text-primary)] font-sans`}
      data-testid="app-container"
    >
      <AuthContext.Provider
        value={{ isAuthenticated, setIsAuthenticated, logout }}
      >
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="github-loading">
              <div className="github-loading-cat"></div>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Category />} />
            <Route path="/app/:id" element={<AppDetail />} />
            <Route path="/featured" element={<Featured />} />
            <Route path="/tutorial/:id" element={<Featured />} />
            <Route path="/wallpaper" element={<Wallpapers />} />
            <Route path="/wallpaper/:id" element={<Wallpapers />} />
            <Route path="/developer" element={<DeveloperCenter />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthContext.Provider>
    </div>
  );
}
