const Transform = require('../../common/helpers/transform.helper');

const template = {
  'store_id': '{{#? STOREID}}',
  'store_name': '{{#? STORENAME}}',
  'area_id': '{{#? AREAID}}',
  'company_id': '{{#? COMPANYID}}',
  'company_name': '{{#? COMPANYNAME}}',
  'business_id': '{{#? BUSINESSID}}',
  'area_name': '{{#? AREANAME}}',
  'location_x': '{{#? LOCATIONX}}',
  'location_y': '{{#? LOCATIONY}}',
  'province_id': '{{#? PROVINCEID}}',
  'province_name': '{{#? PROVINCENAME}}',
  'district_id': '{{#? DISTRICTID}}',
  'district_name': '{{#? DISTRICTNAME}}',
  'ward_id': '{{#? WARDID}}',
  'ward_name': '{{#? WARDNAME}}',
  'address': '{{#? ADDRESS}}',
  'address_full': '{{#? ADDRESSFULL}}',
  'phone_number': '{{#? PHONENUMBER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'description': '{{#? DESCRIPTIONS}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_delete': '{{ISDELETED ? 1 : 0}}',
  'result': '{{#? RESULT}}',
  'table_used': '{{#? TABLEUSED}}',

    longitude: '{{#? LONGITUDE}}',
    latitude: '{{#? LATITUDE}}',

    business_id: '{{#? BUSINESSID}}',
    brand_name: '{{#? BRANDNAME}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'store_id','store_name','area_id','area_name','company_id','company_name','location_x','location_y','province_id', 'province_name',
    'district_id','district_name','ward_id','ward_name','address','phone_number','created_date',
    'description','is_active',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'store_id','store_name','address_full','phone_number','created_date',
    'description','is_active','is_delete',
  ]);
};

const detailUsed = (used = []) => {
  return transform.transform(used, [
    'result','table_used',
  ]);
};

const infoByIp = (data = []) => {
  return transform.transform(data, [
    'store_id','store_name', 'address_full', 'location_x', 'location_y', 'company_id','business_id', 'brand_name'
  ]);
};

const detailStore = (data = []) => {
  const _template = {
    store_id: '{{#? STOREID}}',
    store_name: '{{#? STORECODE}}',
    store_code: '{{#? STORENAME}}',
    phone_number: '{{#? PHONENUMBER}}',
    address: '{{#? FULLADDRESS}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
  list,
  detail,
  detailUsed,
  infoByIp,
  detailStore,
};
