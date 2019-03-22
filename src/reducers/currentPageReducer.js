import { SET_CURRENT_USER } from '../zDrawer/SideDrawer';
import { REMOVE_CURRENT_USER } from '../zDrawer/UserProfile';
import { GET_ALL_USERS } from '../zAdminPage/AdminPage';

const INITIAL_STATE = {
  currentPage: 'productPage',
  currentUser: {},
  allUsers: [],
  changePasswordOpen: false,
};

export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export default function currentPageReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_CURRENT_PAGE: {
      return ({
        ...state,
        currentPage: action.currentPage,
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
