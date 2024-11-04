const fileManagerClass = require("./file-manager.class");
const PROCEDURE_NAME = require("../../common/const/procedureName.const");
const apiHelper = require("../../common/helpers/api.helper");
const mssql = require("../../models/mssql");
const ServiceResponse = require("../../common/responses/service.response");
const RESPONSE_MSG = require("../../common/const/responseMsg.const");
const logger = require("../../common/classes/logger.class");
const appRoot = require("app-root-path");
const sql = require('mssql');
const folderName = "news";
const fileHelper = require("../../common/helpers/file.helper");
const config = require("../../../config/config");

const axios = require("axios");
const FormData = require("form-data");
const path = require('path');
const { response } = require("express");



// const uploadFile = (file) => {
//     return new Promise((resolve, reject) => {
//       const form = new FormData();
//       for (let i = 0; i < file.length; i++) {
//         form.append("file", file[i].buffer, { filename: file[i].originalname });
//       }
//       axios
//         .post(`${config.domain_cdn}/upload-new`, form, {
//           headers: { ...form.getHeaders(), ...{ Authorization: `APIKEY ${config.upload_apikey}` } },
//           maxContentLength: Infinity,
//           maxBodyLength: Infinity,
//         })
//         .then((res) => {
//           resolve(res.data.data);
//         })
//         .catch((err) => {
//           let { response } = err;
//           if (!response) {
//             throw err;
//           }
//           const { data } = response;
//           reject(data.message || "Lỗi upload video!");
//         });
//     });
//   };



const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    // for (let i = 0; i < file.length; i++) {
    //     form.append("file", file[i].buffer, { filename: file[i].originalname });
    // }

    form.append("file", file.buffer, { filename: file.originalname });
    axios
      .post(`${process.env.DOMAIN_CDN}/upload`, form, {
        headers: { ...form.getHeaders(), ...{ Authorization: `APIKEY ${process.env.UPLOAD_APIKEY}` } },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      })
      .then((res) => {

        resolve(res.data.data);

      })
      .catch((err) => {
        let { response } = err;
        if (!response) {
          throw err;
        }
        const { data } = response;
        reject(data.message || "Lỗi upload video!");
      });
  });
};


const getListDocumentType = async (bodyParams = {}, queryParams = {}) => {
  const currentPage = apiHelper.getCurrentPage(queryParams);
  const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input(
        "CURRENTUSER",
        apiHelper.getValueFromObject(bodyParams, "auth_name")
      )
      .input("PAGESIZE", itemsPerPage)
      .input("PAGEINDEX", currentPage)
      .execute("MD_DOCUMENTTYPE_GetList_App");

    const result =
      data.recordsets && data.recordsets.length > 0 && data.recordsets[0]
        ? fileManagerClass.ListDocumentType(data.recordsets[0])
        : [];
    const total =
      data.recordsets &&
        data.recordsets.length > 0 &&
        data.recordsets[1].length > 0 &&
        data.recordsets[1][0]
        ? data.recordsets[1][0].TOTALITEMS
        : 0;
    return new ServiceResponse(true, "", {
      data: result,
      page: currentPage,
      limit: itemsPerPage,
      total: total,
    });
  } catch (e) {
    logger.error(e, { function: "fileManagerService.getListDocumentTypes" });
    return new ServiceResponse(true, "", {});
  }
};

const getListFile = async (bodyParams = {}, queryParams = {}) => {
  const currentPage = apiHelper.getCurrentPage(queryParams);
  const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input(
        "CURRENTUSER",
        apiHelper.getValueFromObject(bodyParams, "auth_name")
      )
      .input(
        "DIRECTORYID",
        apiHelper.getValueFromObject(bodyParams, "directory_id")
      )
      .input("PAGESIZE", itemsPerPage)
      .input("PAGEINDEX", currentPage)
      .execute("FM_FILE_GetList_App");
    let result = data.recordset;
    return new ServiceResponse(true, "", {
      data: fileManagerClass.listFile(result),
      page: currentPage,
      limit: itemsPerPage,
      // 'total': total,
    });
  } catch (e) {
    logger.error(e, { function: "fileManagerService.getListFiles" });
    return new ServiceResponse(true, "", {});
  }
};

const getListDirectory = async (bodyParams = {}, queryParams = {}) => {
  const currentPage = apiHelper.getCurrentPage(queryParams);
  const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input("CURRENTUSER", apiHelper.getValueFromObject(bodyParams, "auth_name"))
      .input("DIRECTORYID", apiHelper.getValueFromObject(queryParams, "directory_id"))
      .input("DOCUMENTTYPEID", apiHelper.getValueFromObject(queryParams, "document_type_id"))
      .input("KEYWORD", apiHelper.getValueFromObject(queryParams, "key_word"))
      .input("ISSORTCREATEDDATE", apiHelper.getValueFromObject(queryParams, "is_sort_create_date"))
      .input("ISSORETNAMEDIRECTORY", apiHelper.getValueFromObject(queryParams, "is_sort_name_dir"))
      .input("ISSORETNAMEFILE", apiHelper.getValueFromObject(queryParams, "is_sort_name_file"))
      .input("PAGESIZE", itemsPerPage)
      .input("PAGEINDEX", currentPage)
      .execute("FM_DIRECTORY_GetList_App");
    let result = data.recordset;

    return new ServiceResponse(true, "", {
      data: fileManagerClass.ListDirectory(result),
      page: currentPage,
      limit: itemsPerPage,
      // 'total': total,
    });
  } catch (e) {
    logger.error(e, { function: "fileManagerService.getListFiles" });
    return new ServiceResponse(true, "", {});
  }
};



// Để gôm nhóm các dữ liệu có cùng file_id nhưng khác nhãn dán
const indexOf = (array, unit, value) => {
  return array.findIndex(el => el[value] === unit)
};
//  Array.prototype.indexOf = indexOf; với tập tin
const handleMergeData = arr => {
  const res = [];
  let listTag = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].file_id) {
      const ind = indexOf(res, arr[i].file_id, 'file_id');
      if (ind !== -1) {
        listTag.push({
          file_tage_name: arr[i].file_tage_name,
          color: arr[i].color,
          icon_url: arr[i].icon_url,
          is_tag: arr[i].is_tag,
          file_tag_id: arr[i].file_tag_id
        })
        res[ind].list_tag = listTag
      } else {
        res.push(arr[i]);
      }
    } else {
      res.push(arr[i]);
    }

  };
  return res;
};



const handleMergeDataDirectory = arr => {
  const res = [];
  let listTag = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].directory_id) {
      const ind = indexOf(res, arr[i].directory_id, 'directory_id');
      if (ind !== -1) {
        listTag.push({
          file_tage_name: arr[i].file_tage_name,
          color: arr[i].color,
          icon_url: arr[i].icon_url,
          is_tag: arr[i].is_tag,
          file_tag_id: arr[i].file_tag_id
        })
        res[ind].list_tag = listTag
      } else {
        res.push(arr[i]);
      }
    } else {
      res.push(arr[i]);
    }

  };
  return res;
};


// //  Array.prototype.indexOf = indexOf;
//  const handleMergeDataGetAll = arr => {
//     const res = [];
//     let listTag = []

//     arr.map(items=>{
//             items.list_tag = [];
//     })

//     for(let i = 0; i < arr.length; i++){
//        if(arr[i].file_id){
//         const ind = indexOf(res,arr[i].file_id,'file_id');
//         if(ind !== -1){
//            res[ind].list_tag.push({
//                      file_tage_name : arr[i].file_tage_name,
//                      color : arr[i].color,
//                      icon_url : arr[i].icon_url,
//                      is_tag : arr[i].is_tag,
//                      file_tag_id : arr[i].file_tag_id
//              })
//         }
//         else{
//            res.push(arr[i]);
//         }
//        }else{
//         res.push(arr[i]);
//        }

//     };
//     return res;
//  };

//  Array.prototype.indexOf = indexOf;
const handleMergeDataGetAll = arr => {
  const res = [];
  let listTag = []

  arr.map(items => {
    items.list_tag = [];
  })

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].file_id) {
      const ind = indexOf(res, arr[i].file_id, 'file_id');
      if (ind !== -1) {
        res[ind].list_tag.push({
          file_tage_name: arr[i].file_tage_name,
          color: arr[i].color,
          icon_url: arr[i].icon_url,
          is_tag: arr[i].is_tag,
          file_tag_id: arr[i].file_tag_id
        })
      }
      else {
        res.push(arr[i]);
      }
    }
    else if (arr[i].directory_id) {
      const ind = indexOf(res, arr[i].directory_id, 'directory_id');
      if (ind !== -1) {
        res[ind].list_tag.push({
          file_tage_name: arr[i].file_tage_name,
          color: arr[i].color,
          icon_url: arr[i].icon_url,
          is_tag: arr[i].is_tag,
          file_tag_id: arr[i].file_tag_id
        })
      }
      else {
        res.push(arr[i]);
      }
    }
    else {
      res.push(arr[i]);
    }

  };
  return res;
};




