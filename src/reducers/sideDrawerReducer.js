import { OPEN_LEFT_DRAWER } from '../zSearchbar/Searchbar';
import { CLOSE_LEFT_DRAWER, OPEN_USER_REGISTRATION_FORM } from '../zDrawer/SideDrawer';
import { CLOSE_REGISTRATION_FORM } from '../zDrawer/UserActions/UserRegistration';
import { OPEN_CHANGE_PASSWORD_FORM } from '../zDrawer/UserProfile';
import { CLOSE_CHANGE_PASSWORD_FORM } from '../zDrawer/UserActions/ChangePasswordDialog';

const INITIAL_STATE = {
  drawerOpen: false,
  registrationOpen: false,
};

export default function sideDrawerReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case OPEN_LEFT_DRAWER: {
      return ({
        ...state,
        drawerOpen: true,
      });
    }
    case CLOSE_LEFT_DRAWER: {
      return ({
        ...state,
        drawerOpen: false,
      });
    }
    case OPEN_USER_REGISTRATION_FORM: {
      return ({
        ...state,
        registrationOpen: true,
      });
    }
    case CLOSE_REGISTRATION_FORM: {
      return ({
        ...state,
        registrationOpen: false,
      });
    }
    case OPEN_CHANGE_PASSWORD_FORM: {
      return ({
        ...state,
        changePasswordOpen: true,
      });
    }
    case CLOSE_CHANGE_PASSWORD_FORM: {
      return ({
        ...state,
        changePasswordOpen: false,
      });
    }
    default: return state;
  }
}
