/* eslint-disable react/jsx-one-expression-per-line */
import Drawer from '@material-ui/core/Drawer/Drawer';
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import AccountCircle from '@material-ui/icons/AccountCircle';
import TextField from '@material-ui/core/TextField/TextField';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import Paper from '@material-ui/core/Paper/Paper';
import loginApi from '../api/login';
import ErrorDialog from '../commons/ErrorDialog';
import UserProfile from './UserProfile';
import SuccessDialog from '../commons/SuccessDialog';
import history from '../history';
import buyerApi from '../api/buyer';
import { MODIFY_CART } from '../reducers/cartReducer';
import { SET_OFFERS } from '../reducers/offerReducer';

export const CLOSE_LEFT_DRAWER = 'CLOSE_LEFT_DRAWER';
export const OPEN_USER_REGISTRATION_FORM = 'OPEN_USER_REGISTRATION_FORM';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
class SideDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  render() {
    const { drawerOpen, dispatch, classes } = this.props;
    const { email, password } = this.state;
    const closeDrawer = () => this.setState({}, () => dispatch({
      type: CLOSE_LEFT_DRAWER,
    }));
    const handleOnchange = event => this.setState({
      [event.target.name]: event.target.value,
    });
    const handleLogin = () => {
      const { email: _username, password: _password } = this.state;
      loginApi.login(_username, _password).then((response) => {
        const currentUser = response.data;
        localStorage.setItem('auth', response.headers['x-auth']);
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('photoDir', currentUser.photoDir);
        localStorage.setItem('username', currentUser.username);
        localStorage.setItem('name', currentUser.name);
        localStorage.setItem('type', currentUser.type);
        dispatch({
          type: SET_CURRENT_USER,
          currentUser,
        });
        const offers = {};
        buyerApi.getMyOffers().then((res) => {
          res.data.forEach((o) => {
            offers[o.transactionId] = o;
          });
          this.setState({}, () => {
            dispatch({
              type: MODIFY_CART,
              cartItems: { ...offers },
            });
          });
        }).catch(e => console.log(e));
        const myOffers = {};
        buyerApi.getMyOffers(localStorage.getItem('username')).then((res) => {
          res.data.forEach((o) => {
            myOffers[o.transactionId] = o;
          });
          dispatch({
            type: SET_OFFERS,
            offers: { ...myOffers },
          });
        }).catch(e => console.log(e));
        setTimeout(closeDrawer, 500);
        SuccessDialog('Logged In', `User ${email}`, 'logged in',
          currentUser.type === 'ADMIN' ? '/join_requests' : currentUser.type === 'MINER'
            ? '/our_mines' : currentUser.type === 'CA' ? '/verification_requests' : null);
      }).catch(error => ErrorDialog('logging in', error));
    };

    const handleSignup = () => {
      history.push('/register');
    };
    return (
      <Paper>
        <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
          <div
            tabIndex={0}
            role="button"
          >
            <div className={classes.content}>
              {localStorage.getItem('username') === null && (
                <div>
                  <AccountCircle className={classes.icon} />
                  <div className={classes.form}>
                    <Typography variant="h4">
                      Log In
                    </Typography>
                    <TextField
                      fullWidth
                      className={classes.input}
                      label="Email"
                      name="email"
                      type="text"
                      value={email}
                      onChange={handleOnchange}
                    />
                    <TextField
                      fullWidth
                      className={classes.input}
                      label="Password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={handleOnchange}
                    />
                    <Button variant="outlined" className={classes.button} onClick={handleLogin}>Login</Button>
                    <Typography variant="h6">
                      Don&#39;t have an account?
                    </Typography>
                    <Button variant="outlined" className={classes.button} onClick={handleSignup}>Signup</Button>
                  </div>
                </div>
              )}
              {localStorage.getItem('username') !== null && (<UserProfile />)}
            </div>
          </div>
        </Drawer>
      </Paper>
    );
  }
}

const style = () => ({
  content: {
    width: 400,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
  },
  icon: {
    fontSize: 250,
    color: 'teal',
  },
  form: {
    textAlign: 'center',
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    fontSize: 20,
    color: 'teal',
    fontWeight: 'bold',
    borderColor: 'teal',
    width: 150,
    marginTop: 10,
    marginBottom: 10,
  },
});

const mapStateToProps = state => ({
  drawerOpen: state.sideDrawer.drawerOpen,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(SideDrawer);
