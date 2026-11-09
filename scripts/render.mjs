// Genera las imágenes del README del perfil en assets/, en claro y oscuro.
//   node scripts/render.mjs <ruta a @fontsource-variable/fraunces/files>
// Colores, glifos y textos copiados de heavnd (assets/css/main.css, utils/apps.ts, locales/en.ts).
import { createRequire } from 'node:module'
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fontDir = process.argv[2]
const font = f => `data:font/woff2;base64,${readFileSync(resolve(fontDir, f)).toString('base64')}`

const THEMES = {
  light: { ink: '#111114', paper: '#f6f5f2', surface: '#ffffff', muted: '#6b6b73', line: '#e4e2dc', brand: '#b7a6ff', mark: 'rgba(183,166,255,.55)' },
  dark: { ink: '#ececef', paper: '#101012', surface: '#1a1a1e', muted: '#9a9aa3', line: '#2a2a30', brand: '#b7a6ff', mark: 'rgba(183,166,255,.35)' },
}

const APPS = [
  { id: 'choosd', name: 'Choosd', tagline: 'Decide what to buy.', text: 'Compare options, settle it with a head-to-head and buy without second thoughts.', accent: { light: '#3d4bdb', dark: '#6b78ff' }, icon: { bg: '#3d4bdb', fill: '#ffffff' }, glyph: 'M21.9 11.6A7.2 7.2 0 1 0 21.9 20.4L19.2 18.3A3.8 3.8 0 1 1 19.2 13.7Z' },
  { id: 'meald', name: 'Meald', tagline: 'Plan what to eat.', text: 'Recipes, the week’s plan and a shopping list with real supermarket prices.', accent: { light: '#9bd36b', dark: '#9bd36b' }, icon: { bg: '#111114', fill: '#9bd36b' }, glyph: 'M8 23V9h3.2l4.8 7 4.8-7H24v14h-3.3v-8.6L16.9 20h-1.8l-3.8-5.6V23z' },
  { id: 'togethrd', name: 'Togethrd', tagline: 'Remember what to do.', text: 'Save plans from any link, agree in a swipe and keep the memory of what you did.', accent: { light: '#9b3a51', dark: '#e08ea2' }, icon: { bg: '#2a1d24', fill: '#f6c9d3' }, glyph: 'M8.5 9h15v3.4h-5.8V23h-3.4V12.4H8.5z' },
  { id: 'simplfd', name: 'Simplfd', tagline: 'Sort out your money.', text: 'Your money, alone or shared. Splits to the cent and balances that always add up.', accent: { light: '#0e5a57', dark: '#6cc4b9' }, icon: { bg: '#0e5a57', fill: '#bfe8df' }, glyph: 'M9 9h14v3.3H12.3v2.05H23V23H9v-3.3h10.7v-2.05H9z' },
]
const HEAVND = { icon: { bg: '#111114', fill: '#b7a6ff' }, glyph: 'M9 9h3.3v5.4h7.4V9H23v14h-3.3v-5.6h-7.4V23H9z' }

const icon = (a, size) => `<svg width="${size}" height="${size}" viewBox="0 0 32 32"><rect width="32" height="32" rx="7.5" fill="${a.icon.bg}"/><path d="${a.glyph}" fill="${a.icon.fill}"/></svg>`

const base = t => `
  @font-face { font-family: Fraunces; src: url(${font('fraunces-latin-opsz-normal.woff2')}) format('woff2'); font-weight: 100 900; font-style: normal; }
  @font-face { font-family: Fraunces; src: url(${font('fraunces-latin-opsz-italic.woff2')}) format('woff2'); font-weight: 100 900; font-style: italic; }
  * { margin: 0; box-sizing: border-box; }
  body { background: ${t.paper}; color: ${t.ink}; font-family: Inter, ui-sans-serif, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  .display { font-family: Fraunces, Georgia, serif; font-variation-settings: 'opsz' 144; font-weight: 400; letter-spacing: -0.01em; }
  .display em { font-style: italic; background: linear-gradient(transparent 62%, ${t.mark} 62%, ${t.mark} 92%, transparent 92%); padding: 0 .04em; }
  .mono { font-family: ui-monospace, 'SF Mono', Menlo, 'DejaVu Sans Mono', monospace; text-transform: uppercase; letter-spacing: .14em; font-size: 13px; color: ${t.muted}; }
`

const header = t => `
  <style>${base(t)}
    body { background: transparent; }
    .wrap { background: ${t.paper}; border-radius: 28px; overflow: hidden; width: 1200px; height: 460px; padding: 64px 72px; position: relative; display: grid; grid-template-columns: 1fr 300px; gap: 48px; align-items: center; }
    .bar { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background: ${t.brand}; }
    h1 { font-size: 76px; line-height: 1.02; margin: 28px 0 24px; }
    p { font-size: 21px; line-height: 1.45; color: ${t.muted}; max-width: 620px; }
    .grid { display: grid; grid-template-columns: repeat(2, 128px); gap: 28px; justify-content: end; }
    .grid svg { border-radius: 30px; box-shadow: 0 1px 0 ${t.line}, 0 18px 40px -18px rgba(0,0,0,.35); }
  </style>
  <div class="wrap">
    <div>
      <div class="mono">Angel Sánchez Lobo · Fullstack developer</div>
      <h1 class="display">I build small apps for <em>everyday decisions.</em></h1>
      <p>Nuxt and TypeScript on the front, Spring Boot on the back. Founder of Heavnd, a collection of web apps for what you decide every week.</p>
    </div>
    <div class="grid">${APPS.map(a => icon(a, 128)).join('')}</div>
    <div class="bar"></div>
  </div>`

