const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    'stocks_id': '{{#? STOCKSID}}',
    'stock_type_id': '{{#? STOCKTYPEID}}',
    'stocks_code': '{{#? STOCKSCODE}}',
    'stocks_name': '{{#? STOCKSNAME}}',
    'phone_number': '{{#? PHONENUMBER}}',
    'address': '{{#? ADDRESS}}',
    'description': '{{#? DESCRIPTION}}',
    'alternate_name': '{{#? ALTERNATENAME}}',
    'email': '{{#? EMAIL}}',
    'created_date': '{{#? CREATEDDATE}}',
    'is_active': '{{#? ISACTIVE ? 1 : 0}}',
    'stocks_type_id': '{{#? STOCKSTYPEID}}',
    'stocks_type_name': '{{#? STOCKSTYPENAME}}',
    'is_company': '{{ISCOMPANY ? 1 : 0}}',
    'is_agency': '{{#? ISAGENCY ? 1 : 0}}',
    'is_manufacturer': '{{#? ISMANUFACTURER ? 1 : 0}}',
    'is_supplier': '{{#? ISSUPPLIER ? 1 : 0}}',
    'company_id': '{{#? COMPANYID}}',
    'company_name': '{{#? COMPANYNAME}}',
    'business_name': '{{#? BUSINESSNAME}}',
    'company_phonenumber': '{{#? COMPANY_PHONENUMBER}}',
    'company_email': '{{#? COMPANY_EMAIL}}',
    'company_address': '{{#? COMPANY_ADDRESS}}',
    'country_id': '{{#? COUNTRYID}}',
    'province_id': '{{#? PROVINCEID}}',
    'current_province_id': '{{#? PROVINCEID}}',

    'province_name': '{{#? PROVINCENAME}}',
    'district_id': '{{#? DISTRICTID}}',
    'current_district_id': '{{#? DISTRICTID}}',

    'district_name': '{{#? DISTRICTNAME}}',
    'ward_id': '{{#? WARDID}}',
    'current_ward_id': '{{#? WARDID}}',

    'ward_name': '{{#? WARDNAME}}',
    'user_id': '{{#? USERID}}',
    'username': '{{#? USERNAME}}',
    'fullname': '{{#? FULLNAME}}',
    'business_id': '{{#? BUSINESSID}}',
    'business_name': '{{#? BUSINESSNAME}}',
    'manufacturer_id': '{{#? MANUFACTURERID}}',
    'manufacturer_name': '{{#? MANUFACTURERNAME}}',
    'manufacturer_phonenumber': '{{#? MANUFACTURER_PHONENUMBER}}',
    'manufacturer_email': '{{#? MANUFACTURER_EMAIL}}',
    'manufacturer_address': '{{#? MANUFACTURER_ADDRESS}}',
    'department_name': '{{#? DEPARTMENTNAME}}',
    'department_id': '{{#? DEPARTMENTID}}',

    'position_name': '{{#? POSITIONNAME}}',
    'position_id': '{{#? POSITIONID}}',

    'stocks_manager_id': '{{#? STOCKSMANAGERID}}',
    'created_user': '{{#? CREATEDUSER}}',

    'store_name': '{{#? STORENAME}}',
    'store_id': '{{#? STOREID}}',
    'store_code': '{{#? STORECODE}}',
    'stocks_type_code': '{{#? STOCKSTYPECODE}}',
    'stocks_manager_user': '{{#? STOCKSMANAGERUSER}}',

    'user_name': '{{#? USERNAME}}',
    'full_name': '{{#? FULLNAME}}',
    'company_phone_number': '{{#? COMPANYPHONENUMBER}}',

    'id': '{{#? STOCKSID}}',
    'name': '{{#? STOCKSNAME}}',
    'area_id': '{{#? AREAID}}',
    'area_name': '{{#? AREANAME}}',
    'is_system': '{{#? ISSYSTEM ? 1 : 0}}',

    'type': '{{#? TYPE}}',



};

let transform = new Transform(template);

const detail = (user) => {
    return transform.transform(user, [
        'stocks_id', 'stocks_code', 'stocks_name', 'phone_number', 'address', 'alternate_name', 'email', 'created_date', 'is_active',
        'stocks_type_id', 'stocks_type_name', 'country_id', 'province_id', 'province_name', 'district_id', 'district_name', 'ward_id', 'ward_name',
        'is_company', 'is_agency', 'is_manufacturer', 'is_supplier', 'description', 'company_id', 'company_name', 'business_id', 'business_name',
        'store_id', 'company_phone_number', 'store_code', 'stocks_type_code', 'area_id', 'is_system', 'type'
    ]);
};

const list = (users = []) => {
    return transform.transform(users, [
        'stocks_id', 'stocks_code', 'stocks_name', 'phone_number', 'address', 'created_date', 'is_active', 'stocks_type_id', 'stocks_type_name',
        'province_name', 'district_name', 'ward_name', 'created_user', 'store_name', 'area_name', 'business_name',
    ]);
};

const listStocksType = (users = []) => {
    return transform.transform(users, [
        'stocks_type_id', 'stocks_type_name', 'is_company', 'is_agency', 'is_manufacturer', 'is_supplier'
    ]);
};

const listCompany = (users = []) => {
    return transform.transform(users, [
        'company_id', 'company_name', 'company_phonenumber', 'company_email', 'company_address', 'province_id', 'province_name',
        'district_id', 'district_name', 'ward_id', 'ward_name'
    ]);
};

const listManufacturer = (users = []) => {
    return transform.transform(users, [
        'manufacturer_id', 'manufacturer_name', 'manufacturer_phonenumber', 'manufacturer_email', 'manufacturer_address', 'province_id', 'province_name',
        'district_id', 'district_name', 'ward_id', 'ward_name'
    ]);
};

const listStockManager = (users = []) => {
    return transform.transform(users, [
        'stocks_id',
        'stocks_manager_user',
        'position_id',
        'position_name',
        'department_id',
        'department_name',
        'phone_number'
    ]);
};

const listBusinessByCompanyID = (users = []) => {
    return transform.transform(users, [
        'business_id', 'business_name'
    ]);
};

const options = (users = []) => {
    return transform.transform(users, [
        'id', 'stocks_code', 'name', 'address'
    ]);
};

const optionsStore = (users = []) => {
    return transform.transform(users, [
        'store_id',
        'store_code',
        'store_name',
        'business_name',
        'company_name',
        'company_id',
        'business_id',
        'phone_number'
    ]);
};

const optionsStocksType = (users = []) => {
    return transform.transform(users, [
        'stocks_type_id',
        'stocks_type_name',
        'stocks_type_code',
        'type'
    ]);
};

const optionsUser = (users = []) => {
    return transform.transform(users, [
        'user_name',
        'full_name',
        'phone_number',
        'position_id',
        'position_name',
        'department_name',
        'department_id',

    ]);
};

module.exports = {
    detail,
    options,
    list,
    listStocksType,
    listCompany,
    listManufacturer,
    listStockManager,
    listBusinessByCompanyID,
    optionsStore,
    optionsStocksType,
    optionsUser
};