const getListSearchAll = async (bodyParams = {}, queryParams = {}) => {
  const currentPage = apiHelper.getCurrentPage(queryParams);
  const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input("CURRENTUSER", apiHelper.getValueFromObject(bodyParams, "auth_name"))
      .input("DOCUMENTTYPEID", apiHelper.getValueFromObject(queryParams, "document_type_id"))
      .input("KEYWORD", apiHelper.getValueFromObject(queryParams, "key_word"))
      .input("ISSORTCREATEDDATE", apiHelper.getValueFromObject(queryParams, "is_sort_create_date"))
      .input("ISSORETNAMEDIRECTORY", apiHelper.getValueFromObject(queryParams, "is_sort_name_dir"))
      .input("ISSORETNAMEFILE", apiHelper.getValueFromObject(queryParams, "is_sort_name_file"))
      .input("PAGESIZE", itemsPerPage)
      .input("PAGEINDEX", currentPage)
      .execute("FM_FILE_FM_DIRECTORY_GetListWithSearch_App");

    let result =
      fileManagerClass.listAll(data.recordsets && data.recordsets.length > 0 && data.recordsets[0]
        ? data.recordsets[0]
        : []);


    //   let resultParent =
    //   fileManagerClass.permissionParentFolder(data.recordsets && data.recordsets.length > 0 && data.recordsets[1][0]
    //       ? data.recordsets[1][0]
    //       : [] );    

    let arrayMerge = handleMergeDataGetAll(result); // nhóm các dữ liệu giống nhau

    arrayMerge.map((items) => {
      if (items.is_tag && (items.list_tag)) {
        items.list_tag.unshift({
          file_tage_name: items.file_tage_name,
          file_tag_id: items.file_tag_id,
          color: items.color,
          icon_url: items.icon_url,
          is_tag: items.is_tag

        })
      } else if (items.is_tag && !items.list_tag) {
        items.list_tag = [{
          file_tage_name: items.file_tage_name,
          file_tag_id: items.file_tag_id,
          color: items.color,
          icon_url: items.icon_url,
          is_tag: items.is_tag
        }]
      }
      items.file_tage_name = null;
      items.file_tag_id = null
      items.color = null;
      items.icon_url = null;
    })

    //   // let totalFile =
    //   //   data.recordsets &&
    //   //   data.recordsets.length > 0 &&
    //   //   data.recordsets[1] &&
    //   //   data.recordsets[1].length > 0 &&
    //   //   data.recordsets[1][0]
    //   //     ? data.recordsets[1][0].TOTALFILE
    //   //     : 0;
    //   // let totalDir =
    //   //   data.recordsets &&
    //   //   data.recordsets.length > 0 &&
    //   //   data.recordsets[1] &&
    //   //   data.recordsets[1].length > 0 &&
    //   //   data.recordsets[1][0]
    //   //     ? data.recordsets[1][0].TOTALDIREC
    //   //     : 0;

    //   // Trả về thông tin của thư mục đang hiển thị 
    //   // Kèm theo quyền của người dùng hiện tại ở thư mục đó
    //   let objParent = { 
    //       ...resultParent,
    //       document_type_id : apiHelper.getValueFromObject(queryParams, "document_type_id"),
    //       directory_id : apiHelper.getValueFromObject(queryParams, "directory_id")
    //   }

    return new ServiceResponse(true, "", {
      data: arrayMerge,
      page: currentPage,
      // parentFolder : objParent,
      limit: itemsPerPage,
      total: result.length,
    });
  } catch (e) {
    logger.error(e, { function: "fileManagerService.getListFiles" });
    return new ServiceResponse(true, "", {});
  }
};


const getListAll = async (bodyParams = {}, queryParams = {}) => {
  const currentPage = apiHelper.getCurrentPage(queryParams);
  const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input("CURRENTUSER", apiHelper.getValueFromObject(bodyParams, "auth_name"))
      .input("DIRECTORYID", apiHelper.getValueFromObject(queryParams, "directory_id"))
      .input("DOCUMENTTYPEID", apiHelper.getValueFromObject(queryParams, "document_type_id"))
      .input("KEYWORD", apiHelper.getValueFromObject(queryParams, "key_word"))
      .input("ISSORTCREATEDDATE", apiHelper.getValueFromObject(queryParams, "is_sort_create_date"))
      .input("ISSORETNAMEDIRECTORY", apiHelper.getValueFromObject(queryParams, "is_sort_name_dir"))
      .input("ISSORETNAMEFILE", apiHelper.getValueFromObject(queryParams, "is_sort_name_file"))
      .input("ISMOVE", apiHelper.getValueFromObject(queryParams, "is_move"))
      .input("PAGESIZE", itemsPerPage)
      .input("PAGEINDEX", currentPage)
      .execute("FM_FILE_FM_DIRECTORY_GetList_App");

    // Lấy tất cả thư mục lẫn tập tin tại thư mục được mở
    let result =
      fileManagerClass.listAll(data.recordsets && data.recordsets.length > 0 && data.recordsets[0]
        ? data.recordsets[0]
        : []);

    let totalItems =
      data.recordsets &&
        data.recordsets.length > 0 &&
        data.recordsets[0] &&
        data.recordsets[0].length > 0 &&
        data.recordsets[0][0] &&
        data.recordsets[0][0].TOTALITEMS
        ? data.recordsets[0][0].TOTALITEMS
        : 0;

    // Trả về id , tên , và quyền của thư mục hiện tại đang mở
    let resultParent =
      fileManagerClass.permissionParentFolder(data.recordsets && data.recordsets.length > 0 && data.recordsets[1][0]
        ? data.recordsets[1][0]
        : []);


    // Mảng các thư mục đã vào tính từ thư mục đang mở    
    let arrayPath =
      fileManagerClass.ListDirectory(data.recordsets && data.recordsets.length > 0 && data.recordsets[2]
        ? data.recordsets[2]
        : []);


    let arrayMerge = handleMergeDataGetAll(result); // nhóm các dữ liệu giống nhau pathItems


    // Filter và lọc bỏ các giá trị đã được merge để dữ liệu không bị rối
    arrayMerge.map((items) => {
      if (items.is_tag && (items.list_tag)) {
        items.list_tag.unshift({
          file_tage_name: items.file_tage_name,
          file_tag_id: items.file_tag_id,
          color: items.color,
          icon_url: items.icon_url,
          is_tag: items.is_tag

        })
        // Nếu trường hợp mà 1 tập tin mà chỉ cso duy nhất 1 thẻ nhãn thì push vào 
      } else if (items.is_tag && !items.list_tag) {
        items.list_tag = [{
          file_tage_name: items.file_tage_name,
          file_tag_id: items.file_tag_id,
          color: items.color,
          icon_url: items.icon_url,
          is_tag: items.is_tag
        }]
      }
      items.file_tage_name = null;
      items.file_tag_id = null
      items.color = null;
      items.icon_url = null;
    })


    // Trả về thông tin của thư mục đang hiển thị 
    // Kèm theo quyền của người dùng hiện tại ở thư mục đó
    let objParent = {
      ...resultParent,
      document_type_id: apiHelper.getValueFromObject(queryParams, "document_type_id"),
      directory_id: apiHelper.getValueFromObject(queryParams, "directory_id")
    }

    return new ServiceResponse(true, "", {
      data: arrayMerge, // Dữ liệu danh sách 
      page: currentPage,
      pathArray: arrayPath, // Mảng đường dẫn vào thư mục hiện tại
      parentFolder: objParent, // Thông tin của thư mục kèm theo quyền tại thư mục đó
      limit: itemsPerPage,
      total: totalItems,
    });
  } catch (e) {
    logger.error(e, { function: "fileManagerService.getListFiles" });
    return new ServiceResponse(true, "", {});
  }
};

const createDirectory = async (bodyParams = {}) => {

  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    const request = new sql.Request(transaction);

    const resultCreateDirectorySQL = await request
      .input('DIRECTORYID', apiHelper.getValueFromObject(bodyParams, 'directory_id'))
      .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
      .input('DOCUMENTTYPEID', apiHelper.getValueFromObject(bodyParams, 'document_type_id'))
      .input('DIRECTORYNAME', apiHelper.getValueFromObject(bodyParams, 'directory_name'))
      .input('DIRECTORYOWNER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .input('ISSHARETOALL', apiHelper.getValueFromObject(bodyParams, 'is_share_all'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .execute('FM_DIRECTORY_CreateOrUpdate_App');
    let directory_path = resultCreateDirectorySQL && resultCreateDirectorySQL.recordset.length > 0 && resultCreateDirectorySQL.recordset[0].RESULT ? resultCreateDirectorySQL.recordset[0].RESULT : null;

    let directory_id = resultCreateDirectorySQL && resultCreateDirectorySQL.recordset.length > 0 && resultCreateDirectorySQL.recordset[0].DIRECTORYID ? resultCreateDirectorySQL.recordset[0].DIRECTORYID : null;

    if (!directory_path || !resultCreateDirectorySQL.recordset) {
      await transaction.rollback();
      return new ServiceResponse(false, "", { message: "tạo thư mục thất bại" })
    }
    if (directory_path == 'Error_ADD') {
      await transaction.rollback();
      return new ServiceResponse(false, "", { message: "Bạn không thể tạo mới ở thư mục này" })
    }
    if (directory_path == 'Error_NAME_EXISTS') {
      await transaction.rollback();
      return new ServiceResponse(false, "", { message: "Tên thư mục đã tồn tại" })
    }

    try {
      // let resultCreateCDN  = await fileHelper.createFileAsString(directory_path);
      let descriptionMessaage = `${apiHelper.getValueFromObject(bodyParams, 'auth_name')} đã khởi tạo thư mục ${apiHelper.getValueFromObject(bodyParams, 'directory_name')} `;

      const requestCreateDirectoryLog = new sql.Request(transaction);
      const resultCreateDirectoryLog = await requestCreateDirectoryLog
        .input('DIRECTORYID', directory_id)
        .input('DIRECTORYNAME', apiHelper.getValueFromObject(bodyParams, 'directory_name'))
        .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .input('DESCRIPTION', descriptionMessaage)
        .input('ISDELETE', 0)
        .input('ISSHARE', 0)
        .input('ISRENAME', 0)
        .input('ISMOVE', 0)
        .input('ISCREATESUBDIRECTORY', directory_id ? 1 : 0)
        .input('ISUPLOADFILE', 0)
        .execute('FM_DIRECTORY_LOG_Create_App');


      let LogIDCreate = resultCreateDirectoryLog && resultCreateDirectoryLog.recordset && resultCreateDirectoryLog.recordset.length > 0
        && resultCreateDirectoryLog.recordset[0].LOGID ? resultCreateDirectoryLog.recordset[0].LOGID : null

      if (!LogIDCreate || !resultCreateDirectoryLog.recordset) {
        await transaction.rollback();
        return new ServiceResponse(false, "Ghi Log thất bại", {});
      }
      await transaction.commit();
      return new ServiceResponse(true, "Tạo thư mục thành công", {
        directory_path,
      });
    } catch (e) {
      // logger.error(e.response.data, { function: "fileManagerService.createCDNDirectory" });
      // await transaction.rollback();
      // return new ServiceResponse(false, e.response.data.message);
      logger.error(e, { function: "fileManagerService.createCDNDirectory" });
      await transaction.rollback();
      return new ServiceResponse(false, e.message);
    }

  } catch (e) {
    logger.error(e, { function: "fileManagerService.createDirectory" });
    await transaction.rollback();
    return new ServiceResponse(false, e.message);
  }
};


