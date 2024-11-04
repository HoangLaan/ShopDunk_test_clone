const announceClass = require('./announce.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');

const SEND_TO_ALL = 1;
const SEND_TO_DEPARTMENTS = 2;
const SEND_TO_USERS = 3;

const getListAnnounce = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        let keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('ISREVIEW', apiHelper.getValueFromObject(queryParams, 'is_review'))
            .input('ANNOUNCETYPEID', apiHelper.getValueFromObject(queryParams, 'announce_type_id'))
            .execute('SYS_ANNOUNCE_GetList_AdminWeb');
        const announceListRes = data.recordsets[0];
        let announceList = announceClass.list(announceListRes);
        const announceAttachment = announceClass.attachmentList(data.recordsets[1]);
        const announceUserView = announceClass.reviewUserList(data.recordsets[2]);
        announceList = announceList.map(announce => {
            return {
                ...announce,
                review_user_list: (announceUserView || []).filter(x => x.announce_id == announce.announce_id),
                attachment_list: (announceAttachment || []).filter(x => x.announce_id == announce.announce_id),
            };
        });

        return new ServiceResponse(true, '', {
            data: announceList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(announceListRes),
        });
    } catch (e) {
        logger.error(e, { function: 'announceService.getListAnnounce' });

        return new ServiceResponse(true, '', {});
    }
};
const getListAllAnnounce = async (queryParams = {}) => {
    try {
        let keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool.request().input('KEYWORD', keyword).execute('SYS_ANNOUNCE_GetListAll');
        const announceListRes = data.recordset;
        const announceList = announceClass.list(announceListRes);
        for (let i = 0; i < announceList.length; i++) {
            const announce = announceList[i];
            const announceId = announce.announce_id;
            const res = await pool
                .request()
                .input('ANNOUNCEID', announceId)
                .execute('SYS_ANNOUNCE_REVIEW_GetUserInfor_AdminWeb');

            const announceUserView = announceClass.reviewUserList(res.recordset);
            announceList[i].review_user_list = announceUserView;
        }
        for (let i = 0; i < announceList.length; i++) {
            const announce = announceList[i];
            const announceId = announce.announce_id;
            const res = await pool
                .request()
                .input('ANNOUNCEID', announceId)
                .execute('SYS_ANNOUNCE_ATTACHMENT_GetByAnnounceId_AdminWeb');

            const announceAttachment = announceClass.attachmentList(res.recordset);
            announceList[i].attachment_list = announceAttachment;
        }
        return new ServiceResponse(true, '', {
            data: announceList,
            total: apiHelper.getTotalData(announceListRes),
        });
    } catch (e) {
        logger.error(e, { function: 'announceService.getListAnnounce' });

        return new ServiceResponse(true, '', {});
    }
};

const getListAnnounceView = async (queryParams = {}, body) => {
    try {
        let keyword = apiHelper.getSearch(queryParams);
        let currentPage = apiHelper.getCurrentPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('PAGEINDEX', currentPage)
            .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('SYS_ANNOUCE_GetListView_AdminWeb');

        const announceListRes = data.recordsets[0];
        let announceList = announceClass.listAnnounceView(announceListRes);
        const announceAttachment = announceClass.attachmentList(data.recordsets[2]);

        announceList = announceList.map((_annouce) => {
            return {
                ..._annouce,
                attachment_list: announceAttachment.filter((_attment) => _attment.announce_id == _annouce.announce_id)
            }
        })
        return new ServiceResponse(true, '', {
            data: announceList,
            total: apiHelper.getTotalData(announceListRes),
        });
    } catch (e) {
        logger.error(e, { function: 'announceService.getListAnnounceView' });

        return new ServiceResponse(true, '', {});
    }
};
const getAnnounceView = async (announceid, body, appUrl) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ANNOUNCEID', announceid)
            .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('SYS_ANNOUNCE_GetAnnounceViewById_AdminWeb');
        let announce = data.recordsets[0];
        // if (data.recordset[0].ISALLOWED) {
        //     let announce = data.recordsets[1];
        if (announce && announce.length > 0) {
            announce = announceClass.detail(announce[0]);
            announce.attachment_list = announceClass.attachmentList(data.recordsets[1]);

            return new ServiceResponse(true, '', announce);
        } else if (announce) return new ServiceResponse(true, 'Không có quyền xem', null);

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'announceServer.getAnnounceView' });
        return new ServiceResponse(false, e.message);
    }
};

