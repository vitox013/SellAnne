import { createSlice } from "@reduxjs/toolkit";

const currentUserSlice = createSlice({
    name: "currentUser",
    initialState: { userId: null },
    reducers: {
        setCurrentUser: (state, action) => {
            const { userId } = action.payload;
            state.userId = userId;
        },
    },
});

export const { setCurrentUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;

export const selectCurrentUser = (state) => state.currentUser.userId;
