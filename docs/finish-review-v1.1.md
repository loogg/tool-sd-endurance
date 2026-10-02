# v1.1 独立完成审核

日期：2026-10-02。初审发现 F01–F04 四项材料问题；同一审核者对一次修正批次复核，四项均 resolved，remaining clear，disposition: ship。该最终结论覆盖这四项修正；初审范围与证据限制保留在后文，不将修正复核扩大为无条件整体验证。

## 修正复核

## verdict

Evidence is valid for this scoring pass: the 25 refreshed top viewport and 20 scrolled A files were re-opened at their original paths, together with the refreshed B hint/modal captures and all 10 named verdict captures. Intentional scrolled views are treated as viewport evidence. Retained earlier baseline captures remain historical context; the current fix verdict uses the new recaptures and current source.

1. F01 — resolved — `verdict/f01-b-reference-desktop.jpg` shows the selected Kingston 16GB reference with authored C=32 GB preserved, its published P/E=30,000 filled, a visible applicability reminder, and the previous 2.3-year/28.8TB result explicitly marked as a dirty snapshot. `verdict/f01-b-retained-inputs-desktop.jpg` shows H=9.6 TB, historical WAF=4, future WAF=2, and q=35 retained. `src/presets.js:61–66` preserves authored C/cUnit and both WAFs through the input spread without supplying defaults; blank values remain blank. Preset facts label retained values as user hypotheses, and B snapshot source records distinguish reference P/E from user-supplied capacity, WAF, and history.
2. F02 — resolved — the refreshed `b-unknown-desktop.jpg` and `verdict/f02-b-capacity-hint.jpg` visibly say “标称容量不能代替有效循环容量” without the false positional instruction; `src/PresetControls.jsx:19` matches the recapture.
3. F03 — resolved — the original `reflow/a-672-analysis.jpg` now keeps “剩余” together on its own line below 85.5%, with no isolated “余”, clipping, or reduced type scale. The original 671/670px A captures retain the intact phrase in the stacked layout. `verdict/f03-a-672.jpg` and B's 672/671/670px recaptures show the same semantic grouping for 60.0% remaining. The refreshed responsive set retains readable budget text and plotted/table content across the supplied sizes; `src/index.css:152` applies `word-break: keep-all` while retaining overflow recovery.
4. F04 — resolved — `modal-320.jpg` and `verdict/f04-modal-320.jpg` show the close mark inside the existing accessible button; `src/components.jsx:76` confirms it is a drawn, 1.5-stroke SVG path with a hidden graphic and preserved button name. `verdict/f04-preset-source-desktop.jpg` and `verdict/f04-theory-source.jpg` visibly omit the font-arrow markers. Current preset/theory links retain explicit new-window accessible names.

## remaining

clear — all four scored material fixes are resolved. No regressions introduced by this fix batch were identified within the scoring scope. The two incumbent color advisories remain documentation gaps and do not reopen this verdict.

ship covers the scored fixes, not the whole surface.

disposition: ship

## 初审记录（修正前）

disposition: fix

Input limits: no new approved image comp or independent QUALITY BAR card was supplied or expected for this inherited, code-led extension; the historical Figma image is visual-world context. The original acceptance handoff, historical Figma text exports, test logs, and untouched theory implementation were not re-read. Manufacturer URLs were not visited; source truth below concerns the supplied local records and their rendered qualifiers.

## persistence

pass — `PRODUCT.md`, `DESIGN.md`, and `.impeccable/surface.md` exist. PRODUCT declares the web platform, React/Vite stack, browser-local calculations, and separation of source evidence from numerical validity. DESIGN retains the assigned light Fluent-style world, Noto Sans SC, blue actions, 4px controls, 8px panels, result hierarchy, and content-driven responsive layout. The v1.1 amendment in the surface brief records the six user concerns.

The assigned FORM seed is `supplied-design-jw3p4QykbgwxkEE9MFQnF4-2026-10-01`, consistent with the Figma identifier in PRODUCT and the historical image supplied in the packet. This is an extension of an assigned design, so a new concept roll, new comp approval, comp-diff files, raster plates, and comp-led build phases are not requirements for this round. The screenshots retaining v1.0.0 are consistent with the stated pre-release state.

Evidence check 0: pass. All 61 JPG files in this review directory and `reflow/`, the three required clipboard PNGs, and `.review/figma/a-desktop.png` exist, decode, and were opened. The six named full-page baseline JPGs show the document top and their claimed states. No required file contains black/blank corruption or an unrelated page. Native capture widths of 305 for the requested 320px viewport and 1265 for the requested 1280px viewport are consistent with the captured browser's reserved scrollbar area. The larger captures also have coherent dimensions and content.

