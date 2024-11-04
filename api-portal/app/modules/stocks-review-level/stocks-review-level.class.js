const Transform = require('../../common/helpers/transform.helper');

const template = {
  'stocks_review_level_id': '{{#? STOCKSREVIEWLEVELID}}',
  'stocks_review_level_name': '{{#? STOCKSREVIEWLEVELNAME}}',
  'description': '{{#? DESCRIPTION}}',
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'is_active': '{{ISACTIVE? 1:0}}',
  'is_system': '{{ISSYSTEM  ? 1 : 0}}',
  'is_stocks_in': '{{ISSTOCKSIN  ? 1 : 0}}',
  'is_stocks_out': '{{ISSTOCKSOUT  ? 1 : 0}}',
  'is_stocks_take': '{{ISSTOCKSTAKE  ? 1 : 0}}',
  'is_stocks_transfer': '{{ISSTOCKSTRANSFER  ? 1 : 0}}',

  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
  'stocks_review_level_type': '{{#? STOCKSREVIEWLEVELTYPE}}',

};

let transform = new Transform(template);

const list = (users = []) => {
  return transform.transform(users, [
    'stocks_review_level_id',
    'stocks_review_level_name',
    'is_active',
    'created_date',
    'created_user',
    'is_deleted',
    'stocks_review_level_type',
    'company_id',
    'company_name'
  ]);
};

const detail = (user) => {
  return transform.transform(user, [
    'stocks_review_level_id',
    'stocks_review_level_name',
    'company_id',
    'is_active',
    'created_date',
    'created_user',
    'is_active',
    'is_system',
    'is_stocks_in',
    'is_stocks_out',
    'is_stocks_take',
    'description',
    'is_stocks_transfer'
  ]);
};

const options = (list = []) => {
  const template = {
    'name': '{{#? NAME}}',
    'id': '{{#? ID}}',
    'label': '{{#? NAME}}',
    'value': '{{#? ID}}',
  }
  let transform = new Transform(template);
  return transform.transform(list, [
    'id', 'name', 'label', 'value'
  ]);
};

module.exports = {
  detail,
  list,
  options
};

