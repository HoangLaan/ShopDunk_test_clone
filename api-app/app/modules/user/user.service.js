const database = require('../../models');
const UserClass = require('./user.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const stringHelper = require('../../common/helpers/string.helper');
const fileHelper = require('../../common/helpers/file.helper');
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const API_CONST = require('../../common/const/api.const');
const ServiceResponse = require('../../common/responses/service.response');
const folderNameAvatar = 'avatar';
const config = require('../../../config/config');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const _ = require('lodash');
const {unsubscribe} = require('../../common/services/topic.service');

const getListUser = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const userId = apiHelper.getValueFromObject(queryParams, 'user_id');
        const userName = apiHelper.getValueFromObject(queryParams, 'user_name');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERID', userId)
            .input('USERNAME', userName)
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .execute(PROCEDURE_NAME.SYS_USER_GETLIST);
        const users = data.recordset;
        return {
            data: UserClass.list(users),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(users),
        };
    } catch (e) {
        logger.error(e, {
            function: 'userService.getListUser',
        });

        return [];
    }
};
const onoffNotify = async user_name => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('USERNAME', user_name).execute('SYS_USER_ONOFFNOTIFY');

        const users = data.recordset;

        return UserClass.onoffNotify(users)[0].message;
    } catch (e) {
        logger.error(e, {
            function: 'userService.getListUser',
        });

        return [];
    }
};
const checkToken = async token => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('TOKEN', token).execute('SYS_USER_LOGIN_TOKEN_CHECKTOKEN_APP');

        const users = data.recordset;

        return UserClass.checktoken(users)[0].result;
    } catch (e) {
        logger.error(e, {
            function: 'userService.getListUser',
        });

        return [];
    }
};
const getDeviceTokenByUsername = async user_name => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', user_name)
            .execute('SYS_USER_LOGIN_LOG_GetTokenByUsername_App');

        const users = data.recordset;
        return UserClass.getDeviceTokenByUsername(users)[0];
    } catch (e) {
        logger.error(e, {
            function: 'userService.getDeviceTokenByUsername',
        });

        return [];
    }
};
const createUserToken = async (token, refreshToken, user_name, refreshTokenold) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('TOKEN', token)
            .input('REFRESHTOKEN', refreshToken)
            .input('USERNAME', user_name)
            .input('REFRESHTOKENOLD', refreshTokenold)
            .execute('SYS_USER_LOGIN_TOKEN_CREATE_APP');

        // const users = data.recordset
    } catch (e) {
        logger.error(e, {
            function: 'userService.getListUser',
        });

        return [];
    }
};
const createUser = async (bodyParams = {}) => {
    try {
        const userid = await createUserOrUpdate(bodyParams);
        removeCacheOptions();
        return userid;
    } catch (e) {
        logger.error(e, {
            function: 'userService.createUser',
        });

        return null;
    }
};

const updateUser = async bodyParams => {
    try {
        const userid = await createUserOrUpdate(bodyParams);
        removeCacheOptions();
        return userid;
    } catch (e) {
        logger.error(e, {
            function: 'userService.updateUser',
        });

        return null;
    }
};

const saveAvatar = async (base64, userId) => {
    let avatarUrl = null;

    try {
        if (fileHelper.isBase64(base64)) {
            const extension = fileHelper.getExtensionFromBase64(base64);
            avatarUrl = await fileHelper.saveBase64(folderNameAvatar, base64, `${userId}.${extension}`);
        } else {
            avatarUrl = base64.split(config.domain_cdn)[1];
        }
    } catch (e) {
        logger.error(e, {
            function: 'userService.saveAvatar',
        });

        return avatarUrl;
    }

    return avatarUrl;
};

