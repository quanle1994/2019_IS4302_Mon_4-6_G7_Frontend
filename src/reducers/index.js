import { combineReducers } from 'redux';
import sideDrawerReducer from './sideDrawerReducer';
import currentPageReducer from './currentPageReducer';
import productsReducer from './productsReducer';
import cartReducer from './cartReducer';
import ordersReducer from './ordersReducer';

const rootReducer = combineReducers({
  sideDrawer: sideDrawerReducer,
  currentPage: currentPageReducer,
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
});

export default rootReducer;
