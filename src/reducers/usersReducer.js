const INITIAL_STATE = {
  miners: [],
  cas: [],
  users: [],
};

export const SET_MINERS = 'SET_MINERS';
export const SET_CAS = 'SET_CAS';
export default function userAssetsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_MINERS: {
      return ({
        ...state,
        miners: [...action.miners],
      });
    }
    case SET_CAS: {
      return ({
        ...state,
        cas: [...action.cas],
      });
    }
    default: return state;
  }
}
