# 部署到 Vercel（方案 B-1）

## 步骤
1. GitHub 新建仓库，把本项目代码推上去（或在 Vercel 直接导入本地目录）。
2. 打开 https://vercel.com → Add New → Project → 选择仓库。
3. 构建设置：
   - Framework: Vite
   - Build Command: `npm run build`
   - Output: `dist`
4. 在 **Environment Variables** 添加：
   - `GOLF_API_KEY` = 你的密钥（示例：`MWOU6QNGGM6CUDK3XQ5SVAO4W4`）
5. Deploy。部署完成后即可访问。

## 说明
- 前端统一请求 `/api/golf/*`，由 `api/golf.ts` 云函数转发到 `https://api.golfapi.io` 并附加 `api_key`。
- 前端不会暴露密钥，CORS 自动解决。
