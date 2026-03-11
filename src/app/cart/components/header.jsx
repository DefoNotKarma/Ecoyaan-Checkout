"use client";
import { useState, useRef, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════════
   PRECOMPUTED GLITTER
══════════════════════════════════════════════ */
const PARTICLE_COUNT = 48;
const GLITTER_COLORS = ["#22c55e","#f97316","#facc15","#a78bfa","#38bdf8","#f472b6","#4ade80","#fb923c","#e879f9","#fbbf24"];
const GLITTER_SHAPES = ["●","■","◆","▲","★","✦","⬟","✿"];
const SPEED_TIERS    = [3.2, 4.8, 6.4, 8.0, 9.6];
const SIZE_TIERS     = [7, 9, 11, 13];

const PRECOMP = Object.freeze(
  Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * 2 * Math.PI;
    const speed = SPEED_TIERS[i % SPEED_TIERS.length];
    return Object.freeze({
      vx:    Math.cos(angle) * speed,
      vy:    Math.sin(angle) * speed - 4.5,
      color: GLITTER_COLORS[i % GLITTER_COLORS.length],
      size:  SIZE_TIERS[i % SIZE_TIERS.length],
      shape: GLITTER_SHAPES[i % GLITTER_SHAPES.length],
      rot0:  (i / PARTICLE_COUNT) * 360,
    });
  })
);
const GRAVITY = 0.38, DRAG = 0.967, FADE = 0.0175;

function playDing() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(1046.5, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.1);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 1.15);
  } catch (_) {}
}

/* ══════════════════════════════════════════════
   useGlitter
══════════════════════════════════════════════ */
function useGlitter() {
  const canvasRef     = useRef(null);
  const rafRef        = useRef(null);
  const toastTimer    = useRef(null);
  const liveParticles = useRef([]);
  const btnRef        = useRef(null);
  const [toastVisible, setToastVisible] = useState(false);

  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let anyAlive = false;
    for (const p of liveParticles.current) {
      p.vx *= DRAG; p.vy = p.vy * DRAG + GRAVITY;
      p.x += p.vx; p.y += p.vy; p.op -= FADE; p.rot += p.vx * 2.8;
      if (p.op <= 0) continue;
      anyAlive = true;
      ctx.save();
      ctx.globalAlpha = p.op;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.shape, -p.size * 0.5, p.size * 0.5);
      ctx.restore();
    }
    if (anyAlive) rafRef.current = requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const launch = useCallback(() => {
    playDing();
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3000);
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const canvas = canvasRef.current;
    if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    liveParticles.current = PRECOMP.map(p => ({
      x: cx, y: cy, vx: p.vx, vy: p.vy,
      op: 1, rot: p.rot0, color: p.color, size: p.size, shape: p.shape,
    }));
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    clearTimeout(toastTimer.current);
  }, []);

  return { canvasRef, btnRef, launch, toastVisible };
}

/* ══════════════════════════════════════════════
   COLOR TOKENS
══════════════════════════════════════════════ */
const C = {
  primary: "#16a34a", primaryBold: "#15803d", primaryLight: "#22c55e",
  bg: "#f0fdf4", border: "#bbf7d0", borderStrong: "#86efac",
  text: "#111827", textMid: "#374151", textMuted: "#6b7280",
  accent: "#f97316", success: "#dcfce7",
  yellow: "#fde047", yellowBg: "#fefce8", yellowDark: "#854d0e",
};

const NAV_LINKS   = ["All Products", "Personal Care", "Kitchen & Home", "Baby & Kids", "Offers"];
const SUGGESTIONS = ["Natural Sanitary Pads", "Bamboo Toothbrush", "Reusable Water Bottle", "Organic Cotton Tote", "Biodegradable Soap"];

