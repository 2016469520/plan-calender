// ============================================================
// Electron 主进程 — 主窗口 + 常驻桌面浮窗 + 托盘
// 只用内置 app:// 协议加载静态导出的前端，数据存本机 IndexedDB
// ============================================================

const { app, BrowserWindow, Menu, Tray, ipcMain, nativeImage, protocol, screen, shell } = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const { resolveAsset, mimeFor } = require('./serve.cjs')

const APP_SCHEME = 'app'
const APP_HOST = 'local'
const APP_ORIGIN = `${APP_SCHEME}://${APP_HOST}`
const DIST_DIR = path.join(__dirname, '..', 'out')
const DEV_URL = process.env.ELECTRON_START_URL || ''
const APP_TITLE = '时格'

const WIDGET_WIDTH = 340
const WIDGET_HEIGHT = 460

let mainWindow = null
let widgetWindow = null
let tray = null
let isQuitting = false

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

const DEFAULT_STATE = {
  main: { width: 1280, height: 860 },
  widget: { visible: true, pinned: true },
}

function stateFile() {
  return path.join(app.getPath('userData'), 'window-state.json')
}

function loadState() {
  try {
    const raw = JSON.parse(fs.readFileSync(stateFile(), 'utf8'))
    return {
      main: { ...DEFAULT_STATE.main, ...(raw.main || {}) },
      widget: { ...DEFAULT_STATE.widget, ...(raw.widget || {}) },
    }
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_STATE))
  }
}

function saveState(partial) {
  const current = loadState()
  const next = { ...current, ...partial }
  try {
    fs.writeFileSync(stateFile(), JSON.stringify(next), 'utf8')
  } catch {
    /* 忽略写入失败 */
  }
}

function persistBounds(kind, win) {
  if (!win || win.isDestroyed()) return
  const bounds = win.getNormalBounds()
  const state = loadState()
  state[kind] = { ...state[kind], ...bounds }
  saveState({ [kind]: state[kind] })
}

// ---------- 主窗口 ----------

