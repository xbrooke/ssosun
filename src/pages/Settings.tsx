import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { motion } from 'framer-motion';
import { useTheme, useDeviceDetect } from '@/hooks/useTheme';
import { toast } from 'sonner';

export default function Settings() {
  const { isDark, theme } = useTheme();
  const { isMobile } = useDeviceDetect();
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    // 收集调试信息
    const info = `安卓调试信息:
设备型号: ${navigator.userAgent}
平台: ${navigator.platform}
语言: ${navigator.language}
在线状态: ${navigator.onLine ? '在线' : '离线'}
连接类型: ${navigator.connection ? navigator.connection.effectiveType : '未知'}
内存: ${navigator.deviceMemory || '未知'}GB
CPU核心: ${navigator.hardwareConcurrency || '未知'}
分辨率: ${window.screen.width}x${window.screen.height}
主题模式: ${theme}
时间: ${new Date().toLocaleString()}`;
    
    setDebugInfo(info);
  }, [theme]);

  const copyDebugInfo = () => {
    navigator.clipboard.writeText(debugInfo).then(() => {
      toast.success('调试信息已复制');
    }).catch(() => {
      toast.error('复制失败，请手动复制');
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <main className="ml-0 flex-1 p-4 transition-all duration-300 md:ml-64 lg:ml-72 md:p-8 text-gray-800 bg-gray-50 dark:text-gray-100 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold flex items-center">
              <i className="fas fa-cog mr-2 text-[var(--color-primary)]"></i>
              系统设置
            </h1>
          </motion.div>

          {/* 安卓调试信息卡片 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-[12px] p-6 shadow-sm mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <i className="fas fa-bug mr-2 text-green-500"></i>
                安卓调试信息
              </h2>
              <motion.button
                onClick={copyDebugInfo}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-[4px] bg-[var(--color-primary)] text-white text-sm font-medium"
              >
                <i className="fa-solid fa-copy mr-2"></i>
                复制信息
              </motion.button>
            </div>

            <div className="space-y-3">
              {debugInfo.split('\n').map((line, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">{line.split(':')[0]}:</span>
                  <span className="font-medium">{line.split(':').slice(1).join(':')}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 其他设置项占位 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-[12px] p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">其他设置</h2>
            <p className="text-gray-500 dark:text-gray-400">更多设置功能即将上线</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
