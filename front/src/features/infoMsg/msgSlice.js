import { createSlice } from "@reduxjs/toolkit";

const msgSlice = createSlice({
    name: "infoMsg",
    initialState: { msg: "" },
    reducers: {
        setMsg: (state, action) => {
            state.msg = action.payload;
        },
        clearMsg: (state) => {
            state.msg = "";
        },
    },
});

export const { setMsg, clearMsg } = msgSlice.actions;

export default msgSlice.reducer;
