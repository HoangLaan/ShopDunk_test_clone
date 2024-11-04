import types from 'pages/FileManager/actions/types';
import { showToast } from 'utils/helpers';
import httpClient from 'utils/httpClient';

class FileManager {
  uploadFile = (formValue, onUploadProgress) => {
    let formData = new FormData();

    for (let i of formValue.files) {
      formData.append('files', i);
    }

    formData.append('data', formValue['data']);

    return httpClient.post('/file-manager/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onUploadProgress,
    }
    );
  };

  _api = httpClient;

  addAllItemsArrayColumn = () => ({ type: types.ADD_ALL_ITEMS_COLUMN_ARRAY });

  // #region getTypeDocument
  getTypeDocumentsRequest = () => ({
    type: types.GET_TYPE_DOCUMENTS_REQUEST,
  });
  getTypeDocumentsSuccess = response => ({
    type: types.GET_TYPE_DOCUMENTS_SUCCESS,
    payload: response,
  });
  getTypeDocumentsFailure = error => ({
    type: types.GET_TYPE_DOCUMENTS_FAILURE,
    payload: error,
  });
  getTypeDocuments = params => async dispatch => {
    const API_GET_TYPE_DOCUMENT = '/file-manager/type-document';
    dispatch(this.getTypeDocumentsRequest());
    try {
      const getApi = await this._api.get(API_GET_TYPE_DOCUMENT, {params});
      dispatch(this.getTypeDocumentsSuccess(getApi));
    } catch (error) {
      dispatch(this.getTypeDocumentsFailure(error));
    }
  };
  // #endregion

  // #region get all item
  getAllItemsRequest = () => ({
    type: types.GET_ALL_ITEMS_REQUEST,
  });
  getAllItemsSuccess = response => ({
    type: types.GET_ALL_ITEMS_SUCCESS,
    payload: response,
  });
  getAllItemsFailure = error => ({
    type: types.GET_ALL_ITEMS_FAILURE,
    payload: error,
  });
  getAllItems = params => async dispatch => {
    const API_GET_ALL_ITEMS = '/file-manager/all';
    dispatch(this.getAllItemsRequest());
    try {
      const getApi = await this._api.get(API_GET_ALL_ITEMS, {params});
      dispatch(this.getAllItemsSuccess(getApi));
    } catch (error) {
      dispatch(this.getAllItemsFailure(error));
    }
  };
  // #endregion

  // #region detail information file
  getInformationFileRequest = () => ({
    type: types.GET_INFORMATION_FILE_REQUEST,
  });
  getInformationFileSuccess = response => ({
    type: types.GET_INFORMATION_FILE_SUCCESS,
    payload: response,
  });
  getInformationFileFailure = error => ({
    type: types.GET_INFORMATION_FILE_FAILURE,
    payload: error,
  });

  getInformationFile = id => async dispatch => {
    const API_GET_INFORMATION_FILE = `/file-manager/infor-file/${id}`;
    dispatch(this.getInformationFileRequest());
    try {
      const getApi = await this._api.get(API_GET_INFORMATION_FILE);
      dispatch(this.getInformationFileSuccess(getApi));
    } catch (error) {
      dispatch(this.getInformationFileFailure(error));
    }
  };

  getInformationFileWithOutDispatch = async id => {
    const API_GET_INFORMATION_FILE = `/file-manager/infor-file/${id}`;
    try {
      const getApi = await this._api.get(API_GET_INFORMATION_FILE);
      return getApi;
    } catch (error) {
      return error;
    }
  };
  // #endregion

  // #region detail information file
  getInformationDirectoryRequest = () => ({
    type: types.GET_INFORMATION_DIRECTORY_REQUEST,
  });
  getInformationDirectorySuccess = response => ({
    type: types.GET_INFORMATION_DIRECTORY_SUCCESS,
    payload: response,
  });
  getInformationDirectoryFailure = error => ({
    type: types.GET_INFORMATION_DIRECTORY_FAILURE,
    payload: error,
  });

  getInformationDirectory = id => async dispatch => {
    const API_GET_INFORMATION_FILE = `/file-manager/infor-directory/${id}`;
    dispatch(this.getInformationDirectoryRequest());
    try {
      const getApi = await this._api.get(API_GET_INFORMATION_FILE);
      dispatch(this.getInformationDirectorySuccess(getApi));
    } catch (error) {
      dispatch(this.getInformationDirectoryFailure(error));
    }
  };

  getInformationDirectoryWithOutDispatch = async id => {
    const API_GET_INFORMATION_DIRECTORY = `/file-manager/infor-directory/${id}`;
    try {
      const getApi = await this._api.get(API_GET_INFORMATION_DIRECTORY);
      return getApi;
    } catch (error) {
      return error;
    }
  };
  // #endregion

  // #region get all Item
  gettAllItemsColumnRequest = response => ({ type: types.GET_ALL_ITEMS_COLUMN_REQUEST, payload: response });
  gettAllItemsColumnSuccess = response => ({
    type: types.GET_ALL_ITEMS_COLUMN_SUCCESS,
    payload: response,
  });
  gettAllItemsColumnsFailure = error => ({
    type: types.GET_ALL_ITEMS_COLUMN_FAILURE,
    payload: error,
  });

  getAllItemsColumns = params => async dispatch => {
    const API_GET_ALL_ITEMS = '/file-manager/all';
    console.log(params)
    dispatch(this.gettAllItemsColumnRequest());
    try {
      const getApi = await this._api.get(API_GET_ALL_ITEMS, { params });
      dispatch(this.gettAllItemsColumnSuccess({...getApi, message: 'Lấy dữ liệu thành công'}));
    } catch (error) {
      dispatch(this.gettAllItemsColumnsFailure({error, message: "Lấy dữ liệu thất bại"}));
    }
  };

  gettAllItemsReplaceColumnRequest = response => ({
    type: types.GET_ALL_ITEMS_REPLACE_COLUMN_REQUEST,
    payload: response,
  });
  gettAllItemsReplaceColumnSuccess = response => ({
    type: types.GET_ALL_ITEMS_REPLACE_COLUMN_SUCCESS,
    payload: response,
  });
  gettAllItemsReplaceColumnFailure = error => ({
    type: types.GET_ALL_ITEMS_REPLACE_COLUMN_FAILURE,
    payload: error,
  });

  getAllItemsReplaceColums = params => async dispatch => {
    const API_GET_ALL_ITEMS = '/file-manager/all';
    dispatch(
      this.gettAllItemsReplaceColumnRequest({
        indexColumn: params.indexColumn,
      }),
    );
    const params_1 = {
      directory_id: params?.directory_id,
      document_type_id: params?.document_type_id,
      itemsPerPage: 500,
      page: 1,
    }
    try {
      const getApi = await this._api.get(API_GET_ALL_ITEMS, { params: params_1 });
      dispatch(
        this.gettAllItemsReplaceColumnSuccess({
          ...getApi,
          indexColumn: params.indexColumn,
        }),
      );
    } catch (error) {
      dispatch(this.gettAllItemsReplaceColumnFailure({error, message: error?.errors?.message}));
    }
  };
  //#endregion

  deleteItemColumns = indexValue => dispatch => {
    dispatch({ type: types.DELETE_ITEMS_COLUMN, payload: indexValue });
  };

  // #region create dir
  createDirRequest = () => ({
    type: types.CREATE_DIR_REQUEST,
  });
  createDirSuccess = response => ({
    type: types.CREATE_DIR_SUCCESS,
    payload: response,
  });
  createDirFailure = error => ({
    type: types.CREATE_DIR_FAILURE,
    payload: error,
  });
  createDir = data => async dispatch => {
    const API_CREATE_DIR = '/file-manager/dir';
    dispatch(this.createDirRequest());
    try {
      const getApi = await this._api.post(API_CREATE_DIR, data);
      dispatch(this.createDirSuccess({...getApi, message: 'Tạo thư mục thành công'}));
      // showToast.success('Tạo thư mục thành công');
    } catch (error) {
      dispatch(this.createDirFailure({error, message: 'Tạo thư mục thất bại'}));
      // showToast.error(error?.errors?.message, 'error');
    }
  };
  // #endregion

  // #region create dir
  createDocumentRequest = () => ({
    type: types.CREATE_DOCUMENT_REQUEST,
  });
  createDocumentSuccess = response => ({
    type: types.CREATE_DOCUMENT_SUCCESS,
    payload: response,
  });
  createDocumentFailure = error => ({
    type: types.CREATE_DOCUMENT_FAILURE,
    payload: error,
  });
  createDocument = data => async dispatch => {
    const API_CREATE_DOCUMENT = '/file-manager/type-document';
    dispatch(this.createDocumentRequest());
    try {
      const getApi = await this._api.post(API_CREATE_DOCUMENT, data);
      dispatch(this.createDocumentSuccess({...getApi, message: 'Thêm mới loại tài liệu thành công!'}));
      // showToast.success('Thêm mới loại tài liệu thành công!', 'success');
    } catch (error) {
      dispatch(this.createDocumentFailure({error, message: "Thêm mới loại tài liệu thất bại!"}));
      // showToast.error(error?.errors?.message ?? 'Thêm mới loại tài liệu thất bại!', 'error');
    }
  };
  // #endregion

  // #region update dir
  updateDirRequest = () => ({
    type: types.UPDATE_DIR_REQUEST,
  });
  updateDirSuccess = response => ({
    type: types.UPDATE_DIR_SUCCESS,
    payload: response,
  });
  updateDirFailure = error => ({
    type: types.UPDATE_DIR_FAILURE,
    payload: error,
  });
  updateDir = data => async dispatch => {
    const API_UPDATE_DIR = '/file-manager/rename-dir';
    dispatch(this.updateDirRequest());
    try {
      const getApi = await this._api.put(API_UPDATE_DIR, data);
      dispatch(this.updateDirSuccess({...getApi, message: "Sửa tên thành công"}));
      // showToast.success('Sửa tên thành công', 'success');
      return getApi;
    } catch (error) {
      dispatch(this.updateDirFailure({error, message: "Sửa tên thất bại"}));
      // showToast.error(error?.errors.message, 'error');
    }
  };
  // #endregion

  // #region update name file
  updateFileRequest = () => ({
    type: types.UPDATE_FILE_REQUEST,
  });
  updateFileSuccess = response => ({
    type: types.UPDATE_FILE_SUCCESS,
    payload: response,
  });
  updateFileFailure = error => ({
    type: types.UPDATE_FILE_FAILURE,
    payload: error,
  });
  updateFile = data => async dispatch => {
    const API_UPDATE_FILE = '/file-manager/rename-file';
    dispatch(this.updateFileRequest());
    try {
      const getApi = await this._api.put(API_UPDATE_FILE, data);
      dispatch(this.updateFileSuccess({...getApi, message: 'Sửa tên thành công'}));
      // showToast.success('Sửa tên thành công', 'success');
      return getApi;
    } catch (error) {
      dispatch(this.updateFileFailure({error, message: "Sửa tên thất bại"}));
      // showToast.error(error?.errors.message, 'error');
      return error;
    }
  };
  // #endregion

  // #region update name file
  updateDocumentRequest = () => ({
    type: types.UPDATE_FILE_REQUEST,
  });
  updateDocumentSuccess = response => ({
    type: types.UPDATE_FILE_SUCCESS,
    payload: response,
  });
  updateDocumentFailure = error => ({
    type: types.UPDATE_FILE_FAILURE,
    payload: error,
  });
  updateDocument = data => async dispatch => {
    const API_UPDATE_DOCUMENT_FILE = '/file-manager/type-document';
    dispatch(this.updateDocumentRequest());
    try {
      const getApi = await this._api.put(API_UPDATE_DOCUMENT_FILE, data);
      dispatch(this.updateDocumentSuccess({...getApi, message: "Sửa tên loại tài liệu thành công!"}));
      // showToast.success('Sửa tên loại tài liệu thành công!', 'success');
      return getApi;
    } catch (error) {
      dispatch(this.updateDocumentFailure({error, message: 'Sửa tên loại tài liệu thất bại'}));
      // showToast.error(error?.errors.message ?? 'Sửa tên loại tài liệu thất bại!', 'error');
    }
  };
  // #endregion

  // #region update name file
  deleteItemsRequest = () => ({
    type: types.DELETE_ITEMS_REQUEST,
  });
  deleteItemsSuccess = response => ({
    type: types.DELETE_ITEMS_SUCCESS,
    payload: response,
  });
  deleteItemsFailure = error => ({
    type: types.DELETE_ITEMS_FAILURE,
    payload: error,
  });
  deleteItems = (type, id) => async dispatch => {
    const API_DELETE = `/file-manager/${type}/${id}`;
    dispatch(this.deleteItemsRequest());
    try {
      const getApi = await this._api.delete(API_DELETE);
      dispatch(this.deleteItemsSuccess({...getApi, message: "Xóa thành công"}));
      // showToast.success('Xoá thành công', 'success');
    } catch (error) {
      dispatch(this.deleteItemsFailure({error, message: "Xóa thất bại"}));
      // showToast.error(error?.errors.message, 'error');
    }
  };
  // #endregion

  // #region update name file
  moveItemsRequest = () => ({
    type: types.MOVE_ITEMS_REQUEST,
  });
  moveItemsSuccess = response => ({
    type: types.MOVE_ITEMS_SUCCESS,
    payload: response,
  });
  moveItemsFailure = error => ({
    type: types.MOVE_ITEMS_FAILURE,
    payload: error,
  });
  moveItems = (type, data) => async dispatch => {
    const API_MOVE = `/file-manager/${type}`;
    dispatch(this.moveItemsRequest());
    try {
      const getApi = await this._api.put(API_MOVE, data);
      dispatch(this.moveItemsSuccess({...getApi, message: "Di chuyển thành công"}));
      // showToast.success('Di chuyển thành công', 'success');
    } catch (error) {
      dispatch(this.moveItemsFailure({error, message: 'Di chuyển thất bại'}));
      // showToast.error(error?.errors.message, 'error');
    }
  };
  // #endregion

  // #region uploadfile
  uploadFileRequest = () => ({
    type: types.UPLOAD_FILE_REQUEST,
  });
  uploadFileSuccess = response => ({
    type: types.UPLOAD_FILE_SUCCESS,
    payload: response,
  });
  uploadFileFailure = error => ({
    type: types.UPLOAD_FILE_FAILURE,
    payload: error,
  });
  uploadFile = (data, onUploadProgress) => dispatch => {
    dispatch(this.uploadFileRequest());
    let formData = new FormData();

    for (let i of data.files) {
      formData.append('files', i);
    }

    formData.append('data', data['data']);

    return httpClient.post('/file-manager/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onUploadProgress,
    })


    //this.uploadFile(data, onUploadProgress)
    // .then(response => {
    //   dispatch(this.uploadFileSuccess(response));
    //   showToast.success('Upload file thành công', 'success');
    // })
    // .catch(e => {
    //   dispatch(this.uploadFileFailure(e));
    //   showToast.error(e?.message ?? 'Upload file thất bại', 'error');
    // });
  };
  // #endregion

  // #region uploadfile
  dowloadFileRequest = () => ({
    type: types.DOWLOAD_FILE_REQUEST,
  });
  dowloadFileSuccess = response => ({
    type: types.DOWLOAD_FILE_SUCCESS,
    payload: response,
  });
  dowloadFileFailure = error => ({
    type: types.DOWLOAD_FILE_FAILURE,
    payload: error,
  });
  dowloadFile =
    ({ file_id, file_name, file_ext }) =>
      async dispatch => {
        const API_DOWLOAD_FILE = `/file-manager/download/${file_id}`;
        dispatch(this.dowloadFileRequest());
        this._api
          .get(API_DOWLOAD_FILE)
          .then(response => {
            fetch(response).then(res => res.blob())
            .then(
              (blob) => {
                const tempUrl = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = tempUrl;
                link.setAttribute('download', `${file_name}.${file_ext}`);
                // link.download = `${file_name}.${file_ext}`;
                document.body.appendChild(link);
                link.click();
                dispatch(this.dowloadFileSuccess({message: 'Download file thành công'}));
                // showToast.success('Dowload file thành công', 'success');
              }
            )
            .catch((error) => {
              showToast.error(`${error}`, 'error');
              console.log(error);
            })
          })
          .catch(error => {
            dispatch(this.dowloadFileFailure({error, message: "Download file thất bại"}));
            // showToast.error('Dowload file thất bại', 'error');
          });
      };
  // #endregion

  // #region getTag
  getTagsRequest = () => ({
    type: types.GET_TAG_REQUEST,
  });
  getTagsSuccess = response => ({
    type: types.GET_TAG_SUCCESS,
    payload: response,
  });
  getTagsFailure = error => ({
    type: types.GET_TAG_FAILURE,
    payload: error,
  });
  getTags = params => async dispatch => {
    const API_GET_TAGS = '/file-manager/tag';
    dispatch(this.getTagsRequest());
    try {
      const getApi = await this._api.get(API_GET_TAGS, { params });
      dispatch(this.getTagsSuccess(getApi));
    } catch (error) {
      dispatch(this.getTagsFailure(error));
    }
  };
  // #endregion

  // #region getTag
  getListShareRequest = () => ({
    type: types.GET_LIST_SHARE_REQUEST,
  });
  getListShareSuccess = response => ({
    type: types.GET_LIST_SHARE_SUCCESS,
    payload: response,
  });
  getListShareFailure = error => ({
    type: types.GET_LIST_SHARE_FAILURE,
    payload: error,
  });
  getListShare = params => async dispatch => {
    const API_GET_LIST_SHARE = '/file-manager/list-share';
    dispatch(this.getListShareRequest());
    try {
      const getApi = await this._api.get(API_GET_LIST_SHARE, { params });
      dispatch(this.getListShareSuccess(getApi));
    } catch (error) {
      dispatch(this.getListShareFailure(error));
    }
  };
  // #endregion

  // #region get user
  getUserRequest = () => ({
    type: types.GET_USER_REQUEST,
  });
  getUserSuccess = response => ({
    type: types.GET_USER_SUCCESS,
    payload: response,
  });
  getUserFailure = error => ({
    type: types.GET_USER_FAILURE,
    payload: error,
  });

  getUser = params => async dispatch => {
    const API_GET_USER = '/user/get-options';
    dispatch(this.getUserRequest());
    try {
      const getApi = await this._api.get(API_GET_USER, { params });
      dispatch(this.getUserSuccess(getApi));
    } catch (error) {
      dispatch(this.getUserFailure(error));
    }
  };

  // #region get user
  getCompanyRequest = () => ({
    type: types.GET_COMPANY_REQUEST,
  });
  getCompanySuccess = response => ({
    type: types.GET_COMPANY_SUCCESS,
    payload: response,
  });
  getCompanyFailure = error => ({
    type: types.GET_COMPANY_FAILURE,
    payload: error,
  });

  getCompany = () => async dispatch => {
    const API_GET_COMPANY = '/company/get-options/user';
    dispatch(this.getCompanyRequest());
    try {
      const getApi = await this._api.get(API_GET_COMPANY, {
        is_active: 1,
      });
      dispatch(this.getCompanySuccess(getApi));
    } catch (error) {
      dispatch(this.getCompanyFailure(error));
    }
  };

  // #region get user
  getDeparmentRequest = () => ({
    type: types.GET_DEPARTMENT_REQUEST,
  });
  getDeparmentSuccess = response => ({
    type: types.GET_DEPARTMENT_SUCCESS,
    payload: response,
  });
  getDeparmentFailure = error => ({
    type: types.GET_DEPARTMENT_FAILURE,
    payload: error,
  });

  getDeparment = params => async dispatch => {
    const API_GET_Deparment = '/department/get-options';
    dispatch(this.getDeparmentRequest());
    try {
      const getApi = await this._api.get(API_GET_Deparment, { params });
      dispatch(this.getDeparmentSuccess(getApi));
    } catch (error) {
      dispatch(this.getDeparmentFailure(error));
    }
  };

  // #region uploadfile
  shareRequest = () => ({
    type: types.SHARE_REQUEST,
  });
  shareSuccess = response => ({
    type: types.SHARE_SUCCESS,
    payload: response,
  });
  shareFailure = error => ({
    type: types.SHARE_FAILURE,
    payload: error,
  });
  share = (data, type, changeToast) => async dispatch => {
    const API_SHARE = `/file-manager/${type}`;
    dispatch(this.shareRequest());
    try {
      const getApi = await this._api.post(API_SHARE, data);
      dispatch(this.shareRequest(getApi));
      changeToast ? showToast('Lưu thành công', 'success') : showToast('Chia sẻ thành công', 'success');
    } catch (error) {
      dispatch(this.shareRequest(error));
      !changeToast && showToast(error?.errors.message ?? 'Chia sẻ thất bại', 'error');
    }
  };
  // #endregion

  // #region
  postTagRequest = () => ({
    type: types.POST_TAG_REQUEST,
  });
  postTagSuccess = response => ({
    type: types.POST_TAG_SUCCESS,
    payload: response,
  });
  postTagFailure = error => ({
    type: types.POST_TAG_FAILURE,
    payload: error,
  });
  postTag =
    (data, type = 'tag-file') =>
      async dispatch => {
        const API_TAG = `/file-manager/${type}`;
        dispatch(this.postTagRequest());
        try {
          const getApi = await this._api.post(API_TAG, data);
          dispatch(this.postTagSuccess(getApi));
          //   const message = Boolean(data?.is_tag) ? 'Thêm thẻ tag thành công' : 'Xoá thẻ tag thành công';
          //   showToast(message, 'success');
        } catch (error) {
          dispatch(this.postTagFailure(error));
          //   showToast(error?.errors.message ?? 'Thất bại', 'error');
        }
      };
  // #endregion

  // #region get all search
  searchAllRequest = () => ({
    type: types.SEARCH_ALL_REQUEST,
  });
  searchAllSuccess = response => ({
    type: types.SEARCH_ALL_SUCCESS,
    payload: response,
  });
  searchAllFailure = error => ({
    type: types.SEARCH_ALL_FAILURE,
    payload: error,
  });
  searchAll = params => async dispatch => {
    const API_SEARCH_ALL_ITEMS = '/file-manager/search-all';
    dispatch(this.searchAllRequest());
    try {
      const getApi = await this._api.get(API_SEARCH_ALL_ITEMS, { params });
      dispatch(this.searchAllSuccess(getApi));
    } catch (error) {
      dispatch(this.searchAllFailure(error));
    }
  };
  // #endregion

  clearInformationData = () => ({ type: types.CLEAR_INFORMMATION_DATA });
  showSearchFunction = () => ({ type: types.SHOW_SEARCH_FUNCTION });
  hideSearchFunction = () => ({ type: types.HIDE_SEARCH_FUNCTION });
  selectedFile = payload => ({ type: types.SELECTED_FILE, payload: payload });
}
export default new FileManager();
