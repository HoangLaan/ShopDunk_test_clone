module.exports = {
    tag: {
        name: 'Timekeepings',
        description: 'API for Timekeepings',
    },
    paths: {
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
    },
};
