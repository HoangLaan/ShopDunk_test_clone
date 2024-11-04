const swagger_json = basePath => ({
    swagger: '2.0',
    info: {
        version: '1.0.0',
        title: 'SHOPDUNK API WEB',
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
            name: 'Point',
            description: 'API get Point',
        }
    ],
    produces: ['application/json'],
    paths: {
        '/global/get-full-name': {
            get: {
                tags: ['Point'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: 'Profile information',
                responses: {
                    200: {
                        description: 'ok',
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    default: {
                                        address_full: "Phường Trúc Bạch, Quận Ba Đình, Thành phố Hà Nội, Việt Nam",
                                        current_point: 10,
                                        customer_code: "KH0230612",
                                        customer_type_name: "Khách hàng Tiềm Năng",
                                        email: "Mail@gmail.com",
                                        full_name: "Name",
                                        phone_number: "0123456789",
                                        user_name: "user_name",
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
                    400: {
                        description: 'Bad Request',
                    },
                },
                parameters: [
                    {
                        name: 'type',
                        in: 'query',
                        type: 'integer',
                        description: 'type',
                        default: 2,
                    },
                    {
                        name: 'value_query',
                        in: 'query',
                        type: 'string',
                        description: 'Phone number',
                        default: '0865998931',
                    },
                ],
            },
        },
    }
})

module.exports = {
    swagger_json,
};