import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// 增强根元素检查
const rootElement = document.getElementById("root");
if (!rootElement) {
  // 创建备用根元素
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
  console.warn('自动创建了root元素');
}

const root = createRoot(rootElement!);

// 添加渲染错误处理
try {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
} catch (error) {
  console.error('渲染失败:', error);
  rootElement!.innerHTML = `
    <div style="padding: 2rem; text-align: center;">
      <h2>应用加载失败</h2>
      <p>${error instanceof Error ? error.message : '未知错误'}</p>
      <p>请检查控制台获取详细信息</p>
    </div>
  `;
}