const shareDirectory = async (bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  const listUser = apiHelper.getValueFromObject(bodyParams, 'list_user', []);
  const listDepartment = apiHelper.getValueFromObject(bodyParams, 'list_department', []);

  await transaction.begin();
  try {
    let bodySend = {
      ...bodyParams,
      directory_share_id: null,
      directory_id: apiHelper.getValueFromObject(bodyParams, 'directory_id')
    }
    try {
      let result = await ShareListParent(bodySend);  // Share thư mục con sẽ  gọi để share những thư mục cha nếu thằng cha chưa được share => còn đã share thì giữ nguyên quyền của cha
    } catch (e) {
      await transaction.rollback();
      return new ServiceResponse(false, "Có lỗi xảy ra", {});
    }


    const request = new sql.Request(transaction);
    const requestAddShareDepartment = new sql.Request(transaction);
    const requestShareDirectoryLog = new sql.Request(transaction);

    if (listDepartment && listDepartment.length && listDepartment.length > 0) { // Nếu chia sẻ cho phòng ban thì chạy khối lệnh này

      for (let i = 0; i < listDepartment.length; i++) {
        const resultAddShareDepartment = await requestAddShareDepartment
          .input('DIRECTORYID', apiHelper.getValueFromObject(bodyParams, 'directory_id'))
          .input('DIRECTORYSHAREID', apiHelper.getValueFromObject(bodyParams, 'directory_share_id'))
          .input('POSITIONID', apiHelper.getValueFromObject(bodyParams, 'position_id'))
          .input('DEPARTMENTID', listDepartment[i].department_id)
          .input('USERGROUPID', apiHelper.getValueFromObject(bodyParams, 'user_group_id'))
          .input('USERNAME', null)
          .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
          .input('ISREAD', listDepartment[i].is_read)
          .input('ISWRITE', listDepartment[i].is_write)
          .input('ISDELETE', listDepartment[i].is_delete)
          .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
          .execute('FM_DIRECTORY_SHARE_CreateOrUpdate_App');

        let directory_share_id = resultAddShareDepartment && resultAddShareDepartment.recordset && resultAddShareDepartment.recordset.length > 0 && resultAddShareDepartment.recordset[0].RESULT ? resultAddShareDepartment.recordset[0].RESULT : null;

        if (!directory_share_id || !resultAddShareDepartment.recordset) {
          await transaction.rollback();
          return new ServiceResponse(false, "", { message: "Chia sẻ thư mục thất bại" })
        }
        if (directory_share_id == 'Error_DIREC_OWNER') {
          await transaction.rollback();
          return new ServiceResponse(false, "Bạn không thể thao tác chia sẻ trên thư mục này", {})
        }

        let descriptionMessaage = `${apiHelper.getValueFromObject(bodyParams, 'auth_name')} đã chia sẻ thư mục ${apiHelper.getValueFromObject(bodyParams, 'directory_id')} cho phòng ban ${listDepartment[i].department_id} `;

        const resultShareDirectoryLog = await requestShareDirectoryLog
          .input('DIRECTORYID', apiHelper.getValueFromObject(bodyParams, 'directory_id'))
          .input('DIRECTORYNAME', descriptionMessaage)
          .input('USERNAME', listDepartment[i].department_id)
          .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
          .input('ISDELETE', 0)
          .input('ISSHARE', directory_share_id ? 1 : 0)
          .input('ISRENAME', 0)
          .input('ISMOVE', 0)
          .input('ISCREATESUBDIRECTORY', 0)
          .input('ISUPLOADFILE', 0)
          .execute('FM_DIRECTORY_LOG_Create_App');

        let LogIDShare = resultShareDirectoryLog && resultShareDirectoryLog.recordset && resultShareDirectoryLog.recordset.length > 0
          && resultShareDirectoryLog.recordset[0].LOGID ? resultShareDirectoryLog.recordset[0].LOGID : null


        if (!LogIDShare || !resultShareDirectoryLog.recordset) {
          await transaction.rollback();
          return new ServiceResponse(false, "Ghi Log thất bại", {});
        }


      }
    }
    if (listUser && listUser.length && listUser.length > 0) { // Nếu chia sẻ có user thì sẽ chạy khối lệnh này

      for (let i = 0; i < listUser.length; i++) { // Vòng lặp lấy danh sách người dùng 
        // for(let j =0 ; j < listPathParent.length ; j++ ){ // Vòng lặp lấy danh sách tên thư mục cha
        // Share thư mục với người dùng 
        const resultShareDirectory = await request
          .input('DIRECTORYID', apiHelper.getValueFromObject(bodyParams, 'directory_id'))
          .input('DIRECTORYSHAREID', apiHelper.getValueFromObject(bodyParams, 'directory_share_id'))
          .input('POSITIONID', apiHelper.getValueFromObject(bodyParams, 'position_id'))
          .input('DEPARTMENTID', apiHelper.getValueFromObject(bodyParams, 'department_id'))
          .input('USERGROUPID', apiHelper.getValueFromObject(bodyParams, 'user_group_id'))
          .input('USERNAME', listUser[i].user_name)
          .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
          .input('ISREAD', listUser[i].is_read)
          .input('ISWRITE', listUser[i].is_write)
          .input('ISDELETE', listUser[i].is_delete)
          .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
          .execute('FM_DIRECTORY_SHARE_CreateOrUpdate_App');

        let directory_share_id = resultShareDirectory && resultShareDirectory.recordset && resultShareDirectory.recordset.length > 0 && resultShareDirectory.recordset[0].RESULT ? resultShareDirectory.recordset[0].RESULT : null;



        if (!directory_share_id || !resultShareDirectory.recordset) {
          await transaction.rollback();
          return new ServiceResponse(false, "", { message: "Chia sẻ thư mục thất bại" })
        }


        if (directory_share_id == 'Error_DIREC_OWNER') {
          await transaction.rollback();
          return new ServiceResponse(false, "Bạn không thể thao tác chia sẻ trên thư mục này", {})
        }


        let descriptionMessaage = `${apiHelper.getValueFromObject(bodyParams, 'auth_name')} đã chia sẻ thư mục ${apiHelper.getValueFromObject(bodyParams, 'directory_id')} cho ${listUser[i].user_name} `;

        const resultShareDirectoryLog = await requestShareDirectoryLog
          .input('DIRECTORYID', apiHelper.getValueFromObject(bodyParams, 'directory_id'))
          .input('DIRECTORYNAME', descriptionMessaage)
          .input('USERNAME', listUser[i].user_name)
          .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
          .input('ISDELETE', 0)
          .input('ISSHARE', directory_share_id ? 1 : 0)
          .input('ISRENAME', 0)
          .input('ISMOVE', 0)
          .input('ISCREATESUBDIRECTORY', 0)
          .input('ISUPLOADFILE', 0)
          .execute('FM_DIRECTORY_LOG_Create_App');

        let LogIDShare = resultShareDirectoryLog && resultShareDirectoryLog.recordset && resultShareDirectoryLog.recordset.length > 0
          && resultShareDirectoryLog.recordset[0].LOGID ? resultShareDirectoryLog.recordset[0].LOGID : null


        if (!LogIDShare || !resultShareDirectoryLog.recordset) {
          await transaction.rollback();
          return new ServiceResponse(false, "Ghi Log thất bại", {});
        }

        // }
      }
    }
    await transaction.commit();
    return new ServiceResponse(true, "Chia sẻ thư mục thành công ", {});
  } catch (e) {
    await transaction.rollback();
    logger.error(e, { function: "fileManagerService.shareDirectory" });

    return new ServiceResponse(false, e.message);
  }
}

