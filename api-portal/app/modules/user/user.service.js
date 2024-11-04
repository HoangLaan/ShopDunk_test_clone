const database = require('../../models');
const UserClass = require('../user/user.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const stringHelper = require('../../common/helpers/string.helper');
const fileHelper = require('../../common/helpers/file.helper');
const sql = require('mssql');
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const API_CONST = require('../../common/const/api.const');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const config = require('../../../config/config');
const _ = require('lodash');
const { getOptionsSkillLevel } = require('../skill-level/skill-level.service');
const { authorizationVoip, createExtensionUser } = require('../voip/utils/helpers');
const { default: axios } = require('axios');
const { addSheetGetList } = require('../../common/helpers/excel.helper');
const xl = require('excel4node');

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
        return true;
    }
};

const getListUser = async (req) => {
    const page = apiHelper.getPage(req);
    const limit = apiHelper.getLimit(req);
    try {
        const hobbies_list = apiHelper
            .getValueFromObject(req.query, 'hobbies_list', [])
            .filter((x) => Boolean(x.value))
            .map((x) => x.value)
            .join('|');
        const query = `SYS_USER_GetList_AdminWeb
      @PageSize=:PageSize,
      @PageIndex=:PageIndex,
      @KEYWORD=:KEYWORD,
      @COMPANYID=:COMPANYID,
      @BLOCKID=:BLOCKID,
      @DEPARTMENTID=:DEPARTMENTID,
      @STATUS=:STATUS,
      @USERSTATUS=:USERSTATUS,
      @POSITIONID=:POSITIONID,
      @USERLEVELID=:USERLEVELID,
      @ISTIMEKEEPING=:ISTIMEKEEPING,
      @GENDER=:GENDER,
      @BIRTHMONTH=:BIRTHMONTH,
      @HOBBIESLIST=:HOBBIESLIST,
      @BUSINESSIDLITS=:BUSINESSIDLITS,
      @STOREIDLIST=:STOREIDLIST,
      @DOCUMENTTYPEIDS=:DOCUMENTTYPEIDS,
      @ISGETOPTION=:ISGETOPTION,
      @ISENOUGH=:ISENOUGH`;
        const users = await database.sequelize.query(query, {
            replacements: {
                PageSize: limit,
                PageIndex: page,
                KEYWORD: apiHelper.getQueryParam(req, 'search'),
                COMPANYID: apiHelper.getQueryParam(req, 'company_id'),
                BLOCKID: apiHelper.getQueryParam(req, 'block_id'),
                DEPARTMENTID: apiHelper.getQueryParam(req, 'department_id'),
                STATUS: apiHelper.getValueFromObject(req.query || {}, 'status', 2),
                POSITIONID: apiHelper.getQueryParam(req, 'position_id'),
                USERLEVELID: apiHelper.getQueryParam(req, 'user_level_id'),
                ISTIMEKEEPING: apiHelper.getQueryParam(req, 'is_time_keeping'),
                HRPROFILE: apiHelper.getQueryParam(req, 'hr_profile'),
                GENDER: apiHelper.getQueryParam(req, 'gender'),
                BIRTHMONTH: apiHelper.getQueryParam(req, 'birth_month'),
                USERSTATUS: apiHelper.getQueryParam(req, 'user_status'),
                HOBBIESLIST: hobbies_list,
                BUSINESSIDLITS: apiHelper.getQueryParam(req, 'business_ids'),
                STOREIDLIST: apiHelper.getQueryParam(req, 'store_ids'),
                ISENOUGH: apiHelper.getQueryParam(req, 'is_enough'),
                ISGETOPTION: apiHelper.getQueryParam(req, 'is_get_option'),
                DOCUMENTTYPEIDS: apiHelper.getQueryParam(req, 'document_type_ids'),
            },
            type: database.QueryTypes.SELECT,
        });

        return {
            data: UserClass.list(users),
            page: page,
            limit: limit,
            total: apiHelper.getTotalData(users),
        };
    } catch (e) {
        logger.error(e, {
            function: 'UserService.getListUser',
        });

        return {
            data: [],
            page: page,
            limit: limit,
            total: 0,
        };
    }
};

