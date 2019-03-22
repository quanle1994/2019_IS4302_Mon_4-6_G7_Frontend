import axios from 'axios';
import BACKEND_SERVER from './constants';

const BASE_URL = `${BACKEND_SERVER}/auth/Seller`;

const api = axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
  timeout: 10000,
  contentType: 'application/json',
});

const createProduct = product => api
  .post(
    'createProduct',
    { ...product },
    { headers: { Authorisation: localStorage.getItem('token') } },
  );

const getOrders = sellerId => api
  .get(
    'getOrders',
    { params: { sellerId }, headers: { Authorisation: localStorage.getItem('token') } },
  );

const updateProduct = product => api
  .post(
    'updateProduct',
    { ...product },
    { headers: { Authorisation: localStorage.getItem('token') } },
  );

const getMyProducts = sellerId => api
  .get(
    'getMyProducts',
    { params: { sellerId }, headers: { Authorisation: localStorage.getItem('token') } },
  );

const setShipped = cId => api
  .get(
    'setShipped',
    { params: { cId }, headers: { Authorisation: localStorage.getItem('token') } },
  );

const deleteProduct = (sellerId, pId) => api
  .get(
    'deleteProduct',
    { params: { sellerId, pId }, headers: { Authorisation: localStorage.getItem('token') } },
  );

export default {
  createProduct,
  getOrders,
  updateProduct,
  getMyProducts,
  setShipped,
  deleteProduct,
};
