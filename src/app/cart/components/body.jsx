"use client";
import { useState, useEffect } from "react";

/* ── useBreakpoint ── */
function useBreakpoint() {
  const getBreakpoint = () => {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    return w >= 1024 ? "desktop" : w >= 768 ? "tablet" : "mobile";
  };
  const [bp, setBp] = useState(getBreakpoint);
  useEffect(() => {
    const handle = () => setBp(getBreakpoint());
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return bp;
}

/* ── Icons ── */
const SparkleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);
const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const TrashIcon = ({ size = 14, color = "#ef4444" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
const HeartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

/* ── Alias chips ── */
const ALIAS_CHIPS = ["🏠 Home", "🏢 Work", "👨‍👩‍👧 Parents", "🏋️ Gym", "📦 Other"];

/* ── Input style ── */
const inputStyle = {
  border: "1.5px solid #bbf7d0", borderRadius: "8px", padding: "9px 12px",
  fontSize: "0.88rem", outline: "none", color: "#111827",
  width: "100%", boxSizing: "border-box", background: "#fff",
};


const INITIAL_ITEMS = [
  {
    product_id: 101,
    product_name: "Bamboo Toothbrush (Pack of 4)",
    product_price: 299,
    original_price: 349,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=150&h=150&fit=crop",
  },
  {
    product_id: 102,
    product_name: "Reusable Cotton Produce Bags",
    product_price: 450,
    original_price: 520,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=150&h=150&fit=crop",
  },
  {
    product_id: 103,
    product_name: "Organic Beeswax Wraps — Set of 3",
    product_price: 349,
    original_price: 399,
    quantity: 1,
    image: "https://www.beeswrap.com/cdn/shop/files/2022_BTS_Website_Update_2_1920x.png?v=1659014107",
  },
];

/* ══════════════════════════════════════════════════════════════
   CartSummary
══════════════════════════════════════════════════════════════ */
export default function CartSummary() {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";

  /* ── Cart items ── */
  const [items, setItems] = useState(INITIAL_ITEMS);

  /* ── Derived totals (live) ── */
  const subtotal     = items.reduce((s, i) => s + i.product_price * i.quantity, 0);
  const origTotal    = items.reduce((s, i) => s + i.original_price * i.quantity, 0);
  const savings      = origTotal - subtotal;
  const shipping_fee = subtotal > 0 && subtotal < 499 ? 49 : 0;
  const total        = subtotal + shipping_fee;
  const itemCount    = items.reduce((s, i) => s + i.quantity, 0);

  const fmtINR = (n) => "₹" + n.toLocaleString("en-IN");

  /* ── Qty & remove ── */
  const updateQty = (id, delta) =>
    setItems(prev =>
      prev.map(item =>
        item.product_id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  const removeItem = (id) => setItems(prev => prev.filter(i => i.product_id !== id));

  /* ── Address state ── */
  const [addingAddress, setAddingAddress]     = useState(false);
  const [addressLine, setAddressLine]         = useState("");
  const [city, setCity]                       = useState("");
  const [pincode, setPincode]                 = useState("");
  const [aliasInput, setAliasInput]           = useState("");
  const [aliasChip, setAliasChip]             = useState("");
  const [savedAddresses, setSavedAddresses]   = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formError, setFormError]             = useState("");
  const [toast, setToast]                     = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const effectiveAlias = aliasChip || aliasInput;

  const resetForm = () => {
    setAddressLine(""); setCity(""); setPincode("");
    setAliasInput(""); setAliasChip(""); setFormError("");
  };

  const handleSave = () => {
    if (!effectiveAlias.trim()) { setFormError("Please give this address a name."); return; }
    if (!addressLine.trim() || !city.trim() || !pincode.trim()) { setFormError("Please fill in all address fields."); return; }
    const newAddr = { id: Date.now(), alias: effectiveAlias.trim(), line: addressLine.trim(), city: city.trim(), pincode: pincode.trim() };
    setSavedAddresses(prev => [...prev, newAddr]);
    setSelectedAddress(newAddr.id);
    setAddingAddress(false);
    resetForm();
  };

  const handleDelete = (id) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddress === id) setSelectedAddress(null);
  };

  const s = {
    titleSize: isMobile ? "1.25rem" : "1.5rem",
    labelSize: isMobile ? "0.9rem"  : "1rem",
    valueSize: isMobile ? "0.9rem"  : "1rem",
    totalSize: isMobile ? "1.05rem" : "1.2rem",
  };

  /* ════════ RENDER ════════ */
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", width: "100%" }}>

      {/* ── Title + live item counter ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: isMobile ? "20px" : "28px" }}>
        <h1 style={{ fontSize: s.titleSize, fontWeight: "700", color: "#111827", margin: 0, letterSpacing: "-0.02em" }}>
          Your Cart
        </h1>
        <span style={{
          background: itemCount > 0 ? "#16a34a" : "#9ca3af",
          color: "#fff", fontSize: "0.72rem", fontWeight: "700",
          padding: "3px 10px", borderRadius: "999px", letterSpacing: "0.03em",
          transition: "background 0.2s",
        }}>
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      {/* ════════════════════════════════════════
          CART ITEMS LIST
      ════════════════════════════════════════ */}
      {items.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "40px 20px",
          background: "#f9fafb", borderRadius: "12px",
          marginBottom: "28px", color: "#9ca3af", fontSize: "0.9rem",
          border: "1.5px dashed #e5e7eb",
        }}>
          🌿 Your cart is empty. Start adding some sustainable products!
        </div>
      ) : (
        <div style={{ marginBottom: isMobile ? "20px" : "28px" }}>
          {items.map((item, idx) => (
            <div key={item.product_id} style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "72px 1fr auto" : "88px 1fr auto",
              gap: isMobile ? "12px" : "16px",
              padding: isMobile ? "14px 0" : "18px 0",
              borderBottom: idx < items.length - 1 ? "1px solid #f3f4f6" : "1.5px solid #e5e7eb",
              alignItems: "start",
            }}>

              {/* Image */}
              <div style={{
                width: isMobile ? "72px" : "88px",
                height: isMobile ? "72px" : "88px",
                borderRadius: "10px", overflow: "hidden",
                background: "#f3f4f6", flexShrink: 0,
              }}>
                <img
                  src={item.image} alt={item.product_name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={e => { e.target.style.display = "none"; }}
                />
              </div>

              {/* Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: 0 }}>
                <span style={{
                  fontSize: isMobile ? "0.85rem" : "0.92rem",
                  fontWeight: "600", color: "#111827", lineHeight: "1.4",
                }}>
                  {item.product_name}
                </span>

                {/* Price row */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.95rem", fontWeight: "700", color: "#111827" }}>{fmtINR(item.product_price)}</span>
                  <span style={{ fontSize: "0.78rem", color: "#9ca3af", textDecoration: "line-through" }}>{fmtINR(item.original_price)}</span>
                  <span style={{
                    fontSize: "0.72rem", color: "#16a34a", fontWeight: "600",
                    background: "#f0fdf4", padding: "2px 6px", borderRadius: "4px",
                  }}>
                    Save {fmtINR(item.original_price - item.product_price)}
                  </span>
                </div>

                {/* Qty stepper + save for later */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px", flexWrap: "wrap" }}>
                  {/* Stepper */}
                  <div style={{
                    display: "flex", alignItems: "center",
                    border: "1.5px solid #e5e7eb", borderRadius: "7px",
                    overflow: "hidden", width: "fit-content",
                  }}>
                    <button
                      onClick={() => updateQty(item.product_id, -1)}
                      style={{ background: "#f9fafb", border: "none", padding: "5px 11px", cursor: "pointer", fontSize: "1rem", color: "#374151", fontWeight: "500", lineHeight: 1 }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
                      onMouseLeave={e => e.currentTarget.style.background = "#f9fafb"}
                    >−</button>
                    <span style={{
                      padding: "5px 12px", fontSize: "0.85rem", fontWeight: "700",
                      color: "#111827", minWidth: "32px", textAlign: "center",
                      background: "#fff",
                      borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb",
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.product_id, +1)}
                      style={{ background: "#f9fafb", border: "none", padding: "5px 11px", cursor: "pointer", fontSize: "1rem", color: "#374151", fontWeight: "500", lineHeight: 1 }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
                      onMouseLeave={e => e.currentTarget.style.background = "#f9fafb"}
                    >+</button>
                  </div>

                  {/* Save for later */}
                  <button style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "0.75rem", color: "#16a34a", fontWeight: "600",
                    textDecoration: "underline", textUnderlineOffset: "2px",
                    padding: 0, display: "flex", alignItems: "center", gap: "4px",
                  }}>
                    <HeartIcon /> Save for later
                  </button>
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={() => removeItem(item.product_id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "4px", borderRadius: "6px", opacity: 0.45,
                  transition: "opacity 0.15s, background 0.15s",
                  display: "flex", alignItems: "flex-start", marginTop: "2px",
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = "#fef2f2"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "0.45"; e.currentTarget.style.background = "none"; }}
                title="Remove item"
              >
                <TrashIcon size={isMobile ? 14 : 16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ════════════════════════════════════════
          SUMMARY + CHECKOUT
      ════════════════════════════════════════ */}
      <div style={{
        borderBottom: "1.5px solid #e5e7eb",
        paddingBottom: isMobile ? "20px" : "28px",
        marginBottom: isMobile ? "20px" : "28px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "stretch" : "flex-start",
        gap: isMobile ? "20px" : "24px",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: isMobile ? "48px" : "120px" }}>
            <span style={{ fontSize: s.labelSize, color: "#6b7280" }}>Subtotal:</span>
            <span style={{ fontSize: s.valueSize, color: "#111827", fontWeight: "500" }}>{fmtINR(subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: isMobile ? "48px" : "120px" }}>
            <span style={{ fontSize: s.labelSize, color: "#6b7280" }}>Delivery Fee:</span>
            <span style={{ fontSize: s.valueSize, color: "#16a34a", fontWeight: "600" }}>
              {subtotal === 0 ? "—" : shipping_fee === 0 ? "Free Delivery" : fmtINR(shipping_fee)}
            </span>
          </div>
          {shipping_fee > 0 && subtotal > 0 && (
            <p style={{ fontSize: "0.75rem", color: "#9ca3af", margin: 0 }}>
              Add {fmtINR(499 - subtotal)} more for free delivery
            </p>
          )}
          <div style={{ height: "1px", background: "#f0fdf4", margin: "2px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: isMobile ? "48px" : "120px" }}>
            <span style={{ fontSize: s.totalSize, color: "#111827", fontWeight: "700" }}>Total:</span>
            <span style={{ fontSize: s.totalSize, color: "#111827", fontWeight: "700" }}>{fmtINR(total)}</span>
          </div>
        </div>

        <button
          style={{
            background: items.length === 0
              ? "#e5e7eb"
              : "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
            color: items.length === 0 ? "#9ca3af" : "#fff",
            border: "none", borderRadius: "12px",
            padding: isMobile ? "14px 0" : "14px 28px",
            fontSize: isMobile ? "1rem" : "0.95rem", fontWeight: "600",
            cursor: items.length === 0 ? "not-allowed" : "pointer",
            width: isMobile ? "100%" : "auto",
            letterSpacing: "0.01em",
            boxShadow: items.length === 0 ? "none" : "0 4px 14px rgba(22,163,74,0.25)",
            transition: "opacity 0.15s, transform 0.15s",
            flexShrink: 0, alignSelf: isMobile ? "stretch" : "flex-start",
          }}
          onMouseEnter={e => { if (items.length > 0) { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          onClick={() => { if (items.length === 0) return; if (!selectedAddress) showToast("Please select a delivery address"); }}
        >
          Proceed to Checkout
        </button>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
          background: "#e44848", color: "#fff", padding: "12px 20px", borderRadius: "12px",
          fontSize: "0.88rem", fontWeight: "500", boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          display: "flex", alignItems: "center", gap: "10px", zIndex: 999,
          whiteSpace: "nowrap", animation: "fadeUp 0.25s ease",
        }}>
          <span style={{
            background: "#000000cb", borderRadius: "50%", width: "20px", height: "20px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.7rem", fontWeight: "700", flexShrink: 0,
          }}>!</span>
          {toast}
        </div>
      )}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* ── Savings Banner (only when there are items) ── */}
      {savings > 0 && (
        <div style={{
          background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          border: "1.5px solid #bbf7d0", borderRadius: "14px",
          padding: isMobile ? "14px 16px" : "18px 22px",
          display: "flex", gap: isMobile ? "12px" : "16px",
          alignItems: "flex-start", marginBottom: isMobile ? "24px" : "32px",
        }}>
          <div style={{ background: "#fff", borderRadius: "10px", padding: "8px", flexShrink: 0, boxShadow: "0 2px 8px rgba(22,163,74,0.1)" }}>
            <SparkleIcon />
          </div>
          <div>
            <p style={{ fontSize: isMobile ? "0.9rem" : "0.95rem", fontWeight: "700", color: "#15803d", marginBottom: "3px" }}>
              You saved {fmtINR(savings)} in total
            </p>
            <p style={{ fontSize: isMobile ? "0.78rem" : "0.82rem", color: "#16a34a", lineHeight: "1.5" }}>
              Great choice! You're making sustainable shopping more rewarding.
            </p>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          DELIVERY ADDRESS
      ════════════════════════════════════════ */}
      <div>
        <div style={{
          display: "flex", flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          gap: isMobile ? "10px" : "14px", marginBottom: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MapPinIcon />
            <h2 style={{ fontSize: isMobile ? "1rem" : "1.05rem", fontWeight: "700", color: "#111827", margin: 0 }}>
              Delivery address
            </h2>
          </div>
          <button
            onClick={() => { setAddingAddress(v => !v); resetForm(); }}
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              border: "1.5px solid #16a34a", color: "#16a34a",
              background: addingAddress ? "#f0fdf4" : "transparent",
              padding: "5px 12px", borderRadius: "8px",
              fontSize: "0.82rem", fontWeight: "600", cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
            onMouseLeave={e => e.currentTarget.style.background = addingAddress ? "#f0fdf4" : "transparent"}
          >
            <PlusIcon /> Add address
          </button>
        </div>

        {/* Saved address radio cards */}
        {savedAddresses.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
            {savedAddresses.map(addr => (
              <label key={addr.id} style={{
                display: "flex", alignItems: "flex-start", gap: "12px",
                padding: "12px 14px",
                border: selectedAddress === addr.id ? "1.5px solid #16a34a" : "1.5px solid #e5e7eb",
                borderRadius: "10px", cursor: "pointer",
                background: selectedAddress === addr.id ? "#f0fdf4" : "#fff",
                transition: "border 0.15s, background 0.15s",
              }}>
                <input
                  type="radio" name="delivery-address"
                  checked={selectedAddress === addr.id}
                  onChange={() => setSelectedAddress(addr.id)}
                  style={{ marginTop: "3px", accentColor: "#16a34a", flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "#15803d", marginBottom: "2px" }}>{addr.alias}</div>
                  <div style={{ fontSize: "0.85rem", color: "#374151" }}>{addr.line}, {addr.city} — {addr.pincode}</div>
                </div>
                <button
                  onClick={e => { e.preventDefault(); handleDelete(addr.id); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", flexShrink: 0, opacity: 0.6, transition: "opacity 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}
                  title="Remove address"
                >
                  <TrashIcon />
                </button>
              </label>
            ))}
          </div>
        )}

        {savedAddresses.length === 0 && !addingAddress && (
          <p style={{ color: "#9ca3af", fontSize: isMobile ? "0.85rem" : "0.9rem", lineHeight: "1.5" }}>
            No default address set. Please add an address.
          </p>
        )}

        {/* Add address form */}
        {addingAddress && (
          <div style={{
            background: "#fafffe", border: "1.5px solid #d1fae5",
            borderRadius: "12px", padding: isMobile ? "14px" : "18px",
            marginBottom: "14px", display: "flex", flexDirection: "column", gap: "12px",
          }}>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
                What do you want to call this address?
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                {ALIAS_CHIPS.map(chip => (
                  <button key={chip} type="button"
                    onClick={() => { setAliasChip(aliasChip === chip ? "" : chip); setAliasInput(""); }}
                    style={{
                      border: aliasChip === chip ? "1.5px solid #16a34a" : "1.5px solid #d1fae5",
                      borderRadius: "999px", padding: "5px 12px", fontSize: "0.78rem", fontWeight: "500",
                      cursor: "pointer", background: aliasChip === chip ? "#f0fdf4" : "#fff",
                      color: aliasChip === chip ? "#15803d" : "#374151", transition: "all 0.15s",
                    }}
                  >{chip}</button>
                ))}
              </div>
              {!aliasChip && (
                <input placeholder="Or type a custom name…" value={aliasInput} onChange={e => setAliasInput(e.target.value)} style={inputStyle} />
              )}
            </div>

            <input placeholder="Street address, flat/house no." value={addressLine} onChange={e => setAddressLine(e.target.value)} style={inputStyle} />

            <div style={{ display: "flex", gap: "10px", flexDirection: isMobile ? "column" : "row" }}>
              <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <input placeholder="Pincode" value={pincode} onChange={e => setPincode(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            </div>

            {formError && <p style={{ fontSize: "0.78rem", color: "#ef4444", margin: 0 }}>{formError}</p>}

            <div style={{ display: "flex", gap: "8px", flexDirection: isMobile ? "column" : "row" }}>
              <button onClick={handleSave} style={{ flex: 1, background: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", fontSize: "0.88rem", fontWeight: "600", cursor: "pointer" }}>
                Save Address
              </button>
              <button onClick={() => { setAddingAddress(false); resetForm(); }} style={{ flex: isMobile ? 1 : "none", background: "transparent", color: "#6b7280", border: "1.5px solid #e5e7eb", borderRadius: "8px", padding: "10px 16px", fontSize: "0.88rem", fontWeight: "500", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}