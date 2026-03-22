# HTML Style Guide

# HTML Style Guide

> Fast, accessible, semantic HTML for web apps and PWAs. Keep markup lean; put behavior and styling in JS/CSS.

## Structure & Semantics
- **Indent:** 2 spaces. One responsibility per element; avoid deep nesting.
- **Semantics first:** `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`. Exactly one `<main>`.
- **Headings:** single `h1`, then `h2` → `h3`… (no skips).
- **Actions vs navigation:** `<button>` triggers actions; `<a>` navigates (has `href`).

## Attributes & Classes
- One attribute per line for long tags; close `>` on last line.
- Boolean attrs without value (`required`, `disabled`).
- Order: `id`, `class`, `data-*`, `aria-*`, then others.
- Long `class` values may wrap across lines. For Tailwind multiline rules, see CSS guide css-style.md.

## Accessibility (A11y)
- `<html lang="en">`. Respect **focus styles**; never remove without replacement.
- Images need meaningful `alt`; decorative images use `alt=""`.
- Use native semantics; add ARIA only when needed (`aria-current`, `aria-expanded`, `aria-controls`, `aria-live`).
- Color contrast AA+. Honor `prefers-reduced-motion`.
- Labels link to controls: `<label for="id">`; associate help text via `aria-describedby`.

## Forms
- Real labels, not placeholders. Mark required with `required`; set `aria-invalid="true"` when invalid.
- Correct `type` (`email`, `tel`, `url`, `number`, `datetime-local`…).
- Use `autocomplete` hints; group fields with `<fieldset><legend>`.

## Media & Images
- Prevent CLS: always set `width`/`height` or CSS `aspect-ratio`.
- `loading="lazy"` for below-the-fold; `decoding="async"` for large images.
- Prefer AVIF/WebP with `<picture>`; inline simple SVGs; decorative icons `aria-hidden="true"` and inherit `currentColor`.

## Links & Buttons
- Descriptive link text (avoid “click here”).
- New tabs: `target="_blank" rel="noopener noreferrer"`.
- Touch targets large enough (≥44px).

## Performance & Loading
- Scripts: `type="module"` and `defer` when possible. No inline event handlers.
- Preload critical assets; `rel="preconnect"` to hot origins.
- Keep DOM small; avoid unnecessary wrappers.

## SEO & Metadata
- Unique `<title>` and useful `<meta name="description">`.
- Canonical URL when applicable. Meaningful headings/landmarks.
- Social share tags (Open Graph, Twitter) where relevant.

## Mobile & PWA
- Viewport: `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- Web App Manifest: `<link rel="manifest" href="/manifest.webmanifest">`; maskable icons.
- `<meta name="theme-color" content="#000">`.
- Respect iOS safe areas via CSS env vars (`env(safe-area-inset-*)`).

## Internationalization
- Use `dir="rtl"` when needed. Mark non-translatable with `translate="no"`.
- `<meta charset="utf-8">` and Unicode characters.

## Security
- Sanitize any HTML you inject; avoid `innerHTML` with untrusted input.
- Don’t leak secrets in data attributes.
- External links with `_blank` must use `rel="noopener noreferrer"`.

## Minimal Skeleton
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Page Title</title>
    <meta name="description" content="Short, specific summary." />
    <link rel="manifest" href="/manifest.webmanifest" />
    <meta name="theme-color" content="#0ea5e9" />
  </head>
  <body>
    <header>
      <nav aria-label="Primary">
        <a href="/" aria-current="page">Home</a>
      </nav>
    </header>

    <main id="content">
      <h1>Page Title</h1>

      <section aria-labelledby="features">
        <h2 id="features">Features</h2>
        <picture>
          <source type="image/avif" srcset="/img/hero.avif" />
          <img src="/img/hero.jpg" alt="Product dashboard" width="1200" height="630" loading="lazy" decoding="async" />
        </picture>
      </section>

      <form action="/contact" method="post" novalidate>
        <label for="email">Email</label>
        <input id="email" name="email" type="email" autocomplete="email" required />
        <button type="submit">Send</button>
      </form>
    </main>

    <footer>
      <small>&copy; <time datetime="2025">2025</time> Acme Inc.</small>
    </footer>
  </body>
</html>
```