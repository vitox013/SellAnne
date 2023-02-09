import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const pedidosAdapter = createEntityAdapter({});

const initialState = pedidosAdapter.getInitialState();

export const pedidosApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPedidos: builder.query({
            query: (args) => ({
                url: `/getPedidos/${args}`,
                params: args,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),

            transformResponse: (responseData) => {
                const loadedPedidos = responseData.map((pedido) => {
                    pedido.id = pedido._id;
                    return pedido;
                });
                return pedidosAdapter.setAll(initialState, loadedPedidos);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Pedido", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "Pedido", id })),
                    ];
                } else return [{ type: "Pedido", id: "LIST" }];
            },
        }),
        addNewPedido: builder.mutation({
            query: (initialPedidoData) => ({
                url: "/pedido",
                method: "POST",
                body: {
                    ...initialPedidoData,
                },
            }),
            invalidatesTags: [
                {
                    type: "Pedido",
                    id: "LIST",
                },
            ],
        }),
        updatePedido: builder.mutation({
            query: (initialPedidoData) => ({
                url: "/pedido",
                method: "PATCH",
                body: {
                    ...initialPedidoData,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Pedido", id: arg.id },
            ],
        }),
        deletePedido: builder.mutation({
            query: ({ id }) => ({
                url: `/pedido`,
                method: "DELETE",
                body: { id },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Pedido", id: arg.id },
            ],
        }),
    }),
});

export const {
    useGetPedidosQuery,
    useAddNewPedidoMutation,
    useDeletePedidoMutation,
    useUpdatePedidoMutation,
} = pedidosApiSlice;

// returns the query result object
export const selectPedidosResult =
    pedidosApiSlice.endpoints.getPedidos.select();

// creates memoized selector
const selectPedidosData = createSelector(
    selectPedidosResult,
    (pedidosResult) => pedidosResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllPedidos,
    selectById: selectPedidoById,
    selectIds: selectPedidoIds,
    // Pass in a selector that returns the pedidos slice of state
} = pedidosAdapter.getSelectors(
    (state) => selectPedidosData(state) ?? initialState
);
