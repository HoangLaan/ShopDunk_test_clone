const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const stringHelper = require('../../common/helpers/string.helper');
const accountClass = require('./account.class');
const {saveFile} = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const logger = require('../../common/classes/logger.class');
const {WriteGrayLog} = require('../../common/classes/graylog.class');
const fileHelper = require('../../common/helpers/file.helper');
const {database} = require('../../../config/config');

const folderName = 'account';

const checkEmailOrPhone = async (queryParams = {}) => {
    try {
        let p_phonenumber = apiHelper.getValueFromObject(queryParams, 'phone_number', null);
        let p_email = apiHelper.getValueFromObject(queryParams, 'email', null);
        let member_id = apiHelper.getValueFromObject(queryParams, 'member_id', null);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PHONENUMBER', p_phonenumber)
            .input('EMAIL', p_email)
            .input('MEMBERID', member_id)
            .execute('CRM_ACCOUNT_CheckEmailOrPhone_App');

        let dt = data.recordset;

        if (dt.length > 0) {
            return new ServiceResponse(true, '', {
                isExitPhone: dt[0].PHONENUMBER && dt[0].PHONENUMBER === p_phonenumber ? true : false,
                isExitEmail: dt[0].EMAIL && dt[0].EMAIL === p_email ? true : false,
            });
        } else {
            return new ServiceResponse(true, '', {
                isExitPhone: false,
                isExitEmail: false,
            });
        }
    } catch (error) {
        logger.error(error, {function: 'account.service.checkEmailOrPhone'});
        return WriteGrayLog('Lỗi kiểm tra số điện thoại hoặc email', error, 'account.service.checkEmailOrPhone');
    }
};

const findByMemberId = async memberId => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().input('MEMBERID', memberId).execute('CRM_ACCOUNT_GetByMemberId_Web');
        return new ServiceResponse(true, '', accountClass.accountToken(res.recordset[0]));
    } catch (error) {
        logger.error(error, {function: 'account.service.findByMemberId'});
        return WriteGrayLog('Lỗi lấy thông tin account by memberId', error, 'account.service.findByMemberId');
    }
};

const findByUsername = async username => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().input('USERNAME', username).execute('CRM_ACCOUNT_GetByUsername_Web');
        return new ServiceResponse(true, '', accountClass.accountLogin(res.recordset[0]));
    } catch (error) {
        logger.error(error, {function: 'account.service.findByUsername'});
        return WriteGrayLog('Lỗi lấy thông tin account by username', error, 'account.service.findByUsername');
    }
};
const findByEmail = async email => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().input('EMAIL', email).execute('CRM_ACCOUNT_FindByEmail_App');

        return new ServiceResponse(true, '', accountClass.accountLogin(res.recordset[0]));
    } catch (error) {
        logger.error(error, {function: 'account.service.findByEmail'});
        return WriteGrayLog('Lỗi lấy thông tin account by Email', error, 'account.service.findByEmail');
    }
};

const addLoginLog = async memberId => {
    try {
        const pool = await mssql.pool;
        await pool.request().input('MEMBERID', memberId).execute('CRM_ACCOUNT_LoginLog_Web');
        return new ServiceResponse(true, '', null);
    } catch (error) {
        logger.error(error, {function: 'account.service.addLoginLog'});
        return WriteGrayLog('Lỗi ghi log login', error, 'account.service.addLoginLog');
    }
};

const signUp = async (bodyParams = {}) => {
    try {
        let {email = '', full_name = '', gender = 1, phone_number, password} = bodyParams || {};
        let passwordHash = stringHelper.hashPassword(password);

        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('EMAIL', email.trim())
            .input('FULLNAME', full_name.trim())
            .input('GENDER', gender)
            .input('PASSWORD', passwordHash)
            .input('PHONENUMBER', phone_number)
            .execute('CRM_ACCOUNT_Register_App');

        const {RESULT} = res.recordset[0] || {};

        if (RESULT > 0) {
            return new ServiceResponse(true, '', true);
        } else throw new Error('Lỗi đăng ký tài khoản.');
    } catch (error) {
        logger.error(error, {function: 'account.service.signUp'});
        return WriteGrayLog('Lỗi đăng ký tài khoản', error, 'account.service.signUp');
    }
};

const loginSocial = async (bodyParams = {}) => {
    try {
        let {email = '', full_name = '', phone_number, type, social_id} = bodyParams || {};

        let passwordHash = stringHelper.hashPassword(social_id);

        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('SOCIALID', social_id)
            .input('EMAIL', email ? email.trim() : null)
            .input('PHONENUMBER', phone_number)
            .input('FULLNAME', full_name ? full_name.trim() : null)
            .input('TYPEREGISTER', type)
            .input('PASSWORD', passwordHash)
            .execute('CRM_ACCOUNT_RegisterSocial_Web');
        const user = accountClass.accountToken(res.recordset[0]);
        if (!user) return new ServiceResponse(false, '');
        return new ServiceResponse(true, '', user);
    } catch (error) {
        logger.error(error, {function: 'account.service.signUpSocial'});
        return WriteGrayLog('Lỗi đăng ký tài khoản bằng mạng xã hội', error, 'account.service.signUpSocial');
    }
};

const getProfile = async memberId => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('memberId', memberId).execute('CRM_ACCOUNT_GetProfile_Web');
        return new ServiceResponse(true, '', accountClass.profile(data.recordset[0]));
    } catch (error) {
        logger.error(error, {
            function: 'account.service.getProfile',
        });
        return WriteGrayLog('Lỗi lấy thông tin account', error, 'account.service.getProfile');
    }
};

