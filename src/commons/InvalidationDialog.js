import swal from 'sweetalert2';
import './css/handling.css';

const InvalidationDialog = (message) => {
  swal({
    title: 'INVALID SUBMISSION',
    html: message,
    type: 'error',
    confirmButtonColor: '#d33',
    confirmButtonText: 'OK',
    customClass: '.swal2-container',
  });
};

export default InvalidationDialog;
