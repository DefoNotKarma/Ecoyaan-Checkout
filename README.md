# Ecoyaan Checkout

A full-stack cart and multi-step checkout flow built with **Next.js 14 App Router**. Live cart management, promo codes, Redux-persisted addresses, a 4-step checkout, and a glitter button that drops confetti and plays a bell ding. Styled to match Ecoyaan's green sustainability brand.

---

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Redux Toolkit** + **React Redux**
- **Vercel** (deployment)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/DefoNotKarma/Ecoyaan-Checkout.git
cd Ecoyaan-Checkout
npm install
npm run dev
```

Open [http://localhost:3000/cart](http://localhost:3000/cart) in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── cart/
│   │       └── route.js               # GET /api/cart — cart items + shipping fee
│   ├── cart/
│   │   ├── components/
│   │   │   ├── body.jsx               # CartSummary — main cart UI
│   │   │   ├── header.jsx             # EcoyaanHeader — responsive header + glitter
│   │   │   ├── stepper.jsx            # Checkout progress stepper
│   │   │   └── colorPalette.js        # Shared C color token object
│   │   └── page.jsx                   # /cart route
│   ├── checkout/
│   │   ├── page.jsx                   # Step 1 — Personal Info
│   │   ├── address/
│   │   │   └── page.jsx               # Step 2 — Delivery Address
│   │   ├── payment/
│   │   │   └── page.jsx               # Step 3 — Payment + Order confirmation popup
│   │   └── review/
│   │       └── page.jsx               # Step 4 — Review & place order
│   ├── globals.css
│   └── layout.js                      # Root layout — ReduxProvider wrapper
│
├── store/
│   ├── addressSlice.js                # add / remove / select delivery addresses
│   ├── userInfoSlice.js               # first name, last name, email, phone
│   ├── paymentSlice.js                # method, card / UPI / bank fields
│   ├── store.js                       # Redux store config
│   └── Provider.jsx                   # Client-side provider wrapper
│
└── public/
    └── sounds/
        └── ding.mp3                   # Bell sound for glitter button
```

---

## Features

**Cart**
- Live cart with quantity steppers and item removal
- Save for later toggle per item
- Promo code system — percent and flat discount types (try `ECO10`, `FLAT50`, `GREEN20`, `SAVE100`)
- Shipping fee auto-calculated, free above ₹499
- Animated free-delivery progress bar
- Shimmer skeleton loading state

**Checkout — 4 steps**
- Step 1: Personal info with inline validation, persisted to `sessionStorage`
- Step 2: Delivery address — add multiple, select, edit, delete — persisted in Redux
- Step 3: Review — editable summary with quantity/remove controls, price breakdown, place order
- Step 4: Payment — Card, UPI (with app chips), Net Banking, Cash on Delivery 

**UI / UX**
- Fully responsive — mobile hamburger menu, tablet, desktop layouts
- Sticky Back + Next Step footer on every checkout step
- ✨ Glitter button — 70 precomputed canvas particles, bell ding audio, green toast
- Order confirmed popup — floating 🎉, shimmer green bar, order number, eco note
- Shared `EcoyaanHeader` with live search, delivery badge, wishlist

---

## Architectural Decisions

**Redux only where navigation survives**
Addresses, user info, and payment method live in Redux because they need to survive page transitions across the 4-step checkout. Cart state (quantities, items, coupons) lives in local `useState` inside `CartSummary`, It doesn't need to outlive the cart page and Redux would add unnecessary boilerplate.

**`sessionStorage` for cart → checkout handoff**
On "Proceed to Checkout", the order snapshot (items, totals, coupon, selected address ID) is written to `sessionStorage`. The checkout page reads it once on mount then clears it. Chosen over URL params (exposes data, hits length limits) and over a Redux cart slice (would require serializing full cart state on every keystroke).

**Canvas-based glitter, not DOM particles**
The glitter effect uses a single `<canvas>` overlay with one `requestAnimationFrame` loop instead of mounting 48 React components. All 48 particle trajectories are precomputed at module load time. clicking the button is O(1), just stamping positions onto frozen precomp data. No React state updates fire during the animation.

**Inline styles over Tailwind inside components**
Component-level styles use inline objects and injected `<style>` keyframes so the components are portable and don't depend on a specific Tailwind config. Tailwind is used at the page/layout level only. All color decisions derive from a single shared `colorPalette.js` token file (`C.primary`, `C.border`, etc.) so the green brand palette stays consistent across every file.

**No external UI library**
Every component, icon, and animation is hand-written. This keeps the bundle lean, avoids style conflicts, and means every pixel matches Ecoyaan's exact brand palette without fighting a third-party component's defaults.

---

## Deployment

Connect the GitHub repo to [vercel.com](https://vercel.com) for automatic deploys, or:

```bash
npm run build
npm start
```

---

## License

MIT