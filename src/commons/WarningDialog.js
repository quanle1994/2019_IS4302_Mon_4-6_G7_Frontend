import swal from 'sweetalert2';
import './css/handling.css';

const WarningDialog = (message, callback) => {
  swal({
    title: 'Warning',
    html: message,
    type: 'error',
    showCancelButton: true,
    confirmButtonColor: '#99B898',
    cancelButtonColor: '#E84A5F',
  }).then((res) => {
    if (res.value) callback();
  });
};

export default WarningDialog;
