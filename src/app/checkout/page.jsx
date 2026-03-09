"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import EcoyaanHeader from "../cart/components/header";

export default function CheckoutPage() {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [ready, setReady] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const { savedAddresses } = useSelector(s => s.address);

  useEffect(() => {
    const raw = sessionStorage.getItem("pendingOrder");
    if (!raw) return;
    setOrder(JSON.parse(raw));
    sessionStorage.removeItem("pendingOrder");
    setReady(true);
  }, []);

  if (!ready || !order) return null;

  const fmtINR = (n) => "₹" + n.toLocaleString("en-IN");
  const selectedAddress = savedAddresses.find(a => a.id === order.selectedAddressId);

  return (
    <div className="w-full mx-auto">

      <style>{`
        @keyframes partyPop {
          0%   { opacity: 0; transform: scale(0.8); }
          60%  { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .checkout-place-btn:hover {
          opacity: 0.9 !important;
          transform: translateY(-1px) !important;
        }
        .checkout-back-btn:hover {
          background: #f9fafb !important;
        }
      `}</style>

      {/* site header */}
      <EcoyaanHeader />

      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", maxWidth: "640px", margin: "0 auto", padding: "32px 20px" }}>

        <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginBottom: "28px", letterSpacing: "-0.02em" }}>
          Checkout
        </h1>

        {/* delivery address card */}
        <section style={{ marginBottom: "24px", background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: "12px", padding: "16px 18px" }}>
          <p style={{ fontSize: "0.78rem", fontWeight: "700", color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
            Delivering to
          </p>
          {selectedAddress ? (
            <>
              <p style={{ fontSize: "0.95rem", fontWeight: "700", color: "#111827", marginBottom: "2px" }}>{selectedAddress.alias}</p>
              <p style={{ fontSize: "0.88rem", color: "#374151" }}>{selectedAddress.line}, {selectedAddress.city} — {selectedAddress.pincode}</p>
            </>
          ) : (
            <p style={{ fontSize: "0.88rem", color: "#9ca3af" }}>Address not found.</p>
          )}
        </section>

        {/* order items list */}
        <section style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#111827", marginBottom: "12px" }}>Order Items</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {order.items.map(item => (
              <div key={item.product_id} style={{ display: "flex", alignItems: "center", gap: "14px", animation: "fadeSlideIn 0.3s ease" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "8px", overflow: "hidden", background: "#f3f4f6", flexShrink: 0 }}>
                  <img src={item.image} alt={item.product_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.88rem", fontWeight: "600", color: "#111827", marginBottom: "2px" }}>{item.product_name}</p>
                  <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>Qty: {item.quantity} × {fmtINR(item.product_price)}</p>
                </div>
                <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "#111827" }}>
                  {fmtINR(item.product_price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* price breakdown */}
        <section style={{ borderTop: "1.5px solid #e5e7eb", paddingTop: "18px", marginBottom: "28px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.88rem", color: "#6b7280" }}>Subtotal</span>
            <span style={{ fontSize: "0.88rem", color: "#111827", fontWeight: "500" }}>{fmtINR(order.subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.88rem", color: "#6b7280" }}>Delivery</span>
            <span style={{ fontSize: "0.88rem", color: order.shipping_fee === 0 ? "#16a34a" : "#111827", fontWeight: "600" }}>
              {order.shipping_fee === 0 ? "Free ✓" : fmtINR(order.shipping_fee)}
            </span>
          </div>
          {order.couponDiscount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.88rem", color: "#6b7280" }}>
                Promo{" "}
                <span style={{ fontSize: "0.72rem", fontWeight: "700", background: "#dcfce7", color: "#15803d", padding: "1px 7px", borderRadius: "4px" }}>
                  {order.appliedCoupon}
                </span>
              </span>
              <span style={{ fontSize: "0.88rem", color: "#16a34a", fontWeight: "700" }}>− {fmtINR(order.couponDiscount)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1.5px solid #e5e7eb", paddingTop: "12px", marginTop: "4px" }}>
            <span style={{ fontSize: "1rem", fontWeight: "700", color: "#111827" }}>Total</span>
            <span style={{ fontSize: "1.05rem", fontWeight: "700", color: "#111827" }}>{fmtINR(order.total)}</span>
          </div>
        </section>

        {/* place order button — swaps to confirmation card on click */}
        {ordered ? (
          <div style={{
            width: "100%", borderRadius: "12px", padding: "24px 20px",
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
            border: "1.5px solid #bbf7d0", textAlign: "center",
            animation: "partyPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            boxSizing: "border-box",
          }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>🎉</div>
            <p style={{ fontSize: "1rem", fontWeight: "700", color: "#15803d", marginBottom: "4px" }}>Order Placed!</p>
            <p style={{ fontSize: "0.82rem", color: "#16a34a" }}>We'll deliver your eco goodies in 2 days 🌿</p>
          </div>
        ) : (
          <button
            className="checkout-place-btn"
            onClick={() => setOrdered(true)}
            style={{
              width: "100%", background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              color: "#fff", border: "none", borderRadius: "12px",
              padding: "15px", fontSize: "1rem", fontWeight: "700",
              cursor: "pointer", letterSpacing: "0.01em",
              boxShadow: "0 4px 14px rgba(22,163,74,0.25)",
              transition: "opacity 0.15s, transform 0.15s",
            }}
          >
            Place Order · {fmtINR(order.total)}
          </button>
        )}

        {/* back to cart — hidden once order is placed */}
        {
          <button
            className="checkout-back-btn"
            onClick={() => router.back()}
            style={{
              width: "100%", marginTop: "12px", background: "transparent",
              border: "1.5px solid #e5e7eb", borderRadius: "12px",
              padding: "12px", fontSize: "0.9rem", fontWeight: "500",
              color: "#6b7280", cursor: "pointer", transition: "background 0.15s",
            }}
          >
            ← Back to Cart
          </button>
        }

      </div>
    </div>
  );
}