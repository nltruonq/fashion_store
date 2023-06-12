import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as notificationApi from "../../api/notificationApi";

export const getNotificationRedux = createAsyncThunk(
    "notifications/get_notifications",
    async (payload, thunkApi) => {
        const data = notificationApi.getNotification(payload);
        return data;
    }
);

export const getSingleNotification = createAsyncThunk(
    "notifications/get_single_notification",
    async (payload, thunkApi) => {
        const data = notificationApi.getSingleNotification(payload);
        return data;
    }
);

export const deleteSingleNotification = createAsyncThunk(
    "notifications/delete_single_notification",
    async (payload, thunkApi) => {
        const data = notificationApi.deleteSinglenotification(payload);
        return data;
    }
);

export const deleteMutipleNotification = createAsyncThunk(
    "notifications/delete_mutiple_notification",
    async (payload, thunkApi) => {
        const data = notificationApi.deleteMutipleNotification(payload);
        return data;
    }
);

export const updateNotification = createAsyncThunk(
    "notifications/update_notification",
    async (payload, thunkApi) => {
        const data = notificationApi.updateNotification(payload);
        return data;
    }
);

export const createNotification = createAsyncThunk(
    "notifications/create_notification",
    async (payload, thunkApi) => {
        const data = notificationApi.createNotification(payload);
        return data;
    }
);

const initialState = {
    data: [],
    loading: false,
    error: undefined,
};

const notificationslice = createSlice({
    name: "notifications",
    initialState,
    reducers: {},
    extraReducers: (buidler) => {
        buidler
            .addMatcher(
                (action) => {
                    return (
                        action.type.startsWith("notifications/") &&
                        action.type.endsWith("/pending")
                    );
                },
                (state, action) => {
                    state.loading = true;
                }
            )
            .addMatcher(
                (action) => {
                    return (
                        action.type.startsWith("notifications/") &&
                        action.type.endsWith("/fulfilled")
                    );
                },
                (state, action) => {
                    state.loading = false;
                    state.data = action.payload;
                }
            )
            .addMatcher(
                (action) => {
                    return (
                        action.type.startsWith("notifications/") &&
                        action.type.endsWith("/rejected")
                    );
                },
                (state, action) => {
                    state.loading = false;
                    state.error = action.error;
                }
            );
    },
});

export default notificationslice.reducer;
