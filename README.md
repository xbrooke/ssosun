# 项目分支管理指南

[![Deploy to GitHub Pages](https://github.com/yourusername/project_template_react/actions/workflows/deploy.yml/badge.svg)](https://github.com/yourusername/project_template_react/actions/workflows/deploy.yml)

## Deployment

This project is automatically deployed to GitHub Pages when pushing to the `main` branch. The deployment status can be viewed above.

To deploy manually:

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Build the project: `pnpm run build`
4. The built files will be in the `dist` directory



## 解决分支不显示问题

如果在Git仓库中看不到任何分支，可以按照以下步骤解决：

1. 首先检查本地分支：
```bash
git branch
```

2. 如果没有显示任何分支，可以创建新分支：
```bash
git checkout -b main  # 创建并切换到main分支
```

3. 检查远程分支：
```bash
git branch -r  # 查看远程分支
git branch -a  # 查看所有分支(本地+远程)
```

4. 如果看不到远程分支，可能需要获取远程信息：
```bash
git fetch --all  # 获取所有远程分支信息
```

5. 创建本地分支跟踪远程分支：
```bash
git checkout --track origin/main  # 假设远程有main分支
```

## 常用分支操作命令

- 创建新分支：`git branch <分支名>`
- 切换分支：`git checkout <分支名>`
- 删除分支：`git branch -d <分支名>`
- 推送分支到远程：`git push origin <分支名>`
