import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import Button from '@material-ui/core/Button/Button';
import EnhancedTable from '../../../commons/DataTable/EnhancedTable';
import history from '../../../history';
import listingsApi from '../../../api/listings';
import SuccessDialog from '../../../commons/SuccessDialog';
import sellerApi from '../../../api/seller';
import { SET_ASSETS } from '../../../reducers/userAssetsReducer';
import { GET_ALL_PRODUCTS } from '../../../reducers/productsReducer';

class DeedsTable extends React.Component {
  render() {
    const { classes, dispatch, deeds } = this.props;
    const data = deeds === undefined ? [] : deeds;
    const splitDeeds = (row) => {
      if (row.listingState !== 'FOR_SALE') history.push(`list_deed/${row.deedId}`);
      else {
        listingsApi.delist({
          deedId: row.deedId,
        }).then(() => SuccessDialog('Delisting Successfully', 'Deed', 'taken down', null, () => {
          sellerApi.getAllAssets().then((res) => {
            this.setState({ ...res.data }, () => dispatch({
              type: SET_ASSETS,
              assets: { ...res.data },
            }));
          }).catch(e => console.log(e));
          listingsApi.getAllListings().then((response) => {
            this.setState({}, () => dispatch({
              type: GET_ALL_PRODUCTS,
              products: response.data,
            }));
          });
        }));
      }
    };
    data.forEach((row) => {
      row.action = (
        <Button
          style={{ width: 100, fontSize: 11 }}
          variant="contained"
          color="primary"
          onClick={() => splitDeeds(row)}
        >
          {row.listingState === 'FOR_SALE' ? 'TAKE DOWN' : 'LIST'}
        </Button>
      );
      row['weight/listed'] = `${row.goldWeight} / ${row.listingState !== 'FOR_SALE' ? 0 : row.weightListed}`;
    });
    const tableData = {
      header: 'Gold Deeds',
      config: [
        {
          id: 'weight/listed', numeric: false, disablePadding: true, label: 'W / Listed (g)',
        },
        {
          id: 'purity', numeric: false, disablePadding: true, label: 'Purity %',
        },
        {
          id: 'price', numeric: false, disablePadding: true, label: 'Price ($ / g)', isCurrency: true,
        },
        {
          id: 'listingState', numeric: false, disablePadding: true, label: 'Status',
        },
        {
          id: 'action', numeric: false, disablePadding: true, label: 'Action', isButton: true,
        },
      ],
      data,
    };
    return (
      <div className={classes.container}>
        <EnhancedTable tableData={tableData} />
      </div>
    );
  }
}

const style = () => ({
  container: {
    height: '100%',
    width: '100%',
    overflowY: 'hidden',
  },
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(DeedsTable);
