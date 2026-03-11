"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import EcoyaanHeader from "@/app/cart/components/header";
import Stepper from "@/app/cart/components/stepper";
import C from "@/app/cart/components/colorPalette";

function useBreakpoint() {
  const [bp, setBp] = useState("desktop");
  useEffect(() => {
    const get    = () => window.innerWidth >= 1024 ? "desktop" : window.innerWidth >= 768 ? "tablet" : "mobile";
    const handle = () => setBp(get());
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return bp;
}

/* ── Icons ── */
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const TrashIcon = ({ size = 14, color = "#ef4444" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const CardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const BoxIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const LeafIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* ── Section card ── */
function ReviewSection({ icon, title, editPath, children, router }) {
  return (
    <div style={{ background: C.bgCard, borderRadius: "14px", border: `1.5px solid ${C.border}`, overflow: "hidden", boxShadow: "0 2px 16px rgba(22,163,74,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1.5px solid ${C.border}`, background: C.bg }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: C.success, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {icon}
          </div>
          <span style={{ fontSize: "0.92rem", fontWeight: "700", color: C.text }}>{title}</span>
        </div>
        <button
          onClick={() => router.push(editPath)}
          style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: `1.5px solid ${C.border}`, borderRadius: "7px", padding: "5px 10px", fontSize: "0.75rem", fontWeight: "600", color: C.textMuted, cursor: "pointer", transition: "all 0.15s", fontFamily: "system-ui, sans-serif" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; e.currentTarget.style.background = C.success; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = "none"; }}
        >
          <EditIcon /> Edit
        </button>
      </div>
      <div style={{ padding: "18px 20px" }}>{children}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export default function ReviewPage() {
  const bp       = useBreakpoint();
  const isMobile = bp === "mobile";
  const router   = useRouter();

  const userInfo  = useSelector(s => s.userInfo);
  const { savedAddresses, selectedAddressId } = useSelector(s => s.address);
  const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);

  const [cartItems,   setCartItems]   = useState([]);
  const [shippingFee, setShippingFee] = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [paymentLabel,setPaymentLabel]= useState("—");

const updateQty = (id, delta) =>
  setCartItems(prev => prev.map(item =>
    item.product_id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
  ));

const removeItem = (id) =>
  setCartItems(prev => prev.filter(item => item.product_id !== id));

  /* ── Fetch cart from API ── */
  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch("/api/cart");
        const data = await res.json();
        setCartItems(data.cartItems);
        setShippingFee(data.shipping_fee);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    };
    load();

    // payment method written by payment page
    const pm = sessionStorage.getItem("paymentMethod");
    if (pm) setPaymentLabel(pm);
  }, []);

  const fmtINR = (n) => "₹" + (n ?? 0).toLocaleString("en-IN");

  const subtotal = cartItems.reduce((s, i) => s + i.product_price * i.quantity, 0);
  const total    = subtotal + (subtotal > 0 ? shippingFee : 0);

  /* ── Skeleton ── */
  if (loading) return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", background: C.bg }}>
      <EcoyaanHeader />
      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "44px 24px" }}>
        <Stepper current={4} isMobile={isMobile} />
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[1,2,3].map(n => (
            <div key={n} style={{ height: "100px", borderRadius: "14px", background: "linear-gradient(90deg, #f0fdf4 25%, #dcfce7 50%, #f0fdf4 75%)", backgroundSize: "400px 100%", animation: "shimmer 1.4s infinite" }} />
          ))}
        </div>
      </main>
    </div>
  );
  /* ── Empty cart state ── */
