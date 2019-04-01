/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import { SET_CURRENT_PAGE } from '../../reducers/currentPageReducer';
import Offers from './Offer';

class OffersSummary extends React.Component {
  componentWillMount() {
    const { dispatch, offers } = this.props;
    dispatch({
      type: SET_CURRENT_PAGE,
      currentPage: 'offers',
    });
  }

  render() {
    const { classes, dispatch, offers } = this.props;
    const conso = {};
    Object.values(offers).forEach((o) => {
      let offerList = conso[o.deedToBuy.deedId];
      if (offerList === undefined) offerList = { [o.transactionId]: { ...o } };
      else {
        offerList = { ...offerList, [o.transactionId]: { ...o } };
      }
      conso[o.deedToBuy.deedId] = { ...offerList };
    });
    return (
      <div className={classes.container}>
        {Object.keys(conso).map(k => (
          <Offers offers={conso[k]} />
        ))}
      </div>
    );
  }
}

const style = () => ({
  container: {
    height: '100%',
    width: '100%',
    marginBottom: 100,
  },
});

const mapStateToProps = state => ({
  offers: state.offers.offers,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(OffersSummary);