const card = (a, t, mode) => `
  <style>${base(t)}
    body { background: transparent; }
    .card { width: 560px; height: 300px; padding: 36px 40px; background: ${t.surface}; border: 1px solid ${t.line}; border-radius: 28px; position: relative; overflow: hidden; display: flex; flex-direction: column; }
    .top { display: flex; align-items: center; gap: 16px; }
    .top svg { border-radius: 14px; }
    .name { font-size: 30px; }
    h2 { font-size: 40px; line-height: 1.05; margin: 30px 0 12px; }
    h2 em { font-style: italic; }
    p { font-size: 17px; line-height: 1.5; color: ${t.muted}; }
    .foot { margin-top: auto; display: flex; justify-content: space-between; align-items: center; }
    .dot { width: 10px; height: 10px; border-radius: 99px; background: ${a.accent[mode]}; }
    .edge { position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: ${a.accent[mode]}; }
  </style>
  <div class="card">
    <div class="top">${icon(a, 52)}<span class="display name">${a.name}</span></div>
    <h2 class="display">${a.tagline}</h2>
    <p>${a.text}</p>
    <div class="foot"><span class="mono">${a.id}.heavnd.com</span><span class="dot"></span></div>
  </div>`

const STACK = [
  ['Frontend', 'Nuxt · Vue · TypeScript · Tailwind'],
  ['Backend', 'Spring Boot · Java · JPA · Flyway'],
  ['Data', 'PostgreSQL · MySQL · MongoDB'],
  ['Infra', 'Linux · nginx · systemd · GitHub Actions'],
  ['Also', 'WordPress · PHP'],
]
const stack = t => `
  <style>${base(t)}
    body { background: transparent; }
    .wrap { width: 1200px; padding: 8px 72px; }
    .row { display: grid; grid-template-columns: 220px 1fr; align-items: baseline; padding: 22px 0; border-top: 1px solid ${t.line}; }
    .row:last-child { border-bottom: 1px solid ${t.line}; }
    .v { font-size: 30px; }
  </style>
  <div class="wrap">${STACK.map(([k, v]) => `<div class="row"><span class="mono">${k}</span><span class="display v">${v}</span></div>`).join('')}</div>`

const heavnd = t => `
  <style>${base(t)}
    body { background: transparent; }
    .wrap { width: 1200px; padding: 40px 72px 8px; display: flex; align-items: flex-end; justify-content: space-between; }
    .l { display: flex; align-items: center; gap: 20px; }
    .l svg { border-radius: 16px; box-shadow: 0 0 0 1px ${t.line}; }
    h2 { font-size: 54px; line-height: 1; }
    p { font-size: 19px; color: ${t.muted}; margin-top: 10px; }
  </style>
  <div class="wrap">
    <div>
      <div class="l">${icon(HEAVND, 60)}<h2 class="display">Heavnd</h2></div>
      <p>Four apps, free, nothing to install. The final -d is the decision, already made.</p>
    </div>
    <span class="mono">heavnd.com ↗</span>
  </div>`

const ABOUT_FACTS = [
  ['Currently', 'Building Heavnd'],
  ['Works with', 'Nuxt · Spring Boot'],
  ['Off screen', 'Training, every day'],
]
const about = t => `
  <style>${base(t)}
    body { background: transparent; }
    .wrap { width: 1200px; padding: 40px 72px 8px; display: grid; grid-template-columns: 220px 1fr; gap: 0 0; }
    h2 { font-size: 46px; line-height: 1.08; margin-bottom: 26px; }
    p { font-size: 20px; line-height: 1.6; color: ${t.muted}; max-width: 760px; }
    p + p { margin-top: 14px; }
    p strong { color: ${t.ink}; font-weight: 500; }
    .facts { grid-column: 2; display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 40px; border-top: 1px solid ${t.line}; }
    .fact { padding-top: 18px; }
    .fact .v { display: block; font-size: 24px; margin-top: 8px; }
  </style>
  <div class="wrap">
    <span class="mono" style="padding-top:18px">About</span>
    <div>
      <h2 class="display">Developer by trade, <em>product builder</em> by habit.</h2>
      <p>I’m <strong>Angel</strong>, a fullstack developer. I like owning the whole thing: the data model, the API, the interface and the server it runs on.</p>
      <p>Heavnd is where I do that on my own terms. Four apps, designed, built and deployed end to end, with the same care for the details nobody asks for.</p>
      <p>Away from the keyboard, I train. Same approach in both: show up, measure, get a little better every day.</p>
    </div>
    <div class="facts">${ABOUT_FACTS.map(([k, v]) => `<div class="fact"><span class="mono">${k}</span><span class="display v">${v}</span></div>`).join('')}</div>
  </div>`

const out = resolve(root, 'assets')
mkdirSync(out, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1200, height: 800 } })
const shot = async (html, file, sel) => {
  await page.setContent(`<!doctype html><meta charset="utf-8"><body>${html}</body>`)
  await page.evaluate(() => document.fonts.ready)
  await page.locator(sel).screenshot({ path: resolve(out, file), omitBackground: true })
}
for (const [mode, t] of Object.entries(THEMES)) {
  await shot(header(t), `header-${mode}.png`, '.wrap')
  await shot(about(t), `about-${mode}.png`, '.wrap')
  await shot(heavnd(t), `heavnd-${mode}.png`, '.wrap')
  await shot(stack(t), `stack-${mode}.png`, '.wrap')
  for (const a of APPS) await shot(card(a, t, mode), `${a.id}-${mode}.png`, '.card')
}
await browser.close()
