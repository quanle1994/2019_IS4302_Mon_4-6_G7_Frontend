import { combineReducers } from 'redux';
import sideDrawerReducer from './sideDrawerReducer';
import currentPageReducer from './currentPageReducer';
import productsReducer from './productsReducer';
import cartReducer from './cartReducer';
import ordersReducer from './ordersReducer';
import deedsReducer from './deedsReducer';
import userAssetsReducer from './userAssetsReducer';
import usersReducer from './usersReducer';
import offerReducer from './offerReducer';

const rootReducer = combineReducers({
  sideDrawer: sideDrawerReducer,
  currentPage: currentPageReducer,
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  deeds: deedsReducer,
  userAssets: userAssetsReducer,
  users: usersReducer,
  offers: offerReducer,
});

export default rootReducer;
