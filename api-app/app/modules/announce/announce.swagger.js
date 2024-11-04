module.exports = {
    tag: {
        name: 'Notify',
        description: 'API for Notify',
    },
    paths: {
        '/announce': {
            get: {
                tags: ['Notify'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get notify',
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
                                                announce_id: 20,
                                                announce_title: '[HANNLN_SKYMOND] Test thông báo theo giờ đã set',
                                                published_date: '02/08/2022 08:50',
                                                total_attachment: 0,
                                                total_user_view: 1,
                                                is_read: 0,
                                                description: '8h50 gửi',
                                            },
                                            {
                                                announce_id: 19,
                                                announce_title: 'Test thông báo lên app',
                                                published_date: '28/07/2022 05:23',
                                                total_attachment: 0,
                                                total_user_view: 1,
                                                is_read: 0,
                                                description: 'À',
                                            },
                                            {
                                                announce_id: 18,
                                                announce_title: '[HANNLN_SKYMOND] Test thông báo cá nhân',
                                                published_date: '28/07/2022 05:10',
                                                total_attachment: 0,
                                                total_user_view: 0,
                                                is_read: 0,
                                                description: 'th',
                                            },
                                            {
                                                announce_id: 17,
                                                announce_title: 'thông báo test',
                                                published_date: '08/06/2022 11:30',
                                                total_attachment: 0,
                                                total_user_view: 1,
                                                is_read: 0,
                                                description: 'test',
                                            },
                                            {
                                                announce_id: 16,
                                                announce_title: 'TEST',
                                                published_date: '20/05/2022 01:51',
                                                total_attachment: 0,
                                                total_user_view: 2,
                                                is_read: 0,
                                                description: 'Test',
                                            },
                                            {
                                                announce_id: 14,
                                                announce_title: '[HANNLN_SKYMOND] Test thông báo theo giờ đã set',
                                                published_date: '17/05/2022 02:05',
                                                total_attachment: 0,
                                                total_user_view: 2,
                                                is_read: 0,
                                                description: '14:05 17/05/2022',
                                            },
                                            {
                                                announce_id: 12,
                                                announce_title: 'nghỉ lễ 1.5',
                                                published_date: '13/05/2022 04:06',
                                                total_attachment: 0,
                                                total_user_view: 15,
                                                is_read: 1,
                                                description: '123',
                                            },
                                            {
                                                announce_id: 13,
                                                announce_title: 'THÔNG BÁO',
                                                published_date: '13/05/2022 03:34',
                                                total_attachment: 0,
                                                total_user_view: 11,
                                                is_read: 1,
                                                description: '1234',
                                            },
                                            {
                                                announce_id: 5,
                                                announce_title: 'THÔNG BÁO',
                                                published_date: '02/05/2022 11:46',
                                                total_attachment: 0,
                                                total_user_view: 14,
                                                is_read: 1,
                                                description: 'THÔNG BÁO\nNhằm xây dựng văn hoá doanh nghiệp, xây...',
                                            },
                                            {
                                                announce_id: 4,
                                                announce_title: 'THÔNG BÁO ĐỐI SOÁT GIAO DỊCH',
                                                published_date: '02/05/2022 10:13',
                                                total_attachment: 0,
                                                total_user_view: 18,
                                                is_read: 1,
                                                description: 'THÔNG BÁOTừ 1/5/2022 toàn bộ giao dịch của khách ...',
                                            },
                                        ],
                                        totalItems: 10,
                                        page: 1,
                                        totalPages: 1,
                                        itemsPerPage: 25,
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
                ],
            },
        },
        '/announce/{announceId}': {
            get: {
                tags: ['Notify'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get notify',
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
                                                announce_id: 20,
                                                announce_title: '[HANNLN_SKYMOND] Test thông báo theo giờ đã set',
                                                published_date: '02/08/2022 08:50',
                                                total_attachment: 0,
                                                total_user_view: 1,
                                                is_read: 0,
                                                description: '8h50 gửi',
                                            },
                                            {
                                                announce_id: 19,
                                                announce_title: 'Test thông báo lên app',
                                                published_date: '28/07/2022 05:23',
                                                total_attachment: 0,
                                                total_user_view: 1,
                                                is_read: 0,
                                                description: 'À',
                                            },
                                            {
                                                announce_id: 18,
                                                announce_title: '[HANNLN_SKYMOND] Test thông báo cá nhân',
                                                published_date: '28/07/2022 05:10',
                                                total_attachment: 0,
                                                total_user_view: 0,
                                                is_read: 0,
                                                description: 'th',
                                            },
                                            {
                                                announce_id: 17,
                                                announce_title: 'thông báo test',
                                                published_date: '08/06/2022 11:30',
                                                total_attachment: 0,
                                                total_user_view: 1,
                                                is_read: 0,
                                                description: 'test',
                                            },
                                            {
                                                announce_id: 16,
                                                announce_title: 'TEST',
                                                published_date: '20/05/2022 01:51',
                                                total_attachment: 0,
                                                total_user_view: 2,
                                                is_read: 0,
                                                description: 'Test',
                                            },
                                            {
                                                announce_id: 14,
                                                announce_title: '[HANNLN_SKYMOND] Test thông báo theo giờ đã set',
                                                published_date: '17/05/2022 02:05',
                                                total_attachment: 0,
                                                total_user_view: 2,
                                                is_read: 0,
                                                description: '14:05 17/05/2022',
                                            },
                                            {
                                                announce_id: 12,
                                                announce_title: 'nghỉ lễ 1.5',
                                                published_date: '13/05/2022 04:06',
                                                total_attachment: 0,
                                                total_user_view: 15,
                                                is_read: 1,
                                                description: '123',
                                            },
                                            {
                                                announce_id: 13,
                                                announce_title: 'THÔNG BÁO',
                                                published_date: '13/05/2022 03:34',
                                                total_attachment: 0,
                                                total_user_view: 11,
                                                is_read: 1,
                                                description: '1234',
                                            },
                                            {
                                                announce_id: 5,
                                                announce_title: 'THÔNG BÁO',
                                                published_date: '02/05/2022 11:46',
                                                total_attachment: 0,
                                                total_user_view: 14,
                                                is_read: 1,
                                                description: 'THÔNG BÁO\nNhằm xây dựng văn hoá doanh nghiệp, xây...',
                                            },
                                            {
                                                announce_id: 4,
                                                announce_title: 'THÔNG BÁO ĐỐI SOÁT GIAO DỊCH',
                                                published_date: '02/05/2022 10:13',
                                                total_attachment: 0,
                                                total_user_view: 18,
                                                is_read: 1,
                                                description: 'THÔNG BÁOTừ 1/5/2022 toàn bộ giao dịch của khách ...',
                                            },
                                        ],
                                        totalItems: 10,
                                        page: 1,
                                        totalPages: 1,
                                        itemsPerPage: 25,
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
                parameters: [
                    {
                        name: 'announceId',
                        in: 'path',
                        description: 'announceId',
                        required: true,
                        type: 'integer',
                    },
                ],
            },
        },
        '/announce/view': {
            put: {
                tags: ['Notify'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'update read',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'string',
                                    default: 'UPDATE SUCCESS',
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
                    name: 'body',
                    in: 'body',
                    required: true,
                    schema: {
                        type: 'object',
                        properties: {
                            announce_id: {
                                type: 'integer',
                                default: 1,
                            },
                        },
                    },
                },
            ],
        },
        '/announce/total-unread': {
            get: {
                tags: ['Notify'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'total notify unread',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        total_unread: 6,
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
        },
        '/announce-comment': {
            get: {
                tags: ['Notify'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list notify comments',
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
                                        items: [],
                                        totalItems: 0,
                                        page: 1,
                                        totalPages: 0,
                                        itemsPerPage: 25,
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
                        name: 'announce_id',
                        in: 'query',
                        description: 'announce_id',
                        required: true,
                        type: 'integer',
                        default: 37,
                    },
                ],
            },
            post: {
                tags: ['Notify'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'create  comments',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        comment_id: 89,
                                        comment_content: 'test cmt',
                                        reply_comment_id: null,
                                        author: '10004',
                                        announce_id: 1,
                                        username: '10004',
                                        created_user: '10004',
                                        is_active: 1,
                                        news_comment_like_id: null,
                                        is_like: null,
                                        created_date: '21/10/2022 08:07',
                                        avatar: null,
                                    },
                                },
                                message: {
                                    type: 'string',
                                    default: 'Thêm mới thành công.',
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
                parameters: [
                    {
                        name: 'Body',
                        in: 'body',
                        required: true,
                        schema: {
                            properties: {
                                comment_content: {
                                    type: 'string',
                                    default: '',
                                },
                                reply_comment_id: {
                                    type: 'integer',
                                    default: null,
                                },
                                announce_id: {
                                    type: 'integer',
                                    default: 1,
                                },
                                is_active: {
                                    type: 'integer',
                                    default: 1,
                                },
                                image: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                ],
            },
        },
        '/announce-comment/{commentID}': {
            get: {
                tags: ['Notify'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'update  comments',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        comment_id: 89,
                                        comment_content: 'test cmt',
                                        reply_comment_id: null,
                                        author: '10004',
                                        announce_id: 1,
                                        username: '10004',
                                        created_user: '10004',
                                        is_active: 1,
                                        news_comment_like_id: null,
                                        is_like: null,
                                        created_date: '21/10/2022 08:07',
                                        avatar: null,
                                    },
                                },
                                message: {
                                    type: 'string',
                                    default: 'Cập nhật thành công.',
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
                parameters: [
                    {
                        name: 'commentID',
                        in: 'path',
                        required: true,
                        type: 'integer',
                    },
                ],
            },
            put: {
                tags: ['Notify'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'update  comments',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        comment_id: 89,
                                        comment_content: 'test cmt',
                                        reply_comment_id: null,
                                        author: '10004',
                                        announce_id: 1,
                                        username: '10004',
                                        created_user: '10004',
                                        is_active: 1,
                                        news_comment_like_id: null,
                                        is_like: null,
                                        created_date: '21/10/2022 08:07',
                                        avatar: null,
                                    },
                                },
                                message: {
                                    type: 'string',
                                    default: 'Cập nhật thành công.',
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
                parameters: [
                    {
                        name: 'Body',
                        in: 'body',
                        required: true,
                        schema: {
                            properties: {
                                comment_content: {
                                    type: 'string',
                                    default: '',
                                },
                                is_active: {
                                    type: 'integer',
                                    default: 1,
                                },
                            },
                        },
                    },
                    {
                        name: 'commentID',
                        in: 'path',
                        required: true,
                        type: 'integer',
                    },
                ],
            },
            delete: {
                tags: ['Notify'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'delete  comments',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: null,
                                },
                                message: {
                                    type: 'string',
                                    default: 'Xoá thành công.',
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
                parameters: [
                    {
                        name: 'commentID',
                        in: 'path',
                        required: true,
                        type: 'integer',
                    },
                ],
            },
        },
        '/announce-comment/like-dislike': {
            post: {
                tags: ['Notify'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'like comment',
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
                                        items: [],
                                        totalItems: 0,
                                        page: 1,
                                        totalPages: 0,
                                        itemsPerPage: 25,
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
                    name: 'body',
                    in: 'body',
                    required: true,
                    description: '',
                    schema: {
                        type: 'object',
                        properties: {
                            comment_id: {
                                type: 'integer',
                                default: '1',
                            },
                            is_like: {
                                type: 'integer',
                                default: '1',
                            },
                        },
                    },
                },
            ],
        },
        '/announce-comment/reply': {
            get: {
                tags: ['Notify'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list reply comments',
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
                                                reply_comment_id: '37',
                                                comment_id: '39',
                                                comment_content: 'Sao bị mất cmt ta',
                                                author: '10012 - BW TEST',
                                                like_count: null,
                                                avatar: 'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                username: '10012',
                                                created_user: '10012',
                                                created_date: '09/08/2022 10:41',
                                                announce_comment_like_id: null,
                                                is_like: 0,
                                                totalReply: 1,
                                            },
                                        ],
                                        totalItems: 1,
                                        page: '1',
                                        totalPages: 1,
                                        itemsPerPage: '1',
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
                    name: 'reply_comment_id',
                    in: 'query',
                    description: 'reply_comment_id',
                    required: true,
                    type: 'integer',
                    default: 37,
                },
            ],
        },
    },
};
