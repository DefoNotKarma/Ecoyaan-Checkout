import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    method:   "card",   // "card" | "upi" | "netbanking" | "cod"
    cardNumber:   "",
    cardExpiry:   "",
    cardCvv:      "",
    cardName:     "",
    upiId:        "",
    bank:         "",
  },
  reducers: {
    setPaymentMethod: (state, action) => { state.method = action.payload; },
    setPaymentField:  (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearPayment: () => ({
      method: "card", cardNumber: "", cardExpiry: "",
      cardCvv: "", cardName: "", upiId: "", bank: "",
    }),
  },
});

export const { setPaymentMethod, setPaymentField, clearPayment } = paymentSlice.actions;
export default paymentSlice.reducer;