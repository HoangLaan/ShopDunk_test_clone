const Transform = require('../../common/helpers/transform.helper');

const template = {
    installment_partner_id: '{{#? INSTALLMENTPARTNERID }}',
    installment_partner_name: '{{#? INSTALLMENTPARTNERNAME }}',
    installment_partner_code: '{{#? INSTALLMENTPARTNERCODE }}',
    installment_partner_logo: '{{#? INSTALLMENTPARTNERLOGO }}',
    installment_partner_type: '{{#? INSTALLMENTPARTNERTYPE }}',
    country_id: '{{#? COUNTRYID}}',
    province_id: '{{#? PROVINCEID}}',
    district_id: '{{#? DISTRICTID}}',
    ward_id: '{{#? WARDID}}',
    address_detail: '{{#? ADDRESSDETAIL}}',
    contact_vocative: '{{#? CONTACTVOCATIVE}}',
    contact_name: '{{#? CONTACTNAME}}',
    contact_position: '{{#? CONTACTPOSITION}}',
    contact_phone: '{{#? CONTACTPHONE}}',
    shop_id: '{{#? SHOPID}}',
    private_code: '{{#? PRIVATECODE}}',
    merchant_code: '{{#? MERCHANTCODE}}',
    merchant_private_code: '{{#? MERCHANTPRIVATECODE}}',
    end_point: '{{#? ENDPOINT}}',
    checking_type: '{{#? CHECKINGTYPE}}',
    checking_day: '{{#? CHECKINGDAY}}',
    checking_on_weekend: '{{CHECKINGONWEEKEND ? 1 : 0}}',
    payment_type: '{{#? PAYMENTTYPE}}',
    payment_on_weekend: '{{PAYMENTONWEEKEND ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',

    period_list: '{{#? PERIODLIST}}',

    name: '{{#? NAME}}',
    id: '{{#? ID}}',
};

let transform = new Transform(template);

const list = (obj) => {
    return transform.transform(obj, [
        'installment_partner_id',
        'installment_partner_name',
        'installment_partner_code',
        'installment_partner_logo',
        'installment_partner_type',
        'payment_type',
        'created_user',
        'created_date',
        'is_active',
    ]);
};

const detail = (list = []) => {
    return transform.transform(list, [
        'installment_partner_id',
        'installment_partner_name',
        'installment_partner_code',
        'installment_partner_logo',
        'installment_partner_type',
        'country_id',
        'province_id',
        'district_id',
        'ward_id',
        'address_detail',
        'contact_vocative',
        'contact_name',
        'contact_position',
        'contact_phone',
        'shop_id',
        'private_code',
        'merchant_code',
        'merchant_private_code',
        'end_point',
        'checking_type',
        'checking_day',
        'checking_on_weekend',
        'payment_type',
        'payment_on_weekend',
        'created_user',
        'created_date',
        'is_active',
        'is_system',
    ]);
};

const documentList = (list = []) => {
    const template = {
        installment_partner_document_id: '{{#? INSTALLMENTPARTNERDOCUMENTID }}',
        installment_partner_id: '{{#? INSTALLMENTPARTNERID }}',
        document_name: '{{#? DOCUMENTNAME }}',
        attachment_name: '{{#? ATTACHMENTNAME }}',
        attachment_url: '{{#? ATTACHMENTURL }}',
    };
    const transform = new Transform(template);
    return transform.transform(list, [
        'installment_partner_document_id',
        'installment_partner_id',
        'document_name',
        'attachment_name',
        'attachment_url',
    ]);
};

const periodList = (list = []) => {
    const template = {
        installment_partner_document_id: '{{#? INSTALLMENTPARTNERPERIODID }}',
        installment_partner_id: '{{#? INSTALLMENTPARTNERID }}',
        period_value: '{{#? PERIODVALUE }}',
        period_unit: '{{#? PERIODUNIT }}',
        min_prepay: '{{#? MINPREPAY }}',
        interest_rate: '{{#? INTERESTRATE }}',
        payer: '{{#? PAYER }}',
    };
    const transform = new Transform(template);
    return transform.transform(list, [
        'installment_partner_document_id',
        'installment_partner_id',
        'period_value',
        'period_unit',
        'min_prepay',
        'interest_rate',
        'payer',
    ]);
};

const paymentList = (list = []) => {
    const template = {
        installment_partner_payment_id: '{{#? INSTALLMENTPARTNERPAYMENTID }}',
        installment_partner_id: '{{#? INSTALLMENTPARTNERID }}',
        order_create_from: '{{#? ORDERCREATEFROM }}',
        order_create_to: '{{#? ORDERCREATETO }}',
        payment_day: '{{#? PAYMENTDAY }}',
    };
    const transform = new Transform(template);
    return transform.transform(list, [
        'installment_partner_payment_id',
        'installment_partner_id',
        'order_create_from',
        'order_create_to',
        'payment_day',
    ]);
};

const options = (list = []) => {
    return transform.transform(list, [
        'installment_partner_code',
        'installment_partner_id',
        'installment_partner_logo',
        'installment_partner_name',
        'period_list',
        'name',
        'id',
    ]);
};

module.exports = {
    detail,
    list,
    documentList,
    periodList,
    paymentList,
    options,
};
