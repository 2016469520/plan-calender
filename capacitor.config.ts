import type { CapacitorConfig } from '@capacitor/cli'

/**
 * 安卓壳：直接加载 `out/` 静态导出的本地应用。
 * WebView 用 https://localhost 作为来源，IndexedDB 因此可以稳定持久化。
 */
const config: CapacitorConfig = {
  appId: 'app.local.plancalendar',
  appName: '我的计划日历',
  webDir: 'out',
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  server: {
    androidScheme: 'https',
  },
}

export default config
