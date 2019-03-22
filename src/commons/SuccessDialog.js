import swal from 'sweetalert2';
import history from '../history';
import './css/handling.css';

const SuccessDialog = (title, type, actions, redirect, callback) => {
  swal({
    title: `${title}`,
    html: `${type} has been ${actions}`,
    type: 'success',
    showCloseButton: true,
    CloseButtonText: 'BACK',
    customClass: '.swal2-container',
  }).then(() => {
    if (redirect !== null && redirect !== undefined) {
      history.push(redirect);
    }
    if (callback !== undefined) callback();
  });
};

export default SuccessDialog;
