import { REMOVE_CURRENT_USER } from '../zDrawer/UserProfile';

const INITIAL_STATE = {
  offers: {},
};

export const SET_OFFERS = 'SET_OFFERS';
export default function offerReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_OFFERS: {
      return ({
        ...state,
        offers: { ...action.offers },
      });
    }
    case REMOVE_CURRENT_USER: {
      return ({
        ...state,
        offers: {},
      });
    }
    default: return state;
  }
}
