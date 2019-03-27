import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import Button from '@material-ui/core/Button/Button';
import EnhancedTable from '../../../commons/DataTable/EnhancedTable';
import history from '../../../history';

class DeedsTable extends React.Component {
  render() {
    const { classes, dispatch, deeds } = this.props;
    const data = deeds.balance === undefined ? [] : deeds.balance;
    const splitDeeds = (deedId) => {
      history.push(`split_deed/${deedId}`);
    };
    data.forEach(row => row.action = (
      <Button
        style={{ width: 100, fontSize: 11 }}
        variant="contained"
        color="primary"
        onClick={() => splitDeeds(row.id)}
      >
        {row.status === 'FOR_SALE' ? 'TAKE DOWN' : 'LIST'}
      </Button>
    ));
    const tableData = {
      header: 'Gold Deeds',
      config: [
        {
          id: 'maxWeight', numeric: false, disablePadding: true, label: 'Weight (g)',
        },
        {
          id: 'purity', numeric: false, disablePadding: true, label: 'Purity %',
        },
        {
          id: 'unitPrice', numeric: false, disablePadding: true, label: 'Price ($ / g)', isCurrency: true,
        },
        {
          id: 'status', numeric: false, disablePadding: true, label: 'Status',
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
