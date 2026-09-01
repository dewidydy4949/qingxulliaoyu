# 情绪疗愈哄睡师

这是一个 React + Vite 前端和 Node.js 后端组成的情绪疗愈应用。浏览器只访问本项目后端，Groq 密钥只能保存在后端环境变量中。

## 调用链路

```text
浏览器 -> VITE_API_BASE_URL/api/chat -> Node.js 后端 -> Groq API
```

`VITE_` 开头的变量会被 Vite 打包进浏览器代码，因此任何密钥都不能使用该前缀，也不能写进前端源码、Vercel 前端环境变量或构建产物。

## 本地运行

1. 复制前端配置：`.env.example` -> `.env.local`，按需修改 `VITE_API_BASE_URL`。
2. 复制后端配置：`backend/.env.example` -> `backend/.env`。
3. 在 `backend/.env` 中填写一枚新建的 `GROQ_API_KEY` 和随机生成的 `JWT_SECRET`。
4. 分别在项目根目录和 `backend` 目录安装依赖并启动服务。

```bash
# 后端
cd backend
npm install
npm run dev

# 前端（另开终端）
cd ..
npm install
npm run dev
```

## 部署

- Vercel 前端只配置 `VITE_API_BASE_URL`，值为后端公开地址并以 `/api` 结尾。
- Render 后端配置 `GROQ_API_KEY`、`JWT_SECRET` 和 `PORT`；不要把真实值提交到 Git。
- 如果密钥曾进入前端构建产物，必须先在 Groq 控制台吊销旧密钥，再创建并部署新密钥。仅删除代码或重新构建不能让旧密钥失效。

## 安全检查

```bash
npm run security:test
npm run security:check
npm run build
```

`npm run build` 会在生成 `dist` 后自动检查前端源码、配置和构建产物。发现 Groq 密钥字面值、浏览器端 Groq 环境变量或直连 Groq 的旧路径时，构建会失败且不会打印密钥内容。
