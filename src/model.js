// Model 00, retrieved from Figma on 2026-10-01. Internal units: decimal TB, days.
export const UNIT_TB = { TB: 1, GB: 0.001, TiB: 2 ** 40 / 1e12, GiB: 2 ** 30 / 1e12 }
const UNIT_BYTES = { TB: 1000000000000n, GB: 1000000000n, TiB: 1099511627776n, GiB: 1073741824n }

// Keep authored decimals exact through budget products and differences. Convert
// once for the numeric snapshot; an epsilon would erase genuine small deficits.
function decimal(value) {
  const [mantissa, power = '0'] = String(value).trim().toLowerCase().split('e')
  const [whole, fraction = ''] = mantissa.replace(/^[+-]/, '').split('.')
  const digits = (whole + fraction).replace(/^0+/, '')
  if (!digits) return { coefficient: 0n, exponent: 0 }
  const significant = digits.replace(/0+$/, '')
  return { coefficient: BigInt(`${mantissa.startsWith('-') ? '-' : ''}${significant}`), exponent: Number(power) - fraction.length + digits.length - significant.length }
}
function amountDecimal(value, unit) {
  const amount = decimal(value)
  return { coefficient: amount.coefficient * UNIT_BYTES[unit], exponent: amount.exponent - 12 }
}
function multiplyDecimal(a, b) { return { coefficient: a.coefficient * b.coefficient, exponent: a.exponent + b.exponent } }
function subtractDecimal(a, b) {
  const exponent = Math.min(a.exponent, b.exponent)
  return { coefficient: a.coefficient * 10n ** BigInt(a.exponent - exponent) - b.coefficient * 10n ** BigInt(b.exponent - exponent), exponent }
}
function nonnegativeDecimal(value) { return value.coefficient < 0n ? decimal('0') : value }
function decimalNumber(value) { return Number(`${value.coefficient}e${value.exponent}`) }
function usedComparison(difference) { return difference.coefficient > 0n ? -1 : difference.coefficient < 0n ? 1 : 0 }

export function blankAdvanced() {
  return { sourceKind: 'assumption', model: '', locator: '', source: '', workloadSource: 'planning', window: '', workload: '', operating: '', storage: '', retention: '', conditions: 'unverified' }
}

export function blankInput(mode) {
  const shared = { q: '', qUnit: 'GB', category: 'custom', brandFilter: '', capacityFilter: '', cardName: '', nominalCapacity: '', presetId: '', presetAdopted: false, presetModified: false, budgetNeedsConfirmation: false }
  if (mode === 'B') return { ...shared, C: '', cUnit: 'GB', PE: '', consumption: '', N: '', nUnit: 'TB', H: '', hUnit: 'TB', wafPast: '', wafFuture: '', referenceOpen: false }
  if (mode === 'D') return { ...shared, Y: '', E: '', eUnit: 'TB', history: 'new', H: '', hUnit: 'TB', candidateOpen: false }
  return { ...shared, E: '', eUnit: 'TB', history: '', H: '', hUnit: 'TB' }
}

export function signature(input, advanced) {
  const { candidateOpen: _candidateOpen, referenceOpen: _referenceOpen, category: _category, brandFilter: _brandFilter, capacityFilter: _capacityFilter, ...parameters } = input
  return JSON.stringify([parameters, advanced])
}

export function requiredFields(mode, input) {
  const fields = ['q']
  if (mode === 'A' || (mode === 'D' && String(input.E ?? '').trim())) {
    if (mode === 'A') fields.push('E')
    fields.push('history')
    if (input.history === 'used') fields.push('H')
  }
  if (mode === 'B') {
    fields.push('C', 'PE', 'wafFuture', 'consumption')
    if (input.consumption === 'nand') fields.push('N')
    if (input.consumption === 'estimate') fields.push('H', 'wafPast')
  }
  if (mode === 'D') fields.push('Y')
  return fields
}

export function clearChangedErrors(errors, key, input, mode) {
  const changedField = { eUnit: 'E', hUnit: 'H', qUnit: 'q', cUnit: 'C', nUnit: 'N' }[key] ?? key
  const next = { ...errors }
  delete next[changedField]
  if (key === 'history' && input.history !== 'used') delete next.H
  if (key === 'consumption') {
    if (input.consumption !== 'nand') delete next.N
    if (input.consumption !== 'estimate') { delete next.H; delete next.wafPast }
  }
  if (['E', 'eUnit'].includes(key)) delete next.presetAdopted
  if (mode === 'D' && !String(input.E ?? '').trim()) { delete next.H; delete next.history }
  return next
}

const NUMERIC = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i

