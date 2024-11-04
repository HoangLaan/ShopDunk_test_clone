const Transform = require('../../common/helpers/transform.helper');

const template = {
  'stocks_out_type_id': '{{#? STOCKSOUTTYPEID}}',
  'stocks_out_type_name': '{{#? STOCKSOUTTYPENAME}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_system': '{{ISSYSTEM ? 1 : 0}}',

  'is_transfer': '{{ISTRANSFER ? 1 : 0}}',
  'is_purchase': '{{ISPURCHASE ? 1 : 0}}',
  'is_outventory_control': '{{ISOUTVENTORYCONTROL ? 1 : 0}}',
  'is_exchange_goods': '{{ISEXCHANGEGOODS ? 1 : 0}}',
  'is_warranty': '{{ISWARRANTY ? 1 : 0}}',
  'is_electronics_component': '{{ISDISASSEMBLEELECTRONICSCOMPONENT ? 1 : 0}}',
  'is_outternal': '{{ISOUTTERNAL ? 1 : 0}}',

  'is_auto_reviewed': '{{ISAUTOREVIEWED ? 1 : 0}}',
  'stocks_out_type': '{{STOCKSOUTTYPE ? STOCKSOUTTYPE : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
  'is_non_pricoutg': '{{#? ISNONPRICOUTG}}',
  'is_stocks_out_review': '{{#? ISSTOCKSOUTREVIEW}}',
  'stocks_out_review_level_id': '{{#? STOCKSOUTTYPEREVIEWLEVELID}}',
  'review_order_outdex': '{{REVIEWORDEROUTDEX  ? 1 : 0}}',
  'is_completed_reviewed': '{{ISCOMPLETEDREVIEWED  ? 1 : 0}}',
  'department_id': '{{#? DEPARTMENTID}}',
  'department_name': '{{#? DEPARTMENTNAME}}',
  'user_name': '{{#? USERNAME}}',
  'users': '{{#? USERS}}',
  'stocks_review_level_id': '{{#? STOCKSREVIEWLEVELID}}',
  'description': '{{#? DESCRIPTION}}',
  'is_auto_review': '{{ISAUTOREVIEW  ? 1 : 0}}',
  'name': '{{#? NAME}}',
  'id': '{{#? ID}}',
  'label': '{{#? NAME}}',
  'value': '{{#? ID}}',
  'is_company': '{{ISCOMPANY  ? 1 : 0}}',
};

let transform = new Transform(template);

const list = (users = []) => {
  return transform.transform(users, [
    'stocks_out_type_id',
    'stocks_out_type_name',
    'stocks_out_type',
    'is_active',
    'created_date',
    'created_user',
    'is_deleted',
  ]);
};

const detail = (user) => {
  return transform.transform(user, [
    'stocks_out_type_id',
    'stocks_out_type_name',
    'is_active',
    'created_date',
    'created_user',
    'description',

    'is_transfer',
    'is_purchase',
    'is_outventory_control',
    'is_exchange_goods',
    'is_warranty',
    'is_electronics_component',
    'is_warranty',

    'is_auto_review',
    'is_stocks_out_review',
    'stocks_out_review_level_list',
    'stocks_out_type',
    'is_system',
    'is_company'
  ]);
};

const listReviewLevel = (areas = []) => {
  return transform.transform(areas, [
    'stocks_out_review_level_id',
    'stocks_review_level_id',
    'is_auto_reviewed',
    'is_completed_reviewed',
    'department_id',
    'department_name',
    'user_name',
    'users',
    'name',
    'id',
    'value',
    'label'
  ]);
};

const listReviewUser = (data = []) => {
  return transform.transform(data, [
    'stocks_out_review_level_id',
    'stocks_review_level_id',
    'is_auto_reviewed',
    'is_completed_reviewed',
    'department_id',
    'department_name',
    'user_name',
    'users',
    'name',
    'id',
    'value',
    'label'
  ]);
};

const templateOption = {
  'id': '{{#? STOCKSOUTTYPEID}}',
  'name': '{{#? STOCKSOUTTYPENAME}}',
};

const option = (stocks_out_type = []) => {
  let transform = new Transform(templateOption);
  return transform.transform(stocks_out_type, [
    'id', 'name',
  ]);
};

const options = (data = []) => {
  return transform.transform(data, [
    'id', 'name', 'label', 'value', 'department_id'
  ]);
};

const templateStStockOutType = {
  'id': '{{#? STOCKSOUTTYPEID}}',
  'value': '{{#? STOCKSOUTTYPEID}}',
  'name': '{{#? STOCKSOUTTYPENAME}}',
  'label': '{{#? STOCKSOUTTYPENAME}}',
  'type': '{{#? STOCKSOUTTYPE}}',
}

const optionsStStockOutType = (data = []) => {

  const transformSt = new Transform(templateStStockOutType);
  const keyObjectSt = Object.getOwnPropertyNames(templateStStockOutType) ?? [];
  return transformSt.transform(data, keyObjectSt);
};

module.exports = {
  detail,
  list,
  listReviewLevel,
  option,
  options,
  listReviewUser,
  optionsStStockOutType,
};

