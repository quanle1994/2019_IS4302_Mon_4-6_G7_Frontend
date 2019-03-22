import Button from '@material-ui/core/Button/Button';
import * as React from 'react';
import {
  injectStripe, CardElement,
} from 'react-stripe-elements';
import './css/paymentStyle.css';
import withStyles from '@material-ui/core/es/styles/withStyles';
import { compose } from 'redux';
import connect from 'react-redux/es/connect/connect';
import $ from 'jquery';

export const UPDATE_PAYMENT_TOKEN_FOR_SALES_ORDER_CREATION = 'UPDATE_PAYMENT_TOKEN_FOR_SALES_ORDER_CREATION';

class PaymentForm extends React.Component {
  render() {
    const { stripe, classes, dispatch } = this.props;

    const handlePayment = (e) => {
      e.preventDefault();
      stripe.createToken().then(payload => dispatch({
        type: UPDATE_PAYMENT_TOKEN_FOR_SALES_ORDER_CREATION,
        token: payload.error !== undefined ? null : {
          id: payload.token.id,
          cardBrand: payload.token.card.brand,
        },
      }));
    };

    const createOptions = () => ({
      style: {
        base: {
          fontSize: 50,
          color: '#424770',
          letterSpacing: '0.025em',
          fontFamily: 'Source Code Pro, monospace',
          '::placeholder': {
            color: '#aab7c4',
          },
          padding: 50,
        },
        invalid: {
          color: '#9e2146',
        },
      },
    });

    return (
      <form id="paymentForm" onSubmit={handlePayment}>
        <label>
          Card number
          <CardElement
            onBlur={() => {
              $('#submitCardButton').click();
              this.setState({}, () => dispatch({
                type: UPDATE_PAYMENT_TOKEN_FOR_SALES_ORDER_CREATION,
                token: null,
              }));
            }}
            // onChange={handleChange}
            // onFocus={handleFocus}
            // onReady={handleReady}
            {...createOptions}
          />
        </label>
        <div className={classes.button}>
          <Button id="submitCardButton" className={classes.button} type="submit" />
        </div>
      </form>
    );
  }
}


const style = {
  button: {
    display: 'none',
  },
};

const mapStateToProps = () => ({});

const mapDispatchToFunctions = dispatch => ({
  dispatch,
});

export default compose(withStyles(style), connect(mapStateToProps,
  mapDispatchToFunctions), injectStripe)(PaymentForm);
