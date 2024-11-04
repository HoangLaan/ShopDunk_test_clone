const Transform = require("../../common/helpers/transform.helper");
const config = require("../../../config/config");

const template = {
    mail_id: "{{#? MAILID}}",
    mail_subject: "{{#? MAILSUBJECT}}",
    mail_content: "{{#? MAILCONTENT}}",
    send_date: "{{#? SENDDATE}}",
    total_user_view: "{{TOTALUSERVIEW ? TOTALUSERVIEW : 0}",
    is_flagged: "{{ISFLAGGED ? 1 : 0}}",
    is_send_to_all: "{{ISSENDTOALL ? 1 : 0}}",
    is_read: "{{ISREAD ? 1 : 0}}",
    total_user_view: "{{TOTALUSERVIEW ? TOTALUSERVIEW : 0}}",
    attachment_name: "{{#? ATTACHMENTNAME}}",
    attachment_path: `${config.domain_cdn}{{ATTACHMENTPATH}}`,
    sender: "{{#? SENDER}}",
    sender_picture: [
        {
            "{{#if SENDERPICTURE}}": `${config.domain_cdn}{{SENDERPICTURE}}`,
        },
        {
            "{{#else}}": `${config.domain_cdn}/uploads/d-book.png`,
        },
    ],
    is_incoming_mail: "{{ISINCOMINGMAIL ? 1 : 0}}",
    is_send_to_all: "{{ISSENDTOALL ? 1 : 0}}",
    user_name: "{{#? USERNAME}}",
    department_id: "{{#? DEPARTMENTID}}",
    parent_id: "{{#? PARENTID}}",
    is_draft: "{{ISDRAFT ? 1 : 0}}",
    is_deleted: "{{ISDELETED ? 1 : 0}}",
    user_name_sender: "{{#? USERNAMESENDER}}",
    mail_type: "{{MAILTYPE ? MAILTYPE : 0}}",
    created_date: "{{#? CREATEDDATE}}",
    total_mail: "{{#? TOTALMAIL}}",
    is_reply: "{{ISREPLY ? 1 : 0}}",
    is_attachment: "{{ISATTACHMENT ? 1 : 0}}",
    user_view_name: "{{#? USERVIEWNAME}}",
    department_view_name: "{{#? DEPARTMENTVIEWNAME}}",
    default_picture_url: [
        {
            '{{#if DEFAULTPICTUREURL}}': [
                {
                    "{{#if DEFAULTPICTUREURL.indexOf('data:image') >= 0 }}": "{{DEFAULTPICTUREURL}}"
                },
                {
                    "{{#else}}": `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
                }
            ]
        },
        {
            '{{#else}}': `${config.domain_cdn}/uploads/d-book.png`,
        },
    ],
    full_name: "{{#? FULLNAME}}",
};

let transform = new Transform(template);

const listInbox = (data = []) => {
    return transform.transform(data, [
        "mail_id",
        "mail_subject",
        "mail_content",
        "send_date",
        "total_user_view",
        "is_flagged",
        "is_read",
        "sender",
        "sender_picture",
        "total_mail",
        "is_reply",
        "is_attachment"
    ]);
};

const attachment = (data = []) => {
    return transform.transform(data, [
        "mail_id",
        "attachment_name",
        "attachment_path",
    ]);
};

const listMail = (data = []) => {
    return transform.transform(data, [
        "mail_id",
        "mail_subject",
        "mail_content",
        "send_date",
        "is_send_to_all",
        "is_flagged",
        "sender",
        "sender_picture",
        "mail_type",
        "is_deleted",
        "created_date",
        "total_mail",
        "is_reply"
    ]);
};

const parentMail = (data = []) => {
    return transform.transform(data, [
        "mail_id",
        "mail_subject",
        "send_date",
        "is_flagged",
        "is_read",
        'total_user_view',
        "is_deleted",
        "mail_type",
        "is_send_to_all",

    ]);
};

const listChildMail = (data = []) => {
    return transform.transform(data, [
        "mail_id",
        "mail_content",
        "send_date",
        "sender",
        "sender_picture",
        "user_name_sender",
        "mail_type",
        "is_send_to_all"
    ]);
};

const detailDraft = (data = []) => {
    return transform.transform(data, [
        "mail_id",
        "parent_id",
        "mail_subject",
        "mail_content",
        "is_send_to_all",
    ]);
};


const listUserView = (data = []) => {
    return transform.transform(data, [
        "user_view_name",
        "department_view_name",
        "default_picture_url"
    ]);
};

const listUserSend = (data = []) => {
  return transform.transform(data, [
      "user_name",
      "full_name",
      "default_picture_url"
  ]);
};


module.exports = {
    listInbox,
    attachment,
    listMail,
    parentMail,
    listChildMail,
    detailDraft,
    listUserView,
    listUserSend,
};
