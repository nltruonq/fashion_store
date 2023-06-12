import axios from "axios";

const config = {
    header: {
      "Content-Type": "application/json",
    },
  };
  

export const getMyOrders = async () => {
    const res = await axios.get('/api/v1/orders/me')
    return res.data
}


export const getSingleOrder = async (id) => {
  const res = await axios.get(`/api/v1/order/${id}`)
  return res.data
}


export const createNewOrder = async (payload) => {
    const res = await axios.post('/api/v1/order/new', payload, config)
    return res.data
}

export const getAllOrders = async () => {
  const res = await axios.get('/api/v1/admin/orders')
  return res.data
}

export const deleteSingleOrder = async (id) => {
  const res = await axios.delete(`/api/v1/admin/order/${id}`)
  return res.data
}

export const deleteMutipleOrder = async (payload) => {
  const res = await axios.post('/api/v1/admin/muitiple/order', payload, config)
  return res.data
}

export const updateOrder = async ({id, status}) => {
  const res = await axios.put(`/api/v1/admin/order/${id}`, { status }, config)
  return res.data
}