const createUserOrUpdate = async bodyParams => {
    const params = bodyParams;

    // Upload Avatar
    const pathAvatar = await saveAvatar(params.default_picture_url, params.user_id);
    if (pathAvatar) {
        params.default_picture_url = pathAvatar;
    }

    let data = {
        USERNAME: params.user_name || '',
        FIRSTNAME: params.first_name || '',
        LASTNAME: params.last_name || '',
        FULLNAME: `${params.first_name} ${params.last_name}`,
        GENDER: params.gender || '',
        BIRTHDAY: params.birthday || '',
        EMAIL: params.email || '',
        PHONENUMBER_1: params.phone_number_1 || '',
        PHONENUMBER: params.phone_number || '',
        ADDRESS: params.address || '',
        PROVINCEID: params.province_id || '',
        DISTRICTID: params.district_id || '',
        WARDID: params.ward_id || '',
        COUNTRYID: params.country_id || '',
        CITYID: params.city_id || '',
        DESCRIPTION: params.description || '',
        DEFAULTPICTUREURL: params.default_picture_url || '',
        DEPARTMENTID: params.department_id || '',
        POSITIONID: params.position_id || '',
        EXTENSION: params.extension || '',
        ABOUTME: params.about_me || '',
        CREATEDUSER: params.auth_id,
    };

    let query = `${PROCEDURE_NAME.SYS_USER_CREATEORUPDATE} 
        @USERNAME=:USERNAME,
        @FIRSTNAME=:FIRSTNAME,
        @LASTNAME=:LASTNAME,
        @FULLNAME=:FULLNAME,
        @GENDER=:GENDER,
        @BIRTHDAY=:BIRTHDAY,
        @EMAIL=:EMAIL,
        @PHONENUMBER_1=:PHONENUMBER_1,
        @PHONENUMBER=:PHONENUMBER,
        @ADDRESS=:ADDRESS,
        @PROVINCEID=:PROVINCEID,
        @DISTRICTID=:DISTRICTID,
        @WARDID=:WARDID,
        @COUNTRYID=:COUNTRYID,
        @CITYID=:CITYID,
        @DESCRIPTION=:DESCRIPTION,
        @DEFAULTPICTUREURL=:DEFAULTPICTUREURL,
        @DEPARTMENTID=:DEPARTMENTID,
        @POSITIONID=:POSITIONID,
        @EXTENSION=:EXTENSION,
        @ABOUTME=:ABOUTME,
        @CREATEDUSER=:CREATEDUSER`;
    if (params.user_id) {
        data['USERID'] = params.user_id;
        query += ',@USERID=:USERID';
    }
    if (params.password) {
        data['PASSWORD'] = stringHelper.hashPassword(params.password);
        query += ',@PASSWORD=:PASSWORD';
    }

    //
    let userGroups = '';
    if (Array.isArray(params.user_groups)) {
        userGroups = params.user_groups.join('|');
    }

    let transaction;
    try {
        // get transaction
        transaction = await database.sequelize.transaction();

        const result = await database.sequelize.query(query, {
            replacements: data,
            type: database.QueryTypes.INSERT,
            transaction: transaction,
        });
        if (!result) {
            if (transaction) {
                await transaction.rollback();
            }
            return null;
        }
        params.user_id = result[0][0].RESULT;
        if (params.user_id === '-1') {
            if (transaction) {
                await transaction.rollback();
            }
            return null;
        }
        await database.sequelize.query(`${PROCEDURE_NAME.SYS_USER_USERGROUP_Delete} @USERID=:USERID`, {
            replacements: {
                USERID: params.user_id,
            },
            type: database.QueryTypes.DELETE,
            transaction: transaction,
        });

        await database.sequelize.query(
            `${PROCEDURE_NAME.SYS_USER_USERGROUP_Create} @USERID=:USERID, @USERGROUPID=:USERGROUPID`,
            {
                replacements: {
                    USERID: params.user_id,
                    USERGROUPID: userGroups,
                },
                type: database.QueryTypes.INSERT,
                transaction: transaction,
            },
        );

        // commit
        await transaction.commit();
        return params.user_id;
    } catch (err) {
        console.log('err.message', err.message);
        // Rollback transaction only if the transaction object is defined
        if (transaction) {
            await transaction.rollback();
        }
        return null;
    }
};

// const detailUser = async (userId, username = null) => {

//   try {
//     let user = await database.sequelize.query(`${PROCEDURE_NAME.SYS_USER_GETUSERBYID_APP} @USERID=:USERID`, {
//       replacements: {
//         'USERID': userId,
//       },
//       type: database.QueryTypes.SELECT,
//     });

//     if (user.length) {
//       user = UserClass.detail(user[0]);
//       user.isAdministrator = (user.user_name === config.adminUserName ? 1 : 0);
//       return user;
//     }

//     return null;
//   } catch (e) {
//     logger.error(e, {
//       'function': 'userService.detailUser',
//     });

//     return null;
//   }
// };

