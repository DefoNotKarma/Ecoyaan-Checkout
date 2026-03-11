"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPaymentMethod, setPaymentField } from "@/store/paymentSlice";
import { useRouter } from "next/navigation";
import EcoyaanHeader from "@/app/cart/components/header";
import Stepper from "@/app/cart/components/stepper";
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
    const get    = () => window.innerWidth >= 1024 ? "desktop" : window.innerWidth >= 768 ? "tablet" : "mobile";
    const handle = () => setBp(get());
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return bp;
}

/* ══════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════ */
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const CardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const BoltIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const BankIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/>
    <line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/>
    <line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>
  </svg>
);
const CashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/>
    <circle cx="12" cy="12" r="3"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="20" y1="9" x2="23" y2="9"/>
    <line x1="1" y1="15" x2="4" y2="15"/><line x1="20" y1="15" x2="23" y2="15"/>
  </svg>
);
const LockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Punjab National Bank", "Bank of Baroda", "Canara Bank"];

const PAYMENT_METHODS = [
  { id: "card",       label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay",        Icon: CardIcon  },
  { id: "upi",        label: "UPI",                  desc: "GPay, PhonePe, Paytm, BHIM",    Icon: BoltIcon  },
  { id: "netbanking", label: "Net Banking",           desc: "All major Indian banks",         Icon: BankIcon  },
  { id: "cod",        label: "Cash on Delivery",      desc: "Pay when your order arrives",    Icon: CashIcon  },
];

/* ── Card number formatter ── */
function fmtCard(v)   { return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(); }
function fmtExpiry(v) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + " / " + d.slice(2) : d;
}

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export default function PaymentPage() {
  const bp       = useBreakpoint();
  const isMobile = bp === "mobile";
  const dispatch = useDispatch();
  const router   = useRouter();

  const payment = useSelector(s => s.payment);

  const [focusField, setFocusField] = useState(null);
  const [errors,     setErrors]     = useState({});
  const [touched,    setTouched]    = useState({});
  const [selectedApp, setSelectedApp] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber,    setOrderNumber]    = useState("");

  const set = (field) => (e) => {
    let val = e.target.value;
    if (field === "cardNumber") val = fmtCard(val);
    if (field === "cardExpiry") val = fmtExpiry(val);
    if (field === "cardCvv")    val = val.replace(/\D/g, "").slice(0, 4);
    if (field === "cardName")   val = val.replace(/[^a-zA-Z\s]/g, "");
    dispatch(setPaymentField({ field, value: val }));
  };

  const blur = (field) => () => setTouched(p => ({ ...p, [field]: true }));

  const fieldStyle = (field) => ({
    ...inputBase,
    borderColor: errors[field] && touched[field] ? C.errorText
      : focusField === field ? C.primaryLight : C.border,
    boxShadow: focusField === field
      ? `0 0 0 3px ${errors[field] && touched[field] ? "#fecaca" : "#bbf7d0"}`
      : "none",
  });

  const validate = () => {
    const e = {};
    if (payment.method === "card") {
      const rawCard = payment.cardNumber.replace(/\s/g, "");
      if (rawCard.length < 16)                       e.cardNumber = "Enter a valid 16-digit card number";
      if (!payment.cardExpiry || payment.cardExpiry.replace(/\D/g,"").length < 4)
                                                     e.cardExpiry = "Enter a valid expiry date";
      if (!payment.cardCvv || payment.cardCvv.length < 3)
                                                     e.cardCvv    = "Enter a valid CVV";
      if (!payment.cardName.trim())                  e.cardName   = "Enter the name on your card";
    }
    if (payment.method === "upi") {
      if (!payment.upiId.trim() || !payment.upiId.includes("@"))
                                                     e.upiId = "Enter a valid UPI ID (e.g. name@upi)";
    }
    if (payment.method === "netbanking") {
      if (!payment.bank)                             e.bank = "Please select a bank";
    }
    return e;
  };

  const handleNext = () => {
    const allTouched = { cardNumber: true, cardExpiry: true, cardCvv: true, cardName: true, upiId: true, bank: true };
    setTouched(allTouched);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setOrderNumber(" Order Number : " + Math.floor(1000000 + Math.random() * 9000000));
    setOrderConfirmed(true);
  };

  useEffect(() => {
    if (Object.keys(touched).length) setErrors(validate());
  }, [payment, touched]);

  /* ════════ RENDER ════════ */
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", background: C.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pay-method:hover  { border-color: ${C.borderStrong} !important; box-shadow: 0 2px 12px rgba(22,163,74,0.08); }
        .pay-next-btn:hover  { opacity: 0.92 !important; transform: translateY(-1px) !important; }
        .pay-next-btn:active { transform: translateY(0) !important; }
        .pay-fields { animation: fadeIn 0.2s ease; }
        .bank-option:hover { background: ${C.bg} !important; }
      `}</style>

      <EcoyaanHeader />

      <main style={{ maxWidth: "560px", margin: "0 auto", padding: isMobile ? "28px 16px 100px" : "44px 24px 100px" }}>
        <Stepper current={4} isMobile={isMobile} />

        {/* Hero heading */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? "28px" : "36px" }}>
          <h1 style={{ fontSize: isMobile ? "1.65rem" : "2rem", fontWeight: "800", color: C.text, letterSpacing: "-0.03em", lineHeight: "1.2", marginBottom: "10px" }}>
            Check out sustainably.
          </h1>
          <p style={{ fontSize: isMobile ? "0.92rem" : "1rem", color: C.primary, fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px", background: C.success, padding: "5px 14px", borderRadius: "999px", border: `1px solid ${C.border}` }}>
            🔒 256-bit encrypted & secure.
          </p>
        </div>

        {/* ── Method selector ── */}
        <div style={{ background: C.bgCard, borderRadius: "16px", border: `1.5px solid ${C.border}`, padding: isMobile ? "20px" : "28px 32px", boxShadow: "0 4px 24px rgba(22,163,74,0.08)", marginBottom: "16px" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: "700", color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "14px" }}>
            Payment Method
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {PAYMENT_METHODS.map(({ id, label, desc, Icon }) => {
              const selected = payment.method === id;
              return (
                <button
                  key={id}
                  className="pay-method"
                  onClick={() => dispatch(setPaymentMethod(id))}
                  style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "14px 16px",
                    border: selected ? `1.5px solid ${C.primary}` : "1.5px solid #e5e7eb",
                    borderRadius: "12px", cursor: "pointer",
                    background: selected ? C.success : "#fff",
                    boxShadow: selected ? `0 0 0 3px #bbf7d0` : "none",
                    transition: "all 0.15s", textAlign: "left",
                    width: "100%", fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {/* Radio dot */}
                  <div style={{
                    width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                    border: selected ? `5px solid ${C.primary}` : "2px solid #d1d5db",
                    background: selected ? "#fff" : "#fff",
                    transition: "border 0.15s",
                  }} />

                  {/* Icon */}
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "10px",
                    background: selected ? C.border : "#f3f4f6",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: selected ? C.primary : C.textMuted,
                    flexShrink: 0, transition: "background 0.15s, color 0.15s",
                  }}>
                    <Icon />
                  </div>

                  <div>
                    <div style={{ fontSize: "0.92rem", fontWeight: "700", color: C.text }}>{label}</div>
                    <div style={{ fontSize: "0.76rem", color: C.textMuted, marginTop: "2px" }}>{desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Card fields ── */}
        {payment.method === "card" && (
          <div className="pay-fields" style={{ background: C.bgCard, borderRadius: "16px", border: `1.5px solid ${C.border}`, padding: isMobile ? "20px" : "28px 32px", boxShadow: "0 4px 24px rgba(22,163,74,0.08)" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: "700", color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "18px" }}>
              Card Details
            </div>

            {/* Card number */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "0.72rem", fontWeight: "700", color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                Card Number <span style={{ color: C.accent }}>*</span>
              </label>
              <input
                placeholder="1234 5678 9012 3456"
                value={payment.cardNumber}
                onChange={set("cardNumber")}
                onFocus={() => setFocusField("cardNumber")}
                onBlur={() => { setFocusField(null); blur("cardNumber")(); }}
                style={fieldStyle("cardNumber")}
                inputMode="numeric"
              />
              {errors.cardNumber && touched.cardNumber && (
                <p style={{ fontSize: "0.73rem", color: C.errorText, margin: "5px 0 0 2px", animation: "slideDown 0.15s ease" }}>{errors.cardNumber}</p>
              )}
            </div>

            {/* Expiry + CVV */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: "700", color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                  Expiry <span style={{ color: C.accent }}>*</span>
                </label>
                <input
                  placeholder="MM / YY"
                  value={payment.cardExpiry}
                  onChange={set("cardExpiry")}
                  onFocus={() => setFocusField("cardExpiry")}
                  onBlur={() => { setFocusField(null); blur("cardExpiry")(); }}
                  style={fieldStyle("cardExpiry")}
                  inputMode="numeric"
                />
                {errors.cardExpiry && touched.cardExpiry && (
                  <p style={{ fontSize: "0.73rem", color: C.errorText, margin: "5px 0 0 2px", animation: "slideDown 0.15s ease" }}>{errors.cardExpiry}</p>
                )}
              </div>
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: "700", color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                  CVV <span style={{ color: C.accent }}>*</span>
                </label>
                <input
                  placeholder="•••"
                  type="password"
                  value={payment.cardCvv}
                  onChange={set("cardCvv")}
                  onFocus={() => setFocusField("cardCvv")}
                  onBlur={() => { setFocusField(null); blur("cardCvv")(); }}
                  style={fieldStyle("cardCvv")}
                  inputMode="numeric"
                />
                {errors.cardCvv && touched.cardCvv && (
                  <p style={{ fontSize: "0.73rem", color: C.errorText, margin: "5px 0 0 2px", animation: "slideDown 0.15s ease" }}>{errors.cardCvv}</p>
                )}
              </div>
            </div>

            {/* Name on card */}
            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: "700", color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                Name on Card <span style={{ color: C.accent }}>*</span>
              </label>
              <input
                placeholder="JOHN DOE"
                type="text"
                pattern="[a-zA-Z\s]+"
                value={payment.cardName}
                onChange={set("cardName")}
                onFocus={() => setFocusField("cardName")}
                onBlur={() => { setFocusField(null); blur("cardName")(); }}
                style={{ ...fieldStyle("cardName"), textTransform: "uppercase" }}
              />
              {errors.cardName && touched.cardName && (
                <p style={{ fontSize: "0.73rem", color: C.errorText, margin: "5px 0 0 2px", animation: "slideDown 0.15s ease" }}>{errors.cardName}</p>
              )}
            </div>
          </div>
        )}

        {/* ── UPI fields ── */}
        {payment.method === "upi" && (
          <div className="pay-fields" style={{ background: C.bgCard, borderRadius: "16px", border: `1.5px solid ${C.border}`, padding: isMobile ? "20px" : "28px 32px", boxShadow: "0 4px 24px rgba(22,163,74,0.08)" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: "700", color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "18px" }}>
              UPI Details
            </div>


            {/* UPI app chips */}
           <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                {["GPay", "PhonePe", "Paytm", "BHIM"].map(app => {
                    const sel = selectedApp === app;
                    return (
                    <button key={app} type="button"
                        onClick={() => setSelectedApp(sel ? "" : app)}
                        style={{
                        border: `1.5px solid ${sel ? C.primary : C.border}`,
                        borderRadius: "999px",
                        padding: "5px 14px", fontSize: "0.8rem", fontWeight: "600",
                        color:      sel ? C.primary  : C.textMid,
                        background: sel ? C.success  : "#fff",
                        boxShadow:  sel ? `0 0 0 3px #bbf7d0` : "none",
                        cursor: "pointer",
                        fontFamily: "system-ui, sans-serif",
                        transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { if (!sel) { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; e.currentTarget.style.background = C.success; }}}
                        onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.color = C.textMid;  e.currentTarget.style.background = "#fff"; }}}
                    >
                        {app}
                    </button>
                    );
                })}
                </div>

            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: "700", color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                UPI ID <span style={{ color: C.accent }}>*</span>
              </label>
              <input
                placeholder="yourname@upi"
                value={payment.upiId}
                onChange={set("upiId")}
                onFocus={() => setFocusField("upiId")}
                onBlur={() => { setFocusField(null); blur("upiId")(); }}
                style={fieldStyle("upiId")}
              />
              {errors.upiId && touched.upiId && (
                <p style={{ fontSize: "0.73rem", color: C.errorText, margin: "5px 0 0 2px", animation: "slideDown 0.15s ease" }}>{errors.upiId}</p>
              )}
            </div>
          </div>
        )}

        {/* ── Net Banking ── */}
        {payment.method === "netbanking" && (
          <div className="pay-fields" style={{ background: C.bgCard, borderRadius: "16px", border: `1.5px solid ${C.border}`, padding: isMobile ? "20px" : "28px 32px", boxShadow: "0 4px 24px rgba(22,163,74,0.08)" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: "700", color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "18px" }}>
              Select Bank
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {BANKS.map(bank => {
                const sel = payment.bank === bank;
                return (
                  <button key={bank} className="bank-option"
                    onClick={() => { dispatch(setPaymentField({ field: "bank", value: bank })); setTouched(p => ({ ...p, bank: true })); }}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "11px 14px", border: sel ? `1.5px solid ${C.primary}` : "1.5px solid #e5e7eb",
                      borderRadius: "10px", cursor: "pointer", background: sel ? C.success : "#fff",
                      transition: "all 0.15s", textAlign: "left", width: "100%",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0, border: sel ? `5px solid ${C.primary}` : "2px solid #d1d5db", transition: "border 0.15s" }} />
                    <span style={{ fontSize: "0.88rem", fontWeight: sel ? "700" : "500", color: sel ? C.primary : C.text }}>{bank}</span>
                  </button>
                );
              })}
            </div>
            {errors.bank && touched.bank && (
              <p style={{ fontSize: "0.73rem", color: C.errorText, margin: "12px 0 0 2px", animation: "slideDown 0.15s ease" }}>{errors.bank}</p>
            )}
          </div>
        )}

        {/* ── COD notice ── */}
        {payment.method === "cod" && (
          <div className="pay-fields" style={{ background: C.bgCard, borderRadius: "16px", border: `1.5px solid ${C.border}`, padding: isMobile ? "20px" : "28px 32px", boxShadow: "0 4px 24px rgba(22,163,74,0.08)", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🌿</div>
            <div style={{ fontSize: "1rem", fontWeight: "700", color: C.text, marginBottom: "6px" }}>Pay on Delivery</div>
            <div style={{ fontSize: "0.85rem", color: C.textMuted, lineHeight: "1.6" }}>
              Pay in cash when your order arrives. Our delivery partner will carry a payment receipt.
            </div>
            <div style={{ marginTop: "16px", padding: "10px 16px", background: "#e2f9f0", borderRadius: "8px", fontSize: "0.8rem", color: C.primary, fontWeight: "600" }}>
              ₹40 COD handling fee applies
            </div>
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: "0.73rem", color: C.textMuted, marginTop: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
          <LockIcon /> Your payment info is encrypted and never stored.
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
          className="order-cta"
          onClick={handleNext}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: `linear-gradient(135deg, ${C.primaryLight} 0%, ${C.primaryBold} 100%)`,
            color: "#fff", border: "none", borderRadius: "10px",
            padding: isMobile ? "12px 22px" : "13px 32px",
            fontSize: "0.92rem", fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(22,163,74,0.3)",
            transition: "opacity 0.15s, transform 0.15s",
            letterSpacing: "0.01em", fontFamily: "system-ui, sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1";   e.currentTarget.style.transform = "translateY(0)"; }}
          onMouseDown={e  => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          🌿 Place Order
        </button>
      </div>


    {/* ORDER CONFIRMED POPUP*/}
    {orderConfirmed && (
      <div
        onClick={() => setOrderConfirmed(false)}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: "24px",
          animation: "fadeInBg 0.25s ease",
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: "#fff",
            borderRadius: "28px",
            padding: "0 0 36px",
            maxWidth: "400px", width: "100%",
            boxShadow: "0 32px 80px rgba(0,0,0,0.22)",
            textAlign: "center",
            animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* ── Rainbow shimmer bar ── */}
          <div style={{
            height: "6px", width: "100%",
            background: "linear-gradient(90deg,#4ade80,#16a34a,#15803d,#16a34a,#4ade80)",
            backgroundSize: "400px 100%",
            animation: "shimmerBg 2s linear infinite",
          }} />

          {/* ── Body ── */}
          <div style={{ padding: "36px 32px 0" }}>

            {/* Party emoji */}
            <div style={{
              fontSize: "5.5rem", lineHeight: 1,
              marginBottom: "20px",
              display: "inline-block",
              animation: "floatUp 2.4s ease-in-out infinite",
            }}>
              🎉
            </div>

            <h2 style={{
              fontSize: "1.7rem", fontWeight: "800",
              color: C.text, letterSpacing: "-0.03em",
              lineHeight: 1.2, margin: "0 0 10px",
            }}>
              You placed an order!
            </h2>

            <p style={{
              fontSize: "0.9rem", color: C.textMuted,
              lineHeight: 1.7, margin: "0 0 22px",
            }}>
              Thank you for choosing Ecoyaan. Your order is confirmed and on its way — sustainably. 🌿
            </p>

            {/* Order number pill */}
            <div style={{
              display: "inline-block",
              background: C.success,
              border: `1.5px solid ${C.border}`,
              borderRadius: "999px",
              padding: "6px 22px",
              fontSize: "0.82rem", fontWeight: "800",
              color: C.primary, letterSpacing: "0.07em",
              marginBottom: "24px",
              fontFamily: "monospace",
            }}>
              {orderNumber}
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: C.border, marginBottom: "20px" }} />

            {/* Eco note */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "8px", fontSize: "0.78rem", color: C.primary, fontWeight: "600",
              background: C.success, borderRadius: "10px",
              padding: "10px 16px", border: `1px solid ${C.border}`,
              marginBottom: "24px",
            }}>
              🌱 This order plants 1 tree through our green initiative.
            </div>

            {/* CTA */}
            <button
              onClick={() => router.push("/")}
              style={{
                width: "100%",
                background: `linear-gradient(135deg, ${C.primaryLight} 0%, ${C.primaryBold} 100%)`,
                color: "#fff", border: "none", borderRadius: "12px",
                padding: "14px", fontSize: "0.95rem", fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(22,163,74,0.3)",
                transition: "opacity 0.15s, transform 0.15s",
                letterSpacing: "0.01em",
                fontFamily: "system-ui, sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1";   e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}