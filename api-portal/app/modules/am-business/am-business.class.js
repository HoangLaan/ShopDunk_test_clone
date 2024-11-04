const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'company_id': '{{#? COMPANYID}}',
  'area_id': '{{#? AREAID}}',
  'area_name': '{{#? AREANAME}}',
  'company_name': '{{#? COMPANYNAME}}',
  'business_type_id': '{{#? BUSINESSTYPEID}}',
  'business_type_name': '{{#? BUSINESSTYPENAME}}',
  'business_banner':[
      {
          '{{#if BUSINESSBANNER}}': `${config.domain_cdn}{{BUSINESSBANNER}}`,
      },
      {
          '{{#else}}': null,
      },
  ],
  'business_icon_url': [
      {
          '{{#if BUSINESSICONURL}}': `${config.domain_cdn}{{BUSINESSICONURL}}`,
      },
      {
          '{{#else}}': null,
      },
    ],
  'business_phone_number': '{{#? BUSINESSPHONENUMBER}}',
  'business_mail': '{{#? BUSINESSEMAIL}}',
  'business_website': '{{#? BUSINESSWEBSITE}}',
  'opening_date': '{{#? OPENINGDATE}}',
  'business_country_id': '{{#? BUSINESSCOUNTRYID}}',
  'business_country_name': '{{#? BUSINESSCOUNTRYNAME}}',
  'business_state_id': '{{#? BUSINESSSTATEID}}',
  'business_state': '{{#? BUSINESSSTATE}}',
  'business_city_id': '{{#? BUSINESSCITYID}}',
  'business_city_name': '{{#? BUSINESSCITYID}}',
  'business_province_id': '{{#? BUSINESSPROVINCEID}}',
  'business_province_name': '{{#? BUSINESSPROVINCENAME}}',
  'business_district_id': '{{#? BUSINESSDISTRICTID}}',
  'business_district_name': '{{#? BUSINESSDISTRICTNAME}}',
  'business_ward_id': '{{#? BUSINESSWARDID}}',
  'business_ward_name': '{{#? BUSINESSWARDNAME}}',
  'business_address': '{{#? BUSINESSADDRESS}}',
  'business_address_full': '{{#? BUSINESSADDRESSFULL}}',
  'location_x': '{{#? LOCATIONX}}',
  'location_y': '{{#? LOCATIONY}}',
  'open_time': '{{#? OPENTIME}}',
  'close_time': '{{#? CLOSETIME}}',
  'description': '{{#? DESCRIPTION}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
  'business_code': '{{#? BUSINESSCODE}}',

};

let transform = new Transform(template);

const detail = (user) => {
  return transform.transform(user, [
    'business_id', 'business_name', 'area_id', 'area_name', 'company_id', 'company_name', 'business_type_id', 'business_type_name',
    'opening_date', 'business_phone_number', 'business_mail', 'business_website', 'business_address_full',
    'business_banner', 'business_icon_url', 'business_country_id', 'business_country_name', 'business_state_id',
    'business_state', 'business_city_id', 'business_city_name', 'business_province_id',
    'business_province_name', 'business_district_id', 'business_district_name', 'business_ward_id', 'business_ward_name',
    'business_address', 'business_address_full', 'location_x', 'location_y', 'open_time', 'close_time', 'description', 'is_active','business_code'
  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    'business_id', 'business_name', 'company_id', 'company_name', 'business_type_id', 'business_type_name',
    'opening_date', 'business_phone_number', 'business_mail', 'business_website', 'business_address_full', 'is_active',
    'area_id', 'area_name','business_code'
  ]);
};
// options
const templateOptions = {
  'id': '{{#? ID}}',
  'name': '{{#? NAME}}',
};

const options = (userGroups = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(userGroups, ['id', 'name']);
};

const optionsByAreaList = (business = []) => {
  let transform = new Transform({
    'id': '{{#? BUSINESSID}}',
    'name': '{{#? BUSINESSNAME}}',
  });
  return transform.transform(business, ['id', 'name']);
};

module.exports = {
  detail,
  list,
  options,
  optionsByAreaList
};
