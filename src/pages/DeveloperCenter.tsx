import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useTheme, useDeviceDetect } from '@/hooks/useTheme';

// 获取更详细的调试信息
  const getDetailedDebugInfo = (isAndroid: boolean, isWebView: boolean, theme: string, networkStatus: any) => {
    const now = new Date();
    const ua = navigator.userAgent.toLowerCase();
    const isVivo = /vivo/i.test(ua);
    const isOppo = /oppo/i.test(ua);
    const isCarDevice = /car|automotive/i.test(ua);
    
    return `=== 详细调试信息 ===
时间: ${now.toLocaleString()}
时间戳: ${now.getTime()}
时区: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
设备类型: ${isAndroid ? 'Android' : '非Android'}
设备厂商: ${isVivo ? 'VIVO' : isOppo ? 'OPPO' : isCarDevice ? '安卓车机' : '其他'}
WebView环境: ${isWebView ? '是' : '否'}
当前主题: ${theme}

=== 设备信息 ===
用户代理: ${navigator.userAgent}
屏幕分辨率: ${window.screen.width}x${window.screen.height} (${window.devicePixelRatio}x)
设备内存: ${navigator.deviceMemory || '未知'} GB
CPU核心数: ${navigator.hardwareConcurrency || '未知'}
操作系统: ${navigator.platform}
用户语言: ${navigator.language}
Cookie启用: ${navigator.cookieEnabled}
地理位置: ${'geolocation' in navigator ? '支持' : '不支持'}
触摸支持: ${'maxTouchPoints' in navigator ? navigator.maxTouchPoints : '未知'}
电池API: ${'getBattery' in navigator ? '支持' : '不支持'}

=== 网络状态 ===
在线状态: ${networkStatus.online ? '在线' : '离线'}
连接类型: ${networkStatus.type}
下载速度: ${networkStatus.downlink} Mbps
延迟时间: ${networkStatus.rtt} ms
节省数据模式: ${networkStatus.saveData ? '开启' : '关闭'}
网络变化事件: ${'onLine' in navigator ? '支持' : '不支持'}

=== 应用信息 ===
应用版本: v2.4.0
构建时间: 2025-06-10
IP地址: ${window.location.hostname || '未知'}
协议: ${window.location.protocol}
路径: ${window.location.pathname}
哈希: ${window.location.hash}
搜索参数: ${window.location.search}
`;
};



// 网络状态hook
const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState({
    online: navigator.onLine,
    type: navigator.connection?.effectiveType || 'unknown',
    downlink: navigator.connection?.downlink || 0,
    rtt: navigator.connection?.rtt || 0,
    saveData: navigator.connection?.saveData || false
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      setNetworkStatus({
        online: navigator.onLine,
        type: navigator.connection?.effectiveType || 'unknown',
        downlink: navigator.connection?.downlink || 0,
        rtt: navigator.connection?.rtt || 0,
        saveData: navigator.connection?.saveData || false
      });
    };

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    navigator.connection?.addEventListener('change', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      navigator.connection?.removeEventListener('change', updateNetworkStatus);
    };
  }, []);

  return networkStatus;
};

