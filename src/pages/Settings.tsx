import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Settings() {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isWebView, setIsWebView] = useState(false);
  const [packageName, setPackageName] = useState('');

  useEffect(() => {
    // 增强环境检测
    const userAgent = navigator.userAgent.toLowerCase();
    const android = /android/.test(userAgent);
    setIsAndroid(android);
    setIsWebView(/(webview|wv)/.test(userAgent));
    
    // 尝试获取包名
    try {
      // 从URL获取包名
      const url = new URL(window.location.href);
      const host = url.hostname;
      if (host && host !== 'localhost' && host !== '127.0.0.1') {
        setPackageName(host);
      } else {
        // 尝试从WebView环境中获取
        if (window.AndroidBridge && typeof window.AndroidBridge.getPackageName === 'function') {
          setPackageName(window.AndroidBridge.getPackageName());
        }
      }
    } catch (e) {
      console.error('获取包名失败:', e);
    }
  }, []);

  const openAndroidSettings = () => {
    setIsLoading(true);
    try {
      if (!isAndroid) {
        toast.error('此功能仅在安卓设备上可用');
        setIsLoading(false);
        return;
      }

      // WebView环境下特殊处理
      if (isWebView) {
        try {
          // 方式1: 尝试通过Android Bridge调用
          if (window.AndroidBridge && typeof window.AndroidBridge.openAppSettings === 'function') {
            window.AndroidBridge.openAppSettings();
            return;
          }
          
          // 方式2: 尝试通用WebView intent调用
          const intentUri = `intent:#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;package=${packageName || window.location.hostname};end`;
          window.location.href = intentUri;
          
          // 设置超时检测
          setTimeout(() => {
            if (!document.hidden) {
              toast.error('请在WebView配置中添加以下代码允许intent跳转:\nwebView.getSettings().setJavaScriptEnabled(true);\nwebView.setWebViewClient(new WebViewClient() {\n  @Override\n  public boolean shouldOverrideUrlLoading(WebView view, String url) {\n    if (url.startsWith("intent:")) {\n      try {\n        Context context = view.getContext();\n        Intent intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);\n        context.startActivity(intent);\n        return true;\n      } catch (Exception e) {\n        e.printStackTrace();\n      }\n    }\n    return false;\n  }\n});');
            }
            setIsLoading(false);
          }, 1500);
          return;
        } catch (e) {
          console.error('WebView intent调用失败:', e);
        }
      }

      // 非WebView环境或WebView调用失败后的备用方案
      const tryOpenSettings = () => {
        // 尝试多种方式
        const methods = [
          // 方式1: 标准intent URI
          () => {
            const intentUri = `intent:#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;package=${packageName || window.location.hostname};end`;
            window.location.href = intentUri;
          },
          // 方式2: 通用设置路径
          () => {
            window.location.href = `package:${packageName || window.location.hostname}`;
          },
          // 方式3: 使用Android intent API
          () => {
            if (window.android && typeof window.android.startActivity === 'function') {
              window.android.startActivity('android.settings.APPLICATION_DETAILS_SETTINGS');
            }
          },
          // 方式4: 使用iframe方式
          () => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = `intent:#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;package=${packageName || window.location.hostname};end`;
            document.body.appendChild(iframe);
            setTimeout(() => document.body.removeChild(iframe), 100);
          }
        ];

        // 依次尝试各种方法
        for (const method of methods) {
          try {
            method();
            break;
          } catch (e) {
            console.log('方法调用失败:', e);
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
            <h2 className="text-xl font-medium mb-4">应用管理</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              点击下方按钮可直接跳转到安卓应用管理界面
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
                  <i className="fa-solid fa-mobile-screen mr-2"></i>
                  {isAndroid ? '打开应用管理' : '非安卓设备'}
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

            {packageName && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-[4px] text-sm">
                <i className="fa-solid fa-info-circle mr-2"></i>
                当前应用包名: {packageName}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}