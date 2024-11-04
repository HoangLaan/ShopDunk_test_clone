const MailBoxClass = require("./mailbox.class");
const apiHelper = require("../../common/helpers/api.helper");
const mssql = require("../../models/mssql");
const sql = require("mssql");
const ServiceResponse = require("../../common/responses/service.response");
const logger = require("../../common/classes/logger.class");
const axios = require("axios");
const FormData = require("form-data");
const config = require("../../../config/config");
const BULLMQ = require("../../bullmq");
const fileHelper = require("../../common/helpers/file.helper");

const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        for (let i = 0; i < file.length; i++) {
            form.append("file", file[i].buffer, { filename: file[i].originalname });
        }
        axios
            .post(`${config.domain_cdn}/upload/file`, form, {
                headers: { ...form.getHeaders(), ...{ Authorization: `APIKEY ${config.upload_apikey}` } },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                let { response } = err;
                if (!response) {
                    throw err;
                }
                const { data } = response;
                reject(data.message || "Lỗi upload video!");
            });
    });
};

const getOptionDepartment = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute("HR_USER_SCHEDULE_GetOption_WebAdmin");
        const data_department = data.recordsets[2];
        const data_user = data.recordsets[4];

        const result = {
            data_department: MailBoxClass.listdepartment(data_department),
            data_user: MailBoxClass.listuser(data_user),
        };
        return new ServiceResponse(true, "", result);
    } catch (error) {
        logger.error(e, {
            function: "mailboxservice.getOptionDepartment",
        });

        return new ServiceResponse(true, "", {});
    }
};

// send new Email

const sendNewMail = async (body, file, auth, data_file) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const requestMail = new sql.Request(transaction);
        const resultMail = await requestMail
            .input("MAILID", apiHelper.getValueFromObject(body, "mail_id"))
            .input("PARENTID", apiHelper.getValueFromObject(body, "parent_id"))
            .input("ISSENDTOALL", apiHelper.getValueFromObject(body, "is_send_to_all"))
            .input("MAILSUBJECT", apiHelper.getValueFromObject(body, "mail_subject"))
            .input("MAILCONTENT", apiHelper.getValueFromObject(body, "mail_content"))
            .input("CREATEDUSER", apiHelper.getValueFromObject(auth, "user_name"))
            .execute("SYS_MAILBOX_CreateMail_WebAdmin");
        const mail_id = resultMail.recordset[0].RESULT;
        
        if (!mail_id) {
            await transaction.rollback();
        }
        if (body.is_send_to_all == 1) {
            checkSendToEmail(body, file, auth, mail_id, data_file);
        } else {
            // checkSendToEmail(body, file, auth, mail_id, 0,apiHelper.getValueFromObject(auth, "user_name"));
            let recipient_email = apiHelper.getValueFromObject(body, "recipient_email", [])

            const dataSend = [...recipient_email];
            for (let i = 0; i < dataSend.length; i++) {
                let department_id = 0;
                let user_name = "";
                const check_key = dataSend[i].value.split("-");
                if (check_key[0] == "PB") {
                    department_id = check_key[1];
                    checkSendToEmail(body, file, auth, mail_id, department_id, user_name, data_file);
                } else {
                    user_name = check_key[1];
                    checkSendToEmail(body, file, auth, mail_id, department_id, user_name, data_file);
                }
            }
        }

        // push thong bao mail neu k phai mail nhap o day
        if (mail_id) {
            BULLMQ.push({
                type: "email.send",
                payload: { mail_id, user_send: apiHelper.getValueFromObject(auth, "user_name") },
            });
        }

        await transaction.commit();
        return new ServiceResponse(true, "", {});
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: "mailboxservice.sendNewMail",
        });
        console.error("mailboxservice.sendNewMail", error);
        return new ServiceResponse(false, e.message);
    }
};

