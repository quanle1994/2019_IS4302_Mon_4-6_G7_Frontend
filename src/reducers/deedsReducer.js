export const OPEN_CREATE_DEED_DIALOG = 'OPEN_CREATE_DEED_DIALOG';
export const CLOSE_CREATE_DEED_DIALOG = 'CLOSE_CREATE_DEED_DIALOG';

const INITIAL_STATE = {
  createDeedOpen: false,
  gId: -1,
};

export default function deedsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case OPEN_CREATE_DEED_DIALOG: {
      return ({
        ...state,
        createDeedOpen: true,
        gId: action.gId,
      });
    }
    case CLOSE_CREATE_DEED_DIALOG: {
      return ({
        ...state,
        createDeedOpen: false,
        gId: -1,
      });
    }
    default: return state;
  }
}
