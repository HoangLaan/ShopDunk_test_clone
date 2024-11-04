const mailClass = require('./mail.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const fileHelper = require('../../common/helpers/file.helper');
const sql = require('mssql');
const BULLMQ = require('../../bullmq');
const {mapperData} = require('../../common/helpers/utils.helper');

const getListTokenDeviceUser = async (listUsernames, listDepartments) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAMES', listUsernames)
            .input('DEPARTMENTS', listDepartments)
            .execute('GET_LIST_TOKEN_USER');
        return new ServiceResponse(true, '', {
            data: data.recordset.map(value => value.DEVICETOKEN),
        });
    } catch (e) {
        logger.error(e, {function: 'mailService.getListTokenDeviceUser'});
        return new ServiceResponse(false, e.message);
    }
};

const getListInbox = async (user_name, queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', user_name)
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('ISGETBYCURRENTDAY', queryParams.is_get_by_current_day || 0)
            .input('ISUNREAD', queryParams.is_unread || 2)
            .execute('SYS_MAILBOX_GetListInbox_App');
        const listInbox = mailClass.listInbox(data.recordset);
        const listAttachment = mailClass.attachment(data.recordsets[1]);

        return new ServiceResponse(true, '', {
            data: listInbox.map(value => ({
                ...value,
                attachments: mapperData(listAttachment, o => o.mail_id === value.mail_id),
            })),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {function: 'mailService.getListInbox'});
        return new ServiceResponse(false, e.message);
    }
};

const deleteMail = async (user_name, mailId) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('USERNAME', user_name)
            .input('MAILID', mailId)
            .execute(PROCEDURE_NAME.SYS_MAIL_DELETE_APP);
        return new ServiceResponse(true, '', RESPONSE_MSG.CRUD.DELETE_SUCCESS);
    } catch (e) {
        logger.error(e, {function: 'mailService.deleteMail'});
        return new ServiceResponse(false, e.message);
    }
};

const getListSent = async (user_name, queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', user_name)
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .execute('SYS_MAILBOX_GetListSent_App');
        const listMail = mailClass.listMail(data.recordsets[0]);
        const listAttachment = mailClass.attachment(data.recordsets[1]);
        //const listReceiver = data.recordsets[2];

        return new ServiceResponse(true, '', {
            data: listMail.map(value => ({
                ...value,
                attachments: mapperData(listAttachment, o => o.mail_id === value.mail_id),
                //receivers: mapperData(listReceiver, o => o.MAILID === value.mail_id),
            })),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {function: 'mailService.getListSent'});
        return new ServiceResponse(false, e.message);
    }
};

const getListFlagged = async (user_name, queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', user_name)
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .execute('SYS_MAILBOX_GetListFlagged_App');
        const listMail = mailClass.listMail(data.recordsets[0]);
        const listAttachment = mailClass.attachment(data.recordsets[1]);
        //const listReceiver = data.recordsets[2];

        return new ServiceResponse(true, '', {
            data: listMail.map(value => ({
                ...value,
                attachments: mapperData(listAttachment, o => o.mail_id === value.mail_id),
                //receivers: mapperData(listReceiver, o => o.MAILID === value.mail_id),
            })),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {function: 'mailService.getListFlagged'});
        return new ServiceResponse(false, e.message);
    }
};

const getListDraft = async (user_name, queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', user_name)
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .execute('SYS_MAILBOX_GetListDraft_App');
        const listMail = mailClass.listMail(data.recordsets[0]);
        const listAttachment = mailClass.attachment(data.recordsets[1]);
        //const listReceiver = data.recordsets[2];

        return new ServiceResponse(true, '', {
            data: listMail.map(value => ({
                ...value,
                attachments: mapperData(listAttachment, o => o.mail_id === value.mail_id),
                //receivers: mapperData(listReceiver, o => o.MAILID === value.mail_id),
            })),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {function: 'mailService.getListDraft'});
        return new ServiceResponse(false, e.message);
    }
};

const getListTrash = async (user_name, queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', user_name)
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .execute('SYS_MAILBOX_GetListTrash_App');
        const listMail = mailClass.listMail(data.recordsets[0]);
        const listAttachment = mailClass.attachment(data.recordsets[1]);
        //const listReceiver = data.recordsets[2];

        return new ServiceResponse(true, '', {
            data: listMail.map(value => ({
                ...value,
                attachments: mapperData(listAttachment, o => o.mail_id === value.mail_id),
                //receivers: mapperData(listReceiver, o => o.MAILID === value.mail_id),
            })),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {function: 'mailService.getListTrash'});
        return new ServiceResponse(false, e.message);
    }
};

