const Transform = require("../../common/helpers/transform.helper");
const config = require("../../../config/config");


const template = {
    'holiday_id': '{{#? HOLIDAYID}}',
    'holiday_name' : '{{#? HOLIDAYNAME}}',
    'date_from' : '{{#? STARTDATE }}',
    'date_to' : '{{#? ENDDATE }}',
    'created_user': '{{#? CREATEDUSER}}',
    'created_date': '{{#? CREATEDDATE}}',
    'is_deleted':   '{{#? ISDELETED  ? 1 : 0}}',
    'deleted_user': '{{#? DELETEDUSER}}',
    'deleted_date': '{{#? DELETEDDATE}}',
    'status_name' :   '{{#? STATUSNAME ? 1 : 0}}',
    'is_active' : '{{#? ISACTIVE ? 1 : 0}}',
    'total_day': '{{#? TOTALDAY }}',
    'is_apply_work_day': '{{#? ISAPPLYWORKDAY ? 1 : 0 }}',
}

const list = (products = [])=>{
    let transform = new Transform(template);
    // return products;
    return transform.transform(products, [
        'holiday_name',
        'holiday_id',
        'date_from',
        'date_to' ,
        'created_user',
        'created_date',
        'is_deleted',
        'status_name',
        'total_day',
        'is_apply_work_day',
    ]);
} 

const checkDate = (products = [])=>{
    let transform = new Transform(template);
    // return products;
    return transform.transform(products, [
        'time_keeping_confirm_date_id',
        'date_from',
        'date_to' ,
        'is_close'
    ]);
} 

const listMonth = (products = [])=>{
    let transform = new Transform(template);
    // return products;
    return transform.transform(products, [
        'is_disiable_jan',
        'is_disiable_Feb',
        'is_disiable_mar',
        'is_disiable_apr',
        'is_disiable_may',
        'is_disiable_jun',
        'is_disiable_july',
        'is_disiable_aug',
        'is_disiable_sep',
        'is_disiable_oct',
        'is_disiable_nov',
        'is_disiable_dec',
        'is_disiable_year'

    ]);
} 





const items = (products = [])=>{
    let transform = new Transform(template);
    // return products;
    return transform.transform(products, [
        'holiday_name',
        'holiday_id',
        'date_from',
        'date_to' ,
        'created_user',
        'created_date',
        'is_deleted',
        'is_active',
        'total_day',
        'is_apply_work_day',
    ]);
} 


module.exports = {
    list,
    items,
    checkDate,
    listMonth

}