const getListAnnounceNotRead = async body => {
    try {
        // let keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('SYS_ANNOUNCE_GetTotalUnReadAnnounceView_AdminWeb');
        const totalAnnounceNotRead =
            data.recordsets[0] && data.recordsets[0].length > 0 ? data.recordsets[0][0].TOTALUNREAD : 0;
        return new ServiceResponse(true, '', {
            count: totalAnnounceNotRead,
        });
    } catch (error) {
        logger.error(error, {
            function: 'announceService.getListAnnounceNotRead',
        });
        console.error('announceService.getListAnnounceNotRead', error);
        return new ServiceResponse(false, e.message);
    }
};

const getListUserView = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ANNOUNCEID', apiHelper.getValueFromObject(bodyParams, 'announce_id'))

            .execute('SYS_ANNOUNCE_USERVIEW_GetListUserView_App');

        const stores = data.recordset;
        return new ServiceResponse(true, '', {
            // data: announceClass.getListUserView(stores),
            // page: currentPage,
            // limit: itemsPerPage,
            total: apiHelper.getTotalData(stores),
        });
    } catch (e) {
        logger.error(e, { function: 'announceService.getListUserView' });
        return new ServiceResponse(true, '', {});
    }
};
const getListCompany = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.ST_STOCKS_GETLISTCOMPANY);

        const companies = data.recordset;
        return new ServiceResponse(true, '', {
            data: announceClass.listCompany(companies),
        });
    } catch (e) {
        logger.error(e, { function: 'announceService.getListCompany' });
        return new ServiceResponse(true, '', {});
    }
};

