import buyerApi from '../api/buyer';
import { MODIFY_CART } from '../reducers/cartReducer';
import { SET_OFFERS } from '../reducers/offerReducer';
import listingsApi from '../api/listings';
import { GET_ALL_PRODUCTS } from '../reducers/productsReducer';
import sellerApi from '../api/seller';
import { SET_ASSETS, SET_GOLD_REQUESTS } from '../reducers/userAssetsReducer';

export const getOffers = (dispatch) => {
  const offers = {};
  buyerApi.getMyOffers().then((res) => {
    res.data.forEach((o) => {
      offers[o.transactionId] = o;
    });
    dispatch({
      type: MODIFY_CART,
      cartItems: { ...offers },
    });
  }).catch(e => console.log(e));
  const myOffers = {};
  buyerApi.getMyOffers(localStorage.getItem('username')).then((res) => {
    res.data.forEach((o) => {
      myOffers[o.transactionId] = o;
    });
    dispatch({
      type: SET_OFFERS,
      offers: { ...myOffers },
    });
  }).catch(e => console.log(e));
};

export const getAllListings = (dispatch) => {
  listingsApi.getAllListings().then(response => dispatch({
    type: GET_ALL_PRODUCTS,
    products: response.data,
  }));
};

export const getAllAssets = (dispatch) => {
  sellerApi.getAllAssets().then(res => dispatch({
    type: SET_ASSETS,
    assets: { ...res.data },
  }));
};

export const getMinerGoldRequests = (dispatch) => {
  sellerApi.getGoldRequests().then(res => dispatch({
    type: SET_GOLD_REQUESTS,
    goldRequests: res.data,
  }));
};

export const getCASaleRequests = (dispatch) => {
  sellerApi.getAllSaleRequests().then(res => dispatch({
    type: SET_GOLD_REQUESTS,
    goldRequests: res.data,
  }));
};
