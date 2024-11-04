module.exports = {
    tag: {
        name: 'Mails',
        description: 'API for mail',
    },
    paths: {
        '/mail/incoming': {
            get: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list inbox',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        listCustomerType: [],
                                        items: [
                                            {
                                                mail_id: 30283,
                                                mail_subject: '[PHÂN CÔNG BÀI KIỂM TRA] Bài 1 ',
                                                send_date: '10/10/2022 11:49',
                                                total_user_view: 1,
                                                is_flagged: 0,
                                                is_read: 0,
                                                sender: 'administrator-Administrator Account',
                                                sender_picture: 'http://beshe-test.blackwind.vn/uploads/d-book.png',
                                                total_mail: 1,
                                                is_reply: 0,
                                                is_attachment: 0,
                                                attachments: [],
                                                sub_content: '\n  Chào anh/chị,\n  Anh/chị được phân công thực hi...',
                                            },
                                        ],
                                        totalItems: 67,
                                        page: '1',
                                        totalPages: 67,
                                        itemsPerPage: '1',
                                    },
                                },
                                message: {
                                    type: '',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    description: 'current page',
                    required: true,
                    type: 'integer',
                    default: 1,
                },
                {
                    name: 'itemsPerPage',
                    in: 'query',
                    description: 'itemsPerPage',
                    required: true,
                    type: 'integer',
                    default: 1,
                },
                {
                    name: 'search',
                    in: 'query',
                    description: 'search',
                    required: false,
                    type: 'string',
                },
                {
                    name: 'is_get_by_current_day',
                    in: 'query',
                    description: 'is_get_by_current_day',
                    required: false,
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'is_unread',
                    in: 'query',
                    description: 'is_unread',
                    required: false,
                    type: 'integer',
                    default: 0,
                },
            ],
        },
        '/mail/incoming-in-day': {
            get: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list inbox',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        listCustomerType: [],
                                        items: [
                                            {
                                                mail_id: 30283,
                                                mail_subject: '[PHÂN CÔNG BÀI KIỂM TRA] Bài 1 ',
                                                send_date: '10/10/2022 11:49',
                                                total_user_view: 1,
                                                is_flagged: 0,
                                                is_read: 0,
                                                sender: 'administrator-Administrator Account',
                                                sender_picture: 'http://beshe-test.blackwind.vn/uploads/d-book.png',
                                                total_mail: 1,
                                                is_reply: 0,
                                                is_attachment: 0,
                                                attachments: [],
                                                sub_content: '\n  Chào anh/chị,\n  Anh/chị được phân công thực hi...',
                                            },
                                        ],
                                        totalItems: 67,
                                        page: '1',
                                        totalPages: 67,
                                        itemsPerPage: '1',
                                    },
                                },
                                message: {
                                    type: '',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    description: 'current page',
                    required: true,
                    type: 'integer',
                    default: 1,
                },
                {
                    name: 'itemsPerPage',
                    in: 'query',
                    description: 'itemsPerPage',
                    required: true,
                    type: 'integer',
                    default: 1,
                },
                {
                    name: 'search',
                    in: 'query',
                    description: 'search',
                    required: false,
                    type: 'string',
                },
                {
                    name: 'is_unread',
                    in: 'query',
                    description: 'is_unread',
                    required: false,
                    type: 'integer',
                    default: 0,
                },
            ],
        },
        '/mail': {
            post: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'send mail',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {},
                                },
                                message: {
                                    type: '',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            consumes: ['multipart/form-data'],
            parameters: [
                {
                    name: 'parent_id',
                    in: 'formData',
                    type: 'integer',
                    description: 'parent_id',
                },
                {
                    name: 'mail_subject',
                    in: 'formData',
                    type: 'string',
                    description: 'mail_subject',
                    default: 'string',
                },
                {
                    name: 'mail_content',
                    in: 'formData',
                    type: 'string',
                    required: true,
                    description: 'mail_content',
                    default: 'string',
                },
                {
                    name: 'is_send_to_all',
                    in: 'formData',
                    type: 'integer',
                    description: 'is_send_to_all default is 0',
                    default: 0,
                },
                {
                    name: 'list_user[]',
                    in: 'formData',
                    type: 'array',
                    items: {
                        type: 'integer',
                    },
                    collectionFormat: 'multi',
                    description: 'list_user',
                },
                {
                    name: 'list_department[]',
                    in: 'formData',
                    type: 'array',
                    items: {
                        type: 'integer',
                    },
                    collectionFormat: 'multi',
                    description: 'list_department',
                },
                {
                    name: 'list_cc_user[]',
                    in: 'formData',
                    type: 'array',
                    items: {
                        type: 'integer',
                    },
                    collectionFormat: 'multi',
                    description: 'list_cc_user',
                },
                {
                    name: 'is_reply_all',
                    in: 'formData',
                    type: 'integer',
                    description: 'is_reply_all default is 0',
                    default: 0,
                },
                {
                    name: 'files',
                    in: 'formData',
                    type: 'file',
                    collectionFormat: 'multi',
                    description: 'attachments',
                },
                {
                    name: 'flatform',
                    in: 'formData',
                    type: 'string',
                    collectionFormat: 'multi',
                    description: 'flatform',
                    default: 'mobile',
                },
            ],
        },
        '/mail/{mailIddd}': {
            put: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'Update mail draft and send',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'string',
                                    default: 'Gửi mail thành công.',
                                },
                                message: {
                                    type: '',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            consumes: ['multipart/form-data'],
            parameters: [
                {
                    name: 'mailIddd',
                    type: 'integer',
                    in: 'path',
                    required: true,
                    description: '',
                    default: '40285',
                },
                {
                    name: 'parent_id',
                    in: 'formData',
                    type: 'integer',
                    description: 'parent_id',
                },
                {
                    name: 'mail_subject',
                    in: 'formData',
                    type: 'string',
                    description: 'mail_subject',
                    default: 'string',
                },
                {
                    name: 'mail_content',
                    in: 'formData',
                    type: 'string',
                    required: true,
                    description: 'mail_content',
                    default: 'string',
                },
                {
                    name: 'is_send_to_all',
                    in: 'formData',
                    type: 'integer',
                    description: 'is_send_to_all default is 0',
                    default: 0,
                },
                {
                    name: 'list_user[]',
                    in: 'formData',
                    type: 'array',
                    items: {
                        type: 'integer',
                    },
                    collectionFormat: 'multi',
                    description: 'list_user',
                },
                {
                    name: 'list_department',
                    in: 'formData',
                    type: 'array',
                    items: {
                        type: 'integer',
                    },
                    collectionFormat: 'multi',
                    description: 'list_department',
                },
                {
                    name: 'list_cc_user',
                    in: 'formData',
                    type: 'array',
                    items: {
                        type: 'integer',
                    },
                    collectionFormat: 'multi',
                    description: 'list_cc_user',
                },
                {
                    name: 'is_reply_all',
                    in: 'formData',
                    type: 'integer',
                    description: 'is_reply_all default is 0',
                    default: 0,
                },
                {
                    name: 'files',
                    in: 'formData',
                    type: 'file',
                    collectionFormat: 'multi',
                    description: 'attachments',
                },
            ],
        },
        '/mail/sent': {
            get: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list sent',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        listCustomerType: [],
                                        items: [
                                            {
                                                mail_id: '40370',
                                                mail_subject: 'string',
                                                send_date: '17/10/2022 10:49',
                                                is_flagged: 0,
                                                sender: 'Tôi',
                                                sender_picture:
                                                    'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                mail_type: 1,
                                                is_deleted: 0,
                                                created_date: '17/10/2022',
                                                total_mail: 1,
                                                is_reply: 0,
                                                attachments: [
                                                    {
                                                        attachment_name: 'WIN_20221010_08_39_01_Pro.jpg',
                                                        attachment_path:
                                                            'http://beshe-test.blackwind.vn/file/c95f4d9d-5038-4a57-88a2-52e6a224dda7.jpg',
                                                        attachment_extension: 'jpg',
                                                    },
                                                ],
                                                receivers: ['10008-Cầm  Thị Huyền'],
                                                sub_content: 'string',
                                            },
                                        ],
                                        totalItems: 29,
                                        page: '1',
                                        totalPages: 29,
                                        itemsPerPage: '1',
                                    },
                                },
                                message: {
                                    type: '',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    description: 'current page',
                    required: true,
                    type: 'integer',
                    default: 1,
                },
                {
                    name: 'itemsPerPage',
                    in: 'query',
                    description: 'itemsPerPage',
                    required: true,
                    type: 'integer',
                    default: 1,
                },
                {
                    name: 'search',
                    in: 'query',
                    description: 'search',
                    required: false,
                    type: 'string',
                },
            ],
        },
        '/mail/flagged': {
            get: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list flagged',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        listCustomerType: [],
                                        items: [
                                            {
                                                mail_id: '40364',
                                                mail_subject: 'stringaaaaaaaaaaa',
                                                send_date: '17/10/2022 10:32',
                                                is_flagged: 1,
                                                sender: 'Tôi',
                                                sender_picture:
                                                    'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                mail_type: 1,
                                                is_deleted: 0,
                                                created_date: '17/10/2022',
                                                total_mail: 1,
                                                is_reply: 0,
                                                attachments: [],
                                                receivers: [],
                                                sub_content: 'stringaaaaaaaaaaaaa',
                                            },
                                        ],
                                        totalItems: 4,
                                        page: '1',
                                        totalPages: 4,
                                        itemsPerPage: '1',
                                    },
                                },
                                message: {
                                    type: '',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    description: 'current page',
                    required: true,
                    type: 'integer',
                    default: 1,
                },
                {
                    name: 'itemsPerPage',
                    in: 'query',
                    description: 'itemsPerPage',
                    required: true,
                    type: 'integer',
                    default: 1,
                },
                {
                    name: 'search',
                    in: 'query',
                    description: 'search',
                    required: false,
                    type: 'string',
                },
            ],
        },
        '/mail/draft': {
            get: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list draft',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        listCustomerType: [],
                                        items: [
                                            {
                                                mail_id: '40370',
                                                mail_subject: 'string',
                                                send_date: '17/10/2022 10:49',
                                                is_flagged: 1,
                                                sender: 'Tôi',
                                                sender_picture:
                                                    'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                mail_type: 1,
                                                is_deleted: 0,
                                                created_date: ['2022-10-17T10:49:13.427Z', '17/10/2022'],
                                                total_mail: 1,
                                                is_reply: 0,
                                                attachments: [
                                                    {
                                                        attachment_name: 'WIN_20221010_08_39_01_Pro.jpg',
                                                        attachment_path:
                                                            'http://beshe-test.blackwind.vn/file/c95f4d9d-5038-4a57-88a2-52e6a224dda7.jpg',
                                                        attachment_extension: 'jpg',
                                                    },
                                                ],
                                                receivers: ['10008-Cầm  Thị Huyền'],
                                                sub_content: 'string',
                                            },
                                        ],
                                        totalItems: 17,
                                        page: '1',
                                        totalPages: 17,
                                        itemsPerPage: '1',
                                    },
                                },
                                message: {
                                    type: '',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    description: 'current page',
                    required: true,
                    type: 'integer',
                    default: 1,
                },
                {
                    name: 'itemsPerPage',
                    in: 'query',
                    description: 'itemsPerPage',
                    required: true,
                    type: 'integer',
                    default: 1,
                },
                {
                    name: 'search',
                    in: 'query',
                    description: 'search',
                    required: false,
                    type: 'string',
                },
            ],
        },
        '/mail/trash': {
            get: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list trash',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        listCustomerType: [],
                                        items: [
                                            {
                                                mail_id: '40370',
                                                mail_subject: 'string',
                                                send_date: '17/10/2022 10:49',
                                                is_flagged: 1,
                                                sender: 'Tôi',
                                                sender_picture:
                                                    'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                mail_type: 1,
                                                is_deleted: 0,
                                                created_date: ['2022-10-17T10:49:13.427Z', '17/10/2022'],
                                                total_mail: 1,
                                                is_reply: 0,
                                                attachments: [
                                                    {
                                                        attachment_name: 'WIN_20221010_08_39_01_Pro.jpg',
                                                        attachment_path:
                                                            'http://beshe-test.blackwind.vn/file/c95f4d9d-5038-4a57-88a2-52e6a224dda7.jpg',
                                                        attachment_extension: 'jpg',
                                                    },
                                                ],
                                                receivers: ['10008-Cầm  Thị Huyền'],
                                                sub_content: 'string',
                                            },
                                        ],
                                        totalItems: 17,
                                        page: '1',
                                        totalPages: 17,
                                        itemsPerPage: '1',
                                    },
                                },
                                message: {
                                    type: '',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    description: 'current page',
                    required: true,
                    type: 'integer',
                    default: 1,
                },
                {
                    name: 'itemsPerPage',
                    in: 'query',
                    description: 'itemsPerPage',
                    required: true,
                    type: 'integer',
                    default: 1,
                },
                {
                    name: 'search',
                    in: 'query',
                    description: 'search',
                    required: false,
                    type: 'string',
                },
            ],
        },
        '/mail/{mailId}/user-view': {
            get: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'list user view',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'array',
                                    default: [
                                        {
                                            user_view_name: '10004 - Vũ  Thu Hà',
                                            department_view_name: 'Phòng Kinh Doanh',
                                            default_picture_url:
                                                'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                        },
                                    ],
                                },
                                message: {
                                    type: '',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            parameters: [
                {
                    name: 'mailId',
                    in: 'path',
                    description: 'mailId',
                    required: true,
                    type: 'integer',
                },
            ],
        },
        '/department/get-options': {
            get: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list department',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'array',
                                    default: [
                                        {
                                            id: 8,
                                            name: 'Ban giám đốc',
                                            parent_id: '1',
                                        },
                                        {
                                            id: 10,
                                            name: 'Phòng ban công ty a',
                                            parent_id: '2',
                                        },
                                        {
                                            id: 5,
                                            name: 'Phòng ban test',
                                            parent_id: '1',
                                        },
                                        {
                                            id: 9,
                                            name: 'Phòng hành chính nhân sự',
                                            parent_id: '1',
                                        },
                                        {
                                            id: 1,
                                            name: 'Phòng Kho ',
                                            parent_id: '1',
                                        },
                                        {
                                            id: 3,
                                            name: 'Phòng Kinh Doanh',
                                            parent_id: '1',
                                        },
                                        {
                                            id: 6,
                                            name: 'Phòng lập trình mobile',
                                            parent_id: '1',
                                        },
                                        {
                                            id: 2,
                                            name: 'Phòng nhân sự ',
                                            parent_id: '1',
                                        },
                                        {
                                            id: 7,
                                            name: 'Phòng phân tích nghiệp vụ',
                                            parent_id: '1',
                                        },
                                        {
                                            id: 4,
                                            name: 'Phòng Truyền Thông',
                                            parent_id: '1',
                                        },
                                    ],
                                },
                                message: {
                                    type: '',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
        },
        '/user/get-options': {
            get: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list users',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'array',
                                    default: [
                                        {
                                            user_name: '10035',
                                            full_name: 'Bùi Thanh Thoại',
                                            email: 'thoaibt@blackwind.vn',
                                            default_picture_url:
                                                'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                        },
                                    ],
                                },
                                message: {
                                    type: '',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            parameters: [
                {
                    name: 'search',
                    in: 'query',
                    description: 'search',
                    required: false,
                    type: 'string',
                },
            ],
        },
        '/mail/save-draft': {
            post: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'save mail draft',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'string',
                                    default: 'Lưu nháp thành công.',
                                },
                                message: {
                                    type: '',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            consumes: ['multipart/form-data'],
            parameters: [
                {
                    name: 'parent_id',
                    in: 'formData',
                    type: 'integer',
                    description: 'parent_id',
                },
                {
                    name: 'mail_subject',
                    in: 'formData',
                    type: 'string',
                    description: 'mail_subject',
                    default: 'string',
                },
                {
                    name: 'mail_content',
                    in: 'formData',
                    type: 'string',
                    required: true,
                    description: 'mail_content',
                    default: 'string',
                },
                {
                    name: 'is_send_to_all',
                    in: 'formData',
                    type: 'integer',
                    description: 'is_send_to_all default is 0',
                    default: 0,
                },
                {
                    name: 'list_user[]',
                    in: 'formData',
                    type: 'array',
                    items: {
                        type: 'integer',
                    },
                    collectionFormat: 'multi',
                    description: 'list_user',
                },
                {
                    name: 'list_department',
                    in: 'formData',
                    type: 'array',
                    items: {
                        type: 'integer',
                    },
                    collectionFormat: 'multi',
                    description: 'list_department',
                },
                {
                    name: 'list_cc_user',
                    in: 'formData',
                    type: 'array',
                    items: {
                        type: 'integer',
                    },
                    collectionFormat: 'multi',
                    description: 'list_cc_user',
                },
                {
                    name: 'is_reply_all',
                    in: 'formData',
                    type: 'integer',
                    description: 'is_reply_all default is 0',
                    default: 0,
                },
                {
                    name: 'files',
                    in: 'formData',
                    type: 'file',
                    collectionFormat: 'multi',
                    description: 'attachments',
                },
            ],
        },
        '/mail/status-incoming-mail': {
            get: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list users',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        total_unread: 7,
                                        total_incoming_in_day: 0,
                                    },
                                },
                                message: {
                                    type: '',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
        },
        '/mail/trash/{mailId}/undo': {
            put: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'undo trash mail',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'string',
                                    default: '40375',
                                },
                                message: {
                                    type: 'string',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            parameters: [
                {
                    name: 'mailId',
                    type: 'integer',
                    in: 'path',
                    required: true,
                    description: '',
                    default: '40375',
                },
            ],
        },
        '/mail/{mailId}': {
            delete: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'delete mail',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'string',
                                    default: 'Delete data successfully.',
                                },
                                message: {
                                    type: 'string',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            parameters: [
                {
                    name: 'mailId',
                    type: 'integer',
                    in: 'path',
                    required: true,
                    description: '',
                    default: '40375',
                },
            ],
        },
        '/mail/draft/{mailId}': {
            delete: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'delete draft mail',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'string',
                                    default: 'Delete data successfully.',
                                },
                                message: {
                                    type: 'string',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            parameters: [
                {
                    name: 'mailId',
                    type: 'integer',
                    in: 'path',
                    required: true,
                    description: '',
                    default: '40375',
                },
            ],
        },
        '/mail/draft/{mailIdd}': {
            get: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get draft mail by id',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        mail_id: '40374',
                                        parent_id: '0',
                                        mail_subject: 'string',
                                        mail_content: 'string',
                                        is_send_to_all: 0,
                                        attachments: [],
                                        list_user: [],
                                        list_cc_user: [],
                                        list_department: [],
                                    },
                                },
                                message: {
                                    type: 'string',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            parameters: [
                {
                    name: 'mailIdd',
                    type: 'integer',
                    in: 'path',
                    required: true,
                    description: '',
                    default: '40375',
                },
            ],
        },
        '/mail/trash/{mailId}': {
            delete: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'delete mail from trash',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'string',
                            properties: {
                                data: 'Delete data successfully.',
                                message: {
                                    type: 'string',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            parameters: [
                {
                    name: 'mailId',
                    type: 'integer',
                    in: 'path',
                    required: true,
                    description: '',
                    default: '40375',
                },
            ],
        },
        '/mail/{mailIdd}': {
            get: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get mail by id',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        mail: {
                                            mail_id: '40285',
                                            mail_subject: 'test',
                                            send_date: '14/10/2022 16:01',
                                            is_flagged: 1,
                                            is_read: 1,
                                            total_user_view: 1,
                                            is_deleted: 0,
                                            mail_type: 1,
                                            is_send_to_all: 0,
                                        },
                                        child: [
                                            {
                                                mail_id: '40285',
                                                mail_content: 'test',
                                                send_date: '14/10/2022 16:01',
                                                sender: 'Tôi',
                                                sender_picture:
                                                    'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                user_name_sender: '10004',
                                                mail_type: 1,
                                                is_send_to_all: 0,
                                                attachments: [],
                                                receivers: [
                                                    'Nguyễn  Thị Thanh Ngân',
                                                    'Phòng Kinh Doanh',
                                                    'Blackwind Support',
                                                ],
                                                sub_content: 'test',
                                            },
                                        ],
                                    },
                                },
                                message: {
                                    type: 'string',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            parameters: [
                {
                    name: 'mailIdd',
                    type: 'integer',
                    in: 'path',
                    required: true,
                    description: '',
                    default: '40285',
                },
            ],
        },
        '/mail/{mailId}/toggle-flagged': {
            put: {
                tags: ['Mails'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'Toggle flagged',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'string',
                                    default: 'Update data successfully.',
                                },
                                message: {
                                    type: 'string',
                                    default: '',
                                },
                                status: {
                                    type: 'integer',
                                    default: 200,
                                },
                                errors: {
                                    type: 'string',
                                    default: null,
                                },
                            },
                        },
                    },
                    404: {
                        description: 'not found',
                    },
                },
            },
            parameters: [
                {
                    name: 'mailId',
                    type: 'integer',
                    in: 'path',
                    required: true,
                    description: '',
                    default: '40285',
                },
            ],
        },
    },
};