export function parseNumber(value, { positive = false } = {}) {
  const text = String(value ?? '').trim()
  if (!text) return { error: positive ? '请输入大于 0 的数值。' : '请输入大于或等于 0 的数值。' }
  if (!NUMERIC.test(text)) return { error: '请输入有限数值，不要附加单位或其他文字。' }
  const number = Number(text)
  if (!Number.isFinite(number)) return { error: '数值超出可计算范围，请减小数值。' }
  if (number === 0 && /[1-9]/.test(text.split(/e/i)[0])) return { error: '数值过小，无法保持计算精度。' }
  if (positive ? number <= 0 : number < 0) return { error: positive ? '数值必须大于 0。' : '数值不能为负。' }
  return { value: number }
}

function finite(value, field, positive = false) {
  if (!Number.isFinite(value) || (positive && value === 0)) {
    const error = new Error('数值或单位换算超出可计算范围，请调整输入。')
    error.field = field
    throw error
  }
  return value
}

export function estimateHistory(input) {
  const host = parseNumber(input.H)
  const waf = parseNumber(input.wafPast, { positive: true })
  const errors = {}
  if (host.error) errors.H = host.error
  if (waf.error) errors.wafPast = waf.error
  if (!UNIT_TB[input.hUnit]) errors.H = '请选择支持的单位。'
  if (Object.keys(errors).length) return { errors }
  try {
    const hostAmount = amountDecimal(input.H, input.hUnit)
    const H = finite(decimalNumber(hostAmount), 'H', host.value > 0)
    return { result: { H, wafPast: waf.value, N: finite(decimalNumber(multiplyDecimal(hostAmount, decimal(input.wafPast))), 'wafPast', H > 0) } }
  } catch (error) { return { errors: { [error.field]: error.message } } }
}

export function calculate(mode, input) {
  const errors = {}
  const number = (key, positive = false) => {
    const result = parseNumber(input[key], { positive })
    if (result.error) errors[key] = result.error
    return result.value
  }
  const units = (key, unitKey, positive = false) => {
    const n = number(key, positive)
    const factor = UNIT_TB[input[unitKey]]
    if (!factor) { errors[key] = '请选择支持的单位。'; return undefined }
    if (n === undefined) return undefined
    const converted = decimalNumber(amountDecimal(input[key], input[unitKey]))
    if (!Number.isFinite(converted) || (n > 0 && converted === 0)) errors[key] = '单位换算超出可计算范围。'
    return converted
  }
  const qTB = units('q', 'qUnit')
  if (String(input.nominalCapacity ?? '').trim()) number('nominalCapacity', true)
  let E, H = null, C, PE, N = null, wafFuture, wafPast, Y
  if (mode === 'A' || (mode === 'D' && String(input.E ?? '').trim())) {
    E = units('E', 'eUnit', true)
    if (input.budgetNeedsConfirmation && !input.presetAdopted && !input.presetModified) errors.presetAdopted = '请确认将厂商 TBW 作为本次主机预算假设，或修改预算为自己的假设。'
    if (!['new', 'used', 'unknown'].includes(input.history)) errors.history = '请选择全新卡、历史完整或历史未知。'
    if (input.history === 'new') H = 0
    if (input.history === 'used') H = units('H', 'hUnit')
  }
  if (mode === 'B') {
    C = units('C', 'cUnit', true)
    PE = number('PE', true)
    wafFuture = number('wafFuture', true)
    if (!['new', 'nand', 'estimate', 'unknown'].includes(input.consumption)) errors.consumption = '请选择已经消耗的写入量来源。'
    if (input.consumption === 'new') N = 0
    if (input.consumption === 'nand') N = units('N', 'nUnit')
    if (input.consumption === 'estimate') {
      H = units('H', 'hUnit')
      wafPast = number('wafPast', true)
    }
  }
  if (mode === 'D') Y = number('Y', true)
  if (Object.keys(errors).length) return { errors }
  try {
    const daily = amountDecimal(input.q, input.qUnit)
    const annual = multiplyDecimal(daily, decimal('365'))
    const qGB = finite(decimalNumber(multiplyDecimal(daily, decimal('1000'))), 'q', qTB > 0)
    const annualHostWrites = finite(decimalNumber(annual), 'q', qTB > 0)
    const result = { mode, qTB, qGB, annualHostWrites, E, H, C, PE, N, wafFuture, wafPast, Y, days: null, years: null, remaining: null, margin: null, available: null, usedRatio: null, usedComparison: null, status: 'assumption' }
    if (mode === 'D') {
      const required = multiplyDecimal(annual, decimal(input.Y))
      result.required = finite(decimalNumber(required), 'Y', qTB > 0)
      if (E !== undefined && H !== null) {
        const available = nonnegativeDecimal(subtractDecimal(amountDecimal(input.E, input.eUnit), input.history === 'new' ? decimal('0') : amountDecimal(input.H, input.hUnit)))
        result.available = finite(decimalNumber(available), 'E', available.coefficient > 0n)
        const margin = subtractDecimal(available, required)
        result.margin = finite(decimalNumber(margin), 'E', margin.coefficient !== 0n)
      }
      return { result }
    }
    if (mode === 'B') {
      const budget = multiplyDecimal(amountDecimal(input.C, input.cUnit), decimal(input.PE))
      result.nandBudget = finite(decimalNumber(budget), 'PE', true)
      result.totalHost = finite(result.nandBudget / wafFuture, 'wafFuture', true)
      const consumed = input.consumption === 'estimate' ? multiplyDecimal(amountDecimal(input.H, input.hUnit), decimal(input.wafPast)) : input.consumption === 'nand' ? amountDecimal(input.N, input.nUnit) : decimal('0')
      if (input.consumption === 'estimate') result.N = N = finite(decimalNumber(consumed), 'wafPast', H > 0)
      if (N !== null) {
        const difference = subtractDecimal(budget, consumed)
        result.nandRemaining = finite(decimalNumber(nonnegativeDecimal(difference)), 'N', difference.coefficient > 0n)
        result.remaining = finite(result.nandRemaining / wafFuture, 'wafFuture', result.nandRemaining > 0)
        result.usedRatio = finite(N / result.nandBudget, 'N', N > 0)
        result.usedComparison = usedComparison(difference)
      }
    } else if (H !== null) {
      const difference = subtractDecimal(amountDecimal(input.E, input.eUnit), input.history === 'new' ? decimal('0') : amountDecimal(input.H, input.hUnit))
      result.remaining = finite(decimalNumber(nonnegativeDecimal(difference)), 'H', difference.coefficient > 0n)
      result.usedRatio = finite(H / E, 'H', H > 0)
      result.usedComparison = usedComparison(difference)
    }
    if (result.usedRatio !== null) finite(result.usedRatio * 100, mode === 'B' ? 'N' : 'H')
    if (result.remaining === null) result.status = 'unknown'
    else if (result.remaining === 0) { result.status = 'reached'; result.days = 0; result.years = 0 }
    else if (qTB === 0) result.status = 'zero'
    else {
      result.days = finite(result.remaining / qTB, 'q', true)
      result.years = finite(result.days / 365, 'q', true)
    }
    return { result }
  } catch (error) {
    return { errors: { [error.field || 'q']: error.message } }
  }
}

