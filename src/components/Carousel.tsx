import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { App } from '@/data/apps';
import { useTheme } from '@/hooks/useTheme';

interface CarouselProps {
  apps: App[];
}

export default function Carousel({ apps }: CarouselProps) {
  const { isDark } = useTheme();
  return (
    <div className="relative h-[420px] overflow-hidden">
      <div className="flex h-full">
        {apps.map((app) => (
          <motion.div
            key={app.id}
            className="flex h-full w-full flex-shrink-0 items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                type: 'spring',
                stiffness: 300,
                damping: 20
              }
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to={`/app/${app.id}`}
              className="mx-4 flex h-80 w-64 flex-col items-center rounded-[16px] bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-[var(--color-bg-secondary)]"
              style={{ 
                transition: 'all var(--transition-duration) var(--transition-easing)',
                transformOrigin: 'center bottom'
              }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: 'var(--shadow-xl)'
                }}
                whileTap={{ scale: 0.98 }}
                className="relative mb-4 h-48 w-48"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-lightest)] to-[var(--color-primary-light)] rounded-[16px] shadow-inner animate-pulse"></div>
                <img 
                  src={app.icon} 
                  srcSet={`${app.icon} 1x, ${app.icon.replace('.jpg', '@2x.jpg')} 2x`}
                  alt={app.name}
                  className="relative h-full w-full rounded-[16px] object-contain opacity-0 transition-all duration-300 shadow-md"
                  width="192"
                  height="192"
                  loading="lazy"
                  onLoad={(e) => {
                    e.currentTarget.classList.add('opacity-100');
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Default%20app%20icon%2C%20Flyme%20Auto%201.8%20style%2C%20flat%20design%2C%20rounded%20corners%2C%20white%20background&sign=afeefe9dfde8f3987adb6bca042bf797';
                    e.currentTarget.classList.add('opacity-100');
                  }}
                  style={{
                    transform: 'scale(0.98)',
                    transition: 'opacity 0.3s ease, transform 0.3s ease'
                  }}
                />
              </motion.div>
              <h3 className={`mb-2 text-xl font-semibold ${isDark ? 'text-white' : 'text-[var(--color-text-primary)]'}`}>{app.name}</h3>
              <p className={`text-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{app.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
