module.exports = {
    tag: {
        name: 'News',
        description: 'API for News',
    },
    paths: {
        '/news': {
            get: {
                tags: ['News'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list news',
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
                                                news_category_id: '14',
                                                news_category_name: 'Hồ câu Lure',
                                                news_id: '41',
                                                news_title: 'CÂU CÁ TRÔI Hải Dương - Hành Trình Dọc Miền Đất nước',
                                                image_url:
                                                    'http://beshe-test.blackwind.vn/file/88d3bdc7-7ec7-4722-b722-05a1b952110c.jpeg',
                                                is_video: 0,
                                                news_date: '10/08/2022',
                                            },
                                        ],
                                        totalItems: 38,
                                        page: '1',
                                        totalPages: 38,
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
                    name: 'search',
                    in: 'query',
                    description: 'search',
                    required: false,
                    type: 'string',
                },
            ],
        },
        '/news/{newsId}': {
            get: {
                tags: ['News'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get detail news',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        news_category_id: '13',
                                        news_category_name: 'Hồ câu lục',
                                        news_id: '26',
                                        news_title: 'Cần câu vàng cần câu bạc',
                                        meta_title: null,
                                        meta_key_words: null,
                                        meta_description: null,
                                        content:
                                            '<div>Sau giải câu Mĩ Nhân Ngư mùa 1 với những pha ném cần, ròng cá “ đi vào lòng người” của các nữ cần thủ, Vũ Môn Fishing cấp tốc Tuyển ĐỒNG ĐỘI để lập TEAM cùng các nữ cần thủ của Vũ Môn tham gia giải câu tay trải nghiệm "Vũ Môn và những người bạn"!!!</div>',
                                        banner_url:
                                            'http://beshe-test.blackwind.vn/file/9c5781b8-b8df-4705-ae8c-71090b30edd6.jpeg',
                                        is_video: 0,
                                        news_date: '16/06/2022',
                                        related: [
                                            {
                                                news_category_id: '12',
                                                news_category_name: 'Hồ câu đài',
                                                news_id: '25',
                                                news_title: 'Hướng dẫn cách cân phao cơ bản',
                                                image_url:
                                                    'http://beshe-test.blackwind.vn/file/6064a625-7e1b-4e4e-b0fc-f9b734e8dd4f.jpeg',
                                                is_video: 0,
                                                news_date: '05/04/2022',
                                            },
                                            {
                                                news_category_id: '5',
                                                news_category_name: 'Khuyến mãi',
                                                news_id: '24',
                                                news_title: 'Giới thiệu đến các bác 3 cách buộc khoen số 8',
                                                image_url:
                                                    'http://beshe-test.blackwind.vn/file/fce67dd5-5e25-4c55-bcc6-9656be39cd21.jpeg',
                                                is_video: 1,
                                                news_date: '01/06/2022',
                                            },
                                            {
                                                news_category_id: '12',
                                                news_category_name: 'Hồ câu đài',
                                                news_id: '23',
                                                news_title: 'Hướng dẫn câu cá mè - Bài mồi - Bắt nhịp phao',
                                                image_url:
                                                    'http://beshe-test.blackwind.vn/file/71e11685-ddea-4e30-82d7-6653c3b2ce7d.jpeg',
                                                is_video: 0,
                                                news_date: '06/06/2022',
                                            },
                                            {
                                                news_category_id: '13',
                                                news_category_name: 'Hồ câu lục',
                                                news_id: '22',
                                                news_title: 'Hướng dẫn buộc lưỡi câu đơn giản dễ làm mà hiệu quả cao',
                                                image_url:
                                                    'http://beshe-test.blackwind.vn/file/a3ba021e-42e9-4b99-9338-6cc4ec084b3b.jpeg',
                                                is_video: 1,
                                                news_date: '14/06/2022',
                                            },
                                            {
                                                news_category_id: '4',
                                                news_category_name: 'Sự kiện nổi bật',
                                                news_id: '21',
                                                news_title: 'Chương trình trải nghiệm',
                                                image_url:
                                                    'http://beshe-test.blackwind.vn/file/77608f71-4854-4693-8089-80d10292e3a1.jpeg',
                                                is_video: 0,
                                                news_date: '05/01/2022',
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
                    name: 'newsId',
                    in: 'path',
                    description: 'newsId',
                    required: true,
                },
            ],
        },
        '/news/top': {
            get: {
                tags: ['News'],
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
                                    type: 'array',
                                    default: [
                                        {
                                            news_category_id: '2',
                                            news_category_name: 'chuyen muc test 1009',
                                            news_id: '3',
                                            news_title:
                                                'Doanh nghiệp gặp những khó khăn gì khi triển khai hệ thống ERP?',
                                            image_url:
                                                'http://beshe-test.blackwind.vn/file/b5c29635-4aed-4cd5-b5bd-024bb96e538b.jpeg',
                                            is_video: 0,
                                            news_date: '18/05/2022',
                                        },
                                        {
                                            news_category_id: '14',
                                            news_category_name: 'Hồ câu Lure',
                                            news_id: '6',
                                            news_title: 'Cần câu',
                                            image_url:
                                                'http://beshe-test.blackwind.vn/file/b429ab72-5202-47f0-9140-003c26680948.jpeg',
                                            is_video: 0,
                                            news_date: '26/05/2022',
                                        },
                                    ],
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
        '/news-comment': {
            get: {
                tags: ['News'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list news comments',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'array',
                                    default: {
                                        listCustomerType: 1,
                                        items: [
                                            {
                                                reply_comment_id: null,
                                                comment_id: '1',
                                                comment_content: 'test3123123',
                                                author: '10004 - Vũ  Thu Hà',
                                                like_count: null,
                                                avatar: 'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                username: '10004 - Vũ  Thu Hà',
                                                created_user: null,
                                                created_date: '04/08/2022 15:32',
                                                news_comment_like_id: null,
                                                is_like: null,
                                                totalReply: null,
                                                child: {
                                                    parentId: '1',
                                                    totalReply: null,
                                                    items: [],
                                                },
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
                        name: 'news_id',
                        in: 'query',
                        description: 'news_id',
                        required: true,
                        type: 'integer',
                        default: 1,
                    },
                ],
            },
            post: {
                tags: ['News'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'create comments',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        comment_id: '5',
                                        comment_content: 'hông có chi nè hehe',
                                        image: '',
                                        reply_comment_id: 4,
                                        author: '10004',
                                        news_id: 1,
                                        username: '10004',
                                        created_user: '10004',
                                        is_active: 1,
                                        news_comment_like_id: null,
                                        is_like: null,
                                        avatar: null,
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
                        name: 'Body',
                        in: 'body',
                        required: true,
                        schema: {
                            properties: {
                                comment_content: {
                                    type: 'string',
                                    default: '',
                                },
                                image: {
                                    type: 'string',
                                },
                                reply_comment_id: {
                                    type: 'integer',
                                    default: null,
                                },
                                news_id: {
                                    type: 'integer',
                                    default: 1,
                                },
                                is_active: {
                                    type: 'integer',
                                    default: 1,
                                },
                            },
                        },
                    },
                ],
            },
        },
        '/news-comment/{commentID}': {
            get: {
                tags: ['News'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'detail  comments',
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
                                        news_id: 1,
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
                tags: ['News'],
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
                                        news_id: 1,
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
                                image: {
                                    type: 'string',
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
                tags: ['News'],
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
        '/news-comment/like-dislike': {
            post: {
                tags: ['News'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'like news comment',
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
        '/news-comment/reply': {
            get: {
                tags: ['News'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list reply comments news',
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
                                                reply_comment_id: '1',
                                                comment_id: '2',
                                                comment_content: 'dfdsafasd',
                                                author: '10004 - Vũ  Thu Hà',
                                                like_count: null,
                                                avatar: 'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                username: '10004',
                                                created_user: null,
                                                created_date: '12/08/2022 09:09',
                                                is_like: null,
                                                totalReply: 1,
                                                news_comment_like_id: null,
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
