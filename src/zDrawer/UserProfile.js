/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography/Typography';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import SuccessDialog from '../commons/SuccessDialog';
import { CLOSE_LEFT_DRAWER, SET_CURRENT_USER } from './SideDrawer';
import history from '../history';
import ErrorDialog from '../commons/ErrorDialog';
import loginApi from '../api/login';

export const REMOVE_CURRENT_USER = 'REMOVE_CURRENT_USER';
export const OPEN_CHANGE_PASSWORD_FORM = 'OPEN_CHANGE_PASSWORD_FORM';
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { currentUser } = this.props;
    this.setState({
      ...currentUser,
      gender: currentUser.genderByte,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { currentUser } = nextProps;
    this.setState({
      gender: currentUser.genderByte,
    });
    console.log(this.state);
  }

  convertDateTime = (dateValue, isDateOnly) => {
    if (dateValue === undefined) return;
    const date = new Date(dateValue);
    date.setSeconds(0, 0);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const dateString = (new Date(date.getTime() - tzOffset)).toISOString();
    if (isDateOnly) return dateString.split('T')[0];
    return dateString.split(':00.000Z')[0];
  };

  handleSetCurrentUser = (user) => {
    const { dispatch } = this.props;
    const currentUser = user;
    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem('id', currentUser.id);
    localStorage.setItem('fullname', currentUser.fullname);
    localStorage.setItem('token', `${currentUser.username}|||${currentUser.password}`);
    localStorage.setItem('photoDir', currentUser.photoDir);
    localStorage.setItem('username', currentUser.username);
    localStorage.setItem('type', currentUser.type);
    localStorage.setItem('emailAddress', currentUser.emailAddress);
    localStorage.setItem('gender', currentUser.gender);
    localStorage.setItem('dob', currentUser.dob);
    localStorage.setItem('cart', currentUser.cartString);
    dispatch({
      type: SET_CURRENT_USER,
      currentUser,
    });
  };

  handleUpdateUser = () => {
    const {
      id, username, fullname, emailAddress, address, gender, dob,
    } = this.state;
    const updateReq = {
      id, username, fullname, emailAddress, address, gender, dob,
    };
    loginApi.updateUser(updateReq).then((response) => {
      this.handleSetCurrentUser(response.data);
      SuccessDialog('Update User Successfully', 'User Profile', 'updated');
    }).catch(error => ErrorDialog('updating user profile', error));
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { classes, dispatch, currentUser } = this.props;
    const handleLogout = () => {
      SuccessDialog('Logout', `User ${localStorage.getItem('username')}`, 'logged out');
      history.push('/');
      dispatch({
        type: REMOVE_CURRENT_USER,
      });
      localStorage.clear();
      setTimeout(() => {
        dispatch({
          type: CLOSE_LEFT_DRAWER,
        });
        // window.location.reload();
      }, 500);
    };
    const handleChangePassword = () => dispatch({
      type: OPEN_CHANGE_PASSWORD_FORM,
    });
    const type = localStorage.getItem('type');
    return (
      <div className={classes.container}>
        {currentUser.photoDir === null || currentUser.photoDir === undefined ? (
          <AccountCircle className={classes.icon} />
        ) : (
          <img alt="profile" src={currentUser.photoDir} />
        )}
        <Typography variant="h4">
          User Profile
        </Typography>
        <TextField
          fullWidth
          className={classes.input}
          label="Email / User Name"
          type="text"
          defaultValue={currentUser.username}
          name="emailAddress"
          value={this.state.username}
          InputProps={{ readOnly: true }}
        />
        <TextField
          required
          fullWidth
          className={classes.input}
          label={type === 'COMMERCIAL' || type === 'ADMIN' ? 'Full Name' : 'Company\'s Name'}
          type="text"
          defaultValue={currentUser.fullname}
          name="fullname"
          value={this.state.fullname}
          onChange={this.handleChange}
        />
        {type === 'COMMERCIAL' && (
          <TextField
            required
            fullWidth
            select
            className={classes.input}
            label="Gender"
            name="gender"
            value={this.state.gender}
            onChange={this.handleChange}
          >
            <MenuItem key={0} value={0}>Male</MenuItem>
            <MenuItem key={1} value={1}>Female</MenuItem>
          </TextField>
        )}
        <TextField
          required
          fullWidth
          className={classes.input}
          label="Address"
          type="text"
          defaultValue={currentUser.address}
          name="address"
          value={this.state.address}
          onChange={this.handleChange}
        />
        <TextField
          fullWidth
          className={classes.input}
          label="Type"
          type="text"
          InputProps={{ readOnly: true }}
          value={type === 'CA' ? 'CERTIFYING AUTHORITY' : currentUser.type}
        />
        <Button variant="outlined" color="secondary" className={classes.button} onClick={this.handleUpdateUser}>Update</Button>
        <Button variant="outlined" color="secondary" className={classes.button} onClick={handleChangePassword}>Change Password</Button>
        <Button variant="outlined" color="secondary" className={classes.button} onClick={handleLogout}>Logout</Button>
      </div>
    );
  }
}

const style = () => ({
  container: {
    height: '100%',
    width: '100%',
    textAlign: 'center',
  },
  icon: {
    fontSize: 150,
    color: 'teal',
    // marginLeft: 100,
  },
  button: {
    fontSize: '1em',
    fontWeight: 'bold',
    width: 220,
    marginTop: 10,
    marginBottom: 10,
  },
});

const mapStateToProps = state => ({
  currentUser: state.currentPage.currentUser,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(UserProfile);
