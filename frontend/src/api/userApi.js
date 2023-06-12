import axios from "axios";


const config = {
  header: {
    "Content-Type": "application/json",
  },
};

export const login = async ({ email, password }) => {
  const res = await axios.post("/api/v1/login", { email, password }, config);
  return res.data;
};

export const logout = async () => {
  const res = await axios.get("/api/v1/logout");
  return res.data;
};

export const register = async ({ name, email, password, avatar }) => {
  const config = { header: { "Content-Type": "multipart/form-data" } };

  const res = await axios.post(
    "/api/v1/register",
    { name, email, password, avatar },
    config
  );
  return res.data;
};

export const resetPassword = async ({ password, confirmPassword, token }) => {
  const res = await axios.put(
    `/api/v1/password/reset/${token}`,
    { password, confirmPassword },
    config
  );
  return res.data;
};

export const forgotPassword = async ({ email }) => {
  const res = await axios.post("/api/v1/password/forgot", { email }, config);
  return res.data;
};

export const updatePassword = async ({
  oldPassword,
  newPassword,
  confirmPassword,
}) => {
  const res = await axios.put(
    "/api/v1/password/update",
    { oldPassword, newPassword, confirmPassword },
    config
  );
  return res.data;
};

export const getUser = async () => {
  const res = await axios.get("/api/v1/me");
  return res.data;
};

export const updateUser = async (data) => {
  const config = { header: { "Content-Type": "multipart/form-data" } };
  const res = await axios.put("/api/v1/me/update", data, config);
  return res.data;
};

export const deleteAddress = async (data) => {
  const res = await axios.post("/api/v1/me/delete/address", data, config);
  return res.data;
};

export const updateAddress = async (data) => {
  const res = await axios.post("/api/v1/me/update/address", data, config);
  return res.data;
};

//admin
export const getAllUser = async () => {
  const res = await axios.get("/api/v1/admin/users");
  return res.data;
};

export const deleteSingleUser = async (id) => {
  const res = await axios.delete(`/api/v1/admin/user/${id}`);
  return res.data;
};

export const deleteMutipleUser = async (payload) => {
  const res = await axios.post(
    "/api/v1/admin/muitiple/user",
    payload,
    config
  );
  return res.data;
};

export const getSingleUser = async (id) => {
  const res = await axios.get(`/api/v1/admin/user/${id}`);
  return res.data;
};

export const updateUserRole = async ({id, ...rest}) => {
  const res = await axios.put(`/api/v1/admin/user/${id}`, rest, config);
  return res.data;
};