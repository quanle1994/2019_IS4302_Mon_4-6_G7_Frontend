import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import EnhancedTable from '../../../commons/DataTable/EnhancedTable';

class DeedsTable extends React.Component {
  render() {
    const { classes, dispatch, deeds } = this.props;
    const tableData = {
      header: 'Gold Deeds',
      config: [
        {
          id: 'maxWeight', numeric: false, disablePadding: true, label: 'Max Weight (g)',
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
      ],
      data: deeds.balance === undefined ? [] : deeds.balance,
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
