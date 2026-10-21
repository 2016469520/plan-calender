// ============================================================
// 预加载脚本：只暴露最小必要的桌面能力（无 Node 权限）
// ============================================================

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('timegrid', {
  isDesktop: true,
  hideWidget: () => ipcRenderer.invoke('widget:hide'),
  toggleWidget: () => ipcRenderer.invoke('widget:toggle'),
  openMain: () => ipcRenderer.invoke('main:show'),
  togglePin: () => ipcRenderer.invoke('widget:toggle-pin'),
  isPinned: () => ipcRenderer.invoke('widget:is-pinned'),
  quit: () => ipcRenderer.invoke('app:quit'),
})
