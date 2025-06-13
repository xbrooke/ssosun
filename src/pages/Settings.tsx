import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

/**
 * 安卓设置跳转方案说明：
 * 1. WebView环境优先方案：
 *    - 通过Android Bridge直接调用原生API
 *    - 使用intent URI跳转(需要WebView配置支持)
 * 2. 普通浏览器环境方案：
 *    - 尝试多种intent URI格式
 *    - 使用iframe方式触发intent
 *    - 直接调用Android JS接口(如果存在)
 * 3. 错误处理：
 *    - 超时检测
 *    - 多种方案回退机制
 *    - 详细的用户反馈
 */
export default function Settings() {
  const { isDark, theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    // 检测运行环境
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(/android/.test(userAgent));
    setIsWebView(/(webview|wv)/.test(userAgent));
  }, []);

  /**
   * 尝试WebView环境下的跳转方案
   */
  const tryWebViewApproach = () => {
    try {
      // 方案1: 通过Android Bridge直接调用
      if (window.AndroidBridge && typeof window.AndroidBridge.openSettings === 'function') {
        window.AndroidBridge.openSettings();
        return true;
      }
      
      // 方案2: 使用intent URI跳转
      const intentUri = `intent:#Intent;action=android.settings.SETTINGS;package=com.android.settings;end`;
      window.location.href = intentUri;
      return true;
    } catch (e) {
      console.error('WebView跳转失败:', e);
      return false;
    }
  };

  /**
   * 尝试普通浏览器环境下的跳转方案
   */
  const tryBrowserApproach = () => {
    try {
      // 方案1: 标准intent URI
      const intentUri = 'intent:#Intent;action=android.settings.SETTINGS;end';
      
      // 方案2: 使用iframe触发intent
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = intentUri;
      document.body.appendChild(iframe);
      
      // 方案3: 直接调用Android JS接口
      if (window.android && typeof window.android.startActivity === 'function') {
        window.android.startActivity('android.settings.SETTINGS');
        return true;
      }
      
      return false;
    } catch (e) {
      console.error('浏览器跳转失败:', e);
      return false;
    }
  };

  const openAndroidSettings = () => {
    setIsLoading(true);
    try {
      if (isAndroid) {
        // WebView环境优先尝试专用方案
        if (isWebView && tryWebViewApproach()) {
          // 设置超时检测
          setTimeout(() => {
            if (!document.hidden) {
              toast.error('请在WebView配置中添加intent跳转支持');
            }
            setIsLoading(false);
          }, 1500);
          return;
        }

        // 普通浏览器环境尝试
        if (tryBrowserApproach()) {
          // 设置超时检测
          setTimeout(() => {
            if (!document.hidden) {
              toast.error('无法打开系统设置，请确保应用有相应权限');
            }
            setIsLoading(false);
          }, 1500);
          return;
        }

        throw new Error('所有跳转方案尝试失败');
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

  const copyDebugInfo = () => {
    const debugInfo = `调试信息：
设备类型: ${isAndroid ? 'Android' : '非Android'}
WebView环境: ${isWebView ? '是' : '否'}
当前主题: ${theme}
用户代理: ${navigator.userAgent}
屏幕分辨率: ${window.screen.width}x${window.screen.height}`;
    
    navigator.clipboard.writeText(debugInfo).then(() => {
      toast.success('调试信息已复制到剪贴板');
    }).catch(() => {
      toast.error('复制失败，请手动复制');
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex-1 p-4 md:p-8 text-gray-800 dark:text-gray-100">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <h1 className="text-2xl font-bold">系统设置</h1>
          
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
              </div>
            )}
          </div>

          {/* 新增调试信息版块 */}
          <div className="bg-white dark:bg-gray-800 rounded-[12px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">调试信息</h2>
              <motion.button
                onClick={copyDebugInfo}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-[4px] bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium"
              >
                <i className="fa-solid fa-copy mr-2"></i>
                复制信息
              </motion.button>
            </div>
            
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex">
                <span className="w-24 font-medium">设备类型:</span>
                <span>{isAndroid ? 'Android' : '非Android'}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">WebView环境:</span>
                <span>{isWebView ? '是' : '否'}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">当前主题:</span>
                <span>{theme}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">屏幕分辨率:</span>
                <span>{window.screen.width}x{window.screen.height}</span>
              </div>
              <div className="flex flex-col">
                <span className="w-24 font-medium">用户代理:</span>
                <span className="text-xs break-all mt-1">{navigator.userAgent}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}