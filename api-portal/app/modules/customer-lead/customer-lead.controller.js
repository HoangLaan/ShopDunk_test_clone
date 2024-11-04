const customerLeadService = require('./customer-lead.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const optionsService = require('../../common/services/options.service');

const path = require('path');
const appRootPath = require('app-root-path');
const pathMediaUpload = path.normalize(`${appRootPath}/storage/uploads/customer_lead`);
const formidable = require('formidable');
const { mkdirp } = require('mkdirp')
const fs = require('fs');

const getOptionsSource = async (req, res, next) => {
    try {
        const serviceRes = await optionsService('MD_SOURCE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsPresenter = async (req, res, next) => {
    try {
        const serviceRes = await optionsService('CRM_ACCOUNT', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsCustomerType = async (req, res, next) => {
    try {
        const serviceRes = await optionsService('CRM_CUSTOMERTYPE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const createOrUpdate = async (req, res, next) => {
    try {
        const serviceRes = await customerLeadService.createOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const generateCode = async (req, res, next) => {
    try {
        const serviceRes = await customerLeadService.generateCode();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getList = async (req, res, next) => {
    try {
        const serviceRes = await customerLeadService.getList(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const customerLeadId = req.params.customerLeadId;
        const serviceRes = await customerLeadService.getById(customerLeadId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const _delete = async (req, res, next) => {
    try {
        const serviceRes = await customerLeadService.delete(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'Xóa khách hàng tiềm năng thành công'));
    } catch (error) {
        return next(error);
    }
};

const getListCustomerCompany = async (req, res, next) => {
    try {
        const serviceRes = await customerLeadService.getListCustomerCompany(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const createCustomerCompany = async (req, res, next) => {
    try {
        const serviceRes = await customerLeadService.createCustomerCompany(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const customerLeadId = req.params.customerLeadId;
        const serviceRes = await customerLeadService.changePassword(customerLeadId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'Thay đổi mật khẩu thành công'));
    } catch (error) {
        return next(error);
    }
};

const changeName = async (req, res, next) => {
    try {
        const customerLeadId = req.params.customerLeadId;
        const serviceRes = await customerLeadService.changeName(customerLeadId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionsService('CRM_CUSTOMERDATALEADS', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsCustomerCompany = async (req, res, next) => {
    try {
        const serviceRes = await optionsService('CRM_ACCOUNT', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await customerLeadService.exportExcel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const dataRes = serviceRes.getData();
        dataRes.write('danh-sach-khach-hang-tiem-nang.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const getTemplateImport = async (req, res, next) => {
    try {
        const serviceRes = await customerLeadService.getTemplateImport(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const dataRes = serviceRes.getData();
        dataRes.write('mau-nhap-khach-hang-tiem-nang.xlsx', res);
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
            let { path: path_upload = null } = files && files.customer_lead_import ? files.customer_lead_import : {};
            if (!path_upload)
                return next(new ErrorResponse(httpStatus.BAD_REQUEST, null, 'Vui lòng chọn tập tin tải lên.'));
            customerLeadService
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
    getOptionsSource,
    getOptionsPresenter,
    getOptionsCustomerType,
    createOrUpdate,
    generateCode,
    getList,
    getById,
    delete: _delete,
    getListCustomerCompany,
    getOptions,
    createCustomerCompany,
    getOptionsCustomerCompany,
    changePassword,
    exportExcel,
    getTemplateImport,
    importExcel,
    changeName
};
