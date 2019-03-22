import swal from 'sweetalert2';
import './css/handling.css';

const ErrorDialog = (message, error) => {
  let systemMessage = '';
  if (error !== null) {
    if (error.response === undefined || error.response === null) {
      systemMessage = error.message;
    } else if (error.response.data === null || error.response.data === undefined) {
      systemMessage = error.response.statusText;
    } else {
      systemMessage = error.response.data.message;
    }
  } else {
    systemMessage = 'Internal Server Error';
  }

  swal({
    title: 'ERROR!',
    html: ` An error has occurred when ${message} <br/> Error Message : ${systemMessage}`,
    type: 'error',
    confirmButtonColor: '#d33',
    confirmButtonText: 'OK',
    customClass: '.swal2-container',
  });
};

export default ErrorDialog;