const getListUserByShift = async (req) => {
    const page = apiHelper.getPage(req);
    const limit = apiHelper.getLimit(req);
    try {
        const hobbies_list = apiHelper
            .getValueFromObject(req.query, 'hobbies_list', [])
            .filter((x) => Boolean(x.value))
            .map((x) => x.value)
            .join('|');
        const query = `SYS_USER_GetListByShift_AdminWeb
      @PageSize=:PageSize,
      @PageIndex=:PageIndex,
      @KEYWORD=:KEYWORD,
      @COMPANYID=:COMPANYID,
      @BLOCKID=:BLOCKID,
      @DEPARTMENTID=:DEPARTMENTID,
      @STATUS=:STATUS,
      @USERSTATUS=:USERSTATUS,
      @POSITIONID=:POSITIONID,
      @USERLEVELID=:USERLEVELID,
      @ISTIMEKEEPING=:ISTIMEKEEPING,
      @GENDER=:GENDER,
      @BIRTHMONTH=:BIRTHMONTH,
      @HOBBIESLIST=:HOBBIESLIST,
      @BUSINESSIDLITS=:BUSINESSIDLITS,
      @STOREIDLIST=:STOREIDLIST,
      @DOCUMENTTYPEIDS=:DOCUMENTTYPEIDS,
      @ISGETOPTION=:ISGETOPTION,
      @ISENOUGH=:ISENOUGH,
      @SHIFTID=:SHIFTID`;
        const users = await database.sequelize.query(query, {
            replacements: {
                PageSize: limit,
                PageIndex: page,
                KEYWORD: apiHelper.getQueryParam(req, 'search'),
                COMPANYID: apiHelper.getQueryParam(req, 'company_id'),
                BLOCKID: apiHelper.getQueryParam(req, 'block_id'),
                DEPARTMENTID: apiHelper.getQueryParam(req, 'department_id'),
                STATUS: apiHelper.getValueFromObject(req.query || {}, 'status', 2),
                POSITIONID: apiHelper.getQueryParam(req, 'position_id'),
                USERLEVELID: apiHelper.getQueryParam(req, 'user_level_id'),
                ISTIMEKEEPING: apiHelper.getQueryParam(req, 'is_time_keeping'),
                HRPROFILE: apiHelper.getQueryParam(req, 'hr_profile'),
                GENDER: apiHelper.getQueryParam(req, 'gender'),
                BIRTHMONTH: apiHelper.getQueryParam(req, 'birth_month'),
                USERSTATUS: apiHelper.getQueryParam(req, 'user_status'),
                HOBBIESLIST: hobbies_list,
                BUSINESSIDLITS: apiHelper.getQueryParam(req, 'business_ids'),
                STOREIDLIST: apiHelper.getQueryParam(req, 'store_ids'),
                ISENOUGH: apiHelper.getQueryParam(req, 'is_enough'),
                ISGETOPTION: apiHelper.getQueryParam(req, 'is_get_option'),
                DOCUMENTTYPEIDS: apiHelper.getQueryParam(req, 'document_type_ids'),
                SHIFTID: apiHelper.getQueryParam(req, 'shift_ids'),
            },
            type: database.QueryTypes.SELECT,
        });

        return {
            data: UserClass.list(users),
            page: page,
            limit: limit,
            total: apiHelper.getTotalData(users),
        };
    } catch (e) {
        logger.error(e, {
            function: 'UserService.getListUser',
        });

        return {
            data: [],
            page: page,
            limit: limit,
            total: 0,
        };
    }
};

const getListUserByOption = async (req) => {
    const page = apiHelper.getPage(req);
    const limit = apiHelper.getLimit(req);
    try {
        const query = `SYS_USER_GetListByOption_AdminWeb
            @PageSize=:PageSize,
            @PageIndex=:PageIndex,
            @KEYWORD=:KEYWORD`;
        const users = await database.sequelize.query(query, {
            replacements: {
                PageSize: limit,
                PageIndex: page,
                KEYWORD: apiHelper.getQueryParam(req, 'search'),
            },
            type: database.QueryTypes.SELECT,
        });

        return {
            data: UserClass.list(users),
            page: page,
            limit: limit,
            total: apiHelper.getTotalData(users),
        };
    } catch (e) {
        logger.error(e, {
            function: 'UserService.getListUser',
        });

        return {
            data: [],
            page: page,
            limit: limit,
            total: 0,
        };
    }
};

const createUser = async (bodyParams = {}) => {
    try {
        const userid = await createUserOrUpdate(bodyParams);
        return userid;
    } catch (e) {
        logger.error(e, {
            function: 'UserService.createUser',
        });
        return null;
    }
};

const updateUser = async (bodyParams) => {
    try {
        const userid = await createUserOrUpdate(bodyParams);
        return userid;
    } catch (e) {
        logger.error(e, {
            function: 'UserService.updateUser',
        });

        return null;
    }
};