const createAnnounceOrUpdate = async (body, files, auth) => {
    body = JSON.parse(JSON.stringify(body));
    let review_level_list = apiHelper.getValueFromObject(body, 'review_level_list', []);
    let is_auto_reviewed = review_level_list.length === 0 ? 1 : 0;
    const pool = await mssql.pool;
    const sql = mssql.sql;
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();

        const announce_id = apiHelper.getValueFromObject(body, 'announce_id');
        const is_send_to_all = parseInt(apiHelper.getValueFromObject(body, 'is_send_to_all'));
        //1: gửi all, 0: gửi phòng ban/ nhân viên
        const createOrUpdateAnnounce = new sql.Request(transaction);
        const announceRes = await createOrUpdateAnnounce
            .input('ANNOUNCEID', apiHelper.getValueFromObject(body, 'announce_id'))
            .input('ANNOUNCETYPEID', apiHelper.getValueFromObject(body, 'announce_type_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
            .input('ANNOUNCETITLE', apiHelper.getValueFromObject(body, 'announce_title'))
            .input('ANNOUNCECONTENT', apiHelper.getValueFromObject(body, 'announce_content'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(auth, 'user_name'))
            .input('PUBLISHEDDATE', apiHelper.getValueFromObject(body, 'published_date'))
            .input('PUSHTYPE', is_send_to_all)
            .input('ISREVIEW', is_auto_reviewed ? is_auto_reviewed : null)
            .execute('SYS_ANNOUNCE_CreateOrUpdate_AdminWeb');
        const announceId = announceRes.recordset[0].RESULT;

        if (announceId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Có lỗi xảy ra, vui lòng thử lại sau');
        }
        // let departments = apiHelper.getValueFromObject(bodyParams, 'department');
        // let user = apiHelper.getValueFromObject(bodyParams, 'user');
        // if (departments && departments.length) {
        //     for (let i = 0; i < departments.length; i++) {
        //         const data_department = await pool
        //             .request()
        //             .input('ANNOUNCEID', announce_id)
        //             .input('DEPARTMENTID', departments[i].id)
        //             .input('USERNAME', null)
        //             .execute('SYS_ANNOUNCE_USER_CreateOrUpdate_AdminWeb');
        //     }
        // }
        // if (user && user.length) {
        //     for (let i = 0; i < user.length; i++) {
        //         const data_user = await pool
        //             .request()
        //             .input('ANNOUNCEID', announce_id)
        //             .input('DEPARTMENTID', null)
        //             .input('USERNAME', user[i].id)
        //             .execute('SYS_ANNOUNCE_USER_CreateOrUpdate_AdminWeb');
        //     }
        // }

        if (is_send_to_all) {
            const res = await pool
                .request()
                .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
                .execute('SYS_USER_GetListUserByCompanyId_AdminWeb');

            const data = res.recordsets[0]

            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const createAnnounceUser = new sql.Request(transaction);
                    await createAnnounceUser
                        .input('ANNOUNCEID', announceId)
                        .input('DEPARTMENTID', data[i].DEPARTMENTID)
                        .input('USERNAME', data[i].USERNAME)
                        .execute('SYS_ANNOUNCE_USER_CreateOrUpdate_AdminWeb');
                }
            }
        }

        // Create announce user
        // if ([SEND_TO_DEPARTMENTS, SEND_TO_USERS].includes(push_type))
        if (!is_send_to_all) {
            // const is_send_user = is === SEND_TO_USERS ? 1 : 0;
            // const list = (is_send_user ? user : department) || [];

            const departmentIds = [];
            let department = apiHelper.getValueFromObject(body, 'department', []);
            const newDepartment = Array.isArray(department)
                ? department.map((item) => JSON.parse(item))
                : [JSON.parse(department)];
            newDepartment.forEach((val) => {
                departmentIds.push(val.department_id);
            });

            if (departmentIds.length > 0) {
                const pool = await mssql.pool;
                const res = await pool
                    .request()
                    .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
                    .input('DEPARTMENTIDS', JSON.stringify(departmentIds))
                    .execute('SYS_USER_GetListUserByDepartmentArray_AdminWeb');

                const data = res.recordsets[0]

                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const createAnnounceUser = new sql.Request(transaction);
                        await createAnnounceUser
                            .input('ANNOUNCEID', announceId)
                            .input('DEPARTMENTID', data[i].DEPARTMENTID)
                            .input('USERNAME', data[i].USERNAME)
                            .execute('SYS_ANNOUNCE_USER_CreateOrUpdate_AdminWeb');
                    }
                }
            }

            let user = apiHelper.getValueFromObject(body, 'user', []);
            user = Array.isArray(user) ? user.map((item) => JSON.parse(item)) : [JSON.parse(user)];

            for (let i = 0; i < user.length; i++) {
                const createAnnounceUser = new sql.Request(transaction);
                await createAnnounceUser
                    .input('ANNOUNCEID', announceId)
                    .input('DEPARTMENTID', null)
                    .input('USERNAME', user[i].id)
                    .execute('SYS_ANNOUNCE_USER_CreateOrUpdate_AdminWeb');
            }
        }

        let attachment_id_list = apiHelper.getValueFromObject(body, 'attachment_list', []);

        attachment_id_list = Array.isArray(attachment_id_list)
            ? attachment_id_list.map(item => JSON.parse(item).announce_attachment_id)
            : [JSON.parse(attachment_id_list).announce_attachment_id]; //trường hợp 1 phần tử sẽ mất []

        const oldAttachmentListRes = await pool
            .request()
            .input('ANNOUNCEID', announceId)
            .execute('SYS_ANNOUNCEATTACHMENT_GetByAnnounceId_AdminWeb');
        // Delete old attachment
        if (oldAttachmentListRes.recordsets.length) {
            let oldAttachmentList = oldAttachmentListRes.recordset;
            oldAttachmentList = announceClass.attachmentList(oldAttachmentList);

            const attachmentDeleteList = oldAttachmentList
                .filter(
                    oldAttachment =>
                        !Boolean(attachment_id_list.find(item => item == oldAttachment.announce_attachment_id)),
                )
                .map(item => item.announce_attachment_id);

            if (attachmentDeleteList.length) {
                await pool
                    .request()
                    .input('LISTID', attachmentDeleteList)
                    .input('NAMEID', 'ANNOUNCEATTACHMENTID')
                    .input('TABLENAME', 'SYS_ANNOUNCEATTACHMENT')
                    .input('DELETEDUSER', apiHelper.getValueFromObject(auth, 'user_name'))
                    .execute('CBO_COMMON_SOFTDELETE');
            }
        }

        for (let i = 0; i < files.length; i++) {
            let attachment = null;

            const file = files[i];
            if (file.buffer) {
                resUrl = await fileHelper.uploadFile(file);

                attachment = resUrl
                    ? {
                        attachment_path: resUrl.data[0].file,
                        attachment_name: file.originalname,
                    }
                    : null;
            }

            if (Boolean(attachment)) {
                const createAnnounceAttachment = new sql.Request(transaction);
                const result = await createAnnounceAttachment
                    .input('ANNOUNCEID', announceId)
                    .input('ATTACHMENTNAME', attachment.attachment_name)
                    .input('ATTACHMENTPATH', attachment.attachment_path)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(auth, 'user_name'))
                    .execute('SYS_ANNOUNCEATTACHMENT_CreateOrUpdate_AdminWeb');
            }
        }

        //REVIEW LEVEL

        review_level_list = Array.isArray(review_level_list)
            ? review_level_list.map(item => JSON.parse(item))
            : [JSON.parse(review_level_list)];

        for (let i = 0; i < review_level_list.length; i++) {
            const createAnnounceReviewLevel = new sql.Request(transaction);
            const result = await createAnnounceReviewLevel
                .input('ANNOUNCEID', announceId)
                .input('REVIEWUSER', review_level_list[i].review_user)
                .input('ANNOUNCEREVIEWLEVELID', review_level_list[i].announce_review_level_id)
                .input('USERNAME', apiHelper.getValueFromObject(auth, 'user_name'))
                .execute('SYS_ANNOUNCE_REVIEW_CreateOrUpdate_AdminWeb');

            if (!result.recordset) {
                throw Error('Vui lòng chọn đúng người duyệt');
            }
        }

        const updateReviewStatus = new sql.Request(transaction);
        await updateReviewStatus
            .input('ANNOUNCEID', announceId)
            .input('USERNAME', apiHelper.getValueFromObject(auth, 'user_name'))
            .execute('SYS_ANNOUNCE_UpdateReviewState_AdminWeb');

        await transaction.commit();
        return new ServiceResponse(true, '', {
            announce_id: announceId,
            status: 'success',
            message: 'Lưu thành công!',
        });
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'announceService.createAnnounceOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const isApproveReview = async (announceReviewId, username) => {
    try {
        const pool = await mssql.pool;
        const currLevelRes = await pool
            .request()
            .input('ANNOUNCEREVIEWID', announceReviewId)
            .execute('SYS_ANNOUNCE_REVIEW_GetById_AdminWeb');

        let currLevel = currLevelRes.recordset;
        if (currLevel && currLevel.length > 0) {
            currLevel = currLevel[0];

            if (currLevel.REVIEWUSER !== username) {
                return false;
            }

            if (currLevel.REVIEWDATE) {
                return false;
            }

            if (currLevel.ORDERINDEX === 0) {
                return true;
            }

            const preLevelRes = await pool
                .request()
                .input('ANNOUNCEREVIEWID', announceReviewId)
                .execute('SYS_ANNOUNCE_REVIEW_GetPreOrderById_AdminWeb');

            let preLevel = preLevelRes.recordset;
            if (preLevel && preLevel.length > 0) {
                preLevel = preLevel[0];

                if (preLevel.REVIEWDATE) {
                    return true;
                }
            }
        }
        return false;
    } catch (e) {
        logger.error(e, { function: 'announceService.isApproveReview' });
        return false;
    }
};

