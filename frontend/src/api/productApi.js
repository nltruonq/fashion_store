import axios from "axios";

const config = {
  header: {
    "Content-Type": "application/json",
  },
};

export const getProduct = async (params) => {
    const res = await axios.get("/api/v1/products", {params: params});
    return res.data;
  };

export const getSingleProduct = async (id) => {
  const res = await axios.get(`/api/v1/product/${id}`);
    return res.data;
}

export const deleteSingleProduct = async (payload) => {
  const res = await axios.delete(`/api/v1/admin/product/${payload}`);
  return res.data
}

export const getReviews = async ({id}) => {
  const res = await axios.get(`/api/v1/reviews?id=${id}`);
  return res.data
}


export const deleteMutipleProduct = async (payload) => {
  const res = await axios.post(`/api/v1/admin/muitiple/product`, payload, config);
  return res.data
}

export const updateProduct = async (payload) => {
  const {id, ...rest } = payload
  const res = await axios.put( `/api/v1/admin/product/${id}`, rest, config);
  return res.data
}

export const createProduct = async (payload) => {
  const res = await axios.post( '/api/v1/admin/product/new', payload, config);
  return res.data
}