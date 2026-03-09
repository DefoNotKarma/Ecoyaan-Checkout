import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    cartItems: [{
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
    ],
    shipping_fee: 50,
    discount_applied: 0
  };

  return NextResponse.json(data);
}