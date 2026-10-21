// ============================================================
// Electron 主进程 — 只用内置 app:// 协议加载静态导出的前端
// 数据保存在 Chromium 的 IndexedDB 中（系统用户数据目录），不联网
// ============================================================

const { app, BrowserWindow, Menu, protocol, shell } = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const { resolveAsset, mimeFor } = require('./serve.cjs')

const APP_SCHEME = 'app'
const APP_HOST = 'local'
const APP_ORIGIN = `${APP_SCHEME}://${APP_HOST}`
const DIST_DIR = path.join(__dirname, '..', 'out')
const DEV_URL = process.env.ELECTRON_START_URL || ''
const APP_TITLE = '我的计划日历'

// 自定义协议必须以 standard + secure 注册，IndexedDB / localStorage 才会持久化
protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      allowServiceWorkers: false,
    },
  },
])

function buildResponse(file, status = 200) {
  const body = fs.readFileSync(file)
  return new Response(body, {
    status,
    headers: {
      'content-type': mimeFor(file),
      // 本地文件不做缓存协商，升级后不会残留旧文件
      'cache-control': 'no-store',
    },
  })
}

function registerProtocolHandler() {
  protocol.handle(APP_SCHEME, async (request) => {
    const { pathname } = new URL(request.url)
    const file = resolveAsset(DIST_DIR, pathname)
    if (file) return buildResponse(file)

    const fallback404 = path.join(DIST_DIR, '404.html')
    if (fs.existsSync(fallback404)) return buildResponse(fallback404, 404)
    return new Response('Not Found', { status: 404 })
  })
}

// ---------- 窗口状态持久化 ----------

function stateFile() {
  return path.join(app.getPath('userData'), 'window-state.json')
}

function loadWindowState() {
  const fallback = { width: 1280, height: 860 }
  try {
    const raw = JSON.parse(fs.readFileSync(stateFile(), 'utf8'))
    if (typeof raw.width === 'number' && typeof raw.height === 'number') {
      return { ...fallback, ...raw }
    }
  } catch {
    /* 首次启动没有状态文件 */
  }
  return fallback
}

function saveWindowState(win) {
  if (!win || win.isDestroyed()) return
  try {
    fs.writeFileSync(stateFile(), JSON.stringify(win.getNormalBounds()), 'utf8')
  } catch {
    /* 忽略写入失败 */
  }
}

// ---------- 窗口 ----------

function createWindow() {
  const state = loadWindowState()

  const win = new BrowserWindow({
    width: state.width,
    height: state.height,
    x: state.x,
    y: state.y,
    minWidth: 900,
    minHeight: 620,
    title: APP_TITLE,
    backgroundColor: '#ffffff',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
      backgroundThrottling: false,
    },
  })

  win.once('ready-to-show', () => win.show())
  win.on('resize', () => saveWindowState(win))
  win.on('move', () => saveWindowState(win))
  win.on('close', () => saveWindowState(win))

  // 站外链接交给系统浏览器，不在应用内打开
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  win.webContents.on('will-navigate', (event, url) => {
    const inApp = url.startsWith(APP_ORIGIN) || (!!DEV_URL && url.startsWith(DEV_URL))
    if (!inApp) {
      event.preventDefault()
      if (url.startsWith('http')) shell.openExternal(url)
    }
  })

  win.loadURL(DEV_URL || `${APP_ORIGIN}/`)
  return win
}

function buildMenu() {
  const isDev = !!DEV_URL
  const template = [
    { label: '文件', submenu: [{ role: 'quit', label: '退出' }] },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectAll', label: '全选' },
      ],
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'resetZoom', label: '实际大小' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' },
        ...(isDev ? [{ role: 'toggleDevTools', label: '开发者工具' }] : []),
      ],
    },
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

// ---------- 生命周期 ----------

const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const [win] = BrowserWindow.getAllWindows()
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  app.whenReady().then(() => {
    app.setAppUserModelId('app.local.plancalendar')
    registerProtocolHandler()
    buildMenu()
    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
