const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const template = {
    partner_id: '{{#? PARTNERID}}',
    partner_code: '{{#? PARTNERCODE}}',
    partner_name: '{{#? PARTNERNAME}}',
    tax_code: '{{#? TAXCODE}}',
    email: '{{#? EMAIL}}',
    phone_number: '{{#? PHONENUMBER}}',
    country_id: '{{#? COUNTRYID}}',
    province_id: '{{#? PROVINCEID}}',
    district_id: '{{#? DISTRICTID}}',
    ward_id: '{{#? WARDID}}',
    address: '{{#? ADDRESS}}',
    user_id: '{{#? USERID}}',
    source_id: '{{#? SOURCEID}}',
    representative_name: '{{#? REPRESENTATIVENAME}}',
    representative_email: '{{#? REPRESENTATIVEEMAIL}}',
    representative_phone: '{{#? REPRESENTATIVEPHONE}}',
    representative_gender: '{{#? REPRESENTATIVEGENDER}}',
    representative_id_card: '{{#? REPRESENTATIVEIDCARD}}',
    representative_id_card_place: '{{#? REPRESENTATIVEIDCARDPLACE}}',
    description: '{{#? DESCRIPTION}}',
    caring_user: '{{#? CARINGUSER}}',
    caring_user_name: '{{#? CARINGUSERNAME}}',
    image_avatar: [
        {
            '{{#if IMAGEAVATAR}}': `${config.domain_cdn}{{IMAGEAVATAR}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    customer_type_id: '{{#? CUSTOMERTYPEID}}',
    note: '{{#? NOTE}}',
    is_crt_system: '{{ISCRTSYSTEM ? 1 : 0}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    create_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
    delete_user: '{{#? DELETEDUSER}}',

    //customer contact
    partner_contact_id: '{{#? PARTNERCONTACTID}}',
    contact_customer_id: '{{#? CONTACTCUSTOMERID}}',
    first_name: '{{#? FIRSTNAME}}',
    last_name: '{{#? LASTNAME}}',
    position: '{{#? POSITION}}',

    // customer type
    debt_time_to: '{{#? DEBTTIMETO}}',
    debt_time_from: '{{#? DEBTTIMEFROM}}',
    //EXISTS
    exists_name: '{{#? EXISTSNAME}}',
    exists_phone: '{{#? EXISTSPHONE}}',
    exists_email: '{{#? EXISTSEMAIL}}',
    exists_code: '{{#? EXISTSCODE}}',
};

const defaultFields = [
    'partner_id',
    'partner_code',
    'partner_name',
    'tax_code',
    'email',
    'phone_number',
    'country_id',
    'province_id',
    'district_id',
    'ward_id',
    'address',
    'representative_name',
    'representative_email',
    'representative_phone',
    'representative_gender',
    'representative_id_card',
    'representative_id_card_place',
    'description',
    'caring_user',
    'caring_user_name',
    'image_avatar',
    'customer_type_id',
    'user_id',
    'source_id',
    'note',
    'is_crt_system',
    'is_active',
    'is_system',
    'create_date',
];

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, defaultFields);
};

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

const check = (checkExist) => {
    return transform.transform(checkExist, ['exists_name', 'exists_phone', 'exists_email', 'exists_code']);
};

const listCustomerContact = (data = []) => {
    return transform.transform(data, [
        'contact_customer_id',
        'first_name',
        'last_name',
        'phone_number',
        'create_date',
        'position',
        'email',
        'partner_contact_id',
    ]);
};

const detailCustomerType = (data) => {
    return transform.transform(data, ['debt_time_to', 'debt_time_from']);
};

const listAccount = (data) => {
    const temp = {
        id: '{{#? ID}}',
        full_name: '{{#? FULLNAME}}',
        code: '{{#? CODE}}',
        tax_code: '{{#? TAXCODE}}',
        address: '{{#? ADDRESS}}',
    }
    const transform = new Transform(temp);

    return transform.transform(data, 
    ['full_name',
     'code',
     'tax_code',
     'address',
     'id'
    ])
}

module.exports = {
    detail,
    list,
    listCustomerContact,
    detailCustomerType,
    check,
    listAccount
};