const checkSendToEmail = async (body, file, auth, mail_id, department_id, user_name, data_file) => {

    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        // tạo mail user nếu kiểu gửi mail không phải gửi cho tất cả
        if (body.is_send_to_all == 0) {

            const requestMailUser = new sql.Request(transaction);
            const resultMailUser = await requestMailUser
                .input("MAILID", mail_id)
                .input("MAILUSERID", apiHelper.getValueFromObject(body, "mailuser_id"))
                .input("DEPARTMENTID", department_id ? department_id : "")
                .input("USERNAME", user_name ? user_name : "")
                .input("SENDTYPE", apiHelper.getValueFromObject(body, "send_type"))
                .execute("SYS_MAILBOX_CreateMailUser_WebAdmin");
            const mailuser_id = resultMailUser.recordset[0].RESULT;

            if (!mailuser_id) {
                await transaction.rollback();
            }
        }
        // tạo mail box hoac up date mail box
        const requestMailBox = new sql.Request(transaction);
        const resultMailBox = await requestMailBox
            .input("MAILID", mail_id)
            .input("USERNAME", apiHelper.getValueFromObject(auth, "user_name"))
            .input("ISREAD", apiHelper.getValueFromObject(body, "is_read"))
            .input("ISDELETED", apiHelper.getValueFromObject(body, "is_deleted"))
            .input("ISFORCEDELETED", apiHelper.getValueFromObject(body, "is_forcedeleted"))
            .input("ISFLAGGED", apiHelper.getValueFromObject(body, "is_flagged"))
            .input("ISDRAFT", apiHelper.getValueFromObject(body, "is_draft"))
            .input("CREATEDUSER", apiHelper.getValueFromObject(auth, "user_name"))
            .execute("SYS_MAILBOX_CreateMailBox_WebAdmin");
        const mailbox_id = resultMailBox.recordset[0].RESULT;
        if (!mailbox_id) {
            await transaction.rollback();
        }
        const requestAttachment_DEL = new sql.Request(transaction);
        const resultAttachment_DEL = await requestAttachment_DEL
            .input("MAILID", mail_id)
            .input("USERNAME", apiHelper.getValueFromObject(auth, "user_name"))
            .execute("SYS_MAILBOX_DeleteAttachment_WebAdmin");
        const id_delete = resultAttachment_DEL.recordset[0].RESULT;
        if (!id_delete) {
            await transaction.rollback();
        }

        // upload file có sẵn
        if (body.save_fileattachment && body.save_fileattachment.length > 0) {
            const requestAtt = new sql.Request(transaction);
            for (let i = 0; i < body.save_fileattachment.length; i++) {
                const resultAtt = await requestAtt
                    .input("MAILID", mail_id)
                    .input("MAILATTACHMENTID", body.save_fileattachment[i].attachment_id)
                    .input(
                        "ATTACHMENTPATH",
                        body.save_fileattachment[i].attachment_path.split(config.domain_cdn)[1]
                    )
                    .input("ATTACHMENTNAME", body.save_fileattachment[i].attachment_name)
                    .input("USERNAME", apiHelper.getValueFromObject(auth, "user_name"))
                    .execute("SYS_MAILBOX_CreateAttachment_WebAdmin");
                const att_id = resultAtt.recordset[0].RESULT;

                if (!att_id) {
                    await transaction.rollback();
                }
            }
        }
        // upload file đính kèm nếu như có file

        if (file && file.length > 0) {
            // xoá file đính kèm trước đó
            const response = await uploadFile(file);
            const requestAttachment = new sql.Request(transaction);
            for (let i = 0; i < response.data.length; i++) {
                const resultAttachment = await requestAttachment
                    .input("MAILID", mail_id)
                    .input("USERNAME", apiHelper.getValueFromObject(auth, "user_name"))
                    .input("ATTACHMENTPATH", response.data[i].file)
                    .input("ATTACHMENTNAME", data_file[i].attachment_name)
                    .execute("SYS_MAILBOX_CreateAttachment_WebAdmin");
                const attachment_id = resultAttachment.recordset[0].RESULT;

                if (!attachment_id) {
                    await transaction.rollback();
                }
            }
        }
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: "mailboxservice.sendNewMail",
        });
        console.error("mailboxservice.sendNewMail", error);
        return new ServiceResponse(false, error);
    }
};

