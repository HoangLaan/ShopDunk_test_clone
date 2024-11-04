module.exports = {
    tag: {
        name: 'Tasks',
        description: 'API for Customer Leads',
    },
    paths: {
        '/task/task-type-auto/get-options': {
            get: {
                tags: ['Tasks'],
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
                                    default: [
                                      {
                                        "id": 42,
                                        "name": "Chăm sóc khách hàng Working",
                                        "parent_id": 0
                                      }
                                  ],
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
                      in: 'query',
                      description: 'current page',
                      type: 'integer',
                      default: 1,
                  },
                  {
                      name: 'itemsPerPage',
                      in: 'query',
                      description: 'itemsPerPage',
                      type: 'integer',
                      default: 25,
                  },
                  {
                      name: 'keyword',
                      in: 'query',
                      description: 'keyword',
                      required: false,
                      type: 'string',
                  },
              ],
            },
        },
    },
};
