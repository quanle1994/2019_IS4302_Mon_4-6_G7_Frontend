import { CLOSE_PAYMENT_DIALOG } from '../zCartPage/PaymentDialog';
import { UPDATE_PAYMENT_TOKEN_FOR_SALES_ORDER_CREATION } from '../zPaymentComponent/PaymentForm';

const INITIAL_STATE = {
  cartItems: {},
  cartViewerOpen: false,
  anchorEl: null,
  paymentDialogOpen: false,
  token: null,
};

export const MODIFY_CART = 'MODIFY_CART';
export const OPEN_CART_VIEWER = 'OPEN_CART_VIEWER';
export const CLOSE_CART_VIEWER = 'CLOSE_CART_VIEWER';
export const OPEN_PAYMENT_DIALOG = 'OPEN_PAYMENT_DIALOG';

export default function cartReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case MODIFY_CART: {
      return ({
        ...state,
        cartItems: {
          ...action.cartItems,
        },
      });
    }
    case OPEN_CART_VIEWER: {
      return ({
        ...state,
        cartViewerOpen: true,
        anchorEl: action.anchorEl,
      });
    }
    case CLOSE_CART_VIEWER: {
      return ({
        ...state,
        cartViewerOpen: false,
        anchorEl: action.anchorEl,
      });
    }
    case OPEN_PAYMENT_DIALOG: {
      return ({
        ...state,
        paymentDialogOpen: true,
      });
    }
    case CLOSE_PAYMENT_DIALOG: {
      return ({
        ...state,
        paymentDialogOpen: false,
      });
    }
    case UPDATE_PAYMENT_TOKEN_FOR_SALES_ORDER_CREATION: {
      return {
        ...state,
        token: action.token === null ? null : { ...action.token },
      };
    }
    default: return state;
  }
}
