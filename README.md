# monis.rent Workspace Designer

Build a desk setup for your time in Bali, watch it come together in a little sunlit room, then rent it.

**Live:** [bali-workspace-designer.vercel.app](https://bali-workspace-designer.vercel.app) · Built for the [Desent](https://www.desent.io) coding challenge.

![A sunlit Bali room with a standing desk, three monitors, an ergonomic chair, a lamp, a monstera and a coffee corner](src/app/opengraph-image.png)

## Approach

The brief's persona has just landed, has a week, and doesn't want to read a spec sheet. So the app is built around three ideas:

1. **Show, don't list.** The preview is the main thing on screen. Every choice lands in it right away: the desk swaps, monitors drop onto the desk and shuffle over to make room, the lamp switches on, a standing desk rises when you press _Stand_.
2. **The bill builds itself.** Next to the room sits a rental slip that fills in line by line, so the price is never a surprise at checkout.
3. **Remove decisions.** Three starter setups (based on monis.rent's real bundles) get you a sensible office in one tap. The desk you pick decides how many screens fit, and the UI says so ("Desk is full") instead of silently refusing.

Small things that came out of thinking as the user:

- **Shareable setups.** The URL always describes the current setup (`?s=std.pro.m27x2.lamp`), short enough to paste into a chat with a co-founder. The checkout page reads the same link on the server.
- **Checkout asks only what a delivery needs:** how long, where, when, who, and how to reach you. Longer terms show the discount up front. Nothing is charged; a person confirms stock and a delivery slot first.
- **On phones** the preview stays pinned at the top while you pick, and a bottom bar keeps the total and "Rent this setup" in reach.

## Tech choices

| | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router), TypeScript strict | Required by the brief. The designer page is fully static; checkout is server-rendered from the URL. |
| Styling | Tailwind CSS v4 with design tokens in `globals.css` | Required. Two themes (light "rice paper", dark "Canggu night") from the same tokens. |
| Illustrations | Hand-built SVG components | One consistent style, no image files to load, recolour for dark mode, and every part can move on its own. Product thumbnails reuse the same parts, so what you tap is what lands in the room. |
| State | `useState` + a pure reducer, shared through context | The state is small. Pure functions (`reducer`, `rules`, `pricing`, `codec`) hold the logic and are unit tested without React. |
| Motion | CSS only: transitions plus a spring curve written with `linear()` | I started with Motion and swapped it out: everything here animates `transform`/`opacity`, which CSS does on the compositor, and dropping the library saved ~40 kB of JavaScript. |
| Testing | Vitest + Testing Library, Playwright + axe | Logic and interaction tests; end-to-end flows on desktop and phone; zero axe violations in both themes. |

## Accessibility

- Pickers are native radio buttons and checkboxes under the styling, so arrow keys, Space and screen readers work without custom code.
- The step tabs follow the WAI-ARIA tabs pattern (arrow keys, Home/End).
- The preview has a live text description ("140 cm electric standing desk, raised to standing height, with an ergonomic mesh chair, two 27-inch monitors…"), and every change is announced politely ("Added monstera. Weekly total $46.50.").
- Buttons that can't act right now stay focusable and explain why (`aria-disabled` plus a hint) instead of going dead.
- Form errors are linked to their fields, and focus moves to the first problem, then to the confirmation.
- `prefers-reduced-motion` turns off all motion. Text uses Atkinson Hyperlegible (designed for low-vision readers). Colour pairs meet WCAG AA, with AAA for body text. The layout reflows down to 320 px, and the pinned mobile preview never hides the focused element (WCAG 2.4.11).

## Running it

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm check          # lint + typecheck + unit tests
pnpm test:e2e       # Playwright on a production build (desktop + phone, includes axe)
pnpm lighthouse     # Lighthouse CI against a production build
```

## Project layout

```
src/
  catalog/      products and starter setups (the only place to add a product)
  setup/        setup state: reducer, rules (monitor capacity), pricing, URL codec, a11y text
  checkout/     request form fields, Bali-time dates, validation
  components/
    stage/      the SVG room: layout math + one file per group of parts
    designer/   step tabs, product cards, starter setups
    sheet/      rental slip and mobile bar
    checkout/   request form and confirmation
  app/          routes, metadata, OG image, robots/sitemap/manifest
```

To add a product: add it to `src/catalog/products.ts`, then draw it in `src/components/stage/parts/`.