// tạo hoặc update mail
const createOrUpdateMailBox = async (body) => {
    // const transaction = await new sql.Transaction(pool);
    try {
        // await transaction.begin();
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input("MAILID", apiHelper.getValueFromObject(body, "mail_id"))
            .input("USERNAME", apiHelper.getValueFromObject(body, "auth_name"))
            .input("ISREAD", apiHelper.getValueFromObject(body, "is_read"))
            .input("ISDELETED", apiHelper.getValueFromObject(body, "is_deleted"))
            .input("ISFORCEDELETED", apiHelper.getValueFromObject(body, "is_forcedeleted"))
            .input("ISFLAGGED", apiHelper.getValueFromObject(body, "is_flagged"))
            .input("ISDRAFT", apiHelper.getValueFromObject(body, "is_draft"))
            .input("CREATEDUSER", apiHelper.getValueFromObject(body, "auth_name"))
            .execute("SYS_MAILBOX_CreateMailBox_WebAdmin");
        const mailbox_id = data.recordset[0].RESULT;
        if (!mailbox_id) {
            return new ServiceResponse(false, "Đã xảy ra lỗi", {});
        }
        return new ServiceResponse(true, "", mailbox_id);
    } catch (error) {
        logger.error(error, {
            function: "mailboxservice.createOrUpdateMailBox",
        });
        console.error("mailboxservice.createOrUpdateMailBox", error);
        return new ServiceResponse(false, error.message);
    }
};
// list mail đến
const getListInbox = async (body, queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input("PAGESIZE", itemsPerPage)
            .input("PAGEINDEX", currentPage)
            .input("KEYWORD", apiHelper.getValueFromObject(queryParams, "keyword"))
            .input("USERNAME", apiHelper.getValueFromObject(body, "auth_name"))
            .execute("SYS_MAILBOX_GetListMailInbox_AdminWeb");
        const result = MailBoxClass.listinbox(data.recordsets[0]);
        const totalMailUnRead = data.recordsets[1] && data.recordsets[1].length ? data.recordsets[1][0].TOTALMAILUNREAD : 0

        return new ServiceResponse(true, "", {
            items: result,
            page: currentPage,
            itemsPerPage: itemsPerPage,
            totalItems: apiHelper.getTotalData(data.recordset),
            count: totalMailUnRead,
        });
    } catch (error) {
        logger.error(error, {
            function: "mailboxservice.getListInbox",
        });
        console.error("mailboxservice.getListInbox", error);
        return new ServiceResponse(false, e.message);
    }
};

const getListMailNotRead = async (body, queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()

            .input("USERNAME", apiHelper.getValueFromObject(body, "auth_name"))
            .execute("SYS_MAILBOX_GetCountMailNotRead_AdminWeb");
        const totalMailUnRead = data.recordsets[0] && data.recordsets[0].length ? data.recordsets[0][0].TOTALMAILUNREAD : 0

        return new ServiceResponse(true, "", {
            count: totalMailUnRead,
        });
    } catch (error) {
        logger.error(error, {
            function: "mailboxservice.getListMailNotRead",
        });
        console.error("mailboxservice.getListMailNotRead", error);
        return new ServiceResponse(false, error.message);
    }
};

// list mail trong thùng rác
const getListMailTrash = async (body, queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input("PAGESIZE", itemsPerPage)
            .input("PAGEINDEX", currentPage)
            .input("KEYWORD", apiHelper.getValueFromObject(queryParams, "keyword"))
            .input("USERNAME", apiHelper.getValueFromObject(body, "auth_name"))
            .execute("SYS_MAILBOX_GetListMailTrash_AdminWeb");
        const mails = MailBoxClass.listmailtrash(data.recordset);
        return new ServiceResponse(true, "", {
            items: mails,
            page: currentPage,
            itemsPerPage: itemsPerPage,
            totalItems: apiHelper.getTotalData(data.recordset),
        });
    } catch (error) {
        logger.error(error, {
            function: "mailboxservice.getListMailTrash",
        });
        console.error("mailboxservice.getListMailTrash", error);
        return new ServiceResponse(false, e.message);
    }
};

// list mail gửi đi
const getListMailSendTo = async (body, queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input("PAGESIZE", itemsPerPage)
            .input("PAGEINDEX", currentPage)
            .input("KEYWORD", apiHelper.getValueFromObject(queryParams, "keyword"))
            .input("USERNAME", apiHelper.getValueFromObject(body, "auth_name"))
            .execute("SYS_MAILBOX_GetListMailSendTo_AdminWeb");
        const mails = MailBoxClass.listmailsend(data.recordsets[0]);
        return new ServiceResponse(true, "", {
            items: mails,
            page: currentPage,
            limit: itemsPerPage,
            itemsPerPage: itemsPerPage,
            totalItems: apiHelper.getTotalData(data.recordset),
        });
    } catch (error) {
        logger.error(error, {
            function: "mailboxservice.getListMailSendTo",
        });
        console.error("mailboxservice.getListMailSendTo", error);
        return new ServiceResponse(false, e.message);
    }
};

