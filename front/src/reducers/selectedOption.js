import { createSlice } from "@reduxjs/toolkit";

const selectedOptionSlice = createSlice({
    name: "selectedOption",
    initialState: { selectedOption: "Todos" },
    reducers: {
        setSelectedOption: (state, action) => {
            state.selectedOption = action.payload;
        },
    },
});

export const { setSelectedOption } = selectedOptionSlice.actions;
export default selectedOptionSlice.reducer;