if (!loading && cartItems.length === 0) return (
  <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", background: C.bg }}>
    <EcoyaanHeader />
    <main style={{ maxWidth: "600px", margin: "0 auto", padding: isMobile ? "60px 16px" : "80px 24px", textAlign: "center" }}>
      <Stepper current={4} isMobile={isMobile} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        {/* Illustration */}
        <div style={{ width: "96px", height: "96px", borderRadius: "50%", background: C.success, border: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.8rem" }}>
          🛒
        </div>

        <div>
          <h2 style={{ fontSize: isMobile ? "1.5rem" : "1.8rem", fontWeight: "800", color: C.text, letterSpacing: "-0.03em", marginBottom: "10px" }}>
            Your cart is empty
          </h2>
          <p style={{ fontSize: "0.92rem", color: C.textMuted, lineHeight: "1.6", maxWidth: "340px", margin: "0 auto" }}>
            Looks like you haven't added anything yet. Head back to the shop and pick something sustainable! 🌿
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => window.open("https://ecoyaan.com/", "_blank")}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: `linear-gradient(135deg, ${C.primaryLight} 0%, ${C.primaryBold} 100%)`,
            color: "#fff", border: "none", borderRadius: "10px",
            padding: "13px 28px", fontSize: "0.92rem", fontWeight: "700",
            cursor: "pointer", boxShadow: "0 4px 16px rgba(22,163,74,0.3)",
            transition: "opacity 0.15s, transform 0.15s",
            fontFamily: "system-ui, sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.92"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1";    e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Browse Products <ArrowRightIcon />
        </button>

        {/* Back link */}
        <button
          onClick={() => router.back()}
          style={{ background: "none", border: "none", color: C.textMuted, fontSize: "0.84rem", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px", fontFamily: "system-ui, sans-serif" }}
        >
          ← Go back
        </button>
      </div>
    </main>
  </div>
);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", background: C.bg }}>
      <style>{`
        @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        .review-next-btn:hover  { opacity: 0.92 !important; transform: translateY(-1px) !important; }
        .review-next-btn:active { transform: translateY(0) !important; }
      `}</style>

      <EcoyaanHeader />

      <main style={{ maxWidth: "600px", margin: "0 auto", padding: isMobile ? "28px 16px 120px" : "44px 24px 120px" }}>
        <Stepper current={4} isMobile={isMobile} />

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? "28px" : "36px" }}>
          <h1 style={{ fontSize: isMobile ? "1.65rem" : "2rem", fontWeight: "800", color: C.text, letterSpacing: "-0.03em", lineHeight: "1.2", marginBottom: "10px" }}>
            Almost there!
          </h1>
          <p style={{ fontSize: isMobile ? "0.92rem" : "1rem", color: C.primary, fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px", background: C.success, padding: "5px 14px", borderRadius: "999px", border: `1px solid ${C.border}` }}>
            🌿 Review your order before placing it.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Personal Info */}
          <ReviewSection icon={<UserIcon />} title="Personal Info" editPath="/checkout" router={router}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px" }}>
              {[
                { label: "Name",  value: `${userInfo.firstName ?? ""} ${userInfo.lastName ?? ""}`.trim() || "—" },
                { label: "Email", value: userInfo.email || "—" },
                { label: "Phone", value: userInfo.phone || "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: "0.68rem", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px" }}>{label}</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: "600", color: C.text }}>{value}</div>
                </div>
              ))}
            </div>
          </ReviewSection>

          {/* Delivery Address */}
          <ReviewSection icon={<MapPinIcon />} title="Delivery Address" editPath="/checkout/address" router={router}>
            {selectedAddress ? (
              <div>
                <span style={{ fontSize: "0.78rem", fontWeight: "700", color: C.primary, background: C.success, padding: "2px 10px", borderRadius: "999px", border: `1px solid ${C.border}`, display: "inline-block", marginBottom: "8px" }}>
                  {selectedAddress.alias}
                </span>
                <div style={{ fontSize: "0.9rem", color: C.textMid, lineHeight: "1.6" }}>
                  {selectedAddress.line}<br />
                  {selectedAddress.city} — {selectedAddress.pincode}
                </div>
              </div>
            ) : (
              <p style={{ color: C.errorText, fontSize: "0.88rem", margin: 0 }}>No address selected. Please go back and select one.</p>
            )}
          </ReviewSection>

          {/* Payment */}
          <ReviewSection icon={<CardIcon />} title="Payment Method" editPath="/checkout/payment" router={router}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "26px", borderRadius: "5px", background: C.success, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
                {paymentLabel.toLowerCase().includes("upi") ? "⚡" : paymentLabel.toLowerCase().includes("cash") ? "💵" : paymentLabel.toLowerCase().includes("bank") ? "🏦" : "💳"}
              </div>
              <span style={{ fontSize: "0.92rem", fontWeight: "600", color: C.text }}>{paymentLabel}</span>
            </div>
          </ReviewSection>

          {/* Items */}
