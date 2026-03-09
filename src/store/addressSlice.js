import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    savedAddresses: [],
    selectedAddressId: null,
  },
  reducers: {
    addAddress: (state, action) => {
      state.savedAddresses.push(action.payload);
      state.selectedAddressId = action.payload.id;
    },
    removeAddress: (state, action) => {
      state.savedAddresses = state.savedAddresses.filter(a => a.id !== action.payload);
      if (state.selectedAddressId === action.payload) {
        state.selectedAddressId = state.savedAddresses[0]?.id ?? null;
      }
    },
    selectAddress: (state, action) => {
      state.selectedAddressId = action.payload;
    },
  },
});

export const { addAddress, removeAddress, selectAddress } = addressSlice.actions;
export default addressSlice.reducer;