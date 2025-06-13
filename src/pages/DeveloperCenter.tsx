import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useTheme, useDeviceDetect } from '@/hooks/useTheme';

// 获取更详细的调试信息
const getDetailedDebugInfo = (isAndroid: boolean, isWebView: boolean, theme: string, networkStatus: any) => {
  const now = new Date();
  return `=== 详细调试信息 ===
时间: ${now.toLocaleString()}
时间戳: ${now.getTime()}
时区: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
设备类型: ${isAndroid ? 'Android' : '非Android'}
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
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileManagerLoading, setFileManagerLoading] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isWebView, setIsWebView] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const networkStatus = useNetworkStatus();


  // 初始化认证状态
  useEffect(() => {
    console.log('初始化认证状态检查...');
    const authStatus = localStorage.getItem('devAuth') === 'true';
    setIsAuthenticated(authStatus);
    
    // 确保路径正确恢复
    if (authStatus) {
      console.log('已认证用户，恢复路径状态');
    } else {
      console.log('未认证用户，保持当前路径');
    }
    
    setInitialized(true);
    console.log(`认证状态初始化完成: ${authStatus}`);
  }, []);

  // 监听路径变化
  useEffect(() => {
    const handleRouteChange = () => {
      if (!isAuthenticated && initialized) {
        console.log('路径变化时检查认证状态');
        const authStatus = localStorage.getItem('devAuth') === 'true';
        setIsAuthenticated(authStatus);
      }
    };
    
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [isAuthenticated, initialized]);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(/android/.test(userAgent));
    setIsWebView(/(webview|wv)/.test(userAgent));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123321') {
      localStorage.setItem('devAuth', 'true');
      setIsAuthenticated(true);
      toast.success('验证成功，欢迎开发者！');
    } else {
      toast.error('口令错误，请关注公众号获取正确口令');
    }
  };

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

  const openFileManager = () => {
    setFileManagerLoading(true);
    try {
      if (isAndroid) {
        // 显示跳转确认弹窗
        toast.custom((t) => (
          <div className="bg-white dark:bg-gray-800 rounded-[8px] p-4 shadow-lg max-w-sm">
            <h3 className="font-medium text-sm mb-2">确认打开文件管理</h3>
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">跳转方式:</p>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-[4px]">
                <p className="text-xs break-all">
                  {isWebView ? 'WebView Bridge' : 'Intent URL'}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">跳转链接:</p>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-[4px]">
                <p className="text-xs break-all">
                  {isWebView 
                    ? 'window.AndroidBridge.openFileManager()' 
                    : 'intent:#Intent;action=android.intent.action.VIEW;type=resource/folder;package=com.android.filemanager;end'}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  toast.dismiss(t);
                  setFileManagerLoading(false);
                }}
                className="px-3 py-1 text-xs rounded-[4px] bg-gray-100 dark:bg-gray-700"
              >
                取消
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t);
                  // 方案1: 优先尝试使用URL Scheme (content://)
                  try {
                    const contentUri = 'content://com.android.externalstorage.documents/root/primary';
                    window.location.href = contentUri;
                    setTimeout(() => {
                      if (!document.hidden) {
                        toast('如果未跳转，将尝试其他方案');
                      }
                      setFileManagerLoading(false);
                    }, 1500);
                    return;
                  } catch (e) {
                    console.log('使用content://跳转失败，尝试其他方案:', e);
                  }

                  // 方案2: 尝试使用Intent URL (与系统设置相同的方式)
                  try {
                    const intentUri = `intent:#Intent;action=android.intent.action.VIEW;type=resource/folder;package=com.android.filemanager;S.browser_fallback_url=https://filemanager.com;end`;
                    window.location.href = intentUri;
                    setTimeout(() => {
                      if (!document.hidden) {
                        toast('如果未跳转，将尝试其他方案');
                      }
                      setFileManagerLoading(false);
                    }, 1500);
                    return;
                  } catch (e) {
                    console.log('使用Intent URL跳转失败，尝试其他方案:', e);
                  }

                  // 方案3: 尝试WebView Bridge方式 (与系统设置相同)
                  if (isWebView) {
                    try {
                      if (window.AndroidBridge && typeof window.AndroidBridge.openFileManager === 'function') {
                        window.AndroidBridge.openFileManager();
                        setTimeout(() => {
                          if (!document.hidden) {
                            toast('如果未跳转，请尝试其他方案');
                          }
                          setFileManagerLoading(false);
                        }, 1500);
                        return;
                      }
                    } catch (e) {
                      console.log('WebView Bridge方式跳转失败:', e);
                    }
                  }

                  // 方案4: 浏览器环境下的跳转方案 (与系统设置相同)
                  if (!isWebView) {
                    try {
                      // 检测浏览器跳转支持
                      const canUseWindowOpen = typeof window.open === 'function';
                      const canUseIframe = 'createElement' in document;
                      
                      // 浏览器方式1: 使用window.open
                      if (canUseWindowOpen) {
                        const directResult = window.open('content://com.android.externalstorage.documents/root/primary', '_blank');
                        
                        // 检查是否成功打开
                        if (directResult) {
                          setTimeout(() => {
                            setFileManagerLoading(false);
                          }, 1500);
                          return;
                        }
                      }

                      // 浏览器方式2: 使用iframe跳转
                      if (canUseIframe) {
                        const iframe = document.createElement('iframe');
                        iframe.style.display = 'none';
                        iframe.src = 'content://com.android.externalstorage.documents/root/primary';
                        document.body.appendChild(iframe);
                        
                        // 浏览器方式3: 尝试Intent方式
                        const intentUri = `intent:#Intent;action=android.intent.action.VIEW;type=resource/folder;end`;
                        const intentIframe = document.createElement('iframe');
                        intentIframe.style.display = 'none';
                        intentIframe.src = intentUri;
                        document.body.appendChild(intentIframe);
                      }

                      setTimeout(() => {
                        if (!document.hidden) {
                          toast('如果未跳转，请尝试手动打开文件管理器');
                        }
                        setFileManagerLoading(false);
                      }, 1500);
                      return;
                    } catch (e) {
                      console.log('浏览器跳转方案失败:', e);
                    }
                  }

                  // 方案5: 尝试通用文件URI (备用方案)
                  try {
                    window.open('content://com.android.externalstorage.documents/root/primary');
                    setTimeout(() => {
                      if (!document.hidden) {
                        toast('如果未跳转，请手动打开文件管理器');
                      }
                      setFileManagerLoading(false);
                    }, 1500);
                    return;
                  } catch (e) {
                    console.log('通用文件URI跳转失败:', e);
                  }

                  // 所有方案都失败
                  toast.error('无法打开文件管理，请手动打开文件管理器');
                  setFileManagerLoading(false);
                }}
                className="px-3 py-1 text-xs rounded-[4px] bg-[var(--color-primary)] text-white"
              >
                确认
              </button>
            </div>
          </div>
        ), { duration: 10000 });
      } else {
        toast.error('此功能仅在安卓设备上可用');
        setFileManagerLoading(false);
      }
    } catch (error) {
      console.error('打开文件管理失败:', error);
      toast.error(`打开文件管理失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setFileManagerLoading(false);
    }
  };

  const openAndroidSettings = () => {
    setIsLoading(true);
    try {
      if (isAndroid) {
        // 显示跳转确认弹窗
        toast.custom((t) => (
          <div className="bg-white dark:bg-gray-800 rounded-[8px] p-4 shadow-lg max-w-sm">
            <h3 className="font-medium text-sm mb-2">确认打开系统设置</h3>
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">跳转方式:</p>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-[4px]">
                <p className="text-xs break-all">
                  {isWebView ? 'WebView Bridge' : 'Intent URL'}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">跳转链接:</p>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-[4px]">
                <p className="text-xs break-all">
                  {isWebView 
                    ? 'window.AndroidBridge.openSettings()' 
                    : 'intent:#Intent;action=android.settings.SETTINGS;end'}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  toast.dismiss(t);
                  setIsLoading(false);
                }}
                className="px-3 py-1 text-xs rounded-[4px] bg-gray-100 dark:bg-gray-700"
              >
                取消
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t);
                  if (isWebView && tryWebViewApproach()) {
                    setTimeout(() => {
                      if (!document.hidden) {
                        toast.error('请在WebView配置中添加intent跳转支持');
                      }
                      setIsLoading(false);
                    }, 1500);
                    return;
                  }

                  if (tryBrowserApproach()) {
                    setTimeout(() => {
                      if (!document.hidden) {
                        toast.error('无法打开系统设置，请确保应用有相应权限');
                      }
                      setIsLoading(false);
                    }, 1500);
                    return;
                  }

                  throw new Error('所有跳转方案尝试失败');
                }}
                className="px-3 py-1 text-xs rounded-[4px] bg-[var(--color-primary)] text-white"
              >
                确认
              </button>
            </div>
          </div>
        ), { duration: 10000 });
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
            <i className="fas fa-spinner fa-spin text-4xl text-[var(--color-primary)] mb-4"></i>
            <h2 className="text-2xl font-bold">加载中...</h2>
            <p className="text-gray-600 dark:text-gray-300">
              正在检查认证状态
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-[12px] p-8 shadow-lg text-center"
          >
            <i className="fas fa-spinner fa-spin text-4xl text-[var(--color-primary)] mb-4"></i>
            <h2 className="text-2xl font-bold">加载中...</h2>
            <p className="text-gray-600 dark:text-gray-300">
              正在检查认证状态和路径
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
                <img
                  src={qrCodeUrl}
                  alt="公众号二维码"
                  className="w-48 h-48 mx-auto rounded-[4px] border border-gray-200 dark:border-gray-700 p-2 bg-white"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  扫码关注公众号后回复"开发者"获取口令
                </p>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  输入口令
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-[4px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                  placeholder="请输入访问口令"
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
            {/* 系统信息卡片 - 优化版 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-[8px] p-4 shadow-sm"
            >
              <div className="flex items-center mb-2">
                <i className="fas fa-desktop text-base mr-2 text-blue-500"></i>
                <h2 className="text-base font-semibold">系统信息</h2>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="py-1">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">设备类型</p>
                  <p className="font-medium">{isMobile ? '移动设备' : '桌面设备'}</p>
                </div>
                <div className="py-1">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">操作系统</p>
                  <p className="font-medium">{navigator.platform}</p>
                </div>
                <div className="py-1">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">分辨率</p>
                  <p className="font-medium">{window.screen.width}x{window.screen.height}</p>
                </div>
                <div className="py-1">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">内存</p>
                  <p className="font-medium">{navigator.deviceMemory || '未知'} GB</p>
                </div>
                <div className="py-1">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">CPU核心</p>
                  <p className="font-medium">{navigator.hardwareConcurrency || '未知'}</p>
                </div>
                <div className="py-1">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">语言</p>
                  <p className="font-medium">{navigator.language}</p>
                </div>
              </div>
            </motion.div>

            {/* 调试信息卡片 - 优化版 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-gray-800 rounded-[8px] p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <i className="fas fa-bug text-base mr-2 text-green-500"></i>
                  <h2 className="text-base font-semibold">调试信息</h2>
                </div>
                <div className="flex gap-1">
                  <motion.button
                    onClick={copyDebugInfo}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-2 py-1 rounded-[4px] bg-gray-100 dark:bg-gray-700 text-xs"
                  >
                    <i className="fa-solid fa-copy mr-1"></i>复制
                  </motion.button>
                  <motion.button
                    onClick={exportDebugInfoToFile}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-2 py-1 rounded-[4px] bg-[var(--color-primary)] text-white text-xs"
                  >
                    <i className="fa-solid fa-download mr-1"></i>导出
                  </motion.button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="py-1">
                  <p className="text-gray-500 dark:text-gray-400">应用版本</p>
                  <p className="font-medium">v2.4.0</p>
                </div>
                <div className="py-1">
                  <p className="text-gray-500 dark:text-gray-400">构建时间</p>
                  <p className="font-medium">2025-06-10</p>
                </div>
                <div className="py-1">
                  <p className="text-gray-500 dark:text-gray-400">IP地址</p>
                  <p className="font-medium">{window.location.hostname || '未知'}</p>
                </div>
                <div className="py-1">
                  <p className="text-gray-500 dark:text-gray-400">连接类型</p>
                  <p className="font-medium">{navigator.connection ? navigator.connection.effectiveType : '未知'}</p>
                </div>
                <div className="col-span-2 py-1">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">用户代理</p>
                  <p className="font-medium text-xxs break-all">{navigator.userAgent}</p>
                </div>
              </div>
            </motion.div>



            {/* 安卓系统设置卡片 - 优化版 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-[8px] p-4 shadow-sm"
            >
              <div className="flex items-center mb-2">
                <i className="fas fa-cog text-base mr-2 text-purple-500"></i>
                <h2 className="text-base font-semibold">安卓系统设置</h2>
              </div>
              
              <div className="space-y-2">
                <div>
                  <h3 className="font-medium text-sm mb-1">跳转方案</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    自动选择最佳跳转方式
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">WebView支持</p>
                    <p className={`font-medium ${isWebView ? 'text-green-500' : 'text-red-500'}`}>
                      {isWebView ? '支持' : '不支持'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">浏览器支持</p>
                    <p className={`font-medium ${isAndroid && !isWebView ? 'text-green-500' : 'text-red-500'}`}>
                      {isAndroid && !isWebView ? '支持' : '不支持'}
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={openAndroidSettings}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading || !isAndroid}
                  className={`w-full px-3 py-1.5 rounded-[4px] text-xs ${
                    isLoading ? 'bg-gray-300 dark:bg-gray-600' : 
                    !isAndroid ? 'bg-gray-400 dark:bg-gray-600' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'
                  } text-white`}
                >
                  {isLoading ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin mr-1"></i>
                      {isAndroid ? '跳转中...' : '检测设备...'}
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-gear mr-1"></i>
                      {isAndroid ? '打开设置' : '非安卓设备'}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* 文件管理卡片 - 优化版 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-[8px] p-4 shadow-sm"
            >
              <div className="flex items-center mb-2">
                <i className="fas fa-folder-open text-base mr-2 text-purple-500"></i>
                <h2 className="text-base font-semibold">文件管理</h2>
              </div>
              
              <div className="space-y-2">
                <div>
                  <h3 className="font-medium text-sm mb-1">跳转方案</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    多种方式跳转文件管理
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">WebView支持</p>
                    <p className={`font-medium ${isWebView ? 'text-green-500' : 'text-red-500'}`}>
                      {isWebView ? '支持' : '不支持'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">浏览器支持</p>
                    <p className={`font-medium ${isAndroid && !isWebView ? 'text-green-500' : 'text-red-500'}`}>
                      {isAndroid && !isWebView ? '支持' : '不支持'}
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={() => {
                    toast.custom((t) => (
                      <div className="bg-white dark:bg-gray-800 rounded-[8px] p-3 shadow-lg">
                        <h3 className="font-medium text-sm mb-1">确认打开文件管理</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                          即将跳转到系统文件管理应用，是否继续？
                        </p>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => toast.dismiss(t)}
                            className="px-2 py-1 text-xs rounded-[4px] bg-gray-100 dark:bg-gray-700"
                          >
                            取消
                          </button>
                          <button
                            onClick={() => {
                              toast.dismiss(t);
                              openFileManager();
                            }}
                            className="px-2 py-1 text-xs rounded-[4px] bg-[var(--color-primary)] text-white"
                          >
                            确认
                          </button>
                        </div>
                      </div>
                    ), { duration: 10000 });
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={fileManagerLoading || !isAndroid}
                  className={`w-full px-3 py-1.5 rounded-[4px] text-xs ${
                    fileManagerLoading ? 'bg-gray-300 dark:bg-gray-600' : 
                    !isAndroid ? 'bg-gray-400 dark:bg-gray-600' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'
                  } text-white`}
                >
                  {fileManagerLoading ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin mr-1"></i>
                      跳转中...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-folder-open mr-1"></i>
                      {!isAndroid ? '仅安卓支持' : '打开文件管理'}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>


          </div>
        </div>
      </div>
    </div>
  );
}

