const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    member_point_id: '{{#? MEMBERPOINTID}}',
    member_id: '{{#? MEMBERID}}',
    current_point: '{{#? CURRENTPOINT}}',
    logo_url: [
        {
            '{{#if LOGOURL}}': `${config.domain_cdn}{{LOGOURL}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
    expoint_id: '{{#? EXPOINTID}}',
    expoint_name: '{{#? EXPOINTNAME}}',
    value: '{{#? VALUE}}',
    max_expoint: '{{#? MAXEXPOINT}}',
    point: '{{#? POINT}}',
    plus_point: '{{#? PLUSPOINT}}',
    sub_point: '{{#? SUBPOINT}}',
    total_point: '{{#? TOTALPOINT}}',
    create_date: '{{#? CREATEDDATE}}',
    sum_total_point: '{{#? SUMTOTALPOINT}}',
    sum_current_point: '{{#? SUMCURRENTPOINT}}',
    title: '{{#? TITLE}}',
    created_date: '{{#? CREATEDDATE}}',
};

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, ['member_point_id', 'member_id', 'current_point', 'total_point']);
};

const listExchangePoint = (data) =>
    transform.transform(data, ['expoint_id', 'expoint_name', 'max_expoint', 'point', 'value']);

const list = (data = []) => {
    return transform.transform(data, [
        'current_point',
        'plus_point',
        'sub_point',
        'total_point',
        'order_no',
        'created_date',
    ]);
};

const totalPoint = (data = {}) => transform.transform(data, ['current_point', 'total_point']);

module.exports = {
    detail,
    list,
    listExchangePoint,
    totalPoint,
};