function createMainWindow() {
  const state = loadState()
  const mains = state.main

  const win = new BrowserWindow({
    width: mains.width || 1280,
    height: mains.height || 860,
    x: mains.x,
    y: mains.y,
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
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  win.once('ready-to-show', () => win.show())
  win.on('resize', () => persistBounds('main', win))
  win.on('move', () => persistBounds('main', win))

  // 关掉主窗口 = 收到托盘/浮窗，而不是退出应用
  win.on('close', (event) => {
    if (isQuitting) return
    event.preventDefault()
    win.hide()
    ensureWidgetVisible()
  })

  attachNavigationGuards(win)
  win.loadURL(DEV_URL || `${APP_ORIGIN}/`)
  return win
}

function attachNavigationGuards(win) {
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
}

// ---------- 桌面浮窗 ----------

function defaultWidgetPosition(state) {
  const { workArea } = screen.getPrimaryDisplay()
  const width = state.widget.width || WIDGET_WIDTH
  const height = state.widget.height || WIDGET_HEIGHT
  return {
    x: workArea.x + workArea.width - width - 24,
    y: workArea.y + workArea.height - height - 24,
  }
}

function createWidgetWindow() {
  const state = loadState()
  const saved = state.widget
  const hasPosition = typeof saved.x === 'number' && typeof saved.y === 'number'
  const fallback = defaultWidgetPosition(state)

  const win = new BrowserWindow({
    width: saved.width || WIDGET_WIDTH,
    height: saved.height || WIDGET_HEIGHT,
    x: hasPosition ? saved.x : fallback.x,
    y: hasPosition ? saved.y : fallback.y,
    minWidth: 280,
    minHeight: 260,
    maxWidth: 640,
    maxHeight: 900,
    frame: false,
    transparent: true,
    resizable: true,
    maximizable: false,
    fullscreenable: false,
    alwaysOnTop: saved.pinned !== false,
    skipTaskbar: true,
    show: false,
    title: `${APP_TITLE} 浮窗`,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
      backgroundThrottling: false,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  if (saved.pinned !== false) {
    win.setAlwaysOnTop(true, 'floating')
  }

  win.once('ready-to-show', () => {
    if (loadState().widget.visible !== false) win.show()
  })
  win.on('resize', () => persistBounds('widget', win))
  win.on('move', () => persistBounds('widget', win))

  // 关掉浮窗只是隐藏，主窗口继续运行
  win.on('close', (event) => {
    if (isQuitting) return
    event.preventDefault()
    win.hide()
    saveState({ widget: { ...loadState().widget, visible: false } })
  })

  attachNavigationGuards(win)
  win.loadURL(DEV_URL ? `${DEV_URL}/widget/` : `${APP_ORIGIN}/widget/`)
  return win
}

function ensureWidgetVisible() {
  if (!widgetWindow) {
    widgetWindow = createWidgetWindow()
    return
  }
  widgetWindow.show()
  saveState({ widget: { ...loadState().widget, visible: true } })
}

function toggleWidgetVisible() {
  if (!widgetWindow) {
    widgetWindow = createWidgetWindow()
    saveState({ widget: { ...loadState().widget, visible: true } })
    return true
  }
  if (widgetWindow.isVisible()) {
    widgetWindow.hide()
    saveState({ widget: { ...loadState().widget, visible: false } })
    return false
  }
  ensureWidgetVisible()
  return true
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    mainWindow = createMainWindow()
    return
  }
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.show()
  mainWindow.focus()
}

// ---------- 菜单与托盘 ----------

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
        { type: 'separator' },
        {
          label: '桌面浮窗',
          click: () => toggleWidgetVisible(),
        },
        { type: 'separator' },
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

function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'app.ico')
  const image = nativeImage.createFromPath(iconPath)
  tray = new Tray(image.isEmpty() ? nativeImage.createEmpty() : image)
  tray.setToolTip(APP_TITLE)

  const refreshMenu = () => {
    const widgetVisible = !!widgetWindow && widgetWindow.isVisible()
    const pinned = !!widgetWindow && widgetWindow.isAlwaysOnTop()
    tray.setContextMenu(
      Menu.buildFromTemplate([
        { label: `打开${APP_TITLE}`, click: () => showMainWindow() },
        {
          label: widgetVisible ? '隐藏桌面浮窗' : '显示桌面浮窗',
          click: () => toggleWidgetVisible(),
        },
        {
          label: '浮窗置顶',
          type: 'checkbox',
          checked: pinned,
          click: () => {
            if (!widgetWindow) {
              ensureWidgetVisible()
              return
            }
            const next = !widgetWindow.isAlwaysOnTop()
            widgetWindow.setAlwaysOnTop(next, 'floating')
            saveState({ widget: { ...loadState().widget, pinned: next } })
            refreshMenu()
          },
        },
        { type: 'separator' },
        {
          label: '退出',
          click: () => {
            isQuitting = true
            app.quit()
          },
        },
      ])
    )
  }

  refreshMenu()
  tray.on('click', () => showMainWindow())
  tray.on('right-click', refreshMenu)
  app.on('widget-visibility-changed', refreshMenu)
}

// ---------- IPC ----------

function registerIpc() {
  ipcMain.handle('widget:hide', () => {
    if (widgetWindow) widgetWindow.hide()
    saveState({ widget: { ...loadState().widget, visible: false } })
    return false
  })

  ipcMain.handle('widget:toggle', () => toggleWidgetVisible())

  ipcMain.handle('main:show', () => {
    showMainWindow()
  })

  ipcMain.handle('widget:toggle-pin', () => {
    if (!widgetWindow) return false
    const next = !widgetWindow.isAlwaysOnTop()
    widgetWindow.setAlwaysOnTop(next, 'floating')
    saveState({ widget: { ...loadState().widget, pinned: next } })
    app.emit('widget-visibility-changed')
    return next
  })

  ipcMain.handle('widget:is-pinned', () => {
    if (!widgetWindow) return loadState().widget.pinned !== false
    return widgetWindow.isAlwaysOnTop()
  })

  ipcMain.handle('app:quit', () => {
    isQuitting = true
    app.quit()
  })
}

// ---------- 生命周期 ----------

const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    showMainWindow()
  })

  app.whenReady().then(() => {
    app.setAppUserModelId('app.local.plancalendar')
    registerProtocolHandler()
    registerIpc()
    buildMenu()

    mainWindow = createMainWindow()
    widgetWindow = createWidgetWindow()
    createTray()

    app.on('activate', () => {
      showMainWindow()
    })
  })

  app.on('before-quit', () => {
    isQuitting = true
  })

  // 托盘常驻：窗口全关也不退出，由「退出」显式结束
  app.on('window-all-closed', () => {
    if (isQuitting) app.quit()
  })
}
