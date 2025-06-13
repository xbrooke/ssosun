import { useParams } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import MobileAppDetail from '@/components/MobileAppDetail';
import { featuredApps } from '@/data/apps';
import { downloadUrls } from '@/data/downloadUrls';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTheme, useDeviceDetect } from '@/hooks/useTheme';



export default function AppDetail() {
  const { id } = useParams();
  const app = featuredApps.find(app => app.id === id);
  const { isDark } = useTheme();
  const { isMobile } = useDeviceDetect();


  if (!app) {
    return <div className="flex min-h-screen bg-white dark:bg-gray-900">应用未找到</div>;
  }

  return isMobile ? (
    <MobileAppDetail app={app} />
  ) : (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <main className="ml-0 flex-1 transition-all duration-300 md:ml-64 lg:ml-72 text-gray-800 bg-white dark:text-gray-100 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
          {/* 应用头部信息 - 优化布局 */}
           <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-6 md:gap-8 items-start"
          >
            {/* 应用图标区域 */}
             <div className="flex-shrink-0">
               <motion.div 
                 whileHover={{ scale: 1.02 }}
                 className="p-2 bg-white dark:bg-gray-800 rounded-[12px] shadow-lg"
               >
                 <div className="relative h-40 w-40">
                   <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-[12px] animate-pulse"></div>
                   <img
                     src={app.icon}
                    srcSet={`${app.icon} 1x, ${app.icon.replace('.jpg', '@2x.jpg')} 2x`}
                    alt={app.name}
                   className="relative h-full w-full rounded-[12px] object-contain opacity-0 transition-all duration-300"
                    loading="lazy"
                    onLoad={(e) => e.currentTarget.classList.add('opacity-100')}
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-app-icon.png';
                      e.currentTarget.classList.add('opacity-100');
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* 应用信息区域 */}
            <div className="flex-1">
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{app.name}</h1>
                  <p className="text-gray-500 dark:text-gray-400">{app.developer}</p>
                </div>

                {/* 评分和下载按钮组合 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={cn(
                            'fa-star text-xl',
                            star <= Math.floor(app.rating) 
                              ? 'fa-solid text-yellow-400' 
                              : 'fa-regular text-gray-300 dark:text-gray-500'
                          )}
                        ></i>
                      ))}
                    </div>
                     <span className="text-sm text-gray-500 dark:text-gray-300">
                       {(app.rating || 0).toFixed(1)} ({app.downloads} 下载)
                     </span>
                   </div>
                   
                   <div className="flex-shrink-0">
                        <motion.button 
                          className="rounded-[4px] px-6 py-3 font-medium transition-all bg-[var(--color-primary)] text-white shadow-sm"
                          whileHover={{ 
                            backgroundColor: 'var(--color-primary-dark)',
                            boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)'
                          }}
                          whileTap={{ 
                            scale: 0.98,
                            backgroundColor: 'var(--color-primary-dark)'
                          }}
                           transition={{
                             duration: 0.2,
                             ease: 'easeOut'
                           }}
                              onClick={() => {
                                const downloadUrl = downloadUrls[app.id] || `/downloads/${app.id}.zip`;
                                if (downloadUrl) {
                                  try {
                                    window.open(downloadUrl, '_blank');
                                   if (!window.open(downloadUrl, '_blank')) {
                                     console.error('无法打开下载链接，请检查浏览器设置');
                                   }
                                 } catch (error) {
                                   console.error('下载链接无效，请联系管理员');
                                 }
                               } else {
                                 console.log('该应用暂无下载链接');
                               }
                             }}
                       >
                         <div className="flex items-center justify-center gap-2">
                           <i className="fa-solid fa-download text-sm"></i>
                           <span>下载应用</span>
                         </div>
                       </motion.button>
                   </div>
                </div>

                {/* 应用元数据网格 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">版本</p>
                    <p className="font-medium">{app.version}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">大小</p>
                    <p className="font-medium">{app.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">分类</p>
                    <p className="font-medium">{app.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">开发者</p>
                    <p className="font-medium">{app.developer}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 应用截图 - 改为横向滑动画廊 */}
          {app.screenshots && app.screenshots.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="my-10"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">应用截图</h2>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex overflow-x-auto gap-4 py-4 scrollbar-hide">
                  {app.screenshots.map((screenshot, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.03 }}
                      className="flex-shrink-0 w-4/5 md:w-2/5 lg:w-1/3"
                    >
                       <img
                         src={screenshot}
                         srcSet={`${screenshot} 1x, ${screenshot.replace('.jpg', '@2x.jpg')} 2x`}
                         alt={`${app.name} 截图 ${index + 1}`}
                         className="w-full h-auto rounded-lg shadow-lg opacity-0 transition-opacity duration-300"
                         loading="lazy"
                         onLoad={(e) => e.currentTarget.classList.add('opacity-100')}
                         onError={(e) => e.currentTarget.src = '/placeholder-screenshot.png'}
                       />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 应用描述和特性 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="my-10"
          >
            <h2 className="mb-4 text-2xl font-bold">关于此应用</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">{app.description}</p>
            
            {app.features && app.features.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-xl font-medium">主要特性</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {app.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -2 }}
                      className="flex items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-shrink-0 p-2 mr-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <i className="fa-solid fa-check text-blue-500"></i>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{feature}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* 相关应用 - 改为卡片式横向滑动 */}
          {app.similarApps && app.similarApps.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="my-10"
            >
              <h2 className="mb-6 text-2xl font-bold">您可能也喜欢</h2>
              <div className="relative">
                <div className="flex overflow-x-auto gap-4 py-4 scrollbar-hide">
                  {app.similarApps.map(appId => {
                    const similarApp = featuredApps.find(a => a.id === appId);
                    if (!similarApp) return null;
                    return (
                      <motion.div
                        key={similarApp.id}
                        whileHover={{ y: -5 }}
                        className="flex-shrink-0 w-48 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img
                          src={similarApp.icon}
                          alt={similarApp.name}
                          className="w-16 h-16 mb-3 rounded-lg object-contain mx-auto"
                        />
                        <h3 className="text-sm font-medium text-center truncate">{similarApp.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">{similarApp.category}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}