// list mail nháp
const getListMailDraft = async (body, queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input("PAGESIZE", itemsPerPage)
            .input("PAGEINDEX", currentPage)
            .input("KEYWORD", apiHelper.getValueFromObject(queryParams, "keyword"))
            .input("USERNAME", apiHelper.getValueFromObject(body, "auth_name"))
            .execute("SYS_MAILBOX_GetListMailDraft_AdminWeb");
        const mails = MailBoxClass.listmaildraft(data.recordsets[0]);
        return new ServiceResponse(true, "", {
            items: mails,
            page: currentPage,
            itemsPerPage: itemsPerPage,
            totalItems: apiHelper.getTotalData(data.recordset),
        });
    } catch (error) {
        logger.error(error, {
            function: "mailboxservice.getListMailDraft",
        });
        console.error("mailboxservice.getListMailDraft", error);
        return new ServiceResponse(false, e.message);
    }
};
// list mail đánh dấu
const getListMailFlagged = async (body, queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input("PAGESIZE", itemsPerPage)
            .input("PAGEINDEX", currentPage)
            .input("KEYWORD", apiHelper.getValueFromObject(queryParams, "keyword"))
            .input("USERNAME", apiHelper.getValueFromObject(body, "auth_name"))
            .execute("SYS_MAILBOX_GetListMailFlagged_AdminWeb");
        const mails = MailBoxClass.listmailflagged(data.recordsets[0]);
        return new ServiceResponse(true, "", {
            items: mails,
            page: currentPage,
            itemsPerPage: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
            totalItems: apiHelper.getTotalData(data.recordset),
        });
    } catch (error) {
        logger.error(error, {
            function: "mailboxservice.getListMailFlagged",
        });
        console.error("mailboxservice.getListMailFlagged", error);
        return new ServiceResponse(false, e.message);
    }
};

