import { test, expect } from '@playwright/test'
import { presets } from '../../src/presets.js'

const field = (page, label) => page.getByLabel(label, { exact: true })
const button = (page, name) => page.getByRole('button', { name, exact: true })
test.beforeEach(async ({ page }) => { await page.goto('./') })

test('changing A history removes obsolete hidden-field errors', async ({ page }) => {
  await field(page, '主机写入预算').fill('128'); await field(page, '日均写入').fill('35')
  await field(page, '卡片状态').selectOption('used'); await button(page, '开始计算').click()
  await expect(field(page, '全寿命累计 Host Writes')).toHaveAttribute('aria-invalid', 'true')
  await field(page, '卡片状态').selectOption('new')
  await expect(page.locator('.field-error[role="alert"]')).toHaveCount(0)
  await button(page, '开始计算').click(); await expect(page.locator('.result-value')).toHaveText('10.0 年')
})

test('changing B consumption source removes irrelevant NAND and historical-estimate errors', async ({ page }) => {
  await button(page, 'P/E 工程估算（高级）').click()
  await field(page, '有效循环容量').fill('32'); await field(page, 'P/E 上限').fill('3000')
  await field(page, '未来 WAF').fill('2'); await field(page, '日均写入').fill('35')
  await field(page, '已经消耗的写入量来源').selectOption('nand'); await field(page, '全寿命 NAND 写入').fill('-1')
  await button(page, '开始计算').click()
  await field(page, '已经消耗的写入量来源').selectOption('new')
  await expect(page.locator('.field-error[role="alert"]')).toHaveCount(0)
  await field(page, '已经消耗的写入量来源').selectOption('estimate'); await button(page, '开始计算').click()
  await field(page, '已经消耗的写入量来源').selectOption('unknown')
  await expect(page.locator('.field-error[role="alert"]')).toHaveCount(0)
})

test('browsing presets retains an editable custom identity until a model is selected', async ({ page }) => {
  await field(page, '卡片型号（可选）').fill('我已有的卡')
  await field(page, '标称容量（可选）').fill('-16')
  await button(page, '工业卡').click()
  await expect(field(page, '标称容量（可选）')).toBeVisible()
  await expect(field(page, '卡片型号（可选）')).toHaveValue('我已有的卡')
  await field(page, '主机写入预算').fill('128'); await field(page, '卡片状态').selectOption('new'); await field(page, '日均写入').fill('35')
  await button(page, '开始计算').click(); await expect(field(page, '标称容量（可选）')).toBeFocused()
  await field(page, '标称容量（可选）').fill('16'); await button(page, '开始计算').click()
  await expect(page.locator('.result-value')).toHaveText('10.0 年')
})

test('light dismissal of help keeps focus in the newly clicked input', async ({ page }) => {
  await button(page, '帮助：主机写入预算').click()
  await field(page, '日均写入').click()
  await expect(page.locator('.help-popover')).toHaveCount(0)
  await expect(field(page, '日均写入')).toBeFocused()
  await field(page, '日均写入').pressSequentially('35'); await expect(field(page, '日均写入')).toHaveValue('35')
})

test('history modal focuses its first invalid field and clears corrected errors', async ({ page }) => {
  await button(page, 'P/E 工程估算（高级）').click()
  await button(page, '没有 NAND 计数？使用历史 WAF 估算').click()
  const modal = page.getByRole('dialog')
  await modal.getByRole('button', { name: '采用估算', exact: true }).click()
  await expect(modal.getByLabel('全寿命累计 Host Writes', { exact: true })).toBeFocused()
  await modal.getByLabel('全寿命累计 Host Writes', { exact: true }).fill('9.6')
  await expect(modal.getByLabel('全寿命累计 Host Writes', { exact: true })).toHaveAttribute('aria-invalid', 'false')
  await modal.getByLabel('全历史 WAF', { exact: true }).fill('4')
  await modal.getByRole('button', { name: '采用估算', exact: true }).click()
  await expect(field(page, '全历史 WAF')).toHaveValue('4')
  await expect(field(page, '未来 WAF')).toHaveValue('')
})

test('small valid budgets and times never appear as zero after display rounding', async ({ page }) => {
  await field(page, '主机写入预算').fill('1'); await field(page, '卡片状态').selectOption('new'); await field(page, '日均写入').fill('100')
  await button(page, '开始计算').click(); await expect(page.locator('.result-value')).toHaveText('10.0 天')
  await button(page, '选型需求').click(); await field(page, '目标年限').fill('5'); await field(page, '日均写入').fill('0.01')
  await button(page, '开始计算').click(); await expect(page.locator('.result-value')).not.toHaveText('0.0 TB')
  await expect(page.locator('.result-value')).toHaveText('0.018 TB')
})

