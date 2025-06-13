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
    webkit?: {
      messageHandlers?: {
        startActivity?: {
          postMessage: (action: string) => void;
        };
      };
    };
  }
}

export default function Settings(props: SettingsProps) {
  const [isAndroid, setIsAndroid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [browserName, setBrowserName] = useState('');
  const [browserType, setBrowserType] = useState<'wechat'|'alipay'|'qq'|'system'|'other'>('other');
  const [osName, setOsName] = useState('');

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isAndroidDevice = /android/.test(ua);
    setIsAndroid(isAndroidDevice);

    // 检测操作系统
    if (isAndroidDevice) {
      setOsName('Android');
    } else if (/iphone|ipad|ipod/.test(ua)) {
      setOsName('iOS');
    } else if (/mac os/.test(ua)) {
      setOsName('macOS');
    } else if (/windows/.test(ua)) {
      setOsName('Windows');
    } else {
      setOsName('未知系统');
    }

    // 更精确的浏览器检测
    if (/micromessenger/.test(ua)) {
      setBrowserName('微信内置浏览器');
      setBrowserType('wechat');
    } else if (/alipayclient/.test(ua)) {
      setBrowserName('支付宝内置浏览器');
      setBrowserType('alipay');
    } else if (/qq\//.test(ua)) {
      setBrowserName('QQ内置浏览器');
      setBrowserType('qq');
    } else if (/chrome/.test(ua)) {
      setBrowserName('Chrome浏览器');
      setBrowserType('system');
    } else if (/firefox/.test(ua)) {
      setBrowserName('Firefox浏览器');
      setBrowserType('system');
    } else if (/safari/.test(ua)) {
      setBrowserName('Safari浏览器');
      setBrowserType('system');
    } else {
      setBrowserName('其他浏览器');
      setBrowserType('other');
    }
  }, []);

  const openAndroidSettings = async () => {
    if (!isAndroid) {
      toast.error(`此功能仅在安卓设备上可用，当前系统: ${osName}`);
      return;
    }

    setIsLoading(true);

    try {
      // 层级1: 直接调用原生JSBridge
      if (window.android?.startActivity) {
        window.android.startActivity('android.settings.SETTINGS');
      } 
      // 层级2: 调用webkit message handlers (iOS/Android混合应用)
      else if (window.webkit?.messageHandlers?.startActivity) {
        window.webkit.messageHandlers.startActivity.postMessage('android.settings.SETTINGS');
      }
      // 层级3: 尝试多种intent URI方案
      else {
        const intentUris = [
          'intent://settings#Intent;scheme=android-app;action=android.settings.SETTINGS;end',
          'intent:#Intent;action=android.settings.SETTINGS;launchFlags=0x10000000;end',
          'intent:#Intent;action=android.settings.SETTINGS;S.browser_fallback_url=https://support.google.com/android/answer/9075928;end'
        ];

        let success = false;
        
        // 尝试所有URI方案
        for (const uri of intentUris) {
          try {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = uri;
            document.body.appendChild(iframe);
            setTimeout(() => document.body.removeChild(iframe), 1000);
            success = true;
            break;
          } catch (e) {
            continue;
          }
        }

        if (!success) {
          throw new Error('所有intent方案均失败');
        }
      }

      // 检查是否成功跳转
      setTimeout(() => {
        if (!document.hidden) {
          // 特殊浏览器处理
          if (browserType === 'wechat') {
            toast('微信浏览器限制较多，请点击右上角菜单选择"在浏览器打开"');
          } else if (browserType === 'alipay' || browserType === 'qq') {
            toast('当前浏览器限制跳转，请长按复制链接到系统浏览器打开');
          } else {
            toast.error('跳转失败，请尝试手动打开系统设置');
          }
        }
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast.error('跳转失败: ' + (error instanceof Error ? error.message : '未知错误'));
      
      // 提供备选方案
      if (browserType === 'system') {
        toast.info('您可以尝试手动打开手机设置 -> 系统设置');
      }
    }
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
          <div className="mb-4">
            <p className="mb-2">
              本功能尝试通过浏览器直接打开安卓系统设置页面。
            </p>
            <p>
              当前环境：
              <span className="font-semibold text-blue-600 dark:text-blue-300 ml-2">
                {osName} · {browserName}
              </span>
            </p>
          </div>

          {isAndroid ? (
            <>
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

              {browserType !== 'system' && (
                <div className={`mt-4 p-3 rounded text-sm ${
                  browserType === 'wechat' 
                    ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-100'
                    : 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200'
                }`}>
                  <i className={`fa-solid ${
                    browserType === 'wechat' ? 'fa-triangle-exclamation' : 'fa-info-circle'
                  } mr-1`}></i>
                  {browserType === 'wechat' 
                    ? '微信浏览器限制较多，建议复制链接到系统浏览器打开'
                    : '当前浏览器可能限制跳转，如失败请使用系统浏览器'}
                </div>
              )}
            </>
          ) : (
            <div className="p-4 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 rounded-lg">
              <div className="flex items-start">
                <i className="fa-solid fa-triangle-exclamation mt-1 mr-2"></i>
                <div>
                  <p className="font-medium">此功能仅适用于安卓设备</p>
                  <p className="text-sm mt-1">
                    当前设备运行的是 {osName} 系统，无法使用此功能。
                    {osName === 'iOS' && ' 请使用安卓设备访问此功能。'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// 保留原组件名称导出以兼容现有引用
export const AndroidSettingsJump = Settings;
