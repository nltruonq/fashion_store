import axios from "axios";
const apiURL = "https://fashion-store-ildx.onrender.com";

const config = {
    headers: {
        Authorization: JSON.parse(localStorage.getItem("isAuthenticated")),
    },
};

export const getNotification = async (params) => {
    const res = await axios.get(
        "/api/v1/admin/notifications",
        { params: params },
        config
    );
    return res.data;
};

export const getSingleNotification = async (id) => {
    const res = await axios.get(
        `/api/v1/notification/${id}`,
        undefined,
        config
    );
    return res.data;
};

export const deleteSinglenotification = async (payload) => {
    const res = await axios.delete(
        `/api/v1/admin/notification/${payload}`,
        undefined,
        config
    );
    return res.data;
};

export const deleteMutipleNotification = async (payload) => {
    const res = await axios.post(
        `/api/v1/admin/muitiple/notification`,
        payload,
        config
    );
    return res.data;
};

export const updateNotification = async (payload) => {
    const { id, ...rest } = payload;
    const res = await axios.put(
        `/api/v1/admin/notification/${id}`,
        rest,
        config
    );
    return res.data;
};

export const createNotification = async (payload) => {
    const res = await axios.post(
        "/api/v1/admin/notification/new",
        payload,
        config
    );
    return res.data;
};
