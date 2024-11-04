const SingleResponse = require('../../common/responses/single.response');
const optionService = require('../../common/services/options.service');
const ListResponse = require('../../common/responses/list.response');
const MailboxService = require('./mailbox.service');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');


/**
 * Get option
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */

const getOptionDepartment = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_DEPARTMENT', req.query);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionUser = async (req, res, next) => {
    try {
        const serviceRes = await optionService('SYS_USER', req.query);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

// send Email 
const sendNewEmail = async (req, res, next) => {
    try {
        const serviceRes = await MailboxService.sendNewMail(JSON.parse(req.body.data), req.files, req.auth, JSON.parse(req.body.data_file));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListInbox = async (req, res, next) => {
    try {
        const serviceRes = await MailboxService.getListInbox(req.body, req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const getListMailNotRead = async (req, res, next) => {
    try {
        const serviceRes = await MailboxService.getListMailNotRead(req.body, req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

// update mail box
const createOrUpdateMailBox = async (req, res, next) => {
    try {
        const serviceRes = await MailboxService.createOrUpdateMailBox(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
// list mail trash
const getListMailTrash = async (req, res, next) => {

    try {
        const serviceRes = await MailboxService.getListMailTrash(req.body, req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}
// list mail send to
const getListMailSendTo = async (req, res, next) => {

    try {
        const serviceRes = await MailboxService.getListMailSendTo(req.body, req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}
// list mail draft
const getListMailDraft = async (req, res, next) => {
    try {
        const serviceRes = await MailboxService.getListMailDraft(req.body, req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}
// list mail đánh dấu
const getListMailFlagged = async (req, res, next) => {
    try {
        const serviceRes = await MailboxService.getListMailFlagged(req.body, req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

// get detail mail
const getDetailMailSendTo = async (req, res, next) => {
    try {
        const mailbox_id = req.params.mailbox_id;
        const serviceRes = await MailboxService.getDetailMailSendTo(req.body, mailbox_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {

    }
}

// upload file đính kèm


const sendMailReply = async (req, res, next) => {
    try {
        const serviceRes = await MailboxService.sendMailReply(JSON.parse(req.body.data), req.files, req.auth, JSON.parse(req.body.data_file));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getdetailMailDraft = async (req, res, next) => {
    try {
        const mailbox_id = req.params.mailbox_id;
        const serviceRes = await MailboxService.getdetailMailDraft(req.body, mailbox_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {

    }
}

// delete mail select
const deleteMailSelect = async (req, res, next) => {
    try {
        const serviceRes = await MailboxService.deleteMailSelect(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}
const forceDeleteMailSelect = async (req, res, next) => {
    try {
        const mail_id = req.params.mailbox_id;
        const serviceRes = await MailboxService.deleteMail(req.body, mail_id, true);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}
// delete mail
const deleteMail = async (req, res, next) => {
    try {
        const mail_id = req.params.mailbox_id;
        const serviceRes = await MailboxService.deleteMail(req.body, mail_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}
// xoa mail vinh vien 
const forceDeleteMail = async (req, res, next) => {
    try {
        const mail_id = req.params.mailbox_id;
        const serviceRes = await MailboxService.forceDeleteMail(req.body, mail_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

// delete mail
const undoMail = async (req, res, next) => {
    try {
        const mail_id = req.params.mailbox_id;
        const serviceRes = await MailboxService.undoMail(req.body, mail_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}


const uploadFile = async (req, res, next) => {
    try {
        const base64 = req.body.base64;
        const folder = req.body.folder;
        const serviceRes = await MailboxService.saveFile(base64, folder);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        if (serviceRes.getData() === '') {
            return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.UPLOADFILE.e));
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.UPLOADFILE.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const restoreMailMany = async (req, res, next) => {
    try {
        const serviceRes = await MailboxService.restoreMailMany(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}


module.exports = {
    getOptionDepartment,
    sendNewEmail,
    getListInbox,
    createOrUpdateMailBox,
    getListMailSendTo,
    getListMailTrash,
    getListMailDraft,
    getListMailFlagged,
    getDetailMailSendTo,
    sendMailReply,
    getdetailMailDraft,
    deleteMailSelect,
    deleteMail,
    forceDeleteMail,
    forceDeleteMailSelect, 
    undoMail, 
    getOptionUser, 
    getListMailNotRead,
    uploadFile,
    restoreMailMany
};