The `*-analysis.jpg`, `consumer-16gb-320.jpg`, `d-320-result.jpg`, `unknown-final-desktop.jpg`, and `text-200-chart.jpg` files are intentional scrolled viewport evidence, not purported full-page captures. Their missing document top does not invalidate them. The paired top and analysis files were inspected together, with the full-page baselines supplying the complete state. `reflow/a-1440-viewport.jpg` is the valid replacement capture. No missing-file finding was manufactured for the explicitly excluded `a-1440.jpg`.

`responsive.json` and `analysis-responsive.json` corroborate stable q=35 and result=8.6 years, retained plotted curves, and document width not exceeding client width at the requested sizes. They do not erase the visible typographic defect at 672px.

The supplied detector has no primary findings. Its two advisories concern the incumbent selection color `#cde7ff` and 28% modal backdrop. Record these as existing token-documentation gaps; they are not requests to change the palette in this correction round.

## fidelity

The historical image's salient visual devices are a white 56px header over a neutral near-white field; a left parameter panel beside a right result and analysis workspace; compact blue filled actions and blue outlined category selection; restrained amber state treatment; a prominent numeric result; budget, projection, sensitivity, and arithmetic panels; and flat, fine-bordered geometry without illustrative or physical-material effects. It establishes the inherited world, while the user's six corrections authorize the interaction changes below. No element obligations are inferred from a new image comp.

| Element or promise | State | Evidence and authority |
| --- | --- | --- |
| TYPE | match | Noto Sans SC is self-hosted at 400/500/700 weights in `src/index.css:1`; the 36px result, 30px budget, and smaller field/analysis hierarchy retain the assigned UI lettering character. The 672px wrapping defect is a separate finish row below. |
| MATERIAL | match | The screenshot surfaces are flat white/gray panels, fine borders, and geometric chart marks, as the assigned Fluent-style world requires. No fake bevel, embossed metal, painted material, raster substitute, or buried asset is introduced. |
| GROUND | match | The contract target is `#fafafa`. Sampling pixel (20,100) in both the historical PNG and `a-desktop.jpg` gives RGB 250,250,250; header pixel (20,20) is 255,255,255 in both. There is no cream or cool-slate drift. |
| Goal followed by one common/advanced A/B method group | adaptation | User concerns 2 and 3 authorize replacing the formerly moving P/E entrance. `a-desktop.jpg`, `b-preset-16gb-desktop.jpg`, and `b-unknown-desktop.jpg` show the same group immediately after the goal. `src/App.jsx:108` renders it once for both budget modes and preserves separate mode states. |
| Optional custom model and nominal-capacity fields | adaptation | User concern 1 authorizes two visible identity fields. They appear together on desktop and stack at 320px. App updates the source identity; `src/model.js:73` validates a supplied capacity but does not use it in endurance arithmetic. |
| Custom identity explanation in B | contradicted | `src/PresetControls.jsx:19` says nominal capacity cannot replace “下方有效循环容量”. In `b-unknown-desktop.jpg` and `src/App.jsx:114–115`, effective cycling capacity is above the model-reference disclosure. The positional instruction is false. See F02. |
| Plain P/E explanation and guidance for ordinary users | match | B's visible method hint defines NAND erase/program cycles and directs ordinary users to host TBW or selection demand. `pe-help-desktop.jpg` and `src/help.js` add the expansion, approximate capacity × cycles calculation, and WAF conversion without suggesting nominal capacity can fill the cycling pool. |
| Unknown history: useful known facts and recovery | adaptation | User concern 4 authorizes replacing repeated unknown budget/chart/sensitivity cards. The A and B unknown baselines display known total budget plus annual future host-writing demand, explain why remaining time is unavailable, and offer complete-history or explicit load-to-selection actions. `UnknownHistory` uses the successful result; both actions disable while dirty. |
| Expanded preset inventory and small cards | adaptation | User concern 5 authorizes the catalog expansion. The local registry has 44 records across Kingston, Transcend, Samsung, SanDisk, and KIOXIA. Explicit 8/16GB records preserve their own published metrics; the 8GB Transcend capture shows its sourced 360TB and 60,000-cycle records, while the 16GB Kingston B capture fills only 30,000 P/E cycles and leaves C/WAF empty. |
| Preset filling, counting-scope adoption, and remaining-input explanation | match | User concern 6 authorizes filling published metadata and numerical parameters. `preset-8gb-desktop.jpg` shows the host-budget adoption checkbox and source qualifiers; the B preset names missing C, WAF, history source, and workload. Video-hour records remain video hours. The model enforces confirmation for unspecified Host/NAND TBW scope. |
| Authored engineering assumptions survive reference selection | contradicted | The packet promises that selecting another card replaces only known card specifications and that user hypotheses survive. `applyPreset` in `src/presets.js` instead unconditionally clears C, `wafFuture`, and `wafPast` for B, including deliberate user input, while retaining q, H, and consumption choice. This silently destroys part of the user's workload/history assumptions and forces repeated manual entry. See F01. |
| Category/brand/capacity browsing and successful snapshot | match | The signature excludes browse/disclosure state. Browsing preserves the current selected card as an out-of-filter option. Results, charts, arithmetic, assumptions, and source records consume snapshot data, and dirty actions do not use live edited inputs. Explicit custom selection removes untouched manufacturer numerical values while retaining deliberately edited ones. |
| Native controls, help, modal, and state semantics | match | The captures show native selects, disclosures, help popover, and an in-viewport 320px dialog. Source supplies explicit labels, help names, error association, pressed states, native modal/popover lifecycle, Esc handling, first-error focus, and focus restoration. The packet's native interaction observations are distinct from the secondary E2E claims; this reviewer did not replay browser interactions. |
| Responsive layout and 200% text | adaptation | The user expressly requests actual minimum/typical/breakpoint inspection. Paired captures support stacked forms/results, field reflow, three or five chart ticks as space allows, full source wrapping, and the accessible numerical disclosure. The 200% text pair retains chart origin/tick separation and readable type. |
| Budget label at the analysis stacking threshold | contradicted | `reflow/a-672-analysis.jpg` visibly renders “85.5% 剩” on one line and a lone “余” on the next. The 671/670px captures stack the cards and avoid this break. `src/Analysis.jsx:63` places the percentage and word in one text node, while `src/index.css:152` allows wrapping anywhere. This fails the contract's readable responsive composition and the floor's type check. See F03. |
| Icon drawing convention | contradicted | The 320px dialog shows a font-glyph × close icon, and the expanded preset source captures show a ↗ glyph used as the external-link icon. `src/components.jsx:76` and `src/PresetControls.jsx:36` confirm the glyph substitutions. The craft floor requires drawn icons in a consistent stroke/weight. See F04. |

