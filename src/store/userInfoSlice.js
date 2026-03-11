import { createSlice } from "@reduxjs/toolkit";

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
  reducers: {
    setUserInfo: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearUserInfo: () => ({
      firstName: "", lastName: "", email: "", phone: "",
    }),
  },
});

export const { setUserInfo, clearUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;