// detail read mail
const getDetailMailSendTo = async (body, mail_id) => {

    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input("MAILID", mail_id)
            .input("USERNAME", apiHelper.getValueFromObject(body, "auth_name"))
            .execute("SYS_MAILBOX_GetDetailMail_WebAdmin");
        let res = MailBoxClass.mailbox_send_to(data.recordsets[0][0]);
        let resultparent = [];
        const resultchild = MailBoxClass.mailbox_send_to(data.recordsets[1]);

        ///tên người nhận trong chi tiết
        const dataListUser = await pool
            .request()
            .input("MAILID", apiHelper.getValueFromObject(res, "mail_id"))
            .execute("SYS_MAILBOX_GetListUserMailSend_WebAdmin");
        res.resListUser = "";
        res.resListUserFull = "";
        res.resListUserToolTip = "";


        if (res.is_send_to_all == true) {
            res.arrUser = [];
            res.arrUserInsert = [];
        } else {
            res.arrUser = [res.full_name];
            res.arrUserInsert = [{ key: `USER-${res.user_name}` }];
        }
        res.replyDefault = [res.sender];
        res.userReplyDefault = { key: `USER-${res.user_name}` };
        res.userNameReplyDefault = res.user_name;
        let resListUser = MailBoxClass.listusersendto(dataListUser.recordsets[0]);

        if (resListUser.length == 0) {
            res.resListUser = "Tất cả mọi người ";
            res.resListUserToolTip = "Tất cả mọi người ";
        }
        if (resListUser.length == 0) {
            res.arrUser.push("sendAll");
        }
        for (let index = 0; index < resListUser.length; index++) {
            const element = resListUser[index];
            res.arrUser.push(element.department_name ? element.department_name : element.full_name);

            res.arrUserInsert.push({
                key: element.department_id ? `PB-${element.department_id}` : `USER-${element.user_name}`,
            });
            const found = resListUser.find((element) => element.department_name);
            if (found && resListUser.length >= 2) {
                res.resListUser = `${resListUser[0].department_name}, ${resListUser[1].department_name != null ? resListUser[1].department_name : resListUser[1].sender}...  `;
                res.resListUserFull = `${res.resListUserFull} ${element.department_name ? element.department_name : element.sender}, `;
                res.resListUserToolTip = res.resListUserToolTip + `${resListUser[index].department_name != null ? resListUser[index].department_name : resListUser[index].sender}` + ", ";

            } else if (found) {
                res.resListUser = res.resListUser + element.department_name + ", ";
            } else if (resListUser.length > 2) {
                res.resListUser = resListUser[0].sender + ", " + resListUser[1].sender + ` và ${resListUser.length - 2} người khác nữa.  `;
                res.resListUserToolTip = res.resListUserToolTip + resListUser[index].sender + ", ";
                if (element != resListUser[0] && element != resListUser[1]) {
                    res.resListUserFull = res.resListUserFull + element.sender + ", ";
                }
            } else {
                res.resListUser = res.resListUser + element.sender + ", ";
                res.resListUserToolTip = res.resListUserToolTip + element.sender + ", ";
            }
        }
        // Lọc các phần tử user có String giống nhau
        res.arrUser = Array.from(new Set([...res.arrUser]));
        // Lọc các user có trùng key
        res.arrUserInsert = res.arrUserInsert.filter((v, i, a) => a.findIndex(v2 => (v2.key == v.key)) == i)
        resultparent.push(res);

        if (resultparent.length > 0) {
            for (let i = 0; i < 1; i++) {
                const poolattachment = await mssql.pool;
                const data_attachment = await poolattachment
                    .request()
                    .input("MAILID", resultparent[i].mail_id)
                    .execute("SYS_MAILBOX_GetListFileAttachment_WebAdmin");
                resultparent[i].data_attachment = MailBoxClass.list_attachment(data_attachment.recordset);
            }
        }
        for (let i = 0; i < resultchild.length; i++) {
            resultchild[i].arrUser = res.arrUser;
            resultchild[i].arrUserInsert = res.arrUserInsert;
            resultchild[i].is_send_to_all = res.is_send_to_all;
            if (
                resultparent[0].user_name == resultchild[i].user_name ||
                body.auth_name == resultchild[i].user_name ||
                resultchild[i].is_replyall == true
            ) {
                ///tên người nhận trong chi tiết
                const dataListUser = await pool
                    .request()
                    .input("MAILID", apiHelper.getValueFromObject(resultchild[i], "mail_id"))
                    .execute("SYS_MAILBOX_GetListUserMailSend_WebAdmin");
                resultchild[i].resListUser = "";
                resultchild[i].resListUserFull = "";
                resultchild[i].resListUserToolTip = "";
                resultchild[i].replyDefault = [res.sender];
                resultchild[i].userReplyDefault = { key: `USER-${res.user_name}` };
                resultchild[i].userNameReplyDefault = res.user_name;
                let resListUser = MailBoxClass.listusersendto(dataListUser.recordsets[0]);

                if (resListUser.length == 0) {
                    resultchild[i].resListUser = "Tất cả mọi người  ";
                    resultchild[i].resListUserToolTip = "Tất cả mọi người  ";
                }

                // Danh sách người nhận của những mail con 
                for (let index = 0; index < resListUser.length; index++) {
                    const element = resListUser[index];
                    // Tìm xem trong danh sách user có trùng phòng ban hay không
                    const found = resListUser.find((element) => element.department_name);

                    if (found && resListUser.length >= 2) {
                        resultchild[i].resListUser = `${resListUser[0].department_name}, ${resListUser[1].department_name != null ? resListUser[1].department_name : resListUser[1].sender}...  `;
                        resultchild[i].resListUserFull = `${resultchild[i].resListUserFull} ${element.department_name ? element.department_name : element.sender}, `;
                        resultchild[i].resListUserToolTip = resultchild[i].resListUserToolTip + `${resListUser[index].department_name != null ? resListUser[index].department_name : resListUser[index].sender}` + ", "

                    } else if (found) {
                        resultchild[i].resListUser = resultchild[i].resListUser + element.department_name + ", ";
                        resultchild[i].resListUserToolTip = resultchild[i].resListUserToolTip + element.department_name + ", ";

                    } else if (resListUser.length > 2) {
                        resultchild[i].resListUser = resListUser[0].sender + ", " + resListUser[1].sender + ` và ${resListUser.length - 2} người khác nữa.  `;
                        resultchild[i].resListUserToolTip = resultchild[i].resListUserToolTip + element.sender + ", ";

                        if (element != resListUser[0] && element != resListUser[1]) {
                            resultchild[i].resListUserFull = resultchild[i].resListUserFull + element.sender + ", ";
                        }
                    } else {
                        resultchild[i].resListUser = resultchild[i].resListUser + element.sender + ", ";
                        resultchild[i].resListUserToolTip = resultchild[i].resListUserToolTip + element.sender + ", ";
                    }
                }

                const poolattachment_child = await mssql.pool;
                const data_attachment_child = await poolattachment_child
                    .request()
                    .input("MAILID", resultchild[i].mail_id)
                    .execute("SYS_MAILBOX_GetListFileAttachment_WebAdmin");
                resultchild[i].data_attachment = MailBoxClass.list_attachment(
                    data_attachment_child.recordset
                );
                resultparent.push(resultchild[i]);
            } else if (
                resultparent[0].user_name == body.auth_name ||
                resultchild[i].mailbox_send_to == true
            ) {
                const poolattachment_child = await mssql.pool;
                const data_attachment_child = await poolattachment_child
                    .request()
                    .input("MAILID", resultchild[i].mail_id)
                    .execute("SYS_MAILBOX_GetListFileAttachment_WebAdmin");
                resultchild[i].data_attachment = MailBoxClass.list_attachment(
                    data_attachment_child.recordset
                );
                resultparent.push(resultchild[i]);
            } else {
                resultparent.push(resultchild[i]);
            }
        }

        for (let index = 0; index < resultparent.length; index++) {
            const element = resultparent[index];
            if (!element.resListUser) {
                element.resListUser = `${resultparent[0].sender}, `;
                element.resListUserToolTip = `${resultparent[0].sender}, `;

            }
            if (element.resListUser.includes(" - ,")) {
                element.resListUser = "Tất cả mọi người  ";
                element.resListUserToolTip = "Tất cả mọi người  ";

            }
        }
        return new ServiceResponse(true, "", {
            infoMail: MailBoxClass.mailbox_send_to(data.recordsets[0][0]),
            dataMailDetail: resultparent
        });
    } catch (error) {
        logger.error(error, {
            function: "mailboxservice.getListMailFlagged",
        });
        console.error("mailboxservice.getListMailFlagged", error);
        return new ServiceResponse(false, e.message);
    }
};

