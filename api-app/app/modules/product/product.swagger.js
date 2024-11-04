module.exports = {
    tag: {
        name: 'Products',
        description: 'API for Products',
    },
    paths: {
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
    },
};
