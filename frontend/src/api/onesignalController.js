import axios from "axios";
const apiURL = "https://fashion-store-ildx.onrender.com";

const config = {
    headers: {
        Authorization: JSON.parse(localStorage.getItem("isAuthenticated")),
    },
};

export const postOneSignalSub = (oneSignalId) => {
    return axios.post("api/v1/oneSignal/sub", { oneSignalId });
};

export const deleteOneSignalunSub = (oneSignalId) => {
    return axios.delete("api/v1/oneSignal/unSub", { data: { oneSignalId } });
};