const ShareListParent = async (bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  const listUser = apiHelper.getValueFromObject(bodyParams, 'list_user', []);
  const listDepartment = apiHelper.getValueFromObject(bodyParams, 'list_department', []);
  await transaction.begin();
  try {
    const requestShareDirectoryGetList = new sql.Request(transaction);
    const resultShareDirectoryGetList = await requestShareDirectoryGetList
      .input('DIRECTORYID', apiHelper.getValueFromObject(bodyParams, 'directory_id'))
      .execute('FM_DIRECTORY_SHARE_GetParent_App');
    let listPathParent =
      fileManagerClass.ListPathDirectory(resultShareDirectoryGetList.recordsets && resultShareDirectoryGetList.recordsets.length > 0 && resultShareDirectoryGetList.recordsets[0]
        ? resultShareDirectoryGetList.recordsets[0]
        : []);



    const request = new sql.Request(transaction);
    const requestShareDirectoryLog = new sql.Request(transaction);
    const requestAddShareDepartment = new sql.Request(transaction);

    if (listDepartment && listDepartment.length && listDepartment.length > 0) { // Nếu có danh sách phòng ban thì chia sẻ quyền của phòng ban trên mấy thư mục cha 

      for (let i = 0; i < listDepartment.length; i++) { // Vòng lặp lấy phòng ban
        for (let j = 0; j < listPathParent.length; j++) { // Vòng lặp lấy tất cả id các thư mục cha để chia sẻ quyền của phòng ban lên đó
          const resultAddShareDepartment = await requestAddShareDepartment
            .input('DIRECTORYID', listPathParent[j].directory_id)
            .input('DIRECTORYSHAREID', apiHelper.getValueFromObject(bodyParams, 'directory_share_id'))
            .input('POSITIONID', apiHelper.getValueFromObject(bodyParams, 'position_id'))
            .input('DEPARTMENTID', listDepartment[i].department_id)
            .input('USERGROUPID', apiHelper.getValueFromObject(bodyParams, 'user_group_id'))
            .input('USERNAME', null)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISREAD', listDepartment[i].is_read)
            .input('ISWRITE', listDepartment[i].is_write)
            .input('ISDELETE', listDepartment[i].is_delete)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('FM_DIRECTORY_SHARE_CreateOrUpdateParent_App');

          let directory_share_id = resultAddShareDepartment && resultAddShareDepartment.recordset && resultAddShareDepartment.recordset.length > 0 && resultAddShareDepartment.recordset[0].RESULT ? resultAddShareDepartment.recordset[0].RESULT : null;

          if (!directory_share_id || !resultAddShareDepartment.recordset) {
            await transaction.rollback();
            return new ServiceResponse(false, "", { message: "Chia sẻ thư mục thất bại" })
          }
          if (directory_share_id == 'Error_DIREC_OWNER') {
            await transaction.rollback();
            return new ServiceResponse(false, "Bạn không thể thao tác chia sẻ trên thư mục này", {})
          }

          let descriptionMessaage = `${apiHelper.getValueFromObject(bodyParams, 'auth_name')} đã chia sẻ thư mục ${apiHelper.getValueFromObject(bodyParams, 'directory_id')} cho phòng ban ${listDepartment[i].department_id} `;

          const resultShareDirectoryLog = await requestShareDirectoryLog
            .input('DIRECTORYID', apiHelper.getValueFromObject(bodyParams, 'directory_id'))
            .input('DIRECTORYNAME', descriptionMessaage)
            .input('USERNAME', listDepartment[i].department_id)
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISDELETE', 0)
            .input('ISSHARE', directory_share_id ? 1 : 0)
            .input('ISRENAME', 0)
            .input('ISMOVE', 0)
            .input('ISCREATESUBDIRECTORY', 0)
            .input('ISUPLOADFILE', 0)
            .execute('FM_DIRECTORY_LOG_Create_App');

          let LogIDShare = resultShareDirectoryLog && resultShareDirectoryLog.recordset && resultShareDirectoryLog.recordset.length > 0
            && resultShareDirectoryLog.recordset[0].LOGID ? resultShareDirectoryLog.recordset[0].LOGID : null


          if (!LogIDShare || !resultShareDirectoryLog.recordset) {
            await transaction.rollback();
            return new ServiceResponse(false, "Ghi Log thất bại", {});
          }
        }
      }
    }

    if (listUser && listUser.length && listUser.length > 0) {

      for (let i = 0; i < listUser.length; i++) { // Vòng lặp lấy danh sách người dùng 
        for (let j = 0; j < listPathParent.length; j++) { // Vòng lặp lấy danh sách tên thư mục cha
          // Share thư mục với người dùng 
          const resultShareDirectory = await request
            .input('DIRECTORYID', listPathParent[j].directory_id)
            .input('DIRECTORYSHAREID', apiHelper.getValueFromObject(bodyParams, 'directory_share_id'))
            .input('POSITIONID', apiHelper.getValueFromObject(bodyParams, 'position_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(bodyParams, 'department_id'))
            .input('USERGROUPID', apiHelper.getValueFromObject(bodyParams, 'user_group_id'))
            .input('USERNAME', listUser[i].user_name)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISREAD', listUser[i].is_read)
            .input('ISWRITE', listUser[i].is_write)
            .input('ISDELETE', listUser[i].is_delete)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('FM_DIRECTORY_SHARE_CreateOrUpdateParent_App');

          let directory_share_id = resultShareDirectory && resultShareDirectory.recordset.length > 0 && resultShareDirectory.recordset[0].RESULT ? resultShareDirectory.recordset[0].RESULT : null;


          if (!directory_share_id || !resultShareDirectory.recordset) {
            await transaction.rollback();
            return new ServiceResponse(false, "", { message: "Chia sẻ thư mục thất bại" })
          }

          if (directory_share_id == 'Error_DIREC_OWNER') {
            await transaction.rollback();
            return new ServiceResponse(false, "Bạn không thể thao tác chia sẻ trên thư mục này", {})
          }

          let descriptionMessaage = `${apiHelper.getValueFromObject(bodyParams, 'auth_name')} đã chia sẻ thư mục ${apiHelper.getValueFromObject(bodyParams, 'directory_id')} cho ${listUser[i].user_name} `;

          const resultShareDirectoryLog = await requestShareDirectoryLog
            .input('DIRECTORYID', listPathParent[j].directory_id)
            .input('DIRECTORYNAME', descriptionMessaage)
            .input('USERNAME', listUser[i].user_name)
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISDELETE', 0)
            .input('ISSHARE', directory_share_id ? 1 : 0)
            .input('ISRENAME', 0)
            .input('ISMOVE', 0)
            .input('ISCREATESUBDIRECTORY', 0)
            .input('ISUPLOADFILE', 0)
            .execute('FM_DIRECTORY_LOG_Create_App');

          let LogIDShare = resultShareDirectoryLog && resultShareDirectoryLog.recordset && resultShareDirectoryLog.recordset.length > 0
            && resultShareDirectoryLog.recordset[0].LOGID ? resultShareDirectoryLog.recordset[0].LOGID : null


          if (!LogIDShare || !resultShareDirectoryLog.recordset) {
            await transaction.rollback();
            return new ServiceResponse(false, "Ghi Log thất bại", {});
          }
        }
      }
    }

    await transaction.commit();
    return new ServiceResponse(true, "Chia sẻ thư mục thành công ", {});
  } catch (e) {
    await transaction.rollback();
    logger.error(e, { function: "fileManagerService.shareDirectory" });

    return new ServiceResponse(false, e.message);
  }
}



const renameDirectory = async (bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    const requestReNameDirectory = new sql.Request(transaction);
    const resultReNameDirectory = await requestReNameDirectory
      .input('DIRECTORYID', apiHelper.getValueFromObject(bodyParams, 'directory_id'))
      .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
      .input('DOCUMENTTYPEID', apiHelper.getValueFromObject(bodyParams, 'document_type_id'))
      .input('DIRECTORYNAME', apiHelper.getValueFromObject(bodyParams, 'directory_name'))
      .input('DIRECTORYOWNER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .input('ISSHARETOALL', null)
      .input('ISACTIVE', null)
      .execute('FM_DIRECTORY_CreateOrUpdate_App');

    let directory_path = resultReNameDirectory && resultReNameDirectory.recordset.length > 0 && resultReNameDirectory.recordset[0].RESULT ? resultReNameDirectory.recordset[0].RESULT : null;

    let directory_id = resultReNameDirectory && resultReNameDirectory.recordset.length > 0 && resultReNameDirectory.recordset[0].DIRECTORYID ? resultReNameDirectory.recordset[0].DIRECTORYID : null;

    let directory_name_old = resultReNameDirectory && resultReNameDirectory.recordset.length > 0 && resultReNameDirectory.recordset[0].OLDNAME ? resultReNameDirectory.recordset[0].OLDNAME : null;
    let directory_name_new = resultReNameDirectory && resultReNameDirectory.recordset.length > 0 && resultReNameDirectory.recordset[0].NEWNAME ? resultReNameDirectory.recordset[0].NEWNAME : null;


    if (!directory_path || !resultReNameDirectory.recordset) {
      await transaction.rollback();
      return new ServiceResponse(false, "Thay đổi tên thư mục không thành công", {})
    }
    if (directory_path == 'Error_EDIT') {
      await transaction.rollback();
      return new ServiceResponse(false, "Bạn không thể thao tác thay đổi trong thư mục này", {})
    }

    let descriptionMessaage = `${apiHelper.getValueFromObject(bodyParams, 'auth_name')} đã đổi tên thư mục từ ${directory_name_old} thành ${apiHelper.getValueFromObject(bodyParams, 'directory_name')}`

    // Save log đổi tên thư mục
    try {
      const requestRenameDirectoryLog = new sql.Request(transaction);
      const resultRenameDirectoryLog = await requestRenameDirectoryLog
        .input('DIRECTORYID', directory_id)
        .input('DIRECTORYNAME', directory_name_old)
        .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .input('DESCRIPTION', descriptionMessaage)
        .input('ISDELETE', 0)
        .input('ISSHARE', 0)
        .input('ISRENAME', directory_path ? 1 : 0)
        .input('ISMOVE', 0)
        .input('ISCREATESUBDIRECTORY', 0)
        .input('ISUPLOADFILE', 0)
        .execute('FM_DIRECTORY_LOG_Create_App');

      let LogIDRename = resultRenameDirectoryLog && resultRenameDirectoryLog.recordset && resultRenameDirectoryLog.recordset.length > 0
        && resultRenameDirectoryLog.recordset[0].LOGID ? resultRenameDirectoryLog.recordset[0].LOGID : null


      if (!LogIDRename || !resultRenameDirectoryLog.recordset) {
        await transaction.rollback();
        return new ServiceResponse(false, "Ghi Log thất bại", {});
      }
    } catch (e) {
      await transaction.rollback();
      logger.error(e, { function: "fileManagerService.ReNameDirectoryLog" });
      return new ServiceResponse(false, e.message);
    }
    await transaction.commit();
    return new ServiceResponse(true, "Thay đổi tên thư mục thành công", {
      name_dir_old: directory_name_old,
      name_dir_new: directory_name_new
    });
  } catch (e) {
    await transaction.rollback();
    logger.error(e, { function: "fileManagerService.ReNameDirectory" });

    return new ServiceResponse(false, e.message);
  }

}

const deleteDirectory = async (directory_id, bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    const requestdeleteDirectory = new sql.Request(transaction);
    const resultdeleteDirectory = await requestdeleteDirectory
      .input('DIRECTORYID', directory_id)
      .input('DIRECTORYOWNER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('FM_DIRECTORY_DELETE_App');

    let directory_path = resultdeleteDirectory && resultdeleteDirectory.recordset.length > 0 && resultdeleteDirectory.recordset[0].RESULT ? resultdeleteDirectory.recordset[0].RESULT : null;

    let directory_id_response = resultdeleteDirectory && resultdeleteDirectory.recordset.length > 0 && resultdeleteDirectory.recordset[0].DIRECTORYID ? resultdeleteDirectory.recordset[0].DIRECTORYID : null;


    if (!directory_path || !resultdeleteDirectory.recordset) {
      await transaction.rollback();
      return new ServiceResponse(false, "Xóa thư mục không thành công", {})
    }
    if (directory_path == 'Error_DELETE') {
      await transaction.rollback();
      return new ServiceResponse(false, "Bạn không thể thao tác xóa với thư mục này", {})
    }

    let descriptionMessaage = `${apiHelper.getValueFromObject(bodyParams, 'auth_name')} đã xóa thư mục ${directory_path} `

    try {
      const requestDeleteDirectoryLog = new sql.Request(transaction);
      const resultDeleteDirectoryLog = await requestDeleteDirectoryLog
        .input('DIRECTORYID', directory_id_response)
        .input('DIRECTORYNAME', null)
        .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .input('DESCRIPTION', descriptionMessaage)
        .input('ISDELETE', directory_path ? 1 : 0)
        .input('ISSHARE', 0)
        .input('ISRENAME', 0)
        .input('ISMOVE', 0)
        .input('ISCREATESUBDIRECTORY', 0)
        .input('ISUPLOADFILE', 0)
        .execute('FM_DIRECTORY_LOG_Create_App');

      let LogIDDelete = resultDeleteDirectoryLog && resultDeleteDirectoryLog.recordset && resultDeleteDirectoryLog.recordset.length > 0
        && resultDeleteDirectoryLog.recordset[0].LOGID ? resultDeleteDirectoryLog.recordset[0].LOGID : null


      if (!LogIDDelete || !resultDeleteDirectoryLog.recordset) {
        await transaction.rollback();
        return new ServiceResponse(false, "Ghi Log thất bại", {});
      }
    } catch (e) {
      await transaction.rollback();
      logger.error(e, { function: "fileManagerService.DeleteDirectoryLog" });
      return new ServiceResponse(false, e.message);
    }

    await transaction.commit();
    return new ServiceResponse(true, "Xóa thư mục thành công", {});
  } catch (e) {
    await transaction.rollback();
    logger.error(e, { function: "fileManagerService.DeleteDirectory" });
    return new ServiceResponse(false, e.message);
  }
}

const getInforDirectory = async (directory_id, bodyParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input("CURRENTUSER", apiHelper.getValueFromObject(bodyParams, "auth_name"))
      .input("DIRECTORYID", directory_id)
      .execute("FM_DIRECTORY_GetInfor_App");

    let resultCheck = data && data.recordset.length > 0 && data.recordset[0].RESULT ? data.recordset[0].RESULT : null;
    let result = fileManagerClass.detailDirectory(data.recordset);


    if (resultCheck == 'Error_READ') {
      return new ServiceResponse(false, "Bạn không có thao tác xem tài liệu này", {})
    }

    let arrayTage = handleMergeDataDirectory(result);

    arrayTage.map((items) => {
      if (items.is_tag && (items.list_tag)) {
        items.list_tag.unshift({
          file_tage_name: items.file_tage_name,
          file_tag_id: items.file_tag_id,
          color: items.color,
          icon_url: items.icon_url,
          is_tag: items.is_tag

        })
      } else if (items.is_tag && !items.list_tag) {
        items.list_tag = [{
          file_tage_name: items.file_tage_name,
          file_tag_id: items.file_tag_id,
          color: items.color,
          icon_url: items.icon_url,
          is_tag: items.is_tag
        }]
      }
      items.file_tage_name = null;
      items.file_tag_id = null
      items.color = null;
      items.icon_url = null;
    })

    return new ServiceResponse(true, "", arrayTage);
  } catch (e) {
    logger.error(e, { function: "fileManagerService.getInforFile" });
    return new ServiceResponse(true, "", {});
  }
}

const moveDirectory = async (bodyParams = {}) => {

  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    const requestMoveDirectory = new sql.Request(transaction);
    const resultMoveDirectory = await requestMoveDirectory
      .input('DIRECTORYID', apiHelper.getValueFromObject(bodyParams, 'directory_id'))
      .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
      .input('DIRECTORYOWNER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('FM_DIRECTORY_UpdateParentID_App');

    let directory_path_old = resultMoveDirectory && resultMoveDirectory.recordset.length > 0 && resultMoveDirectory.recordset[0].OLDDIRECTORY ? resultMoveDirectory.recordset[0].OLDDIRECTORY : null;

    let directory_path_new = resultMoveDirectory && resultMoveDirectory.recordset.length > 0 && resultMoveDirectory.recordset[0].NEWDIRECTORY ? resultMoveDirectory.recordset[0].NEWDIRECTORY : null;

    let directory_id = resultMoveDirectory && resultMoveDirectory.recordset.length > 0 && resultMoveDirectory.recordset[0].RESULT ? resultMoveDirectory.recordset[0].RESULT : null;



    if (!directory_id || !resultMoveDirectory.recordset) {
      await transaction.rollback();
      return new ServiceResponse(false, "Di chuyển thư mục không thành công", {})
    }
    if (directory_id == 'Error_ADD_TO') {
      await transaction.rollback();
      return new ServiceResponse(false, "Bạn không thể thao tác di chuyển vào thư mục", {})
    }
    if (directory_id == 'Error_ADD_FROM') {
      await transaction.rollback();
      return new ServiceResponse(false, "Bạn không thể thao tác di chuyển thư mục đi", {})
    }

    let descriptionMessaage = `${apiHelper.getValueFromObject(bodyParams, 'auth_name')} đã di chuyển thư mục ${directory_id} từ ${directory_path_old} đến ${directory_path_new}`;

    // Save log di chuyển thư mục
    try {
      const requestMoveDirectoryLog = new sql.Request(transaction);
      const resultMoveDirectoryLog = await requestMoveDirectoryLog
        .input('DIRECTORYID', directory_id)
        .input('DIRECTORYNAME', null)
        .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .input('DESCRIPTION', descriptionMessaage)
        .input('ISDELETE', 0)
        .input('ISSHARE', 0)
        .input('ISRENAME', 0)
        .input('ISMOVE', directory_id ? 1 : 0)
        .input('ISCREATESUBDIRECTORY', 0)
        .input('ISUPLOADFILE', 0)
        .execute('FM_DIRECTORY_LOG_Create_App');

      let LogIDRename = resultMoveDirectoryLog && resultMoveDirectoryLog.recordset && resultMoveDirectoryLog.recordset.length > 0
        && resultMoveDirectoryLog.recordset[0].LOGID ? resultMoveDirectoryLog.recordset[0].LOGID : null


      if (!LogIDRename || !resultMoveDirectoryLog.recordset) {
        await transaction.rollback();
        return new ServiceResponse(false, "Ghi Log thất bại", {});
      }
    } catch (e) {
      await transaction.rollback();
      logger.error(e, { function: "fileManagerService.moveDirectoryLog" });
      return new ServiceResponse(false, e.message);
    }

    await transaction.commit();
    return new ServiceResponse(true, "Di chuyển thư mục thành công", {});
  } catch (e) {
    await transaction.rollback();
    logger.error(e, { function: "fileManagerService.moveDirectory" });

    return new ServiceResponse(false, e.message);
  }

}

const shareFile = async (bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  const listUser = apiHelper.getValueFromObject(bodyParams, 'list_user', []);
  const listDepartment = apiHelper.getValueFromObject(bodyParams, 'list_department', []);

  await transaction.begin();
  try {
    const requestShareFile = new sql.Request(transaction);
    const requestSharFileLog = new sql.Request(transaction);

    const requestShareDirectoryGetList = new sql.Request(transaction); // Từ directory_id sẽ lấy tất cả 
    const resultShareFile = await requestShareDirectoryGetList
      .input('FILEID', apiHelper.getValueFromObject(bodyParams, 'file_id'))
      .execute('FM_FILE_SHARE_GetParent_App');

    // let listPathParent = resultShareFile
    let directoryID = resultShareFile && resultShareFile.recordset && resultShareFile.recordset.length > 0
      && resultShareFile.recordset[0].DIRECTORYID ? resultShareFile.recordset[0].DIRECTORYID : null

    let bodySend = {
      ...bodyParams,
      directory_share_id: null,
      directory_id: directoryID
    }
    if (directoryID) {
      try {
        let result = await ShareListParent(bodySend);
      } catch (e) {
        await transaction.rollback();
        return new ServiceResponse(false, "Có lỗi xảy ra", {});
      }
    };


    const requestAddShareDepartment = new sql.Request(transaction);
    if (listDepartment && listDepartment.length && listDepartment.length > 0) { // Nếu chia sẻ cho phòng ban thì chạy khối lệnh này

      for (let i = 0; i < listDepartment.length; i++) {
        const resultAddShareDepartment = await requestAddShareDepartment
          .input('FILESHAREID', apiHelper.getValueFromObject(bodyParams, 'file_share_id'))
          .input('FILEID', apiHelper.getValueFromObject(bodyParams, 'file_id'))
          .input('POSITIONID', apiHelper.getValueFromObject(bodyParams, 'position_id'))
          .input('DEPARTMENTID', listDepartment[i].department_id)
          .input('USERGROUPID', apiHelper.getValueFromObject(bodyParams, 'user_group_id'))
          .input('USERNAME', null)
          .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
          .input('ISREAD', listDepartment[i].is_read)
          .input('ISWRITE', listDepartment[i].is_write)
          .input('ISDELETE', listDepartment[i].is_delete)
          .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
          .execute('FM_FILE_SHARE_CreateOrUpdate_App');

        let file_share_id = resultAddShareDepartment && resultAddShareDepartment.recordset && resultAddShareDepartment.recordset.length > 0 && resultAddShareDepartment.recordset[0].RESULT ? resultAddShareDepartment.recordset[0].RESULT : null;

        if (!file_share_id || !resultAddShareDepartment.recordset) {
          await transaction.rollback();
          return new ServiceResponse(false, "", { message: "Chia sẻ thư mục thất bại" })
        }
        if (file_share_id == 'Error_DIREC_OWNER') {
          await transaction.rollback();
          return new ServiceResponse(false, "Bạn không thể thao tác chia sẻ trên thư mục này", {})
        }

        let descriptionMessaage = `${apiHelper.getValueFromObject(bodyParams, 'auth_name')} Đã chia sẻ tập tin ${apiHelper.getValueFromObject(bodyParams, 'file_id')} cho phòng ban ${listDepartment[i].department_id}`

        const resultShareFileLog = await requestSharFileLog
          .input('FILEID', apiHelper.getValueFromObject(bodyParams, 'file_id'))
          .input('USERNAME', listDepartment[i].department_id)
          .input('DESCRIPTION', descriptionMessaage)
          .input('ISDELETE', 0)
          .input('ISSHARE', file_share_id ? 1 : 0)
          .input('ISRENAME', 0)
          .input('ISMOVE', 0)
          .execute('FM_FILE_LOG_Create_App');

        let LogIDShare = resultShareFileLog && resultShareFileLog.recordset && resultShareFileLog.recordset.length > 0
          && resultShareFileLog.recordset[0].LOGID ? resultShareFileLog.recordset[0].LOGID : null

        if (!LogIDShare || !resultShareFileLog.recordset) {
          await transaction.rollback();
          return new ServiceResponse(false, "Ghi Log thất bại", {});
        }


      }
    }



    if (listUser && listUser.length > 0) {
      for (let i = 0; i < listUser.length; i++) {
        // // Share tập tin với người dùng 
        const resultShareFile = await requestShareFile
          .input('FILESHAREID', apiHelper.getValueFromObject(bodyParams, 'file_share_id'))
          .input('FILEID', apiHelper.getValueFromObject(bodyParams, 'file_id'))
          .input('POSITIONID', apiHelper.getValueFromObject(bodyParams, 'position_id'))
          .input('DEPARTMENTID', apiHelper.getValueFromObject(bodyParams, 'department_id'))
          .input('USERGROUPID', apiHelper.getValueFromObject(bodyParams, 'user_group_id'))
          .input('USERNAME', listUser[i].user_name)
          .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
          .input('ISREAD', listUser[i].is_read)
          .input('ISWRITE', listUser[i].is_write)
          .input('ISDELETE', listUser[i].is_delete)
          .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
          .execute('FM_FILE_SHARE_CreateOrUpdate_AdminWeb');

        let file_share_id = resultShareFile && resultShareFile.recordset.length > 0 && resultShareFile.recordset[0].RESULT ? resultShareFile.recordset[0].RESULT : null;

        if (!file_share_id || !resultShareFile.recordset) {
          await transaction.rollback();
          return new ServiceResponse(false, "Chia sẻ tập tin thất bại", {})
        }

        let descriptionMessaage = `${apiHelper.getValueFromObject(bodyParams, 'auth_name')} Đã chia sẻ tập tin ${apiHelper.getValueFromObject(bodyParams, 'file_id')} với ${listUser[i]}`

        const resultShareFileLog = await requestSharFileLog
          .input('FILEID', apiHelper.getValueFromObject(bodyParams, 'file_id'))
          .input('USERNAME', listUser[i].user_name)
          .input('DESCRIPTION', descriptionMessaage)
          .input('ISDELETE', 0)
          .input('ISSHARE', file_share_id ? 1 : 0)
          .input('ISRENAME', 0)
          .input('ISMOVE', 0)
          .execute('FM_FILE_LOG_Create_App');

        let LogIDShare = resultShareFileLog && resultShareFileLog.recordset && resultShareFileLog.recordset.length > 0
          && resultShareFileLog.recordset[0].LOGID ? resultShareFileLog.recordset[0].LOGID : null

        if (!LogIDShare || !resultShareFileLog.recordset) {
          await transaction.rollback();
          return new ServiceResponse(false, "Ghi Log thất bại", {});
        }
      }
    }


    await transaction.commit();
    return new ServiceResponse(true, "Chia sẻ tập tin thành công ", {});
  } catch (e) {
    await transaction.rollback();
    logger.error(e, { function: "fileManagerService.shareFile" });
    return new ServiceResponse(false, e.message);
  }
}



const getInforFile = async (file_id, bodyParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input("CURRENTUSER", apiHelper.getValueFromObject(bodyParams, "auth_name"))
      .input("FILEID", file_id)
      .execute("FM_FILE_GetInfor_App");

    let resultCheck = data && data.recordset.length > 0 && data.recordset[0].RESULT ? data.recordset[0].RESULT : null;
    let result = fileManagerClass.detailFile(data.recordset);

    // console.log(groupBy(result,"file_id"));

    if (resultCheck == 'Error_READ') {
      return new ServiceResponse(false, "Bạn không có thao tác xem tài liệu này", {})
    }

    let arrayTage = handleMergeData(result);
    // console.log(arrayTage)

    // let arrayReduce = reduceResult(result);

    arrayTage.map((items) => {
      if (items.is_tag && (items.list_tag)) {
        items.list_tag.unshift({
          file_tage_name: items.file_tage_name,
          file_tag_id: items.file_tag_id,
          color: items.color,
          icon_url: items.icon_url,
          is_tag: items.is_tag

        })
      } else if (items.is_tag && !items.list_tag) {
        items.list_tag = [{
          file_tage_name: items.file_tage_name,
          file_tag_id: items.file_tag_id,
          color: items.color,
          icon_url: items.icon_url,
          is_tag: items.is_tag
        }]
      }
      items.file_tage_name = null;
      items.file_tag_id = null
      items.color = null;
      items.icon_url = null;
    })

    return new ServiceResponse(true, "", arrayTage);
  } catch (e) {
    logger.error(e, { function: "fileManagerService.getInforFile" });
    return new ServiceResponse(true, "", {});
  }
}


