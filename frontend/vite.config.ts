import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createDashScopeChatMiddleware } from './server/dashscope-chat-proxy'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 使用空前缀读取服务端密钥，避免 VITE_ 变量被 Vite 注入浏览器代码。
  const dashScopeApiKey = loadEnv(mode, process.cwd(), '').DASHSCOPE_API_KEY

  return {
    plugins: [
      react(),
      {
        name: 'dashscope-chat-server-proxy',
        configureServer(server) {
          server.middlewares.use('/api/chat', createDashScopeChatMiddleware({
            apiKey: dashScopeApiKey,
          }))
        },
      },
    ],
    server: {
      host: '0.0.0.0', // 监听所有网络接口，允许手机访问
      port: 5173, // Vite默认端口
    },
  }
})
