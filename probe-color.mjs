import { buildPalette, contrastRatio } from './src/lib/theme/color.ts'
for (const seed of ['#db2777','#2563eb','#7c3aed','#059669','#ea580c','#eab308']) {
  for (const dark of [false,true]) {
    const p = buildPalette(seed, 60, dark)
    const r = contrastRatio(p.onPrimary, p.primary)
    if (r < 4.4) console.log('FAIL', seed, dark, p.primary, p.onPrimary, r.toFixed(3))
  }
}
console.log('done')