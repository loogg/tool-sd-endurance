import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const field = (page, label) => page.getByLabel(label, { exact: true })
const click = (page, name) => page.getByRole('button', { name, exact: true }).click()
async function scan(page, testInfo, state) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
  await testInfo.attach(`accessibility-${state}`, { body: JSON.stringify({ violations: result.violations, incomplete: result.incomplete.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), passes: result.passes.map(item => item.id) }), contentType: 'application/json' })
  expect(result.violations, state).toEqual([])
}

test('accessible names, contrast and structure in every principal state and overlay', async ({ page }, testInfo) => {
  test.setTimeout(90000)
  await page.goto('./'); await scan(page, testInfo, 'empty-A')
  await click(page, '开始计算'); await scan(page, testInfo, 'input-errors')
  await field(page, '主机写入预算').fill('128'); await field(page, '卡片状态').selectOption('used')
  await field(page, '全寿命累计 Host Writes').fill('18.5'); await field(page, '日均写入').fill('35')
  await click(page, '开始计算'); await page.locator('.recharts-line-curve').waitFor(); await scan(page, testInfo, 'success-A')
  await field(page, '卡片状态').selectOption('unknown'); await click(page, '重新计算'); await scan(page, testInfo, 'unknown-A')
  await click(page, '帮助：主机写入预算'); await scan(page, testInfo, 'help')
  await click(page, '关闭'); await click(page, '高级设置（可选）')
  await page.getByText('来源与测量记录（可选）', { exact: true }).click()
  await page.getByText('适用条件核对（可选）', { exact: true }).click(); await scan(page, testInfo, 'advanced')
  await click(page, '取消'); await click(page, 'P/E 工程估算（高级）')
  await scan(page, testInfo, 'empty-B'); await click(page, '没有 NAND 计数？使用历史 WAF 估算')
  await click(page, '采用估算'); await scan(page, testInfo, 'history-errors'); await click(page, '取消')
  await click(page, '选型需求'); await field(page, '目标年限').fill('5'); await field(page, '日均写入').fill('35')
  await click(page, '开始计算'); await scan(page, testInfo, 'selection-D')
  await page.setViewportSize({ width: 320, height: 1000 }); await scan(page, testInfo, 'mobile-D')
  await click(page, '计算原理'); await scan(page, testInfo, 'theory-mobile')
})