const moveFile = async (bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    const requestMoveFile = new sql.Request(transaction);
    const resultMoveFile = await requestMoveFile
      .input('DIRECTORYID', apiHelper.getValueFromObject(bodyParams, 'directory_id'))
      .input('FILEID', apiHelper.getValueFromObject(bodyParams, 'file_id'))
      .input('FILEOWNER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('FM_FILE_UpdateDirectoryID_App');

    let result = resultMoveFile && resultMoveFile.recordset.length > 0 && resultMoveFile.recordset[0].RESULT ? resultMoveFile.recordset[0].RESULT : null;

    let directory_path_new = resultMoveFile && resultMoveFile.recordset.length > 0 && resultMoveFile.recordset[0].NEWDIRECTORY ? resultMoveFile.recordset[0].NEWDIRECTORY : null;

    let directory_path_old = resultMoveFile && resultMoveFile.recordset.length > 0 && resultMoveFile.recordset[0].OLDDIRECTORY ? resultMoveFile.recordset[0].OLDDIRECTORY : null;

    let descriptionMessaage = `${apiHelper.getValueFromObject(bodyParams, 'auth_name')} đã di chuyển tập tin từ ${directory_path_old} đến ${directory_path_new} `

    if (result == 'Error_ADD_TO') {
      await transaction.rollback();
      return new ServiceResponse(false, "Bạn không thể thao tác di chuyển vào thư mục", {})
    }
    if (result == 'Error_ADD_FILE') {
      await transaction.rollback();
      return new ServiceResponse(false, "Bạn không thể thao tác di chuyển tập tin này đi", {})
    }
    const requestMoveFileLog = new sql.Request(transaction);
    const resultMoveFileLog = await requestMoveFileLog
      .input('FILEID', apiHelper.getValueFromObject(bodyParams, 'file_id'))
      .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .input('DESCRIPTION', descriptionMessaage)
      .input('ISDELETE', 0)
      .input('ISSHARE', 0)
      .input('ISRENAME', 0)
      .input('ISMOVE', result ? 1 : 0)
      .execute('FM_FILE_LOG_Create_App');

    let LogIDShare = resultMoveFileLog && resultMoveFileLog.recordset && resultMoveFileLog.recordset.length > 0
      && resultMoveFileLog.recordset[0].LOGID ? resultMoveFileLog.recordset[0].LOGID : null

    if (!LogIDShare || !resultMoveFileLog.recordset) {
      await transaction.rollback();
      return new ServiceResponse(false, "Ghi Log thất bại", {});
    }

    await transaction.commit();
    return new ServiceResponse(true, "Di chuyển tập tin thành công", {});
  } catch (e) {
    await transaction.rollback();
    logger.error(e, { function: "fileManagerService.moveFile" });
    return new ServiceResponse(false, e.message);
  }
}

