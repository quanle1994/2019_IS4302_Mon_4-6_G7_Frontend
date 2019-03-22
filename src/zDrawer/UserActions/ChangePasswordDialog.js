import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';
import Dialog from '@material-ui/core/Dialog/Dialog';
import { CLOSE_REGISTRATION_FORM } from './UserRegistration';
import ErrorDialog from '../../commons/ErrorDialog';
import SuccessDialog from '../../commons/SuccessDialog';
import InvalidationDialog from '../../commons/InvalidationDialog';
import loginApi from '../../api/login';

export const CLOSE_CHANGE_PASSWORD_FORM = 'CLOSE_CHANGE_PASSWORD_FORM';
class ChangePasswordDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      confirmPassword: '',
      newPassword: '',
    };
  }

  handleChangePassword = () => {
    const { oldPassword, confirmPassword, newPassword } = this.state;
    if (oldPassword !== confirmPassword) InvalidationDialog('Old password does not match');
    const req = {
      id: localStorage.getItem('id'),
      password: oldPassword,
      newPassword,
    };
    loginApi.changePassword(req).then(() => {
      SuccessDialog('Change Password Successful!', 'Password', 'changed');
      setTimeout(this.handleCloseForm, 500);
    }).catch(error => ErrorDialog('changing password', error));
  };

  handleCloseForm = () => {
    const { dispatch } = this.props;
    dispatch({
      type: CLOSE_CHANGE_PASSWORD_FORM,
    });
  };

  render() {
    const { oldPassword, confirmPassword, newPassword } = this.state;
    const { classes, changePasswordOpen } = this.props;
    const error = confirmPassword !== '' && confirmPassword !== oldPassword;
    const handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    };
    return (
      <Dialog
        open={changePasswordOpen}
        onClose={this.handleCloseForm}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            className={classes.input}
            label="Old Password"
            name="oldPassword"
            type="password"
            value={oldPassword}
            onChange={handleChange}
          />
          <TextField
            error={error}
            fullWidth
            className={classes.input}
            label={error ? 'Password does not match' : 'Confirm Password'}
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            className={classes.input}
            label="New Password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={this.handleChangePassword}>Submit</Button>
          <Button variant="outlined" onClick={this.handleCloseForm}>Cancel</Button>
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
  input: {
    marginTop: 10,
  },
});

const mapStateToProps = state => ({
  changePasswordOpen: state.sideDrawer.changePasswordOpen,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(ChangePasswordDialog);
