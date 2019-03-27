import axios from 'axios';

const api = axios.create({
  baseURL: '/listings',
  responseType: 'json',
  timeout: 10000,
  contentType: 'application/json',
});

const getAllListings = () => api
  .get(
    '/getAllListings',
  );

const updateCart = (userId, cartItems) => api
  .post(
    '/updateCart',
    { userId, cartItems },
    { headers: { Authorisation: localStorage.getItem('token') } },
  );

export default {
  getAllListings,
  updateCart,
};
