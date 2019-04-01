const INITIAL_STATE = {
  products: [],
  filter: '',
  sort: -1,
  minmax: [],
  productViewerOpen: false,
  pId: 0,
  editPID: 0,
  isView: true,
  sellerProducts: [],
  productEditOpen: false,
  productCreateOpen: false,
};

export const GET_ALL_PRODUCTS = 'GET_ALL_PRODUCTS';
export const OPEN_PRODUCT_VIEWER = 'OPEN_PRODUCT_VIEWER';
export const CLOSE_PRODUCT_VIEWER = 'CLOSE_PRODUCT_VIEWER';
export const UPDATE_PRODUCT_FILTER = 'UPDATE_PRODUCT_FILTER';
export const SET_SELLER_PRODUCTS = 'SET_SELLER_PRODUCTS';
export const OPEN_PRODUCT_EDIT = 'OPEN_PRODUCT_EDIT';
export const CLOSE_PRODUCT_EDIT = 'CLOSE_PRODUCT_EDIT';
export const OPEN_PRODUCT_CREATE = 'OPEN_PRODUCT_CREATE';
export const CLOSE_PRODUCT_CREATE = 'CLOSE_PRODUCT_CREATE';
export const UPDATE_PRODUCT_SORT = 'UPDATE_PRODUCT_SORT';
export const UPDATE_PRODUCT_RANGE = 'UPDATE_PRODUCT_RANGE';

export default function productsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_ALL_PRODUCTS: {
      return ({
        ...state,
        products: action.products,
      });
    }
    case UPDATE_PRODUCT_SORT: {
      return ({
        ...state,
        sort: action.sort,
      });
    }
    case UPDATE_PRODUCT_RANGE: {
      const { minmax } = action;
      const { minmax: range } = state;
      if (minmax[0] !== undefined && minmax[0] !== null) range[0] = parseFloat(minmax[0]);
      if (minmax[1] !== undefined && minmax[1] !== null) range[1] = parseFloat(minmax[1]);
      return ({
        ...state,
        minmax: [...range],
      });
    }
    case OPEN_PRODUCT_VIEWER: {
      return ({
        ...state,
        productViewerOpen: true,
        pId: action.pId,
        isView: action.isView,
      });
    }
    case CLOSE_PRODUCT_VIEWER: {
      return ({
        ...state,
        productViewerOpen: false,
        pId: 0,
      });
    }
    case UPDATE_PRODUCT_FILTER: {
      return ({
        ...state,
        filter: action.filter,
      });
    }
    case SET_SELLER_PRODUCTS: {
      return ({
        ...state,
        sellerProducts: action.sellerProducts,
      });
    }
    case OPEN_PRODUCT_CREATE: {
      return ({
        ...state,
        productCreateOpen: true,
      });
    }
    case CLOSE_PRODUCT_CREATE: {
      return ({
        ...state,
        productCreateOpen: false,
      });
    }
    case OPEN_PRODUCT_EDIT: {
      return ({
        ...state,
        productEditOpen: true,
        editPID: action.editPID,
      });
    }
    case CLOSE_PRODUCT_EDIT: {
      return ({
        ...state,
        productEditOpen: false,
      });
    }
    default: return state;
  }
}
