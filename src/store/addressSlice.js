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
      // auto-select the first address ever added
      
      if (state.savedAddresses.length === 1) {
        state.selectedAddressId = action.payload.id;
      }
    },
    removeAddress: (state, action) => {
      state.savedAddresses = state.savedAddresses.filter(a => a.id !== action.payload);
      // if the deleted one was selected, clear or fall back to first remaining

      if (state.selectedAddressId === action.payload) {
        state.selectedAddressId = state.savedAddresses[0]?.id ?? null;
      }
    },
    selectAddress: (state, action) => {
      state.selectedAddressId = action.payload;
    },
    clearAddresses: (state) => {
      state.savedAddresses   = [];
      state.selectedAddressId = null;
    },
  },
});

export const { addAddress, removeAddress, selectAddress, clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;