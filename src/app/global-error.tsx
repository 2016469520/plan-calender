'use client'

import { useEffect } from 'react'

/**
 * 根级兜底：布局或全局 Provider 渲染出错时，至少给出可操作的界面，
 * 而不是一个白窗口（0.3.1 的无限重渲染就是白屏）。
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 方便用户反馈时截图/复制
    console.error('[时格] 渲染出错：', error)
  }, [error])

  return (
    <html lang="zh-CN">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", "Microsoft YaHei", Roboto, sans-serif',
          background: 'linear-gradient(135deg, #f5f3ff, #ecfeff)',
          color: '#1f2937',
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 460,
            width: '100%',
            background: '#fff',
            border: '1px solid #ddd6fe',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 20px 45px -25px rgba(109, 40, 217, 0.45)',
          }}
        >
          <h1 style={{ margin: '0 0 8px', fontSize: 18 }}>界面出了点问题</h1>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
            数据都还在本机，没有丢失。可以先点「重新加载」；如果反复出现，把下面的错误信息发给我。
          </p>

          <pre
            style={{
              margin: '0 0 16px',
              padding: 12,
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 11,
              lineHeight: 1.5,
              maxHeight: 140,
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {String(error?.message || error)}
            {error?.digest ? `\n\ndigest: ${error.digest}` : ''}
          </pre>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                flex: 1,
                padding: '8px 14px',
                fontSize: 13,
                color: '#fff',
                background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              重新加载
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                flex: 1,
                padding: '8px 14px',
                fontSize: 13,
                color: '#4b5563',
                background: '#fff',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              刷新页面
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