/* ══════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════ */
const LeafIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <path d="M6 22C6 22 8 12 18 8C22 6.5 24 6 24 6C24 6 23.5 8 22 12C18 22 6 22 6 22Z" fill="#16a34a" stroke="#15803d" strokeWidth="1.2"/>
    <path d="M6 22C8 18 12 15 16 13" stroke="#bbf7d0" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const SearchIcon = ({ color = "#9ca3af" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? C.primaryLight : "none"} stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.textMid} strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.textMid} strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ══════════════════════════════════════════════
   EcoyaanHeader  — single render tree, CSS does the responsive work
══════════════════════════════════════════════ */
export default function EcoyaanHeader() {
  const [searchQuery,      setSearchQuery]      = useState("");
  const [searchFocused,    setSearchFocused]    = useState(false);
  const [heartFilled,      setHeartFilled]      = useState(false);
  const [mobileMenuOpen,   setMobileMenuOpen]   = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [deliveryExpanded, setDeliveryExpanded] = useState(true);

  const mobileMenuRef = useRef(null);
  const { canvasRef, btnRef: glitterBtnRef, launch: launchGlitter, toastVisible } = useGlitter();

  const filteredSuggestions = SUGGESTIONS.filter(s =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target))
        setMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", width: "100%" }}>
      <style>{`
        /* ── Breakpoints ── */
        /* mobile-first: < 768px = mobile, 768–1023 = tablet, 1024+ = desktop */

        .eh-hamburger   { display: flex; }
        .eh-logo-sub    { display: none; }
        .eh-delivery    { display: none; }
        .eh-search-bar  { display: none; }
        .eh-glitter-lbl { display: none; }
        .eh-nav         { display: none; }
        .eh-mob-search-row { display: none; }

        @media (min-width: 768px) {
          .eh-hamburger      { display: none; }
          .eh-logo-sub       { display: block; }
          .eh-delivery       { display: flex; }
          .eh-search-bar     { display: flex; }
          .eh-glitter-lbl    { display: inline; }
          .eh-nav            { display: flex; }
          .eh-mob-search-btn { display: none !important; }
          .eh-mob-search-row { display: none !important; }
        }

        /* ── Base icon btn ── */
        .eh-icon-btn {
          border: 1.5px solid ${C.border};
          border-radius: 50%;
          width: 36px; height: 36px;
          background: ${C.bg};
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s, transform 0.15s, border-color 0.15s;
        }
        @media (min-width: 768px) {
          .eh-icon-btn { width: 40px; height: 40px; }
        }
        .eh-icon-btn:hover {
          background: ${C.success} !important;
          transform: scale(1.07);
          border-color: ${C.borderStrong};
        }
        .eh-icon-btn.active {
          background: ${C.success};
          border-color: ${C.borderStrong};
        }

        /* ── Glitter btn ── */
        .eh-glitter-btn {
          display: flex; align-items: center; gap: 5px;
          background: ${C.yellowBg};
          border: 1.5px solid ${C.yellow};
          border-radius: 10px;
          padding: 6px 10px;
          font-size: 0.75rem; font-weight: 700;
          color: ${C.yellowDark};
          cursor: pointer; flex-shrink: 0;
          transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
          animation: glitterPulse 2.8s ease-in-out infinite;
          font-family: system-ui, sans-serif;
        }
        @media (min-width: 768px) {
          .eh-glitter-btn { padding: 7px 13px; font-size: 0.8rem; }
        }
        .eh-glitter-btn:hover  { background: #fef9c3 !important; transform: scale(1.06); box-shadow: 0 4px 12px rgba(250,204,21,0.4); }
        .eh-glitter-btn:active { transform: scale(0.94); }

        /* ── Search ── */
        .eh-search-wrap {
          position: relative;
          flex: 1;
        }
        .eh-search-inner {
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          background: #f9fafb;
          display: flex; align-items: center;
          padding: 0 14px; gap: 10px;
          transition: border 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .eh-search-inner.focused {
          border-color: ${C.primary};
          background: #fff;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.12);
        }
        .eh-search-input {
          flex: 1; border: none; background: transparent; outline: none;
          font-size: 0.9rem; color: ${C.text}; padding: 10px 0;
          font-family: system-ui, sans-serif;
        }
        .eh-search-clear {
          background: #e5e7eb; border: none; border-radius: 50%;
          width: 20px; height: 20px; cursor: pointer; font-size: 0.7rem;
          color: ${C.textMuted}; display: flex; align-items: center; justify-content: center;
        }
        .eh-search-dropdown {
          position: absolute; top: calc(100% + 6px); left: 0; right: 0;
          background: #fff; border: 1.5px solid ${C.border}; border-radius: 12px;
          box-shadow: 0 8px 32px rgba(22,163,74,0.12); overflow: hidden; z-index: 200;
        }
        .eh-suggestion {
          display: flex; align-items: center; gap: 10px; width: 100%;
          padding: 10px 16px; background: none; border: none;
          cursor: pointer; font-size: 0.875rem; color: ${C.textMid}; text-align: left;
          font-family: system-ui, sans-serif;
        }
        .eh-suggestion:hover { background: ${C.bg}; }
        .eh-suggestion + .eh-suggestion { border-top: 1px solid ${C.bg}; }

        /* ── Delivery badge ── */
        .eh-delivery-badge {
          border: 1.5px solid ${C.border};
          border-radius: 10px; padding: 6px 12px;
          background: ${C.bg};
          display: flex; align-items: center; gap: 8px;
          flex-shrink: 0; cursor: pointer;
          transition: border-color 0.15s;
        }
        .eh-delivery-badge:hover { border-color: ${C.borderStrong}; }

        /* ── Nav ── */
        .eh-nav-link {
          padding: 10px 14px;
          border-bottom: 2.5px solid transparent;
          white-space: nowrap;
          text-decoration: none;
          font-size: 0.82rem; font-weight: 500;
          color: ${C.textMid};
          transition: color 0.15s, border-color 0.15s;
          font-family: system-ui, sans-serif;
        }
        .eh-nav-link.active-link { color: ${C.primary}; border-bottom-color: ${C.primary}; font-weight: 700; }
        .eh-nav-link:hover       { color: ${C.primary}; border-bottom-color: ${C.borderStrong}; }

        /* ── Mobile menu ── */
        .eh-mobile-menu {
          border-top: 1px solid ${C.bg};
          background: #fafffe;
        }
        .eh-mobile-nav-link {
          display: block; padding: 13px 20px;
          text-decoration: none;
          font-size: 0.9rem; font-weight: 500;
          color: ${C.textMid};
          border-bottom: 1px solid ${C.bg};
          font-family: system-ui, sans-serif;
          transition: background 0.15s;
        }
        .eh-mobile-nav-link.active-link { color: ${C.primary}; background: ${C.bg}; font-weight: 700; }
        .eh-mobile-nav-link:hover       { background: ${C.bg}; }
        .eh-mobile-nav-link:last-child  { border-bottom: none; }

        /* ── Logo hover ── */
        .eh-logo-icon { transition: transform 0.2s; }
        .eh-logo-icon:hover { transform: scale(1.06) rotate(-3deg); }

        /* ── Keyframes ── */
        @keyframes badgePulse {
          0%,100% { transform: scale(1);   opacity: 0.8; }
          50%      { transform: scale(1.9); opacity: 0;   }
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glitterPulse {
          0%,100% { box-shadow: 0 0 0 0   rgba(250,204,21,0);    }
          50%      { box-shadow: 0 0 0 5px rgba(250,204,21,0.3); }
        }
        @keyframes toastUp {
          from { opacity: 0; transform: translateX(-50%) translateY(14px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Canvas + Toast — always rendered, never conditional */}
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999 }} />
      {toastVisible && (
        <div style={{
          position: "fixed", bottom: "28px", left: "50%",
          transform: "translateX(-50%)",
          background: `linear-gradient(135deg, ${C.primaryBold} 0%, ${C.primaryLight} 100%)`,
          color: "#fff", padding: "13px 24px", borderRadius: "14px",
          fontSize: "0.9rem", fontWeight: "600",
          boxShadow: "0 8px 32px rgba(22,163,74,0.35)",
          display: "flex", alignItems: "center", gap: "10px",
          zIndex: 9998, whiteSpace: "nowrap",
          animation: "toastUp 0.3s ease", pointerEvents: "none",
        }}>
          <span style={{ fontSize: "1.1rem" }}>✨</span>
          Cheers for making it greener here!
        </div>
      )}

      <header style={{ background: "#fff", boxShadow: "0 2px 20px rgba(22,163,74,0.09)", borderBottom: `1.5px solid ${C.border}`, width: "100%" }}>

        {/* ── Single top row — CSS controls what's visible at each bp ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", height: "64px" }}>

          {/* Hamburger — visible only on mobile via CSS */}
          <button
            className="eh-hamburger"
            onClick={() => setMobileMenuOpen(v => !v)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", flexShrink: 0 }}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          {/* Logo */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
            <div className="eh-logo-icon" style={{ background: `linear-gradient(135deg, ${C.success}, ${C.border})`, borderRadius: "10px", padding: "5px" }}>
              <LeafIcon size={26} />
            </div>
            <div>
              <div style={{ fontFamily: "Georgia,serif", fontWeight: "700", fontSize: "1.15rem", color: C.primary, letterSpacing: "-0.01em", lineHeight: 1 }}>Ecoyaan</div>
              <div className="eh-logo-sub" style={{ fontSize: "0.62rem", color: C.textMuted, letterSpacing: "0.04em" }}>Sustainability made easy</div>
            </div>
          </a>

          {/* Delivery badge — hidden on mobile */}
          <div className="eh-delivery">
            <div className="eh-delivery-badge" onClick={() => setDeliveryExpanded(v => !v)}>
              <div style={{ position: "relative", width: "8px", height: "8px", flexShrink: 0 }}>
                <div style={{ position: "absolute", inset: 0, background: C.primary, borderRadius: "50%" }} />
                <div style={{ position: "absolute", inset: "-3px", background: "rgba(22,163,74,0.22)", borderRadius: "50%", animation: "badgePulse 2s ease-in-out infinite" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.58rem", color: C.primary, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Eco Express</div>
                {deliveryExpanded && (
                  <div style={{ fontSize: "0.78rem", fontWeight: "700", color: C.text, whiteSpace: "nowrap", animation: "fadeSlide 0.3s ease" }}>
                    🌿 Delivers in 2 days
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search bar — hidden on mobile, shown tablet+ */}
          <div className="eh-search-bar eh-search-wrap" style={{ flex: 1, minWidth: 0, position: "relative", width: "100%" }}>
            <div className={`eh-search-inner${searchFocused ? " focused" : ""}`} style={{ width: "100%" }}>
              <SearchIcon />
              <input
                className="eh-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                placeholder="Search for 'Natural Sanitary Pads'"
              />
              {searchQuery && (
                <button className="eh-search-clear" onClick={() => setSearchQuery("")}>✕</button>
              )}
            </div>
            {searchFocused && (
              <div className="eh-search-dropdown">
                {(searchQuery ? filteredSuggestions : SUGGESTIONS).map((s, i) => (
                  <button key={i} className="eh-suggestion" onClick={() => setSearchQuery(s)}>
                    <SearchIcon />{s}
                  </button>
                ))}
                {searchQuery && filteredSuggestions.length === 0 && (
                  <div style={{ padding: "12px 16px", color: C.textMuted, fontSize: "0.85rem" }}>
                    No results for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Glitter */}
          <button ref={glitterBtnRef} className="eh-glitter-btn" onClick={launchGlitter} title="Spread some green cheer!">
            ✨<span className="eh-glitter-lbl"> Glitter</span>
          </button>

          {/* Mobile search toggle — hidden on tablet+ */}
          <button
            className="eh-icon-btn eh-mob-search-btn"
            onClick={() => setMobileSearchOpen(v => !v)}
            title="Search"
            style={{ ...(mobileSearchOpen ? { background: C.success, borderColor: C.borderStrong } : {}) }}
          >
            <SearchIcon color={C.primary} />
          </button>

          {/* Account */}
          <button className="eh-icon-btn" title="Account"><UserIcon /></button>

          {/* Wishlist */}
          <button
            className={`eh-icon-btn${heartFilled ? " active" : ""}`}
            onClick={() => setHeartFilled(v => !v)}
            title="Wishlist"
          >
            <HeartIcon filled={heartFilled} />
          </button>
        </div>

        {/* Mobile search row */}
        {mobileSearchOpen && (
          <div className="eh-mob-search-row" style={{ padding: "0 14px 12px", display: "flex" }}>
            <div className="eh-search-wrap" style={{ width: "100%" }}>
              <div className={`eh-search-inner${searchFocused ? " focused" : ""}`}>
                <SearchIcon />
                <input
                  className="eh-search-input"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                  placeholder="Search products…"
                  autoFocus
                />
                {searchQuery && (
                  <button className="eh-search-clear" onClick={() => setSearchQuery("")}>✕</button>
                )}
              </div>
              {searchFocused && (
                <div className="eh-search-dropdown">
                  {(searchQuery ? filteredSuggestions : SUGGESTIONS).map((s, i) => (
                    <button key={i} className="eh-suggestion" onClick={() => { setSearchQuery(s); setMobileSearchOpen(false); }}>
                      <SearchIcon />{s}
                    </button>
                  ))}
                  {searchQuery && filteredSuggestions.length === 0 && (
                    <div style={{ padding: "12px 16px", color: C.textMuted, fontSize: "0.85rem" }}>
                      No results for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="eh-mobile-menu" ref={mobileMenuRef}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.bg}` }}>
              <div className="eh-delivery-badge" style={{ display: "inline-flex" }} onClick={() => setDeliveryExpanded(v => !v)}>
                <div style={{ position: "relative", width: "8px", height: "8px", flexShrink: 0 }}>
                  <div style={{ position: "absolute", inset: 0, background: C.primary, borderRadius: "50%" }} />
                  <div style={{ position: "absolute", inset: "-3px", background: "rgba(22,163,74,0.22)", borderRadius: "50%", animation: "badgePulse 2s ease-in-out infinite" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.58rem", color: C.primary, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Eco Express</div>
                  <div style={{ fontSize: "0.78rem", fontWeight: "700", color: C.text }}>🌿 Delivers in 2 days</div>
                </div>
              </div>
            </div>
            {NAV_LINKS.map((item, i) => (
              <a key={item} href="#" className={`eh-mobile-nav-link${i === 0 ? " active-link" : ""}`} onClick={() => setMobileMenuOpen(false)}>
                {item}
                {item === "Offers" && (
                  <span style={{ marginLeft: "6px", background: C.accent, color: "#fff", fontSize: "0.58rem", padding: "1px 6px", borderRadius: "999px", fontWeight: "800" }}>NEW</span>
                )}
              </a>
            ))}
          </div>
        )}

        {/* Desktop/tablet nav bar */}
        <nav className="eh-nav" style={{ borderTop: `1px solid ${C.bg}`, background: "#fafffe", overflowX: "auto", padding: "0 20px" }}>
          {NAV_LINKS.map((item, i) => (
            <a key={item} href="#" className={`eh-nav-link${i === 0 ? " active-link" : ""}`}>
              {item}
              {item === "Offers" && (
                <span style={{ marginLeft: "6px", background: C.accent, color: "#fff", fontSize: "0.58rem", padding: "1px 6px", borderRadius: "999px", fontWeight: "800" }}>NEW</span>
              )}
            </a>
          ))}
        </nav>

      </header>
    </div>
  );
}