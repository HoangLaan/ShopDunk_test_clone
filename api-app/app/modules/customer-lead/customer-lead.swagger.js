module.exports = {
    tag: {
        name: 'CustomerLeads',
        description: 'API for Customer Leads',
    },
    paths: {
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
                                            value: 1,
                                        },
                                        {
                                            value: 2,
                                        },
                                        {
                                            value: 3,
                                        },
                                    ],
                                },
                            },
                        },
                    },
                ],
            },
        },
    },
};