const sendMailReply = async (body, file, auth, data_file) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        const requestMail = new sql.Request(transaction);
        // tạo mail mới kèm theo paren id
        const resultMail = await requestMail
            .input("PARENTID", apiHelper.getValueFromObject(body, "parent_id"))
            .input("ISSENDTOALL", apiHelper.getValueFromObject(body, "is_send_to_all"))
            .input("MAILSUBJECT", apiHelper.getValueFromObject(body, "mail_subject"))
            .input("MAILCONTENT", apiHelper.getValueFromObject(body, "mail_content"))
            .input("CREATEDUSER", apiHelper.getValueFromObject(auth, "user_name"))
            .input("ISREPLYALL", apiHelper.getValueFromObject(body, "isReplyAll") == true ? 1 : 0)
            .execute("SYS_MAILBOX_CreateMail_WebAdmin");
        const mail_id = resultMail.recordset[0].RESULT;
        if (!mail_id) {
            await transaction.rollback();
        }
        for (let index = 0; index < apiHelper.getValueFromObject(body, "optionSelectedSend").length; index++) {
            const element = apiHelper.getValueFromObject(body, "optionSelectedSend")[index];

            let checkKey = element.key.split("-");
            //   console.log(checkKey)
            const requestMailUser = new sql.Request(transaction);
            await requestMailUser
                .input("MAILID", mail_id)
                .input("MAILUSERID", apiHelper.getValueFromObject(body, "mailuser_id"))
                .input("DEPARTMENTID", checkKey[0] == "PB" ? checkKey[1] : 0)
                .input("USERNAME", checkKey[0] == "USER" ? checkKey[1] : 0)
                .input("SENDTYPE", apiHelper.getValueFromObject(body, "send_type"))

                .execute("SYS_MAILBOX_CreateMailUser_WebAdmin");
        }

        let user_reply = null;

        if (body.user_name_reply == auth.user_name) {
            user_reply = body.user_sender;
        } else {
            user_reply = auth.user_name;
        }
        // update lại trạng thái chưa đọc của người được reply
        const requestMailBox = new sql.Request(transaction);
        const resultMailBox = await requestMailBox
            .input("MAILID", mail_id)
            .input("USERNAME", user_reply)
            .input("ISREAD", 1)
            .input("ISDELETED", apiHelper.getValueFromObject(body, "is_deleted"))
            .input("ISFORCEDELETED", apiHelper.getValueFromObject(body, "is_forcedeleted"))
            .input("ISFLAGGED", apiHelper.getValueFromObject(body, "is_flagged"))
            .input("ISDRAFT", apiHelper.getValueFromObject(body, "is_draft"))
            .input("CREATEDUSER", apiHelper.getValueFromObject(auth, "user_name"))
            .execute("SYS_MAILBOX_CreateMailBox_WebAdmin");
        const mailbox_id = resultMailBox.recordset[0].RESULT;

        if (file.length > 0) {
            const response = await uploadFile(file);
            for (let i = 0; i < response.data.length; i++) {
                const requestAttachment = new sql.Request(transaction);
                const resultAttachment = await requestAttachment
                    .input("MAILID", mail_id)
                    .input("USERNAME", apiHelper.getValueFromObject(auth, "user_name"))
                    .input("ATTACHMENTPATH", response.data[i].file)
                    .input("ATTACHMENTNAME", data_file[i].attachment_name) // Do tên của file khi truyền qua Multer sẽ bị lỗi UTF8 nên cần 1 mảng lưu tên file tương ứng với mảng các file
                    .execute("SYS_MAILBOX_CreateAttachment_WebAdmin");
                const attachment_id = resultAttachment.recordset[0].RESULT;
                if (!attachment_id) {
                    await transaction.rollback();
                }
            }
        }
        // push thong bao mail neu k phai mail nhap o day
        if (mail_id) {
            // console.log("push thong bao", mail_id);
            BULLMQ.push({
                type: "email.send",
                payload: { mail_id, user_send: apiHelper.getValueFromObject(auth, "user_name") },
            });
        }

        await transaction.commit();
        return new ServiceResponse(true, "", { mail_id: mail_id });
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: "mailboxservice.sendMailReply",
        });
        console.error("mailboxservice.sendMailReply", error);
        return new ServiceResponse(false, error.message);
    }
};

