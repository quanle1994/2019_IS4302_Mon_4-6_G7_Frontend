import React from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/es/styles/withStyles';
import connect from 'react-redux/es/connect/connect';
import Typography from '@material-ui/core/Typography/Typography';
import Paper from '@material-ui/core/Paper/Paper';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableFooter from '@material-ui/core/TableFooter/TableFooter';
import TablePagination from '@material-ui/core/TablePagination/TablePagination';
import Button from '@material-ui/core/Button/Button';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel/TableSortLabel';
import classNames from 'classnames';
import InputBase from '@material-ui/core/InputBase/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import TextField from '@material-ui/core/TextField/TextField';
import { SET_CURRENT_PAGE } from '../reducers/currentPageReducer';
import ErrorDialog from '../commons/ErrorDialog';
import adminApi from '../api/admin';

export const GET_ALL_USERS = 'GET_ALL_USERS';
class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 5,
      users: [],
      selectedHeaders: [],
      order: {},
      filterField: 'allfields',
      filterValue: '',
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    this.getAllUser();
    this.setState({}, () => dispatch({
      type: SET_CURRENT_PAGE,
      currentPage: 'join_requests',
    }));
  }

  componentWillReceiveProps(nextProps) {
    const { filterValue } = this.state;
    const dummy = { target: { value: filterValue } };
    this.handleFilter(dummy, nextProps);
  }

  getAllUser() {
    const { dispatch } = this.props;
    adminApi.getAllUsers().then(response => this.setState({
      users: response.data,
    }, () => {
      dispatch({
        type: GET_ALL_USERS,
        data: response.data,
      });
    })).catch(error => ErrorDialog('getting all users', error));
  }

  sortUsers = () => {
    const { users, selectedHeaders, order } = this.state;
    const newUsers = users.sort((u1, u2) => {
      let result = 0;
      selectedHeaders.map((header) => {
        const check = u1[header] > u2[header] ? 1 : u1[header] === u2[header] ? 0 : -1;
        if (!order[header] && result === 0) result = check;
        else if (order[header] && result === 0) result = -1 * check;
        console.log(`Comparing ${u1[header]} with ${u2[header]}, result = ${result}`);
        return true;
      });
      // console.log(`Comparing ${u1[header]} with ${u2[header]}, result = ${result}` );
      return result;
    });

    this.setState({
      users: newUsers,
    });
  };

  createSortHandler = (header) => {
    const { order, selectedHeaders } = this.state;
    const index = selectedHeaders.indexOf(header);
    if (index >= 0) selectedHeaders.splice(index, 1);
    if (order[header] !== undefined && !order[header]) {
      delete order[header];
    } else {
      if (index < 0) selectedHeaders.push(header);
      else selectedHeaders.splice(index, 0, header);
      if (order[header] === undefined) order[header] = true;
      else order[header] = false;
    }
    this.setState({
      order,
      selectedHeaders,
    });
    this.sortUsers();
  };

  handleFilter = (e, props) => {
    const { allUsers } = this.props;
    const { filterField } = this.state;
    const filterValue = e.target.value;
    this.setState({ filterValue });
    const users = props !== undefined ? props.allUsers : allUsers;
    const filteredUsers = users.filter((u) => {
      let orgString = '';
      if (filterField === 'allfields') {
        orgString = Object.values(u).reduce((f1, f2) => `${f1}|${f2}`);
      } else {
        orgString = u[filterField];
      }
      return orgString.toString().toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
    });
    this.setState({
      users: filteredUsers,
    });
  };

  render() {
    const { classes } = this.props;
    const {
      page, rowsPerPage, users, order, filterField,
    } = this.state;
    const headers = ['ID', 'User Name', 'Full Name', 'Email', 'Type', 'Gender', 'DOB', 'Status', 'Action'];
    const ids = ['id', 'username', 'fullname', 'emailAddress', 'type', 'gender', 'dob', 'status'];
    const handleChangePage = (event, page) => { this.setState({ page }); };
    const handleChangeRowsPerPage = (event) => {
      this.setState({
        rowsPerPage: event.target.value,
      });
    };
    const handleToggle = id => adminApi.toggleActivity(id)
      .then(() => this.getAllUser()).catch(error => ErrorDialog('changing user\'s activity', error));
    const formatDate = (rawValue) => {
      const value = new Date(rawValue);
      return value.toDateString();
    };
    const handleChangeFilterField = e => this.setState({
      filterField: e.target.value,
    });
    return (
      <div className={classes.container}>
        <Typography variant="h4" className={classes.header}>All Users</Typography>
        <Paper className={classes.wrapper}>
          <div className={classes.filterWrapper}>
            <div className={classNames([classes.search, classes.filterBar])}>
              <TextField
                select
                className={classes.filterField}
                value={filterField}
                fullWidth
                onChange={handleChangeFilterField}
              >
                <MenuItem key="allfields" value="allfields">All Fields</MenuItem>
                {headers.slice(0, headers.length - 1).map((header, index) => (
                  <MenuItem key={ids[index]} value={ids[index]}>{header}</MenuItem>
                ))}
              </TextField>
              <InputBase
                placeholder="Filter…"
                onChange={this.handleFilter}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell padding="dense" style={{ cursor: 'pointer' }}>
                    <Tooltip
                      title="sort"
                      placement="top-start"
                      enterDelay={200}
                    >
                      <TableSortLabel
                        active={order[ids[index]] !== undefined}
                        direction={order[ids[index]] ? 'asc' : 'desc'}
                        onClick={() => { this.createSortHandler(ids[index]); }}
                      >
                        {header}
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {users.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(user => (
                <TableRow>
                  {ids.map(id => (
                    <TableCell padding="dense">{id === 'dob' ? formatDate(user[id]) : user[id]}</TableCell>
                  ))}
                  <TableCell padding="dense">
                    <Button variant="outlined" className={classes.activateButton} onClick={() => handleToggle(user.id)}>
                      {user.statusOrdinal === 0 ? 'Deactivate' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={ids.length}
                  count={users.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      </div>
    );
  }
}

const style = theme => ({
  container: {
    height: '100%',
    width: '100%',
    textAlign: 'center',
    // backgroundColor: 'LightGray',
    padding: 20,
    boxSizing: 'border-box',
    borderRadius: 5,
  },
  header: {
    color: '#E84A5F',
    marginBottom: 20,
  },
  wrapper: {
    backgroundColor: '#FECEAB',
  },
  tableBody: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  activateButton: {
    width: 100,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  inputRoot: {
    color: 'inherit',
    display: 'flex',
    flex: 'auto',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 5,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  filterBar: {
    marginTop: 8,
    height: 33,
    width: '50%',
    float: 'right',
  },
  filterField: {
    width: theme.spacing.unit * 18,
    float: 'left',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  allUsers: state.currentPage.allUsers,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default compose(withStyles(style), connect(mapStateToProps, mapDispatchToProps))(AdminPage);
