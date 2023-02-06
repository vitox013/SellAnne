import { createSlice } from "@reduxjs/toolkit";

const clientsDataSlice = createSlice({
    name: "clientsData",
    initialState: { entities: [] },
    reducers: {
        setClientsData: (state, action) => {
            state.entities = action.payload;
        },
        
    },
});

export const { setClientsData } = clientsDataSlice.actions;

export default clientsDataSlice.reducer;

export const selectClientsData = (state) => state.clientsData.entities;
