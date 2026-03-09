"use client";
import { useState, useRef, useEffect } from "react";

/* ── Icons ── */
const LeafIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <path d="M6 22C6 22 8 12 18 8C22 6.5 24 6 24 6C24 6 23.5 8 22 12C18 22 6 22 6 22Z"
      fill="#16a34a" stroke="#15803d" strokeWidth="1.2" />
    <path d="M6 22C8 18 12 15 16 13" stroke="#bbf7d0" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SearchIcon = ({ color = "#9ca3af" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#16a34a" : "none"} stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── Data ── */
const NAV_LINKS = ["All Products", "Personal Care", "Kitchen & Home", "Baby & Kids", "Offers"];
const SUGGESTIONS = ["Natural Sanitary Pads", "Bamboo Toothbrush", "Reusable Water Bottle", "Organic Cotton Tote", "Biodegradable Soap"];

/* ── useBreakpoint hook ── */
function useBreakpoint() {
  const getBreakpoint = () => {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    if (w >= 1024) return "desktop";
    if (w >= 768) return "tablet";
    return "mobile";
  };
  const [bp, setBp] = useState(getBreakpoint);
  useEffect(() => {
    const handle = () => setBp(getBreakpoint());
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return bp;
}

/* ── Main Component ── */
export default function EcoyaanHeader() {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  const isDesktop = bp === "desktop";

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [heartFilled, setHeartFilled] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const locationRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const filtered = SUGGESTIONS.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    const handler = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) setLocationOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) setMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!isMobile) { setMobileMenuOpen(false); setMobileSearchOpen(false); }
  }, [isMobile]);

  /* ── Shared: Icon Button ── */
  const IconBtn = ({ onClick, title, children, active = false }) => (
    <button onClick={onClick} title={title} style={{
      border: "1.5px solid #d1fae5", borderRadius: "50%",
      width: isMobile ? "36px" : "40px", height: isMobile ? "36px" : "40px",
      background: active ? "#dcfce7" : "#f0fdf4",
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, transition: "background 0.15s, transform 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "#dcfce7"; e.currentTarget.style.transform = "scale(1.05)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = active ? "#dcfce7" : "#f0fdf4"; e.currentTarget.style.transform = "scale(1)"; }}
    >{children}</button>
  );

  /* ── Shared: Search Bar ── */
  const SearchBar = ({ fullWidth = false }) => (
    <div style={{ position: "relative", ...(fullWidth ? { width: "100%" } : { flex: 1 }) }}>
      <div style={{
        border: searchFocused ? "1.5px solid #16a34a" : "1.5px solid #e5e7eb",
        borderRadius: "12px", background: searchFocused ? "#fff" : "#f9fafb",
        display: "flex", alignItems: "center", padding: "0 14px", gap: "10px",
        transition: "border 0.2s, background 0.2s, box-shadow 0.2s",
        boxShadow: searchFocused ? "0 0 0 3px rgba(22,163,74,0.1)" : "none",
      }}>
        <SearchIcon />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
          placeholder={isMobile ? "Search products…" : "Search for 'Natural Sanitary Pads'"}
          style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "0.9rem", color: "#111827", padding: "10px 0" }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} style={{
            background: "#e5e7eb", border: "none", borderRadius: "50%",
            width: "20px", height: "20px", cursor: "pointer", fontSize: "0.7rem",
            color: "#6b7280", display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        )}
      </div>

      {searchFocused && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "#fff", border: "1.5px solid #d1fae5", borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(22,163,74,0.12)", overflow: "hidden", zIndex: 100,
        }}>
          {(searchQuery ? filtered : SUGGESTIONS).map((s, i) => (
            <button key={i} onClick={() => setSearchQuery(s)} style={{
              display: "flex", alignItems: "center", gap: "10px", width: "100%",
              padding: "10px 16px", background: "none", border: "none",
              borderBottom: i < SUGGESTIONS.length - 1 ? "1px solid #f0fdf4" : "none",
              cursor: "pointer", fontSize: "0.875rem", color: "#374151", textAlign: "left",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              <SearchIcon />{s}
            </button>
          ))}
          {searchQuery && filtered.length === 0 && (
            <div style={{ padding: "12px 16px", color: "#9ca3af", fontSize: "0.85rem" }}>
              No results for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );


const DeliveryBadge = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <style>{`
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(22,163,74,0.25); }
          50%       { box-shadow: 0 0 0 6px rgba(22,163,74,0); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .delivery-badge {
          animation: badgePulse 2.5s ease-in-out infinite;
        }
        .delivery-text {
          animation: fadeSlideIn 0.4s ease forwards;
        }
      `}</style>

      <div
        className="delivery-badge"
        onClick={() => setExpanded(v => !v)}
        style={{
          border: "1.5px solid #bbf7d0",
          borderRadius: "10px",
          padding: "6px 12px",
          background: "#f0fdf4",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
          cursor: "pointer",
        }}
      >
        {/* Pulsing green dot */}
        <div style={{ position: "relative", width: "8px", height: "8px", flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: "#16a34a", borderRadius: "50%" }} />
          <div style={{ position: "absolute", inset: "-3px", background: "rgba(22,163,74,0.2)", borderRadius: "50%", animation: "badgePulse 2s ease-in-out infinite" }} />
        </div>

        {/* Text */}
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "0.58rem", color: "#16a34a", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Eco Express
          </div>
          {expanded && (
            <div className="delivery-text" style={{ fontSize: "0.78rem", fontWeight: "700", color: "#111827", whiteSpace: "nowrap" }}>
              🌿 Delivers in 2 days
            </div>
          )}
        </div>
      </div>
    </>
  );
};

  /* ── Nav Links ── */
  const NavLinks = ({ compact = false }) => (
    <div style={{ display: "flex", ...(compact ? { flexDirection: "column" } : { overflowX: "auto" }) }}>
      {NAV_LINKS.map((item, i) => (
        <a key={item} href="#"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            ...(compact
              ? { display: "block", padding: "13px 20px", borderBottom: i < NAV_LINKS.length - 1 ? "1px solid #f0fdf4" : "none", background: i === 0 ? "#f0fdf4" : "transparent" }
              : { padding: "9px 14px", borderBottom: i === 0 ? "2px solid #16a34a" : "2px solid transparent", whiteSpace: "nowrap" }),
            textDecoration: "none",
            fontSize: compact ? "0.9rem" : "0.82rem",
            fontWeight: i === 0 ? "600" : "500",
            color: i === 0 ? "#16a34a" : "#374151",
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => { if (i !== 0 && !compact) { e.currentTarget.style.color = "#16a34a"; e.currentTarget.style.borderBottomColor = "#86efac"; } }}
          onMouseLeave={e => { if (i !== 0 && !compact) { e.currentTarget.style.color = "#374151"; e.currentTarget.style.borderBottomColor = "transparent"; } }}
        >
          {item}
          {item === "Offers" && (
            <span style={{ marginLeft: "6px", background: "#16a34a", color: "#fff", fontSize: "0.58rem", padding: "1px 5px", borderRadius: "999px", fontWeight: "700" }}>NEW</span>
          )}
        </a>
      ))}
    </div>
  );

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", width: "100%" }}>
      {/* ── Announcement bar ── */}
      <div style={{ background: "#f0fdf4", borderBottom: "1px solid #bbf7d0", textAlign: "center", padding: "6px 12px" }}>
        <span style={{ color: "#15803d", fontWeight: "500", fontSize: isMobile ? "0.7rem" : "0.82rem" }}>
          {isMobile
            ? "🌿 Code ECO10 → 10% off your first order"
            : "🌿 Free delivery on orders above ₹499 · Use code ECO10 for 10% off your first order"}
        </span>
      </div>

      <header style={{ background: "#fff", boxShadow: "0 2px 16px rgba(22,163,74,0.07)", borderBottom: "1.5px solid #d1fae5", width: "100%" }}>

        {/* ══════════ MOBILE (< 768px) ══════════ */}
        {isMobile && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px" }}>
              <button onClick={() => setMobileMenuOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", flexShrink: 0 }}>
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>

              <a href="/" style={{ display: "flex", alignItems: "center", gap: "7px", textDecoration: "none", flex: 1 }}>
                <div style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", borderRadius: "8px", padding: "4px" }}>
                  <LeafIcon size={24} />
                </div>
                <span style={{ fontFamily: "Georgia,serif", fontWeight: "700", fontSize: "1.1rem", color: "#16a34a" }}>Ecoyaan</span>
              </a>

              <IconBtn onClick={() => setMobileSearchOpen(v => !v)} title="Search" active={mobileSearchOpen}>
                <SearchIcon color="#16a34a" />
              </IconBtn>
              <IconBtn title="Account"><UserIcon /></IconBtn>
              <IconBtn onClick={() => setHeartFilled(v => !v)} title="Wishlist" active={heartFilled}>
                <HeartIcon filled={heartFilled} />
              </IconBtn>
            </div>

            {mobileSearchOpen && (
              <div style={{ padding: "0 14px 12px" }}>
                <SearchBar fullWidth />
              </div>
            )}

            {mobileMenuOpen && (
              <div ref={mobileMenuRef} style={{ borderTop: "1px solid #f0fdf4", background: "#fafffe" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0fdf4" }}>
                  <DeliveryBadge inMenu />
                </div>
                <NavLinks compact />
              </div>
            )}
          </>
        )}

        {/* ══════════ TABLET (768px – 1023px) ══════════ */}
        {isTablet && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 20px" }}>
              <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
                <div style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", borderRadius: "9px", padding: "5px" }}>
                  <LeafIcon size={26} />
                </div>
                <div>
                  <div style={{ fontFamily: "Georgia,serif", fontWeight: "700", fontSize: "1.15rem", color: "#16a34a" }}>Ecoyaan</div>
                  <div style={{ fontSize: "0.6rem", color: "#6b7280" }}>Sustainability made easy</div>
                </div>
              </a>

              <SearchBar />

              <DeliveryBadge />
              <IconBtn title="Account"><UserIcon /></IconBtn>
              <IconBtn onClick={() => setHeartFilled(v => !v)} title="Wishlist" active={heartFilled}>
                <HeartIcon filled={heartFilled} />
              </IconBtn>
            </div>

            <nav style={{ borderTop: "1px solid #f0fdf4", background: "#fafffe" }}>
              <div style={{ padding: "0 20px" }}>
                <NavLinks />
              </div>
            </nav>
          </>
        )}

        {/* ══════════ DESKTOP (≥ 1024px) ══════════ */}
        {isDesktop && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "0 24px", height: "64px" }}>
              <a href="/" style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none", flexShrink: 0 }}>
                <div style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", borderRadius: "10px", padding: "5px", transition: "transform 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <LeafIcon size={28} />
                </div>
                <div>
                  <div style={{ fontFamily: "Georgia,serif", fontWeight: "700", fontSize: "1.25rem", color: "#16a34a", letterSpacing: "-0.01em" }}>Ecoyaan</div>
                  <div style={{ fontSize: "0.65rem", color: "#6b7280", letterSpacing: "0.04em" }}>Sustainability made easy</div>
                </div>
              </a>

              <DeliveryBadge />
              <SearchBar />
              <IconBtn title="Account"><UserIcon /></IconBtn>
              <IconBtn onClick={() => setHeartFilled(v => !v)} title="Wishlist" active={heartFilled}>
                <HeartIcon filled={heartFilled} />
              </IconBtn>
            </div>

            <nav style={{ borderTop: "1px solid #f0fdf4", background: "#fafffe" }}>
              <div style={{ padding: "0 24px" }}>
                <NavLinks />
              </div>
            </nav>
          </>
        )}
      </header>
    </div>
  );
}