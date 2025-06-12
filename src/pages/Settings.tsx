import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Settings() {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isWebView, setIsWebView] = useState(false);
  const [androidVersion, setAndroidVersion] = useState<number | null>(null);
  const [browserType, setBrowserType] = useState<string>('');

  useEffect(() => {
    // 增强环境检测逻辑
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroidDevice = /android/.test(userAgent);
    setIsAndroid(isAndroidDevice);
    setIsWebView(/(webview|wv)/.test(userAgent));
    
    // 检测浏览器类型
    if (/chrome/.test(userAgent)) {
      setBrowserType('chrome');
    } else if (/firefox/.test(userAgent)) {
      setBrowserType('firefox');
    } else if (/safari/.test(userAgent)) {
      setBrowserType('safari');
    } else {
      setBrowserType('other');
    }

    if (isAndroidDevice) {
      // 更精确的安卓版本提取
      const versionMatch = userAgent.match(/android\s([0-9\.]+)/);
      if (versionMatch && versionMatch[1]) {
        setAndroidVersion(parseFloat(versionMatch[1]));
      }
    }
  }, []);

  const openAndroidSettings = () => {
    setIsLoading(true);
    try {
      if (isAndroid) {
        // WebView环境下特殊处理
        if (isWebView) {
          try {
            // 方式1: 尝试通过Android Bridge调用
            if (window.AndroidBridge && typeof window.AndroidBridge.openSettings === 'function') {
              window.AndroidBridge.openSettings();
              return;
            }
            
            // 方式2: 针对不同安卓版本的WebView intent调用
            let intentUri;
            if (androidVersion && androidVersion >= 14) {
              intentUri = `intent:#Intent;action=android.settings.APP_NOTIFICATION_SETTINGS;package=${window.location.hostname};end`;
            } else if (androidVersion && androidVersion >= 9) {
              intentUri = `intent:#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;package=${window.location.hostname};end`;
            } else {
              intentUri = 'intent:#Intent;action=android.settings.SETTINGS;package=com.android.settings;end';
            }
            
            // 尝试iframe方式
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = intentUri;
            document.body.appendChild(iframe);
            
            // 尝试直接跳转
            window.location.href = intentUri;
            
            // 设置超时检测
            setTimeout(() => {
              if (!document.hidden) {
                toast.error(`
                  无法打开系统设置，请尝试以下方法：
                  ${androidVersion && androidVersion >= 9 
                    ? '1. 确保应用有通知权限设置权限\n'
                    : '1. 检查浏览器是否支持intent跳转\n'}
                  2. 尝试使用Chrome浏览器
                  3. 确保系统设置应用可用
                `);
              }
              setIsLoading(false);
            }, 1500);
            return;
          } catch (e) {
            console.error('WebView intent调用失败:', e);
          }
        }

        // 非WebView环境的多策略跳转
        const tryOpenSettings = () => {
          // 安卓14+使用最新的API
          if (androidVersion && androidVersion >= 14) {
            try {
              // 方式1: 尝试打开应用通知设置
              const intentUri = `intent:#Intent;action=android.settings.APP_NOTIFICATION_SETTINGS;package=${window.location.hostname};end`;
              
              // 方式2: 尝试打开应用信息页面
              const appInfoUri = `intent:#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;package=${window.location.hostname};end`;
              
              // 方式3: 尝试通用设置
              const settingsUri = 'intent:#Intent;action=android.settings.SETTINGS;end';
              
              // 尝试直接跳转
              window.location.href = intentUri;
              setTimeout(() => {
                if (!document.hidden) {
                  window.location.href = appInfoUri;
                  setTimeout(() => {
                    if (!document.hidden) {
                      window.location.href = settingsUri;
                    }
                  }, 500);
                }
              }, 500);
            } catch (e) {
              console.error('安卓14+跳转失败:', e);
            }
          } 
          // 安卓9-13版本
          else if (androidVersion && androidVersion >= 9) {
            try {
              const appInfoUri = `intent:#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;package=${window.location.hostname};end`;
              window.location.href = appInfoUri;
              setTimeout(() => {
                if (!document.hidden) {
                  window.location.href = 'intent:#Intent;action=android.settings.SETTINGS;end';
                }
              }, 500);
            } catch (e) {
              console.error('安卓9-13跳转失败:', e);
            }
          } 
          // 安卓8及以下版本
          else {
            try {
              window.location.href = 'intent:#Intent;action=android.settings.SETTINGS;end';
              setTimeout(() => {
                if (!document.hidden) {
                  window.location.href = 'package:com.android.settings';
                }
              }, 500);
            } catch (e) {
              console.error('传统方式跳转失败:', e);
            }
          }
        };

        tryOpenSettings();
        
        // 设置超时检测
        setTimeout(() => {
          if (!document.hidden) {
            toast.error(`
              无法打开系统设置，可能原因：
              1. 浏览器不支持intent跳转
              2. 系统设置应用不可用
              3. 当前安卓版本(${androidVersion})需要特殊权限
              建议：${browserType !== 'chrome' ? '尝试使用Chrome浏览器' : '检查系统权限设置'}
            `);
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

            {isWebView && (
              <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-[4px] text-sm">
                <i className="fa-solid fa-info-circle mr-2"></i>
                检测到WebView环境，可能需要额外配置才能打开系统设置
                {androidVersion && (
                  <div className="mt-2">
                    <i className="fa-solid fa-circle-info mr-1"></i>
                    安卓{androidVersion}版本需要特殊权限配置
                  </div>
                )}
              </div>
            )}

            {isAndroid && androidVersion && (
              <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-[4px] text-sm">
                <i className="fa-solid fa-mobile-screen mr-2"></i>
                检测到安卓 {androidVersion} 系统，当前浏览器: {browserType}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}