const detailAnnounce = async (announceid, body, appUrl) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ANNOUNCEID', announceid)
            .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('SYS_ANNOUNCE_GetById_AdminWeb');
        let announce = data.recordset;
        if (announce && announce.length > 0) {
            announce = announceClass.detail(announce[0]);
            announce.attachment_list = announceClass.attachmentList(data.recordsets[1]);
            announce.review_level_list = announceClass.reviewLevelList(data.recordsets[2]);
            announce.department = announceClass.listDepartment(data.recordsets[3]);
            announce.user = announceClass.listUser(data.recordsets[4]);

            announce.review_level_list = await Promise.all(
                announce.review_level_list.map(async review_level => {
                    const is_approve_review = await isApproveReview(
                        review_level.announce_review_id,
                        apiHelper.getValueFromObject(body, 'auth_name'),
                    );
                    return { ...review_level, is_approve_review };
                }),
            );
            // for (let i = 0; i < announce.review_level_list.length; i++) {
            //     announce.review_level_list[i].is_approve_review = await isApproveReview(
            //         announce.review_level_list[i].announce_review_id,
            //         apiHelper.getValueFromObject(body, 'auth_name'),
            //     );
            // }

            return new ServiceResponse(true, '', announce);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'announceServer.detailAnnounce' });
        return new ServiceResponse(false, e.message);
    }
};

//Check user view the announce or not, if not, create new record in database
// const createAnnounceUserView = async body => {
//     const pool = await mssql.pool;
//     const transaction = await new sql.Transaction(pool);
//     try {
//         await transaction.begin();
//         const requestMailBox = new sql.Request(transaction);
//         console.log(apiHelper.getValueFromObject(body, 'announce_id'), 'announce_id');
//         console.log(apiHelper.getValueFromObject(body, 'auth_name'), 'auth_name');
//         const resultMailBox = await requestMailBox
//             .input('ANNOUNCEID', apiHelper.getValueFromObject(body, 'announce_id'))
//             .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
//             .execute('SYS_ANNOUNCE_USERVIEW_CREATE_AdminWeb');
//         const result = resultMailBox.recordset[0].RESULT;
//         await transaction.commit();
//         return new ServiceResponse(true, '', result);
//     } catch (error) {
//         await transaction.rollback();
//         logger.error(error, {
//             function: 'announceService.createAnnounceUserView',
//         });
//         console.error('announceService.createAnnounceUserView', error);
//         return new ServiceResponse(false, e.message);
//     }
// };

