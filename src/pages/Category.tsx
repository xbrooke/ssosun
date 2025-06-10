import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { featuredApps, categories } from '@/data/apps';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
 
export default function Category() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const { isDark } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredApps = (selectedCategory === '全部' 
    ? featuredApps 
    : featuredApps.filter(app => app.category === selectedCategory))
    .filter(app => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return app.name.toLowerCase().includes(query) || 
             app.description.toLowerCase().includes(query);
    });


  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <main className="ml-0 flex-1 p-4 transition-all duration-300 md:ml-64 lg:ml-72 md:p-8 text-gray-800 bg-gray-50 dark:text-gray-100 dark:bg-gray-900">

        <motion.div 
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold lg:text-3xl">所有应用</h1>
          <div className="relative">
                <input
                  type="text"
                  placeholder="搜索应用..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearching(e.target.value.length > 0);
                  }}
                  className="rounded-[4px] px-4 py-2 pl-10 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all duration-200 w-64"
                />
                <i className={`fa-solid ${isSearching ? 'fa-spinner animate-spin' : 'fa-magnifying-glass'} absolute left-3 top-2.5 text-gray-400`}></i>

          </div>
        </motion.div>
        
        <div className="mb-6">
          <div className="relative">
            <div className="flex flex-wrap gap-2 pb-2">
              {categories.map(category => (
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

        <AnimatePresence>
            <motion.div 
              className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
            {filteredApps.map(app => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="overflow-hidden"
              >
                <Link
                  to={`/app/${app.id}`}
                    className="flex h-full flex-col rounded-[4px] p-4 transition-all bg-white hover:bg-gray-50 hover:shadow-primary dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <div className="relative mr-3 h-12 w-12 sm:h-14 sm:w-14">
                      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                     <img
                         src={app.icon}
                         srcSet={`${app.icon} 1x, ${app.icon.replace('.jpg', '@2x.jpg')} 2x`}
                         alt={app.name}
                         className="relative h-full w-full rounded-[12px] object-contain opacity-0 transition-all duration-300"
                         width="48"
                         height="48"
                        loading="lazy"
                        onLoad={(e) => {
                          e.currentTarget.classList.add('opacity-100');
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-app-icon.png';
                          e.currentTarget.classList.add('opacity-100');
                        }}
                        style={{
                          transform: 'scale(0.98)',
                          transition: 'opacity 0.3s ease, transform 0.3s ease'
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium sm:text-base">{app.name}</h3>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {app.category}
                      </p>
                    </div>
                  </div>
                   <p className="mt-2 text-xs line-clamp-2 text-gray-600 dark:text-gray-300 sm:text-sm">
                     {app.description}
                   </p>
                    {searchQuery && (
                      <div className="mt-2 text-xs text-blue-500">
                        <i className="fa-solid fa-check mr-1"></i>
                        匹配: {app.name.toLowerCase().includes(searchQuery.toLowerCase()) ? '名称' : '描述'}
                      </div>
                    )}

                 </Link>
               </motion.div>
             ))}
           </motion.div>
         </AnimatePresence>
         
          {filteredApps.length === 0 && searchQuery && (
            <div className="rounded-2xl p-8 text-center bg-gray-100 dark:bg-gray-800">
              <i className="fa-solid fa-search text-4xl mb-4 text-gray-400"></i>
              <p className="text-lg text-gray-600 dark:text-gray-300">没有找到匹配"{searchQuery}"的应用</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">尝试使用不同的关键词或检查拼写</p>
            </div>
          )}

       </main>
     </div>
   );
 }