const detailUser = async userId => {
    try {
        const pool = await mssql.pool;
        const userRes = await pool.request().input('USERID', userId).execute('SYS_USER_GetById_App');
        if (!userRes.recordset || !userRes.recordset[0]) return null;
        const user = UserClass.detail(userRes.recordset[0]);
        //user.bank_users = UserClass.banks(userRes.recordsets[1]);
        user.user_groups = UserClass.userGroups(userRes.recordsets[2]).map(o => o?.value);

        user.hobbies = user.hobbies?.split('#')?.map(item => {
            const [hobbies_id, hobbies_name] = item.split('-');
            return {hobbies_id, hobbies_name};
        });
        //user.educations = UserClass.userEducations(userRes.recordsets[3]);
        //user.documents = UserClass.userDocuments(userRes.recordsets[4]);
        return user;
    } catch (e) {
        logger.error(e, {
            function: 'userService.detailUser',
        });
        return null;
    }
};

const detailUserV1 = async (userId, username = null) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('USERID', userId).execute('SYS_USER_GetUserById_App');
        if (data.recordsets.length) {
            let user = UserClass.detail(data.recordsets[0][0]);
            user.isAdministrator = user.user_name === config.adminUserName ? 1 : 0;
            user.list_function = data.recordsets[1];
            user.hobbies = user.hobbies?.split('#')?.map(item => {
                const [hobbies_id, hobbies_name] = item.split('-');
                return {hobbies_id, hobbies_name};
            });
            return user;
        }
        return null;
    } catch (e) {
        logger.error(e, {function: 'userService.getProfile'});
        return null;
    }
};

const findByUserName = async userName => {
    try {
        const user = await database.sequelize.query(`${PROCEDURE_NAME.SYS_USER_FINDBYUSERNAME} @UserName=:UserName`, {
            replacements: {
                UserName: userName,
            },
            type: database.QueryTypes.SELECT,
        });

        if (user.length) {
            return UserClass.detail(user[0]);
        }

        return null;
    } catch (error) {
        console.error('userService.findByUserName', error);
        return null;
    }
};

const deleteUser = async (userId, req) => {
    try {
        await database.sequelize.query(`${PROCEDURE_NAME.SYS_USER_DELETE} @USERID=:USERID,@UPDATEDUSER=:UPDATEDUSER`, {
            replacements: {
                USERID: userId,
                UPDATEDUSER: apiHelper.getAuthId(req),
            },
            type: database.QueryTypes.UPDATE,
        });
        removeCacheOptions();
        return true;
    } catch (error) {
        console.error('userService.deleteUser', error);
        return false;
    }
};

const changePasswordUser = async (userId, password, authId) => {
    try {
        await database.sequelize.query(
            `${PROCEDURE_NAME.SYS_USER_CHANGEPASSWORD} @USERID=:USERID,@PASSWORD=:PASSWORD,@UPDATEDUSER=:UPDATEDUSER`,
            {
                replacements: {
                    USERID: userId,
                    PASSWORD: stringHelper.hashPassword(password),
                    UPDATEDUSER: authId,
                },
                type: database.QueryTypes.UPDATE,
            },
        );

        return true;
    } catch (error) {
        console.error('userService.changePasswordUser', error);
        return false;
    }
};
const checkPassword = async userId => {
    try {
        const data = await database.sequelize.query(`${PROCEDURE_NAME.SYS_USER_CHECKPASSWORD} @USERID=:USERID`, {
            replacements: {
                USERID: userId,
            },
            type: database.QueryTypes.SELECT,
        });
        return data[0].PASSWORD;
    } catch (error) {
        console.error('userService.checkPassword', error);
        return '';
    }
};
const generateUsername = async () => {
    try {
        const user = await database.sequelize.query(`${PROCEDURE_NAME.SYS_USER_MAX}`, {
            replacements: {},
            type: database.QueryTypes.SELECT,
        });

        let data = UserClass.generateUsername(user[0]);
        data.user_id = apiHelper.generateId();

        return data;
    } catch (error) {
        console.error('userService.generateUsername', error);
        return true;
    }
};

const logUserLogin = async (data = {}) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('USERPROFILEID', apiHelper.getValueFromObject(data, 'user_id'))
            .input('USERNAME', apiHelper.getValueFromObject(data, 'user_name'))
            .input('USERAGENT', apiHelper.getValueFromObject(data, 'user_agent'))
            .input('ISACTIVE', API_CONST.ISACTIVE.ACTIVE)
            .input('CREATEDUSER', apiHelper.getValueFromObject(data, 'user_id'))
            .input('PLATFORM', apiHelper.getValueFromObject(data, 'platform'))
            .input('DEVICETOKEN', apiHelper.getValueFromObject(data, 'device_token'))
            .input('DEVICENAME', apiHelper.getValueFromObject(data, 'device_name'))
            .execute(PROCEDURE_NAME.SYS_USER_LOGIN_LOG_CREATE);

        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'userService.logUserLogin',
        });

        return new ServiceResponse(true);
    }
};

