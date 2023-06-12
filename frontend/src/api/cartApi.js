import axios from "axios";

const config = {
    header: {
      "Content-Type": "application/json",
    },
  };
  

export const getMyCarts = async () => {
    const res = await axios.get(`/api/v1/cart/items`)
    return res.data.cart
}

export const addCartUser = async ({cartItems}) => {
  const res = await axios.post("/api/v1/cart", {cartItems}, config);
  return res.data
}

export const deleteCartUser = async ({newArrayId}) => {
    const res = await axios.post("/api/v1/cart/items", {newArrayId}, config);
    return res.data
}
