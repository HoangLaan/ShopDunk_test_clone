import types from 'pages/FileManager/actions/types';
import {defaultPaging} from 'utils/helpers';

const INITIAL_STATE = {
  selectedFile: {},
  typeOfDocumentsList: undefined,
  tagList: defaultPaging,
  userList: [],
  companyList: [],
  departmentList: [],
  listShare: defaultPaging,
  allItemsArrayColumn: [],
  allItemsList: defaultPaging,
  searchAllList: defaultPaging,
  informationFileData: undefined,
  informationDirectoryData: undefined,
  showSearchFunction: false,
  getTypeOfDocumentsLoading: false,
  getAllItemsListLoading: false,
  getAllItemsReplaceLoading: false,
  getInformationFileDataLoading: false,
  getInformationDirectoryDataLoading: false,
  getTagLoading: false,
  getListShareLoading: false,
  getUserLoading: false,
  getCompanyLoading: false,
  getDepartmentLoading: false,
  addDirLoading: false,
  deleteLoading: false,
  shareLoading: false,
  searchAllLoading: false,
  uploadFileLoading: false,
  dowloadFileLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_TYPE_DOCUMENTS_REQUEST:
      return {
        ...state,
        showSearchFunction: false,
        informationFileData: undefined,
        allItemsArrayColumn: [],
        getTypeOfDocumentsLoading: true,
      };
    case types.GET_TYPE_DOCUMENTS_SUCCESS:
      return {
        ...state,
        typeOfDocumentsList: action.payload,
        getTypeOfDocumentsLoading: false,
      };
    case types.GET_TYPE_DOCUMENTS_FAILURE:
      return {
        ...state,
        getTypeOfDocumentsLoading: false,
      };

    case types.GET_ALL_ITEMS_REQUEST:
      return {
        ...state,
        informationFileData: undefined,
        dowloadFileLoading: false,
        allItemsList: [],
        getAllItemsListLoading: true,
      };
    case types.GET_ALL_ITEMS_SUCCESS:
      return {
        ...state,
        allItemsList: action.payload,
        getAllItemsListLoading: false,
      };
    case types.GET_ALL_ITEMS_FAILURE:
      return {
        ...state,
        getAllItemsListLoading: false,
      };

    case types.GET_ALL_ITEMS_COLUMN_REQUEST: {
      const cloneState = {...state};
      cloneState.informationFileData = undefined;
      cloneState.allItemsArrayColumn.push({
        loading: true,
      });
      return cloneState;
    }
    case types.GET_ALL_ITEMS_COLUMN_SUCCESS: {
      const cloneState = {...state};
      console.log(action.payload)
      cloneState.allItemsArrayColumn[cloneState.allItemsArrayColumn.length - 1] = {...action.payload, loading: false};
      // cloneState.allItemsList = action.payload;
      return cloneState;
    }
    case types.DELETE_ITEMS_COLUMN: {
      const indexValue = action.payload;
      const cloneState = {...state};
      cloneState.informationFileData = undefined;
      cloneState.allItemsArrayColumn = cloneState.allItemsArrayColumn.slice(0, indexValue);
      return cloneState;
    }

    case types.GET_ALL_ITEMS_REPLACE_COLUMN_REQUEST: {
      const indexColumn = action.payload.indexColumn;
      delete action.payload.indexColumn;
      const cloneState = {...state};
      cloneState.allItemsArrayColumn[indexColumn - 1] = {
        loading: true,
      };
      cloneState.getAllItemsReplaceLoading = false;
      return cloneState;
    }

    case types.GET_ALL_ITEMS_REPLACE_COLUMN_SUCCESS: {
      const indexColumn = action.payload.indexColumn;
      delete action.payload.indexColumn;
      const cloneState = {...state};
      cloneState.allItemsArrayColumn[indexColumn - 1] = {...action.payload, loading: false};
      cloneState.getAllItemsReplaceLoading = false;
      cloneState.informationFileData = undefined;
      return cloneState;
    }

    case types.GET_INFORMATION_FILE_REQUEST:
      return {
        ...state,
        informationFileData: undefined,
        getInformationFileDataLoading: true,
      };
    case types.GET_INFORMATION_FILE_SUCCESS:
      return {
        ...state,
        informationFileData: action.payload,
        getInformationFileDataLoading: false,
      };

    case types.GET_INFORMATION_DIRECTORY_REQUEST:
      return {
        ...state,
        informationFileData: undefined,
        informationDirectoryData: undefined,
        getInformationDirectoryDataLoading: true,
      };
    case types.GET_INFORMATION_DIRECTORY_SUCCESS:
      return {
        ...state,
        informationDirectoryData: action.payload,
        getInformationDirectoryDataLoading: false,
      };

    case types.GET_INFORMATION_DIRECTORY_FAILURE:
      return {
        ...state,
        getInformationDirectoryDataLoading: false,
      };

    case types.GET_ALL_ITEMS_COLUMN_FAILURE:
      return {
        ...state,
        informationFileData: undefined,
        informationDirectoryData: undefined,
        getInformationFileDataLoading: false,
      };

    case types.CLEAR_INFORMMATION_DATA:
      return {
        ...state,
        informationFileData: undefined,
      };

    case types.CREATE_DIR_REQUEST:
      return {
        ...state,
        addDirLoading: true,
      };
    case types.CREATE_DIR_SUCCESS:
    case types.CREATE_DIR_FAILURE:
      return {
        ...state,
        addDirLoading: false,
      };

    case types.UPLOAD_FILE_REQUEST:
      return {
        ...state,
        informationFileData: undefined,
        uploadFileLoading: true,
      };
    case types.UPLOAD_FILE_SUCCESS:
    case types.UPLOAD_FILE_FAILURE:
      return {
        ...state,
        uploadFileLoading: false,
      };

    case types.DOWLOAD_FILE_REQUEST:
      return {
        ...state,
        dowloadFileLoading: true,
      };
    case types.DOWLOAD_FILE_SUCCESS:
    case types.DOWLOAD_FILE_FAILURE:
      return {
        ...state,
        dowloadFileLoading: false,
      };

    case types.GET_TAG_REQUEST:
      return {
        ...state,
        getTagLoading: true,
      };
    case types.GET_TAG_SUCCESS:
      return {
        ...state,
        tagList: action.payload,
        getTagLoading: false,
      };
    case types.GET_TAG_FAILURE:
      return {
        ...state,
        getTagLoading: false,
      };

    case types.GET_LIST_SHARE_REQUEST:
      return {
        ...state,
        listShare: defaultPaging,
        getListShareLoading: true,
      };
    case types.GET_LIST_SHARE_SUCCESS:
      return {
        ...state,
        listShare: action.payload,
        getListShareLoading: false,
      };
    case types.GET_LIST_SHARE_FAILURE:
      return {
        ...state,
        getListShareLoading: false,
      };

    case types.GET_USER_REQUEST:
      return {
        ...state,
        getUserLoading: true,
      };
    case types.GET_USER_SUCCESS:
      return {
        ...state,
        userList: action.payload,
        getUserLoading: false,
      };
    case types.GET_USER_FAILURE:
      return {
        ...state,
        getUserLoading: false,
      };

    case types.GET_DEPARTMENT_REQUEST:
      return {
        ...state,
        getDepartmentLoading: true,
      };
    case types.GET_DEPARTMENT_SUCCESS:
      return {
        ...state,
        departmentList: action.payload,
        getDepartmentLoading: false,
      };
    case types.GET_DEPARTMENT_FAILURE:
      return {
        ...state,
        getDepartmentLoading: false,
      };

    case types.GET_COMPANY_REQUEST:
      return {
        ...state,
        getCompanyLoading: true,
      };
    case types.GET_COMPANY_SUCCESS:
      return {
        ...state,
        companyList: action.payload,
        getCompanyLoading: false,
      };
    case types.GET_COMPANY_FAILURE:
      return {
        ...state,
        getCompanyLoading: false,
      };

    case types.SHARE_REQUEST:
      return {
        ...state,
        shareLoading: true,
      };
    case types.SHARE_SUCCESS:
    case types.SHARE_FAILURE:
      return {
        ...state,
        shareLoading: false,
      };

    case types.DELETE_ITEMS_REQUEST:
      return {
        ...state,
        deleteLoading: true,
        informationFileData: undefined,
      };
    case types.DELETE_ITEMS_SUCCESS:
    case types.DELETE_ITEMS_FAILURE:
      return {
        ...state,
        deleteLoading: false,
      };

    case types.SHOW_SEARCH_FUNCTION:
      return {
        ...state,
        informationFileData: undefined,
        showSearchFunction: true,
      };
    case types.HIDE_SEARCH_FUNCTION:
      return {
        ...state,
        searchAllList: [],
        informationFileData: undefined,
        showSearchFunction: false,
      };

    case types.SEARCH_ALL_REQUEST:
      return {
        ...state,
        informationFileData: undefined,
        allItemsList: defaultPaging,
        searchAllLoading: true,
      };
    case types.SEARCH_ALL_SUCCESS:
      return {
        ...state,
        informationFileData: undefined,
        searchAllList: action.payload,
        searchAllLoading: false,
      };
    case types.SEARCH_ALL_FAILURE:
      return {
        ...state,
        searchAllLoading: false,
      };
    case types.SELECTED_FILE:
      return {
        ...state,
        selectedFile: action.payload,
      };
    default:
      return state;
  }
}
