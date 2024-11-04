const lodashTemplate = require('lodash/template');
const ServiceResponse = require('../../common/responses/service.response');
const mailchimpTransactional = require('@mailchimp/mailchimp_transactional')(process.env.MAILCHIMP_TRANSACTION_APIKEY);

const compliedTemplate = (template, data, typeSend = 'ZALO') => {
    const compiled = lodashTemplate(template);
    const compliedObj = {};
    if (template.includes('<%= PREORDERID %>')) {
        compliedObj['PREORDERID'] = data?.pre_order_id || '';
    }
    if (template.includes('<%= ORDERNO %>')) {
        compliedObj['ORDERNO'] = data?.order_no || '';
    }
    if (template.includes('<%= RECEIVEADDRESS %>')) {
        compliedObj['RECEIVEADDRESS'] = data?.receive_address || '';
    }
    if (template.includes('<%= PAYMENTTYPE %>')) {
        compliedObj['PAYMENTTYPE'] = data?.payment_type || '';
    }
    if (template.includes('<%= TOTALMONEY %>')) {
        compliedObj['TOTALMONEY'] = data?.total_money || '';
    }
    if (template.includes('<%= ORDERLINK %>')) {
        compliedObj['ORDERLINK'] = data?.order_link || 'Chua xuat hoa don';
    }
    if (template.includes('<%= PRODUCTNAME %>')) {
        compliedObj['PRODUCTNAME'] = data?.product_name_list || '';
    }
    if (template.includes('<%= PREPRODUCTPRICE %>')) {
        compliedObj['PREPRODUCTPRICE'] = data?.total_amount || '';
    }
    if (template.includes('<%= PREPRODUCTIMAGEURL %>')) {
        compliedObj['PREPRODUCTIMAGEURL'] = data?.pre_product_image_url || '';
    }
    if (template.includes('<%= PREPRODUCTLISTEDPRICE %>')) {
        compliedObj['PREPRODUCTLISTEDPRICE'] = data?.pre_product_list_price || '';
    }

    //
    if (template.includes('<%= FULLNAME %>')) {
        compliedObj['FULLNAME'] = data?.full_name || '';
    }
    if (template.includes('<%= EMAIL %>')) {
        compliedObj['EMAIL'] = data?.email || '';
    }
    if (template.includes('<%= PHONENUMBER %>')) {
        compliedObj['PHONENUMBER'] = data?.phone_number || '';
    }
    if (template.includes('<%= BIRTHDAY %>')) {
        compliedObj['BIRTHDAY'] = data?.birthday || '';
    }
    if (template.includes(`<%= INTERESTID %>`)) {
        compliedObj['INTERESTID'] = btoa(`${typeSend}_${data?.customer_code}`);
    }
    if (template.includes('<%= COUPONCODE %>')) {
        compliedObj['COUPONCODE'] = data?.coupon_code || 'ABCDE';
    }
    const compliedResult = compiled(compliedObj);
    return compliedResult;
};

const sendOneMail = async ({ from_email, mail_to, from_name, mail_subject, mail_reply, email_content }) => {
    try {
        const payload = {
            message: {
                html: email_content,
                subject: mail_subject,
                from_email: from_email,
                from_name: from_name,
                reply_to: mail_reply,
                to: [
                    {
                        email: mail_to,
                    },
                ],
                global_merge_vars: [],
                merge_vars: [],
                track_opens: true,
                track_clicks: true,
            },
        };

        const response = await mailchimpTransactional.messages.send(payload);

        return new ServiceResponse(true, 'success', response);
    } catch (e) {
        logger.error(e.message, { function: 'MailChimpService.sendOneMail' });
        return new ServiceResponse(false, e.message);
    }
};

const checkJsonByArrayKey = (json = {}, arr = []) => {
    for (let i = 0; i < arr.length; i++) {
        const convertToString = arr[i].toString();
        const checkKey = json.hasOwnProperty(convertToString);
        if (!checkKey) {
            return false;
        }
    }
    return true;
};

const convertPaymentStatus = (status) => {
    const result =
        status === 0
            ? 'Chưa thanh toán'
            : status === 1
            ? 'Đã thanh toán'
            : status === 2
            ? 'Đang thanh toán'
            : status === 3
            ? 'Chưa đủ cọc'
            : status;

    return result;
};

const convertPaymentType = (type) => {
    const res =
        type === 1
            ? 'Tiền mặt'
            : type === 2
            ? 'Chuyển khoản'
            : type === 3
            ? 'Thẻ'
            : type === 4
            ? 'Cod'
            : type === 5
            ? 'VNPAY'
            : type === 6
            ? 'FUNDIIN'
            : type;

    return res;
};

const addLeadingZero = (str) => {
    // Kiểm tra xem chuỗi có bắt đầu bằng số 0 không
    if (str !== null && str.startsWith('0')) {
        // Nếu có, trả về chuỗi ban đầu
        return str;
    } else {
        // Nếu không, thêm số 0 vào đầu chuỗi và trả về
        return '0' + str;
    }
};

module.exports = {
    compliedTemplate,
    sendOneMail,
    checkJsonByArrayKey,
    convertPaymentStatus,
    convertPaymentType,
    addLeadingZero,
};
