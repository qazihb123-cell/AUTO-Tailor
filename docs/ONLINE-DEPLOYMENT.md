# 在线预览部署

AUTO Tailor 是静态网站：构建后的 `dist/` 已包含 HTML、CSS、JS、图片和 404 页面。部署后由云端静态主机直接提供文件，不需要 VSCode、Node 服务或本地电脑一直开机。

## GitHub Pages（已配置自动部署）

GitHub Pages 已启用，自动部署 workflow 位于 `.github/workflows/deploy-pages.yml`。在线站点：<https://qazihb123-cell.github.io/AUTO-Tailor/>。源码仓库：<https://github.com/qazihb123-cell/AUTO-Tailor>。

以后推送到 `main` 会自动构建和部署。首次部署所需的 Pages 设置已经完成。如需将项目复用到另一仓库，步骤如下：

1. 在 GitHub 新建一个仓库，例如 `AUTO-Tailor`。
2. 在本项目目录执行：

```powershell
git init
git add .
git commit -m "Prepare AUTO Tailor online site"
git branch -M main
git remote add origin https://github.com/你的账号/AUTO-Tailor.git
git push -u origin main
```

3. 打开 GitHub 仓库的 **Settings → Pages**，将 **Source** 设为 **GitHub Actions**。
4. 等待 **Actions → Deploy AUTO Tailor** 完成。
5. 用户名根仓库使用 `https://你的账号.github.io/`；普通项目仓库使用 `https://你的账号.github.io/AUTO-Tailor/`。工作流会把仓库子路径注入构建资源与链接。

之后每次 `git push` 到 `main`，GitHub 会自动执行安装、构建、检查和部署。部署链接不依赖 VSCode。

## 重要配置

如果使用自定义域名，先填写 `src/data/site.json` 的 `siteUrl`，再重新推送；构建脚本会生成 canonical、sitemap 和允许索引的 robots.txt。

当前询盘服务仍未配置，联系表单会下载本地草稿，不会发送真实消息。上线前请确认邮箱、域名和询盘接收服务。
