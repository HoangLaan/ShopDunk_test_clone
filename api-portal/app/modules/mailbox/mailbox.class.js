const Transform = require("../../common/helpers/transform.helper");
const config = require("../../../config/config");
const template = {
    mail_id: "{{#? MAILID}}",
    parent_id: "{{#? PARENTID}}",
    mail_subject: "{{#? MAILSUBJECT}}",
    mail_content: "{{#? MAILCONTENT}}",
    senddate: "{{#? SENDDATE}}",
    is_read: "{{ISREAD ? 1 : 0}}",
    is_flagged: "{{ISFLAGGED ? 1 : 0}}",
    is_attachment: "{{ISATTACHMENT ? 1 : 0}}",
    total_mail: "{{TOTALMAIL ? TOTALMAIL : 0}}",
    full_name: "{{#? SENDERFULLNAME}}",
    default_picture: [
        {
            "{{#if SENDERAVATAR}}": `${config.domain_cdn}{{SENDERAVATAR}}`,
        },
        {
            "{{#else}}": null,
        },
    ],
    user_receive: "{{#? SENDTO}}",
    create_user: "{{#? CREATEDUSER}}",
    is_send_by_me: "{{ISSENDBYME ? 1 : 0}}",

    //Them
    department_id: "{{#? DEPARTMENTID}}",
    department_name: "{{#? DEPARTMENTNAME}}",
    user_name: "{{#? USERNAME}}"
}

let transform = new Transform(template);

const listdepartment = (departments = []) => {
    return transform.transform(departments, ["department_id", "department_name"]);
};

const listuser = (users = []) => {
    const template = {
        user_name: "{{#? USERNAME}}",
        full_name: "{{#? FULLNAME}}",
    }
    const transform = new Transform(template);
    return transform.transform(users, ["user_name", "full_name"]);
};

const listusersendto = (mails = []) => {
    const template = {
        department_id: "{{#? DEPARTMENTID}}",
        department_name: "{{#? DEPARTMENTNAME}}",
        user_name: "{{#? USERNAME}}",
        full_name: "{{#? FULLNAME}}",
        sender: "{{#? SENDER}}",
    }
    const transform = new Transform(template);
    return transform.transform(mails, ["sender", "department_name", "full_name", "user_name", "department_id"]);
};

const listinbox = (mails = []) => {
    return transform.transform(mails, [
        "mail_id",
        "parent_id",
        "mail_subject",
        "mail_content",
        "senddate",
        "is_attachment",
        "is_read",
        "is_flagged",
        "full_name",
        "default_picture",
        "total_mail"
    ]);
};

const count_not_read = (users = []) => {
    const template = { count_not_read: "{{#? TOTALITEMS}}" }
    const transform = new Transform(template);
    return transform.transform(users, ["count_not_read"]);
};

const mailbox_send_to = (users = []) => {

    const templateMB = {
        mail_id: "{{#? MAILID}}",
        parent_id: "{{#? PARENTID}}",
        mail_subject: "{{#? MAILSUBJECT}}",
        mail_content: "{{#? MAILCONTENT}}",
        senddate: "{{#? SENDDATE}}",
        is_read: "{{ISREAD ? 1 : 0}}",
        is_send_to_all: "{{#? ISSENDTOALL}}",
        sender: "{{#? SENDER}}",
        picture_sender: [
            {
                "{{#if SENDERPICTURE}}": `${config.domain_cdn}{{SENDERPICTURE}}`,
            },
            {
                "{{#else}}": null,
            },
        ],
        user_name: "{{#? USERNAME}}",
        user_sender: "{{#? USERSENER}}",
        is_deleted: "{{#? ISDELETED}}",
        is_replyall: "{{#? ISREPLYALL}}",
        department_name: "{{#? DEPARTMENTNAME}}",
        full_name: "{{#? FULLNAME}}"
    }
    const transformMB = new Transform(templateMB);

    return transformMB.transform(users, [
        "mail_id",
        "parent_id",
        "is_send_to_all",
        "mail_subject",
        "mail_content",
        "senddate",
        "sender",
        "picture_sender",
        "user_name",
        "user_sender",
        "is_deleted",
        'is_replyall',
        "department_name",
        "full_name",
        "is_read"
    ]);
};

const list_attachment = (attachments = []) => {
    const template = {
        attachment_id: "{{#? MAILATTACHMENTID}}",
        attachment_name: "{{#? ATTACHMENTNAME}}",
        attachment_path: [
            {
                "{{#if ATTACHMENTPATH}}": `${config.domain_cdn}{{ATTACHMENTPATH}}`,
            },
            {
                "{{#else}}": null,
            },
        ],
    }
    const transform = new Transform(template);
    return transform.transform(attachments, ["attachment_id", "attachment_name", "attachment_path"]);
};
const user_draft = (users = []) => {
    return transform.transform(users, ["department_id", "user_name"]);
};

const listmailsend = (mails = []) => {
    return transform.transform(mails, [
        "mail_id",
        "parent_id",
        "mail_subject",
        "mail_content",
        "senddate",
        "is_attachment",
        "is_read",
        "is_flagged",
        "full_name",
        "default_picture",
        "total_mail",
        "user_receive",
        "is_send_by_me"
    ]);
};

const listmailflagged = (mails = []) => {
    return transform.transform(mails, [
        "mail_id",
        "parent_id",
        "mail_subject",
        "mail_content",
        "senddate",
        "is_attachment",
        "is_read",
        "is_flagged",
        "full_name",
        "default_picture",
        "total_mail",
        "create_user",
        "is_send_by_me"
    ]);
};

const listmaildraft = (mails = []) => {
    return transform.transform(mails, [
        "mail_id",
        "parent_id",
        "mail_subject",
        "mail_content",
        "senddate",
        "is_attachment",
        "is_read",
        "is_flagged",
        "full_name",
        "default_picture",
        "total_mail",
        "user_receive",
        "is_send_by_me"
    ]);
};

const listmailtrash = (mails = []) => {
    return transform.transform(mails, [
        "mail_id",
        "parent_id",
        "mail_subject",
        "mail_content",
        "senddate",
        "is_attachment",
        "is_read",
        "is_flagged",
        "full_name",
        "default_picture",
        "total_mail",
        "create_user",
        "is_send_by_me"
    ]);
};

module.exports = {
    listdepartment,
    listuser,
    listinbox,
    count_not_read,
    mailbox_send_to,
    list_attachment,
    user_draft,
    listusersendto,
    listmailsend,
    listmailflagged,
    listmaildraft,
    listmailtrash
};
