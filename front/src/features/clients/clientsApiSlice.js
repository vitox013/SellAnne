import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const clientsAdapter = createEntityAdapter({});

const initialState = clientsAdapter.getInitialState();

export const clientsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getClients: builder.query({
            query: () => "/clients",
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError;
            },
            transformResponse: (responseData) => {
                const loadedClients = responseData.map((client) => {
                    client.id = client._id;
                    return client;
                });
                return clientsAdapter.setAll(initialState, loadedClients);
            },
            // providesTags: (result, error, arg) => {
            //     if (result?.ids) {
            //         return [
            //             { type: "Clients", id: "LIST" },
            //             ...result.ids.map((id) => ({ type: "Clients", id })),
            //         ];
            //     } else return [{ type: "Clients", id: "LIST" }];
            // },
        }),
        addNewClient: builder.mutation({
            query: (initialClientData) => ({
                url: "/clients",
                method: "POST",
                body: {
                    ...initialClientData,
                },
            }),
            invalidatesTags: [
                {
                    type: "Client",
                    id: "LIST",
                },
            ],
        }),
        updateClient: builder.mutation({
            query: (initialClientData) => ({
                url: "/clients",
                method: "PATCH",
                body: {
                    ...initialClientData,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Client", id: arg.id },
            ],
        }),
        deleteClient: builder.mutation({
            query: ({ id }) => ({
                url: `/clients`,
                method: "DELETE",
                body: { id },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Client", id: arg.id },
            ],
        }),
    }),
});

export const {
    useGetClientsQuery,
    useAddNewClientMutation,
    useDeleteClientMutation,
    useUpdateClientMutation,
} = clientsApiSlice;

// returns the query result object
export const selectClientsResult =
    clientsApiSlice.endpoints.getClients.select();

// creates memoized selector
const selectClientsData = createSelector(
    selectClientsResult,
    (clientsResult) => clientsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllClients,
    selectById: selectClientById,
    selectIds: selectClientIds,
    // Pass in a selector that returns the clients slice of state
} = clientsAdapter.getSelectors(
    (state) => selectClientsData(state) ?? initialState
);
