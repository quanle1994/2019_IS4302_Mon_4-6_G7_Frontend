import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import { SET_CURRENT_PAGE } from '../../reducers/currentPageReducer';
import sellerApi from '../../api/seller';
import { SET_MINERS } from '../../reducers/usersReducer';
import MinerCard from './MinerCard';
import { getCASaleRequests } from '../../commons/RoutineUpdate';

class MineCatalogue extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    this.setState({}, () => dispatch({
      type: SET_CURRENT_PAGE,
      currentPage: 'our_mines',
      products: [],
    }));
    sellerApi.getAllMiners().then(res => dispatch({
      type: SET_MINERS,
      miners: res.data,
    })).catch(e => console.log(e));
    if (localStorage.getItem('type') === 'CertificateAuthority') getCASaleRequests(dispatch);
  }

  render() {
    const { classes, miners } = this.props;
    return (
      <div className={classes.container}>
        {miners !== undefined && miners.map(miner => (
          <MinerCard miner={miner} />
        ))}
      </div>
    );
  }
}

const style = () => ({
  container: {
    height: '100%',
    width: '100%',
    float: 'left',
  },
  catWrapper: {
    marginTop: 20,
  },
  products: {
    minWidth: '100%',
    overflowX: 'scroll',
    display: 'flex',
    flexDirection: 'row',
  },
});

const mapStateToProps = state => ({
  miners: state.users.miners,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(MineCatalogue);
