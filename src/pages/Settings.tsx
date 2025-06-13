import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface SettingsProps {
  // 可添加props定义
}

declare global {
  interface Window {
    android?: {
      startActivity?: (action: string) => void;
    };
  }
}

export default function Settings(props: SettingsProps) {
  const [isAndroid, setIsAndroid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [browserName, setBrowserName] = useState('');

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsAndroid(/android/.test(ua));

    if (/micromessenger/.test(ua)) {
      setBrowserName('微信内置浏览器');
    } else if (/alipayclient/.test(ua)) {
      setBrowserName('支付宝内置浏览器');
    } else if (/chrome/.test(ua)) {
      setBrowserName('Chrome 浏览器');
    } else {
      setBrowserName('其他浏览器');
    }
  }, []);

  const openAndroidSettings = () => {
    if (!isAndroid) {
      toast.error('此功能仅在安卓设备上可用');
      return;
    }

    setIsLoading(true);

    // Step 1: 调用 JSBridge（如果存在）
    if (window.android?.startActivity) {
      window.android.startActivity('android.settings.SETTINGS');
      finishWithTimeout();
      return;
    }

    // Step 2: 尝试 intent URI 跳转
    const intentUri =
      'intent:#Intent;action=android.settings.SETTINGS;S.browser_fallback_url=https://support.google.com/android/answer/9075928;end';

    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = intentUri;
      document.body.appendChild(iframe);

      finishWithTimeout();
    } catch (error) {
      toast.error('跳转失败，请使用系统浏览器打开或手动设置');
      setIsLoading(false);
    }
  };

  // 跳转后等待页面切换，如果没切换就报错
  const finishWithTimeout = () => {
    setTimeout(() => {
      if (!document.hidden) {
        toast.error('未能成功打开设置，请使用系统浏览器重试');
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 text-gray-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto"
      >
        <h1 className="text-2xl font-bold mb-4">打开系统设置（安卓）</h1>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <p className="mb-4">
            本功能尝试通过浏览器直接打开安卓系统设置页面。当前环境：
            <span className="font-semibold text-blue-600 dark:text-blue-300 ml-2">{browserName}</span>
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openAndroidSettings}
            disabled={isLoading}
            className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium text-white shadow ${
              isLoading
                ? 'bg-gray-400 dark:bg-gray-600'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
            }`}
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                正在尝试打开设置...
              </>
            ) : (
              <>
                <i className="fa-solid fa-gear mr-2"></i>
                打开系统设置
              </>
            )}
          </motion.button>

          {browserName.includes('微信') && (
            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-100 rounded text-sm">
              <i className="fa-solid fa-triangle-exclamation mr-1"></i>
              当前为微信浏览器，部分跳转方式可能无效，建议复制链接到系统浏览器打开。
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// 保留原组件名称导出以兼容现有引用
export const AndroidSettingsJump = Settings;
