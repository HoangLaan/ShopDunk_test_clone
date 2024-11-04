const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const list = (data = []) => {
    const _template = {
        data_leads_id: '{{#? DATALEADSID}}',
        data_leads_code: '{{#? DATALEADSCODE}}',
        full_name: '{{#? FULLNAME}}',
        birthday: '{{#? BIRTHDAY}}',
        gender: '{{#? GENDER}}',
        gender_text: '{{ GENDER? "Nam": "Nữ" }}',
        phone_number: '{{#? PHONENUMBER}}',
        email: '{{#? EMAIL}}',
        zalo_id: '{{#? ZALOID}}',
        facebook_id: '{{#? FACEBOOKID}}',
        affiliate: '{{#? AFFILIATE}}',
        source_id: '{{#? SOURCEID}}',
        customer_type_id: '{{#? CUSTOMERTYPEID}}',
        address: '{{#? ADDRESSFULL}}',
        workflow_name: '{{#? WORKFLOWNAME}}',
        task_wflow_id: '{{#? TASKWFLOWID}}',
        source_name: '{{#? SOURCENAME}}',
        status_transfer: '{{#? STATUSTRANSFER}}',
        is_active: '{{ ISACTIVE ? 1: 0 }}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const getById = (data = {}) => {
    const _template = {
        data_leads_id: '{{#? DATALEADSID}}',
        data_leads_code: '{{#? DATALEADSCODE}}',
        full_name: '{{#? FULLNAME}}',
        birthday: '{{#? BIRTHDAY}}',
        gender: '{{ GENDER ? 1 : 0 }}',
        phone_number: '{{#? PHONENUMBER}}',
        phone_number_secondary: '{{#? PHONENUMBERSECONDARY}}',
        email: '{{#? EMAIL}}',
        zalo_id: '{{#? ZALOID}}',
        facebook_id: '{{#? FACEBOOKID}}',
        affiliate: '{{#? AFFILIATE}}',
        source_id: '{{#? SOURCEID}}',
        presenter_id: '{{#? PRESENTERID}}',
        customer_type_id: '{{#? CUSTOMERTYPEID}}',
        image_avatar: [
            {
                '{{#if IMAGEAVATAR}}': `${config.domain_cdn}{{IMAGEAVATAR}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        country_id: '{{#? COUNTRYID}}',
        province_id: '{{#? PROVINCEID}}',
        district_id: '{{#? DISTRICTID}}',
        ward_id: '{{#? WARDID}}',
        postal_code: '{{#? POSTALCODE}}',
        address: '{{#? ADDRESS}}',

        id_card: '{{#? IDCARD}}',
        id_card_date: '{{#? IDCARDDATE}}',
        id_card_place: '{{#? IDCARDPLACE}}',
        career_id: '{{#? CAREERID}}',

        customer_company_id: '{{#? CUSTOMERCOMPANYID}}',

        is_active: '{{ ISACTIVE ? 1: 0 }}',
        is_system: '{{ ISSYSTEM ? 1: 0 }}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const listCustomerCompany = (data = []) => {
    const _template = {
        customer_company_id: '{{#? CUSTOMERCOMPANYID}}',
        customer_company_name: '{{#? CUSTOMERCOMPANYNAME}}',
        representative_name: '{{#? REPRESENTATIVENAME}}',
        phone_number: '{{#? PHONENUMBER}}',
        email: '{{#? EMAIL}}',
        tax_code: '{{#? TAXCODE}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const customerCompany = (data = {}) => {
    const _template = {
        customer_company_id: '{{#? CUSTOMERCOMPANYID}}',
        customer_company_name: '{{#? CUSTOMERCOMPANYNAME}}',
        representative_name: '{{#? REPRESENTATIVENAME}}',
        phone_number: '{{#? PHONENUMBER}}',
        email: '{{#? EMAIL}}',
        tax_code: '{{#? TAXCODE}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
    list,
    getById,
    listCustomerCompany,
    customerCompany,
};
