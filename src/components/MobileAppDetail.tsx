import { App, featuredApps } from '@/data/apps';
import { downloadUrls } from '@/data/downloadUrls';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';



interface MobileAppDetailProps {
  app: App;
}

export default function MobileAppDetail({ app }: MobileAppDetailProps) {
  const { isDark } = useTheme();

  return (
    <div className="px-4 py-6">
      {/* 应用头部信息 - 移动端优化布局 */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-start gap-4">
          {/* 应用图标 */}
           <div className="flex-shrink-0">
             <div className="relative h-24 w-24">
               <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-[12px] shadow-md animate-pulse"></div>
               <img
                 src={app.icon}
                 srcSet={`${app.icon} 1x, ${app.icon.replace('.jpg', '@2x.jpg')} 2x`}
                 alt={app.name}
                 className="relative h-full w-full rounded-[12px] object-contain opacity-0 transition-all duration-300 shadow-md"
                width="96"
                height="96"
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
          </div>

          {/* 应用基本信息 */}
          <div className="flex-1">
            <h1 className="text-xl font-bold">{app.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{app.developer}</p>
            
            {/* 评分和下载按钮 - 移动端优化 */}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                 <i
                    key={star}
                    className={cn(
                      'fas fa-star text-sm',
                      star <= Math.floor(app.rating) 
                        ? 'text-yellow-400' 
                        : 'far text-gray-300 dark:text-gray-500'
                    )}
                  ></i>
                ))}
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-300">
                  {app.rating?.toFixed(1)}
                </span>
              </div>

                <motion.button 
                  className="rounded-[4px] px-4 py-2 text-sm font-medium bg-[var(--color-primary)] text-white shadow-sm"
                  whileHover={{ 
                    backgroundColor: 'var(--color-primary-dark)',
                    boxShadow: 'var(--shadow-hover)'
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  transition={{ duration: 0.2 }}
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
                <div className="flex items-center gap-1">
                  <i className="fa-solid fa-download text-xs"></i>
                  <span>下载</span>
                </div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* 应用元数据 - 移动端网格布局 */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">版本</p>
            <p className="text-sm font-medium">{app.version}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">大小</p>
            <p className="text-sm font-medium">{app.size}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">分类</p>
            <p className="text-sm font-medium">{app.category}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">开发者</p>
            <p className="text-sm font-medium">{app.developer}</p>
          </div>
        </div>
      </motion.div>

      {/* 应用截图 - 移动端横向滑动 */}
      {app.screenshots && app.screenshots.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <h2 className="mb-3 text-lg font-bold">应用截图</h2>
          <div className="overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-3 px-1">
              {app.screenshots.map((screenshot, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 w-4/5"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={screenshot}
                    srcSet={`${screenshot} 1x, ${screenshot.replace('.jpg', '@2x.jpg')} 2x`}
                    alt={`${app.name} 截图 ${index + 1}`}
                    className="w-full h-auto rounded-lg shadow-lg opacity-0 transition-opacity duration-300"
                    loading="lazy"
                    width="320"
                    height="568"
                    onLoad={(e) => {
                      e.currentTarget.classList.add('opacity-100');
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onError={(e) => e.currentTarget.src = '/placeholder-screenshot.png'}
                    style={{
                      transform: 'scale(0.98)',
                      transition: 'opacity 0.3s ease, transform 0.3s ease'
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 应用描述 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        <h2 className="mb-2 text-lg font-bold">关于此应用</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {app.description}
        </p>
      </motion.div>

      {/* 相关应用 */}
      {app.similarApps && app.similarApps.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <h2 className="mb-3 text-lg font-bold">您可能也喜欢</h2>
          <div className="grid grid-cols-2 gap-3">
            {app.similarApps.map(appId => {
              const similarApp = featuredApps.find(a => a.id === appId);
              if (!similarApp) return null;
              return (
                <motion.div
                  key={similarApp.id}
                  whileHover={{ y: -3 }}
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                >
                  <img
                    src={similarApp.icon}
                    alt={similarApp.name}
                    className="w-10 h-10 mb-2 rounded-lg mx-auto"
                  />
                  <h3 className="text-sm font-medium text-center truncate">
                    {similarApp.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {similarApp.category}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
