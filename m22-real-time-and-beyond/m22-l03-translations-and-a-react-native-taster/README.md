# M22-L03 · Translations and a React Native Taster

> Video: Module 22, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- How a translation library works: keys, one dictionary per language, holes like `{{name}}`, and a fallback language
- How to choose the language from the address (`/en`, `/de`, `/hi`, `/ar`) and set `lang` and `dir` on the `<html>` tag
- How `Intl` writes numbers, prices and dates for each place, and how plurals work (Arabic has six forms)
- Right-to-left pages, and why CSS uses logical properties (start and end, not left and right)
- Why the fallback hides a missing translation, and a small check that finds it
- A first taste of React Native with Expo: `View`, `Text`, `Pressable`, style objects, and the same translation files

## Before you start

- Node 24 (`node --version`). No Docker.
- Best after M19 (Next.js dynamic routes) and M10 (context).
- The translation part (`i18n-app/`) is a Next.js 16.4.3 page; all results are real runs. For React Native (`rn-taster/`) the video ran Expo in a browser (web mode). Nothing was run on an iPhone, an iOS or Android simulator, or an Android phone, so anything about phones is explained, not shown.
- The first install of `rn-taster` downloads several hundred packages; give it a few minutes.

## Files in this folder

| File | What it is |
|------|------------|
| `i18n-app/src/i18n/locales/en.json`, `de.json`, `hi.json`, `ar.json` | The four dictionaries (same keys, other sentences) |
| `i18n-app/src/i18n/config.ts` | The list of languages, `hasLocale`, and `dirOf` (ltr or rtl) |
| `i18n-app/src/i18n/I18n.tsx` | Creates one translator per page and shares it through a provider |
| `i18n-app/src/app/[lang]/layout.tsx` | The root layout: `<html lang dir>` and `generateStaticParams` |
| `i18n-app/src/app/[lang]/page.tsx`, `CourseCard.tsx`, `course.css` | The page and the card |
| `i18n-app/scripts/format.mjs`, `plurals.mjs`, `translate.mjs`, `missing.mjs` | Small node scripts: `Intl` numbers and dates, plural rules, plurals through the library, the missing-key demo |
| `rn-taster/App.tsx` | The React Native screen (the same card) |
| `rn-taster/i18n.ts`, `rn-taster/locales/*.json` | The same setup and the same four JSON files |
| `rn-taster/index.ts`, `app.json`, `assets/` | Expo entry point, app name and icons |

## Follow along

### 1. Install and look at the dictionaries

```bash
cd i18n-app
npm install
npm ls i18next react-i18next next react --depth=0
```
```text
i18next@26.5.12, react-i18next@17.1.9, next@16.4.3, react@19.3.0
```
(The names are printed as a tree; these are the versions.) Every sentence gets a key, for example `enroll`, and every language has one JSON file with the same keys. `en.json`:
```json
{
  "greeting": "Welcome back, {{name}}",
  "hero": "Learn React from zero",
  "course": "React: From Zero to Production",
  "lessons_one": "{{count}} lesson",
  "lessons_other": "{{count}} lessons",
  "learners": "{{count, number}} learners",
  "price": "Price: {{amount, currency(EUR)}}",
  "starts": "Starts on {{date, datetime(dateStyle: long)}}",
  "enroll": "Enroll now"
}
```
`{{name}}` is a hole the code fills (here with Priya). `de.json` has the same keys with German sentences. The keys never change; only the sentences do.

### 2. The setup

`src/i18n/I18n.tsx` puts the four dictionaries into one `resources` object and calls `init` with three choices: start in this language, fall back to English when a sentence is missing, and do not escape the text (`escapeValue: false`), because React already protects us from injected markup. It creates one translator per page and shares it through `I18nextProvider`, a provider like the context of module 10.
```tsx
instance.use(initReactI18next).init({
  lng,
  fallbackLng: 'en',
  resources,
  interpolation: { escapeValue: false },
})
```
The card (`CourseCard.tsx`) is a client component because it uses a hook. It calls `useTranslation()` and asks for keys: `t('hero')`, `t('course')`, `t('greeting', { name: 'Priya' })`.

### 3. The language from the address

