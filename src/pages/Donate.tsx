import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// 赞赏名单数据
const donors = [
  { name: '张*', amount: 50, date: '2025-05-15', message: '感谢开发这么棒的应用！', method: '微信' },
  { name: '李*', amount: 100, date: '2025-05-20', message: '期待更多功能更新', method: '支付宝' },
  { name: '王*', amount: 30, date: '2025-05-22', message: '非常好用', method: '微信' },
  { name: '赵*', amount: 200, date: '2025-06-05', message: '支持开发者', method: '支付宝' },
  { name: '钱*', amount: 80, date: '2025-06-10', message: '界面很漂亮', method: '微信' },
  { name: '孙*', amount: 150, date: '2025-06-12', message: '功能很实用', method: '微信' },
];

// 生成每月赞赏数据
const monthlyData = donors.reduce((acc, donor) => {
  const month = donor.date.substring(0, 7);
  if (!acc[month]) {
    acc[month] = { month, total: 0, count: 0 };
  }
  acc[month].total += donor.amount;
  acc[month].count += 1;
  return acc;
}, {} as Record<string, { month: string; total: number; count: number }>);

const chartData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));



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
              className="w-full max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-[12px] shadow-xl"
              layout
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">
                    <i className="fa-solid fa-users mr-2"></i>
                    赞赏统计
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                {/* 赞赏统计图表 */}
                <div className="h-64 mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'total') return [`¥${value}`, '总金额'];
                          return [value, '赞赏次数'];
                        }}
                      />
                      <Bar dataKey="total" name="总金额" fill="#3A8CFF" />
                      <Bar dataKey="count" name="赞赏次数" fill="#00D85A" />
                    </BarChart>
                  </ResponsiveContainer>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              donor.method === '微信' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
                              'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            }`}>
                              {donor.method}
                            </span>
                          </td>
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
            className="w-full max-w-3xl p-8 bg-white dark:bg-gray-800 rounded-[12px] shadow-lg"
          >
            <h1 className="text-3xl font-bold mb-6 text-[var(--color-primary)] text-center">
              <i className="fa-solid fa-heart mr-2"></i>
              支持我们
            </h1>
            
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300 text-center">
              您的支持将帮助我们持续改进应用，带来更好的体验
            </p>
            


            {/* 支付方式 */}
            <motion.div 
              className="mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-6 text-center">选择支付方式</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 微信支付 */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-6 bg-gray-100 dark:bg-gray-700 rounded-[12px] text-center"
                >
                  <h3 className="text-lg font-medium mb-4">
                    <i className="fa-brands fa-weixin mr-2 text-green-500"></i>
                    微信支付
                  </h3>
                  <div className="flex justify-center p-4 bg-white dark:bg-gray-600 rounded-[8px] mb-4">
                    <div className="relative w-40 h-40">
                      <img
                        src="https://h.xbrooke.cn/img/yg/wechat.png"
                        alt="微信支付二维码"
                        className="absolute inset-0 w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=WeChat%20Pay%20QR%20code%2C%20clean%20design%2C%20white%20background%2C%20centered%2C%20Flyme%20Auto%201.8%20style&sign=b84989dbdd72a173fa033c350ae5725d';
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    长按识别二维码进行赞赏
                  </p>
                </motion.div>

                {/* 支付宝 */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-6 bg-gray-100 dark:bg-gray-700 rounded-[12px] text-center"
                >
                  <h3 className="text-lg font-medium mb-4">
                    <i className="fa-brands fa-alipay mr-2 text-blue-500"></i>
                    支付宝
                  </h3>
                  <div className="flex justify-center p-4 bg-white dark:bg-gray-600 rounded-[8px] mb-4">
                    <div className="relative w-40 h-40">
                      <img
                        src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Alipay%20QR%20code%2C%20clean%20design%2C%20blue%20theme%2C%20white%20background%2C%20centered%2C%20Flyme%20Auto%201.8%20style&sign=8cdadab67ed8117cb209b79622121ed1"
                        alt="支付宝二维码"
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    长按识别二维码进行赞赏
                  </p>
                </motion.div>
              </div>
            </motion.div>
            
            {/* 查看赞赏统计 */}
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
                className="px-6 py-3 rounded-[8px] bg-[var(--color-primary)] text-white font-medium"
              >
                <i className="fa-solid fa-chart-line mr-2"></i>
                查看赞赏统计
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