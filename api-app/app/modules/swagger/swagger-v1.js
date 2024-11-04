const swagger_json = basePath => ({
    swagger: '2.0',
    info: {
        version: '1.0.0',
        title: 'SHOPDUNK API APP',
    },
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            scheme: 'bearer',
            in: 'header',
        },
    },
    basePath: '/' + basePath,
    comments: '/api/',
    tags: [
        {
            name: 'Auths',
            description: 'API for logins',
        },
        {
            name: 'Profiles',
            description: 'API for Profiles',
        },
        {
            name: 'Documents',
            description: 'API for Documents',
        },
        {
            name: 'Master',
            description: 'API for Master',
        },
        {
            name: 'Products',
            description: 'API for Products',
        },
        {
            name: 'CustomerLeads',
            description: 'API for Customer Leads',
        },
        {
            name: 'Commissions',
            description: 'API for Commissions',
        },
        {
            name: 'Tasks',
            description: 'API for Tasks',
        },
        {
            name: 'PaymentForm',
            description: 'API for Payment Form',
        },
        {
            name: 'Material',
            description: 'API for Material',
        },
    ],
    produces: ['application/json'],
    paths: {
        '/province/get-options': {
            get: {
                tags: ['Master'],
                summary: 'Profile information',
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
                                            id: 66,
                                            name: 'Thành phố Hà Nội',
                                            parent_id: 6,
                                        },
                                        {
                                            id: 67,
                                            name: 'Tỉnh Hà Giang',
                                            parent_id: 6,
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
                    400: {
                        description: 'Bad Request',
                    },
                },
                consumes: ['multipart/form-data'],
                parameters: [
                    {
                        name: 'parent_id',
                        in: 'query',
                        type: 'integer',
                        description: 'parent_id',
                    },
                    {
                        name: 'ids[]',
                        in: 'query',
                        type: 'array',
                        collectionFormat: 'multi',
                        description: 'ids',
                    },
                    {
                        name: 'isactive',
                        in: 'query',
                        type: 'integer',
                        default: 1,
                    },
                ],
            },
        },
        '/district/get-options': {
            get: {
                tags: ['Master'],
                summary: 'Profile information',
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
                                            id: 2,
                                            name: 'Quận 2',
                                            parent_id: 1,
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
                    400: {
                        description: 'Bad Request',
                    },
                },
                consumes: ['multipart/form-data'],
                parameters: [
                    {
                        name: 'parent_id',
                        in: 'query',
                        type: 'integer',
                        description: 'parent_id',
                    },
                    {
                        name: 'ids[]',
                        in: 'query',
                        type: 'array',
                        collectionFormat: 'multi',
                        description: 'ids',
                    },
                    {
                        name: 'isactive',
                        in: 'query',
                        type: 'integer',
                        default: 1,
                    },
                ],
            },
        },
        '/ward/get-options': {
            get: {
                tags: ['Master'],
                summary: 'Profile information',
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
                                            id: 4631,
                                            name: 'Phường Phúc Xá',
                                            parent_id: 4,
                                        },
                                        {
                                            id: 4632,
                                            name: 'Phường Trúc Bạch',
                                            parent_id: 4,
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
                    400: {
                        description: 'Bad Request',
                    },
                },
                consumes: ['multipart/form-data'],
                parameters: [
                    {
                        name: 'parent_id',
                        in: 'query',
                        type: 'integer',
                        description: 'parent_id',
                        required: true,
                        default: 4,
                    },
                    {
                        name: 'ids[]',
                        in: 'query',
                        type: 'array',
                        collectionFormat: 'multi',
                        description: 'ids',
                    },
                    {
                        name: 'isactive',
                        in: 'query',
                        type: 'integer',
                        default: 1,
                    },
                ],
            },
        },
        '/auth/token': {
            post: {
                tags: ['Auths'],
                summary: 'Login',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        tokenKey: 'Authorization',
                                        tokenType: 'Bearer',
                                        accessToken:
                                            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl9pZCI6IjA1ZmFlMGMwLTQ5MTItMTFlZC04Y2M5LTcxZDI5MTI5OTk5NiIsIm1lbWJlcl9pZCI6IjEwMTIzIiwidXNlcl9uYW1lIjoiMDk2Mzk2OTc4NyIsImZ1bGxfbmFtZSI6IkzDqiBWxakgVHJ1bmcgSGnhur91IiwiaWF0IjoxNjY1NDU3NzI3LCJleHAiOjE2NjU0NjEzMjd9.v0zPn3biAPPjH3ns_HiWR5BFnjt4cppOPFU_0sVyTa8',
                                        tokenExpireAt: 1665461280696,
                                        refreshToken:
                                            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl9pZCI6IjA1ZmFlMGMwLTQ5MTItMTFlZC04Y2M5LTcxZDI5MTI5OTk5NiIsIm1lbWJlcl9pZCI6IjEwMTIzIiwidXNlcl9uYW1lIjoiMDk2Mzk2OTc4NyIsImZ1bGxfbmFtZSI6IkzDqiBWxakgVHJ1bmcgSGnhur91IiwiaWF0IjoxNjY1NDU3NzI3LCJleHAiOjE2NjU1NDQxMjd9.ekVyoEFMW6y2z9ixlD9On_lkyzSuSaNkgYtWU22cB-E',
                                        refreshTokenExpireAt: 1665544080698,
                                    },
                                },
                                message: {
                                    type: 'string',
                                    default: 'Logged in successfully!',
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
                    name: 'Login',
                    in: 'body',
                    required: true,
                    description: '',
                    schema: {
                        type: 'object',
                        properties: {
                            user_name: {
                                type: 'string',
                                default: '10028',
                            },
                            password: {
                                type: 'string',
                                default: '123456',
                            },
                            platform: {
                                type: 'string',
                                default: 'mobile',
                            },
                            device_token: {
                                type: 'string',
                                default: 'xxx',
                            },
                            device_name: {
                                type: 'string',
                                default: 'Iphone 14 pro max 3 mat',
                            },
                        },
                    },
                },
            ],
        },
        '/auth/refresh-token': {
            post: {
                tags: ['Auths'],
                summary: 'Refesh Token',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        tokenKey: 'Authorization',
                                        tokenType: 'Bearer',
                                        accessToken:
                                            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl9pZCI6IjA1ZmFlMGMwLTQ5MTItMTFlZC04Y2M5LTcxZDI5MTI5OTk5NiIsIm1lbWJlcl9pZCI6IjEwMTIzIiwidXNlcl9uYW1lIjoiMDk2Mzk2OTc4NyIsImZ1bGxfbmFtZSI6IkzDqiBWxakgVHJ1bmcgSGnhur91IiwiaWF0IjoxNjY1NDU3NzI3LCJleHAiOjE2NjU0NjEzMjd9.v0zPn3biAPPjH3ns_HiWR5BFnjt4cppOPFU_0sVyTa8',
                                        tokenExpireAt: 1665461280696,
                                        refreshToken:
                                            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl9pZCI6IjA1ZmFlMGMwLTQ5MTItMTFlZC04Y2M5LTcxZDI5MTI5OTk5NiIsIm1lbWJlcl9pZCI6IjEwMTIzIiwidXNlcl9uYW1lIjoiMDk2Mzk2OTc4NyIsImZ1bGxfbmFtZSI6IkzDqiBWxakgVHJ1bmcgSGnhur91IiwiaWF0IjoxNjY1NDU3NzI3LCJleHAiOjE2NjU1NDQxMjd9.ekVyoEFMW6y2z9ixlD9On_lkyzSuSaNkgYtWU22cB-E',
                                        refreshTokenExpireAt: 1665544080698,
                                    },
                                },
                                message: {
                                    type: 'string',
                                    default: 'Request successfully!',
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
                            refreshToken: {
                                type: 'string',
                                default:
                                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl9pZCI6IjNjN2EyNzcwLTRhYzMtMTFlZC05ZTMyLWUzMTgwZDRiNjMxOCIsInVzZXJfaWQiOiJFRjlBMEE1MS0yMkQyLTRDNjUtOUVGRi1GNEE2QjhEM0U4RUUiLCJ1c2VyX25hbWUiOiIxMDAwNCIsImZ1bGxfbmFtZSI6IlbFqSAgVGh1IEjDoCIsImlzQWRtaW5pc3RyYXRvciI6MCwidXNlcl9jb21wYW5pZXMiOltdLCJpYXQiOjE2NjU2NDM3OTEsImV4cCI6MTY2NTY0NzM5MX0.cw5SrvW42DHeOMiwW3qZQEE-gd1eGVukNIJUIKYpct8',
                            },
                        },
                    },
                },
            ],
        },
        '/auth/logout': {
            post: {
                tags: ['Auths'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'logout',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'string',
                                    default: null,
                                },
                                message: {
                                    type: 'string',
                                    default: 'Logged out successfully!',
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
        '/auth/get-profile': {
            get: {
                tags: ['Profiles'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get profile',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        user_id: 'EF9A0A51-22D2-4C65-9EFF-F4A6B8D3E8EE',
                                        full_name: 'Vũ  Thu Hà',
                                        email: 'Vumonlinh@gmail.com',
                                        phone_number: '0345760668',
                                        address: 'hiến nam ',
                                        gender: 0,
                                        default_picture_url:
                                            'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                        user_name: '10004',
                                        first_name: 'Vũ ',
                                        last_name: 'Thu Hà',
                                        birthday: '28/07/1991',
                                        province_id: 86,
                                        district_id: 233,
                                        country_id: 6,
                                        department_id: 3,
                                        position_id: 3,
                                        ward_id: 9188,
                                        entry_date: '01/02/2021',
                                        province_name: 'Tỉnh Hưng Yên',
                                        district_name: 'Thành phố Hưng Yên',
                                        country_name: 'Việt Nam',
                                        ward_name: 'Phường Hiến Nam',
                                        department_name: 'Phòng Kinh Doanh',
                                        position_name: 'Nhân viên',
                                        business_name: 'Miền Ecopark',
                                        user_companies: null,
                                        isAdministrator: 0,
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
        '/user': {
            get: {
                tags: ['Profiles'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'List employees',
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
                                                user_id: '3BB62AB9-3E51-452F-9395-AD4F303AF0CA',
                                                user_name: '10035',
                                                full_name: 'Bùi Thanh Thoại',
                                                department_name: 'Phòng ban test',
                                                position_name: 'Trưởng phòng',
                                                default_picture_url:
                                                    'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                            },
                                            {
                                                user_id: '9BBEF571-4C44-471B-A634-4251DD157476',
                                                user_name: '10034',
                                                full_name: 'Nguyễn Bảo Sang',
                                                department_name: 'Phòng lập trình mobile',
                                                position_name: 'Nhân viên',
                                                default_picture_url:
                                                    'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                            },
                                        ],
                                        totalItems: 35,
                                        page: 1,
                                        totalPages: 2,
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
                        type: 'string',
                    },
                ],
            },
        },
        '/user/{userId}': {
            get: {
                tags: ['Profiles'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'Detail employees',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        user_id: 'EF9A0A51-22D2-4C65-9EFF-F4A6B8D3E8EE',
                                        full_name: 'Vũ  Thu Hà',
                                        email: 'Vumonlinh@gmail.com',
                                        phone_number: '0345760668',
                                        address: 'hiến nam ',
                                        gender: 0,
                                        default_picture_url:
                                            'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                        user_name: '10004',
                                        first_name: 'Vũ ',
                                        last_name: 'Thu Hà',
                                        birthday: '28/07/1991',
                                        province_id: 86,
                                        district_id: 233,
                                        country_id: 6,
                                        department_id: 3,
                                        position_id: 3,
                                        ward_id: 9188,
                                        entry_date: '01/02/2021',
                                        province_name: 'Tỉnh Hưng Yên',
                                        district_name: 'Thành phố Hưng Yên',
                                        country_name: 'Việt Nam',
                                        ward_name: 'Phường Hiến Nam',
                                        department_name: 'Phòng Kinh Doanh',
                                        position_name: 'Nhân viên',
                                        business_name: 'Miền Ecopark',
                                        user_companies: null,
                                        isAdministrator: 0,
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
                    name: 'userId',
                    type: 'string',
                    in: 'path',
                    required: true,
                    description: '',
                    default: 'EF9A0A51-22D2-4C65-9EFF-F4A6B8D3E8EE',
                },
            ],
        },
        '/user/notify': {
            put: {
                tags: ['Profiles'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'on off notify',
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
                                    type: 'string',
                                    default: 'notify is on',
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
        '/user/change-password': {
            put: {
                tags: ['Profiles'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'change password',
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
                                    default: 'Update password success.',
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
                            old_password: {
                                type: 'string',
                                default: '123456',
                            },
                            new_password: {
                                type: 'string',
                                default: '123456',
                            },
                            re_password: {
                                type: 'string',
                                default: '123456',
                            },
                        },
                    },
                },
            ],
        },
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
        '/timekeeping/shift-info': {
            get: {
                tags: ['Timekeepings'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get shift info',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        store_name: 'Văn phòng Hưng Yên',
                                        shift_date: 'Thứ 5, 13/10/2022',
                                        shift_time: '07:00',
                                        status_check_in: 0,
                                        start_time: '13/10/2022 07:00',
                                        end_time: '13/10/2022 13:00',
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
        '/timekeeping/checkinout': {
            post: {
                tags: ['Timekeepings'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'check in check out',
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
                    name: 'url_picture',
                    in: 'body',
                    description: 'current page',
                    required: true,
                    schema: {
                        type: 'object',
                        properties: {
                            url_picture: {
                                type: 'string',
                                default: 'string',
                            },
                        },
                    },
                },
            ],
        },
        '/timekeeping/management': {
            get: {
                tags: ['Timekeepings'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get List TimeKeeping',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        timekeeping_day: {
                                            day: 'Thứ 6, 14/10/2022',
                                            timekeeping_day_data: {
                                                time_start: '10:01',
                                                time_end: '10:03',
                                                total_time: 2,
                                            },
                                        },
                                        timekeeping_week: {
                                            day_range: '10/10/2022 - 16/10/2022',
                                            timekeeping_week_data: [
                                                {
                                                    timekeeping_date: 'Thứ 6, 14/10/2022',
                                                    time_start: '10:01',
                                                    time_end: '10:03',
                                                    shift_name: 'ca sáng',
                                                    shift_time: '07:00 - 13:00',
                                                    minute_check_in_late: 181,
                                                    minute_check_out_early: 177,
                                                },
                                            ],
                                        },
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
                parameters: [
                    {
                        name: 'timekeeping_date',
                        in: 'query',
                        description: 'timekeeping_date',
                        required: false,
                        type: 'string',
                    },
                ],
            },
        },
        '/timekeeping/statistics': {
            get: {
                tags: ['Timekeepings'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get statistics by month',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        month_year: '10/2022',
                                        total_work_day: 1,
                                        total_day_check_in_late: 1,
                                        total_day_check_out_early: 1,
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
        '/timekeeping/schedule': {
            get: {
                tags: ['Timekeepings'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get Schedule By day',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        schedule_of_day: {
                                            shift_date: 'Thứ 6, 14/10/2022',
                                            data: {
                                                shift_date: 'Thứ 6, 14/10/2022',
                                                time_start: '07:00',
                                                time_end: '13:00',
                                                shift_time: 359,
                                                shift_name: 'ca sáng',
                                                status_check_in: 2,
                                            },
                                        },
                                        schedule_of_week: {
                                            day_range: '10/10/2022 - 16/10/2022',
                                            items: [
                                                {
                                                    shift_date: 'Thứ 6, 14/10/2022',
                                                    time_start: '07:00',
                                                    time_end: '13:00',
                                                    shift_time: 359,
                                                    shift_name: 'ca sáng',
                                                    status_check_in: 2,
                                                },
                                            ],
                                        },
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
                parameters: [
                    {
                        name: 'shift_date',
                        in: 'query',
                        description: 'shift_date',
                        required: false,
                        type: 'string',
                    },
                ],
            },
        },
        '/store/check-ip': {
            get: {
                tags: ['Timekeepings'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'checkIp',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        store_id: 4,
                                        store_name: 'Văn phòng Hưng Yên',
                                        address_full:
                                            '779 Nguyễn Văn Linh, Phường Hiến Nam, Thành phố Hưng Yên, Tỉnh Hưng Yên',
                                        longitude: null,
                                        latitude: null,
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
        '/store/get-store-user': {
            get: {
                tags: ['Timekeepings'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'checkStore',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        store_id: '5',
                                        store_name: 'TT05',
                                        store_code: 'Văn phòng Ninh Bình',
                                        phone_number: '0336885335',
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
        '/file-manager/type-document': {
            get: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list documents type    ',
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
                ],
            },
        },
        '/file-manager/file': {
            get: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list documents   ',
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
                                                file_id: '1',
                                                directory_id: null,
                                                file_format: null,
                                                file_height: null,
                                                file_width: null,
                                                file_hash: null,
                                                file_ext: 'png',
                                                file_mime: 'image/png',
                                                file_url: '/file/92795ac8-da53-4e8f-8ec6-8cfeeac8222d.png',
                                                created_date: null,
                                                permission: 'edit|add|delete|view',
                                            },
                                        ],
                                        totalItems: 0,
                                        page: '1',
                                        totalPages: 0,
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
                ],
            },
            post: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'create file   ',
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
                consumes: ['multipart/form-data'],
                parameters: [
                    {
                        name: 'data',
                        in: 'formData',
                        type: 'object',
                        description: 'data',
                        default: {
                            is_view: 1,
                            is_add: 1,
                            is_edit: 1,
                            is_delete: 1,
                            is_owner: 1,
                            directory_name: '',
                            document_type_id: '1',
                            directory_id: '3',
                            is_share_all: 0,
                            is_active: 1,
                            file_name: [],
                        },
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
        },
        '/file-manager/directory': {
            get: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list directory   ',
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
                                                directory_id: '3',
                                                created_date: null,
                                                directory_name: 'string',
                                                parent_id: null,
                                                directory_owner: '10035',
                                                is_share_all: 1,
                                                is_directory: 1,
                                                is_delete: 1,
                                                is_add: 1,
                                                is_edit: 1,
                                                is_view: 1,
                                                is_owner: 1,
                                                document_type_id: 1,
                                            },
                                        ],
                                        totalItems: 0,
                                        page: '1',
                                        totalPages: 0,
                                        itemsPerPage: '100',
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
                        name: 'directory_id',
                        in: 'query',
                        description: 'directory_id page',
                        type: 'integer',
                    },
                    {
                        name: 'document_type_id',
                        in: 'query',
                        description: 'document_type_id',
                        type: 'integer',
                        default: 1,
                    },
                    {
                        name: 'key_word',
                        in: 'query',
                        description: 'key_word',
                        type: 'string',
                    },
                    {
                        name: 'is_sort_create_date',
                        in: 'query',
                        description: 'is_sort_create_date',
                        type: 'integer',
                    },
                    {
                        name: 'is_sort_name_dir',
                        in: 'query',
                        description: 'is_sort_name_dir',
                        type: 'integer',
                    },
                    {
                        name: 'is_sort_name_file',
                        in: 'query',
                        description: 'is_sort_name_file',
                        type: 'integer',
                    },
                ],
            },
        },
        '/file-manager/all': {
            get: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list all   ',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    parentFolder: {
                                        is_view: 1,
                                        is_add: 1,
                                        is_edit: 1,
                                        is_delete: 1,
                                        is_owner: 1,
                                        directory_name: 'Chính sách công ty',
                                        document_type_id: '1',
                                        directory_id: null,
                                    },
                                    pathItems: [],
                                    items: [
                                        {
                                            file_id: null,
                                            directory_id: '3',
                                            file_format: null,
                                            file_height: null,
                                            file_width: null,
                                            file_hash: null,
                                            file_ext: null,
                                            file_mime: null,
                                            file_url: null,
                                            created_date: '21/10/2022 11:55:32',
                                            directory_name: 'string',
                                            parent_id: null,
                                            directory_owner: '10035',
                                            is_share_all: 1,
                                            permission: null,
                                            is_file: 0,
                                            is_directory: 1,
                                            is_delete: 1,
                                            is_add: 1,
                                            is_edit: 1,
                                            is_view: 1,
                                            is_owner: 1,
                                            file_name: null,
                                            document_type_id: 1,
                                            file_tage_name: null,
                                            color: null,
                                            icon_url: null,
                                            is_tag: 0,
                                            file_tag_id: null,
                                            file_size: null,
                                            file_owner: null,
                                            full_name: 'Bùi Thanh Thoại',
                                            list_tag: [],
                                        },
                                    ],
                                    totalItems: 1,
                                    page: '1',
                                    totalPages: 1,
                                    itemsPerPage: '1',
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
                        name: 'directory_id',
                        in: 'query',
                        description: 'directory_id page',
                        type: 'integer',
                    },
                    {
                        name: 'document_type_id',
                        in: 'query',
                        description: 'document_type_id',
                        type: 'integer',
                        default: 1,
                    },
                    {
                        name: 'key_word',
                        in: 'query',
                        description: 'key_word',
                        type: 'string',
                    },
                    {
                        name: 'is_sort_create_date',
                        in: 'query',
                        description: 'is_sort_create_date',
                        type: 'integer',
                    },
                    {
                        name: 'is_sort_name_dir',
                        in: 'query',
                        description: 'is_sort_name_dir',
                        type: 'integer',
                    },
                    {
                        name: 'is_sort_name_file',
                        in: 'query',
                        description: 'is_sort_name_file',
                        type: 'integer',
                    },
                    {
                        name: 'is_move',
                        in: 'query',
                        description: 'is_move',
                        type: 'integer',
                    },
                ],
            },
        },
        '/file-manager/search-all': {
            get: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list directory   ',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        parentFolder: {},
                                        pathItems: [],
                                        items: [
                                            {
                                                file_id: null,
                                                directory_id: '3',
                                                file_format: null,
                                                file_height: null,
                                                file_width: null,
                                                file_hash: null,
                                                file_ext: null,
                                                file_mime: null,
                                                file_url: null,
                                                created_date: '21/10/2022 11:55:32',
                                                directory_name: 'string',
                                                parent_id: null,
                                                directory_owner: '10035',
                                                is_share_all: 1,
                                                permission: null,
                                                is_file: 0,
                                                is_directory: 1,
                                                is_delete: 1,
                                                is_add: 1,
                                                is_edit: 1,
                                                is_view: 1,
                                                is_owner: 1,
                                                file_name: null,
                                                document_type_id: 1,
                                                file_tage_name: null,
                                                color: null,
                                                icon_url: null,
                                                is_tag: 0,
                                                file_tag_id: null,
                                                file_size: null,
                                                file_owner: null,
                                                full_name: 'Bùi Thanh Thoại',
                                                list_tag: [],
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
                        name: 'directory_id',
                        in: 'query',
                        description: 'directory_id page',
                        type: 'integer',
                    },
                    {
                        name: 'document_type_id',
                        in: 'query',
                        description: 'document_type_id',
                        type: 'integer',
                        default: 1,
                    },
                    {
                        name: 'key_word',
                        in: 'query',
                        description: 'key_word',
                        type: 'string',
                    },
                    {
                        name: 'is_sort_create_date',
                        in: 'query',
                        description: 'is_sort_create_date',
                        type: 'integer',
                    },
                    {
                        name: 'is_sort_name_dir',
                        in: 'query',
                        description: 'is_sort_name_dir',
                        type: 'integer',
                    },
                    {
                        name: 'is_sort_name_file',
                        in: 'query',
                        description: 'is_sort_name_file',
                        type: 'integer',
                    },
                ],
            },
        },
        '/file-manager/dir': {
            post: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'create dir   ',
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
                        in: 'body',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                directory_id: {
                                    type: 'integer',
                                },
                                parent_id: {
                                    type: 'integer',
                                },
                                document_type_id: {
                                    type: 'integer',
                                },
                                directory_name: {
                                    type: 'string',
                                },
                                is_share_all: {
                                    type: 'integer',
                                },
                                is_active: {
                                    type: 'integer',
                                },
                            },
                        },
                    },
                ],
            },
        },
        '/file-manager/share-dir': {
            post: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'share dir  ',
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
                                    type: 'string',
                                    default: 'Chia sẻ thư mục thành công',
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
                        in: 'body',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                directory_id: {
                                    type: 'integer',
                                },
                                directory_share_id: {
                                    type: 'integer',
                                },
                                position_id: {
                                    type: 'integer',
                                },
                                user_group_id: {
                                    type: 'integer',
                                },
                                list_user: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        default: {
                                            user_name: '10004',
                                            is_read: 1,
                                            is_write: 0,
                                            is_delete: 0,
                                        },
                                    },
                                },
                                list_department: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        default: {
                                            department_id: '3',
                                            is_read: 1,
                                            is_write: 0,
                                            is_delete: 0,
                                        },
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        },
        '/file-manager/list-share': {
            get: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list share   ',
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
                                        items: {
                                            list_user: [
                                                {
                                                    file_id: null,
                                                    user_name: '10078',
                                                    is_read: 1,
                                                    is_write: 1,
                                                    is_delete: 1,
                                                    department_name: null,
                                                    department_id: null,
                                                    avatar: 'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                    full_name: 'Nguyễn Thị Bảo Trâm',
                                                },
                                                {
                                                    file_id: null,
                                                    user_name: '10004',
                                                    is_read: 1,
                                                    is_write: 0,
                                                    is_delete: 0,
                                                    department_name: null,
                                                    department_id: null,
                                                    avatar: 'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                    full_name: 'Vũ  Thu Hà',
                                                },
                                                {
                                                    file_id: null,
                                                    user_name: '10015',
                                                    is_read: 1,
                                                    is_write: 0,
                                                    is_delete: 0,
                                                    department_name: null,
                                                    department_id: null,
                                                    avatar: 'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
                                                    full_name: 'Nguyễn  Thị Thanh Ngân',
                                                },
                                            ],
                                            list_department: [
                                                {
                                                    file_id: null,
                                                    user_name: null,
                                                    is_read: 1,
                                                    is_write: 0,
                                                    is_delete: 0,
                                                    department_name: 'Phòng Kinh Doanh',
                                                    department_id: 3,
                                                    avatar: null,
                                                    full_name: null,
                                                },
                                                {
                                                    file_id: null,
                                                    user_name: null,
                                                    is_read: 1,
                                                    is_write: 0,
                                                    is_delete: 0,
                                                    department_name: 'Phòng Truyền Thông',
                                                    department_id: 4,
                                                    avatar: null,
                                                    full_name: null,
                                                },
                                            ],
                                        },
                                        totalItems: 0,
                                        page: '1',
                                        totalPages: 0,
                                        itemsPerPage: '100',
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
                        name: 'is_directory',
                        in: 'query',
                        description: 'is_directory ',
                        type: 'integer',
                    },
                    {
                        name: 'id',
                        in: 'query',
                        description: 'id',
                        type: 'integer',
                    },
                    {
                        name: 'key_word',
                        in: 'query',
                        description: 'key_word',
                        type: 'string',
                    },
                    {
                        name: 'is_sort_user_name',
                        in: 'query',
                        description: 'is_sort_user_name',
                        type: 'integer',
                    },
                ],
            },
        },
        '/file-manager/rename-dir': {
            put: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'rename dir  ',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        name_dir_old: 'string',
                                        name_dir_new: 'test đổi tên',
                                    },
                                },
                                message: {
                                    type: 'string',
                                    default: 'Chia sẻ thư mục thành công',
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
                        in: 'body',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                directory_id: {
                                    type: 'string',
                                },
                                directory_name: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                ],
            },
        },
        '/file-manager/move-dir': {
            put: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'move dir  ',
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
                                    type: 'string',
                                    default: 'Di chuyển thư mục thành công',
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
                        in: 'body',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                directory_id: {
                                    type: 'integer',
                                },
                                parent_id: {
                                    type: 'integer',
                                },
                            },
                        },
                    },
                ],
            },
        },
        '/file-manager/dir/{directory_id}': {
            delete: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'move dir  ',
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
                                    type: 'string',
                                    default: 'Xóa thư mục thành công',
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
                        name: 'directory_id',
                        in: 'path',
                        required: true,
                    },
                ],
            },
        },
        '/file-manager/share-file': {
            post: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'share file  ',
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
                                    type: 'string',
                                    default: 'Chia sẻ thư mục thành công',
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
                        in: 'body',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                file_id: {
                                    type: 'integer',
                                },
                                file_share_id: {
                                    type: 'integer',
                                },
                                position_id: {
                                    type: 'integer',
                                },
                                user_group_id: {
                                    type: 'integer',
                                },
                                list_user: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        default: {
                                            user_name: '10004',
                                            is_read: 1,
                                            is_write: 0,
                                            is_delete: 0,
                                        },
                                    },
                                },
                                list_department: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        default: {
                                            department_id: '3',
                                            is_read: 1,
                                            is_write: 0,
                                            is_delete: 0,
                                        },
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        },
        '/file-manager/infor-file/{file_id}': {
            get: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'info file  ',
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
                                            file_id: '2',
                                            file_mime: 'image/jpeg',
                                            file_url: '/file/c8940ea4-7639-46b0-9866-c501e5030d3d.jpeg',
                                            file_hash: null,
                                            file_ext: 'jpeg',
                                            file_size: 119245,
                                            file_name: 'c8940ea4-7639-46b0-9866-c501e5030d3d',
                                            file_tage_name: null,
                                            color: null,
                                            icon_url: null,
                                            created_date: '24/10/2022 17:34',
                                            created_user: '10035 - Bùi Thanh Thoại',
                                            updated_user: null,
                                            updated_date: null,
                                            is_delete: 1,
                                            is_edit: 1,
                                            is_tag: 0,
                                            file_tag_id: null,
                                            avatar: 'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
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
                parameters: [
                    {
                        name: 'file_id',
                        in: 'path',
                        required: true,
                        default: 2,
                    },
                ],
            },
        },
        '/file-manager/infor-file/{directory_id}': {
            get: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'info directory  ',
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
                                            file_id: '3',
                                            file_mime: 'image/jpeg',
                                            file_url: '/file/73c81e53-5d21-4927-8c39-a85de84cb06f.jpeg',
                                            file_hash: null,
                                            file_ext: 'jpeg',
                                            file_size: 119245,
                                            file_name: '73c81e53-5d21-4927-8c39-a85de84cb06f',
                                            file_tage_name: null,
                                            color: null,
                                            icon_url: null,
                                            created_date: '24/10/2022 17:34',
                                            created_user: '10035 - Bùi Thanh Thoại',
                                            updated_user: null,
                                            updated_date: null,
                                            is_delete: 1,
                                            is_edit: 1,
                                            is_tag: 0,
                                            file_tag_id: null,
                                            avatar: 'http://beshe-test.blackwind.vndata:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E',
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
                parameters: [
                    {
                        name: 'directory_id',
                        in: 'path',
                        required: true,
                        default: 3,
                    },
                ],
            },
        },
        '/file-manager/move-file': {
            put: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'move file  ',
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
                                    type: 'string',
                                    default: 'Di chuyển tập tin thành công',
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
                        in: 'body',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                file_id: {
                                    type: 'integer',
                                    default: 2,
                                },
                                directory_id: {
                                    type: 'integer',
                                    default: 3,
                                },
                            },
                        },
                    },
                ],
            },
        },
        '/file-manager/rename-file': {
            put: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'rename file  ',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        name_file_old: 'c8940ea4-7639-46b0-9866-c501e5030d3d',
                                        name_file_new: 'đổi tên nè',
                                    },
                                },
                                message: {
                                    type: 'string',
                                    default: 'thay đổi tên tập tin thành công',
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
                        in: 'body',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                file_id: {
                                    type: 'string',
                                    default: '2',
                                },
                                file_name: {
                                    type: 'string',
                                    default: 'đổi tên nè',
                                },
                            },
                        },
                    },
                ],
            },
        },
        '/file-manager/file/{file_id}': {
            delete: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'delete file  ',
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
                                    type: 'string',
                                    default: 'Xóa tập tin thành công',
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
                        name: 'file_id',
                        in: 'path',
                        required: true,
                    },
                ],
            },
        },
        '/file-manager/tag': {
            post: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'create tag   ',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        file_tag_type_id: 1,
                                    },
                                },
                                message: {
                                    type: 'string',
                                    default: 'Khởi tạo loại nhãn dán thành công',
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
                        in: 'body',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                file_tag_name: {
                                    type: 'string',
                                },
                                color: {
                                    type: 'string',
                                },
                                icon_url: {
                                    type: 'string',
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
            get: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get list tag   ',
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
                                                file_id: null,
                                                file_tag_id: 2,
                                                file_tage_name: 'hieu1',
                                                color: 'blue',
                                                icon_url: null,
                                            },
                                        ],
                                        totalItems: 0,
                                        page: '1',
                                        totalPages: 0,
                                        itemsPerPage: '10',
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
        '/file-manager/tag-file': {
            post: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'tag file ',
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
                                    type: 'string',
                                    default: 'Cập nhật nhãn tập tin thành công',
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
                        in: 'body',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                file_tag_id: {
                                    type: 'string',
                                },
                                file_id: {
                                    type: 'string',
                                },
                                is_tag: {
                                    type: 'integer',
                                    default: 1,
                                },
                            },
                        },
                    },
                ],
            },
        },
        '/file-manager/tag-dir': {
            post: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'tag dir ',
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
                                    type: 'string',
                                    default: 'Cập nhật nhãn tập tin thành công',
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
                        in: 'body',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                file_tag_id: {
                                    type: 'string',
                                },
                                directory_id: {
                                    type: 'string',
                                },
                                is_tag: {
                                    type: 'integer',
                                    default: 1,
                                },
                            },
                        },
                    },
                ],
            },
        },
        '/file-manager/tag/{file_tag_id}': {
            delete: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'delete tag  ',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'string',
                                    default: true,
                                },
                                message: {
                                    type: 'string',
                                    default: 'Xóa thành công.',
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
                        name: 'file_tag_id',
                        in: 'path',
                        required: true,
                    },
                ],
            },
        },
        '/file-manager/download-app/{file_id}': {
            get: {
                tags: ['Documents'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'download file   ',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        file_id: '2',
                                        file_mime: 'image/jpeg',
                                        file_url_app:
                                            'http://beshe-test.blackwind.vn/file/c8940ea4-7639-46b0-9866-c501e5030d3d.jpeg',
                                        file_ext: 'jpeg',
                                        file_size: 119245,
                                        file_name: 'đổi tên nè',
                                        created_user: '10035 - Bùi Thanh Thoại',
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
                        name: 'file_id',
                        in: 'path',
                        description: 'file_id',
                        required: true,
                        type: 'integer',
                        default: 1,
                    },
                ],
            },
        },
        '/product': {
            get: {
                tags: ['Products'],
                security: [
                    {
                        bearerAuth: [
                            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl9pZCI6IjA1ZmFlMGMwLTQ5MTItMTFlZC04Y2M5LTcxZDI5MTI5OTk5NiIsIm1lbWJlcl9pZCI6IjEwMTIzIiwidXNlcl9uYW1lIjoiMDk2Mzk2OTc4NyIsImZ1bGxfbmFtZSI6IkzDqiBWxakgVHJ1bmcgSGnhur91IiwiaWF0IjoxNjY1NDU3NzI3LCJleHAiOjE2NjU0NjEzMjd9.v0zPn3biAPPjH3ns_HiWR5BFnjt4cppOPFU_0sVyTa8',
                        ],
                    },
                ],
                summary: 'get list products',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: [
                                        {
                                            product_id: '70',
                                            product_code: 'CCS00007',
                                            product_display_name: 'TINH DẦU SẢ 10 ML',
                                            product_name: 'TINH DẦU SẢ 10 ML',
                                            product_picture: '',
                                            product_inventory: 'TINH DẦU',
                                            product_price: 100000,
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
                        type: 'integer',
                        description: 'itemsPerPage',
                        default: 25,
                    },
                    {
                        name: 'search',
                        in: 'query',
                        type: 'string',
                        description: 'search',
                    },
                ],
            },
        },
        '/customer-lead': {
            post: {
                tags: ['CustomerLeads'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'customer lead',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'string',
                                    default: null,
                                },
                                message: {
                                    type: 'string',
                                    default: 'Logged out successfully!',
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
                        in: 'body',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                full_name: {
                                    type: 'string',
                                    default: 'Nguyễn Hữu Toàn',
                                },
                                phone_number: {
                                    type: 'string',
                                    default: '0349328378',
                                },
                                product_favorite_list: {
                                    type: 'array',
                                    default: [
                                        {
                                            product_id: 1,
                                        },
                                        {
                                            product_id: 2,
                                        },
                                        {
                                            product_id: 3,
                                        },
                                    ],
                                },
                            },
                        },
                    },
                ],
            },
        },
        '/commission': {
            get: {
                tags: ['Commissions'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get commission by user',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: [
                                        {
                                            order_commission_id: 111,
                                            order_no: 'DH230523003',
                                            commission_value: 769500,
                                            order_date: '23/05/2023',
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
                parameters: [
                    {
                        page: 'page',
                        in: 'query',
                        type: 'integer',
                        description: 'page',
                        default: 1,
                    },
                    {
                        name: 'itemsPerPage',
                        in: 'query',
                        type: 'integer',
                        description: 'itemsPerPage',
                        default: 25,
                    },
                    {
                        name: 'search',
                        in: 'query',
                        type: 'string',
                        description: 'search',
                    },
                ],
            },
        },
        '/commission/user/{order_commission_id}': {
            get: {
                tags: ['Commissions'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'detail user commission',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: [
                                        {
                                            order_commission_id: null,
                                            commission_value: 1239750,
                                            order_date: '23/05/2023',
                                            order_no: 'DH230523003',
                                            order_id: '38',
                                            customer_full_name: 'Vuong ne',
                                            customer_phone_number: null,
                                            customer_email: null,
                                            customer_avatar: '',
                                            priorities: [
                                                {
                                                    product_id: '10107',
                                                    product_name:
                                                        'iPhone 14 Pro Max - 256GB - Deep Purple - I14PM256DP',
                                                    price: 15000000,
                                                    order_no: null,
                                                    quantity: 1,
                                                    attribute_name: 'Màu sắc1',
                                                    attribute_values: 'Xanh',
                                                },
                                            ],
                                        },
                                    ],
                                },
                                message: {
                                    type: 'string',
                                    default: 'Lấy thông tin thành công.',
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
                        name: 'order_commission_id',
                        in: 'path',
                        required: true,
                        type: 'integer',
                        default: 2,
                    },
                ],
            },
        },
        '/return-policy/product/{product_imei_code}': {
            get: {
                tags: ['ReturnPolicy'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'Product details',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: [
                                        {
                                            product_id: '10164',
                                            product_name: 'Sản phẩm của Thành nha',
                                            image_url: '/file/b5786e20-4223-406b-888c-0d8158da4687.jpeg',
                                            price: 100,
                                            color_list: [
                                                {
                                                    id: 27,
                                                    name: 'Đỏ',
                                                },
                                            ],
                                            return_policy_list: [
                                                {
                                                    id: 1,
                                                    name: 'Đổi hàng do lỗi',
                                                    return_condition_list: [
                                                        {
                                                            id: 1,
                                                            name: 'Sản phẩm lỗi phần cứng',
                                                        },
                                                        {
                                                            id: 2,
                                                            name: 'Sản phẩm còn đầy đủ hộp, phụ kiện đi kèm',
                                                        },
                                                        {
                                                            id: 3,
                                                            name: 'Sản phẩm không bị vào nước',
                                                        },
                                                    ],
                                                },
                                                {
                                                    id: 2,
                                                    name: 'Đổi hàng do không thích',
                                                    return_condition_list: [
                                                        {
                                                            id: 1,
                                                            name: 'Sản phẩm lỗi phần cứng',
                                                        },
                                                    ],
                                                },
                                                {
                                                    id: 3,
                                                    name: 'Trả hàng do lỗi',
                                                    return_condition_list: [
                                                        {
                                                            id: null,
                                                            name: null,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                message: {
                                    type: 'string',
                                    default: 'Lấy sản phẩm thành công.',
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
                        name: 'product_imei_code',
                        in: 'path',
                        required: true,
                        default: 'MCT003',
                    },
                ],
            },
        },
        '/return-policy/order': {
            get: {
                tags: ['ReturnPolicy'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'List products return policy',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: [
                                        {
                                            product_id: '10164',
                                            product_name: 'Sản phẩm của Thành nha',
                                            price: 100,
                                            quantity: 1,
                                            image_url: '/file/b5786e20-4223-406b-888c-0d8158da4687.jpeg',
                                        },
                                        {
                                            product_id: '10164',
                                            product_name: 'Sản phẩm của Thành nha',
                                            price: null,
                                            quantity: 1,
                                            image_url: '/file/b5786e20-4223-406b-888c-0d8158da4687.jpeg',
                                        },
                                    ],
                                },
                                message: {
                                    type: 'string',
                                    default: 'Lấy hóa đơn sản phẩm thành công.',
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
                        name: 'order_no',
                        in: 'path',
                        required: true,
                        default: 'DH230715014',
                    },
                ],
            },
        },
        '/payment-form/get-by-store': {
            get: {
                tags: ['PaymentForm'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get payment form by store',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: [
                                        {
                                            payment_form_id: 5,
                                            payment_form_name: 'hinh thuc 2 ',
                                            payment_form_code: 'HT22345',
                                            payment_type: 1,
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
                parameters: [
                    {
                        name: 'store_id',
                        in: 'query',
                        type: 'string',
                        description: 'store_id',
                    },
                ],
            },
        },
        '/material': {
            get: {
                tags: ['Material'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get material',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: [
                                        {
                                            material_id: '20',
                                            material_name: ' Túi giấy 12cm x 10cm',
                                            material_code: ' I14P256DP',
                                            material_group_name: 'Hộp',
                                            manufacture_name: 'SAM SUNG',
                                            number: 12,
                                            picture_url:
                                                'http://shopdunk-test.blackwind.vn/file/3037e9f5-faee-4ace-aaa3-d4222fa556bb.jpeg',
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
                parameters: [
                    {
                        name: 'search',
                        in: 'query',
                        type: 'string',
                        description: 'search',
                    },
                    {
                        name: 'page',
                        in: 'query',
                        type: 'string',
                        description: 'page',
                    },
                    {
                        name: 'itemsPerPage',
                        in: 'query',
                        type: 'string',
                        description: 'itemsPerPage',
                    },
                ],
            },
        },
        '/material/get-by-product': {
            get: {
                tags: ['Material'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get material by product',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: [
                                        {
                                            material_id: '20',
                                            material_name: ' Túi giấy 12cm x 10cm',
                                            material_code: ' I14P256DP',
                                            material_group_name: 'Hộp',
                                            manufacture_name: 'SAM SUNG',
                                            number: 12,
                                            picture_url:
                                                'http://shopdunk-test.blackwind.vn/file/3037e9f5-faee-4ace-aaa3-d4222fa556bb.jpeg',
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
                parameters: [
                    {
                        store_id: 'product_id',
                        in: 'query',
                        type: 'string',
                        description: 'product_id',
                    },
                ],
            },
        },
        '/task-detail-meeting': {
            get: {
                tags: ['TaskDetailMeeting'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get task detail meeting',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: [
                                        {
                                            data_leads_meeting_id: '7',
                                            full_name: 'Thanh Tri',
                                            phone_number: '0908757899',
                                            image_avatar: null,
                                            event_start_date_time: '30/06/2023 11:34',
                                            event_end_date_time: '30/06/2023 11:39',
                                            created_date: '21/06/2023',
                                            work_flow_code: 'buoc123111',
                                            is_coming: 0,
                                        },
                                        {
                                            data_leads_meeting_id: '8',
                                            full_name: 'Thanh Tri',
                                            phone_number: '0908757899',
                                            image_avatar: null,
                                            event_start_date_time: '30/06/2023 23:37',
                                            event_end_date_time: '30/06/2023 23:43',
                                            created_date: '21/06/2023',
                                            work_flow_code: 'buoc123111',
                                            is_coming: 0,
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
                parameters: [
                    {
                        name: 'store_id',
                        in: 'query',
                        type: 'string',
                        description: 'store_id',
                    },
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
                        default: 25,
                    },
                    {
                        name: 'search',
                        in: 'query',
                        description: 'search',
                        type: 'string',
                    },
                    {
                        name: 'date_from',
                        in: 'query',
                        description: 'date_from',
                        type: 'string',
                    },
                    {
                        name: 'date_to',
                        in: 'query',
                        description: 'date_to',
                        type: 'string',
                    },
                ],
            },
            patch: {
                tags: ['TaskDetailMeeting'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'Update detail task detail meeting',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: [
                                        {
                                            meeting_id: 1,
                                            content_meeting: 'New content',
                                            task_work_flow_id: 33,
                                            is_coming: 1,
                                            favorite_product_ids: [
                                                {product_id: 1, model_id: 1},
                                                {product_id: 2, model_id: 2},
                                            ],
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
                parameters: [],
            },
        },
        '/task-detail-meeting/detail/{meeting_id}': {
            get: {
                tags: ['TaskDetailMeeting'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'get detail task detail meeting',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: [
                                        {
                                            data_leads_meeting_id: '1',
                                            full_name: 'Thanh Tri',
                                            phone_number: '0908757899',
                                            image_avatar: null,
                                            event_start_date_time: '08/06/2023 15:47',
                                            event_end_date_time: '08/06/2023 16:48',
                                            user_name: '10025 - Trần Cao Vỹ',
                                            work_flow_name: 'bước 7',
                                            work_flow_code: 'buoc123111',
                                            type_name: 'Chăm sóc KH tại cửa hàng',
                                            content_meeting: 'New content',
                                            task_detail_id: '31',
                                            is_coming: 1,
                                            favorite_product_list: [
                                                {
                                                    product_id: '1',
                                                    product_code: '1',
                                                    product_name: 'Vảy mồi',
                                                },
                                                {
                                                    product_id: '2',
                                                    product_code: '2',
                                                    product_name: 'Vảy mồicopy',
                                                },
                                                {
                                                    product_id: '3',
                                                    product_code: '3',
                                                    product_name: 'Cần câu',
                                                },
                                            ],
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
                parameters: [],
            },
        },
        '/task-detail-meeting/task-work-flow': {
            get: {
                tags: ['TaskDetailMeeting'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'Get list task work flow',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: [
                                        {
                                            task_work_flow_id: 33,
                                            work_flow_name: 'bước 7',
                                            work_flow_code: 'buoc123111',
                                        },
                                        {
                                            task_work_flow_id: 32,
                                            work_flow_name: 'bước 6',
                                            work_flow_code: 'buoc12311',
                                        },
                                        {
                                            task_work_flow_id: 34,
                                            work_flow_name: 'bước 12',
                                            work_flow_code: 'buoc1',
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
                parameters: [
                    {
                        name: 'task_detail_id',
                        in: 'query',
                        description: 'task_detail_id',
                        type: 'string',
                    },
                ],
            },
        },
        '/products': {
            get: {
                tags: ['TaskDetailMeeting'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'Get list product',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: [
                                        {
                                            product_id: '10181',
                                            product_name: 'test test 9',
                                            product_code: 'TESTTEST009',
                                            image_url: '/file/80b855ad-940a-448e-b2e0-8bf901d405d4.jpeg',
                                        },
                                        {
                                            product_id: '10180',
                                            product_name: 'test test 8',
                                            product_code: 'TESTTEST008',
                                            image_url: '/file/d50e33d8-2e43-42a0-98b7-046f43dcea54.jpeg',
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
                        default: 25,
                    },
                    {
                        name: 'search',
                        in: 'query',
                        description: 'search',
                        type: 'string',
                    },
                ],
            },
        },
        '/hobbies-options': {
            get: {
                tags: ['Hobbies'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'Get hobbies options',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: [
                                        {
                                            hobbies_id: 10,
                                            hobbies_name: 'Màu sắc',
                                        },
                                        {
                                            hobbies_id: 11,
                                            hobbies_name: 'Màu sắc 4',
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
                parameters: [
                    {
                        name: 'search',
                        in: 'query',
                        description: 'search',
                        type: 'string',
                    },
                ],
            },
        },
        '/source-options': {
            get: {
                tags: ['Customer'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'Get source options',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: [
                                        {
                                            source_id: 5,
                                            source_name: 'Website',
                                        },
                                        {
                                            source_id: 6,
                                            source_name: 'Zalo',
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
                parameters: [
                    {
                        name: 'search',
                        in: 'query',
                        description: 'search',
                        type: 'string',
                    },
                ],
            },
        },
    },
});

module.exports = {
    swagger_json,
};