A folder named `[lang]` is a dynamic segment (module 19), so `/en`, `/de`, `/hi` and `/ar` are four addresses of one page. The layout writes the language and the reading direction into the `<html>` tag:
```tsx
export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params          // params is a promise in this version of Next.js
  if (!hasLocale(lang)) notFound()
  return (
    <html lang={lang} dir={dirOf(lang)}>
      <body>{children}</body>
    </html>
  )
}
```
`lang` is not decoration: browsers use it to offer translation and pick fonts, search engines read it, and screen readers use it to choose the voice. Guess: build for production and ask for `/de`. In the raw HTML the server sends, before any JavaScript runs, is it English, German, or empty holes?
```bash
npm run build
npm run start -- -p 5223
```
```text
Route (app)
┌ ○ /_not-found
└   /[lang]
  ├ ● /en
  ├ ● /de
  ├ ● /hi
  └ ● /ar
```
```bash
curl -s localhost:5223/de | grep -o '<html[^>]*>'
curl -s localhost:5223/ar | grep -o '<html[^>]*>'
curl -s localhost:5223/de | sed 's/<!-- -->//g; s/<[^>]*>/ | /g' | tr -s ' |' | head -c 330
```
```text
<html lang="de" dir="ltr">
<html lang="ar" dir="rtl">
 | allcsvideos | | English | | Deutsch | | हिन्दी | | العربية | | | | Willkommen zurück, Priya | | React von null lernen | | | React: Von null bis Produktion | | | 24 Lektionen | | 12.345 Lernende | | | Preis: 39,50 € | | Start am 5. Dezember 2026 | | Jetzt anmelden
```
The build made four static pages, one per language, so the first paint is already German, with no flash of English. Open http://localhost:5223/en and click the language links: everything changes, and what we never wrote by hand follows the language. The learners number is written with a dot (`12.345`), the price is `39,50 €` with the euro after it, and the date starts with the day.

### 4. Numbers and dates: Intl

The dots and commas come from `Intl`, built into every browser and into Node. Run (stop the server first, or use another terminal):
```bash
node scripts/format.mjs
```
```text
en-US  1,234,567.5      €1,234,567.50
de-DE  1.234.567,5      1.234.567,50 €
en-IN  12,34,567.5      €12,34,567.50
ar-EG  ١٬٢٣٤٬٥٦٧٫٥      ‏١٬٢٣٤٬٥٦٧٫٥٠ €
en-US  December 5, 2026
en-GB  5 December 2026
de-DE  5. Dezember 2026
hi-IN  5 दिसंबर 2026
ar-EG  ٥ ديسمبر ٢٠٢٦
```
America uses commas; Germany uses dots and a comma before the decimals; India puts the first comma after three digits, then groups of two; Egypt uses other digits. The library calls the same tools: in the dictionary `price` says `amount, currency(EUR)`, `learners` says `count, number`, and `starts` says `date, datetime(dateStyle: long)`. One honest note: the euro stays the euro. Changing the language changes how an amount is written, never what it is worth.

### 5. Plurals

You may think: if count is one say "lesson", otherwise "lessons". Ask the browser's plural rules how languages count:
```bash
node scripts/plurals.mjs
node scripts/translate.mjs
```
```text
en 0:other 1:one 2:other 3:other 11:other 100:other
de 0:other 1:one 2:other 3:other 11:other 100:other
hi 0:one 1:one 2:other 3:other 11:other 100:other
ar 0:zero 1:one 2:two 3:few 11:many 100:other
```
English and German have two categories. In Hindi, zero counts as one. Arabic has six: zero, one, two, few, many, other. No `if` of yours will cover that. So the dictionary holds one entry per category with a suffix (`lessons_one`, `lessons_other`; the Arabic file has all six), and in the code we only write `t('lessons', { count })`:
```text
en 0 lessons | 1 lesson | 2 lessons | 3 lessons | 11 lessons | 100 lessons
de 0 Lektionen | 1 Lektion | 2 Lektionen | 3 Lektionen | 11 Lektionen | 100 Lektionen
ar لا دروس | درس واحد | درسان | 3 دروس | 11 درسًا | 100 درس
```

### 6. Right to left

Open http://localhost:5223/ar. Everything flips: the logo on the right, the language bar on the left, the text starts at the right edge, and the blue bar on the card jumps to the right too. One attribute did that: `dir="rtl"` in the `<html>` tag. The blue bar is one line of CSS, `border-inline-start`. Inline start means the side where reading starts: left in English, right in Arabic. So write `start` and `end`, not `left` and `right` (`margin-inline-start`, `padding-inline-end`): logical properties. If you forget `dir` (change the layout to always say `dir="ltr"` and build again), the Arabic words still read right to left, because the browser knows the script, but the frame is the English frame: logo on the left, text starting at the left edge. Nothing crashes. It just feels wrong. Put it back.

### 7. A missing translation hides behind the fallback

