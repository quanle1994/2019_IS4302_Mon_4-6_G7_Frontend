export const OPEN_CREATE_DEED_DIALOG = 'OPEN_CREATE_DEED_DIALOG';
export const OPEN_LIST_DEED_DIALOG = 'OPEN_LIST_DEED_DIALOG';
export const CLOSE_CREATE_DEED_DIALOG = 'CLOSE_CREATE_DEED_DIALOG';
export const CLOSE_LIST_DEED_DIALOG = 'CLOSE_LIST_DEED_DIALOG';

const INITIAL_STATE = {
  createDeedOpen: false,
  listDeedOpen: false,
  gId: -1,
  dId: -1,
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
    case OPEN_LIST_DEED_DIALOG: {
      return ({
        ...state,
        listDeedOpen: true,
        dId: action.dId,
      });
    }
    case CLOSE_LIST_DEED_DIALOG: {
      return ({
        ...state,
        listDeedOpen: false,
        dId: -1,
      });
    }
    default: return state;
  }
}
