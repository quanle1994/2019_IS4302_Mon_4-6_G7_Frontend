const INITIAL_STATE = {
  orders: [],
};

export const SET_ORDERS = 'SET_ORDERS';

export default function ordersReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_ORDERS: {
      return ({
        ...state,
        orders: action.orders,
      });
    }
    default: return state;
  }
}