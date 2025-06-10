import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Carousel from '@/components/Carousel';
import { featuredApps } from '@/data/apps';
import { useTheme } from '@/hooks/useTheme';
 
export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isDark } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredApps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <main className="ml-0 flex-1 p-4 transition-all duration-300 md:ml-64 lg:ml-72 md:p-8 text-gray-800 bg-white dark:text-gray-100 dark:bg-gray-900">
        <h1 className="mb-8 text-2xl font-bold md:text-3xl text-[#1A1A1A] dark:text-white">精选应用</h1>
        <Carousel apps={featuredApps} />
      </main>
    </div>
  );
}