const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const conversationList = (list = []) => {
    let transform = new Transform({
        conversation_id: '{{#? CONVERSATIONID}}',
        conversation_name: '{{#? CONVERSATIONNAME}}',
        avatar_url: [
            {
                '{{#if AVATARURL}}': `${config.domain_cdn}{{AVATARURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        latest_message: '{{#? LATESTMESSAGE}}',
        latest_msg_time: '{{#? LATESTMSGTIME}}',
        is_pin: '{{ISPIN ? 1 : 0}}',
        number_of_unread_msg: '{{NUMBEROFUNREADMSG ? NUMBEROFUNREADMSG : 0}}',
        color: '{{#? COLOR}}',
        is_notification: '{{ISNOTIFICATION ? 1 : 0}}',
        is_bell: '{{ISBELL ? 1 : 0}}',
        updated_user: '{{#? UPDATEDUSER}}',
    });
    return transform.transform(list, [
        'conversation_id',
        'conversation_name',
        'avatar_url',
        'latest_message',
        'latest_msg_time',
        'is_pin',
        'number_of_unread_msg',
        'color',
        'is_notification',
        'is_bell',
        'updated_user',
    ]);
};

const messageList = (list = [], participantList, auth_name) => {
    let transform = new Transform({
        conversation_id: '{{#? cId}}',
        message_id: '{{#? _id}}',
        message: [
            {
                '{{#if message.files.length}}': {
                    files: {
                        '{{#each message.files}}': {
                            path: `${config.domain_cdn}{{path}}`,
                            name: '{{name}}',
                        },
                    },
                },
            },
            {
                '{{#else}}': {text: '{{#? message.text}}'},
            },
        ],
        created_date: '{{#? createdAt}}',
        created_user: [
            {
                [`{{#if createdUser === ${auth_name}}}`]: null,
            },
            {
                '{{#else}}': `{{${JSON.stringify(participantList)}.find(x => x.username === createdUser)}}`,
            },
        ],
        parent_id: '{{#? parentId}}',
    });
    return transform.transform(list, [
        'conversation_id',
        'message_id',
        'message',
        'created_date',
        'created_user',
        'parent_id',
    ]);
};

const participantList = (list = []) => {
    let transform = new Transform({
        username: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        email: '{{#? EMAIL}}',
        avatar: [
            {
                '{{#if DEFAULTPICTUREURL}}': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
    });

    return transform.transform(list, ['username', 'full_name', 'avatar', 'email']);
};

module.exports = {
    conversationList,
    messageList,
    participantList,
};
