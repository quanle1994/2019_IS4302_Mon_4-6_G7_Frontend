/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import { SET_CURRENT_PAGE } from '../../reducers/currentPageReducer';
import {getMinerGoldRequests} from '../../commons/RoutineUpdate';
import Requests from './Requests';

class RequestSummary extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: SET_CURRENT_PAGE,
      currentPage: 'gold_requests',
    });
    getMinerGoldRequests(dispatch);
  }

  render() {
    const { classes, dispatch, goldRequests } = this.props;
    const conso = {};
    goldRequests.forEach((o) => {
      const key = `${o.gold.goldId}-${o.gold.purity}}`;
      let requestList = conso[key];
      if (requestList === undefined) requestList = { [o.requestId]: { ...o } };
      else {
        requestList = { ...requestList, [o.requestId]: { ...o } };
      }
      conso[key] = { ...requestList };
    });
    return (
      <div className={classes.container}>
        {Object.keys(conso).map(k => (
          <Requests key={k} requests={conso[k]} />
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
  goldRequests: state.userAssets.goldRequests,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(RequestSummary);
