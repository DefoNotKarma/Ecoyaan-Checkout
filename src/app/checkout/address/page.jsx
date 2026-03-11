"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAddress, removeAddress, selectAddress } from "@/store/addressSlice";
import { useRouter } from "next/navigation";
import Stepper from "@/app/cart/components/stepper";
import EcoyaanHeader from "@/app/cart/components/header";
import C from "@/app/cart/components/colorPalette";


const inputBase = {
  border: `1.5px solid ${C.border}`,
  borderRadius: "9px",
  padding: "11px 14px",
  fontSize: "0.9rem",
  outline: "none",
  color: C.text,
  width: "100%",
  boxSizing: "border-box",
  background: "#fff",
  fontFamily: "'Nunito', system-ui, sans-serif",
  fontWeight: "600",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

/* ── useBreakpoint ── */
function useBreakpoint() {
  const [bp, setBp] = useState("desktop");
  useEffect(() => {
    const get = () => window.innerWidth >= 1024 ? "desktop" : window.innerWidth >= 768 ? "tablet" : "mobile";
    const handle = () => setBp(get());
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return bp;
}

/* ── Icons ── */
const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const ALIAS_CHIPS = ["🏠 Home", "🏢 Work", "👨‍👩‍👧 Parents", "🏋️ Gym", "📦 Other"];

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export default function AddressPage() {
  const bp       = useBreakpoint();
  const isMobile = bp === "mobile";
  const dispatch = useDispatch();
  const router   = useRouter();

  const { savedAddresses, selectedAddressId } = useSelector(s => s.address);

  /* ── form state ── */
  const [addingAddress, setAddingAddress] = useState(false);
  const [focusField,    setFocusField]    = useState(null);
  const [formError,     setFormError]     = useState("");
  const [noAddrError,   setNoAddrError]   = useState(false);

  const [addressLine, setAddressLine] = useState("");
  const [city,        setCity]        = useState("");
  const [pincode,     setPincode]     = useState("");
  const [aliasChip,   setAliasChip]   = useState("");
  const [aliasInput,  setAliasInput]  = useState("");

  const effectiveAlias = aliasChip || aliasInput;

  const resetForm = () => {
    setAddressLine(""); setCity(""); setPincode("");
    setAliasChip(""); setAliasInput(""); setFormError("");
  };

  const fieldStyle = (field) => ({
    ...inputBase,
    borderColor: focusField === field ? C.primaryLight : C.border,
    boxShadow:   focusField === field ? `0 0 0 3px #bbf7d0` : "none",
  });

  const handleSave = () => {
    if (!effectiveAlias.trim())                                  { setFormError("Please give this address a name."); return; }
    if (!addressLine.trim() || !city.trim() || !pincode.trim()) { setFormError("Please fill in all fields."); return; }
    const cleanPin = pincode.replace(/\D/g, "").slice(0, 6);
    if (cleanPin.length < 6)                                     { setFormError("Enter a valid 6-digit pincode."); return; }

    dispatch(addAddress({
      id:      Date.now(),
      alias:   effectiveAlias.trim(),
      line:    addressLine.trim(),
      city:    city.trim(),
      pincode: cleanPin,
    }));
    setAddingAddress(false);
    resetForm();
    setNoAddrError(false);
  };

  const handleNext = () => {
    if (!selectedAddressId) { setNoAddrError(true); return; }
    router.push("/checkout/review");
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", background: C.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .addr-next-btn:hover  { opacity: 0.92 !important; transform: translateY(-1px) !important; }
        .addr-next-btn:active { transform: translateY(0) !important; }
        .alias-chip { transition: all 0.15s; cursor: pointer; border: 1.5px solid ${C.border}; border-radius: 999px; padding: 5px 12px; font-size: 0.78rem; font-weight: 600; background: #fff; color: ${C.textMid}; font-family: system-ui, sans-serif; }
        .alias-chip:hover   { border-color: ${C.primary}; color: ${C.primary}; }
        .alias-chip.selected { border-color: ${C.primary}; background: ${C.success}; color: ${C.primary}; }
        .addr-card { transition: border-color 0.15s, box-shadow 0.15s; }
        .addr-card:hover { border-color: ${C.borderStrong} !important; }
        .addr-delete:hover { opacity: 1 !important; }
      `}</style>

      <EcoyaanHeader />

      <main style={{ maxWidth: "560px", margin: "0 auto", padding: isMobile ? "28px 16px 100px" : "44px 24px 100px" }}>
        <Stepper current={2} isMobile={isMobile} />

        {/* Hero heading */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? "28px" : "36px" }}>
          <h1 style={{ fontSize: isMobile ? "1.65rem" : "2rem", fontWeight: "800", color: C.text, letterSpacing: "-0.03em", lineHeight: "1.2", marginBottom: "10px" }}>
            Where should we deliver?
          </h1>
          <p style={{ fontSize: isMobile ? "0.92rem" : "1rem", color: C.primary, fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px", background: C.success, padding: "5px 14px", borderRadius: "999px", border: `1px solid ${C.border}` }}>
            🌿 We deliver sustainably.
          </p>
        </div>

        {/* ── Card ── */}
        <div style={{ background: C.bgCard, borderRadius: "16px", border: `1.5px solid ${C.border}`, padding: isMobile ? "20px" : "28px 32px", boxShadow: "0 4px 24px rgba(22,163,74,0.08)" }}>

          {/* Card header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", paddingBottom: "16px", borderBottom: `1.5px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: C.success, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MapPinIcon />
              </div>
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: "700", color: C.text }}>Delivery Address</div>
                <div style={{ fontSize: "0.75rem", color: C.textMuted }}>Select or add a delivery address</div>
              </div>
            </div>

            {!addingAddress && (
              <button
                onClick={() => { setAddingAddress(true); resetForm(); }}
                style={{ display: "flex", alignItems: "center", gap: "5px", border: `1.5px solid ${C.primary}`, color: C.primary, background: "transparent", padding: "6px 12px", borderRadius: "8px", fontSize: "0.82rem", fontWeight: "700", cursor: "pointer", transition: "background 0.15s", fontFamily: "system-ui, sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.background = C.success}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <PlusIcon /> Add address
              </button>
            )}
          </div>

          {/* Saved addresses */}
          {savedAddresses.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
              {savedAddresses.map(addr => (
                <label key={addr.id} className="addr-card" style={{
                  display: "flex", alignItems: "flex-start", gap: "12px",
                  padding: "14px 16px",
                  border: selectedAddressId === addr.id ? `1.5px solid ${C.primary}` : `1.5px solid #e5e7eb`,
                  borderRadius: "12px", cursor: "pointer",
                  background: selectedAddressId === addr.id ? C.success : "#fff",
                  boxShadow: selectedAddressId === addr.id ? `0 0 0 3px #bbf7d0` : "none",
                }}>
                  <input
                    type="radio" name="delivery-address"
                    checked={selectedAddressId === addr.id}
                    onChange={() => { dispatch(selectAddress(addr.id)); setNoAddrError(false); }}
                    style={{ marginTop: "3px", accentColor: C.primary, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: "700", color: C.primary, marginBottom: "3px" }}>{addr.alias}</div>
                    <div style={{ fontSize: "0.85rem", color: C.textMid, lineHeight: "1.5" }}>{addr.line}, {addr.city} — {addr.pincode}</div>
                  </div>
                  <button
                    className="addr-delete"
                    onClick={e => { e.preventDefault(); dispatch(removeAddress(addr.id)); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", opacity: 0.5, transition: "opacity 0.15s", flexShrink: 0 }}
                  >
                    <TrashIcon />
                  </button>
                </label>
              ))}
            </div>
          )}

          {savedAddresses.length === 0 && !addingAddress && (
            <p style={{ color: C.textMuted, fontSize: "0.88rem", marginBottom: "16px", textAlign: "center", padding: "20px 0" }}>
              No saved addresses yet. Add one below.
            </p>
          )}

          {/* No address selected error */}
          {noAddrError && (
            <p style={{ fontSize: "0.78rem", color: C.errorText, marginBottom: "12px", animation: "slideDown 0.15s ease" }}>
              Please select or add a delivery address to continue.
            </p>
          )}

          {/* Add address form */}
          {addingAddress && (
            <div style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: "12px", padding: isMobile ? "16px" : "20px", marginBottom: "8px", display: "flex", flexDirection: "column", gap: "14px", animation: "slideDown 0.2s ease" }}>

              {/* Alias chips */}
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: "700", color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                  Address label <span style={{ color: C.accent }}>*</span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: aliasChip ? 0 : "8px" }}>
                  {ALIAS_CHIPS.map(chip => (
                    <button key={chip} type="button"
                      className={`alias-chip${aliasChip === chip ? " selected" : ""}`}
                      onClick={() => { setAliasChip(aliasChip === chip ? "" : chip); setAliasInput(""); }}
                    >{chip}</button>
                  ))}
                </div>
                {!aliasChip && (
                  <input
                    placeholder="Or type a custom name…"
                    value={aliasInput}
                    onChange={e => setAliasInput(e.target.value)}
                    onFocus={() => setFocusField("alias")}
                    onBlur={() => setFocusField(null)}
                    style={fieldStyle("alias")}
                  />
                )}
              </div>

              {/* Street */}
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: "700", color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                  Street address <span style={{ color: C.accent }}>*</span>
                </label>
                <input
                  placeholder="Building, flat no., street, area"
                  value={addressLine}
                  onChange={e => setAddressLine(e.target.value)}
                  onFocus={() => setFocusField("line")}
                  onBlur={() => setFocusField(null)}
                  style={fieldStyle("line")}
                />
              </div>

              {/* City + Pincode */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: "700", color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                    City <span style={{ color: C.accent }}>*</span>
                  </label>
                  <input
                    placeholder="Bengaluru"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    onFocus={() => setFocusField("city")}
                    onBlur={() => setFocusField(null)}
                    style={fieldStyle("city")}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: "700", color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                    Pincode <span style={{ color: C.accent }}>*</span>
                  </label>
                  <input
                    placeholder="560001"
                    type="tel"
                    value={pincode}
                    onChange={e => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onFocus={() => setFocusField("pin")}
                    onBlur={() => setFocusField(null)}
                    style={fieldStyle("pin")}
                  />
                </div>
              </div>

              {formError && (
                <p style={{ fontSize: "0.75rem", color: C.errorText, margin: 0, animation: "slideDown 0.15s ease" }}>{formError}</p>
              )}

              <div style={{ display: "flex", gap: "10px", flexDirection: isMobile ? "column" : "row" }}>
                <button
                  onClick={handleSave}
                  style={{ flex: 1, background: C.primary, color: "#fff", border: "none", borderRadius: "9px", padding: "11px", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer", transition: "background 0.15s", fontFamily: "system-ui, sans-serif" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.primaryBold}
                  onMouseLeave={e => e.currentTarget.style.background = C.primary}
                >
                  Save Address
                </button>
                <button
                  onClick={() => { setAddingAddress(false); resetForm(); }}
                  style={{ flex: isMobile ? 1 : "none", background: "transparent", color: C.textMuted, border: "1.5px solid #e5e7eb", borderRadius: "9px", padding: "11px 18px", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer", fontFamily: "system-ui, sans-serif" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: "0.73rem", color: C.textMuted, marginTop: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Your address is only used for this delivery.
        </p>
      </main>

      {/* ── Sticky footer ── */}
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
          className="addr-next-btn"
          onClick={handleNext}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)", color: "#fff", border: "none", borderRadius: "10px", padding: isMobile ? "12px 22px" : "13px 28px", fontSize: "0.92rem", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 16px rgba(22,163,74,0.3)", transition: "opacity 0.15s, transform 0.15s", letterSpacing: "0.01em", fontFamily: "system-ui, sans-serif" }}
        >
          Next Step <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}