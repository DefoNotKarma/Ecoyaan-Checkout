"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "@/store/userInfoSlice";
import Stepper from "./stepper";
import C from './colorPalette'

/* ══════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════ */
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#86efac" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#86efac" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* ══════════════════════════════════════════════
   INPUT BASE
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export default function UserInfoPage() {
  const router    = useRouter();
  const dispatch  = useDispatch();
  const savedInfo = useSelector(s => s.userInfo);
  const [form, setForm] = useState(savedInfo);
  const [errors,     setErrors]     = useState({});
  const [touched,    setTouched]    = useState({});
  const [focusField, setFocusField] = useState(null);

  const set  = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));
  const blur = (field) => ()  => setTouched(p => ({ ...p, [field]: true }));

  const validate = (f) => {
    const e = {};
    if (!f.firstName.trim())                                              e.firstName = "First name is required";
    if (!f.lastName.trim())                                               e.lastName  = "Last name is required";
    if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email     = "Valid email required";
    if (!f.phone.trim() || f.phone.replace(/\D/g, "").length < 10)       e.phone     = "10-digit phone required";
    return e;
  };

  useEffect(() => {
    if (Object.keys(touched).length) setErrors(validate(form));
  }, [form, touched]);

  const handleNext = () => {
    setTouched({ firstName: true, lastName: true, email: true, phone: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    dispatch(setUserInfo(form));
    router.push("/checkout/address");
  };

  const inputStyle = (field) => ({
    ...inputBase,
    borderColor: errors[field] && touched[field] ? C.errorText
      : focusField === field ? C.primaryLight : C.border,
    boxShadow: focusField === field
      ? `0 0 0 3px ${errors[field] && touched[field] ? "#fecaca" : "#bbf7d0"}`
      : "none",
  });

  /* ════════ RENDER ════════ */
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', system-ui, sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .uip-next-btn:hover  { opacity: 0.92 !important; transform: translateY(-1px) !important; }
        .uip-next-btn:active { transform: translateY(0px) !important; }
      `}</style>

      <main style={{
        width: "100%",
        maxWidth: "560px",
        margin: "0 auto",
        padding: "44px 24px 120px",
      }}>

        <Stepper current={1} />

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h1 style={{
            fontSize: "2rem", fontWeight: "800", color: C.text,
            letterSpacing: "-0.03em", lineHeight: "1.2", marginBottom: "10px",
          }}>
            Go on, make it personal.
          </h1>
          <p style={{
            fontSize: "1rem", color: C.primary, fontWeight: "600",
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: C.success, padding: "5px 14px",
            borderRadius: "999px", border: `1px solid ${C.border}`,
          }}>
            🌿 It's greener on this side.
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: C.bgCard, borderRadius: "16px",
          border: `1.5px solid ${C.border}`,
          padding: "28px 32px",
          boxShadow: "0 4px 24px rgba(22,163,74,0.08)",
        }}>

          {/* Card header */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            marginBottom: "22px", paddingBottom: "16px",
            borderBottom: `1.5px solid ${C.border}`,
          }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: C.success, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <UserIcon />
            </div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: "700", color: C.text }}>Personal Information</div>
              <div style={{ fontSize: "0.75rem", color: C.textMuted }}>Used for order confirmation &amp; delivery</div>
            </div>
          </div>

          {/* First + Last */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            {[
              { field: "firstName", label: "First Name", placeholder: "John"  },
              { field: "lastName",  label: "Last Name",  placeholder: "Doe" },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label style={{ fontSize: "0.72rem", fontWeight: "700", color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                  {label} <span style={{ color: C.accent }}>*</span>
                </label>
                <input
                  type="text" placeholder={placeholder}
                  value={form[field]} onChange={set(field)}
                  onFocus={() => setFocusField(field)}
                  onBlur={() => { setFocusField(null); blur(field)(); }}
                  style={inputStyle(field)}
                />
                {errors[field] && touched[field] && (
                  <p style={{ fontSize: "0.73rem", color: C.errorText, margin: "5px 0 0 2px", animation: "slideDown 0.15s ease" }}>
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Email */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "0.72rem", fontWeight: "700", color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
              Email Address <span style={{ color: C.accent }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="email" placeholder="johndoe@example.com"
                value={form.email} onChange={set("email")}
                onFocus={() => setFocusField("email")}
                onBlur={() => { setFocusField(null); blur("email")(); }}
                style={{ ...inputStyle("email"), paddingLeft: "40px" }}
              />
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <MailIcon />
              </span>
            </div>
            {errors.email && touched.email && (
              <p style={{ fontSize: "0.73rem", color: C.errorText, margin: "5px 0 0 2px", animation: "slideDown 0.15s ease" }}>{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: "700", color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
              Phone Number <span style={{ color: C.accent }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="tel" placeholder="98765 XXXXX"
                maxLength={10}
                value={form.phone} onChange={set("phone")}
                onFocus={() => setFocusField("phone")}
                onBlur={() => { setFocusField(null); blur("phone")(); }}
                style={{ ...inputStyle("phone"), paddingLeft: "40px" }}
              />
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <PhoneIcon />
              </span>
            </div>
            {errors.phone && touched.phone && (
              <p style={{ fontSize: "0.73rem", color: C.errorText, margin: "5px 0 0 2px", animation: "slideDown 0.15s ease" }}>{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Privacy note */}
        <p style={{
          textAlign: "center", fontSize: "0.73rem", color: C.textMuted,
          marginTop: "14px", display: "flex", alignItems: "center",
          justifyContent: "center", gap: "5px",
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Your info is safe. We never share or sell your data.
        </p>
      </main>

      {/* Sticky footer */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderTop: `1px solid ${C.border}`,
        padding: "14px 32px",
        display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.06)", zIndex: 200,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "transparent", border: "1.5px solid #e5e7eb",
            borderRadius: "10px", padding: "12px 22px",
            fontSize: "0.9rem", fontWeight: "600", color: C.textMuted,
            cursor: "pointer", transition: "border-color 0.15s, color 0.15s",
            fontFamily: "system-ui, sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.textMid; e.currentTarget.style.color = C.text; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = C.textMuted; }}
        >
          ← Back
        </button>

        <button
          className="uip-next-btn"
          onClick={handleNext}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
            color: "#fff", border: "none", borderRadius: "10px",
            padding: "13px 28px", fontSize: "0.92rem", fontWeight: "700",
            cursor: "pointer", boxShadow: "0 4px 16px rgba(22,163,74,0.3)",
            transition: "opacity 0.15s, transform 0.15s",
            letterSpacing: "0.01em", fontFamily: "system-ui, sans-serif",
          }}
        >
          Next Step <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}