import { useState, useEffect } from 'react';
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
      localStorage.setItem('devAuth', 'true');
      toast.success('密码验证成功');
    } else {
      toast.error('密码错误，请重试');
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

  const openFileManager = () => {
    setFileManagerLoading(true);
    try {
      if (isAndroid) {
        // 方案1: 优先尝试使用com.android.filemanager包名 (与系统设置相同的方式)
        try {
          const intentUri = `intent:#Intent;action=android.intent.action.VIEW;package=com.android.filemanager;end`;
          window.location.href = intentUri;
          setTimeout(() => {
            if (!document.hidden) {
              toast('如果未跳转，将尝试其他方案');
            }
            setFileManagerLoading(false);
          }, 1500);
          return;
        } catch (e) {
          console.log('使用com.android.filemanager包名跳转失败，尝试其他方案:', e);
        }

        // 方案2: 尝试WebView Bridge方式 (与系统设置相同)
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

        // 方案3: 浏览器环境下的跳转方案 (与系统设置相同)
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

        // 方案4: 尝试通用文件URI (备用方案)
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

  const openAndroidSettings = async () => {
    setIsLoading(true);
    
    if (!isAndroid) {
      toast.error('此功能仅在安卓设备上可用', {
        description: '检测到您正在使用非安卓设备或浏览器环境'
      });
      setIsLoading(false);
      return;
    }

    // 定义所有可能的跳转方案
    const jumpSchemes = [
      // 1. WebView Bridge方式
      {
        name: 'WebView Bridge',
        execute: () => isWebView && tryWebViewApproach()
      },
      // 2. 标准Intent方式
      {
        name: '标准Intent',
        execute: () => {
          window.location.href = 'intent:#Intent;action=android.settings.SETTINGS;end';
          return true;
        }
      },
      // 3. 厂商特定方式
      {
        name: '厂商特定方案',
        execute: () => {
          const ua = navigator.userAgent.toLowerCase();
          // 小米设备
          if (/xiaomi/i.test(ua)) {
            window.location.href = 'intent:#Intent;action=miui.intent.action.SETTINGS;end';
            return true;
          }
          // 华为设备
          if (/huawei|honor/i.test(ua)) {
            window.location.href = 'intent:#Intent;action=com.huawei.systemmanager.startupmgr.ui.StartupNormalAppListActivity;end';
            return true;
          }
          // VIVO设备
          if (/vivo/i.test(ua)) {
            window.location.href = 'intent:#Intent;action=com.vivo.safe.settings.MoreSettingsActivity;end';
            return true;
          }
          // OPPO设备
          if (/oppo/i.test(ua)) {
            window.location.href = 'intent:#Intent;action=com.coloros.settings.feature.sound.controller.DefaultSoundSettingsActivity;end';
            return true;
          }
          // 安卓车机设备
          if (/car|automotive/i.test(ua)) {
            window.location.href = 'intent:#Intent;action=android.settings.CAR_SETTINGS;end';
            return true;
          }
          return false;
        }
      },
      // 4. 浏览器跳转方式
      {
        name: '浏览器跳转',
        execute: () => tryBrowserApproach()
      }
    ];

    try {
      // 显示开始跳转提示
      const toastId = toast.loading('正在准备跳转系统设置...', {
        description: '将尝试多种跳转方案'
      });

      // 按顺序尝试所有方案
      for (const scheme of jumpSchemes) {
        try {
          // 更新toast显示当前尝试的方案
          toast.loading(`正在尝试方案 ${scheme.name}...`, {
            id: toastId,
            description: '请稍候...'
          });

          const success = await new Promise<boolean>((resolve) => {
            const executed = scheme.execute();
            if (!executed) {
              toast.warning(`跳过方案: ${scheme.name}`, {
                description: '当前环境不支持此方案',
                id: toastId
              });
              resolve(false);
              return;
            }
            
            // 设置超时检查是否跳转成功
            setTimeout(() => {
              resolve(!document.hidden); // 如果页面仍然可见，则认为跳转失败
            }, 1500);
          });

          if (success) {
            toast.success(`跳转成功!`, {
              description: `使用方案: ${scheme.name}`,
              id: toastId
            });
            setIsLoading(false);
            return; // 跳转成功，结束函数
          } else {
            toast.warning(`方案 ${scheme.name} 失败`, {
              description: '将尝试下一个方案',
              id: toastId
            });
          }
        } catch (e) {
          console.log(`${scheme.name}方案失败:`, e);
          toast.error(`方案 ${scheme.name} 出错`, {
            description: e instanceof Error ? e.message : '未知错误',
            id: toastId
          });
          continue; // 当前方案失败，继续尝试下一个
        }
      }

      // 所有方案都失败
      toast.error('无法自动打开系统设置', {
        description: '已尝试所有可用方案。请尝试以下方法:\n1. 手动打开设置应用\n2. 检查应用权限设置\n3. 联系设备厂商获取支持',
        duration: 10000,
        id: toastId,
        action: {
          label: '复制错误信息',
          onClick: () => navigator.clipboard.writeText(`设备信息: ${navigator.userAgent}\n跳转失败时间: ${new Date().toLocaleString()}`)
        }
      });
    } catch (error) {
      console.error('打开系统设置失败:', error);
      toast.error(`打开设置失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
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



            {/* 安卓系统设置卡片 - 增强版 */}
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
               
               {/* 环境检测 - 详细展示 */}
               <div className="mb-6 space-y-3">
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-300">设备类型:</span>
                   <span className={`text-sm font-medium ${isAndroid ? 'text-green-500' : 'text-gray-500'}`}>
                     {isAndroid ? '安卓设备' : '非安卓设备'}
                   </span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-300">WebView环境:</span>
                   <span className={`text-sm font-medium ${isWebView ? 'text-green-500' : 'text-gray-500'}`}>
                     {isWebView ? '支持' : '不支持'}
                   </span>
                 </div>
                 {isAndroid && (
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-600 dark:text-gray-300">设备厂商:</span>
                     <span className="text-sm font-medium">
                       {/xiaomi/i.test(navigator.userAgent) ? '小米' : 
                        /huawei|honor/i.test(navigator.userAgent) ? '华为' : 
                        /oppo/i.test(navigator.userAgent) ? 'OPPO' : 
                        /vivo/i.test(navigator.userAgent) ? 'VIVO' : 
                        /car|automotive/i.test(navigator.userAgent) ? '安卓车机' :
                        '其他厂商'}
                     </span>
                   </div>
                 )}
               </div>

              {/* 跳转方案 - 详细展示 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">可用跳转方案:</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded-[4px]">1. WebView Bridge</div>
                  <div className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded-[4px]">2. 标准Intent</div>
                  <div className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded-[4px]">3. 厂商特定</div>
                  <div className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded-[4px]">4. 浏览器跳转</div>
                </div>
              </div>

              {/* 操作按钮 */}
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
                    {isAndroid ? '正在尝试跳转...' : '检测设备...'}
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-gear mr-2"></i>
                    {isAndroid ? '打开系统设置' : '非安卓设备'}
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* 文件管理卡片 - 与安卓系统设置卡片一致的布局 */}
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
              
              {/* 环境检测 - 更简洁的展示 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">WebView环境支持:</span>
                  <span className={`text-sm font-medium ${isWebView ? 'text-green-500' : 'text-gray-500'}`}>
                    {isWebView ? '支持' : '不支持'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">浏览器跳转支持:</span>
                  <span className={`text-sm font-medium ${isAndroid && !isWebView ? 'text-green-500' : 'text-gray-500'}`}>
                    {isAndroid && !isWebView ? '支持' : '不支持'}
                  </span>
                </div>
              </div>

              {/* 跳转方案 - 简化展示 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">可用跳转方案:</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded-[4px]">1. 包名跳转</div>
                  <div className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded-[4px]">2. WebView Bridge</div>
                  <div className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded-[4px]">3. Intent跳转</div>
                  <div className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded-[4px]">4. 浏览器跳转</div>
                </div>
              </div>

              {/* 操作按钮 - 与系统设置相同样式 */}
              <motion.button
                onClick={openFileManager}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={fileManagerLoading || !isAndroid}
                className={`w-full px-4 py-2 rounded-[4px] font-medium ${
                  fileManagerLoading ? 'bg-gray-300 dark:bg-gray-600' : 
                  !isAndroid ? 'bg-gray-400 dark:bg-gray-600' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'
                } text-white shadow-sm transition-colors`}
              >
                {fileManagerLoading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                    正在尝试跳转...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-folder-open mr-2"></i>
                    {!isAndroid ? '仅支持安卓设备' : '打开文件管理'}
                  </>
                )}
              </motion.button>
            </motion.div>


          </div>
        </div>
      </div>
    </div>
  );
}

