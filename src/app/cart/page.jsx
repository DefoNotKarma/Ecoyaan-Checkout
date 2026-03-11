"use client";
import { useEffect, useState } from "react";
import EcoyaanHeader from "./components/header";
import UserInfoPage from "./components/body";


export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => setCart(data));
  }, []);

  if (!cart) return <div className="p-10 text-xl">Loading cart...</div>;

  const subtotal = cart.cartItems.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0
  );

  const total = subtotal + cart.shipping_fee - cart.discount_applied;

  return (


    <div className="w-full mx-auto ">

      
    <div>
      <EcoyaanHeader />
 

      <div>
        <UserInfoPage /> <br />

      </div>

    </div>



    </div>
  );
}