const renameFile = async (bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    const requestReNameFile = new sql.Request(transaction);
    const resultReNameFile = await requestReNameFile
      .input('FILEID', apiHelper.getValueFromObject(bodyParams, 'file_id'))
      .input('FILENAME', apiHelper.getValueFromObject(bodyParams, 'file_name'))
      .input('DIRECTORYID', apiHelper.getValueFromObject(bodyParams, 'directory_id'))
      .input('DOCUMENTTYPEID', apiHelper.getValueFromObject(bodyParams, 'document_type_id'))
      .input('FILEHASH', apiHelper.getValueFromObject(bodyParams, 'file_hash'))
      .input('FILEEXT', apiHelper.getValueFromObject(bodyParams, 'file_ext'))
      .input('FILEMIME', apiHelper.getValueFromObject(bodyParams, 'file_mime'))
      .input('FILESIZE', apiHelper.getValueFromObject(bodyParams, 'file_size'))
      .input('FILEURL', apiHelper.getValueFromObject(bodyParams, 'file_url'))
      .input('FILEOWNER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .input('ISSHARETOALL', apiHelper.getValueFromObject(bodyParams, 'is_share_all'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .execute('FM_FILE_CreateOrUpdate_App');

    let file_id = resultReNameFile && resultReNameFile.recordset.length > 0 && resultReNameFile.recordset[0].RESULT ? resultReNameFile.recordset[0].RESULT : null;

    let file_name_old = resultReNameFile && resultReNameFile.recordset.length > 0 && resultReNameFile.recordset[0].OLDNAME ? resultReNameFile.recordset[0].OLDNAME : null;

    let file_name_new = resultReNameFile && resultReNameFile.recordset.length > 0 && resultReNameFile.recordset[0].NEWNAME ? resultReNameFile.recordset[0].NEWNAME : null;



    if (!file_id || !resultReNameFile.recordset) {
      await transaction.rollback();
      return new ServiceResponse(false, "Thay đổi tập tin không thành công", {})
    }
    if (file_id == 'Error_EDIT') {
      await transaction.rollback();
      return new ServiceResponse(false, "Bạn không thể thao tác thay đổi với tập tin này", {})
    }

    let descriptionMessaage = `${apiHelper.getValueFromObject(bodyParams, 'auth_name')} đã đổi tên tập tin từ ${file_name_old} thành ${apiHelper.getValueFromObject(bodyParams, 'file_name')} `;

    const requestRenameFileLog = new sql.Request(transaction);
    const resultRenameFileLog = await requestRenameFileLog
      .input('FILEID', apiHelper.getValueFromObject(bodyParams, 'file_id'))
      .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .input('DESCRIPTION', descriptionMessaage)
      .input('ISDELETE', 0)
      .input('ISSHARE', 0)
      .input('ISRENAME', file_id ? 1 : 0)
      .input('ISMOVE', 0)
      .execute('FM_FILE_LOG_Create_App');

    let LogIDShare = resultRenameFileLog && resultRenameFileLog.recordset && resultRenameFileLog.recordset.length > 0
      && resultRenameFileLog.recordset[0].LOGID ? resultRenameFileLog.recordset[0].LOGID : null

    if (!LogIDShare || !resultRenameFileLog.recordset) {
      await transaction.rollback();
      return new ServiceResponse(false, "Ghi Log thất bại", {});
    }

    await transaction.commit();
    return new ServiceResponse(true, "Thay đổi tên tập tin thành công", {
      name_file_old: file_name_old,
      name_file_new: file_name_new
    });
  } catch (e) {
    await transaction.rollback();
    logger.error(e, { function: "fileManagerService.renameFile" });
    return new ServiceResponse(false, e.message);
  }
}

