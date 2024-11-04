module.exports = {
    tag: {
        name: 'Off-works',
        description: 'API for Off-works',
    },
    paths: {
        '/off-work-type/get-options': {
            get: {
                tags: ['Off-works'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get options',
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
                                            id: 1,
                                            name: 'Nghỉ phép năm <3 ngày',
                                            is_auto_review: 0,
                                            before_day: 1,
                                            is_sub_time_off: 1,
                                            is_hours: 0,
                                            is_day: 1,
                                            values_off: 1,
                                            max_day_off: 1,
                                        },
                                        {
                                            id: 2,
                                            name: 'Nghỉ phép năm >=3 ngày',
                                            is_auto_review: 0,
                                            before_day: 3,
                                            is_sub_time_off: 1,
                                            is_hours: 0,
                                            is_day: 1,
                                            values_off: 1,
                                            max_day_off: 0,
                                        },
                                        {
                                            id: 3,
                                            name: 'Nghỉ không lương <3 ngày',
                                            is_auto_review: 0,
                                            before_day: 1,
                                            is_sub_time_off: 0,
                                            is_hours: 0,
                                            is_day: 1,
                                            values_off: 1,
                                            max_day_off: 0,
                                        },
                                        {
                                            id: 4,
                                            name: 'Nghỉ không lương <=3 ngày',
                                            is_auto_review: 0,
                                            before_day: 3,
                                            is_sub_time_off: 0,
                                            is_hours: 0,
                                            is_day: 1,
                                            values_off: 1,
                                            max_day_off: 0,
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
        '/off-work-type/{off_work_type_id}/review-level-user': {
            get: {
                tags: ['Off-works'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'review level user',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        items: [
                                            {
                                                offwork_review_level_name: 'Trưởng phòng',
                                                offwork_review_level_id: 10,
                                                company_id: null,
                                                users: [
                                                    {
                                                        full_name: 'Bùi Thanh Thoại',
                                                        username: '10035',
                                                        user_id: '3BB62AB9-3E51-452F-9395-AD4F303AF0CA',
                                                        default_picture_url:
                                                            'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                        company_id: null,
                                                    },
                                                    {
                                                        full_name: 'Dương Ngọc Hà',
                                                        username: '10029',
                                                        user_id: '6A6E2CF9-CB43-42FC-9178-C5CA2C415575',
                                                        default_picture_url:
                                                            'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                        company_id: null,
                                                    },
                                                    {
                                                        full_name: 'Bùi Thị Thủy',
                                                        username: '10028',
                                                        user_id: 'E83555A7-ECB0-421E-9E66-91E54C68E3FB',
                                                        default_picture_url:
                                                            'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                        company_id: null,
                                                    },
                                                    {
                                                        full_name: 'Trần Cao Vỹ',
                                                        username: '10025',
                                                        user_id: '18AE9EFC-FA40-4741-820D-08268E1C2DB1',
                                                        default_picture_url:
                                                            'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                        company_id: null,
                                                    },
                                                ],
                                                is_auto_review: 0,
                                            },
                                            {
                                                offwork_review_level_name: 'HCNS',
                                                offwork_review_level_id: 11,
                                                company_id: null,
                                                users: [
                                                    {
                                                        full_name: 'Nguyễn Thị Phi Yến',
                                                        username: '10026',
                                                        user_id: 'A9AB7024-3E88-4104-BD5C-118886D31AEA',
                                                        default_picture_url:
                                                            'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                        company_id: null,
                                                    },
                                                    {
                                                        full_name: 'Bùi Thị Thủy',
                                                        username: '10028',
                                                        user_id: 'E83555A7-ECB0-421E-9E66-91E54C68E3FB',
                                                        default_picture_url:
                                                            'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                        company_id: null,
                                                    },
                                                    {
                                                        full_name: 'Hoàng Phương Minh',
                                                        username: '10027',
                                                        user_id: '6AF289C6-6C13-4CD9-B370-C0DAC33ACFA3',
                                                        default_picture_url:
                                                            'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                        company_id: null,
                                                    },
                                                ],
                                                is_auto_review: 0,
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
                    name: 'off_work_type_id',
                    type: 'integer',
                    in: 'path',
                    required: true,
                    description: '',
                    default: '1',
                },
            ],
        },
        '/off-work/me/total-day-offwork': {
            get: {
                tags: ['Off-works'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'total day off work',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        total_time: 0,
                                        total_time_off: 0,
                                        time_can_off: 0,
                                        is_can_review: 0,
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
        '/off-work': {
            get: {
                tags: ['Off-works'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list offwork    ',
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
                        name: 'search',
                        in: 'query',
                        description: 'search',
                        required: false,
                        type: 'string',
                    },
                    {
                        name: 'status',
                        in: 'query',
                        description: 'status (is_approved)',
                        required: false,
                        type: 'integer',
                    },
                    {
                        name: 'type',
                        in: 'query',
                        description: 'type (off_work_type_id)',
                        required: false,
                        type: 'integer',
                    },
                    {
                        name: 'month',
                        in: 'query',
                        description: 'month',
                        required: false,
                        type: 'integer',
                    },
                ],
            },
            post: {
                tags: ['Off-works'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'create offwork',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'integer',
                                    default: 22,
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
                        name: 'body',
                        in: 'body',
                        required: true,
                        description: '',
                        schema: {
                            type: 'object',
                            properties: {
                                fromdate: {
                                    type: 'string',
                                    default: '19/10/2022',
                                },
                                todate: {
                                    type: 'string',
                                    default: '30/10/2022',
                                },
                                content_off_work: {
                                    type: 'string',
                                    default: 'có việc bận',
                                },
                                off_work_type_id: {
                                    type: 'integer',
                                    default: 1,
                                },
                                is_refuse: {
                                    type: 'integer',
                                    default: 0,
                                },
                                refuse_id: {
                                    type: 'integer',
                                    default: null,
                                },
                                total_time_off: {
                                    type: 'integer',
                                    default: 3,
                                },
                                offwork_review_list: {
                                    type: 'array',
                                    default: [
                                        {
                                            user_review: 10025,
                                            offwork_review_level_id: 10,
                                            is_auto_review: 0,
                                        },
                                    ],
                                },
                            },
                        },
                    },
                ],
            },
        },
        '/off-work/user-refuse': {
            get: {
                tags: ['Off-works'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'users refuse',
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
                                            id: '10017',
                                            name: '10017-Lê  Thị Ngọc Ánh',
                                            department_name: 'Phòng Kinh Doanh',
                                            default_picture_url:
                                                'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                        },
                                        {
                                            id: '10021',
                                            name: '10021-Hoàng  Đình Chiến',
                                            department_name: 'Phòng Kinh Doanh',
                                            default_picture_url:
                                                'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                        },
                                        {
                                            id: '10013',
                                            name: '10013-Nguyễn  Thanh Hà ',
                                            department_name: 'Phòng Kinh Doanh',
                                            default_picture_url:
                                                'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                        },
                                        {
                                            id: '10024',
                                            name: '10024-Đào  Tùng lâm',
                                            department_name: 'Phòng Kinh Doanh',
                                            default_picture_url:
                                                'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                        },
                                        {
                                            id: '10022',
                                            name: '10022-Nguyễn Thanh Thuận',
                                            department_name: 'Phòng Kinh Doanh',
                                            default_picture_url:
                                                'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                        },
                                        {
                                            id: '10011',
                                            name: '10011-Ngô  Ánh Nhi',
                                            department_name: 'Phòng Kinh Doanh',
                                            default_picture_url:
                                                'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                        },
                                        {
                                            id: '10003',
                                            name: '10003-Vũ  Thị Chi',
                                            department_name: 'Phòng Kinh Doanh',
                                            default_picture_url:
                                                'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                        },
                                        {
                                            id: '10020',
                                            name: '10020-Đào  Mạnh Tân',
                                            department_name: 'Phòng Kinh Doanh',
                                            default_picture_url:
                                                'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                        },
                                        {
                                            id: '10015',
                                            name: '10015-Nguyễn  Thị Thanh Ngân',
                                            department_name: 'Phòng Kinh Doanh',
                                            default_picture_url:
                                                'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                        },
                                        {
                                            id: '10019',
                                            name: '10019-Vi  Thanh Huyền',
                                            department_name: 'Phòng Kinh Doanh',
                                            default_picture_url:
                                                'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                        },
                                        {
                                            id: '10008',
                                            name: '10008-Cầm  Thị Huyền',
                                            department_name: 'Phòng Kinh Doanh',
                                            default_picture_url:
                                                'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                        },
                                        {
                                            id: '10016',
                                            name: '10016-Đinh  Thị Thùy Dương',
                                            department_name: 'Phòng Kinh Doanh',
                                            default_picture_url:
                                                'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                        },
                                        {
                                            id: '10006',
                                            name: '10006-Đỗ  Thị Hiên',
                                            department_name: 'Phòng Kinh Doanh',
                                            default_picture_url:
                                                'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
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
        '/off-work/review': {
            get: {
                tags: ['Off-works'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'review',
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
                                                off_work_id: 13,
                                                is_approve: 2,
                                                from_date: '09/08/2022',
                                                to_date: '09/08/2022',
                                                total_time_off: 1,
                                                department_name: 'Phòng ban test',
                                                default_picture_url:
                                                    'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                created_date: '09/08/2022',
                                                full_name: '10035-Bùi Thanh Thoại',
                                                off_work_type_name: 'Nghỉ phép năm <3 ngày',
                                                content_off_work: 'Test phép nèo',
                                                review_note: null,
                                                review_date: null,
                                            },
                                        ],
                                        totalItems: 8,
                                        page: '1',
                                        totalPages: 8,
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
                {
                    name: 'month',
                    in: 'query',
                    description: 'month',
                    required: false,
                    type: 'integer',
                },
                {
                    name: 'status',
                    in: 'query',
                    description: 'status',
                    required: false,
                    type: 'integer',
                },
            ],
        },
        '/off-work/{offWorkId}/review': {
            get: {
                tags: ['Off-works'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'offwork detail',
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
                                                off_work_id: 13,
                                                is_approve: 2,
                                                from_date: '09/08/2022',
                                                to_date: '09/08/2022',
                                                total_time_off: 1,
                                                department_name: 'Phòng ban test',
                                                default_picture_url:
                                                    'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                created_date: '09/08/2022',
                                                full_name: '10035-Bùi Thanh Thoại',
                                                off_work_type_name: 'Nghỉ phép năm <3 ngày',
                                                content_off_work: 'Test phép nèo',
                                                review_note: null,
                                                review_date: null,
                                            },
                                        ],
                                        totalItems: 8,
                                        page: '1',
                                        totalPages: 8,
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
                    name: 'offWorkId',
                    in: 'path',
                    description: 'offWorkId',
                    required: true,
                    type: 'integer',
                    default: 1,
                },
            ],
        },
        '/off-work/{offWorkId}': {
            get: {
                tags: ['Off-works'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'offwork detail',
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
                                                off_work_id: 13,
                                                is_approve: 2,
                                                from_date: '09/08/2022',
                                                to_date: '09/08/2022',
                                                total_time_off: 1,
                                                department_name: 'Phòng ban test',
                                                default_picture_url:
                                                    'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                created_date: '09/08/2022',
                                                full_name: '10035-Bùi Thanh Thoại',
                                                off_work_type_name: 'Nghỉ phép năm <3 ngày',
                                                content_off_work: 'Test phép nèo',
                                                review_note: null,
                                                review_date: null,
                                            },
                                        ],
                                        totalItems: 8,
                                        page: '1',
                                        totalPages: 8,
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
                    name: 'offWorkId',
                    in: 'path',
                    description: 'offWorkId',
                    required: true,
                    type: 'integer',
                    default: 1,
                },
            ],
        },
        '/off-work/{offWorkId}/approved-review-list': {
            put: {
                tags: ['Off-works'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'approve offWork',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'integer',
                                    default: 22,
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
                        name: 'body',
                        in: 'body',
                        required: true,
                        description: '',
                        schema: {
                            type: 'object',
                            properties: {
                                is_review: {
                                    type: 'integer',
                                    default: 1,
                                },
                                review_note: {
                                    type: 'string',
                                    default: '',
                                },
                                off_work_review_list_id: {
                                    type: 'integer',
                                },
                            },
                        },
                    },
                    {
                        name: 'offWorkId',
                        in: 'path',
                        description: 'offWorkId',
                        required: true,
                    },
                ],
            },
        },
    },
};
