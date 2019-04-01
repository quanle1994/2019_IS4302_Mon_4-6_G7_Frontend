import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import { SET_CURRENT_PAGE } from '../../reducers/currentPageReducer';
import { OPEN_USER_REGISTRATION_FORM } from '../../zDrawer/SideDrawer';
import { OPEN_PRODUCT_VIEWER } from '../../reducers/productsReducer';
import SideBar from './SideBar';
import OwnershipPaper from './OwnershipComponents/OwnershipPaper';
import {OPEN_CREATE_DEED_DIALOG, OPEN_LIST_DEED_DIALOG} from '../../reducers/deedsReducer';
import ProductDisplay from '../ProductDisplayComponents/ProductDisplay';

//register? feedback?

class ProductCarousel extends React.Component {
  componentWillMount() {
    const { dispatch, register, feedback } = this.props;
    if (register !== undefined) {
      this.setState({}, () => dispatch({
        type: OPEN_USER_REGISTRATION_FORM,
      }));
    }
    this.setState({}, () => dispatch({
      type: SET_CURRENT_PAGE,
      currentPage: 'browse_all_gold',
      products: [],
    }));
    if (this.props.match === undefined) return;
    const { pId, gId, dId } = this.props.match.params;
    if (pId !== undefined) {
      dispatch({
        type: OPEN_PRODUCT_VIEWER,
        pId,
        isView: feedback === undefined,
      });
    }
    if (gId !== undefined) {
      dispatch({
        type: OPEN_CREATE_DEED_DIALOG,
        gId,
      });
    }
    if (dId !== undefined) {
      dispatch({
        type: OPEN_LIST_DEED_DIALOG,
        dId,
      });
    }
  }

  render() {
    const { classes, currentUser } = this.props;
    const isUser = currentUser.username !== undefined && currentUser.type !== 'ADMIN';
    return (
      <div className={classes.container}>
        <div className={classes.sidebar}>
          <SideBar />
        </div>
        <ProductDisplay />
        {isUser && <OwnershipPaper />}
      </div>
    );
  }
}

const style = () => ({
  container: {
    height: '97%',
    marginTop: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  catWrapper: {
    marginTop: 20,
  },
  sidebar: {
    height: '100%',
    width: '22vw',
  },
  products: {
    width: '45vw',
    height: '100%',
    overflowY: 'auto',
  },
  noOwnership: {
    width: '77vw',
    height: '100%',
    overflowY: 'auto',
  },
});

const mapStateToProps = state => ({
  currentUser: state.currentPage.currentUser,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(ProductCarousel);
