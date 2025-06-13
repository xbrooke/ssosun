import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useTheme, useDeviceDetect } from '@/hooks/useTheme';


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
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <i className="fas fa-info-circle mr-2 text-green-500"></i>
                系统信息
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">版本</span>
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
                  <span className="text-gray-600 dark:text-gray-300">设备类型</span>
                  <span className="font-medium">{isMobile ? '移动设备' : '桌面设备'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">操作系统</span>
                  <span className="font-medium">{navigator.platform}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-300">浏览器</span>
                  <span className="font-medium">{navigator.userAgent.split(') ')[0].split('(')[1]}</span>
                </div>
              </div>
            </motion.div>

            {/* 系统信息区块 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-[12px] p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <i className="fas fa-info-circle mr-2 text-green-500"></i>
                系统信息
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">版本</span>
                  <span className="font-medium">v2.4.0</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">构建时间</span>
                  <span className="font-medium">2025-06-10</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-300">API状态</span>
                  <span className="font-medium text-green-500">正常</span>
                </div>
              </div>
            </motion.div>

            {/* 系统设置区块 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-[12px] p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <i className="fas fa-cog mr-2 text-purple-500"></i>
                系统设置
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-[8px]">
                  <h3 className="font-medium mb-2">安卓系统设置</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    点击下方按钮可直接跳转到安卓系统设置界面
                  </p>
                  <motion.button
                    onClick={openAndroidSettings}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className={`w-full px-4 py-2 rounded-[4px] font-medium ${
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
                </div>

                {/* 文件管理 */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-[8px]">
                  <h3 className="font-medium mb-2">文件管理</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    点击下方按钮可直接跳转到系统文件管理器
                  </p>
                  <motion.button
                    onClick={openFileManager}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className={`w-full px-4 py-2 rounded-[4px] font-medium ${
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
                        <i className="fa-solid fa-folder-open mr-2"></i>
                        {isAndroid ? '打开文件管理' : '非安卓设备'}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* 网络信息区块 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-[12px] p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <i className="fas fa-network-wired mr-2 text-purple-500"></i>
                  网络信息
                </h2>
                <motion.button
                  onClick={copyDebugInfo}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-[2px] bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium"
                >
                  <i className="fa-solid fa-copy mr-2"></i>
                  复制信息
                </motion.button>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex">
                  <span className="w-24 font-medium">IP地址:</span>
                  <span>{window.location.hostname || '未知'}</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-medium">连接类型:</span>
                  <span>{navigator.connection ? navigator.connection.effectiveType : '未知'}</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-medium">在线状态:</span>
                  <span>{navigator.onLine ? '在线' : '离线'}</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-medium">设备内存:</span>
                  <span>{navigator.deviceMemory || '未知'} GB</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-medium">CPU核心数:</span>
                  <span>{navigator.hardwareConcurrency || '未知'}</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-medium">用户语言:</span>
                  <span>{navigator.language}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
