const moment = require('moment');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v1');
const config = require('../../../config/config');
const database = require('../../models');
const UserClass = require('../user/user.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const userService = require('../user/user.service');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');

const TOKEN_EXPIRE_AFTER = 3600; // expires in 1 hour
const REFRESH_TOKEN_EXPIRE_AFTER = 86400; // expires in 24 hours

const getUserByUsername = async user_name => {
    try {
        const users = await database.sequelize.query(`${PROCEDURE_NAME.SYS_USER_FINDBYUSERNAME} @USERNAME=:USERNAME`, {
            replacements: {
                USERNAME: user_name,
            },
            type: database.QueryTypes.SELECT,
        });
        return users && UserClass.basicInfo(users[0]);
    } catch (error) {
        console.error('authService.getUserByUsername', error);
        return null;
    }
};

const getUserByBimometric = async (biometric = '') => {
    try {
        const users = await database.sequelize.query(
            `${PROCEDURE_NAME.SYS_USER_FINDBYBIOMETRIC} @BIOMETRIC=:BIOMETRIC`,
            {
                replacements: {
                    BIOMETRIC: biometric,
                },
                type: database.QueryTypes.SELECT,
            },
        );
        return users && UserClass.basicInfo(users[0]);
    } catch (error) {
        console.error('authService.getUserByBimometric', error);
        return null;
    }
};

const generateToken = async user => {
    try {
        const data = {
            token_id: uuid(),
            user_id: user.user_id,
            user_name: user.user_name,
            full_name: user.full_name,
            isAdministrator: 0,
        };
        // Get information of user
        const userDetail = await userService.detailUser(user.user_id);

        if (userDetail) {
            data.user_groups = userDetail.user_groups;
            data.user_companies = userDetail.user_companies || [];
        }
        if (user.user_name === config.adminUserName) {
            data.isAdministrator = 1;
        }

        const token = jwt.sign(data, config.hashSecretKey, {
            expiresIn: TOKEN_EXPIRE_AFTER,
        });
        const refreshToken = jwt.sign(data, config.hashSecretKey, {
            expiresIn: REFRESH_TOKEN_EXPIRE_AFTER,
        });
        // Store token id to DB

        //
        return {
            tokenKey: config.token.key,
            tokenType: config.token.type,
            accessToken: token,
            tokenExpireAt: moment().add(TOKEN_EXPIRE_AFTER, 's').seconds(0).utc().valueOf(),
            refreshToken: refreshToken,
            refreshTokenExpireAt: moment().add(REFRESH_TOKEN_EXPIRE_AFTER, 's').seconds(0).utc().valueOf(),
        };
    } catch (error) {
        console.error('authService.generateToken', error);
        return null;
    }
};

const refreshToken = async refreshToken => {
    try {
        // Verify token
        return jwt.verify(refreshToken, config.hashSecretKey, async (err, decoded) => {
            if (err) {
                throw err;
            }
            // Get user
            const user = await getUserByUsername(decoded.user_name);
            if (!user) {
                throw RESPONSE_MSG.NOT_FOUND;
            }
            return await generateToken(user);
        });
    } catch (error) {
        console.error('authService.refreshToken', error);
        return null;
    }
};

module.exports = {
    getUserByUsername,
    generateToken,
    refreshToken,
    getUserByBimometric,
};