// get detail mail draft
const getdetailMailDraft = async (body, mail_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input("MAILID", mail_id)
            .execute("SYS_MAILBOX_GetDetailMailDraft_WedAdmin");

        const result = {
            data_detail: MailBoxClass.listinbox(data.recordsets[0][0]),
            data_user: MailBoxClass.user_draft(data.recordsets[1]),
            list_attachment: MailBoxClass.list_attachment(data.recordsets[2]),
        };
        return new ServiceResponse(true, "", result);
    } catch (error) {
        logger.error(error, {
            function: "mailboxservice.getListMailFlagged",
        });
        console.error("mailboxservice.getListMailFlagged", error);
        return new ServiceResponse(false, e.message);
    }
};

const deleteMailSelect = async (body) => {
    try {
        const dataDeleteMail = body.dataDeleteMail;
        for (let i = 0; i < dataDeleteMail.length; i++) {
            await deleteMail(body, dataDeleteMail[i].mail_id);
        }
        return new ServiceResponse(true, "");
    } catch (error) {
        logger.error(error, {
            function: "mailboxservice.deleteMailSelect",
        });
        console.error("mailboxservice.deleteMailSelect", error);
        return new ServiceResponse(false, e.message);
    }
};

// xoa vinh vien mail da chon

const fordeleteMailSelect = async (body) => {
    try {
        const dataDeleteMail = body.dataDeleteMail;
        for (let i = 0; i < dataDeleteMail.length; i++) {
            deleteMail(body, dataDeleteMail[i].mail_id, true);
        }
        return new ServiceResponse(true, "");
    } catch (error) {
        logger.error(error, {
            function: "mailboxservice.deleteMailSelect",
        });
        console.error("mailboxservice.deleteMailSelect", error);
        return new ServiceResponse(false, e.message);
    }
};

// delete mail
const deleteMail = async (body, mail_id, is_forcedeleted = false) => {
    const pool = await mssql.pool;
    try {
        await pool
            .request()
            .input("MAILID", mail_id)
            .input("USERNAME", apiHelper.getValueFromObject(body, "auth_name"))
            .input('ISFORCEDELETED', is_forcedeleted)
            .execute("SYS_MAILBOX_DeleteMailTrash_AdminWeb");
        return new ServiceResponse(true, "ok");
    } catch (error) {
        logger.error(error, {
            function: "mailboxservice.deleteMail",
        });
        console.error("mailboxservice.deleteMail", error);
        return new ServiceResponse(false, e.message);
    }
};

