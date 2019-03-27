const INITIAL_STATE = {
  golds: {},
  deeds: {},
  money: {},
};

export const SET_ASSETS = 'SET_ASSETS';
export default function userAssetsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_ASSETS: {
      return ({
        ...state,
        golds: action.assets.golds,
        deeds: action.assets.deeds,
        money: action.assets.money,
      });
    }
    default: return state;
  }
}
