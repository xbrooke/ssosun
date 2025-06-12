import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Settings() {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // 检测是否在安卓环境中
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(/android/.test(userAgent));
  }, []);

  const openAndroidSettings = () => {
    setIsLoading(true);
    try {
      if (isAndroid) {
        // 尝试多种跳转方式
        const tryOpenSettings = () => {
          // 方式1: 使用标准的Android intent URI
          const intentUri = 'intent:#Intent;action=android.settings.SETTINGS;end';
          
          // 方式2: 使用通用设置路径
          const settingsUri = 'package:com.android.settings';
          
          // 方式3: 使用系统设置路径
          const systemSettingsUri = 'android.settings.SETTINGS';

          // 尝试iframe方式
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = intentUri;
          document.body.appendChild(iframe);
          
          // 尝试直接跳转
          try {
            window.location.href = intentUri;
          } catch (e) {
            console.log('方式1失败，尝试方式2');
            try {
              window.location.href = settingsUri;
            } catch (e) {
              console.log('方式2失败，尝试方式3');
              try {
                // 使用Android intent API
                if (window.android && typeof window.android.startActivity === 'function') {
                  window.android.startActivity(systemSettingsUri);
                }
              } catch (e) {
                console.error('所有方式尝试失败');
                throw new Error('无法找到有效的设置路径');
              }
            }
          }
        };

        tryOpenSettings();
        
        // 设置超时检测
        setTimeout(() => {
          if (!document.hidden) {
            toast.error('无法打开系统设置，请确保应用有相应权限');
          }
          setIsLoading(false);
        }, 1500);
      } else {
        toast.error('此功能仅在安卓设备上可用');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('打开系统设置失败:', error);
      toast.error(`打开设置失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex-1 p-4 md:p-8 text-gray-800 dark:text-gray-100">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-2xl font-bold mb-6">系统设置</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-[12px] p-6 shadow-sm">
            <h2 className="text-xl font-medium mb-4">安卓系统设置</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              点击下方按钮可直接跳转到安卓系统设置界面
            </p>
            
             <motion.button
              onClick={openAndroidSettings}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className={`w-full md:w-auto px-6 py-3 rounded-[4px] font-medium ${
                isLoading ? 'bg-gray-300 dark:bg-gray-600' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'
              } text-white shadow-sm transition-colors`}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                  {isAndroid ? '正在跳转...' : '检测设备...'}
                </>
              ) : (
                <>
                  <i className="fa-solid fa-gear mr-2"></i>
                  {isAndroid ? '打开系统设置' : '非安卓设备'}
                </>
              )}
            </motion.button>
            
            {!isAndroid && (
              <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-[4px] text-sm">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                此功能仅在安卓设备上可用
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}