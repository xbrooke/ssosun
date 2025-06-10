import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

export function Empty() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
       className={cn("flex h-full flex-col items-center justify-center space-y-4 p-8 transition-colors duration-300")}
       onClick={() => toast('功能即将上线')}
     >
       <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300"></div>
      <h3 className="text-lg font-medium">暂无内容</h3>
      <p className="text-center text-gray-500 dark:text-gray-400">
        点击此处查看更多内容
      </p>
    </motion.div>
  );
}