Real life: the German translator forgets the key `enroll`. Guess what the button shows with the fallback, and without it. `scripts/missing.mjs` pretends German forgot `enroll` and runs `i18next` twice:
```bash
node scripts/missing.mjs
```
```text
with fallback    : Enroll now
  handler: "checkout" is nowhere
key nobody wrote : checkout
without fallback : enroll
de is missing    : enroll
```
With the fallback the button says "Enroll now" in English with no error and no warning. Without it, the button shows the key itself, `enroll`. A German visitor sees a mistake and nobody on the team is told. i18next calls the missing-key handler only when a key is nowhere (like `checkout`); for `enroll`, which only German lacks, it reports nothing. So write the check yourself: compare the keys of English with another file and fail when one is missing (the last line of the script does exactly that). Run it in your tests or in the pipeline (M21).

### 8. The React Native taste

React Native is the same React (components, props, state, hooks), but instead of browser elements it drives the real buttons and text of an iPhone or an Android phone. The project was made with Expo, a toolkit around React Native (`npx create-expo-app`, then `npm install`). Install and look:
```bash
cd ../rn-taster
npm install
npm ls expo react-native react --depth=0
```
```text
expo@58.0.21, react-native@0.88.1, react@19.3.0
```
Look at the files: `App.tsx` is the first screen, `index.ts` registers it as the root, `app.json` holds the name and icons. There is no `index.html`: the app is not a page. `i18n.ts` and `locales/` are the translation files, copied unchanged from the web project, so the translation work is shared.

There is no `div`, `span` or `button`. React Native has its own building blocks: `View` (the box, like a `div`), `Text` (holds every piece of text), `Pressable` (anything you can tap). A `div` becomes a `View`, an `h2` and a `p` become `Text`, and a `button` becomes a `Pressable` with a `Text` inside. The `t(...)` calls are identical:
```tsx
<View style={styles.card}>
  <Text style={styles.h2}>{t('course')}</Text>
  <Text style={styles.line}>{t('lessons', { count: 24 })}</Text>
  <Pressable style={styles.button} onPress={() => console.log(t('enroll'))}>
    <Text style={styles.buttonText}>{t('enroll')}</Text>
  </Pressable>
</View>
```
Styling is different too: no CSS file. Styles are plain objects made with `StyleSheet.create`, with camel-case names (`backgroundColor`, `borderRadius`, `padding`): the same ideas as CSS, spelled as objects.

Run it in a browser, the way the video did (Expo's web mode, port 8223):
```bash
npx expo start --web --port 8223
```
Open http://localhost:8223. The language bar is made of `Pressable`s; press German and every sentence changes, with the same library and the same dictionaries. In the browser the `Text` became a `div`, and the `Pressable` a `div` you can reach with the Tab key: a library called `react-native-web` turns `View` and `Text` into browser elements. On a phone, the same `View` and `Text` become real native views. A bundle for the web:
```bash
CI=1 npx expo export --platform web
```
```text
Web Bundled 172ms index.ts (170 modules)

› web bundles (1):
_expo/static/js/web/index-90a8e143d3999bac94bc4b337d82bb42.js (464KB)
```
(The video, from a cold start, showed 4.3 seconds, 216 modules and the same 464 kB; the module count and time differ here because of caches.) What was NOT run: the iOS simulator and a phone. The usual ways are the simulator on a Mac, or the Expo Go app on a phone, which opens your project from the dev server. Do not take web mode as proof of how a phone behaves: fonts, gestures and the keyboard differ. React Native is a good choice when your team knows React, needs real iPhone and Android apps, and wants to share logic such as validation, translations and data fetching. Be careful when a responsive site, or a web app that works offline (lesson 2), is enough: a native app means app stores, review times and its own kinds of bugs.

## Common mistakes

1. **Gluing a sentence from pieces** (`hello` + name + `!`). Other languages put the words in another order. Write the whole sentence with a hole for the name.
2. **One plural rule** (`if (count === 1)`). Arabic has six categories.
3. **Formatting by hand** (`toFixed(2)` and a euro sign). A German reader expects `39,50 €`. Use `Intl` or the library's formats.
4. **`left` and `right` in CSS, and a missing `dir`.** Use start and end, and set `dir="rtl"` for right-to-left languages.
5. **No room for longer text.** German and Hindi often need more space than English: "Enroll now" became a longer German phrase and the button grew. A box with a fixed width breaks.
6. **Trusting the fallback** instead of checking for missing keys (step 7).

## Clean up

```bash
# stop the servers (Ctrl+C)
find i18n-app/.next rn-taster/dist -delete
```
Delete the two `node_modules` folders when you are finished.

## Next

[M22-B16 · Build a Live Classroom Widget](../m22-b16-build-a-live-classroom-widget/)

Try it yourself: add a fifth language and run the missing-keys check on it. Then add a plural entry for the number of learners.