const checkAcountByEmail = async email => {
    try {
        const pool = await mssql.pool;
        const resCheckEmail = await pool.request().input('email', email).execute('CRM_ACCOUNT_CheckAccountByEmail');

        return resCheckEmail.recordset[0].USERID || 0;
    } catch (error) {
        logger.error(error, {
            function: 'account.service.getProfile',
        });
        return 0;
    }
};

const resetPassword = async (email, password) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('EMAIL', email)
            .input('PASSWORD', stringHelper.hashPassword(password))
            .execute('SYS_USER_ResetPassword_App');
        return new ServiceResponse(true, '', true);
    } catch (error) {
        logger.error(error, {
            function: 'account.service.resetPassword',
        });
        return WriteGrayLog('Lỗi reset mật khẩu.', error, 'account.service.resetPassword');
    }
};

const checkPassword = async member_id => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('MEMBERID', member_id).execute('CRM_ACCOUNT_SelByMemberId_Web');
        let account = accountClass.accountLogin(data.recordset[0]);
        return new ServiceResponse(true, '', {account});
    } catch (error) {
        logger.error(error, {
            function: 'accountService.checkPassword',
        });
        return WriteGrayLog('Lỗi kiểm tra mật khẩu cũ.', error, 'account.service.checkPassword');
    }
};

const changePassword = async (body = {}) => {
    try {
        let new_password = apiHelper.getValueFromObject(body, 'new_password', '');
        new_password = stringHelper.hashPassword(new_password);
        const pool = await mssql.pool;
        await pool
            .request()
            .input('MEMBERID', apiHelper.getValueFromObject(body, 'member_id', 0))
            .input('PASSWORD', new_password)
            .execute('CRM_ACCOUNT_ChangePassword_Web');
        return new ServiceResponse(true, 'Cập nhật mật khẩu thành công.', true);
    } catch (error) {
        console.log({error});
        logger.error(error, {
            function: 'accountService.changePassword',
        });
        return WriteGrayLog('Lỗi cập nhật mật khẩu mới.', error, 'account.service.checkPassword');
    }
};

const updateProfile = async (bodyParams = {}) => {
    try {
        let avatar = apiHelper.getValueFromObject(bodyParams, 'avatar');
        if (avatar) {
            const path_avatar = await fileHelper.saveFile(avatar, folderName);
            if (path_avatar) {
                avatar = path_avatar;
            }
        }

        const pool = await mssql.pool;
        const reqUpdate = await pool
            .request()
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .input('GENDER', apiHelper.getValueFromObject(bodyParams, 'gender'))
            .input('FULLNAME', apiHelper.getValueFromObject(bodyParams, 'full_name'))
            .input('BIRTHDAY', apiHelper.getValueFromObject(bodyParams, 'birthday', null))
            .input('EMAIL', apiHelper.getValueFromObject(bodyParams, 'email', null))
            .input('PHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'phone_number', null))
            .input('IMAGEAVATAR', avatar)
            .input('PROVINCEID', apiHelper.getValueFromObject(bodyParams, 'province_id', null))
            .input('DISTRICTID', apiHelper.getValueFromObject(bodyParams, 'district_id', null))
            .input('WARDID', apiHelper.getValueFromObject(bodyParams, 'ward_id', null))
            .input('ADDRESS', apiHelper.getValueFromObject(bodyParams, 'address', null))
            .execute('CRM_ACCOUNT_UpdateProfile_Web');

        let {result} = reqUpdate.recordset[0];

        if (!result || result == 0) {
            return new ServiceResponse(false, 'Lỗi cập nhật thông tin profile.');
        }

        return new ServiceResponse(true, '', true);
    } catch (error) {
        logger.error(error, {
            function: 'account.service.updateProfile',
        });
        return WriteGrayLog('Lỗi cập nhật thông tin profile.', error, 'account.service.updateProfile');
    }
};

const getBuyHistoryList = async queryParams => {
    try {
        const pool = await mssql.pool;
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const data = await pool
            .request()
            .input('MEMBERID', apiHelper.getValueFromObject(queryParams, 'member_id'))
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .execute('CRM_ACCOUNT_GetPurchaseHistory_App');

        const dataHistoryList = accountClass.purchaseHistoryList(data.recordsets[0]);
        const productList = accountClass.purchaseHistoryProductList(data.recordsets[1]);
        for (let i = 0; i < dataHistoryList.length; i++) {
            dataHistoryList[i].product_list = productList?.filter(item => item.order_id == dataHistoryList[i].order_id);
        }
        const dataHistoryStatitics = accountClass.purchaseHistoryStatistics(data.recordsets[2][0]);

        return new ServiceResponse(true, '', {
            data: {
                list: dataHistoryList,
                statitics: dataHistoryStatitics,
            },
            page: currentPage,
            limit: itemsPerPage,
            total: dataHistoryStatitics.total_orders,
        });
    } catch (e) {
        logger.error(e, {function: 'account.service.getBuyHistoryList'});
        return new ServiceResponse(false, '', {dataHistoryList: []});
    }
};

module.exports = {
    findByMemberId,
    findByUsername,
    addLoginLog,
    signUp,
    checkEmailOrPhone,
    loginSocial,
    getProfile,
    checkAcountByEmail,
    resetPassword,
    changePassword,
    checkPassword,
    updateProfile,
    findByEmail,
    getBuyHistoryList,
};
