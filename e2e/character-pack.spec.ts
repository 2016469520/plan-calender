import { expect, test } from '@playwright/test'

test.use({ reducedMotion: 'reduce' })

test('local pack selection, dialogue preview and companion survive reload', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => {
    if (!localStorage.getItem('timegrid:appearance:v1')) {
      localStorage.setItem('timegrid:appearance:v1', JSON.stringify({
        version: 1, atmosphere: { welcome: false, characterPosition: 'bottom-right', characterAutoState: false },
      }))
    }
    Object.defineProperty(window, 'timegrid', { value: {
      hideWidget: async () => {}, toggleWidget: async () => false, showWidget: async () => false,
      isWidgetVisible: async () => false, openMain: async () => {}, togglePin: async () => false,
      isPinned: async () => false, quit: async () => {},
      scanCharacterPacks: async () => ({ root: 'fixture', error: null, packs: [{
        dir: 'cutout-test', manifest: { id: 'cutout-test', name: '测试伙伴',
          dialogue: { idle: ['看啥看？'], thinking: ['认真思考中', '啥呢？'] } },
        images: { half_body: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=' },
      }] }),
    } })
  })
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
  await page.getByTestId('enter-demo-mode').click()
  await expect(page).toHaveURL(/\/calendar/, { timeout: 15000 })
  await page.goto('/settings')
  const card = page.getByTestId('character-card-pack-cutout-test')
  await card.getByRole('button', { name: '查看 测试伙伴 详情' }).click()
  const detail = page.getByTestId('character-detail')
  await detail.getByRole('button', { name: '思考', exact: true }).click()
  await expect(detail.getByRole('status')).toHaveText('认真思考中')
  await detail.getByRole('button', { name: '换句台词' }).click()
  await expect(detail.getByRole('status')).toHaveText('啥呢？')
  await detail.getByRole('button', { name: '关闭详情' }).click()
  await card.getByRole('button', { name: '选用', exact: true }).click()
  const companion = page.getByTestId('atmosphere-character')
  await expect(companion.getByRole('button')).toHaveCSS('animation-name', 'none')
  await companion.getByRole('button', { name: '测试伙伴，当前状态：待机' }).click()
  await expect(companion.getByRole('status')).toHaveText('看啥看？')
  await expect(companion.getByRole('status')).toBeHidden({ timeout: 7000 })
  await page.reload()
  await expect(page.getByTestId('character-card-pack-cutout-test')).toHaveAttribute('data-active', 'true')
  await expect(companion).toHaveAttribute('data-character', 'pack-cutout-test')
})
