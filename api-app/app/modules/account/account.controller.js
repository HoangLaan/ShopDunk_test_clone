const accountService = require('./account.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const authService = require('../auth/auth.service');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const {encryptCTRCounter} = require('../../common/helpers/string.helper');
const config = require('../../../config/config');
var querystring = require('qs');
const events = require('../../common/events');
const htmlHelper = require('../../common/helpers/html.helper');
const bcrypt = require('bcryptjs');
const stringHelper = require('../../common/helpers/string.helper');

const signUp = async (req, res, next) => {
    try {
        const serviceCheckPhoneOrEmail = await accountService.checkEmailOrPhone(req.body);

        if (serviceCheckPhoneOrEmail.isFailed()) {
            return next(serviceCheckPhoneOrEmail);
        }

        let {isExitPhone, isExitEmail} = serviceCheckPhoneOrEmail.getData();
        if (isExitPhone) {
            return next(new ErrorResponse(httpStatus.BAD_REQUEST, null, 'Số điện thoại đã tồn tại.'));
        }
        if (isExitEmail) {
            return next(new ErrorResponse(httpStatus.BAD_REQUEST, null, 'Email đã tồn tại.'));
        }

        const serviceRes = await accountService.signUp(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        events.emit('send-email', {
            to: req.body.email,
            subject: '[HESMAN] ĐĂNG KÝ THÀNH CÔNG',
            html: htmlHelper.format({
                template: 'register.success.html',
                mail: {
                    name: req.body.full_name,
                    website: config.website,
                },
            }),
        });

        return res.json(new SingleResponse(true, 'Đăng ký tài khoản thành công.'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, 'Lỗi đăng ký tài khoản'));
    }
};

const loginSocial = async (req, res, next) => {
    try {
        const serviceRes = await accountService.loginSocial(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        let account = serviceRes.getData();
        await accountService.addLoginLog(account.member_id);
        let token = await authService.generateToken(account, false);
        return res.json(new SingleResponse(token, RESPONSE_MSG.AUTH.LOGIN.SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, 'Lỗi đăng ký tài khoản bằng mạng xã hội'));
    }
};

const getProfile = async (req, res, next) => {
    try {
        const serviceRes = await accountService.getProfile(req.auth.member_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, 'Lỗi lấy thông tin user'));
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const member_id = await accountService.checkAcountByEmail(req.body.email);
        if (member_id == 0)
            return next(new ErrorResponse(httpStatus.BAD_REQUEST, null, 'Email đăng ký không tồn tại.'));
        let password = stringHelper.randomString(6);
        const serviceRes = await accountService.resetPassword(req.body.email, password);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        if (serviceRes.isSuccess()) {
            events.emit('send-email', {
                to: req.body.email,
                subject: '[HESMAN] Reset mật khẩu',
                html: htmlHelper.format({
                    template: 'reset.password.html',
                    mail: {
                        email: req.body.email,
                        password,
                        link: config.domain_cdn + '/login',
                        website: 'http://shopdunk-html.blackwind.vn',
                    },
                }),
            });
        }
        return res.json(new SingleResponse(true));
    } catch (error) {
        console.log({error});
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, 'Lỗi reset mật khẩu.'));
    }
};

const changePassword = async (req, res, next) => {
    try {
        let {current_password} = req.body;
        const {member_id} = req.auth;

        const serviceCheckPassword = await accountService.checkPassword(member_id);
        if (serviceCheckPassword.isFailed()) {
            return next(serviceCheckPassword);
        }

        let {account} = serviceCheckPassword.getData();
        if (!account || !bcrypt.compareSync(current_password, account.password)) {
            return next(new ErrorResponse(httpStatus.BAD_REQUEST, null, 'Mật khẩu cũ không đúng.'));
        }
        const serviceUpdatePass = await accountService.changePassword({...req.body, member_id});
        if (serviceUpdatePass.isFailed()) {
            return next(serviceUpdatePass);
        }
        return res.json(new SingleResponse({rs: true}, 'Cập nhật mật khẩu thành công.'));
    } catch (error) {
        console.log({error});
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, 'Lỗi cập nhật mật khẩu.'));
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const {member_id = null} = req.auth || {};
        const serviceCheckPhoneOrEmail = await accountService.checkEmailOrPhone(Object.assign(req.body, {member_id}));

        if (serviceCheckPhoneOrEmail.isFailed()) {
            return next(serviceCheckPhoneOrEmail);
        }

        let {isExitPhone, isExitEmail} = serviceCheckPhoneOrEmail.getData();
        if (isExitPhone) {
            return next(new ErrorResponse(httpStatus.BAD_REQUEST, null, 'Số điện thoại đã tồn tại trong hệ thống.'));
        }
        if (isExitEmail) {
            return next(new ErrorResponse(httpStatus.BAD_REQUEST, null, 'Email đã tồn tại trong hệ thống.'));
        }

        const serviceRq = await accountService.updateProfile(Object.assign(req.body, {member_id: req.auth.member_id}));
        if (serviceRq.isFailed()) {
            return next(serviceRq);
        }
        return res.json(new SingleResponse(serviceRq.getData(), 'Cập nhật thông tin profile thành công.'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, 'Lỗi cập nhật thông tin profile.'));
    }
};

const getBuyHistoryList = async (req, res, next) => {
    try {
        const serviceRes = await accountService.getBuyHistoryList(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const {
            data: {list, statitics},
            total,
            page,
            limit,
        } = serviceRes.getData();
        const resData = new ListResponse(list, total, page, limit);
        resData.data.statitics = statitics;
        return res.json(resData);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    signUp,
    loginSocial,
    getProfile,
    resetPassword,
    changePassword,
    updateProfile,
    getBuyHistoryList,
};