const createUserOrUpdate = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    const createOrUpdateStoreRequest = new sql.Request(transaction);
    try {
        const id = apiHelper.getValueFromObject(bodyParams, 'user_id');
        const firstName = apiHelper.getValueFromObject(bodyParams, 'first_name');
        const lastName = apiHelper.getValueFromObject(bodyParams, 'last_name');
        let user_name = apiHelper.getValueFromObject(bodyParams, 'user_name');
        // Neu la tao moi thi lay ma so nhan vien

        // Neu la tao moi thi lay ma so nhan vien
        if (!id) {
            try {
                const data = await generateUsername();
                user_name = data.user_name;
            } catch (error) {
                logger.error(error, { function: 'UserService.generateUsername' });
            }
        }
        const subUsername = await generateSubUsername(firstName, lastName, id);
        bodyParams.sub_username = subUsername;
        // Kiem tra avatar

        // Kiem tra avatar
        const defaultPictureUrl = apiHelper.getValueFromObject(bodyParams, 'default_picture_url');
        if (fileHelper.isBase64(defaultPictureUrl)) {
            try {
                // bodyParams.default_picture_url = await fileHelper.saveImage(defaultPictureUrl);
                bodyParams.default_picture_url = await fileHelper.saveBase64(null, defaultPictureUrl);
            } catch (error) {
                logger.error(error, { function: 'UserService.SaveDefaultPicture' });
            }
        } else {
            bodyParams.default_picture_url = null;
        }
        // Kiem tra anh mau nhan su
        const user_sample_images = apiHelper.getValueFromObject(bodyParams, 'user_sample_images');
        if (fileHelper.isBase64(user_sample_images)) {
            try {
                // bodyParams.default_picture_url = await fileHelper.saveImage(defaultPictureUrl);
                bodyParams.user_sample_images = await fileHelper.saveBase64(null, user_sample_images);
            } catch (error) {
                logger.error(error, { function: 'UserService.SaveUserImgage' });
            }
        } else {
            bodyParams.user_sample_images = null;
        }
        // Kiem tra CCCD mat truoc
        const identityFrontImage = apiHelper.getValueFromObject(bodyParams, 'identity_front_image');
        if (fileHelper.isBase64(identityFrontImage)) {
            try {
                // bodyParams.identity_front_image = await fileHelper.saveImage(identityFrontImage);
                bodyParams.identity_front_image = await fileHelper.saveBase64(null, identityFrontImage);
            } catch (error) {
                logger.error(error, { function: 'StoreService.SaveIdentityFrontImage' });
            }
        } else {
            bodyParams.identity_front_image = null;
        }
        // CCCD  mat sau
        const identityBackImage = apiHelper.getValueFromObject(bodyParams, 'identity_back_image');
        if (fileHelper.isBase64(identityBackImage)) {
            try {
                // bodyParams.identity_back_image = await fileHelper.saveImage(identityBackImage);
                bodyParams.identity_back_image = await fileHelper.saveBase64(null, identityBackImage);
            } catch (error) {
                logger.error(error, { function: 'StoreService.SaveIdentityBackImage' });
            }
        } else {
            bodyParams.identity_back_image = null;
        }

        await transaction.begin();

        const data = await createOrUpdateStoreRequest
            .input('USERID', id)
            .input('USERNAME', user_name)
            .input('FIRSTNAME', firstName)
            .input('LASTNAME', lastName)
            .input('FULLNAME', `${firstName}`.trim() + ' ' + `${lastName}`.trim())
            .input('POSITIONID', apiHelper.getValueFromObject(bodyParams, 'position_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(bodyParams, 'department_id'))
            .input('GENDER', apiHelper.getValueFromObject(bodyParams, 'gender'))
            .input('BIRTHDAY', apiHelper.getValueFromObject(bodyParams, 'birthday'))
            .input('USERLEVELID', apiHelper.getValueFromObject(bodyParams, 'user_level_id'))
            .input('ENTRYDATE', apiHelper.getValueFromObject(bodyParams, 'entry_date'))
            .input('HARDSALARY', apiHelper.getValueFromObject(bodyParams, 'hard_salary'))
            .input('QUITJOBDATE', apiHelper.getValueFromObject(bodyParams, 'quit_job_date'))
            .input('EMAIL', apiHelper.getValueFromObject(bodyParams, 'email'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'phone_number'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('DEFAULTPICTUREURL', apiHelper.getValueFromObject(bodyParams, 'default_picture_url'))
            .input('CURRENTCOUNTRYID', apiHelper.getValueFromObject(bodyParams, 'current_country_id'))
            .input('CURRENTPROVINCEID', apiHelper.getValueFromObject(bodyParams, 'current_province_id'))
            .input('CURRENTDISTRICTID', apiHelper.getValueFromObject(bodyParams, 'current_district_id'))
            .input('CURRENTWARDID', apiHelper.getValueFromObject(bodyParams, 'current_ward_id'))
            .input('CURRENTADDRESS', apiHelper.getValueFromObject(bodyParams, 'current_address'))
            .input('ISTIMEKEEPING', apiHelper.getValueFromObject(bodyParams, 'is_time_keeping'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('IDENTITYNUMBER', apiHelper.getValueFromObject(bodyParams, 'identity_number'))
            .input('IDENTITYDATE', apiHelper.getValueFromObject(bodyParams, 'identity_date'))
            .input('IDENTITYPLACE', apiHelper.getValueFromObject(bodyParams, 'identity_place'))
            .input('USERSAMPLEIMAGES', apiHelper.getValueFromObject(bodyParams, 'user_sample_images'))
            .input('IDENTITYFRONTIMAGE', apiHelper.getValueFromObject(bodyParams, 'identity_front_image'))
            .input('IDENTITYBACKIMAGE', apiHelper.getValueFromObject(bodyParams, 'identity_back_image'))
            .input('COUNTRYID', apiHelper.getValueFromObject(bodyParams, 'country_id'))
            .input('PROVINCEID', apiHelper.getValueFromObject(bodyParams, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(bodyParams, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(bodyParams, 'ward_id'))
            .input('ADDRESS', apiHelper.getValueFromObject(bodyParams, 'address'))
            .input('PERMANENTCOUNTRYID', apiHelper.getValueFromObject(bodyParams, 'permanent_country_id'))
            .input('PERMANENTPROVINCEID', apiHelper.getValueFromObject(bodyParams, 'permanent_province_id'))
            .input('PERMANENTDISTRICTID', apiHelper.getValueFromObject(bodyParams, 'permanent_district_id'))
            .input('PERMANENTWARDID', apiHelper.getValueFromObject(bodyParams, 'permanent_ward_id'))
            .input('PERMANENTADDRESS', apiHelper.getValueFromObject(bodyParams, 'permanent_address'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input(
                'PASSWORD',
                id ? null : stringHelper.hashPassword(apiHelper.getValueFromObject(bodyParams, 'password')),
            )
            .input('SUBUSERNAME', apiHelper.getValueFromObject(bodyParams, 'sub_username'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('EMAILCOMPANY', apiHelper.getValueFromObject(bodyParams, 'email_company'))
            .input('USERSTATUS', apiHelper.getValueFromObject(bodyParams, 'user_status'))
            .input('BLOCKID', apiHelper.getValueFromObject(bodyParams, 'block_id'))
            .input('NATIONID', apiHelper.getValueFromObject(bodyParams, 'nation_id'))
            .input('MARITALSTATUS', apiHelper.getValueFromObject(bodyParams, 'marital_status'))
            .input('NUMBEROFCHILDREN', apiHelper.getValueFromObject(bodyParams, 'number_of_children'))
            .input('EMERGENCYCONTACT', apiHelper.getValueFromObject(bodyParams, 'emergency_contact'))
            .input('EMERGENCYPHONE', apiHelper.getValueFromObject(bodyParams, 'emergency_phone'))
            .input('TAXCODE', apiHelper.getValueFromObject(bodyParams, 'tax_code'))
            .input('ABOUTME', apiHelper.getValueFromObject(bodyParams, 'about_me'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('VOIPEXT', apiHelper.getValueFromObject(bodyParams, 'voip_ext'))
            .input('ISENOUGH', apiHelper.getValueFromObject(bodyParams, 'is_enough'))
            .input('PROBATIONDATE', apiHelper.getValueFromObject(bodyParams, 'probation_date'))
            .execute('SYS_USER_CreateOrUpdate_AdminWeb');

        const userId = data.recordset[0].RESULT;
        // XOa cac thong tin cu neu la update
        if (id) {
            // Xoa bank user
            const deleteBankUserRequest = new sql.Request(transaction);
            const deleteRes = await deleteBankUserRequest
                .input('USERID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('MD_BANKUSER_DeleteByUser_AdminWeb');
            const result = deleteRes.recordset[0].RESULT;

            if (result <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.CRUD.CREATE_FAILED);
            }
            // Xoa nhom nguoi dung
            const deleteUserGroup = new sql.Request(transaction);
            const deleteUserGroupRes = await deleteUserGroup
                .input('USERID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SYS_USER_USERGROUP_DeleteByUser_AdminWeb');

            const resultIp = deleteUserGroupRes.recordset[0].RESULT;
            if (resultIp <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.CRUD.CREATE_FAILED);
            }
            // Xoa trinh do
            const deleteEducation = new sql.Request(transaction);
            const deleteEducationRes = await deleteEducation
                .input('USERID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SYS_EDUCATION_USER_DeleteByUser_AdminWeb');

            const resultEducation = deleteEducationRes.recordset[0].RESULT;
            if (resultEducation <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.CRUD.CREATE_FAILED);
            }
            // Xoa ho so nhan su
            const deleteDocument = new sql.Request(transaction);
            const deleteDocumentRes = await deleteDocument
                .input('USERID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('MD_DOCUMENT_DeleteByUser_AdminWeb');

            const resultDocument = deleteDocumentRes.recordset[0].RESULT;
            if (resultDocument <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.CRUD.CREATE_FAILED);
            }

            // xoa so thich
            const deleteHobbies = new sql.Request(transaction);
            const deleteHobbiesRes = await deleteHobbies
                .input('USERNAME', user_name)
                .execute('SYS_USER_HOBBIES_DeleteByUsername_AdminWeb');
        }
        // Them moi cac thong tin khac

        const bankUsers = apiHelper.getValueFromObject(bodyParams, 'bank_users', []);
        const userGroups = apiHelper.getValueFromObject(bodyParams, 'user_groups', []);
        const educations = apiHelper.getValueFromObject(bodyParams, 'educations', []);
        const documents = apiHelper.getValueFromObject(bodyParams, 'documents', []);

        // Tai khoan ngan hang
        for (let i = 0; i < bankUsers.length; i++) {
            const createBankUserRequest = new sql.Request(transaction);
            const createBankUserRes = await createBankUserRequest
                .input('USERID', userId)
                .input('BANKNUMBER', apiHelper.getValueFromObject(bankUsers[i], 'bank_number'))
                .input('BANKID', apiHelper.getValueFromObject(bankUsers[i], 'bank_id'))
                .input('BANKBRANCH', apiHelper.getValueFromObject(bankUsers[i], 'bank_branch'))
                .input('ISDEFAULT', apiHelper.getValueFromObject(bankUsers[i], 'is_default'))
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('MD_BANKUSER_Create_AdminWeb');

            const result = createBankUserRes.recordset[0].RESULT;
            if (result <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.CRUD.CREATE_FAILED);
            }
        }

        // Nhom nguoi dung
        for (let i = 0; i < userGroups.length; i++) {
            const createUserGroupRequest = new sql.Request(transaction);
            const createUSerGroupRes = await createUserGroupRequest
                .input('USERID', userId)
                .input('USERGROUPID', apiHelper.getValueFromObject(userGroups[i], 'id'))
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SYS_USER_USERGROUP_Create_adminWeb');
            const result = createUSerGroupRes.recordset[0].RESULT;
            if (result <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.CRUD.CREATE_FAILED);
            }
        }

        // TRINH DO
        for (let i = 0; i < educations.length; i++) {
            const createEducationRequest = new sql.Request(transaction);
            const createEducationRes = await createEducationRequest
                .input('USERID', userId)
                .input('EDUCATIONLEVELID', apiHelper.getValueFromObject(educations[i], 'education_level_id'))
                .input('TRAININGCENTER', apiHelper.getValueFromObject(educations[i], 'training_center'))
                .input('GRADUATIONYEAR', apiHelper.getValueFromObject(educations[i], 'graduation_year'))
                .input('SPECIALIZED', apiHelper.getValueFromObject(educations[i], 'specialized'))
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SYS_EDUCATION_USER_Create_adminWeb');
            const result = createEducationRes.recordset[0].RESULT;
            if (result <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.CRUD.CREATE_FAILED);
            }
        }

        // HO SO
        for (let i = 0; i < documents.length; i++) {
            const createDocumentRequest = new sql.Request(transaction);
            let documentPath = apiHelper.getValueFromObject(documents[i], 'attachment_path');
            documentPath = `${documentPath}`.replace(config.domain_cdn, '');
            const createDocuementRes = await createDocumentRequest
                .input('USERID', userId)
                .input('DOCUMENTTYPEID', apiHelper.getValueFromObject(documents[i], 'document_type_id'))
                .input('ATTACHMENTNAME', apiHelper.getValueFromObject(documents[i], 'attachment_name'))
                .input('ATTACHMENTPATH', documentPath)
                .input('DESCRIPTION', apiHelper.getValueFromObject(documents[i], 'description'))
                .input('ISREVIEW', apiHelper.getValueFromObject(documents[i], 'is_review'))
                .input('REVIEWDATE', apiHelper.getValueFromObject(documents[i], 'review_date'))
                .input('REVIEWUSER', apiHelper.getValueFromObject(documents[i], 'review_user'))
                .input('REVIEWNOTE', apiHelper.getValueFromObject(documents[i], 'review_note'))
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .input('ISEXPECTED', apiHelper.getValueFromObject(documents[i], 'is_expected'))
                .execute('MD_DOCUMENT_Create_adminWeb');
            const result = createDocuementRes.recordset[0].RESULT;
            if (result <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.CRUD.CREATE_FAILED);
            }
        }

        // them moi so thich
        const hobby_list = apiHelper.getValueFromObject(bodyParams, 'hobby_list', []);
        for (let i = 0; i < hobby_list.length; i++) {
            const createHobbyRequest = new sql.Request(transaction);
            const createHobbyRes = await createHobbyRequest
                .input('USERNAME', user_name)
                .input('HOBBIESID', apiHelper.getValueFromObject(hobby_list[i], 'id'))
                .execute('SYS_USER_HOBBIES_Create_AdminWeb');
            const result = createHobbyRes.recordset[0].RESULT;
            if (result <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.CRUD.CREATE_FAILED);
            }
        }

        // khung năng lực

        //delete old skill
        const deleteOldSkillRequest = new sql.Request(transaction);
        await deleteOldSkillRequest
            .input('LISTID', [apiHelper.getValueFromObject(bodyParams, 'user_name')])
            .input('NAMEID', 'USERNAME')
            .input('TABLENAME', 'MD_POSITIONLEVELSKILL_USER')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        const skill_list = apiHelper.getValueFromObject(bodyParams, 'skill_list', []);
        const position_id = apiHelper.getValueFromObject(bodyParams, 'position_id');
        const user_level_id = apiHelper.getValueFromObject(bodyParams, 'user_level_id');

        if (position_id && user_level_id && user_name) {
            for (let i = 0; i < skill_list.length; i++) {
                if (skill_list[i].skill_id && skill_list[i].level_id && skill_list[i].skill_group_id) {
                    const createSkillRequest = new sql.Request(transaction);
                    const createSkillRes = await createSkillRequest
                        .input('SKILLID', apiHelper.getValueFromObject(skill_list[i], 'skill_id'))
                        .input('LEVELID', apiHelper.getValueFromObject(skill_list[i], 'level_id'))
                        .input('SKILLGROUPID', apiHelper.getValueFromObject(skill_list[i], 'skill_group_id'))
                        .input('POSITIONID', position_id)
                        .input('USERLEVELID', user_level_id)
                        .input('USERNAME', user_name)
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .execute('MD_POSITIONLEVELSKILL_USER_CreateOrUpdate_AdminWeb');
                    const result = createSkillRes.recordset[0].RESULT;
                    if (result <= 0) {
                        await transaction.rollback();
                        return new ServiceResponse(false, RESPONSE_MSG.CRUD.CREATE_FAILED);
                    }
                }
            }
        }

        if (apiHelper.getValueFromObject(bodyParams, 'voip_ext')) {
            const getTokenVoip = await authorizationVoip();
            let data = {
                extension: String(apiHelper.getValueFromObject(bodyParams, 'voip_ext')),
                password: '123abc@#123', // hard code sau gắn env
                enabled: true,
            };

            let configRequest = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${config.void.domain}/v3/extension`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getTokenVoip?.token}`,
                },
                data: data,
            };
            const resposeCreate = await createExtensionUser(data, getTokenVoip);
            console.log(resposeCreate);
            // axios.request(configRequest).then(e => {
            //     console.log(e?.stack);
            // });
        }

        await transaction.commit();
        return new ServiceResponse(true, '', userId);
    } catch (e) {
        //logger.error(e, { function: 'UserService.createOrUpdate' });
        console.log(e);
        await transaction.rollback();
        return new ServiceResponse(false, e.message);
    }
};

const detailUser = async (userId) => {
    try {
        const pool = await mssql.pool;
        const userRes = await pool.request().input('USERID', userId).execute('SYS_USER_GetById_AdminWeb');
        if (!userRes.recordset || !userRes.recordset[0]) return null;
        const user = UserClass.detail(userRes.recordset[0]);
        user.bank_users = UserClass.banks(userRes.recordsets[1]);
        user.user_groups = UserClass.userGroups(userRes.recordsets[2]);
        user.educations = UserClass.userEducations(userRes.recordsets[3]);
        user.documents = UserClass.userDocuments(userRes.recordsets[4]);
        user.hobby_list = UserClass.userHobbies(userRes.recordsets[5]);
        return user;
    } catch (e) {
        console.log(userId);
        logger.error(e, {
            function: 'userService.detailUser',
        });
        return null;
    }
};

const getProfile = async (userId) => {
    try {
        let user = await database.sequelize.query(`${PROCEDURE_NAME.SYS_USER_GETUSERBYID} @USERID=:USERID`, {
            replacements: {
                USERID: userId,
            },
            type: database.QueryTypes.SELECT,
        });

        if (user.length) {
            user = UserClass.profile(user[0]);
            user.isAdministrator = user.user_name === config.adminUserName ? 1 : 0;
            return user;
        }

        return null;
    } catch (e) {
        logger.error(e, {
            function: 'userService.detailUser',
        });

        return null;
    }
};

const findByUserName = async (userName) => {
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
        return null;
    }
};

const deleteUser = async (req) => {
    try {
        await database.sequelize.query(`SYS_USER_DeleteMany_AdminWeb @USERIDS=:USERIDS,@UPDATEDUSER=:UPDATEDUSER`, {
            replacements: {
                USERIDS: apiHelper.getValueFromObject(req.body, 'ids').toString(),
                UPDATEDUSER: apiHelper.getAuthId(req),
            },
            type: database.QueryTypes.UPDATE,
        });
        return true;
    } catch (error) {
        console.error('UserService.deleteUser', error);
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

const checkPassword = async (userId) => {
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

const generateSubUsername = async (firstName, lastName, userId) => {
    try {
        const inputSlug = stringHelper.changeToSlug(`${firstName} ${lastName}`);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('FULLNAME', inputSlug)
            .input('USERID', userId)
            .execute('SYS_USER_GetSubUsername_AdminWeb');
        const total = data.recordset[0].TOTAL;
        let diff = total > 0 ? (total + 1).toString() : '';
        const arrName = inputSlug.trim().split('-');
        let subUsername = `${arrName.pop()}`.toUpperCase();
        for (let i = 0; i < arrName.length; i++) {
            subUsername += `${arrName[i].charAt(0)}`.toUpperCase();
        }
        return `${subUsername}${diff}`;
    } catch (error) {
        console.error('userService.generateSubUsername', error);
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
            .execute(PROCEDURE_NAME.SYS_USER_LOGIN_LOG_CREATE);

        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'userService.logUserLogin',
        });

        return new ServiceResponse(true);
    }
};

const findByEmail = async (email, userID = null) => {
    try {
        const user = await database.sequelize.query(
            `${PROCEDURE_NAME.SYS_USER_FINDBYEMAIL} @EMAIL=:EMAIL,@USERID=:USERID`,
            {
                replacements: {
                    EMAIL: email,
                    USERID: userID,
                },
                type: database.QueryTypes.SELECT,
            },
        );
        if (user.length) {
            return UserClass.detail(user[0]);
        }
        return null;
    } catch (error) {
        console.error('userService.findByEmail', error);
        return null;
    }
};

const findByPhoneNumber = async (phoneNumber, userID = null) => {
    try {
        const user = await database.sequelize.query(
            `${PROCEDURE_NAME.SYS_USER_FINDBYPHONENUMBER} @PHONENUMBER=:PHONENUMBER,@USERID=:USERID`,
            {
                replacements: {
                    PHONENUMBER: phoneNumber,
                    USERID: userID,
                },
                type: database.QueryTypes.SELECT,
            },
        );

        if (user.length) {
            return UserClass.detail(user[0]);
        }

        return null;
    } catch (error) {
        console.error('userService.findByPhoneNumber', error);
        return null;
    }
};

const getOptionsAll = async (queryParams = {}) => {
    try {
        const ids = apiHelper.getValueFromObject(queryParams, 'ids', []);
        const isActive = apiHelper.getFilterBoolean(queryParams, 'is_active');
        const parentId = apiHelper.getValueFromObject(queryParams, 'parent_id');
        const function_alias = apiHelper.getValueFromObject(queryParams, 'function_alias');
        const data = await getOptions(queryParams);

        let dataUser = [];
        if (function_alias) {
            dataUser = await getByFunctionAlias(function_alias).filter((item) => {
                return item.USERID;
            });
        }
        const idsFilter = ids.filter((item) => {
            return item;
        });
        const dataFilter = _.filter(data, (item) => {
            let isFilter = true;
            if (Number(isActive) != API_CONST.ISACTIVE.ALL && Boolean(Number(isActive)) != item.ISACTIVE) {
                isFilter = false;
            }
            if (idsFilter.length && !idsFilter.includes(item.USERID.toString())) {
                isFilter = false;
            }
            if (parentId && Number(parentId) !== item.PARENTID) {
                isFilter = false;
            }
            if (function_alias && !dataUser.includes(item.USERID.toString())) {
                isFilter = false;
            }
            if (isFilter) {
                return item;
            }
            return null;
        });

        return new ServiceResponse(true, '', UserClass.options(dataFilter));
    } catch (e) {
        logger.error(e, { function: 'userService.getOptionsAll' });

        return new ServiceResponse(true, '', []);
    }
};

const getOptions = async ({ auth_name = 'administrator' }) => {
    try {
        const query = `${PROCEDURE_NAME.SYS_USER_GETOPTIONS}
        @IsActive=:IsActive,
        @AUTHNAME=:AUTHNAME`;
        const users = await database.sequelize.query(query, {
            replacements: {
                IsActive: API_CONST.ISACTIVE.ACTIVE,
                AUTHNAME: auth_name,
            },
            type: database.QueryTypes.SELECT,
        });
        return users;
    } catch (e) {
        logger.error(e, {
            function: 'userService.getOptions',
        });

        return [];
    }
};

const getByFunctionAlias = async (FunctionAlias) => {
    try {
        const query = `${PROCEDURE_NAME.SYS_USER_GETBYFUNCTIONALIAS}
      @FUNCTIONALIAS=:FUNCTIONALIAS`;
        const users = await database.sequelize.query(query, {
            replacements: {
                FUNCTIONALIAS: FunctionAlias,
            },
            type: database.QueryTypes.SELECT,
        });

        return users;
    } catch (e) {
        logger.error(e, {
            function: 'userService.getOptions',
        });

        return [];
    }
};

const getListUserDivison = async (req) => {
    try {
        const page = apiHelper.getPage(req);
        const limit = apiHelper.getLimit(req);

        const query = `SYS_USER_GetListDivison
        @PageSize=:PageSize,
        @PageIndex=:PageIndex,
        @KEYWORD=:KEYWORD`;
        const users = await database.sequelize.query(query, {
            replacements: {
                PageSize: limit,
                PageIndex: page,
                KEYWORD: apiHelper.getQueryParam(req, 'search'),
            },
            type: database.QueryTypes.SELECT,
        });
        return {
            data: UserClass.list(users),
            page: page,
            limit: limit,
            total: apiHelper.getTotalData(users),
        };
    } catch (e) {
        logger.error(e, {
            function: 'userService.getListUserDivison',
        });

        return [];
    }
};

const getListSkill = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const userId = apiHelper.getValueFromObject(queryParams, 'user_id');

        const resData = await pool
            .request()
            .input('USERID', userId)
            .input('POSITIONID', apiHelper.getValueFromObject(queryParams, 'position_id'))
            .input('USERLEVELID', apiHelper.getValueFromObject(queryParams, 'user_level_id'))
            .execute('SYS_USER_GetListSkill_AdminWeb');
        if (!resData.recordset || !resData.recordset[0]) return null;

        const skillGroupSkills = UserClass.skillGroupSkill(resData.recordsets[0]);
        const skillGroups = UserClass.skillGroup(resData.recordsets[1]);
        let skills = UserClass.skill(resData.recordsets[2]);
        const skillGroupSkillLevels = UserClass.skillGroupSkillLevel(resData.recordsets[3]);
        const jdFile = UserClass.jdFile(resData.recordsets[4][0]);

        skills = skills.map((item) => ({
            ...item,
            levels: item.levels.split(',').map((level) => +level),
        }));

        let skillList = [];

        for (let i = 0; i < skillGroups.length; i++) {
            skillList.push({
                ...skillGroups[i],
            });

            for (let j = 0; j < skillGroupSkills.length; j++) {
                if (+skillGroupSkills[j].skill_group_id === +skillGroups[i].skill_group_id) {
                    const skill = skills.find((item) => +item.skill_id === +skillGroupSkills[j].skill_id);
                    const skillGroupSkillLevel = skillGroupSkillLevels.find(
                        (item) =>
                            +item.skill_id === +skillGroupSkills[j].skill_id &&
                            +item.skill_group_id === +skillGroupSkills[j].skill_group_id,
                    );
                    const level_id = skillGroupSkillLevel?.level_id;

                    skillList.push({
                        ...skillGroups[i],
                        ...skill,
                        level_id: level_id ?? skill.required_level_id,
                    });
                }
            }
        }

        const levelOptionsRes = await getOptionsSkillLevel();
        if (levelOptionsRes.isFailed()) {
            throw levelOptionsRes;
        }
        const levelOptions = levelOptionsRes.getData();
        const levelList = levelOptions.map((item) => ({
            level_id: item.id,
            level_name: item.name,
        }));

        return {
            skill_list: skillList,
            level_list: levelList,
            jd_file: jdFile,
        };
    } catch (e) {
        logger.error(e, {
            function: 'userService.getListSkill',
        });
        return {};
    }
};

const getListSalaryHistory = async (queryParams) => {
    try {
        const pool = await mssql.pool;

        const page = apiHelper.getValueFromObject(queryParams, 'page');
        const limit = apiHelper.getValueFromObject(queryParams, 'itemsPerPage');

        const resData = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'username'))
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('EFFECTIVEDATEFROM', apiHelper.getValueFromObject(queryParams, 'effective_date_from'))
            .input('EFFECTIVEDATETO', apiHelper.getValueFromObject(queryParams, 'effective_date_to'))
            .input('PAGEINDEX', page)
            .input('PAGESIZE', limit)
            .execute('SYS_USER_GetListSalaryHistory_AdminWeb');
        if (!resData.recordset || !resData.recordset[0]) return null;

        const salaryHistory = UserClass.salaryHistory(resData.recordsets[1]);

        return {
            data: salaryHistory,
            page: page,
            limit: limit,
            total: apiHelper.getTotalData(resData.recordset),
        };
    } catch (e) {
        logger.error(e, {
            function: 'userService.getListSalaryHistory',
        });
        return {};
    }
};