Contract checks: THESIS is kept in the distinction between hypothetical budget and actual failure, and in snapshot-based analysis. OWN-WORLD is kept in type, ground, color, geometry, and density. STORY is kept by the task/method/input/result/source sequence; F01 interrupts repeated preset comparison by silently deleting authored engineering parameters. FIRST VIEWPORT retains the desktop form/result relationship, while narrow views reflow; F03 is the material responsive exception. FORM keeps the assigned composition and recorded seed. The first viewport is identifiable as a focused SD writing-budget tool, with its method choice, card identity, and result hierarchy carrying that identity.

Truth checks: the local preset records label manufacturer facts, series/generation/capacity limitations, unspecified counting scope, and discontinued models. Missing endurance metrics are not fabricated, highest-capacity TBW is not linearly allocated to lower capacities, and nominal capacity/video duration do not become host budget or cycling capacity. Calculation examples are labeled hypothetical. Unknown-history remaining budget/time stay null. No raster-region spec applies to this extension. External source accuracy is not independently re-certified by this file-only review.

## ceiling

reached for the inherited world's surface conventions: compact controls, restrained blue/amber semantics, fine-bordered flat panels, numeric hierarchy, native disclosures, and data/assumption labels. No independent QUALITY BAR card was supplied, so no unrelated ornament, material, or motion requirement is invented. The unused finishing devices relevant here are keeping a Chinese semantic word intact at a width boundary and using the drawn icon vocabulary already established by the Figma help/chevron assets; F03 and F04 remain open. The permitted panel/metric structure comes from the assigned Figma and product truth, rather than a new generic scaffold. No kicker, decorative section number, hard-offset shadow, gradient text, thick colored side stripe, or fake physical material was found.

## material_fixes

1. F01 — Contract STORY / user concern 6 / preset-state promise: in `src/presets.js` `applyPreset`, preserve deliberately authored C, future WAF, and historical WAF when selecting a B reference preset; replace only sourced card facts and retain their assumption status. Validate a preset switch after authored engineering inputs, including estimate-history H + past WAF, and confirm the prior successful result remains a dirty snapshot until recalculation.
2. F02 — User concern 1 / copy truth: remove the false “下方” direction from the B custom identity hint in `src/PresetControls.jsx:19`; describe nominal capacity versus effective cycling capacity without implying a field position the rendered layout does not have.
3. F03 — FIRST VIEWPORT / craft-floor type: prevent “剩余” from splitting at the 672px analysis boundary (`reflow/a-672-analysis.jpg`, `src/Analysis.jsx:63`, `src/index.css:152`); group the word intact and/or stack the budget/chart before the title loses a sensible line break, preserving the established type scale. Recapture 672/671/670px and an affected B budget state.
4. F04 — Craft-floor icon rule: replace the modal's × font glyph and preset source link's ↗ font glyph with drawn line SVGs matching the existing icon stroke/weight, or remove the redundant external-link indicator; retain accessible close/link names. Verify the 320px modal and expanded source disclosure.

## keep

Keep the assigned light Fluent-style world, stable common/advanced method entrance, optional identity outside the arithmetic, qualified capacity-specific manufacturer facts, explicit TBW adoption, unknown-history nulls with useful next steps, and all displayed results/source records bound to the successful snapshot.