const getById = async (user_name, mailId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', user_name)
            .input('MAILID', mailId)
            .execute(PROCEDURE_NAME.SYS_MAIL_GETBYID_APP);
        if (!data.recordsets[0].length) {
            return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
        }
        const parentMail = mailClass.parentMail(data.recordsets[0][0]);
        const listChildMail = mailClass.listChildMail(data.recordsets[1]);
        const listAttachment = mailClass.attachment(data.recordsets[2]);
        const listReceiver = data.recordsets[3];

        return new ServiceResponse(true, '', {
            mail: parentMail,
            child: listChildMail.map(value => ({
                ...value,
                attachments: mapperData(listAttachment, o => o.mail_id === value.mail_id),
                receivers: mapperData(listReceiver, o => o.MAILID === value.mail_id),
            })),
        });
    } catch (e) {
        logger.error(e, {function: 'mailService.getById'});
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdate = async (user_name, files, bodyParams = {}, mail_id = 0) => {
    const {
        parent_id = 0,
        is_draft = 0,
        mail_subject = '',
        mail_content = '',
        is_send_to_all = 0,
        attachments = [],
        list_user = [],
        list_department = [],
        list_cc_user = [],
        is_reply_all = 0,
        flatform = '',
    } = bodyParams;

    // console.log('bodyParams===', bodyParams);
    // console.log('files==', files);
    // console.log('list_department===', list_department);

    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        let allFile = [];
        try {
            if (files && files.length) {
                const resFile = await fileHelper.uploadFile(files);
                allFile = allFile.concat(resFile.data);
            }
        } catch (error) {
            console.log('createOrUpdate Email:', {error});
        }

        await transaction.begin();
        const reqCreateOrUpdateMail = new sql.Request(transaction);
        const resCreateOrUpdateMail = await reqCreateOrUpdateMail
            .input('MAILID', mail_id)
            .input('PARENTID', parent_id)
            .input('ISSENDTOALL', is_send_to_all)
            .input('ISDRAFT', is_draft)
            .input('MAILSUBJECT', mail_subject)
            .input('MAILCONTENT', mail_content)
            .input('USERNAME', user_name)
            .execute(PROCEDURE_NAME.SYS_MAIL_CREATEORUPDATE_APP);
        const mailId = resCreateOrUpdateMail.recordset[0].RESULT;

        if (is_draft) {
            const reqCreateDraft = new sql.Request(transaction);
            const resCreateDraft = await reqCreateDraft
                .input('MAILID', mailId)
                .input('USERNAME', user_name)
                .input('ISDRAFT', 1)
                .execute(PROCEDURE_NAME.SYS_MAILBOX_UPDATEDRAFT_APP);
            if (!resCreateDraft.recordset[0].RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, '', '!resCreateDraft.recordset[0].RESULT');
            }
        }

        if (mail_id) {
            const reqDeleteAttachment = new sql.Request(transaction);
            const resDeleteAttachment = await reqDeleteAttachment
                .input('MAILID', mail_id)
                .input('USERNAME', user_name)
                .execute(PROCEDURE_NAME.SYS_MAILATTACHMENT_DELETE_APP);
            if (!resDeleteAttachment.recordset[0].RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, '', '!resDeleteAttachment.recordset[0].RESULT');
            }

            const reqDeleteUser = new sql.Request(transaction);
            const resDeleteUser = await reqDeleteUser
                .input('MAILID', mail_id)
                .execute(PROCEDURE_NAME.SYS_MAILUSER_DELETE_APP);
            if (!resDeleteUser.recordset[0].RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, '', '!resDeleteUser.recordset[0].RESULT');
            }

            if (!is_draft) {
                const reqUpdateDraft = new sql.Request(transaction);
                const resUpdateDraft = await reqUpdateDraft
                    .input('MAILID', mailId)
                    .input('USERNAME', user_name)
                    .input('ISDRAFT', 0)
                    .execute(PROCEDURE_NAME.SYS_MAILBOX_UPDATEDRAFT_APP);
                if (!resUpdateDraft.recordset[0].RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, '', '!resUpdateDraft.recordset[0].RESULT');
                }
            }
        }

        if (Boolean(parseInt(parent_id)) && Boolean(parseInt(is_reply_all)) && !is_send_to_all) {
            list_user.length = 0;
            list_cc_user.length = 0;
            list_department.length = 0;
            const reqGetListReceiverByMailId = new sql.Request(transaction);
            const resGetListReceiverByMailId = await reqGetListReceiverByMailId
                .input('MAILID', parent_id)
                .input('USERNAME', user_name)
                .execute(PROCEDURE_NAME.SYS_MAILUSER_GETLISTRECEIVERBYMAILID_APP);

            const listReceiver = resGetListReceiverByMailId.recordset;
            if (listReceiver && listReceiver.length) {
                listReceiver.forEach(el => {
                    if (el.USERNAME && el.SENDTYPE !== 'CC') list_user.push(el.USERNAME);
                    if (el.USERNAME && el.SENDTYPE === 'CC') list_cc_user.push(el.USERNAME);
                    if (el.DEPARTMENTID) list_department.push(el.DEPARTMENTID);
                });
            }
        }

        if (list_user && list_user.length) {
            const reqInsertMailUser = new sql.Request(transaction);
            for (let i = 0; i < list_user.length; i++) {
                const resInsertMailUser = await reqInsertMailUser
                    .input('MAILID', mailId)
                    .input('USERNAME', list_user[i])
                    .execute(PROCEDURE_NAME.SYS_MAILUSER_CREATE_APP);
                if (!resInsertMailUser.recordset[0].RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, '', '!resInsertMailUser.recordset[0].RESULT');
                }
            }
        }

        if (list_department && list_department.length) {
            const reqInsertMailUser = new sql.Request(transaction);
            for (let i = 0; i < list_department.length; i++) {
                const resInsertMailUser = await reqInsertMailUser
                    .input('MAILID', mailId)
                    .input('DEPARTMENTID', list_department[i])
                    .execute(PROCEDURE_NAME.SYS_MAILUSER_CREATE_APP);
                if (!resInsertMailUser.recordset[0].RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, '', '!resInsertMailUser.recordset[0].RESULT');
                }
            }
        }

        if (list_cc_user && list_cc_user.length) {
            const reqInsertCCUser = new sql.Request(transaction);
            for (let i = 0; i < list_cc_user.length; i++) {
                const resInsertCCUser = await reqInsertCCUser
                    .input('MAILID', mailId)
                    .input('SENDTYPE', 'CC')
                    .input('USERNAME', list_cc_user[i])
                    .execute(PROCEDURE_NAME.SYS_MAILUSER_CREATE_APP);
                if (!resInsertCCUser.recordset[0].RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, '', '!resInsertCCUser.recordset[0].RESULT');
                }
            }
        }

        if (attachments.length) allFile = allFile.concat(attachments);

        if (allFile.length) {
            const reqInsertAttachment = new sql.Request(transaction);
            for (let i = 0; i < allFile.length; i++) {
                const resInsertAttachment = await reqInsertAttachment
                    .input('MAILID', mailId)
                    .input('ATTACHMENTPATH', allFile[i].file || allFile[i].attachment_path)
                    .input('ATTACHMENTNAME', allFile[i].fileName || allFile[i].attachment_name || 'file name')
                    .input('USERNAME', user_name)
                    .execute(PROCEDURE_NAME.SYS_MAILATTACHMENT_CREATE_APP);
                if (!resInsertAttachment.recordset[0].RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, '', '!resInsertAttachment.recordset[0].RESULT');
                }
            }
        }
        // push thong bao mail neu k phai mail nhap o day
        if (mailId && !is_draft) {
            BULLMQ.push({
                type: 'email.send',
                payload: {
                    mail_id: mailId,
                    user_send: user_name,
                    flatform: flatform,
                    list_user: list_user,
                    list_department: list_department,
                    list_cc_user: list_cc_user,
                },
            });
        }

        await transaction.commit();
        return new ServiceResponse(
            true,
            '',
            is_draft ? ['Lưu nháp thành công', mailId] : ['Gửi mail thành công', mailId],
        );
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {function: 'mailService.createOrUpdate'});
        return new ServiceResponse(false, error.message);
    }
};

