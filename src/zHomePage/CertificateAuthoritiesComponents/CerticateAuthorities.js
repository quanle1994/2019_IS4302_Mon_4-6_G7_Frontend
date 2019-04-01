import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import { SET_CURRENT_PAGE } from '../../reducers/currentPageReducer';
import sellerApi from '../../api/seller';
import { SET_CAS } from '../../reducers/usersReducer';
import CaCard from './CaCard';

class CerticateAuthorities extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    this.setState({}, () => dispatch({
      type: SET_CURRENT_PAGE,
      currentPage: 'certificate_authorities',
      products: [],
    }));
    sellerApi.getAllCas().then(res => dispatch({
      type: SET_CAS,
      cas: res.data,
    })).catch(e => console.log(e));
  }

  render() {
    const {
      classes, cas,
    } = this.props;
    return (
      <div className={classes.container}>
        <div>
          {cas.map(ca => (
            <CaCard ca={ca} />
          ))}
        </div>
      </div>
    );
  }
}

const style = () => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
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
  cas: state.users.cas,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(CerticateAuthorities);
