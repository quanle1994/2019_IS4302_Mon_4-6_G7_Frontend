import { SET_CURRENT_USER } from '../zDrawer/SideDrawer';
import { REMOVE_CURRENT_USER } from '../zDrawer/UserProfile';
import { GET_ALL_USERS } from '../zAdminPage/AdminPage';

const INITIAL_STATE = {
  currentPage: 'browse_all_gold',
  currentUser: {},
  allUsers: [],
  changePasswordOpen: false,
  moneyTopup: false,
};

export const OPEN_MONEY_TOPUP = 'OPEN_MONEY_TOPUP';
export const CLOSE_MONEY_TOPUP = 'CLOSE_MONEY_TOPUP';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export default function currentPageReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_CURRENT_PAGE: {
      return ({
        ...state,
        currentPage: action.currentPage,
      });
    }
    case OPEN_MONEY_TOPUP: {
      return ({
        ...state,
        moneyTopup: true,
      });
    }
    case CLOSE_MONEY_TOPUP: {
      return ({
        ...state,
        moneyTopup: false,
      });
    }
    case SET_CURRENT_USER: {
      return ({
        ...state,
        currentUser: { ...action.currentUser },
      });
    }
    case REMOVE_CURRENT_USER: {
      return ({
        ...state,
        currentUser: { ...action.currentUser },
      });
    }
    case GET_ALL_USERS: {
      return ({
        ...state,
        allUsers: action.data,
      });
    }
    default: return state;
  }
}