const getListPositionHistory = async (queryParams) => {
    try {
        const pool = await mssql.pool;

        const page = apiHelper.getValueFromObject(queryParams, 'page');
        const limit = apiHelper.getValueFromObject(queryParams, 'itemsPerPage');

        const resData = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'username'))
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('EFFECTIVEDATEFROM', apiHelper.getValueFromObject(queryParams, 'effective_date_from'))
            .input('EFFECTIVEDATETO', apiHelper.getValueFromObject(queryParams, 'effective_date_to'))
            .input('PAGEINDEX', page)
            .input('PAGESIZE', limit)
            .execute('SYS_USER_GetListPositionHistory_AdminWeb');
        if (!resData.recordset || !resData.recordset[0]) return null;

        const positionHistory = UserClass.positionHistory(resData.recordsets[1]);

        return {
            data: positionHistory,
            page: page,
            limit: limit,
            total: apiHelper.getTotalData(resData.recordset),
        };
    } catch (e) {
        logger.error(e, {
            function: 'userService.getListPositionHistory',
        });
        return {};
    }
};

const getShiftInfo = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_USER_TIMEKEEPING_GetShiftInfo_App');
        return new ServiceResponse(true, '', UserClass.optionsShift(data.recordset[0]));
    } catch (e) {
        logger.error('get user schedule error !', { function: 'userService.getShiftInfo' });
        return new ServiceResponse(false, '', {});
    }
};

