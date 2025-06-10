import { Link } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { collections, featuredApps } from '@/data/apps';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

export default function Featured() {
  const { isDark } = useTheme();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <main className="ml-0 flex-1 p-4 transition-all duration-300 md:ml-64 lg:ml-72 md:p-8 text-gray-800 bg-gray-50 dark:text-gray-100 dark:bg-gray-900">

        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold lg:text-3xl">车机精选合集</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            专为车机优化的应用合集，提升您的驾驶体验
          </p>
        </motion.div>

        <div className="space-y-8">
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
               className="overflow-hidden rounded-[4px] bg-white dark:bg-gray-800 shadow-lg"
            >
              <div className="relative h-48 w-full overflow-hidden md:h-56">
                <img
                  src={collection.cover}
                  alt={collection.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 md:p-6">
                    <div className="flex items-center">
                      <i className="fas fa-graduation-cap mr-2 text-white"></i>
                      <h2 className="text-xl font-bold text-white md:text-2xl">{collection.title}</h2>
                    </div>
                   <div className="mt-2 flex flex-wrap gap-2">
                     <span className="rounded-sm bg-white/20 px-2 py-1 text-xs text-white">{collection.category}</span>
                     <span className="rounded-sm bg-white/20 px-2 py-1 text-xs text-white">{collection.duration}</span>
                     <span className="rounded-sm bg-white/20 px-2 py-1 text-xs text-white">兼容: {collection.compatibleModels}</span>
                     {collection.isRecommended && (
                       <span className="rounded-sm bg-yellow-500/80 px-2 py-1 text-xs text-white">官方推荐</span>
                     )}
                   </div>
                  <p className="mt-2 text-sm text-gray-200 md:text-base">{collection.description}</p>
                </div>
              </div>

              <div className="p-4 md:p-6">
                <AnimatePresence>
                  <motion.div 
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                  >
                    {collection.apps.map((appId) => {
                      const app = featuredApps.find((a) => a.id === appId);
                      if (!app) return null;
                      return (
                        <motion.div
                          key={app.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ y: -5 }}
                        >
                          <Link
                            to={`/app/${app.id}`}
                            className="flex items-center rounded-xl p-4 transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <img
                              src={app.icon}
                              alt={app.name}
                                className="mr-4 h-12 w-12 rounded-[12px] shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="truncate font-medium text-[#1A1A1A] dark:text-white">{app.name}</h3>
                              <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                {app.category}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 所有应用展示区 */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-8 flex items-center">
             <h2 className="text-2xl font-bold">车机精选应用</h2>
             <div className="ml-4 h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
          </div>
          
           {featuredApps.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {featuredApps.map((app) => (
                  <motion.div
                    key={app.id}
                    whileHover={{ y: -5, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="overflow-hidden"
                  >
                    <Link
                      to={`/app/${app.id}`}
                       className="group flex flex-col items-center rounded-none p-5 transition-all bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-sm hover:shadow-md"
                    >
                      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-xl bg-white/10 p-1 group-hover:bg-white/20">
                       <img
                           src={app.icon}
                           srcSet={`${app.icon} 1x, ${app.icon.replace('.jpg', '@2x.jpg')} 2x`}
                           alt={app.name}
                           className="h-full w-full object-contain rounded-[12px] opacity-0 transition-all duration-300"
                           loading="lazy"
                          onLoad={(e) => e.currentTarget.classList.add('opacity-100')}
                          onError={(e) => e.currentTarget.src = '/placeholder-app-icon.png'}
                        />
                      </div>
                     <h3 className="w-full truncate text-sm font-medium sm:text-base">{app.name}</h3>
                     <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                       {app.category}
                     </p>
                     <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-500 line-clamp-2">
                       {app.description}
                     </p>
                   </Link>
                 </motion.div>
               ))}
             </div>
          ) : (
            <div className="rounded-2xl p-8 text-center bg-gray-100 dark:bg-gray-800">
              <i className="fa-solid fa-box-open text-4xl mb-4 text-gray-400"></i>
              <p className="text-lg text-gray-600 dark:text-gray-300">暂无精选应用</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}