const deleteFile = async (file_id, bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    const requestdeleteDirectory = new sql.Request(transaction);
    const resultdeleteDirectory = await requestdeleteDirectory
      .input('FILEID', file_id)
      .input('FILEOWNER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('FM_FILE_DELETE_App');

    let file_id_res = resultdeleteDirectory && resultdeleteDirectory.recordset.length > 0 && resultdeleteDirectory.recordset[0].RESULT ? resultdeleteDirectory.recordset[0].RESULT : null;

    // let directory_id_response =  resultdeleteDirectory && resultdeleteDirectory.recordset.length >0 && resultdeleteDirectory.recordset[0].DIRECTORYID ? resultdeleteDirectory.recordset[0].DIRECTORYID : null;

    if (!file_id_res || !resultdeleteDirectory.recordset) {
      await transaction.rollback();
      return new ServiceResponse(false, "Xóa tập tin không thành công", {})
    }
    if (file_id_res == 'Error_DELETE') {
      await transaction.rollback();
      return new ServiceResponse(false, "Bạn không thể thao tác xóa với tập tin này", {})
    }

    let descriptionMessaage = `${apiHelper.getValueFromObject(bodyParams, 'auth_name')} đã xóa tập tin ${file_id_res} `

    try {
      const requestDeleteFileLog = new sql.Request(transaction);
      const resultDeleteFileLog = await requestDeleteFileLog
        .input('FILEID', file_id)
        .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .input('DESCRIPTION', descriptionMessaage)
        .input('ISDELETE', file_id_res ? 1 : 0)
        .input('ISSHARE', 0)
        .input('ISRENAME', 0)
        .input('ISMOVE', 0)
        .execute('FM_FILE_LOG_Create_App');

      let LogIDShare = resultDeleteFileLog && resultDeleteFileLog.recordset && resultDeleteFileLog.recordset.length > 0
        && resultDeleteFileLog.recordset[0].LOGID ? resultDeleteFileLog.recordset[0].LOGID : null

      if (!LogIDShare || !resultDeleteFileLog.recordset) {
        await transaction.rollback();
        return new ServiceResponse(false, "Ghi Log thất bại", {});
      }
    } catch (e) {
      await transaction.rollback();
      logger.error(e, { function: "fileManagerService.DeleteFileLog" });
      return new ServiceResponse(false, e.message);
    }

    await transaction.commit();
    return new ServiceResponse(true, "Xóa tập tin thành công", {});
  } catch (e) {
    await transaction.rollback();
    logger.error(e, { function: "fileManagerService.DeleteFile" });
    return new ServiceResponse(false, e.message);
  }
}