const exportExcel = async (queryParams = {}) => {
    try {
        queryParams.query.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
        const { data } = await getListUser(queryParams);
        const userStatus = {
            1: 'Đang làm việc',
            2: 'Nghỉ thai sản',
            3: 'Đã nghỉ việc',
        };

        const getBusinessStore = (business_stores) => {
            const business_store = business_stores?.split('|') ?? [];
            const businessList = [],
                storeList = [];
            for (const item of business_store) {
                const [business, store] = item?.split('#') ?? [];
                businessList.push(business);
                storeList.push(store);
            }

            return [businessList, storeList];
        };

        const dataExport = data.map((item) => {
            let businessList = [],
                storeList = [];
            if (item.business_stores) {
                const [dataBusiness, dataStore] = getBusinessStore(item.business_stores);
                if (dataBusiness) businessList = dataBusiness;
                if (dataStore) storeList = dataStore;
            }

            return {
                ...item,
                gender: item.gender === 1 ? 'Nam' : item.gender === 0 ? 'Nữ' : '-',
                material_status: item.material_status === 1 ? 'Đã kết hôn' : 'Độc thân',
                user_status: userStatus[item.user_status],
                business_list: businessList.join(','),
                store_list: storeList.join(','),
            };
        });

        const wb = new xl.Workbook();
        addSheetGetList({
            workbook: wb,
            sheetName: 'Danh sách nhân viên',
            header: {
                user_name: 'Mã NV',
                full_name: 'Họ và tên',
                position_name: 'Vị trí',
                department_name: 'Phòng ban',
                position_level_name: 'Cấp bậc',
                gender: 'Giới tính',
                phone_number: 'Số điện thoại',
                email: 'Email',
                user_status: 'Trạng thái',

                block_name: 'Khối',
                company_name: 'Công ty',
                birth_day: 'Ngày / tháng / năm sinh',
                email_company: 'Email công ty',
                nation_name: 'Dân tộc',

                business_list: 'Miền',
                store_list: 'Cửa hàng',

                address: 'Quê quán',
                current_address: 'Nơi ở hiện tại',

                apprentice_date: 'Ngày bắt đầu học việc',
                probation_date: 'Ngày bắt đầu thử việc',
                entry_date: 'Ngày chính thức',

                material_status: 'Tình trạng hôn nhân',
                number_of_children: 'Số lượng con',
                emergency_contact: 'Liên hệ khẩn cấp',
                emergency_phone: 'Số điện thoại khẩn cấp',
                tax_code: 'Mã số thuế',

                identity_number: 'CMND/CCCD',
                identity_date: 'Ngày cấp',
                identity_place: 'Nơi cấp',

                full_address: 'Quê quán',
                current_address: 'Nơi ở hiện tại',
            },
            data: dataExport,
        });

        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, { function: 'userService.exportExcel' });
        return new ServiceResponse(true, '', {});
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
    getOptionsAll,
    findByPhoneNumber,
    getListUserDivison,
    getProfile,
    getListSkill,
    getListSalaryHistory,
    getListPositionHistory,
    getShiftInfo,
    exportExcel,
    getListUserByOption,
    getListUserByShift
};