<ReviewSection icon={<BoxIcon />} title={`Items (${cartItems.length})`} editPath="/" router={router}>
  {cartItems.length > 0 ? (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {cartItems.map((item, i) => (
        <div key={item.product_id} style={{
          paddingBottom: i < cartItems.length - 1 ? "14px" : 0,
          borderBottom:  i < cartItems.length - 1 ? `1px solid ${C.bg}` : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

            {/* Image */}
            <div style={{ width: "48px", height: "48px", borderRadius: "9px", overflow: "hidden", background: C.bg, flexShrink: 0 }}>
              {item.image
                ? <img src={item.image} alt={item.product_name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => e.target.style.display = "none"} />
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>🌿</div>
              }
            </div>

            {/* Name + price */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.88rem", fontWeight: "600", color: C.text, marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.product_name}
              </div>
              <div style={{ fontSize: "0.82rem", fontWeight: "700", color: C.text }}>
                {fmtINR(item.product_price * item.quantity)}
              </div>
            </div>
          </div>

              {/* Qty + delete row */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px", paddingLeft: "60px" }}>

                {/* Stepper */}
                <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${C.border}`, borderRadius: "9px", overflow: "hidden" }}>
                  <button
                    onClick={() => { if (item.quantity === 1) removeItem(item.product_id); else updateQty(item.product_id, -1); }}
                    style={{
                      background: item.quantity === 1 ? "#fef2f2" : "#f9fafb",
                      border: "none", padding: "5px 10px",
                      cursor: "pointer", fontSize: item.quantity === 1 ? "0.75rem" : "1rem",
                      color: item.quantity === 1 ? "#ef4444" : C.textMid,
                      fontWeight: "600", lineHeight: 1,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      minWidth: "30px",
                      transition: "background 0.12s, color 0.12s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = item.quantity === 1 ? "#fee2e2" : "#f0fdf4"}
                    onMouseLeave={e => e.currentTarget.style.background = item.quantity === 1 ? "#fef2f2" : "#f9fafb"}
                    title={item.quantity === 1 ? "Remove item" : "Decrease"}
                  >
                    {item.quantity === 1 ? <TrashIcon size={12} color="#ef4444" /> : "−"}
                  </button>

                  <span style={{
                    padding: "5px 12px", fontSize: "0.85rem", fontWeight: "700", color: C.text,
                    minWidth: "32px", textAlign: "center", background: "#fff",
                    borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`,
                  }}>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQty(item.product_id, +1)}
                    style={{
                      background: "#f9fafb", border: "none",
                      padding: "5px 10px", cursor: "pointer",
                      fontSize: "1rem", color: C.textMid,
                      fontWeight: "600", lineHeight: 1,
                      minWidth: "30px",
                      transition: "background 0.12s, color 0.12s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = C.primary; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.color = C.textMid; }}
                    title="Increase"
                  >+</button>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeItem(item.product_id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "4px",
                    background: "none", border: "1.5px solid #fecaca",
                    borderRadius: "8px", padding: "5px 9px",
                    fontSize: "0.72rem", fontWeight: "600",
                    color: "#ef4444", cursor: "pointer",
                    transition: "all 0.15s", fontFamily: "system-ui, sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#ef4444"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "#fecaca"; }}
                >
                  <TrashIcon size={11} color="#ef4444" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: C.textMuted, fontSize: "0.88rem", textAlign: "center", padding: "12px 0" }}>
          No items in cart.
        </p>
      )}
    </ReviewSection>

          {/* Price Summary */}
          <div style={{ background: C.bgCard, borderRadius: "14px", border: `1.5px solid ${C.border}`, padding: "20px", boxShadow: "0 2px 16px rgba(22,163,74,0.06)" }}>
            <div style={{ fontSize: "0.92rem", fontWeight: "700", color: C.text, marginBottom: "14px", paddingBottom: "12px", borderBottom: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", gap: "8px" }}>
              <LeafIcon /> Price Summary
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.88rem", color: C.textMuted }}>Subtotal</span>
                <span style={{ fontSize: "0.88rem", fontWeight: "600", color: C.text }}>{fmtINR(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.88rem", color: C.textMuted }}>Shipping</span>
                <span style={{ fontSize: "0.88rem", fontWeight: "600", color: shippingFee === 0 ? C.primary : C.text }}>
                  {subtotal === 0 ? "—" : shippingFee === 0 ? "Free ✓" : fmtINR(shippingFee)}
                </span>
              </div>
              <div style={{ borderTop: `1.5px solid ${C.border}`, marginTop: "4px", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1rem", fontWeight: "700", color: C.text }}>Total</span>
                <span style={{ fontSize: "1.15rem", fontWeight: "800", color: C.text }}>{fmtINR(total)}</span>
              </div>
            </div>
            <div style={{ marginTop: "16px", padding: "10px 14px", background: C.success, borderRadius: "9px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: C.primary, fontWeight: "600" }}>
              🌱 This order plants 1 tree through our green initiative.
            </div>
          </div>

        </div>
      </main>

      {/* Sticky footer */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: `1px solid ${C.border}`, padding: isMobile ? "12px 16px" : "14px 32px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", boxShadow: "0 -4px 20px rgba(0,0,0,0.06)", zIndex: 200 }}>
        <button
          onClick={() => router.back()}
          style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: isMobile ? "11px 18px" : "12px 22px", fontSize: "0.9rem", fontWeight: "600", color: C.textMuted, cursor: "pointer", transition: "border-color 0.15s, color 0.15s", fontFamily: "system-ui, sans-serif" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.textMid; e.currentTarget.style.color = C.text; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = C.textMuted; }}
        >
          ← Back
        </button>
        <button
          className="review-next-btn"
          onClick={() => router.push("/checkout/payment")}
          disabled={!selectedAddressId}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: !selectedAddressId ? "#e5e7eb" : `linear-gradient(135deg, ${C.primaryLight} 0%, ${C.primaryBold} 100%)`,
            color: !selectedAddressId ? C.textMuted : "#fff",
            border: "none", borderRadius: "10px",
            padding: isMobile ? "12px 22px" : "13px 32px",
            fontSize: "0.92rem", fontWeight: "700",
            cursor: !selectedAddressId ? "not-allowed" : "pointer",
            boxShadow: !selectedAddressId ? "none" : "0 4px 16px rgba(22,163,74,0.3)",
            transition: "opacity 0.15s, transform 0.15s",
            letterSpacing: "0.01em", fontFamily: "system-ui, sans-serif",
          }}
        >
          Proceed to Payment <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}