// 导出调试信息为文件
const exportDebugInfo = (data: string) => {
  const blob = new Blob([data], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `debug-info-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};



export default function DeveloperCenter() {
  const { isDark, theme } = useTheme();
  const { isMobile } = useDeviceDetect();
  const navigate = useNavigate();
  // 口令管理状态
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 口令状态管理
  const [passwords, setPasswords] = useState({
    permanentPasswords: ['123321', '010203'] // 支持多个密码
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.permanentPasswords.includes(password)) {
      setIsAuthenticated(true);
      const authData = {
        timestamp: Date.now(),
        valid: true
      };
      localStorage.setItem('devAuth', JSON.stringify(authData));
      toast.success('密码验证成功，5分钟内免验证');
    } else {
      toast.error('密码错误，请重试');
    }
  };

  // 检查缓存是否有效
  const checkAuthCache = () => {
    const authData = localStorage.getItem('devAuth');
    if (!authData) return false;
    
    try {
      const { timestamp, valid } = JSON.parse(authData);
      if (!valid) return false;
      
      const currentTime = Date.now();
      const fiveMinutes = 5 * 60 * 1000; // 5分钟毫秒数
      
      if (currentTime - timestamp <= fiveMinutes) {
        setIsAuthenticated(true);
        return true;
      }
      
      // 缓存过期，清除存储
      localStorage.removeItem('devAuth');
      return false;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    // 设置多个密码
    setPasswords({
      permanentPasswords: ['123321', '010203']
    });

    // 设备检测
    const ua = navigator.userAgent.toLowerCase();
    setIsAndroid(/android/.test(ua));
    setIsWebView(/webview|micromessenger|weibo|qq/.test(ua));
    
    // 检查缓存验证
    checkAuthCache();

    // 检测VIVO、OPPO和车机设备
    const isVivo = /vivo/i.test(ua);
    const isOppo = /oppo/i.test(ua);
    const isCarDevice = /car|automotive/i.test(ua);
    
    if (isVivo || isOppo || isCarDevice) {
      console.log(`检测到特殊设备: ${isVivo ? 'VIVO' : isOppo ? 'OPPO' : '安卓车机'}`);
    }
  }, []);

  

  const [isLoading, setIsLoading] = useState(false);
  const [fileManagerLoading, setFileManagerLoading] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isWebView, setIsWebView] = useState(false);
  const [initialized, setInitialized] = useState(true); // 默认设为true避免无限加载
  const networkStatus = useNetworkStatus();





  const handleLogout = () => {
    localStorage.removeItem('devAuth');
    setIsAuthenticated(false);
    toast('已退出开发者模式');
    navigate('/');
  };

  const tryWebViewApproach = () => {
    try {
      if (window.AndroidBridge && typeof window.AndroidBridge.openSettings === 'function') {
        window.AndroidBridge.openSettings();
        return true;
      }
      
      const intentUri = `intent:#Intent;action=android.settings.SETTINGS;package=com.android.settings;end`;
      window.location.href = intentUri;
      return true;
    } catch (e) {
      console.error('WebView跳转失败:', e);
      return false;
    }
  };

  const tryBrowserApproach = () => {
    try {
      const intentUri = 'intent:#Intent;action=android.settings.SETTINGS;end';
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = intentUri;
      document.body.appendChild(iframe);
      
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

  const openFileManager = async () => {
    setFileManagerLoading(true);
    setCurrentSchemes(fileManagerSchemes);
    setCurrentSchemeIndex(0);
    setSchemeStatus('idle');
    setIsSchemeModalOpen(true);
    setFileManagerLoading(false);
  };

  const [currentSchemeIndex, setCurrentSchemeIndex] = useState(0);
  const [currentSchemes, setCurrentSchemes] = useState<typeof jumpSchemes>([]);
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState(false);
  const [schemeStatus, setSchemeStatus] = useState<'idle' | 'trying' | 'success' | 'failed'>('idle');

  const jumpSchemes = [
    {
      name: 'WebView Bridge',
      description: '通过WebView原生桥接方式跳转',
      execute: () => {
        if (window.AndroidBridge && typeof window.AndroidBridge.openEngineeringMode === 'function') {
          window.AndroidBridge.openEngineeringMode();
          return true;
        }
        return false;
      },
      icon: 'fa-brands fa-android'
    },
    {
      name: '标准Intent',
      description: '使用Android标准Intent跳转',
      execute: () => {
        window.location.href = 'intent:#Intent;action=android.settings.SETTINGS;end';
        return true;
      },
      icon: 'fa-solid fa-mobile-screen'
    },
    {
      name: '厂商特定方案',
      description: '尝试VIVO/OPPO等厂商特定跳转方式',
      execute: () => {
        const ua = navigator.userAgent.toLowerCase();
        if (/vivo/i.test(ua)) {
          window.location.href = 'intent:#Intent;action=com.vivo.safe.settings.MoreSettingsActivity;end';
          return true;
        }
        if (/oppo/i.test(ua)) {
          window.location.href = 'intent:#Intent;action=com.coloros.settings.feature.sound.controller.DefaultSoundSettingsActivity;end';
          return true;
        }
                          if (/car|automotive/i.test(ua)) {
                            window.location.href = 'intent:#Intent;action=android.settings.SETTINGS;package=com.geely.settings;end';
                            return true;
                          }
        return false;
      },
      icon: 'fa-solid fa-mobile-screen-button'
    },
    {
      name: '浏览器跳转',
      description: '通过浏览器兼容方式跳转',
      execute: () => tryBrowserApproach(),
      icon: 'fa-solid fa-globe'
    }
  ];

  const fileManagerSchemes = [
    {
      name: 'WebView Bridge',
      description: '通过WebView原生桥接方式跳转',
      execute: () => {
        if (window.AndroidBridge && typeof window.AndroidBridge.openFileManager === 'function') {
          window.AndroidBridge.openFileManager();
          return true;
        }
        return false;
      },
      icon: 'fa-brands fa-android'
    },
    {
      name: '标准Intent',
      description: '使用Android标准Intent跳转',
      execute: () => {
        window.location.href = 'intent:#Intent;action=android.intent.action.VIEW;type=resource/folder;end';
        return true;
      },
      icon: 'fa-solid fa-mobile-screen'
    },
    {
      name: '厂商特定方案',
      description: '尝试VIVO/OPPO等厂商特定跳转方式',
      execute: () => {
        const ua = navigator.userAgent.toLowerCase();
        if (/vivo/i.test(ua)) {
          window.location.href = 'intent:#Intent;action=com.vivo.filemanager;end';
          return true;
        }
        if (/oppo/i.test(ua)) {
          window.location.href = 'intent:#Intent;action=com.coloros.filemanager;end';
          return true;
        }
        if (/car|automotive/i.test(ua)) {
          window.location.href = 'intent:#Intent;action=android.intent.action.VIEW;package=com.android.documentsui;end';
          return true;
        }
        return false;
      },
      icon: 'fa-solid fa-mobile-screen-button'
    },
    {
      name: '浏览器跳转',
      description: '通过浏览器兼容方式跳转',
      execute: () => {
        try {
          window.open('content://com.android.externalstorage.documents/root/primary', '_blank');
          return true;
        } catch (e) {
          return false;
        }
      },
      icon: 'fa-solid fa-globe'
    }
  ];

  const tryNextScheme = async () => {
    if (currentSchemeIndex >= jumpSchemes.length - 1) {
      // 所有方案都尝试完毕
      setIsSchemeModalOpen(false);
      toast.error('所有跳转方案均失败', {
        description: '已尝试所有可用方案。请尝试手动打开设置应用',
        duration: 10000
      });
      return;
    }
    
    setCurrentSchemeIndex(currentSchemeIndex + 1);
    setSchemeStatus('idle');
  };

  const executeCurrentScheme = async () => {
    const scheme = jumpSchemes[currentSchemeIndex];
    setSchemeStatus('trying');
    
    try {
      const success = await new Promise<boolean>((resolve) => {
        const executed = scheme.execute();
        if (!executed) {
          resolve(false);
          return;
        }
        
        setTimeout(() => {
          resolve(!document.hidden);
        }, 1500);
      });

      if (success) {
        setSchemeStatus('success');
        setTimeout(() => setIsSchemeModalOpen(false), 1000);
      } else {
        setSchemeStatus('failed');
      }
    } catch (e) {
      console.error(`${scheme.name}方案失败:`, e);
      setSchemeStatus('failed');
    }
  };

  const openAndroidSettings = async () => {
    setIsLoading(true);
    setCurrentSchemeIndex(0);
    setSchemeStatus('idle');
    setIsSchemeModalOpen(true);
    setIsLoading(false);
  };

  const [isAutoMode, setIsAutoMode] = useState(true);

  const SchemeModal = () => (
    <AnimatePresence>
      {isSchemeModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-[12px] p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center">
                <i className="fas fa-cog mr-2 text-[var(--color-primary)]"></i>
                打开系统设置
              </h3>
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-[4px] p-1">
                <button
                  onClick={() => setIsAutoMode(true)}
                  className={`px-3 py-1 text-sm rounded-[4px] ${isAutoMode ? 'bg-[var(--color-primary)] text-white' : 'text-gray-600 dark:text-gray-300'}`}
                >
                  自动模式
                </button>
                <button
                  onClick={() => setIsAutoMode(false)}
                  className={`px-3 py-1 text-sm rounded-[4px] ${!isAutoMode ? 'bg-[var(--color-primary)] text-white' : 'text-gray-600 dark:text-gray-300'}`}
                >
                  手动模式
                </button>
              </div>
            </div>

            {isAutoMode ? (
              <>
                <div className="space-y-4 mb-6">
                  {jumpSchemes.map((scheme, index) => (
                    <div key={scheme.name} className={`p-4 rounded-[8px] border ${
                      index === currentSchemeIndex 
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-lightest)] dark:bg-gray-700'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}>
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                          index < currentSchemeIndex 
                            ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
                            : index === currentSchemeIndex
                            ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
                        }`}>
                          {index < currentSchemeIndex ? (
                            <i className="fa-solid fa-check"></i>
                          ) : (
                            <i className={`fa-solid ${scheme.icon}`}></i>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{scheme.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{scheme.description}</p>
                        </div>
                        {index === currentSchemeIndex && (
                          <div className="ml-4">
                            {schemeStatus === 'idle' && (
                              <span className="text-sm text-gray-500 dark:text-gray-400">等待尝试</span>
                            )}
                            {schemeStatus === 'trying' && (
                              <span className="text-sm text-yellow-500">
                                <i className="fa-solid fa-spinner animate-spin mr-1"></i>
                                尝试中...
                              </span>
                            )}
                            {schemeStatus === 'success' && (
                              <span className="text-sm text-green-500">
                                <i className="fa-solid fa-check mr-1"></i>
                                成功
                              </span>
                            )}
                            {schemeStatus === 'failed' && (
                              <span className="text-sm text-red-500">
                                <i className="fa-solid fa-xmark mr-1"></i>
                                失败
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3">
                  {schemeStatus === 'idle' && (
                    <button
                      onClick={executeCurrentScheme}
                      className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[4px]"
                    >
                      尝试此方案
                    </button>
                  )}
                  {schemeStatus === 'failed' && (
                    <button
                      onClick={tryNextScheme}
                      className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[4px]"
                    >
                      尝试下一个方案
                    </button>
                  )}
                  <button
                    onClick={() => setIsSchemeModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-[4px]"
                  >
                    取消
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {jumpSchemes.map((scheme, index) => (
                  <motion.div
                    key={scheme.name}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setCurrentSchemeIndex(index);
                      executeCurrentScheme();
                    }}
                    className={`p-4 rounded-[8px] border border-gray-200 dark:border-gray-700 cursor-pointer ${
                      index === currentSchemeIndex && schemeStatus === 'trying' 
                        ? 'bg-[var(--color-primary-lightest)] dark:bg-gray-700'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        index < currentSchemeIndex 
                          ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
                          : 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                      }`}>
                        <i className={`fa-solid ${scheme.icon}`}></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{scheme.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{scheme.description}</p>
                      </div>
                      {index === currentSchemeIndex && schemeStatus === 'trying' && (
                        <i className="fa-solid fa-spinner animate-spin text-[var(--color-primary)]"></i>
                      )}
                    </div>
                  </motion.div>
                ))}
                <button
                  onClick={() => setIsSchemeModalOpen(false)}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-[4px] mt-4"
                >
                  取消
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const getDebugInfo = () => {
    return `=== 系统调试信息 ===
时间: ${new Date().toLocaleString()}
设备类型: ${isAndroid ? 'Android' : '非Android'}
WebView环境: ${isWebView ? '是' : '否'}
当前主题: ${theme}

=== 设备信息 ===
用户代理: ${navigator.userAgent}
屏幕分辨率: ${window.screen.width}x${window.screen.height}
设备内存: ${navigator.deviceMemory || '未知'} GB
CPU核心数: ${navigator.hardwareConcurrency || '未知'}
操作系统: ${navigator.platform}
用户语言: ${navigator.language}

=== 网络状态 ===
在线状态: ${networkStatus.online ? '在线' : '离线'}
连接类型: ${networkStatus.type}
下载速度: ${networkStatus.downlink} Mbps
延迟时间: ${networkStatus.rtt} ms
节省数据模式: ${networkStatus.saveData ? '开启' : '关闭'}

=== 应用信息 ===
应用版本: v2.4.0
构建时间: 2025-06-10
IP地址: ${window.location.hostname || '未知'}`;
  };

  const copyDebugInfo = () => {
    navigator.clipboard.writeText(getDebugInfo()).then(() => {
      toast.success('调试信息已复制到剪贴板');
    }).catch(() => {
      toast.error('复制失败，请手动复制');
    });
  };

  const exportDebugInfoToFile = () => {
    exportDebugInfo(getDebugInfo());
    toast.success('调试信息已导出为文件');
  };


  // 显示加载状态
  if (!initialized) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-[12px] p-8 shadow-lg text-center"
          >
            <img 
              src="https://h.xbrooke.cn/img/yg/mona-loading-default.gif" 
              alt="加载中"
              className="w-32 h-32 mx-auto mb-4 object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Loading%20animation%2C%20simple%20design&sign=71ca7f3b20de1ffe09dfb6ca05d09f6c';
              }}
            />
            <h2 className="text-2xl font-bold">加载中...</h2>
            <p className="text-gray-600 dark:text-gray-300">
              正在检查认证状态
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const qrCodePrompt = encodeURIComponent('WeChat Official Account QR code, clean design, white background, centered, Flyme Auto 1.8 style');
    const qrCodeUrl = `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%24%7BqrCodePrompt%7D&sign=9213868853f87daf5510ea1737824f94`;

    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-[12px] p-8 shadow-lg"
          >
            <div className="text-center mb-6">
              <i className="fas fa-lock text-4xl text-[var(--color-primary)] mb-4"></i>
              <h2 className="text-2xl font-bold">开发者中心</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                请扫码关注公众号获取访问口令
              </p>
              
                {/* 公众号二维码 */}
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="mb-6"
                >
                  <div className="flex justify-center">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-[12px] shadow-lg">
                      <div className="flex justify-center p-2 bg-white dark:bg-gray-700 rounded-[8px] border-2 border-gray-100 dark:border-gray-600">
                         <img
                           src="https://h.xbrooke.cn/img/yg/qrcode.jpg"
                           alt="公众号二维码"
                           className="w-40 h-40 object-contain"
                           onError={(e) => {
                            e.currentTarget.src = 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=WeChat%20Official%20Account%20QR%20code%2C%20clean%20design%2C%20white%20background%2C%20centered%2C%20Flyme%20Auto%201.8%20style&sign=c5090cf0e32a1fc08f19a2239be1f0f3';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
                    请使用微信扫码关注公众号，回复"开发者"获取访问口令
                  </p>
                </motion.div>
            </div>

               <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  输入开发者口令
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-[4px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                  placeholder="请输入开发者口令"
                  required
                />
              </div>
  

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 px-4 bg-[var(--color-primary)] text-white rounded-[4px] font-medium"
              >
                验证
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold"
            >
              <i className="fas fa-code mr-2 text-[var(--color-primary)]"></i>
              开发者中心
            </motion.h1>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-red-500 text-white rounded-[4px] text-sm"
            >
              退出
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 系统信息卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-[12px] p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <i className="fas fa-desktop mr-2 text-blue-500"></i>
                系统信息
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">设备类型</span>
                  <span className="font-medium">{isMobile ? '移动设备' : '桌面设备'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">操作系统</span>
                  <span className="font-medium">{navigator.platform}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">屏幕分辨率</span>
                  <span className="font-medium">{window.screen.width}x{window.screen.height}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">设备内存</span>
                  <span className="font-medium">{navigator.deviceMemory || '未知'} GB</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">CPU核心数</span>
                  <span className="font-medium">{navigator.hardwareConcurrency || '未知'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">用户语言</span>
                  <span className="font-medium">{navigator.language}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-300">当前主题</span>
                  <span className="font-medium">{theme}</span>
                </div>
              </div>
            </motion.div>

            {/* 调试信息卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-gray-800 rounded-[12px] p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <i className="fas fa-bug mr-2 text-green-500"></i>
                  调试信息
                </h2>
                <div className="flex gap-2">
                  <motion.button
                    onClick={copyDebugInfo}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-3 py-1.5 rounded-[4px] bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium"
                  >
                    <i className="fa-solid fa-copy mr-1"></i>
                    复制
                  </motion.button>
                  <motion.button
                    onClick={exportDebugInfoToFile}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-3 py-1.5 rounded-[4px] bg-[var(--color-primary)] text-white text-sm font-medium"
                  >
                    <i className="fa-solid fa-download mr-1"></i>
                    导出
                  </motion.button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">应用版本</span>
                  <span className="font-medium">v2.4.0</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">构建时间</span>
                  <span className="font-medium">2025-06-10</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">IP地址</span>
                  <span className="font-medium">{window.location.hostname || '未知'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">用户代理</span>
                  <span className="font-medium text-xs">{navigator.userAgent}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">连接类型</span>
                  <span className="font-medium">{navigator.connection ? navigator.connection.effectiveType : '未知'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-300">在线状态</span>
                  <span className="font-medium">{navigator.onLine ? '在线' : '离线'}</span>
                </div>
              </div>
            </motion.div>

            {/* 工程模式卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-[12px] p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <i className="fas fa-tools mr-2 text-orange-500"></i>
                工程模式
              </h2>
               
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  提供多种方式跳转到车机工程模式界面
                </p>
                <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-[8px]">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-300">
                    <i className="fa-solid fa-screwdriver-wrench"></i>
                  </div>
                  <div>
                    <h4 className="font-medium">工程模式</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">com.ecarx.engineeringmodel</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                 <motion.button
                   onClick={() => {
                     window.location.href = 'intent:#Intent;action=android.settings.SETTINGS;package=com.ecarx.engineeringmodel;end';
                   }}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="w-full px-4 py-2 rounded-[4px] font-medium bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white shadow-sm transition-colors"
                 >
                   <i className="fa-solid fa-screwdriver-wrench mr-2"></i>
                   直接打开工程模式
                 </motion.button>
                
                <motion.button
                  onClick={() => {
                    setCurrentSchemes([
                      {
                        name: 'WebView Bridge',
                        description: '通过WebView原生桥接方式跳转',
                        execute: () => {
                          if (window.AndroidBridge && typeof window.AndroidBridge.openEngineeringMode === 'function') {
                            window.AndroidBridge.openEngineeringMode();
                            return true;
                          }
                          return false;
                        },
                        icon: 'fa-brands fa-android'
                      },
                      {
                        name: '标准Intent',
                        description: '使用Android标准Intent跳转',
                        execute: () => {
                          window.location.href = 'intent:#Intent;action=android.settings.SETTINGS;package=com.ecarx.engineeringmodel;end';
                          return true;
                        },
                        icon: 'fa-solid fa-mobile-screen'
                      },
                      {
                        name: '厂商特定方案',
                        description: '尝试VIVO/OPPO等厂商特定跳转方式',
                        execute: () => {
                          const ua = navigator.userAgent.toLowerCase();
                          if (/vivo/i.test(ua)) {
                            window.location.href = 'intent:#Intent;action=com.vivo.safe.settings.MoreSettingsActivity;package=com.ecarx.engineeringmodel;end';
                            return true;
                          }
                          if (/oppo/i.test(ua)) {
                            window.location.href = 'intent:#Intent;action=com.coloros.settings.feature.sound.controller.DefaultSoundSettingsActivity;package=com.ecarx.engineeringmodel;end';
                            return true;
                          }
                          if (/car|automotive/i.test(ua)) {
                            window.location.href = 'intent:#Intent;action=android.settings.SETTINGS;package=com.geely.settings;end';
                            return true;
                          }
                          return false;
                        },
                        icon: 'fa-solid fa-mobile-screen-button'
                      },
                      {
                        name: '浏览器跳转',
                        description: '通过浏览器兼容方式跳转',
                        execute: () => {
                          try {
                            window.open('intent:#Intent;action=android.settings.SETTINGS;package=com.ecarx.engineeringmodel;end', '_blank');
                            return true;
                          } catch (e) {
                            return false;
                          }
                        },
                        icon: 'fa-solid fa-globe'
                      }
                    ]);
                    setCurrentSchemeIndex(0);
                    setSchemeStatus('idle');
                    setIsSchemeModalOpen(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 rounded-[4px] font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 shadow-sm transition-colors"
                >
                  <i className="fa-solid fa-list-check mr-2"></i>
                  尝试多种跳转方案
                </motion.button>
              </div>
            </motion.div>

            {/* 安卓系统设置卡片 - 弹窗版 */}


            {/* 安卓系统设置卡片 - 弹窗版 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-[12px] p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <i className="fas fa-cog mr-2 text-purple-500"></i>
                安卓系统设置
              </h2>
                
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  将通过弹窗引导逐步尝试不同跳转方案，优先使用WebView Bridge方式
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-[8px]">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                      <i className="fa-brands fa-android"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">WebView Bridge</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">优先尝试的跳转方式</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-[8px]">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
                      <i className="fa-solid fa-mobile-screen"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">标准Intent</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Android标准跳转方式</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-[8px]">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300">
                      <i className="fa-solid fa-mobile-screen-button"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">厂商特定方案</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">VIVO/OPPO/车机等</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-[8px]">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-300">
                      <i className="fa-solid fa-car"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">领克车机设置</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">com.geely.settings</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-3">
                <motion.button
                  onClick={openAndroidSettings}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 rounded-[4px] font-medium bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white shadow-sm transition-colors"
                >
                  <i className="fa-solid fa-gear mr-2"></i>
                  尝试打开系统设置
                </motion.button>
                <motion.button
                  onClick={() => {
                    window.location.href = 'intent:#Intent;action=android.settings.SETTINGS;package=com.geely.settings;end';
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 rounded-[4px] font-medium bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-colors"
                >
                  <i className="fa-solid fa-car mr-2"></i>
                  打开领克车机设置
                </motion.button>
              </div>

              <SchemeModal />
            </motion.div>

          {/* 文件管理卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-[12px] p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <i className="fas fa-folder-open mr-2 text-blue-500"></i>
              文件管理
            </h2>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                提供多种方式跳转到文件管理界面
              </p>
              <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-[8px]">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                  <i className="fa-solid fa-folder"></i>
                </div>
                <div>
                  <h4 className="font-medium">文件管理</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">android.intent.action.VIEW</p>
                </div>
              </div>
            </div>

              {/* 操作按钮 - 与系统设置相同样式 */}
              <div className="space-y-3">
                <motion.button
                  onClick={() => {
                    window.location.href = 'intent:#Intent;action=android.intent.action.VIEW;type=resource/folder;end';
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 rounded-[4px] font-medium bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white shadow-sm transition-colors"
                >
                  <i className="fa-solid fa-folder-open mr-2"></i>
                  直接打开文件管理
                </motion.button>
                
                <motion.button
                  onClick={() => {
                    setCurrentSchemes(fileManagerSchemes);
                    setCurrentSchemeIndex(0);
                    setSchemeStatus('idle');
                    setIsSchemeModalOpen(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 rounded-[4px] font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 shadow-sm transition-colors"
                >
                  <i className="fa-solid fa-list-check mr-2"></i>
                  尝试多种跳转方案
                </motion.button>
              </div>
            </motion.div>


          </div>
        </div>
      </div>
    </div>
  );
}

