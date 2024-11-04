const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    // Store template
    store_name: '{{#? STORENAME}}',
    store_code: '{{#? STORECODE}}',
    area_id: '{{#? AREAID}}',
    company_id: '{{#? COMPANYID}}',
    business_id: '{{#? BUSINESSID)}}',
    cluster_id: "{{#? CLUSTERID + '' }}",
    area_name: '{{#? AREANAME}}',
    phone_number: '{{#? PHONENUMBER}}',
    created_date: '{{#? CREATEDDATE}}',
    created_user: '{{#? CREATEDUSER}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    // Store image
    store_image_id: '{{#? STOREIMAGEID}}',

    // Ipaddress
    is_default: '{{ISDEFAULT ? 1 : 0}}',
    is_ipv4: '{{ISIPV4 ? 1 : 0}}',
    ip_address: '{{#? IPADDRESS}}',
    ip_name: '{{#? IPNAME}}',
    ip_id: '{{#? IPID}}',

    // bank
    bank_id: '{{#? BANKID}}',
    bank_number: '{{#? BANKNUMBER}}',
    bank_account_name: '{{#? BANKACCOUNTNAME}}',
    bank_routing: '{{#? BANKROUTING}}',
    bank_account_id: '{{#? BANKACCOUNTID}}',
    bank_branch: '{{#? BANKBRANCH}}',
    bank_code: '{{#? BANKCODE}}',
    is_default: '{{ISDEFAULT ? 1 : 0}}',
    bank_account_name: '{{#? BANKACCOUNTNAME}}',
    architecture_type: '{{#? ARCHITECTURETYPE}}',
};

let transform = new Transform(template);

const detail = (data) => {
    const parseValue = {
        //tab 1
        store_id: '{{#? STOREID}}',
        phone_number: '{{#? PHONENUMBER}}',
        description: '{{#? DESCRIPTIONS}}',
        map_url: '{{#? MAPURL}}',
        open_time: '{{#? OPENTIME}}',
        close_time: '{{#? CLOSETIME}}',
        banner_url: `${config.domain_cdn}{{BANNERURL}}`,
        store_code: '{{#? STORECODE}}',
        store_name: '{{#? STORENAME}}',
        store_type_id: '{{#? STORETYPEID}}',
        area_id: '{{#? AREAID}}',
        company_id: "{{#? COMPANYID + ''}}",
        business_id: "{{#? BUSINESSID + ''}}",
        brand_id: '{{#? BRANDID}}',
        cluster_id: '{{#? CLUSTERID}}',
        status_type: '{{#? STATUSTYPE}}',
        opening_day: '{{#? OPENINGDAY}}',
        closing_day: '{{#? CLOSINGDAY}}',
        // tab 2
        acreage: '{{#? ACREAGE}}',
        size_type: '{{#? SIZETYPE}}',
        open_time: '{{#? OPENTIME}}',
        close_time: '{{#? CLOSETIME}}',
        country_id: '{{#? COUNTRYID}}',
        province_id: '{{#? PROVINCEID}}',
        district_id: '{{#? DISTRICTID}}',
        ward_id: '{{#? WARDID}}',
        address: '{{#? ADDRESS}}',
        address_full: '{{#? ADDRESSFULL}}',
        location_x: '{{#? LOCATIONX}}',
        location_y: '{{#? LOCATIONY}}',
        management_username: '{{#? MANAGEMENTUSERNAME}}',
        phone_number_manager: '{{#? PHONENUMBERMANAGER}}',
        is_active: '{{ISACTIVE ? 1 : 0}}',
        is_system: '{{ISSYSTEM ? 1 : 0}}',
        age_store: '{{#? AGESTORE}}',
        architecture_type: '{{#? ARCHITECTURETYPE}}',
    };
    let transform = new Transform(parseValue);
    return transform.transform(data, Object.keys(parseValue));
};

const list = (data = []) => {
    const parseValue = {
        store_id: '{{#? STOREID}}',
        store_code: '{{#? STORECODE}}',
        store_name: '{{#? STORENAME}}',
        address: '{{#? ADDRESS}}',
        phone_number: '{{#? PHONENUMBER}}',
        business_id: "{{#? BUSINESSID + ''}}",
        area_name: '{{#? AREANAME}}',
        store_type_name: '{{#? STORETYPENAME}}',
        cluster_name: '{{#? CLUSTERNAME}}',
        business_name: '{{#? BUSINESSNAME}}',
        is_active: '{{ISACTIVE ? 1 : 0}}',
    };
    const transform = new Transform(parseValue);
    return transform.transform(data, Object.keys(parseValue));
};

const images = (data = []) => {
    const parseValue = {
        store_id: '{{#? STOREID}}',
        picture_url: `${config.domain_cdn}{{PICTUREURL}}`,
        store_image_id: '{{#? STOREIMAGEID}}',
    };
    const transform = new Transform(parseValue);
    return transform.transform(data, Object.keys(images));
};
const ips = (data = []) => {
    return transform.transform(data, ['is_ipv4', 'ip_address', 'ip_name', 'store_id', 'ip_id']);
};
const options = (data = []) => {
    const templateOptions = {
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        value: '{{#? ID}}',
        label: '{{#? NAME}}',
        business_id: '{{#? BUSINESSID}}',
        area_id: '{{#? AREAID}}',
    };
    const transform = new Transform(templateOptions);
    return transform.transform(data, Object.keys(templateOptions));
};

const bankAccounts = (company) => {
    return transform.transform(company, [
        'store_id',
        'bank_number',
        'bank_account_id',
        'bank_branch',
        'is_default',
        'bank_code',
        'bank_id',
        'bank_account_name',
    ]);
};

module.exports = {
    list,
    detail,
    images,
    ips,
    options,
    bankAccounts,
};