const createTagType = async (bodyParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('FILETAGID', apiHelper.getValueFromObject(bodyParams, 'file_tag_id'))
      .input('FILETAGNAME', apiHelper.getValueFromObject(bodyParams, 'file_tag_name'))
      .input('COLOR', apiHelper.getValueFromObject(bodyParams, 'color'))
      .input('ICONURL', apiHelper.getValueFromObject(bodyParams, 'icon_url'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('MD_FILETAG_CreateOrUpdate_App');

    let file_tag_type_id = data && data.recordset && data.recordset.length > 0 && data.recordset[0].RESULT ? data.recordset[0].RESULT : null;

    if (!file_tag_type_id || !data.recordset) {
      return new ServiceResponse(false, "Đã có lỗi xảy ra", {});
    }
    return new ServiceResponse(true, apiHelper.getValueFromObject(bodyParams, 'file_tag_id') ? 'Cập nhật loại nhãn dán thành công' : 'Khởi tạo loại nhãn thành công', { file_tag_type_id });
  } catch (e) {
    logger.error(e, { 'function': 'fileManagerService.createTagFileType' });
    return new ServiceResponse(false, e.message);
  }
}


const createTagFile = async (bodyParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('FILEUSERID', apiHelper.getValueFromObject(bodyParams, 'file_tag_user_id'))
      .input('FILETAGID', apiHelper.getValueFromObject(bodyParams, 'file_tag_id'))
      .input('FILEID', apiHelper.getValueFromObject(bodyParams, 'file_id'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .input('ISTAG', apiHelper.getValueFromObject(bodyParams, 'is_tag'))

      .execute('FM_FILE_USER_CreateOrUpdate_App');

    let file_tag_id = data && data.recordset && data.recordset.length > 0 && data.recordset[0].RESULT ? data.recordset[0].RESULT : null;

    if (!file_tag_id || !data.recordset) {
      return new ServiceResponse(false, 'Cập nhật nhãn dán tập tin thất bại', {});
    }
    return new ServiceResponse(true, 'Cập nhật nhãn tập tin thành công', {});
  } catch (e) {
    logger.error(e, { 'function': 'fileManagerService.createTagFile' });
    return new ServiceResponse(false, e.message);
  }
}

const createTagDirectory = async (bodyParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('DIRECTORYUSERID', apiHelper.getValueFromObject(bodyParams, 'directory_tag_user_id'))
      .input('FILETAGID', apiHelper.getValueFromObject(bodyParams, 'file_tag_id'))
      .input('DIRECTORYID', apiHelper.getValueFromObject(bodyParams, 'directory_id'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .input('ISTAG', apiHelper.getValueFromObject(bodyParams, 'is_tag'))

      .execute('FM_DIRECTORY_USER_CreateOrUpdate_AdminWeb');

    let file_tag_id = data && data.recordset && data.recordset.length > 0 && data.recordset[0].RESULT ? data.recordset[0].RESULT : null;

    if (!file_tag_id || !data.recordset) {
      return new ServiceResponse(false, 'Cập nhật nhãn dán tập tin thất bại', {});
    }
    return new ServiceResponse(true, 'Cập nhật nhãn tập tin thành công', {});
  } catch (e) {
    logger.error(e, { 'function': 'fileManagerService.createTagDirectory' });
    return new ServiceResponse(false, e.message);
  }
}



const getListTagTypeFile = async (bodyParams = {}, queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('CURRENTUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('MD_FILETAG_GetList_App');
    const result = fileManagerClass.listTaglType(data.recordset);

    return new ServiceResponse(true, '', {
      'data': result,
      'page': currentPage,
      'limit': itemsPerPage,
      // 'total': total,
    });
  } catch (e) {
    logger.error(e, { 'function': 'fileManagerService.getlistTagType' });
    return new ServiceResponse(true, '', {});
  }
};

const deleteFileTagType = async (FiletagID, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('FILETAGID', FiletagID)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute("MD_FILETAG_Delete_App");
    return new ServiceResponse(true, RESPONSE_MSG.NEWS.DELETE_SUCCESS, true);
  } catch (e) {
    logger.error(e, { 'function': 'fileManagerService.deleteTagType' });
    return new ServiceResponse(false, e.message);
  }
};

const downloadFile = async (FileID, bodyParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('FILEID', FileID)
      .input('CURRENTUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute("FM_FILE_Download_App");

    let result = data && data.recordset && data.recordset.length > 0 && data.recordset[0].RESULT ? data.recordset[0].RESULT : null;

    if (data && data.recordset && data.recordset.length > 0) {
      let resultData = fileManagerClass.detailFile(data.recordset);
      let arrayTage = handleMergeData(resultData);

      // let arrayReduce = reduceResult(result);

      arrayTage.map((items) => {
        if (items.is_tag && items.list_tag) {
          items.list_tag.unshift({
            file_tage_name: items.file_tage_name,
            file_tag_id: items.file_tag_id,
            color: items.color,
            icon_url: items.icon_url,
            is_tag: items.is_tag

          })

        }
        items.file_tage_name = null;
        items.file_tag_id = null
        items.color = null;
        items.icon_url = null;
      })

      if (!result || !data.recordset) {
        return new ServiceResponse(false, 'Yêu cầu tải tập tin thất bại', {});
      }
      if (result == "Error_Down") {
        return new ServiceResponse(false, 'Bạn không có thao tác tải trên tập tin', {});
      }

      if (result == 'Error_READ') {
        return new ServiceResponse(false, "Bạn không có thao tác xem tài liệu này", {})
      }

      return new ServiceResponse(true, "", arrayTage[0]);
    } else {
      return new ServiceResponse(false, 'Tập tin không tồn tại', {});
    }

  } catch (e) {
    logger.error(e, { 'function': 'fileManagerService.downloadFile' });
    return new ServiceResponse(false, e.message);
  }
}



const downloadFileForAPP = async (FileID, bodyParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('FILEID', FileID)
      .input('CURRENTUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute("FM_FILE_Download_App");

    let result = data && data.recordset && data.recordset.length > 0 && data.recordset[0].RESULT ? data.recordset[0].RESULT : null;

    if (data && data.recordset && data.recordset.length > 0) {
      let resultData = fileManagerClass.detailFileForApp(data.recordset);
      let arrayTage = handleMergeData(resultData);

      // let arrayReduce = reduceResult(result);

      arrayTage.map((items) => {
        if (items.is_tag && items.list_tag) {
          items.list_tag.unshift({
            file_tage_name: items.file_tage_name,
            file_tag_id: items.file_tag_id,
            color: items.color,
            icon_url: items.icon_url,
            is_tag: items.is_tag

          })

        }
        items.file_tage_name = null;
        items.file_tag_id = null
        items.color = null;
        items.icon_url = null;
      })


      if (!result || !data.recordset) {
        return new ServiceResponse(false, 'Yêu cầu tải tập tin thất bại', {});
      }
      if (result == "Error_Down") {
        return new ServiceResponse(false, 'Bạn không có thao tác tải trên tập tin', {});
      }

      if (result == 'Error_READ') {
        return new ServiceResponse(false, "Bạn không có thao tác xem tài liệu này", {})
      }

      return new ServiceResponse(true, "", arrayTage[0]);
    } else {
      return new ServiceResponse(false, 'Tập tin không tồn tại', {});
    }

  } catch (e) {
    logger.error(e, { 'function': 'fileManagerService.downloadFile' });
    return new ServiceResponse(false, e.message);
  }
}



const createFile = async (file = [], bodyParams = {}, auth) => {
  let list_name = apiHelper.getValueFromObject(bodyParams, 'file_name', []);
  let obj = {
    ...bodyParams,
    file_hash: null,
    file_name: null,
    file_ext: null,
    file_mine: null,
    file_size: null
  }
  let array = [];
  for (let i = 0; i < file.length; i++) {
    const response = await uploadFile(file[i]);

    array.push({
      ...obj,
      file_name: list_name[i] ? path.parse(list_name[i]).name : path.parse(response.file).name,
      file_ext: response.file.split('.').pop(),
      file_hash: path.parse(response.file).name,
      file_mime: file[i].mimetype,
      file_size: file[i].size,
      file_url: response.file
    })
  }
  console.log(array);
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);

  await transaction.begin();
  try {
    const requestCreateFile = new sql.Request(transaction);
    const requestUploadFileLog = new sql.Request(transaction);
    for (let i = 0; i < array.length; i++) {
      const resultCreateFile = await requestCreateFile
        .input('FILEID', apiHelper.getValueFromObject(bodyParams, 'file_id'))
        .input('FILENAME', array[i].file_name)
        .input('DIRECTORYID', array[i].directory_id)
        .input('DOCUMENTTYPEID', array[i].document_type_id)
        .input('FILEHASH', array[i].file_hash)
        .input('FILEEXT', array[i].file_ext)
        .input('FILEMIME', array[i].file_mime)
        .input('FILESIZE', array[i].file_size)
        .input('FILEURL', array[i].file_url)
        .input('FILEOWNER', apiHelper.getValueFromObject(auth, 'user_name'))
        .input('ISSHARETOALL', array[i].is_share_all)
        .input('ISACTIVE', array[i].is_active)
        .execute('FM_FILE_CreateOrUpdate_App');

      let result = resultCreateFile && resultCreateFile.recordset && resultCreateFile.recordset.length > 0 && resultCreateFile.recordset[0].RESULT ? resultCreateFile.recordset[0].RESULT : null;
      let pathURL = resultCreateFile && resultCreateFile.recordset && resultCreateFile.recordset.length > 0 && resultCreateFile.recordset[0].PATHURL ? resultCreateFile.recordset[0].PATHURL : null;

      if (!result || !resultCreateFile.recordset) {
        await transaction.rollback();
        return new ServiceResponse(false, "Thêm tập tin thất bại", {});
      }
      if (result == 'Error_ADD') {
        await transaction.rollback();
        return new ServiceResponse(false, "", { message: "Bạn không thể tạo mới ở thư mục này" })
      }

      let descriptionMessaage = `${apiHelper.getValueFromObject(auth, 'user_name')} đã tải lên tập tin ${result} ở thư mục ${pathURL}`;
      try {
        const resultUploadFileLog = await requestUploadFileLog
          .input('FILEID', result)
          .input('USERNAME', apiHelper.getValueFromObject(auth, 'user_name'))
          .input('DESCRIPTION', descriptionMessaage)
          .input('ISDELETE', 0)
          .input('ISSHARE', 0)
          .input('ISRENAME', 0)
          .input('ISMOVE', 0)
          .execute('FM_FILE_LOG_Create_App');

        let LogIDShare = resultUploadFileLog && resultUploadFileLog.recordset && resultUploadFileLog.recordset.length > 0
          && resultUploadFileLog.recordset[0].LOGID ? resultUploadFileLog.recordset[0].LOGID : null

        if (!LogIDShare || !resultUploadFileLog.recordset) {
          await transaction.rollback();
          return new ServiceResponse(false, "Ghi Log thất bại", {});
        }
      } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: "fileManagerService.CreateFileLog" });
        return new ServiceResponse(false, e.message);
      }

    }
    await transaction.commit();
    return new ServiceResponse(true, "Thêm tập tin thành công ", {});
  } catch (e) {
    await transaction.rollback();
    logger.error(e, { function: "fileManagerService.CreateFile" });
    return new ServiceResponse(false, e.message);
  }

}



const getListUserShare = async (bodyParams = {}, queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    let is_directory = apiHelper.getValueFromObject(queryParams, "is_directory")

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('ID', apiHelper.getValueFromObject(queryParams, "id"))
      .input('CURRENTUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .input("KEYWORD", apiHelper.getValueFromObject(queryParams, "key_word"))
      .input("ISSORTUSERNAME", apiHelper.getValueFromObject(queryParams, "is_sort_user_name"))
      .input('ISDIRECTORY', is_directory)
      .execute('FM_DIRECTORY_GetListPermission_App');

    let result = data && data.recordset && data.recordset.length > 0 && data.recordset[0].RESULT ? data.recordset[0].RESULT : null;


    let listUser = data && data.recordsets && data.recordsets.length > 0 && data.recordsets[0] && data.recordsets[0] ? data.recordsets[0] : [];

    let listDepartment = data && data.recordsets && data.recordsets.length > 0 && data.recordsets[1] && data.recordsets[1] ? data.recordsets[1] : [];

    if (result == "Error_OWNER_DIR") {
      return new ServiceResponse(false, 'Danh sách chỉ hiện thị cho người tạo của thư mục này', {});
    }
    if (result == "Error_DIR") {
      return new ServiceResponse(false, 'Thư mục không tồn tại', {});
    }
    if (result == "Error_OWNER_FILE") {
      return new ServiceResponse(false, 'Danh sách chỉ hiện thị cho người tạo của tập tin này', {});
    }
    if (result == "Error_FILE") {
      return new ServiceResponse(false, 'tập tin không tồn tại', {});
    }

    return new ServiceResponse(true, '', {
      'data': is_directory == 'true' ? {
        list_user: fileManagerClass.listPermissionDir(listUser),
        list_department: fileManagerClass.listPermissionDir(listDepartment)
      } : {
        list_user: fileManagerClass.listPermissionFile(listUser),
        list_department: fileManagerClass.listPermissionFile(listDepartment)
      },
      // 'data': is_directory == 'true' ? fileManagerClass.listPermissionDir(listUser) : fileManagerClass.listPermissionFile(listUser),
      'page': currentPage,
      'limit': itemsPerPage,
      // 'total': total,
    });
  } catch (e) {
    logger.error(e, { 'function': 'fileManagerService.getlistTagType' });
    return new ServiceResponse(true, '', {});
  }
};


module.exports = {
  getListDocumentType,
  getListFile,
  getListDirectory,
  getListAll,
  getListSearchAll,
  // Directory
  createDirectory,
  shareDirectory,
  renameDirectory,
  deleteDirectory,
  moveDirectory,
  getInforDirectory,
  createTagDirectory,
  // File
  shareFile,
  getInforFile,
  moveFile,
  renameFile,
  deleteFile,
  //Tag
  createTagType,
  createTagFile,
  getListTagTypeFile,
  deleteFileTagType,
  downloadFile,
  downloadFileForAPP,
  createFile,
  // List Permission
  getListUserShare

};
