const FileManagerService = require('./file-manager.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ListResponseV2 = require('../../common/responses/list.responseV2');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ErrorResponse = require('../../common/responses/error.response');
const fs = require("fs");
const request = require('request');
const http = require('http'); // or 'https' for https:// URLs
const config = require("../../../config/config");
const axios = require('axios');
const stream = require('stream');
/**
 * Get list MD_STORE
 */

const getListDocumentType = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.getListDocumentType(req.body, req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};


const getListFile = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.getListFile(req.body, req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const getListDirectory = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.getListDirectory(req.body, req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const getListAll = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.getListAll(req.body, req.query);
    const { data, total, page, limit, parentFolder, pathArray } = serviceRes.getData();
    return res.json(new ListResponseV2(data, total, page, limit, [], parentFolder, pathArray));
  } catch (error) {
    return next(error);
  }
};


const getListSearchAll = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.getListSearchAll(req.body, req.query);
    const { data, total, page, limit, parentFolder } = serviceRes.getData();
    //   console.log(serviceRes.getData());
    return res.json(new ListResponseV2(data, total, page, limit, [], parentFolder));
  } catch (error) {
    return next(error);
  }
};


const createDirectory = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.createDirectory(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
}

const shareDirectory = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.shareDirectory(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
}

const renameDirectory = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.renameDirectory(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
}

const deleteDirectory = async (req, res, next) => {
  try {
    let directory_id = req.params.directory_id;
    const serviceRes = await FileManagerService.deleteDirectory(directory_id, req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
}

const moveDirectory = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.moveDirectory(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
}

const shareFile = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.shareFile(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
}

const getInforFile = async (req, res, next) => {
  try {
    let file_id = req.params.file_id;
    const serviceRes = await FileManagerService.getInforFile(file_id, req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
}

const getInforDirectory = async (req, res, next) => {
  try {
    let directory_id = req.params.directory_id;
    const serviceRes = await FileManagerService.getInforDirectory(directory_id, req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
}

const moveFile = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.moveFile(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
}

const renameFile = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.renameFile(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
}

const deleteFile = async (req, res, next) => {
  try {
    let file_id = req.params.file_id;
    const serviceRes = await FileManagerService.deleteFile(file_id, req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
}

const createTagType = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.createTagType(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
}

const createTagFile = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.createTagFile(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
}
const createTagDirectory = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.createTagDirectory(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
}

const getListTagTypeFile = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.getListTagTypeFile(req.body, req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const deleteFileTagType = async (req, res, next) => {
  try {
    let FiletagID = req.params.file_tag_id;
    const serviceRes = await FileManagerService.deleteFileTagType(FiletagID, req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
}


const downloadFileForApp = async (req, res, next) => {

  try {
    let FileID = req.params.file_id;
    const serviceRes = await FileManagerService.downloadFileForAPP(FileID, req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    let { file_id, file_mime, file_url_app, file_ext, file_size, file_name, created_user } = serviceRes.getData()


    let objResponse = {
      file_id,
      file_mime,
      file_url_app,
      file_ext,
      file_size,
      file_name,
      created_user
    }

    return res.json(new SingleResponse(objResponse, serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
}

const downloadFile = async (req, res, next) => {
  try {
    let FileID = req.params.file_id;
    const serviceRes = await FileManagerService.downloadFile(FileID, req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    let { file_mime, file_name, file_url, file_ext, file_size } = serviceRes.getData();


    // axios.get(`${config.domain_cdn}${file_url}`,{ responseType: 'arraybuffer' })
    // .then(response => {
    //     // console.log(response)
    //     // console.log({res})
    //     // var fileContents = Buffer.from(res, "base64");
    //     var readStream = new stream.PassThrough();
    //     readStream.end(response.data);

    //     res.set('Content-disposition', `attachment; filename=${}.${file_ext}`);
    //     res.set('Content-Type', 'text/plain');

    //     readStream.pipe(res);
    // })   


    // Vì Content-Disposition không nhận dấu ( ) trên tập tin nên phải đổi thành [ ] để phù hợp xuất ra tên tập tin khi tải về
    let nameConvert = `${file_name}.${file_ext}`.replace(/\(/g, '\[').replace(/\)/g, '\]');

    let newFileName = encodeURIComponent(nameConvert);

    res.setHeader('Content-Disposition', 'attachment;filename=' + newFileName);
    res.setHeader('Content-Type', `${file_mime}`);


    let pathURL = `${config.domain_cdn}${file_url}`;
    http.get(pathURL, (stream) => {
      stream.pipe(res);
    });


  } catch (error) {
    console.log({ error })
    return next(
      new ErrorResponse(500, error, "Lỗi tải file")
    );
  }
}


const createFile = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.createFile(req.files, JSON.parse(req.body.data), req.auth);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
};

const getListUserShare = async (req, res, next) => {
  try {
    const serviceRes = await FileManagerService.getListUserShare(req.body, req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
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
  createTagDirectory,
  getInforDirectory,
  // File
  shareFile,
  getInforFile,
  moveFile,
  renameFile,
  deleteFile,
  // Tag file
  getListTagTypeFile,
  createTagFile,
  createTagType,
  deleteFileTagType,
  downloadFile,
  downloadFileForApp,
  createFile,
  // Lấy danh sách quyền trên thư mục và tập tin
  getListUserShare
};

