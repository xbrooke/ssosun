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

  useEffect(() => {
    // 检测运行环境和安卓版本
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroidDevice = /android/.test(userAgent);
    setIsAndroid(isAndroidDevice);
    setIsWebView(/(webview|wv)/.test(userAgent));
    
    if (isAndroidDevice) {
      // 提取安卓版本号
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
            
            // 方式2: 尝试通用WebView intent调用
            const intentUri = androidVersion && androidVersion >= 9
              ? `intent:#Intent;action=android.settings.APP_NOTIFICATION_SETTINGS;package=${window.location.hostname};end`
              : `intent:#Intent;action=android.settings.SETTINGS;package=com.android.settings;end`;
            
            window.location.href = intentUri;
            
            // 设置超时检测
            setTimeout(() => {
              if (!document.hidden) {
                toast.error(androidVersion && androidVersion >= 9 
                  ? '请在WebView配置中添加通知设置权限'
                  : '请在WebView配置中添加以下代码允许intent跳转:\nwebView.getSettings().setJavaScriptEnabled(true);\nwebView.setWebViewClient(new WebViewClient() {\n  @Override\n  public boolean shouldOverrideUrlLoading(WebView view, String url) {\n    if (url.startsWith("intent:")) {\n      try {\n        Context context = view.getContext();\n        Intent intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);\n        context.startActivity(intent);\n        return true;\n      } catch (Exception e) {\n        e.printStackTrace();\n      }\n    }\n    return false;\n  }\n});');
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
          // 安卓9+使用新的API
          if (androidVersion && androidVersion >= 9) {
            try {
              // 方式1: 尝试打开应用通知设置
              const intentUri = `intent:#Intent;action=android.settings.APP_NOTIFICATION_SETTINGS;package=${window.location.hostname};end`;
              
              // 方式2: 尝试打开应用信息页面
              const appInfoUri = `intent:#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;package=${window.location.hostname};end`;
              
              // 尝试iframe方式
              const iframe = document.createElement('iframe');
              iframe.style.display = 'none';
              iframe.src = intentUri;
              document.body.appendChild(iframe);
              
              // 尝试直接跳转
              try {
                window.location.href = intentUri;
                setTimeout(() => {
                  if (!document.hidden) {
                    window.location.href = appInfoUri;
                  }
                }, 500);
              } catch (e) {
                console.error('安卓9+跳转失败:', e);
                throw new Error('请检查应用权限设置');
              }
            } catch (e) {
              console.error('安卓9+设置跳转失败:', e);
              throw e;
            }
          } else {
            // 安卓9以下使用传统方式
            const intentUri = 'intent:#Intent;action=android.settings.SETTINGS;end';
            const settingsUri = 'package:com.android.settings';
            
            try {
              window.location.href = intentUri;
              setTimeout(() => {
                if (!document.hidden) {
                  window.location.href = settingsUri;
                }
              }, 500);
            } catch (e) {
              console.error('传统方式跳转失败:', e);
              throw new Error('无法找到有效的设置路径');
            }
          }
        };

        tryOpenSettings();
        
        // 设置超时检测
        setTimeout(() => {
          if (!document.hidden) {
            toast.error(androidVersion && androidVersion >= 9
              ? '请确保应用有通知权限设置权限'
              : '无法打开系统设置，请确保应用有相应权限');
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
                {androidVersion && androidVersion >= 9 && (
                  <div className="mt-2">
                    <i className="fa-solid fa-circle-info mr-1"></i>
                    安卓{androidVersion}及以上版本需要特殊权限配置
                  </div>
                )}
              </div>
            )}

            {isAndroid && androidVersion && (
              <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-[4px] text-sm">
                <i className="fa-solid fa-mobile-screen mr-2"></i>
                检测到安卓 {androidVersion} 系统
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}