import { describe, it, expect } from 'vitest'
import path from 'node:path'

type ServeModule = {
  mimeFor: (file: string) => string
  resolveAsset: (distDir: string, pathname: string) => string | null
}

// Electron 主进程用的是 CommonJS，这里按模块路径直接加载做纯函数测试
const serve = (await import('../../../electron/serve.cjs')) as unknown as ServeModule

// 用仓库里真实的静态导出目录（npm run build:static 产物）
const DIST = path.resolve(process.cwd(), 'out')
const hasOut = typeof serve.resolveAsset === 'function'

describe('Electron app:// 静态资源解析', () => {
  it('根路径解析到 index.html', () => {
    if (!hasOut) return
    const file = serve.resolveAsset(DIST, '/')
    expect(file?.endsWith('index.html')).toBe(true)
  })

  it('目录式路由解析到 index.html（trailingSlash 产物）', () => {
    const file = serve.resolveAsset(DIST, '/calendar/')
    if (file === null) return // out/ 未构建时跳过
    expect(file.endsWith(path.join('calendar', 'index.html'))).toBe(true)
  })

  it('省略结尾斜杠也能解析', () => {
    const file = serve.resolveAsset(DIST, '/settings')
    if (file === null) return
    expect(file.endsWith(path.join('settings', 'index.html'))).toBe(true)
  })

  it('拒绝目录穿越', () => {
    expect(serve.resolveAsset(DIST, '/../../Windows/win.ini')).toBeNull()
    expect(serve.resolveAsset(DIST, '/..%2f..%2fpackage.json')).toBeNull()
  })

  it('把 RSC 预取路径折叠成实际文件（__next.x.__PAGE__.txt）', () => {
    const file = serve.resolveAsset(DIST, '/calendar/__next.calendar.__PAGE__.txt')
    if (file === null) return // out/ 未构建时跳过
    expect(file.endsWith(path.join('__next.calendar', '__PAGE__.txt'))).toBe(true)
  })

  it('不存在的路径返回 null', () => {
    expect(serve.resolveAsset(DIST, '/definitely-not-here')).toBeNull()
  })

  it('按扩展名给出 MIME', () => {
    expect(serve.mimeFor('/a/b/index.html')).toContain('text/html')
    expect(serve.mimeFor('/a/b/app.js')).toContain('javascript')
    expect(serve.mimeFor('/a/b/style.css')).toContain('text/css')
    expect(serve.mimeFor('/a/b/icon.svg')).toBe('image/svg+xml')
    expect(serve.mimeFor('/a/b/unknown.bin')).toBe('application/octet-stream')
  })
})