// All derived analysis consumes the same unrounded successful result.
export function projection(result) {
  if (result.mode !== 'D' && result.years === null) return null
  const horizon = result.mode === 'D' ? result.Y : result.years
  if (horizon === 0) return null
  const start = result.mode === 'A' ? result.H : 0
  const amount = result.mode === 'D' ? result.required : result.remaining
  return {
    horizon,
    threshold: result.mode === 'D' ? result.available : result.mode === 'A' ? result.E : result.remaining,
    points: Array.from({ length: 17 }, (_, i) => ({ years: horizon * (i / 16), tb: start + amount * (i / 16) })),
  }
}

export function sensitivity(result) {
  if (result.mode === 'D') {
    return [0.6, 1, 1.4, 2].map(factor => {
      const years = result.Y * factor
      const value = result.required * factor
      const valid = Number.isFinite(years) && Number.isFinite(value)
      return { labelValue: valid ? years : null, value: valid ? value : null, current: factor === 1 }
    })
  }
  return [0.5, 1, 1.5, 2].map(factor => {
    const q = result.qGB * factor
    const valid = Number.isFinite(q) && (result.qTB === 0 || result.qTB * factor > 0)
    const value = !valid || result.remaining === null ? null : result.remaining === 0 ? 0 : q === 0 ? null : result.years / factor
    return { labelValue: valid ? q : null, value: Number.isFinite(value) ? value : null, current: factor === 1 }
  })
}

export function format(value, digits = 1) {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—'
  if (Math.abs(value) >= 1e9 || (value !== 0 && Math.abs(value) < 0.001)) return value.toExponential(3)
  const places = value !== 0 && Math.abs(value) < 0.5 * 10 ** -digits ? Math.max(digits, 1 - Math.floor(Math.log10(Math.abs(value)))) : digits
  return value.toLocaleString('zh-CN', { maximumFractionDigits: places, minimumFractionDigits: places })
}

export function exact(value) { return format(value, 6).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1') }

export function formatTime(years) {
  if (years === null || years === undefined || !Number.isFinite(years)) return '—'
  return years < 1 ? `${format(years * 365)} 天` : `${format(years)} 年`
}

export function formatPercent(value, comparison = Math.sign(value - 100)) {
  if (!Number.isFinite(value)) return '—'
  const rounded = Number(value.toFixed(1))
  if (comparison < 0 && value > 0 && rounded === 100) return '<100%'
  if (comparison > 0 && rounded === 100) return '>100%'
  return `${format(value)}%`
}
