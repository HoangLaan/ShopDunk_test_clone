const Transform = require("../../common/helpers/transform.helper");
const config = require("../../../config/config");


const template = {
    'time_keeping_confirm_date_id': '{{#? TIMEKEEPINGCONFIRMDATEID}}',
    'time_keeping_confirm_date_name' : '{{#? TIMEKEEPINGCONFIRMDATENAME}}',
    'time_keeping_date_description' : '{{#? DESCRIPTION}}',
    'is_prices_filter' : '{{#? ISPRICEFILTER}}',
    'date_from' : '{{#? BEGINDATE }}',
    'date_to' : '{{#? ENDDATE }}',
    'created_user': '{{#? CREATEDUSER}}',
    'created_date': '{{#? CREATEDDATE}}',
    'is_deleted':   '{{ISDELETED  ? 1 : 0}}',
    'deleted_user': '{{#? DELETEDUSER}}',
    'deleted_date': '{{#? DELETEDDATE}}',
    'is_active' :   '{{#? ISACTIVE ? 1 : 0}}',
    'is_apply_jan': '{{#? ISJAN ? 1 : 0 }}',
    'is_apply_Feb': '{{#? ISFED ? 1 : 0 }}',
    'is_apply_mar': '{{#? ISMAR ? 1 : 0 }}',
    'is_apply_apr': '{{#? ISAPR ? 1 : 0 }}',
    'is_apply_may': '{{#? ISMAY ? 1 : 0 }}',
    'is_apply_jun': '{{#? ISJUN ? 1 : 0 }}',
    'is_apply_july': '{{#? ISJULY ? 1 : 0 }}',
    'is_apply_aug': '{{#? ISAUG ? 1 : 0 }}',
    'is_apply_sep': '{{#? ISSEP ? 1 : 0 }}',
    'is_apply_oct': '{{#? ISOCT ? 1 : 0 }}',
    'is_apply_nov': '{{#? ISNOV ? 1 : 0 }}',
    'is_apply_dec': '{{#? ISDEC ? 1 : 0 }}',
    'is_apply_year': '{{#? ISALL ? 1 : 0 }}',
    'is_close': '{{#? RESULT}}',

    'is_disiable_jan': '{{#? ISJAN ? 1 : 0 }}',
    'is_disiable_Feb': '{{#? ISFED ? 1 : 0 }}',
    'is_disiable_mar': '{{#? ISMAR ? 1 : 0 }}',
    'is_disiable_apr': '{{#? ISAPR ? 1 : 0 }}',
    'is_disiable_may': '{{#? ISMAY ? 1 : 0 }}',
    'is_disiable_jun': '{{#? ISJUN ? 1 : 0 }}',
    'is_disiable_july': '{{#? ISJULY ? 1 : 0 }}',
    'is_disiable_aug': '{{#? ISAUG ? 1 : 0 }}',
    'is_disiable_sep': '{{#? ISSEP ? 1 : 0 }}',
    'is_disiable_oct': '{{#? ISOCT ? 1 : 0 }}',
    'is_disiable_nov': '{{#? ISNOV ? 1 : 0 }}',
    'is_disiable_dec': '{{#? ISDEC ? 1 : 0 }}',
    'is_disiable_year': '{{#? ISALL ? 1 : 0 }}',
}

const list = (products = [])=>{
    let transform = new Transform(template);
    // return products;
    return transform.transform(products, [
        'time_keeping_confirm_date_name',
        'time_keeping_confirm_date_id',
        'date_from',
        'date_to' ,
        'created_user',
        'created_date',
        'is_deleted',
        'is_active',
        'is_apply_jan',
        'is_apply_Feb',
        'is_apply_mar',
        'is_apply_apr',
        'is_apply_may',
        'is_apply_jun',
        'is_apply_july',
        'is_apply_aug',
        'is_apply_sep',
        'is_apply_oct',
        'is_apply_nov',
        'is_apply_dec',
        'is_apply_year'
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
        'time_keeping_confirm_date_name',
        'time_keeping_confirm_date_id',
        'date_from',
        'date_to' ,
        'is_active',
        'is_apply_jan',
        'is_apply_Feb',
        'is_apply_mar',
        'is_apply_apr',
        'is_apply_may',
        'is_apply_jun',
        'is_apply_july',
        'is_apply_aug',
        'is_apply_sep',
        'is_apply_oct',
        'is_apply_nov',
        'is_apply_dec',
        'is_apply_year',
        'time_keeping_date_description' 
    ]);
} 


module.exports = {
    list,
    items,
    checkDate,
    listMonth

}
