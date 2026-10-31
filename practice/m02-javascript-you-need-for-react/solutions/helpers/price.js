// Price helpers. symbol has no export, so it stays private to this file.
const symbol = 'Rs';

export const formatPrice = (price) => `${symbol} ${price}`;

export const withGst = (price) => Math.round(price * 1.18);

export const totalPrice = (list) => list.reduce((sum, c) => sum + c.price, 0);
