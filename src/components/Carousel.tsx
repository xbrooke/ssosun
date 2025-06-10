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
    <div className="relative h-96 overflow-hidden">
      <div className="flex h-full">
        {apps.map((app) => (
          <motion.div
            key={app.id}
            className="flex h-full w-full flex-shrink-0 items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
                  <Link 
                  to={`/app/${app.id}`}
                  className="mx-4 flex h-80 w-64 flex-col items-center rounded-[12px] bg-white p-6 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg dark:bg-[var(--color-bg-secondary)]"
                  style={{ transition: 'transform 0.2s cubic-bezier(0.2, 0, 0.1, 1), box-shadow 0.2s ease' }}
              >
                   <div className="relative mb-4 h-48 w-48">
                     <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-[12px] shadow-sm animate-pulse"></div>
                     <img 
                       src={app.icon} 
                       srcSet={`${app.icon} 1x, ${app.icon.replace('.jpg', '@2x.jpg')} 2x`}
                       alt={app.name}
                       className="relative h-full w-full rounded-[12px] object-contain opacity-0 transition-all duration-300 shadow-sm"
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
              </div>
              <h3 className={`mb-2 text-xl font-medium ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>{app.name}</h3>
              <p className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{app.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
