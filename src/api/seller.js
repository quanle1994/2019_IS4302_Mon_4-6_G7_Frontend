import axios from 'axios';

const api = axios.create({
  baseURL: '/user',
  responseType: 'json',
  timeout: 10000,
  contentType: 'application/json',
});

const getAllAssets = () => api
  .get(
    '/getAllAssets',
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

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

const createDeedCa = data => api
  .post(
    '/createDeedCa',
    { ...data },
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const listDeedForSale = data => api
  .post(
    '/listDeedForSale',
    { ...data },
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const getAllMiners = () => api
  .get(
    '/getAllMiners',
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const getAllCas = () => api
  .get(
    '/getAllCas',
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const convertGoldToDeed = data => api
  .post(
    '/convertGoldToDeed',
    { ...data },
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const topupGold = data => api
  .post(
    '/minerCreateGoldRequest',
    { ...data },
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const getMinerWithGold = id => api
  .get(
    `/getMinerWithGold/${id}`,
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const getAllSaleRequests = () => api
  .get(
    '/getGoldRequest',
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const getGoldRequests = () => api
  .get(
    '/getMinerGoldRequests',
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

const minerSellsGold = data => api
  .post(
    '/minerSellsGold',
    { ...data },
    { headers: { 'x-auth': localStorage.getItem('auth') } },
  );

export default {
  createProduct,
  getOrders,
  updateProduct,
  getMyProducts,
  setShipped,
  deleteProduct,
  getAllAssets,
  createDeedCa,
  listDeedForSale,
  getAllMiners,
  getAllCas,
  convertGoldToDeed,
  topupGold,
  getMinerWithGold,
  getAllSaleRequests,
  getGoldRequests,
  minerSellsGold,
};