const createAnnounceUserView = async bodyParams => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ANNOUNCEID', apiHelper.getValueFromObject(bodyParams, 'announce_id'))
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SYS_ANNOUNCE_USERVIEW_CREATE_AdminWeb');

        return new ServiceResponse(true, '', {
            status: 'success',
            message: 'Lưu thành công!',
        });
    } catch (e) {
        logger.error(e, { function: 'degreeService.createDegreeOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};
const downloadAttachment = async announce_attachment_id => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ANNOUNCEATTACHMENTID', announce_attachment_id)
            .execute('SYS_ANNOUNCEATTACHMENT_GetByAnnounceAttachmentId_AdminWeb');

        let attachment = data.recordset;

        if (attachment && attachment.length > 0) {
            attachment = announceClass.attachmentDetail(attachment[0]);
            return new ServiceResponse(true, '', attachment);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'announceServer.downloadAttachment' });
        return new ServiceResponse(false, e.message);
    }
};

const getListAnnounceTypeOptions = async function (queryParams) {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('SYS_ANNOUNCETYPE_GetListAnnounce_AdminWeb');
        return new ServiceResponse(true, '', announceClass.optionsAnnounceType(data.recordsets[0]));
    } catch (e) {
        logger.error(e, {
            function: 'AnnounceService.getListAnnounceTypeOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getListReviewLevelByAnnounceTypeId = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ANNOUNCETYPEID', apiHelper.getValueFromObject(queryParams, 'announce_type_id'))
            .input('ANNOUNCEID', apiHelper.getValueFromObject(queryParams, 'announce_id'))
            .execute('SYS_ANNOUNCE_GetOptionsAnnounceTypeReviewLevel_AdminWeb');
        let reviewLevel = announceClass.listReviewLevel(data.recordsets[0]);
        let reviewUser = announceClass.listReviewUser(data.recordsets[1]);
        reviewLevel = (reviewLevel || []).map(r => {
            let list_user = reviewUser.filter(u => u.announce_review_level_id == r.announce_review_level_id);
            return { ...r, list_user };
        });
        return new ServiceResponse(true, '', reviewLevel);
    } catch (e) {
        logger.error(e, { function: 'announceService.getListReviewLevelByAnnounceTypeId' });
        return new ServiceResponse(false, '', []);
    }
};

const reviewAnnounce = async (body = {}) => {
    try {
        const pool = await mssql.pool;

        const announce_review_id = apiHelper.getValueFromObject(body, 'announce_review_id');
        const username = apiHelper.getValueFromObject(body, 'auth_name');

        const isApprove = await isApproveReview(announce_review_id, username);

        if (!isApprove) {
            return new ServiceResponse(false, 'Bạn không có quyền duyệt thông báo/mức duyệt này');
        }

        const reviewAnnounceRes = await pool
            .request()
            .input('TYPE', apiHelper.getValueFromObject(body, 'type'))
            .input('ANNOUNCEREVIEWID', announce_review_id)
            .input('USERNAME', username)
            .input('REVIEWNOTE', apiHelper.getValueFromObject(body, 'review_note'))
            .execute('SYS_ANNOUNCE_REVIEW_ApproveOrReject_AdminWeb');

        return new ServiceResponse(true, '', { message: 'success' });
    } catch (e) {
        logger.error(e, { function: 'announceService.reviewAnnounce' });
        return new ServiceResponse(false, e.message);
    }
};
const deleteAnnounce = async bodyParams => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'ANNOUNCEID')
            .input('TABLENAME', 'SYS_ANNOUNCE')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'announceService.deleteAnnounce' });
        return new ServiceResponse(false, e.message);
    }
};
module.exports = {
    getListAnnounce,
    getListUserView,
    createAnnounceOrUpdate,
    getListAnnounceView,
    getListCompany,
    detailAnnounce,
    downloadAttachment,
    getListAnnounceTypeOptions,
    getListReviewLevelByAnnounceTypeId,
    reviewAnnounce,
    getListAllAnnounce,
    getListAnnounceNotRead,
    createAnnounceUserView,
    deleteAnnounce,
    getAnnounceView,
};
