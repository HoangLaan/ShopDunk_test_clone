const bankUserService = require('./bank-user.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const optionsService = require('../../common/services/options.service');

const path = require('path');
const appRootPath = require('app-root-path');
const pathMediaUpload = path.normalize(`${appRootPath}/storage/uploads/bank_user`);
const formidable = require('formidable');
const { mkdirp } = require('mkdirp')
const fs = require('fs');

const getList = async (req, res, next) => {
  try {
    const serviceRes = await bankUserService.getList(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
      const serviceRes = await bankUserService.getById(req.params.id);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
      return next(error);
  }
};

const createOrUpdate = async (req, res, next) => {
  try {
      const serviceRes = await bankUserService.createOrUpdate(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
      return next(error);
  }
};

const _delete = async (req, res, next) => {
  try {
      const serviceRes = await bankUserService.delete(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
      return next(error);
  }
};


const exportExcel = async (req, res, next) => {
  try {
      const serviceRes = await bankUserService.exportExcel(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      const dataRes = serviceRes.getData();
      dataRes.write('bank-user.xlsx', res);
  } catch (error) {
      return next(error);
  }
};

const getTemplateImport = async (req, res, next) => {
  try {
      const serviceRes = await bankUserService.getTemplateImport(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      const dataRes = serviceRes.getData();
      dataRes.write('bank-user-template-import.xlsx', res);
  } catch (error) {
      return next(error);
  }
};

const importExcel = async (req, res, next) => {
  try {
      if (!fs.existsSync(pathMediaUpload)) {
          await mkdirp(pathMediaUpload);
      }

      const form = formidable({
          multiples: false,
          uploadDir: pathMediaUpload,
          maxFileSize: 4 * 1024 * 1024 * 1024,
          hash: true,
          keepExtensions: true,
      });
      form.onPart = function (part) {
          if (!part.filename || part.filename.match(/\.(xlsx)$/i)) {
              this.handlePart(part);
          } else {
              return next(
                  new ErrorResponse(
                      httpStatus.BAD_REQUEST,
                      null,
                      `Tập tin “${part.filename}” tải lên không đúng định dạng.`,
                  ),
              );
          }
      };

      form.parse(req, (err, fields, files) => {
          if (err) {
              next(err);
              return;
          }
          let { path: path_upload = null } = files && files.bank_user_import ? files.bank_user_import : {};
          if (!path_upload)
              return next(new ErrorResponse(httpStatus.BAD_REQUEST, null, 'Vui lòng chọn tập tin tải lên.'));
              bankUserService
                .importExcel(Object.assign(req.body, req.query, req.params, { path_upload }))
                .then((serviceRes) => {
                    if (serviceRes.isFailed()) {
                        return next(serviceRes);
                    }
                    return res.json(new SingleResponse(serviceRes.getData()));
                });
      });
  } catch (error) {
      return next(error);
  }
};


module.exports = {
  getList,
  getById,
  createOrUpdate,
  delete: _delete,
  exportExcel,
  getTemplateImport,
  importExcel,
};
