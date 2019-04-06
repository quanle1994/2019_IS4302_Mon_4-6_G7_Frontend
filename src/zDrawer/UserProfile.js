/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography/Typography';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';
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
    });
  }

  handleSetCurrentUser = (user) => {
    const { dispatch } = this.props;
    const currentUser = user;
    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem('name', currentUser.name);
    localStorage.setItem('photoDir', currentUser.photoDir);
    localStorage.setItem('username', currentUser.username);
    localStorage.setItem('address', currentUser.address);
    localStorage.setItem('email', currentUser.email);
    dispatch({
      type: SET_CURRENT_USER,
      currentUser,
    });
  };

  handleUpdateUser = () => {
    const {
      id, name, email, address,
    } = this.state;
    const updateReq = {
      id, name, email, address, type: localStorage.getItem('type'),
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
          User Profile: {currentUser.username}
        </Typography>
        <TextField
          required
          fullWidth
          className={classes.input}
          label={type === 'RegisteredUser' || type === 'ADMIN' ? 'Full Name' : 'Company\'s Name'}
          type="text"
          defaultValue={currentUser.name}
          name="name"
          value={this.state.name}
          onChange={this.handleChange}
        />
        <TextField
          required
          fullWidth
          className={classes.input}
          label="Email Address"
          type="text"
          defaultValue={currentUser.email}
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
        />
        <TextField
          required
          fullWidth
          className={classes.input}
          label="Mailing Address"
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
          value={type === 'CertificateAuthority' ? 'Certificate Authority' : type === 'RegisteredUser' ? 'Registered User' : currentUser.type}
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
