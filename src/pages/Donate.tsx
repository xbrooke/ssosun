import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';

// 赞赏名单数据
const donors = [
  { name: '张*', amount: 50, date: '2025-05-15', message: '感谢开发这么棒的应用！' },
  { name: '李*', amount: 100, date: '2025-05-20', message: '期待更多功能更新' },
  { name: '王*', amount: 30, date: '2025-06-01', message: '非常好用' },
  { name: '赵*', amount: 200, date: '2025-06-05', message: '支持开发者' },
];

function DonorListModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-[12px] shadow-xl"
              layout
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">
                    <i className="fa-solid fa-users mr-2"></i>
                    赞赏名单
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
                
                <div className="overflow-hidden rounded-lg shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">支持者</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">金额</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">日期</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">支付方式</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">留言</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {donors.map((donor, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{donor.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">¥{donor.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{donor.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{index % 2 === 0 ? '微信' : '支付宝'}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{donor.message}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Donate() {
  const { isDark } = useTheme();
  const [isDonorListOpen, setIsDonorListOpen] = useState(false);
  const wechatPrompt = encodeURIComponent('WeChat Pay QR code, clean design, white background, centered, Flyme Auto 1.8 style');
  const alipayPrompt = encodeURIComponent('Alipay QR code, clean design, white background, centered, Flyme Auto 1.8 style');
  const wechatUrl = `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%24%7BwechatPrompt%7D&sign=56f2dc76f0477cf5f37f1f914f3b1a10`;
  const alipayUrl = `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%24%7BalipayPrompt%7D&sign=c6fdbcd53aeb8f91a40839cb5ef5d86c`;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <main className="ml-0 flex-1 p-4 transition-all duration-300 md:ml-64 lg:ml-72 md:p-8 text-gray-800 bg-gray-50 dark:text-gray-100 dark:bg-gray-900">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[80vh]"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
             className="w-full max-w-4xl p-8 bg-white dark:bg-gray-800 rounded-[4px] shadow-lg"
          >
            <h1 className="text-2xl font-bold mb-6 text-[var(--color-primary)] text-center">
              <i className="fa-solid fa-heart mr-2"></i>
              赞赏支持
            </h1>
            
            <p className="mb-6 text-gray-600 dark:text-gray-300 text-center">
              如果您喜欢我们的应用，可以通过扫码赞赏支持开发者。您的支持将帮助我们持续改进和开发新功能。
            </p>
            
            {/* 支付方式区域 */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gray-100 dark:bg-gray-700 rounded-[12px] text-center"
              >
                <h3 className="text-lg font-medium mb-4">
                  <i className="fa-brands fa-weixin mr-2 text-green-500"></i>
                  微信支付
                </h3>
                <img
                  src={wechatUrl}
                  alt="微信支付二维码"
                  className="w-48 h-48 object-contain mx-auto rounded-[4px]"
                />
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gray-100 dark:bg-gray-700 rounded-[12px] text-center"
              >
                <h3 className="text-lg font-medium mb-4">
                  <i className="fa-brands fa-alipay mr-2 text-blue-500"></i>
                  支付宝
                </h3>
                <img
                  src={alipayUrl}
                  alt="支付宝二维码"
                  className="w-48 h-48 object-contain mx-auto rounded-[4px]"
                />
              </motion.div>
            </motion.div>
            
            {/* 查看赞赏名单按钮 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <motion.button
                onClick={() => setIsDonorListOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-[4px] bg-[var(--color-primary)] text-white font-medium"
              >
                <i className="fa-solid fa-users mr-2"></i>
                查看赞赏名单
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 赞赏名单弹窗 */}
        <DonorListModal isOpen={isDonorListOpen} onClose={() => setIsDonorListOpen(false)} />
      </main>
    </div>
  );
}