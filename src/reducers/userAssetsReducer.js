import { REMOVE_CURRENT_USER } from '../zDrawer/UserProfile';

const INITIAL_STATE = {
  money: {},
};

export const SET_ASSETS = 'SET_ASSETS';
export default function userAssetsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_ASSETS: {
      return ({
        ...state,
        goldOwned: action.assets.goldOwned,
        deedOwned: action.assets.deedOwned,
        money: action.assets.money,
      });
    }
    case REMOVE_CURRENT_USER: {
      return ({
        ...INITIAL_STATE,
      });
    }
    default: return state;
  }
}
