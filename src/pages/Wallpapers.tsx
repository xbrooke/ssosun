import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useState, useCallback } from 'react';
import { wallpapers, wallpaperCategories } from '@/data/wallpapers';


const SearchBox = React.memo(({ searchQuery, setSearchQuery }: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    [setSearchQuery]
  );

  const clearSearch = useCallback(() => setSearchQuery(''), [setSearchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="fixed right-4 top-4 z-50 w-[220px] md:w-[260px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-[4px] border border-gray-200 dark:border-gray-700 shadow-lg"
    >
      <div className="relative flex items-center">
        <i className="fa-solid fa-magnifying-glass absolute left-3 z-10 text-gray-400 dark:text-gray-300"></i>
        <input
          type="text"
          placeholder="搜索壁纸..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full rounded-[4px] px-3 py-2 pl-9 pr-7 text-sm bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
        {searchQuery && (
          <motion.button
            onClick={clearSearch}
            className="absolute right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="fa-solid fa-xmark text-xs text-gray-500 dark:text-gray-400"></i>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
});

export default function Wallpapers() {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWallpapers = useCallback(() => {
    return wallpapers.filter(wallpaper => {
      const matchesCategory = selectedCategory === '全部' || wallpaper.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        wallpaper.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        wallpaper.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (imageUrl: string, title: string, resolution: string, id: string) => {
    if (downloadingId) return;
    
    setDownloadingId(id);
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${title}_${resolution}.jpg`;
      link.style.display = 'none';
      
      link.onload = () => {
        setDownloadingId(null);
      };
      
      link.onerror = () => {
        setDownloadingId(null);
        alert('下载失败：图片链接无效或网络错误');
      };

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 设置超时防止状态卡住
      const timeout = setTimeout(() => {
        if (downloadingId === id) {
          setDownloadingId(null);
          alert('下载超时，请检查网络连接');
        }
      }, 10000);
      
      return () => clearTimeout(timeout);
    } catch (error) {
      setDownloadingId(null);
      alert('下载失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 直接下载图片链接
  const downloadDirectly = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden">
      <Sidebar />
      <main className="ml-0 flex-1 p-4 transition-all duration-300 md:ml-64 lg:ml-72 md:p-8 text-gray-800 bg-gray-50 dark:text-gray-100 dark:bg-gray-900 w-full max-w-full overflow-x-hidden relative">
        {/* 搜索框组件 */}
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <div className="max-w-[1800px] mx-auto">
        <motion.div 
          className="sticky top-0 z-10 pt-4 pb-2 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-sm mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold lg:text-3xl">车机壁纸</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                专为车机优化的高清壁纸，提升您的驾驶体验
              </p>
            </div>

            <div className="mt-2">
              <div className="relative">
                <div className="flex flex-wrap gap-2 pb-2">
                  {wallpaperCategories.map(category => (
                    <motion.button
                      key={category}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        whitespace-nowrap rounded-sm px-4 py-2 text-sm font-medium transition-all 
                        ${selectedCategory === category
                          ? 'bg-[var(--color-primary)] text-white shadow-sm'
                          : 'bg-white dark:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10'}
                      `}
                      style={{ transition: 'background-color 0.2s ease, transform 0.1s ease' }}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
            {filteredWallpapers().length > 0 ? (
                <motion.div 
                 className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full max-w-full"
                 initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
              {filteredWallpapers().map((wallpaper) => (
                <motion.div
                  key={wallpaper.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                   className="overflow-hidden rounded-[4px] bg-white dark:bg-gray-800 shadow-sm hover:shadow-md w-full"
                >
                   <div className="block w-full">
                       <div className="relative aspect-[16/9] overflow-hidden w-full max-w-full cursor-pointer">
                         <img
                           src={wallpaper.image}
                           alt={wallpaper.title}
                            className="absolute inset-0 h-full w-full object-cover md:object-contain opacity-0 transition-opacity duration-300"
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                          loading="lazy"
                         onLoad={(e) => e.currentTarget.classList.add('opacity-100')}
                        onError={(e) => e.currentTarget.src = '/placeholder-wallpaper.png'}
                          onClick={() => {
                            // 提供两种下载方式选项
                            if (confirm('直接使用链接下载(适合电脑)？取消则使用自动下载(适合手机)')) {
                              downloadDirectly(wallpaper.downloadUrl || wallpaper.image);
                            } else {
                              handleDownload(wallpaper.downloadUrl || wallpaper.image, wallpaper.title, wallpaper.resolution, wallpaper.id);
                            }
                          }}
                       />
                 </div>
                   <div className="p-3">
                     <div className="flex items-start justify-between">
                       <div>
                         <h3 className="truncate font-medium text-[#1A1A1A] dark:text-white">{wallpaper.title}</h3>
                         <div className="mt-1 flex items-center gap-2">
                           <span className="text-xs text-gray-500 dark:text-gray-400">{wallpaper.resolution}</span>
                           <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                           <span className="text-xs text-gray-500 dark:text-gray-400">{wallpaper.size}</span>
                           <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                           <span className="text-xs text-gray-500 dark:text-gray-400">{wallpaper.downloads}</span>
                         </div>
                       </div>
                         <motion.button
                           onClick={() => handleDownload(wallpaper.image, wallpaper.title, wallpaper.resolution, wallpaper.id)}
                           className="rounded-[4px] px-3 py-1.5 text-xs font-medium bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
                           whileHover={{ 
                             backgroundColor: 'var(--color-primary-dark)',
                             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                           }}
                           whileTap={{ scale: 0.95 }}
                           disabled={downloadingId === wallpaper.id}
                         >
                           <div className="flex items-center gap-1.5">
                             {downloadingId === wallpaper.id ? (
                               <i className="fa-solid fa-spinner animate-spin text-xs"></i>
                             ) : (
                               <i className="fa-solid fa-download text-xs"></i>
                             )}
                             <span className="whitespace-nowrap">
                               {downloadingId === wallpaper.id ? '下载中...' : '立即下载'}
                             </span>
                           </div>
                         </motion.button>
                   </div>
                   <div className="mt-2">
                     <span className={`inline-block rounded-sm px-2 py-1 text-xs ${
                       wallpaper.category === '领克汽车' || wallpaper.category === 'TCR赛事'
                         ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                         : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                     }`}>
                       {wallpaper.category}
                     </span>
                   </div>
                 </div>
               </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl p-8 text-center bg-gray-100 dark:bg-gray-800"
            >
              <i className="fa-solid fa-image text-4xl mb-4 text-gray-400"></i>
              <p className="text-lg text-gray-600 dark:text-gray-300">没有找到匹配的壁纸</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">尝试使用不同的关键词或选择其他分类</p>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>
    </div>
  );
}