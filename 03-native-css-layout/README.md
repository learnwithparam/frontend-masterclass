# Module 03: Native Responsive Architecture (`03-native-css-layout`)

Before jumping into Tailwind CSS, you must understand exactly what it abstracts. This module builds a professional, responsive layout using only native CSS.

## Concepts Covered

### 1. CSS Custom Properties (Variables)
All design tokens (colors, sizes, shadows) are defined once in `:root`. This is exactly how design systems work — Tailwind's config, MUI themes, they all compile down to CSS Variables under the hood.

### 2. Mobile-First Media Queries
We design for the smallest screen *first*. The default `.app-layout` is a single column (`grid-template-columns: 1fr`). Only when the viewport exceeds `768px` do we upgrade to a two-column sidebar layout via `@media (min-width: 768px)`.

### 3. Flexbox vs CSS Grid
- **Flexbox** = 1-dimensional (the sticky nav bar, aligning items in a row).
- **CSS Grid** = 2-dimensional (the sidebar + main layout, the book card grid).

### 4. The `auto-fill` + `minmax()` Pattern
```css
grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
```
This single line creates a fully responsive grid without *any* media queries. The browser automatically calculates how many 260px columns fit. No JavaScript. No framework.

### 5. Sticky Positioning
On desktop, the sidebar form sticks to the viewport while you scroll through the catalog. This uses `position: sticky` with a `top` offset.

## How to Run
```bash
npx serve .
```
Resize the browser window to see the layout morph between mobile and desktop.
