import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import { Paper, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import history from '../../../history';
import EnhancedTable from '../../../commons/DataTable/EnhancedTable';

// const config = [
//   { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
//   { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
//   { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
//   { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
//   { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
// ];

class GoldTable extends React.Component {
  render() {
    const { classes, dispatch, golds } = this.props;
    const data = golds === undefined ? [] : golds;
    const convertGoldToDeeds = (goldId) => {
      history.push(`create_deed/${goldId}`);
    };
    data.forEach(row => row.convert = row.goldWeight === 0 || localStorage.getItem('type') !== 'CertificateAuthority' ? null : (
      <Button
        style={{ fontSize: 11 }}
        variant="contained"
        color="primary"
        onClick={() => convertGoldToDeeds(row.goldId)}
      >Create Deed
      </Button>
    ));
    const tableData = {
      header: 'Physical Gold',
      config: [
        {
          id: 'goldWeight', numeric: false, disablePadding: true, label: 'Weight (g)',
        },
        {
          id: 'weightListed', numeric: false, disablePadding: true, label: 'Listed (g)',
        },
        {
          id: 'goldPurity', numeric: false, disablePadding: true, label: 'Purity %',
        },
        {
          id: 'ca', numeric: false, disablePadding: true, label: 'Verified By',
        },
        {
          id: 'convert', numeric: false, disablePadding: true, label: 'Convert To Deeds', isButton: true,
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

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(GoldTable);
