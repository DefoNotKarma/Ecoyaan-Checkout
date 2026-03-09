# Ecoyaan Cart

A full-stack cart and checkout flow built with **Next.js 14 App Router**, featuring live order management, promo codes, address persistence via Redux, and a seamless checkout experience — all styled to match Ecoyaan's green sustainability brand.

---

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Redux Toolkit** + **React Redux**
- **Tailwind CSS**
- **Vercel** (deployment)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/DefoNotKarma/Ecoyaan-Checkout.git
cd ecoyaan-cart
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000/cart](http://localhost:3000/cart) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── cart/
│   │       └── route.js          # GET /api/cart — returns cart items, shipping fee, discount
│   ├── cart/
│   │   ├── components/
│   │   │   ├── body.jsx          # CartSummary — main cart component
│   │   │   └── header.jsx        # EcoyaanHeader — shared site header
│   │   └── page.jsx              # /cart route
│   ├── checkout/
│   │   └── page.jsx              # /checkout route
│   ├── globals.css
│   └── layout.js                 # Root layout — wraps app in ReduxProvider
│
└── store/
    ├── addressSlice.js           # Redux slice for delivery addresses
    ├── store.js                  # Redux store configuration
    └── Provider.jsx              # Client-side Redux provider wrapper
```

---

## Features

- Live cart with quantity steppers and item removal
- Per-item save for later toggle
- Promo code system with percent and flat discount types
- Shipping fee auto-calculated with free delivery threshold (₹499)
- Animated shipping progress bar
- Delivery address management (add, select, delete)
- Redux-persisted addresses across cart and checkout pages
- Checkout page with full order summary and party confirmation animation
- Responsive layout for mobile, tablet, and desktop
- Shimmer skeleton loading state
- Toast notifications for validation errors

---

## Environment

No environment variables are required for local development. The cart data is served from a local API route at `/api/cart`.

---

## Deployment

```bash
npm install -g vercel
vercel --prod
```

Or connect the GitHub repo to [vercel.com](https://vercel.com) for automatic deploys on push to `main`.

---

## Architectural Decisions

### 1. Next.js App Router over Pages Router

The App Router was chosen for its native support for React Server Components, nested layouts, and file-based routing with colocated API routes. The cart and checkout pages each live in their own folder under `src/app/`, which keeps route-specific components, layouts, and data-fetching logic physically close together. The shared `EcoyaanHeader` is imported directly by both pages, avoiding the need for a global layout that forces the header on every route in the app.

### 2. Redux only for address state

Redux Toolkit was introduced specifically and only for delivery address management. This was a deliberate constraint — cart items, coupon codes, quantities, and UI state are all managed with local `useState` inside `CartSummary`. The reason is that addresses are the only piece of state that genuinely needs to survive a page navigation (from `/cart` to `/checkout`). Using Redux for everything would add unnecessary boilerplate and make the component harder to drop into other parts of the app. Keeping Redux's footprint small means the slice stays simple: three reducers (`addAddress`, `removeAddress`, `selectAddress`) and no side effects.

### 3. sessionStorage for order handoff between cart and checkout

When the user clicks "Proceed to Checkout", the current order snapshot (items, totals, coupon, selected address ID) is written to `sessionStorage` and the app navigates to `/checkout`. The checkout page reads it on mount, sets it into local state, and immediately removes it from `sessionStorage`. This approach was chosen over URL query params (which would expose order data in the address bar and hit URL length limits with many items) and over a second Redux slice (which would require serializing the full cart into the store on every change). `sessionStorage` gives a clean one-shot handoff with no persistent side effects. The address itself is not duplicated into `sessionStorage` — only its ID is passed, and the checkout page resolves the full address object from Redux, which is still alive in memory from the cart page.

### 4. Cart data fetched inside the component, not the page

`CartSummary` (body.jsx) fetches its own data from `/api/cart` via a `useEffect` rather than receiving it as props from `cart/page.jsx`. This was chosen because the component owns all the derived state — subtotals, savings, item counts, shipping thresholds — and computing those in the page and passing them down as props would create a situation where the page knows too much about the cart's internals. The tradeoff is that `CartSummary` is less purely presentational, but for a single-page cart flow this is an acceptable coupling. The original `cart/page.jsx` had a duplicate `fetch` and was computing `subtotal` and `total` independently — that was removed to avoid the two sources of truth.

### 5. Inline styles over Tailwind inside CartSummary

The cart component uses inline styles rather than Tailwind classes for the majority of its layout and visual logic. This was a practical decision made early in development when the component needed to be portable and droppable into any Next.js project without depending on a specific Tailwind configuration. Tailwind `className` strings are used at the page level (`px-10`, `w-full`, `mx-auto`) where they integrate with the existing global stylesheet, but component-level styles that depend on dynamic values (breakpoint-responsive sizing, conditional colors based on state, animation keyframes) are handled inline or via injected `<style>` tags to keep the logic colocated with the JSX that uses it.

### 6. No external UI library

The entire UI is built from scratch with inline styles and a small set of hand-written SVG icons. This keeps the bundle lean, avoids version conflicts, and means every visual detail matches Ecoyaan's exact green brand palette (`#16a34a`, `#15803d`, `#f0fdf4`) without fighting against a third-party component's default styles. The tradeoff is more verbose JSX, which is managed by keeping style objects close to the elements that use them and using CSS class animations for hover and transition effects.



## License

MIT