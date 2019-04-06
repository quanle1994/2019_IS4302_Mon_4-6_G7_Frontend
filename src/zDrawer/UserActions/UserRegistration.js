import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button/Button';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ErrorDialog from '../../commons/ErrorDialog';
import InvalidationDialog from '../../commons/InvalidationDialog';
import loginApi from '../../api/login';
import SuccessDialog from '../../commons/SuccessDialog';
import { CLOSE_LEFT_DRAWER, SET_CURRENT_USER } from '../SideDrawer';
import history from '../../history';

export const CLOSE_REGISTRATION_FORM = 'CLOSE_REGISTRATION_FORM';

class UserRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      name: '',
      email: '',
      address: '',
      type: 'RegisteredUser',
      password: '',
      confirmPassword: '',
    };
  }

  handleRegister = () => {
    const { dispatch } = this.props;
    const {
      userId, name, email, address, type, password, confirmPassword,
    } = this.state;
    if (confirmPassword !== password) {
      InvalidationDialog('Password does not match!');
      return;
    }
    if (email.indexOf('@') <= 0 && email.indexOf('.') < 0) {
      InvalidationDialog('Invalid email format');
      return;
    }
    const user = {
      userId, name, email, address, type, password,
    };
    loginApi.register(user).then(() => {
      SuccessDialog('User Registration Successfully Lodged', `User ${userId}`, 'queued for processing');
      // const currentUser = response.data;
      // localStorage.setItem('user', JSON.stringify(currentUser));
      // localStorage.setItem('username', currentUser.username);
      // localStorage.setItem('name', currentUser.name);
      // localStorage.setItem('auth', currentUser.auth);
      // localStorage.setItem('photoDir', currentUser.photoDir);
      // localStorage.setItem('type', currentUser.type);
      // localStorage.setItem('email', currentUser.email);
      // this.setState({}, () => dispatch({
      //   type: SET_CURRENT_USER,
      //   currentUser,
      // }));
      setTimeout(() => {
        dispatch({
          type: CLOSE_REGISTRATION_FORM,
        });
        dispatch({
          type: CLOSE_LEFT_DRAWER,
        });
        history.push('/');
      }, 500);
    }).catch(error => ErrorDialog('registering', error));
  };

  render() {
    const {
      userId, name, email, address, gender, type, password, confirmPassword,
    } = this.state;
    const { classes, dispatch, registrationOpen } = this.props;
    const handleCloseForm = () => {
      history.push('/');
      dispatch({
        type: CLOSE_REGISTRATION_FORM,
      });
    };
    const handleChange = e => this.setState({
      [e.target.name]: e.target.value,
    });
    const error = confirmPassword !== '' && confirmPassword !== password;
    const emailError = email !== '' && (email.indexOf('@') <= 0 || email.indexOf('.') < 0);
    return (
      <Dialog
        open={registrationOpen}
        onClose={() => dispatch({
          type: CLOSE_REGISTRATION_FORM,
        })}
      >
        <DialogTitle>User Registration</DialogTitle>
        <DialogContent>
          <div className={classes.center}>
            <AccountCircle className={classes.icon} />
          </div>
          <TextField
            fullWidth
            className={classes.input}
            autoFocus
            label="User Name"
            name="userId"
            type="text"
            value={userId}
            onChange={handleChange}
          />
          <TextField
            error={emailError}
            fullWidth
            className={classes.inputHalfLeft}
            label={emailError ? 'Invalid Email Address' : 'Email'}
            name="email"
            type="text"
            value={email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            className={classes.inputHalfRight}
            label="Full Name"
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            className={classes.inputHalfLeft}
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
          />
          <TextField
            error={error}
            className={classes.inputHalfRight}
            fullWidth
            label={error ? 'Does not match password' : 'Confirm Password'}
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={handleChange}
          />
          <TextField
            className={classes.inputHalfLeft}
            label="Type"
            select
            name="type"
            value={type}
            onChange={handleChange}
          >
            <MenuItem value="Miner" key={0}>MINER</MenuItem>
            <MenuItem value="CertificateAuthority" key={1}>CERTIFICATE AUTHORITY</MenuItem>
            <MenuItem value="RegisteredUser" key={2}>COMMERICIAL USER</MenuItem>
          </TextField>
          {type === 2 && (
            <TextField
              className={classes.inputHalfLeft}
              label="Gender"
              select
              name="gender"
              value={gender}
              onChange={handleChange}
            >
              <MenuItem value={0} key={0}>Male</MenuItem>
              <MenuItem value={1} key={1}>Female</MenuItem>
            </TextField>
          )}
          <TextField
            fullWidth
            className={classes.input}
            label="Address"
            name="address"
            type="text"
            value={address}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={this.handleRegister}>Register</Button>
          <Button variant="outlined" onClick={handleCloseForm}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const style = () => ({
  container: {
    height: '100%',
    width: '100%',
  },
  center: {
    textAlign: 'center',
  },
  icon: {
    fontSize: 150,
    color: 'teal',
  },
  input: {
    marginTop: 10,
  },
  inputHalfLeft: {
    marginTop: 10,
    width: '48%',
    marginRight: '2%',
    float: 'left',
  },
  inputHalfRight: {
    marginTop: 10,
    width: '48%',
    marginLeft: '2%',
    float: 'left',
  },
});

const mapStateToProps = state => ({
  registrationOpen: state.sideDrawer.registrationOpen,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(UserRegistration);
