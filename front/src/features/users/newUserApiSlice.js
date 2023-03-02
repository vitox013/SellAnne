import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        verifyUser: builder.query({
            query: (args) => `/new/${args}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError;
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "User", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "User", id })),
                    ];
                } else return [{ type: "User", id: "LIST" }];
            },
        }),
        addNewUser: builder.mutation({
            query: (initialUserData) => ({
                url: "/new",
                method: "POST",
                body: {
                    ...initialUserData,
                },
            }),
            invalidatesTags: [
                {
                    type: "User",
                    id: "LIST",
                },
            ],
        }),
    }),
});

export const { useAddNewUserMutation, useVerifyUserQuery } = usersApiSlice;
