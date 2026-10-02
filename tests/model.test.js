import test from 'node:test'
import assert from 'node:assert/strict'
import { blankInput, calculate, estimateHistory, format, parseNumber, projection, sensitivity, UNIT_TB } from '../src/model.js'

function calc(mode, values) {
  const evaluated = calculate(mode, { ...blankInput(mode), ...values })
  assert.equal(evaluated.errors, undefined, JSON.stringify(evaluated.errors))
  return evaluated.result
}
function near(actual, expected) { assert.ok(Math.abs(actual - expected) <= Math.max(1, Math.abs(expected)) * 1e-12, `${actual} != ${expected}`) }
const a = { E: '128', H: '18.5', history: 'used', q: '35' }
const b = { C: '32', PE: '3000', consumption: 'nand', N: '38.4', wafFuture: '2', q: '35' }

test('A used card: exact remaining budget and time', () => {
  const r = calc('A', a)
  near(r.remaining, 109.5); near(r.days, 3128.5714285714284); near(r.years, 8.571428571428571)
})
test('A recalculation at twice the load leaves budget unchanged', () => {
  const r = calc('A', { ...a, q: '70' })
  near(r.remaining, 109.5); near(r.days, 1564.2857142857142)
})
test('A zero history requires an explicit new-card declaration', () => {
  const r = calc('A', { E: '128', history: 'new', q: '35' })
  near(r.H, 0); near(r.remaining, 128); near(r.days, 3657.142857142857)
  assert.ok(calculate('A', { ...blankInput('A'), E: '128', q: '35' }).errors.history)
})
test('D requires no candidate or WAF: exact demand', () => {
  const r = calc('D', { q: '35', Y: '5' })
  near(r.required, 63.875); assert.equal(r.available, null); assert.equal(r.margin, null)
  assert.equal(projection(r).threshold, null)
})
test('D explicit new candidate margin', () => {
  const r = calc('D', { q: '35', Y: '5', E: '128' })
  near(r.required, 63.875); near(r.margin, 64.125)
})
test('B deducts NAND consumed before future WAF conversion', () => {
  const r = calc('B', b)
  near(r.nandBudget, 96); near(r.remaining, 28.8); near(r.days, 822.8571428571429)
  const p = projection(r); near(p.points[0].tb, 0); near(p.points.at(-1).tb, 28.8)
})
test('B historical WAF is distinct from future WAF', () => {
  const r = calc('B', { ...b, consumption: 'estimate', H: '9.6', wafPast: '4' })
  near(r.N, 38.4); near(r.remaining, 28.8)
  near(estimateHistory({ H: '9600', hUnit: 'GB', wafPast: '4' }).result.N, 38.4)
})
test('zero load keeps the budget without infinite time', () => {
  for (const [mode, input] of [['A', a], ['B', b]]) {
    const r = calc(mode, { ...input, q: '0' }); assert.equal(r.status, 'zero'); assert.equal(r.days, null); assert.equal(projection(r), null)
  }
  near(calc('D', { Y: '5', q: '0' }).required, 0)
})
test('unknown history never turns into zero history or a finite projection', () => {
  const r = calc('A', { ...a, history: 'unknown' })
  assert.equal(r.H, null); assert.equal(r.remaining, null); assert.equal(r.days, null); assert.equal(projection(r), null)
  const nand = calc('B', { ...b, consumption: 'unknown' }); assert.equal(nand.N, null); assert.equal(nand.days, null); near(nand.totalHost, 48)
  const d = calc('D', { E: '128', history: 'unknown', Y: '5', q: '35' }); assert.equal(d.margin, null); assert.equal(projection(d).threshold, null)
})
test('budget reached has priority even under zero load', () => {
  const r = calc('A', { ...a, H: '150', q: '0' }); assert.equal(r.status, 'reached'); near(r.remaining, 0); near(r.days, 0)
  const nand = calc('B', { ...b, N: '100' }); assert.equal(nand.status, 'reached'); near(nand.remaining, 0)
})
test('used candidates deduct complete history and can be insufficient', () => {
  const r = calc('D', { q: '35', Y: '5', E: '80', history: 'used', H: '30' })
  near(r.available, 50); near(r.margin, -13.875)
})
test('decimal and binary units convert explicitly', () => {
  const r = calc('A', { E: '1', eUnit: 'TiB', H: '128', hUnit: 'GiB', history: 'used', q: '1', qUnit: 'GiB' })
  near(r.remaining, 896 * UNIT_TB.GiB); near(r.days, 896)
  near(calc('D', { q: '0.035', qUnit: 'TB', Y: '5' }).required, 63.875)
})
test('invalid, nonfinite, negative, overflow and underflow inputs are errors', () => {
  for (const value of ['', ' ', '-1', 'NaN', 'Infinity', '1e999', '1e-999', '35/day', '0x10', '1,000']) assert.ok(calculate('A', { ...blankInput('A'), ...a, q: value }).errors.q, value)
  for (const [key, value] of [['E', '0'], ['H', '-1']]) assert.ok(calculate('A', { ...blankInput('A'), ...a, [key]: value }).errors[key])
  assert.ok(calculate('D', { ...blankInput('D'), Y: '1e308', q: '1e308' }).errors)
  assert.ok(calculate('B', { ...blankInput('B'), ...b, PE: '1e308', C: '1e308' }).errors)
  assert.ok(estimateHistory({ H: '1e308', hUnit: 'TB', wafPast: '100' }).errors.wafPast)
  assert.ok(parseNumber('5e-324').value > 0)
})
test('zero WAF and incomplete historical estimates are rejected', () => {
  assert.ok(calculate('B', { ...blankInput('B'), ...b, wafFuture: '0' }).errors.wafFuture)
  assert.ok(calculate('B', { ...blankInput('B'), ...b, consumption: 'estimate', H: '9.6', wafPast: '' }).errors.wafPast)
})
test('projection and sensitivity share unrounded results', () => {
  const r = calc('A', a); const p = projection(r)
  near(p.horizon, r.years); near(p.points.at(-1).tb, r.E); near(p.points[0].tb, r.H)
  near(sensitivity(r)[3].value, r.years / 2)
  const d = calc('D', { Y: '5', q: '35' }); near(sensitivity(d)[2].value, 89.425)
})
test('non-demo inputs vary by the same model without hidden multipliers', () => {
  for (const [E, H, q] of [[27.4, 3.21, 17.3], [845, 122.8, 92.6], [4, 0.78, 5.9]]) {
    const r = calc('A', { E: String(E), H: String(H), history: 'used', q: String(q) })
    near(r.remaining, E - H); near(r.days, (E - H) / (q / 1000))
  }
  near(calc('B', { C: '64', PE: '1500', N: '17.8', consumption: 'nand', wafFuture: '3.1', q: '19.4' }).remaining, (96 - 17.8) / 3.1)
  near(calc('D', { Y: '2.75', q: '12.8' }).required, 12.848)
})

test('small positive results and deficits do not round to false zero', () => {
  assert.notEqual(format(0.01825), '0.0')
  assert.notEqual(format(-0.01825), '-0.0')
  assert.notEqual(format(0.0125), '0.0')
  assert.equal(format(0), '0.0')
})

test('sensitivity handles both zero-budget/zero-load priority and unrepresentable scenarios', () => {
  const reached = calc('A', { E: '1', H: '2', history: 'used', q: '0' })
  assert.ok(sensitivity(reached).every(row => row.value === 0))
  const extreme = calc('A', { E: '1e306', history: 'new', q: '1e308' })
  const row = sensitivity(extreme).at(-1)
  assert.equal(row.labelValue, null); assert.equal(row.value, null)
  const plan = calc('D', { Y: '1e308', q: '0' })
  assert.equal(sensitivity(plan).at(-1).labelValue, null)
  assert.equal(sensitivity(plan).at(-1).value, null)
})