test('removing an optional D candidate clears comparison-only errors without changing the plan', async ({ page }) => {
  await button(page, '选型需求').click(); await field(page, '目标年限').fill('5'); await field(page, '日均写入').fill('35')
  await page.getByText('比较候选卡（可选）', { exact: true }).click()
  await field(page, '候选主机写入预算').fill('128'); await field(page, '候选卡状态').selectOption('used')
  await button(page, '开始计算').click(); await expect(field(page, '候选全寿命累计 Host Writes')).toHaveAttribute('aria-invalid', 'true')
  await field(page, '候选主机写入预算').fill('')
  await expect(page.locator('.field-error[role="alert"]')).toHaveCount(0)
  await button(page, '开始计算').click(); await expect(page.locator('.result-value')).toHaveText('63.9 TB')
  await expect(page.locator('.threshold-label')).toHaveCount(0)
})

test('conditional required fields are exposed without requiring optional identity or candidate inputs', async ({ page }) => {
  for (const name of ['主机写入预算', '日均写入', '卡片状态']) await expect(field(page, name)).toHaveAttribute('required', '')
  for (const name of ['卡片型号（可选）', '标称容量（可选）']) await expect(field(page, name)).not.toHaveAttribute('required', '')
  await field(page, '卡片状态').selectOption('used'); await expect(field(page, '全寿命累计 Host Writes')).toHaveAttribute('required', '')
  await button(page, '选型需求').click(); await expect(field(page, '目标年限')).toHaveAttribute('required', '')
  await page.getByText('比较候选卡（可选）', { exact: true }).click()
  await expect(field(page, '候选主机写入预算')).not.toHaveAttribute('required', '')
  await expect(field(page, '候选卡状态')).not.toHaveAttribute('required', '')
  await field(page, '候选主机写入预算').fill('128'); await expect(field(page, '候选卡状态')).toHaveAttribute('required', '')
})

test('help-to-principles navigation moves keyboard focus to the requested section', async ({ page }) => {
  await button(page, '帮助：主机写入预算').click(); await button(page, '查看计算原理').click()
  await expect(page.locator('#theory-host')).toBeFocused()
  await button(page, '计算分析').click(); await expect(field(page, '主机写入预算')).toHaveValue('')
})

test('advanced card identity stays consistent with main inputs while all source and condition records save', async ({ page }) => {
  await field(page, '卡片型号（可选）').fill('我的测试卡'); await field(page, '标称容量（可选）').fill('16')
  await field(page, '主机写入预算').fill('128'); await field(page, '卡片状态').selectOption('new'); await field(page, '日均写入').fill('35')
  await button(page, '高级设置（可选）').click(); await page.getByText('来源与测量记录（可选）', { exact: true }).click()
  await expect(field(page, '当前型号 / 容量（只读）')).toHaveValue('我的测试卡 · 16 GB')
  await expect(field(page, '当前型号 / 容量（只读）')).toHaveAttribute('readonly', '')
  await field(page, '参数来源').selectOption('measurement')
  await field(page, '版本 / 页码 / 固件').fill('record-7')
  await field(page, '资料来源').fill('<script>window.bad = true</script>')
  await field(page, '日均写入来源').selectOption('measurement'); await field(page, '测量窗口 / 计数重置记录').fill('连续7个自然日，未重置')
  await page.getByText('适用条件核对（可选）', { exact: true }).click()
  await field(page, '评级工况与实际负载').fill('顺序写，70%占用')
  await field(page, '运行温度范围（°C）').fill('-20 ~ 60'); await field(page, '断电保存温度（°C）').fill('25')
  await field(page, '断电保持时间（天）').fill('30'); await field(page, '与厂商条件核对').selectOption('partial')
  await button(page, '保存设置').click(); await button(page, '开始计算').click()
  await page.getByText('来源与适用范围（本次快照）', { exact: true }).click()
  const records = page.locator('.records')
  for (const value of ['我的测试卡 · 16 GB', '测量记录', 'record-7', '连续7个自然日', '顺序写', '-20 ~ 60', '25', '30', '部分核对']) await expect(records).toContainText(value)
  expect(await page.evaluate(() => window.bad)).toBeUndefined()
  await field(page, '标称容量（可选）').fill('32'); await button(page, '重新计算').click()
  await expect(records).toContainText('我的测试卡 · 32 GB')
})