const forceDeleteMail = async (body, mail_id) => {
    const pool = await mssql.pool;
    try {
        const data = await pool
            .request()
            .input("MAILID", mail_id)
            .input("USERNAME", apiHelper.getValueFromObject(body, "auth_name"))
            .execute("SYS_MAILBOX_GetDetailMail_WebAdmin");
        const resultparent = MailBoxClass.mailbox_send_to(data.recordsets[0]);
        const resultchild = MailBoxClass.mailbox_send_to(data.recordsets[1]);
        for (let i = 0; i < resultparent.length; i++) {
            await pool
                .request()
                .input("MAILID", resultparent[i].mail_id)
                .input("USERNAME", apiHelper.getValueFromObject(body, "auth_name"))
                .execute("SYS_MAILBOX_ForcedeleteMail_WebAdmin");
        }
        for (let i = 0; i < resultchild.length; i++) {
            await pool
                .request()
                .input("MAILID", resultchild[i].mail_id)
                .input("USERNAME", apiHelper.getValueFromObject(body, "auth_name"))
                .execute("SYS_MAILBOX_ForcedeleteMail_WebAdmin");
        }

        return new ServiceResponse(true, "");
    } catch (error) {
        logger.error(error, {
            function: "mailboxservice.deleteMail",
        });
        console.error("mailboxservice.deleteMail", error);

        return new ServiceResponse(false, e.message);
    }
};
// undo mail
const undoMail = async (body, mail_id) => {
    const pool = await mssql.pool;
    try {
        const data = await pool
            .request()
            .input("MAILID", mail_id)
            .input("USERNAME", apiHelper.getValueFromObject(body, "auth_name"))
            .execute("SYS_MAILBOX_GetDetailMail_WebAdmin");
        const resultparent = MailBoxClass.mailbox_send_to(data.recordsets[0]);
        const resultchild = MailBoxClass.mailbox_send_to(data.recordsets[1]);
        for (let i = 0; i < resultparent.length; i++) {
            await pool
                .request()
                .input("MAILID", resultparent[i].mail_id)
                .input("USERNAME", apiHelper.getValueFromObject(body, "auth_name"))
                .execute("SYS_MAILBOX_UndoMailTrash_WebAdmin");
        }
        for (let i = 0; i < resultchild.length; i++) {
            await pool
                .request()
                .input("MAILID", resultchild[i].mail_id)
                .input("USERNAME", apiHelper.getValueFromObject(body, "auth_name"))
                .execute("SYS_MAILBOX_UndoMailTrash_WebAdmin");
        }

        return new ServiceResponse(true, "");
    } catch (error) {
        logger.error(error, {
            function: "mailboxservice.undoMail",
        });
        console.error("mailboxservice.undoMail", error);
        return new ServiceResponse(false, e.message);
    }
};

const saveFile = async (base64, folderNameImg) => {
    let url = null;
    try {
        if (fileHelper.isBase64(base64)) {
            const extension = fileHelper.getExtensionFromBase64(base64);
            const d = new Date();
            const nameFile = String(d.getDay().toString()) + d.getMonth().toString() + d.getFullYear().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString() + d.getMilliseconds().toString();
            url = await fileHelper.saveBase64(folderNameImg, base64, `${nameFile}.${extension}`);
        } else {
            url = base64.split(config.domain_cdn)[1];
        }
    } catch (e) {
        logger.error(e, { 'function': 'uploadFile.saveFile' });
        return new ServiceResponse(false, '', url);
    }
    if (url === '') {
        return new ServiceResponse(false, '', url);
    }
    return new ServiceResponse(true, '', `${config.domain_cdn}${url}`);
};

const restoreMailMany = async (body) => {
    const pool = await mssql.pool;
    const ids = body.ids
    try {
        await pool
            .request()
            .input('IDLIST', ids)
            .execute("SYS_MAILBOX_RestoreMailTrash_WebAdmin")
        return new ServiceResponse(true, "");
    } catch (error) {
        logger.error(error, {
            function: "mailboxservice.restoreMailMany",
        });
        console.error("mailboxservice.restoreMailMany", error);
        return new ServiceResponse(false, error.message);
    }
}

module.exports = {
    getOptionDepartment,
    sendNewMail,
    createOrUpdateMailBox,
    getListInbox,
    getListMailTrash,
    getListMailSendTo,
    getListMailDraft,
    getListMailFlagged,
    getDetailMailSendTo,
    sendMailReply,
    getdetailMailDraft,
    deleteMailSelect,
    deleteMail,
    forceDeleteMail,
    fordeleteMailSelect,
    undoMail,
    getListMailNotRead,
    saveFile,
    restoreMailMany
};
