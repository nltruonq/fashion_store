export const sumMoneyProduct = (cartItems) => {
  let sum = 0;
  sum = cartItems?.reduce((sum, acc, index) => {
    if (acc.selected === true) {
      return (
        sum +
        (acc.product.price - (acc.product.price * acc.product.sale) / 100) *
          acc.quantity
      );
    }
    return sum;
  }, 0);
  return sum;
};

export const sumMoneyShip = (cartItems) => {
  let sum = 0;
  sum = cartItems?.reduce((sum, acc, index) => {
    if (acc.selected === true) {
      return sum + acc.product.moneyShip;
    }
    return sum;
  }, 0);
  return sum;
};

export const checkProductSelected = (cartItems) => {
  let sum = 0;
  sum = cartItems?.reduce((sum, acc, index) => {
    if (acc.selected === true) {
      return sum + acc.quantity;
    }
    return sum;
  }, 0);
  return sum;
};

export const createArrayId = (cartItems) => {
  let arrayId = [];
  cartItems?.forEach((acc) => {
    if (acc.selected === true) {
      arrayId.push(acc.product._id);
    }
  });
  return arrayId;
};
