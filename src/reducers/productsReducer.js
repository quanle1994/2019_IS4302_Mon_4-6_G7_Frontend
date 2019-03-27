const INITIAL_STATE = {
  products: [],
  filter: '',
  catMapping: {},
  cats: [],
  productViewerOpen: false,
  pId: 0,
  cId: 0,
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

export default function productsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_ALL_PRODUCTS: {
      return ({
        ...state,
        products: action.products,
        catMapping: action.catMapping,
        cats: action.cats,
      });
    }
    case OPEN_PRODUCT_VIEWER: {
      return ({
        ...state,
        productViewerOpen: true,
        pId: action.pId,
        cId: action.cId,
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