const handleUserLogout = async (user_name = '') => {
    try {
        const pool = await mssql.pool;

        const resListToken = await pool
            .request()
            .input('USERNAME', user_name)
            .execute(PROCEDURE_NAME.SYS_USER_LOGIN_LOG_GETTOKENBYUSERNAME_APP);
        const listToken = resListToken.recordset || [];

        listToken.forEach(el => {
            unsubscribe(el.DEVICETOKEN);
        });

        await pool.request().input('USERNAME', user_name).execute(PROCEDURE_NAME.SYS_USER_LOGIN_LOG_DELETE_APP);

        return new ServiceResponse(true);
    } catch (error) {
        console.error('userService.deleteDeviceToken', error);
        return new ServiceResponse(false, error.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.SYS_USER_OPTIONS);
};

const findByEmail = async email => {
    try {
        const user = await database.sequelize.query(`${PROCEDURE_NAME.SYS_USER_FINDBYEMAIL} @EMAIL=:EMAIL`, {
            replacements: {
                EMAIL: email,
            },
            type: database.QueryTypes.SELECT,
        });

        if (user.length) {
            return UserClass.detail(user[0]);
        }

        return null;
    } catch (error) {
        console.error('userService.findByEmail', error);
        return null;
    }
};
//==============APP=============
const resetPassword = async user => {
    try {
        const password = Math.random().toString(36).slice(-8);
        await database.sequelize.query(
            `${PROCEDURE_NAME.SYS_USER_CHANGEPASSWORD} @USERID=:USERID,@PASSWORD=:PASSWORD,@UPDATEDUSER=:UPDATEDUSER`,
            {
                replacements: {
                    USERID: user.user_id,
                    PASSWORD: stringHelper.hashPassword(password),
                    UPDATEDUSER: user.user_id,
                },
                type: database.QueryTypes.UPDATE,
            },
        );
        return password;
    } catch (error) {
        console.error('userService.resetPassword', error);
        return false;
    }
};

const getOptions = async req => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('KEYWORD', apiHelper.getQueryParam(req, 'search'))
            .execute(PROCEDURE_NAME.SYS_USER_GETOPTIONS_APP);
        return new ServiceResponse(true, '', UserClass.getOptions(res.recordsets[0]));
    } catch (e) {
        logger.error(e, {
            function: 'userService.getOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getHobbiesOptions = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('KEYWORD', apiHelper.getQueryParam(queryParams, 'search'))
            .execute('MD_HOBBIES_GetOptions_App');
        return new ServiceResponse(true, 'Lấy danh sách sở thích thành công', UserClass.hobbiesOptions(res.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'userService.getHobbiesOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const updateHobbiesAndAboutMe = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', bodyParams.user_name)
            .input('ABOUTME', bodyParams.about_me?.trim() ?? null)
            .execute('SYS_USER_UpdateAboutMe_App');

        if (!data.recordset[0].RESULT) return new ServiceResponse(false, 'Cập nhật thất bại');

        // create hobbies
        const hobbies_ids = bodyParams.hobbies_ids;
        if (hobbies_ids?.length > 0) {
            const pool = await mssql.pool;
            const userRes = await pool
                .request()
                .input('USERNAME', bodyParams.user_name)
                .input('HOBBIESIDS', hobbies_ids.join(','))
                .execute('SYS_USER_HOBBIES_CreateOrUpdate_AdminWeb');
            if (!userRes.recordset[0]?.RESULT) {
                return new ServiceResponse(false, 'Tạo sở thích thất bại');
            }
        }

        return new ServiceResponse(true, 'Cập nhật thành công');
    } catch (e) {
        logger.error(e, {function: 'userService.updateHobbiesAndAboutMe'});
        await transaction.rollback();
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListUser,
    createUser,
    detailUser,
    updateUser,
    deleteUser,
    checkPassword,
    changePasswordUser,
    findByUserName,
    generateUsername,
    logUserLogin,
    findByEmail,
    getOptions,
    resetPassword,
    handleUserLogout,
    onoffNotify,
    createUserToken,
    checkToken,
    getDeviceTokenByUsername,
    detailUserV1,
    getHobbiesOptions,
    updateHobbiesAndAboutMe,
};
