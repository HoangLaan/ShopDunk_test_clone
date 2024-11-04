const Transform = require('../../common/helpers/transform.helper');
// const config = require('../../../config/config');

const template = {
    store_name: '{{#? STORENAME}}',
    shift_name: '{{#? SHIFTNAME}}',
    leader_user: '{{#? LEADERUSER}}',
    open_user: '{{#? OPENUSER}}',
    close_user: '{{#? CLOSEUSER}}',
    total_cash_open: '{{TOTALCASHOPEN ? TOTALCASHOPEN : 0}}',
    total_cash_shift: '{{TOTALCASHSHIFT ? TOTALCASHSHIFT : 0}}',
    total_cash_close: '{{TOTALCASHCLOSE ? TOTALCASHCLOSE : 0}}',
    order_number: '{{ORDERNUMBER ? ORDERNUMBER : 0}}',
    created_date: '{{#? CREATEDDATE}}',
    note: '{{#? NOTE}}',
};

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'store_name',
        'shift_name',
        'leader_user',
        'open_user',
        'close_user',
        'total_cash_open',
        'total_cash_shift',
        'total_cash_close',
        'order_number',
        'created_date',
        'note',
    ]);
};

module.exports = {
    list,
};
