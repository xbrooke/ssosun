import { Link } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { tutorials } from '@/data/apps';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import React, { useState } from 'react';

const ArticleModal = ({ tutorial, onClose }: { tutorial: typeof tutorials[0], onClose: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-[12px] shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 新增的退出按钮 */}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-[var(--color-primary)] text-white shadow-lg flex items-center justify-center"
            aria-label="关闭"
          >
            <i className="fa-solid fa-xmark"></i>
          </motion.button>

          <div className="p-6">
            <div className="relative h-[80vh] w-full rounded-[12px] overflow-hidden border border-gray-200 dark:border-gray-700">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <i className="fa-solid fa-spinner animate-spin text-2xl text-[var(--color-primary)]"></i>
                </div>
              )}
              {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
                  <i className="fa-solid fa-exclamation-triangle text-3xl text-red-500 mb-4"></i>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    无法加载内容，请检查链接是否有效
                  </p>
                  <button 
                    onClick={() => window.open(tutorial.externalUrl, '_blank')}
                    className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-[4px]"
                  >
                    在新窗口打开
                  </button>
                </div>
              ) : (
                <iframe
                  src={tutorial.externalUrl}
                  className="w-full h-full border-0"
                  onLoad={() => setLoading(false)}
                  onError={() => {
                    setLoading(false);
                    setError(true);
                  }}
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Featured() {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedTutorial, setSelectedTutorial] = useState<typeof tutorials[0] | null>(null);

  const categories = ['全部', ...Array.from(new Set(tutorials.map(t => t.category)))];

  const filteredTutorials = selectedCategory === '全部' 
    ? tutorials 
    : tutorials.filter(t => t.category === selectedCategory);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <main className="ml-0 flex-1 p-4 transition-all duration-300 md:ml-64 lg:ml-72 md:p-8 text-gray-800 bg-gray-50 dark:text-gray-100 dark:bg-gray-900">

        <div className="sticky top-0 z-10 pt-4 pb-2 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold lg:text-3xl">车机教程中心</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              专业车机使用教程，助您掌握各项功能
            </p>
          </motion.div>
        </div>

        {/* 分类筛选 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
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
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 教程列表 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTutorials.map(tutorial => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="overflow-hidden rounded-[4px] bg-white dark:bg-gray-800 shadow-lg cursor-pointer"
              onClick={() => setSelectedTutorial(tutorial)}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={tutorial.cover}
                  alt={tutorial.title}
                  className="h-full w-full object-cover"
                />
                {tutorial.isFeatured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-sm text-xs">
                    精选教程
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {tutorial.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {tutorial.readTime}
                  </span>
                </div>

                <h2 className="text-xl font-bold mb-2">{tutorial.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {tutorial.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    作者: {tutorial.author}
                  </span>
                  <span className="text-[var(--color-primary)] text-sm font-medium">
                    阅读全文 →
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {tutorial.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedTutorial && (
          <ArticleModal 
            tutorial={selectedTutorial} 
            onClose={() => setSelectedTutorial(null)} 
          />
        )}

        {filteredTutorials.length === 0 && (
          <div className="rounded-2xl p-8 text-center bg-gray-100 dark:bg-gray-800">
            <i className="fa-solid fa-book-open text-4xl mb-4 text-gray-400"></i>
            <p className="text-lg text-gray-600 dark:text-gray-300">暂无相关教程</p>
          </div>
        )}
      </main>
    </div>
  );
}