import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    opcoesForn: [],
};

const opcoesFornSlice = createSlice({
    name: "opcoesForn",
    initialState,
    reducers: {
        setOpcoesFornecedores(state, action) {
            state.opcoesForn = action.payload;
        },
    },
});

export const { setOpcoesFornecedores } = opcoesFornSlice.actions;
export default opcoesFornSlice.reducer;