test('near-complete usage never claims the budget is reached by rounded percentage alone', async ({ page }) => {
  await field(page, '主机写入预算').fill('128'); await field(page, '卡片状态').selectOption('used')
  await field(page, '全寿命累计 Host Writes').fill('127.99'); await field(page, '日均写入').fill('0.1')
  await button(page, '开始计算').click()
  await expect(page.locator('.chip')).toHaveText('假设情景')
  await expect(page.locator('.result-facts')).toContainText('<100%')
  await expect(page.locator('.budget-value')).not.toContainText('0.0%')
  await expect(page.locator('.result-value')).toHaveText('100.0 天')
})

test('valid zero load and reached budget stay distinct in every analysis panel', async ({ page }) => {
  await field(page, '主机写入预算').fill('128'); await field(page, '卡片状态').selectOption('used')
  await field(page, '全寿命累计 Host Writes').fill('18.5'); await field(page, '日均写入').fill('0')
  await button(page, '开始计算').click(); await expect(page.locator('.chip')).toHaveText('零负载')
  await expect(page.locator('.sensitivity')).toContainText('设定正负载')
  await field(page, '全寿命累计 Host Writes').fill('128'); await button(page, '重新计算').click()
  await expect(page.locator('.result-value')).toHaveText('预算已达到')
  await expect(page.locator('.sensitivity')).not.toContainText('超出范围')
  await expect(page.locator('.sensitivity')).toContainText('0.0 天')
})

test('short-time chart uses days consistently in axis, accessible label, and numeric table', async ({ page }) => {
  await field(page, '主机写入预算').fill('1'); await field(page, '卡片状态').selectOption('new'); await field(page, '日均写入').fill('100')
  await button(page, '开始计算').click()
  await expect(page.getByRole('img', { name: /^写入量投影：/ })).toHaveAttribute('aria-label', /10 天/)
  await expect(page.locator('.recharts-xAxis-tick-labels')).toContainText('10.0 天')
  await page.getByText('查看图表数值', { exact: true }).click()
  await expect(page.locator('.chart-data th').first()).toHaveText('从现在起（天）')
  await expect(page.locator('.chart-data tbody tr').last().locator('td')).toHaveText(['10', '1'])
})

test('every explicit rate unit changes interpretation only on submission and preserves typed numbers', async ({ page }) => {
  await field(page, '主机写入预算').fill('128'); await field(page, '卡片状态').selectOption('new'); await field(page, '日均写入').fill('35')
  await button(page, '开始计算').click()
  const old = await page.locator('.result-value').innerText()
  const referenceBytes = { GB: 1e9, TB: 1e12, GiB: 1073741824, TiB: 1099511627776 }
  for (const [unit, bytes] of Object.entries(referenceBytes)) {
    await field(page, '日均写入单位').selectOption(unit)
    await expect(field(page, '日均写入')).toHaveValue('35')
    await button(page, '重新计算').click()
    const expectedDays = 128e12 / (35 * bytes)
    const process = await page.locator('.steps').innerText()
    expect(process).toContain('换算天数')
    const resultText = await page.locator('.result-value').innerText()
    expect(resultText.endsWith(expectedDays < 365 ? '天' : '年')).toBe(true)
  }
  await expect(page.locator('.result-value')).not.toHaveText(old)
})

test('modal close and backdrop cancel drafts, keyboard focus is trapped and restored', async ({ page }) => {
  const trigger = button(page, '高级设置（可选）')
  await trigger.click(); await page.getByText('来源与测量记录（可选）', { exact: true }).click()
  await field(page, '资料来源').fill('discarded-close')
  await button(page, '关闭弹窗').click(); await expect(trigger).toBeFocused()
  await trigger.click(); await page.getByText('来源与测量记录（可选）', { exact: true }).click()
  await expect(field(page, '资料来源')).toHaveValue('')
  await field(page, '资料来源').fill('discarded-backdrop')
  await page.mouse.click(2, 2); await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await trigger.click(); const modal = page.getByRole('dialog')
  await button(page, '关闭弹窗').press('Shift+Tab')
  await expect(modal.getByRole('button', { name: '保存设置', exact: true })).toBeFocused()
  await modal.getByRole('button', { name: '保存设置', exact: true }).press('Tab')
  await expect(button(page, '关闭弹窗')).toBeFocused()
  await button(page, '关闭弹窗').press('Escape'); await expect(trigger).toBeFocused()
})

test('help light dismissal does not steal the modal trigger focus', async ({ page }) => {
  await button(page, '帮助：主机写入预算').click()
  const trigger = button(page, '高级设置（可选）')
  await trigger.click(); await expect(page.getByRole('dialog')).toBeVisible()
  await button(page, '取消').click(); await expect(trigger).toBeFocused()
})

