const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
  'image_qc_id': '{{#? IMAGEQCID}}',
  'store_name': '{{#? STORENAME}}',
  'address': '{{#? ADDRESS}}',
  'created_date': '{{#? CREATEDDATE}}',
  'image_checkin':  [
    {
        '{{#if IMAGECHECKIN}}': `${config.domain_cdn}{{IMAGECHECKIN}}`,
    },
    {
        '{{#else}}': null,
    },
],
  'image_checkout': [
    {
        '{{#if IMAGECHECKOUT}}': `${config.domain_cdn}{{IMAGECHECKOUT}}`,
    },
    {
        '{{#else}}': null,
    },
],
  'time_start': '{{#? TIMESTART}}',
  'time_end': '{{#? TIMEEND}}',
  'total_time': '{{#? TOTALTIME}}'
};

let transform = new Transform(template);
const storeQCList = data => {
    return transform.transform(data, ['image_qc_id','created_date', 'store_name','address','image_checkin','image_checkout', 'time_start', 'time_end', 'total_time' ])
}
const storeQCInfo = data => {
    const storeQCInfoTemplate = {
        'time_start': '{{#? TIMESTART}}',
        'time_end': '{{#? TIMEEND}}',
    }
    return new Transform(storeQCInfoTemplate).transform(data,[
        'time_start','time_end'
    ])
}


module.exports = {
    storeQCList,
    storeQCInfo
};