const toggleFlagged = async (user_name, mail_id) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('USERNAME', user_name)
            .input('MAILID', mail_id)
            .execute(PROCEDURE_NAME.SYS_MAILBOX_UPDATEFLAGGED_APP);
        return new ServiceResponse(true, '', RESPONSE_MSG.CRUD.UPDATE_SUCCESS);
    } catch (error) {
        logger.error(error, {function: 'mailService.toggleFlagged'});
        return new ServiceResponse(false, error.message);
    }
};

const deleteTrash = async (user_name, mail_id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('USERNAME', user_name)
            .input('MAILID', mail_id)
            .execute(PROCEDURE_NAME.SYS_MAILBOX_DELETETRASH_APP);
        if (!res.recordset[0].RESULT) return new ServiceResponse(false, 'Không tồn tại mail này trong thùng rác.');
        return new ServiceResponse(true, '', RESPONSE_MSG.CRUD.DELETE_SUCCESS);
    } catch (error) {
        logger.error(error, {function: 'mailService.deleteTrash'});
        return new ServiceResponse(false, error.message);
    }
};

const undoMailTrash = async (user_name, mail_id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('USERNAME', user_name)
            .input('MAILID', mail_id)
            .execute('SYS_MAILBOX_UndoMailTrash_App');
        if (!res.recordset[0].RESULT) return new ServiceResponse(false, 'Không tồn tại mail này trong thùng rác.');
        return new ServiceResponse(true, '', mail_id);
    } catch (error) {
        logger.error(error, {function: 'mailService.undoMailTrash'});
        return new ServiceResponse(false, error.message);
    }
};

