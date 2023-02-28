import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const userAdapter = createEntityAdapter({});

const initialState = userAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserData: builder.query({
            query: (args) => `/getUserData/${args}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError;
            },
            // transformResponse: (responseData) => {
            //     const loadedUser = responseData.clients.map((user) => {
            //         user.id = user._id;
            //         return user;
            //     });
            //

            //     return userAdapter.setAll(initialState, loadedUser);
            // },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "User", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "User", id })),
                    ];
                } else return [{ type: "User", id: "LIST" }];
            },
        }),
        updateUser: builder.mutation({
            query: (initialUserData) => ({
                url: "/user",
                method: "PATCH",
                body: {
                    ...initialUserData,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "User", id: arg.id },
            ],
        }),
        deleteUser: builder.mutation({
            query: (initialUserData) => ({
                url: `/user`,
                method: "DELETE",
                body: { ...initialUserData },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "User", id: arg.id },
            ],
        }),
    }),
});

export const {
    useGetUserDataQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApiSlice;

// returns the query result object
export const selectUserResult = userApiSlice.endpoints.getUserData.select();

// creates memoized selector
const selectUserData = createSelector(
    selectUserResult,
    (userResult) => userResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUser,
    selectById: selectUserById,
    selectIds: selectUserIds,
    // Pass in a selector that returns the user slice of state
} = userAdapter.getSelectors((state) => selectUserData(state) ?? initialState);