test('active chart tooltip reflows when text is enlarged and the viewport shrinks', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 })
  await field(page, '主机写入预算').fill('128'); await field(page, '卡片状态').selectOption('used')
  await field(page, '全寿命累计 Host Writes').fill('18.5'); await field(page, '日均写入').fill('35')
  await button(page, '开始计算').click()
  await page.evaluate(() => { document.documentElement.style.fontSize = '32px' })
  await page.getByRole('application').press('ArrowRight')
  for (let i = 0; i < 8; i += 1) await page.getByRole('application').press('ArrowRight')
  await expect(page.locator('.recharts-default-tooltip')).toBeVisible()
  await expect(page.locator('.recharts-default-tooltip')).toContainText('主机写入量')
  await page.evaluate(() => { document.documentElement.style.fontSize = '' })
  await page.setViewportSize({ width: 320, height: 900 })
  await button(page, '高级设置（可选）').click()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
  await button(page, '取消').click()
  await page.getByRole('application').press('ArrowRight')
  await expect(page.locator('.recharts-default-tooltip')).toBeVisible()
  await expect.poll(() => page.locator('.recharts-default-tooltip').evaluate(el => el.getBoundingClientRect().right)).toBeLessThanOrEqual(320)
})

test('exact budget equality is sufficient in D and reached in B without erasing real tiny deficits', async ({ page }) => {
  await button(page, '选型需求').click(); await field(page, '日均写入').fill('0.1'); await field(page, '目标年限').fill('0.5')
  await page.getByText('比较候选卡（可选）', { exact: true }).click()
  await field(page, '候选主机写入预算').fill('0.01825'); await button(page, '开始计算').click()
  await expect(page.locator('.budget')).toContainText('写入量比较满足')
  await expect(page.locator('.result-facts')).toContainText('+0.0 TB')
  await field(page, '候选主机写入预算').fill('0.01824999999999999999999'); await button(page, '重新计算').click()
  await expect(page.locator('.budget')).toContainText('写入量比较不足')
  await expect(page.locator('.result-facts')).not.toContainText('-0.0 TB')
  await button(page, '写入预算').click(); await button(page, 'P/E 工程估算（高级）').click()
  await field(page, '有效循环容量').fill('0.1'); await field(page, 'P/E 上限').fill('1001')
  await field(page, '已经消耗的写入量来源').selectOption('nand'); await field(page, '全寿命 NAND 写入').fill('0.1001')
  await field(page, '未来 WAF').fill('2'); await field(page, '日均写入').fill('35'); await button(page, '开始计算').click()
  await expect(page.locator('.result-value')).toHaveText('预算已达到')
  await expect(page.locator('.result-facts')).toContainText('100.0%')
  await field(page, '全寿命 NAND 写入').fill('0.10009999999999999999999'); await button(page, '重新计算').click()
  await expect(page.locator('.chip')).toHaveText('假设情景')
  await expect(page.locator('.result-facts')).toContainText('<100%')
  await expect(page.locator('.budget-value')).not.toContainText('0.0%')
})

for (const mode of ['A', 'B', 'D']) {
  test(`every sourced preset can be selected in ${mode} and fills only its published fields`, async ({ page }) => {
    if (mode === 'B') { await button(page, 'P/E 工程估算（高级）').click(); await page.getByText('型号参考（可选）', { exact: true }).click() }
    if (mode === 'D') { await button(page, '选型需求').click(); await page.getByText('比较候选卡（可选）', { exact: true }).click() }
    const categories = { consumer: '消费卡', industrial: '工业卡', high_endurance: '高耐久卡' }
    for (const preset of presets) {
      await button(page, categories[preset.category]).click()
      await field(page, mode === 'D' ? '候选型号 / 容量（可选）' : '卡片型号 / 容量（可选）').selectOption(preset.id)
      await expect(page.locator('.preset-name')).toContainText(preset.manufacturer)
      const metric = preset.published_metrics.find(item => item.type === (mode === 'B' ? 'PE_cycles' : 'manufacturer_TBW'))
      await expect(field(page, mode === 'B' ? 'P/E 上限' : mode === 'D' ? '候选主机写入预算' : '主机写入预算')).toHaveValue(metric ? String(metric.value) : '')
      await expect(field(page, '日均写入')).toHaveValue('')
      if (mode === 'B') { await expect(field(page, '有效循环容量')).toHaveValue(''); await expect(field(page, '未来 WAF')).toHaveValue('') }
    }
  })
}
