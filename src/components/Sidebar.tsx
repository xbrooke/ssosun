import { Link, useLocation } from 'react-router-dom';
import { useTheme, useDeviceDetect } from '@/hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
 
export default function Sidebar() {
  const { isDark, toggleTheme } = useTheme();
  const { isMobile, isTablet } = useDeviceDetect();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setIsOpen(true);
      } else if (width >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { to: '/', icon: 'fab fa-github-alt', text: '所有应用' },
    { to: '/featured', icon: 'fas fa-book', text: '教程中心' },
    { to: '/wallpaper', icon: 'fas fa-image', text: '车机壁纸' },
    { to: '/developer', icon: 'fas fa-lock', text: '开发者中心', protected: true },
    { to: '/donate', icon: 'fas fa-heart', text: '赞赏支持' }
  ].map((item, index) => ({
    ...item,
    animation: {
      initial: { x: -20, opacity: 0 },
      animate: { 
        x: 0, 
        opacity: 1,
        transition: {
          delay: 0.1 * index,
          type: 'spring',
          stiffness: 500,
          damping: 25
        }
      }
    }
  }));

  return (
    <>
      {/* 移动端悬浮按钮 - Flyme 1.8风格 */}
      {isMobile && (
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed right-4 bottom-4 z-50 flex h-11 w-11 items-center justify-center rounded-[4px] bg-[var(--color-primary)] text-white shadow-sm transition-all active:scale-95"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
        </motion.button>
      )}

      {/* 侧边栏 - Flyme风格 */}
      <AnimatePresence>
        {(!isMobile || isOpen) && (
          <motion.div
            initial={{ x: isMobile ? '-100%' : 0 }}
            animate={{ x: 0 }}
            exit={{ x: isMobile ? '-100%' : 0 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 200,
              bounce: 0.2
            }}
            className={`
              fixed left-0 top-0 z-40 h-full
              ${isDark ? 'bg-[var(--color-bg-secondary)]' : 'bg-[var(--color-bg-secondary)]'}
              shadow-sm
              ${isMobile ? 'w-72' : 'md:w-64 lg:w-72'}
            `}
          >
            <div className="flex h-full flex-col p-4 md:p-6">
              {/* 移动端关闭按钮 */}
              {isMobile && (
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="mb-4 self-end rounded-[4px] p-2 hover:bg-[var(--color-primary-light)]/10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </motion.button>
              )}

              {/* 侧边栏内容 */}
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.h2 
                  className="mb-6 flex items-center text-xl font-bold md:text-2xl text-[var(--color-text-primary)]"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <i className="fa-brands fa-github-alt mr-3 text-[var(--color-primary)]"></i>
                   徐大兵的工具箱
                </motion.h2>
                 <ul className="space-y-1">

                     {menuItems.map((item) => (
                       <motion.li
                         key={item.to}
                         {...item.animation}
                         onClick={() => isMobile && setIsOpen(false)}
                       >
                         {item.external ? (
                           <a
                             href={item.to}
                             target="_blank"
                             rel="noopener noreferrer"
                            className={`
                              flex items-center rounded-[4px] p-3 text-sm
                              md:p-3 md:text-base
                              text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-lightest)]
                              transition-all duration-[var(--transition-duration)] ease-[var(--transition-easing)]
                            `}
                           >
                             <motion.div 
                               className={`
                                 mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[12px]
                                 md:h-8 md:w-8
                                 bg-[var(--color-primary-lightest)]
                               `}
                               whileHover={{ scale: 1.1 }}
                             >
                               <i className={`fa-solid ${item.icon} text-lg text-[var(--color-primary)]`}></i>
                             </motion.div>
                             <span className="font-medium">{item.text}</span>
                           </a>
                         ) : (
                           <Link 
                             to={item.to}
                            className={`
                              flex items-center rounded-[4px] p-3 text-sm
                              md:p-3 md:text-base
                              ${location.pathname === item.to 
                                ? 'bg-[var(--color-primary)] text-white shadow-primary'
                                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-lightest)]'}
                              transition-all duration-[var(--transition-duration)] ease-[var(--transition-easing)]
                            `}
                           >
                             <motion.div
                               className={`
                                 mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[12px]
                                 md:h-8 md:w-8
                                 ${location.pathname === item.to
                                   ? 'bg-white/20'
                                   : 'bg-[var(--color-primary-lightest)]'}
                               `}
                               whileHover={{ scale: 1.1 }}
                             >
                               <i className={`fa-solid ${item.icon} text-lg ${location.pathname === item.to ? 'text-white' : 'text-[var(--color-primary)]'}`}></i>
                             </motion.div>
                             <span className="font-medium">{item.text}</span>
                           </Link>
                         )}
                       </motion.li>
                     ))}

                </ul>
              </motion.div>

              {/* 主题切换 - Flyme风格 */}
               <motion.div 
                  className={`
                    mt-auto flex cursor-pointer items-center justify-between rounded-[4px] p-4 
                    hover:bg-[var(--color-primary)]/10 transition-colors duration-300
                  `}
                  onClick={() => {
                    console.log('切换主题按钮被点击，当前主题:', isDark ? 'dark' : 'light');
                    toggleTheme();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
               >
                  <motion.p 
                    className="text-sm font-medium text-[var(--color-text-primary)]"
                    key={isDark ? 'dark' : 'light'}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isDark ? '🌙 暗黑模式' : '☀️ 明亮模式'}
                  </motion.p>
                    <div className="relative h-6 w-12 rounded-[4px] bg-[var(--color-primary)]/10 border border-[var(--color-border)]">
                    <motion.div
                      className="absolute top-1 h-4 w-4 rounded-full bg-[var(--color-primary)]"
                      animate={{
                        left: isDark ? 'calc(100% - 1.25rem)' : '0.25rem'
                      }}
                      transition={{ 
                        type: 'tween',
                        ease: [0.25, 0.1, 0.25, 1],
                        duration: 0.3
                      }}
                    />
                  </div>
                </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 移动端遮罩层 */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black"
        />
      )}
    </>
  );
}
