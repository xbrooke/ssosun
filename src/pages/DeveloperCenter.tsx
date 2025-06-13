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
    setInitialized(true);
    console.log(`认证状态初始化完成: ${authStatus}`);
  }, []);

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
        if (isWebView) {
          try {
            if (window.AndroidBridge && typeof window.AndroidBridge.openFileManager === 'function') {
              window.AndroidBridge.openFileManager();
              setTimeout(() => {
                if (!document.hidden) {
                  toast.error('请在WebView配置中添加文件管理跳转支持');
                }
                setFileManagerLoading(false);
              }, 1500);
              return;
            }
            
            const intentUri = `intent:#Intent;action=android.intent.action.VIEW;type=resource/folder;end`;
            window.location.href = intentUri;
            setTimeout(() => {
              if (!document.hidden) {
                toast.error('无法打开文件管理，请确保应用有相应权限');
              }
              setFileManagerLoading(false);
            }, 1500);
            return;
          } catch (e) {
            console.error('WebView跳转失败:', e);
            toast.error(`打开文件管理失败: ${e instanceof Error ? e.message : '未知错误'}`);
            setFileManagerLoading(false);
          }
        } else {
          toast.error('此功能仅在WebView环境中可用');
          setFileManagerLoading(false);
        }
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
            {/* 系统信息区块 - 增强版 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-[12px] p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <i className="fas fa-info-circle mr-2 text-green-500"></i>
                  系统与调试信息
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
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">在线状态</span>
                  <span className="font-medium">{navigator.onLine ? '在线' : '离线'}</span>
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
                  <span className="text-gray-600 dark:text-gray-300">屏幕分辨率</span>
                  <span className="font-medium">{window.screen.width}x{window.screen.height}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">设备类型</span>
                  <span className="font-medium">{isMobile ? '移动设备' : '桌面设备'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">操作系统</span>
                  <span className="font-medium">{navigator.platform}</span>
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



            {/* 安卓系统设置卡片 */}
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
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-[8px]">
                  <h3 className="font-medium mb-2">系统设置跳转方案</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    支持多种跳转方式，根据设备环境自动选择最佳方案
                  </p>
                  
                  {/* 检测结果展示 */}
                  <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-[4px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">WebView环境支持:</span>
                      {isWebView ? (
                        <span className="flex items-center text-green-500">
                          <i className="fa-solid fa-check-circle mr-1"></i> 支持
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500">
                          <i className="fa-solid fa-times-circle mr-1"></i> 不支持
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">浏览器跳转支持:</span>
                      {isAndroid && !isWebView ? (
                        <span className="flex items-center text-green-500">
                          <i className="fa-solid fa-check-circle mr-1"></i> 支持
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500">
                          <i className="fa-solid fa-times-circle mr-1"></i> 不支持
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="text-sm text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                    <li className="flex items-start">
                      <i className="fa-solid fa-check text-green-500 mr-2 mt-1"></i>
                      <span>WebView环境：使用AndroidBridge或Intent跳转</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check text-green-500 mr-2 mt-1"></i>
                      <span>浏览器环境：尝试iframe或android.startActivity</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check text-green-500 mr-2 mt-1"></i>
                      <span>备用方案：提示用户手动打开设置</span>
                    </li>
                  </ul>
                  <motion.button
                    onClick={openAndroidSettings}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading || !isAndroid}
                    className={`w-full px-4 py-2 rounded-[4px] font-medium ${
                      isLoading ? 'bg-gray-300 dark:bg-gray-600' : 
                      !isAndroid ? 'bg-gray-400 dark:bg-gray-600' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'
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
                </div>
              </div>
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
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-[8px]">
                  <h3 className="font-medium mb-2">文件管理跳转方案</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    专为WebView环境优化，需要应用有相应权限
                  </p>
                  
                  {/* 检测结果展示 */}
                  <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-[4px]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">WebView环境支持:</span>
                      {isWebView ? (
                        <span className="flex items-center text-green-500">
                          <i className="fa-solid fa-check-circle mr-1"></i> 支持
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500">
                          <i className="fa-solid fa-times-circle mr-1"></i> 不支持
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="text-sm text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                    <li className="flex items-start">
                      <i className="fa-solid fa-check text-green-500 mr-2 mt-1"></i>
                      <span>WebView环境：使用AndroidBridge.openFileManager</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check text-green-500 mr-2 mt-1"></i>
                      <span>Intent方案：android.intent.action.VIEW</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check text-green-500 mr-2 mt-1"></i>
                      <span>备用方案：提示用户手动打开文件管理器</span>
                    </li>
                  </ul>
                  <motion.button
                    onClick={openFileManager}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={fileManagerLoading || !isAndroid || !isWebView}
                    className={`w-full px-4 py-2 rounded-[4px] font-medium ${
                      fileManagerLoading ? 'bg-gray-300 dark:bg-gray-600' : 
                      !isAndroid || !isWebView ? 'bg-gray-400 dark:bg-gray-600' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'
                    } text-white shadow-sm transition-colors`}
                  >
                    {fileManagerLoading ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                        {isAndroid ? '正在跳转...' : '检测设备...'}
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-folder-open mr-2"></i>
                        {!isAndroid ? '非安卓设备' : !isWebView ? '非WebView环境' : '打开文件管理'}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>


          </div>
        </div>
      </div>
    </div>
  );
}

