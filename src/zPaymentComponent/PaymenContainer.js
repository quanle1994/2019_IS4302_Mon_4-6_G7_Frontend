/* eslint-disable import/no-cycle */
import * as React from 'react';
import withStyles from '@material-ui/core/es/styles/withStyles';
import {
  StripeProvider, Elements,
} from 'react-stripe-elements';
import PaymentForm from './PaymentForm';

class PaymenContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { stripe: null };
  }

  componentWillMount() {
    const script = document.createElement('script');
    script.id = 'stripe-js';
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;

    document.body.appendChild(script);
  }

  componentDidMount() {
    if (window.Stripe) {
      this.setState({ stripe: window.Stripe('pk_test_754ApgbQzQXRH2ZskUfHUr4j') });
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        this.setState({ stripe: window.Stripe('pk_test_754ApgbQzQXRH2ZskUfHUr4j') });
      });
    }
  }

  render() {
    const { stripe } = this.state;
    return (
      <StripeProvider stripe={stripe}>
        <Elements>
          <PaymentForm />
        </Elements>
      </StripeProvider>
    );
  }
}

const style = {};

export default withStyles(style)(PaymenContainer);