const getDraftById = async (user_name, mail_id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('USERNAME', user_name)
            .input('MAILID', mail_id)
            .execute(PROCEDURE_NAME.SYS_MAIL_GETDRAFTBYID_APP);

        if (!res.recordset.length) return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);

        const mail = mailClass.detailDraft(res.recordsets[0][0]);
        const attachments = mailClass.attachment(res.recordsets[1]);
        attachments.forEach(el => {
            delete el.mail_id;
        });
        const list_user = res.recordsets[2].length ? res.recordsets[2] : [];
        const list_cc_user = res.recordsets[3].length ? res.recordsets[3] : [];
        const list_department = res.recordsets[4].length ? res.recordsets[4] : [];

        return new ServiceResponse(true, '', {
            ...mail,
            attachments,
            list_user: mailClass.listUserSend(list_user),
            list_cc_user: list_cc_user.map(el => el.USERNAME),
            list_department: list_department.map(el => el.DEPARTMENTID),
        });
    } catch (error) {
        logger.error(error, {function: 'mailService.getDraftById'});
        return new ServiceResponse(false, error.message);
    }
};

const deleteDraft = async (user_name, mail_id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('USERNAME', user_name)
            .input('MAILID', mail_id)
            .execute(PROCEDURE_NAME.SYS_MAIL_DELETEDRAFT_APP);
        return new ServiceResponse(true, '', RESPONSE_MSG.CRUD.DELETE_SUCCESS);
    } catch (error) {
        logger.error(error, {function: 'mailService.deleteDraft'});
        return new ServiceResponse(false, error.message);
    }
};

const getStatusIncomingMail = async user_name => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('USERNAME', user_name)
            .execute(PROCEDURE_NAME.SYS_MAIL_GETSTATUSINCOMINGMAIL_APP);
        return new ServiceResponse(true, '', {
            total_unread: res.recordsets[0][0].TOTALUNREAD,
            total_incoming_in_day: res.recordsets[1][0].TOTALINCOMINGINDAY,
        });
    } catch (error) {
        logger.error(error, {function: 'mailService.getStatusIncomingMail'});
        return new ServiceResponse(false, error.message);
    }
};

const getListUserView = async (query = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('MAILID', apiHelper.getValueFromObject(query, 'mailId'))
            .input('USERNAME', apiHelper.getValueFromObject(query, 'auth_name'))
            .execute('SYS_MAILBOX_GetListUserView_AdminWeb');
        const userView = mailClass.listUserView(data.recordset);
        return new ServiceResponse(true, '', userView);
    } catch (e) {
        logger.error(e, {function: 'mailService.getListUserView'});
        return new ServiceResponse(false, e.message);
    }
};

const getListMailNotRead = async (body, queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()

            .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('SYS_MAILBOX_GetCountMailNotRead_AdminWeb');
        const totalMailUnRead =
            data.recordsets[0] && data.recordsets[0].length ? data.recordsets[0][0].TOTALMAILUNREAD : 0;

        return new ServiceResponse(true, '', {
            count: totalMailUnRead,
        });
    } catch (error) {
        logger.error(error, {
            function: 'mailboxservice.getListMailNotRead',
        });
        console.error('mailboxservice.getListMailNotRead', error);
        return new ServiceResponse(false, error.message);
    }
};

const updateStatusAllMail = async (user_name) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', user_name)
            .execute('SYS_MAIL_UpdateStatusAllMail_App');

        if (data.rowsAffected[0] === 0) {
            return new ServiceResponse(false, 'No email were updated');
        }
        return new ServiceResponse(true, 'Update status all mail success', null);
    } catch (e) {
        logger.error(e, {function: 'mailService.updateStatusAllMail'});
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListTokenDeviceUser,
    getListInbox,
    deleteMail,
    getListSent,
    getListFlagged,
    getListDraft,
    getDraftById,
    deleteDraft,
    getListTrash,
    getById,
    createOrUpdate,
    toggleFlagged,
    deleteTrash,
    undoMailTrash,
    getStatusIncomingMail,
    getListUserView,
    getListMailNotRead,
    updateStatusAllMail,
};
