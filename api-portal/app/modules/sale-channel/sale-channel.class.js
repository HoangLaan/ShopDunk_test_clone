const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const listPageConnect = pages => {
    const transform = new Transform({
        page_id: '{{#? PAGEID}}',
        page_name: '{{#? PAGENAME}}',
        page_avatar: '{{#? PAGEAVATAR}}',
        is_connect: '{{ISCONNECT ? ISCONNECT : 0}}',
        page_token: '{{#? PAGETOKEN}}',
    });
    return transform.transform(pages, ['page_id', 'page_name', 'page_avatar', 'is_connect', 'page_token']);
};

const listConversation = conversations => {
    const transform = new Transform({
        page_id: '{{#? PAGEID}}',
        conversation_id: '{{#? CONVERSATIONID}}',
        is_seen: '{{ISSEEN ? 1 : 0}}',
        message: {
            message_id: '{{#? MESSAGEID}}',
            text: '{{#? MESSAGE}}',
            sticker: [
                {
                    '{{#if STICKER}}': '{{STICKER}}',
                },
                {
                    '{{#else}}': null,
                },
            ],
            attachment: [
                {
                    '{{#if ATTACHMENTID}}': {
                        file_url: '{{#? FILEURL}}',
                        file_name: '{{#? FILENAME}}',
                        attachment_id: '{{#? ATTACHMENTID}}',
                        file_type: '{{#? FILETYPE}}',
                    },
                },
                {
                    '{{#else}}': null,
                },
            ],
            is_read: '{{ISREAD ? 1 : 0}}',
            is_sent: '{{ISSENT ? 1 : 0}}',
            created_date: '{{#? CREATEDDATE}}',
            from: {
                id: '{{#? FROMID}}',
                name: '{{#? FROMNAME}}',
                avatar: [
                    {
                        '{{#if FROMAVATAR && FROMAVATAR.indexOf(`http`) >= 0 }}': `{{FROMAVATAR}}`,
                    },
                    {
                        '{{#elseif FROMAVATAR}}': `${config.domain_cdn}{{FROMAVATAR}}`,
                    },
                    {
                        '{{#else}}': null,
                    },
                ],
            },
            to: {
                id: '{{#? TOID}}',
                name: '{{#? TONAME}}',
                avatar: [
                    {
                        '{{#if TOAVATAR && TOAVATAR.indexOf(`http`) >= 0 }}': `{{TOAVATAR}}`,
                    },
                    {
                        '{{#elseif TOAVATAR}}': `${config.domain_cdn}{{TOAVATAR}}`,
                    },
                    {
                        '{{#else}}': null,
                    },
                ],
            },
        },
        user: {
            user_id: '{{#? USERID}}',
            email: '{{#? EMAIL}}',
            name: '{{#? NAME}}',
            profile_pic: [
                {
                    '{{#if PROFILEPIC && PROFILEPIC.indexOf(`http`) >= 0 }}': `{{PROFILEPIC}}`,
                },
                {
                    '{{#elseif PROFILEPIC}}': `${config.domain_cdn}{{PROFILEPIC}}`,
                },
                {
                    '{{#else}}': null,
                },
            ],
        },
    });
    return transform.transform(conversations, ['page_id', 'conversation_id', 'message', 'user', 'is_seen']);
};

const listMessage = messages => {
    const transform = new Transform({
        conversation_id: '{{#? CONVERSATIONID}}',
        page_id: '{{#? PAGEID}}',
        message_id: '{{#? MESSAGEID}}',
        text: '{{#? MESSAGE}}',
        sticker: [
            {
                '{{#if STICKER}}': '{{STICKER}}',
            },
            {
                '{{#else}}': null,
            },
        ],
        attachment: [
            {
                '{{#if ATTACHMENTID}}': {
                    file_url: '{{#? FILEURL}}',
                    file_name: '{{#? NAME}}',
                    attachment_id: '{{#? ATTACHMENTID}}',
                    file_type: '{{#? FILETYPE}}',
                },
            },
            {
                '{{#else}}': null,
            },
        ],
        is_read: '{{ISREAD ? 1 : 0}}',
        is_sent: '{{ISSENT ? 1 : 0}}',
        created_date: '{{#? CREATEDDATE}}',
        last_reply_userid: '{{#? LASTREPLYUSERID}}',
        last_reply_username: '{{#? LASTREPLYUSERNAME}}',
        last_reply_fullname: '{{#? LASTREPLYFULLNAME}}',
        from: {
            id: '{{#? FROMID}}',
            name: '{{#? FROMNAME}}',
            avatar: [
                {
                    '{{#if FROMAVATAR && FROMAVATAR.indexOf(`http`) >= 0 }}': `{{FROMAVATAR}}`,
                },
                {
                    '{{#elseif FROMAVATAR}}': `${config.domain_cdn}{{FROMAVATAR}}`,
                },
                {
                    '{{#else}}': null,
                },
            ],
        },
        to: {
            id: '{{#? TOID}}',
            name: '{{#? TONAME}}',
            avatar: [
                {
                    '{{#if TOAVATAR && TOAVATAR.indexOf(`http`) >= 0 }}': `{{TOAVATAR}}`,
                },
                {
                    '{{#elseif TOAVATAR}}': `${config.domain_cdn}{{TOAVATAR}}`,
                },
                {
                    '{{#else}}': null,
                },
            ],
        },
    });
    return transform.transform(messages, [
        'message_id',
        'text',
        'sticker',
        'attachment',
        'is_read',
        'is_sent',
        'created_date',
        'from',
        'to',
        'conversation_id',
        'page_id',
        'last_reply_userid',
        'last_reply_username',
        'last_reply_fullname',
    ]);
};

const listHashTag = (hashtags, isConversation = false) => {
    const transform = new Transform({
        id: '{{#? ID}}',
        color: '{{#? COLOR}}',
        name: '{{#? NAME}}',
        user_id: '{{#? USERID}}',
        __user_id: '{{#? USERID}}',
        page_id: '{{#? PAGEID}}',
    });
    if (isConversation) {
        return transform.transform(hashtags, ['id', 'name', 'color', 'user_id']);
    }
    return transform.transform(hashtags, ['id', 'name', 'color', '__user_id']);
};

const listNote = notes => {
    const transform = new Transform({
        id: '{{#? ID}}',
        note: '{{#? NOTE}}',
        created_date: '{{#? CREATEDDATE}}',
    });
    return transform.transform(notes, ['id', 'note', 'created_date']);
};

const listOrder = orders => {
    const transform = new Transform({
        order_id: '{{#? ORDERID}}',
        order_status: '{{#? STATUSNAME}}',
        order_status_color: '{{#? STATUSCOLOR}}',
        order_no: '{{#? ORDERNO}}',
        order_date: '{{#? CREATEDDATE}}',
        total_money: '{{#? TOTALMONEY}}',
    });
    return transform.transform(orders, [
        'order_id',
        'order_status',
        'order_status_color',
        'order_no',
        'order_date',
        'total_money',
    ]);
};

const listAttachmentByConversationId = pages => {
    const transform = new Transform({
        conversation_id: '{{#? CONVERSATIONID}}',
        message_id: '{{#? MESSAGEID}}',
        file_url: '{{#? FILEURL}}',
        mime_type: '{{#? MIMETYPE}}',
        file_name: '{{#? NAME}}',
        file_size: '{{#? SIZE}}',
    });
    return transform.transform(pages, [
        'conversation_id',
        'message_id',
        'file_url',
        'mime_type',
        'file_name',
        'file_size',
    ]);
};

const infoUser = info => {
    const transform = new Transform({
        user_id: '{{#? USERID}}',
        member_id: '{{#? MEMBERID}}',
        full_name: '{{#? FULLNAME}}',
        dob: '{{#? BIRTHDAY}}',
        email: '{{#? EMAIL}}',
        phone_number: '{{#? PHONENUMBER}}',
        province_id: '{{#? PROVINCEID}}',
        district_id: '{{#? DISTRICTID}}',
        ward_id: '{{#? WARDID}}',
        country_id: '{{#? COUNTRYID}}',
        address_full: '{{#? ADDRESSFULL}}',
        address: '{{#? ADDRESS}}',
        gender: '{{#? GENDER ? 1 : 0 }}',
        avatar: [
            {
                '{{#if AVATAR}}': `${config.domain_cdn}{{AVATAR}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
    });
    return transform.transform(info, [
        'user_id',
        'full_name',
        'email',
        'dob',
        'phone_number',
        'province_id',
        'district_id',
        'ward_id',
        'country_id',
        'address_full',
        'avatar',
        'address',
        'gender',
        'member_id',
    ]);
};

const listProduct = (products = []) => {
    const transform = new Transform({
        product_id: '{{#? PRODUCTID}}',
        product_code: '{{#? PRODUCTCODE}}',
        product_name: '{{#? PRODUCTNAME}}',
        model_name: '{{#? MODELNAME}}',
        category_name: '{{#? CATEGORYNAME}}',
        unit_id: '{{#? UNITID}}',
        unit_name: '{{#? UNITNAME}}',
        total_inventory: '{{TOTALINVENTORY ? TOTALINVENTORY : 0}}',
        product_image: [
            {
                '{{#if PRODUCTIMAGE}}': `${config.domain_cdn}{{PRODUCTIMAGE}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        price: '{{#? PRICE}}',
        area_id: '{{#? AREAID}}',
        business_id: '{{#? BUSINESSID}}',
        output_type_id: '{{#? OUTPUTTYPEID}}',
        total_inventory: '{{#? TOTALINVENTORY}}',
    });
    return transform.transform(products, [
        'product_id',
        'product_code',
        'product_name',
        'category_name',
        'model_name',
        'unit_id',
        'unit_name',
        'total_inventory',
        'product_image',
        'price',
        'area_id',
        'business_id',
        'output_type_id',
    ]);
};

const optionsSearchProduct = product => {
    const transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        product_name: '{{#? PRODUCTNAME}}',
    });
    return transform.transform(product, ['id', 'name', 'product_name']);
};

// PROMOTION
const templatePromotion = {
    promotion: {
        promotion_id: '{{#? PROMOTIONID}}',
        promotion_name: '{{#? PROMOTIONNAME}}',
        short_description: '{{#? SHORTDESCRIPTION}}',
        is_apply_order: '{{ISAPPLYORDER ? 1 : 0}}',
        is_apply_all_product: '{{ISAPPLYALLPRODUCT ? 1 : 0}}',
        is_promotion_by_price: '{{ISPROMOTIONBYPRICE ? 1 : 0}}',
        from_price: '{{FROMPRICE ? FROMPRICE : 0}}',
        to_price: '{{TOPRICE ? TOPRICE : 0}}',
        is_promotion_by_total_money: '{{ISPROMOTIONBYTOTALMONEY ? 1 : 0}}',
        min_promotion_total_money: '{{MINPROMOTIONTOTALMONEY ? MINPROMOTIONTOTALMONEY : 0}}',
        max_promotion_total_money: '{{MAXPROMOTIONTOTALMONEY ? MAXPROMOTIONTOTALMONEY : 0}}',
        is_promotion_by_total_quantity: '{{ISPROMOTIONBYTOTALQUANTITY ? 1 : 0}}',
        min_promotion_total_quantity: '{{MINPROMOTIONTOTALQUANTITY ? MINPROMOTIONTOTALQUANTITY : 0}}',
        max_promotion_total_quantity: '{{MAXPROMOTIONTOTALQUANTITY ? MAXPROMOTIONTOTALQUANTITY : 0}}',
        is_apply_with_other_promotion: '{{ISAPPLYWITHORDERPROMOTION ? 1 : 0}}',
        is_limit_promotion_times: '{{ISLIMITPROMOTIONTIMES ? 1 : 0}}',
        max_promotion_time: '{{MAXPROMOTIONTIMES ? MAXPROMOTIONTIMES : 0}}',
        is_combo_promotion: '{{ISCOMBOPROMOTION ? 1 : 0}}',
        is_reward_point: '{{ISREWARDPOINT ? 1 : 0}}',
        is_picked: '{{ISPICKED ? 1 : 0}}',
        is_apply_product_category: '{{ISAPPLYPRODUCTCATEGORY ? 1 : 0}}',
    },
    product_apply: {
        promotion_id: '{{#? PROMOTIONID}}',
        product_id: '{{#? PRODUCTID}}',
    },
    product_category_apply: {
        promotion_id: '{{#? PROMOTIONID}}',
        product_category_id: '{{#? PRODUCTCATEGORYID}}',
    },
    offer: {
        promotion_id: '{{#? PROMOTIONID}}',
        business_id: '{{#? BUSINESSID}}',
        promotion_offer_id: '{{#? PROMOTIONOFFERID}}',
        promotion_offer_name: '{{#? PROMOTIONOFFERNAME}}',
        is_fix_price: '{{ISFIXPRICE ? 1 : 0}}',
        is_percent_discount: '{{ISPERCENTDISCOUNT ? 1 : 0}}',
        is_fixed_gift: '{{ISFIXEDGIFT ? 1 : 0}}',
        is_discount_by_set_price: '{{ISDISCOUNTBYSETPRICE ? 1 : 0}}',
        discount_value: '{{DISCOUNTVALUE ? DISCOUNTVALUE : 0}}',
        is_picked: '{{ISPICKED ? 1 : 0}}',
        discount: '{{DISCOUNT ? DISCOUNT : 0}}',
    },
    gift: {
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        promotion_offer_id: '{{#? PROMOTIONOFFERID}}',
        product_code: '{{#? PRODUCTCODE}}',
        product_gift_id: '{{#? PRODUCTGIFTSID}}',
        unit_name: '{{#? UNITNAME}}',
        product_unit_id: '{{#? UNITID}}',
        is_picked: '{{ISPICKED ? 1 : 0}}',
        quantity: '{{QUANTITY ? QUANTITY : 0}}',
    },
};
const promotions = (promotion, applied = false) => {
    const transform = new Transform(templatePromotion.promotion);
    let columns = [
        'promotion_id',
        'promotion_name',
        'short_description',
        'is_apply_order',
        'is_apply_all_product',
        'is_promotion_by_price',
        'from_price',
        'to_price',
        'is_promotion_by_total_money',
        'min_promotion_total_money',
        'max_promotion_total_money',
        'is_promotion_by_total_quantity',
        'min_promotion_total_quantity',
        'max_promotion_total_quantity',
        'is_apply_with_other_promotion',
        'is_limit_promotion_times',
        'max_promotion_time',
        'is_combo_promotion',
        'is_reward_point',
        'is_apply_product_category',
    ];
    if (applied) columns.push('is_picked');
    return transform.transform(promotion, columns);
};

const offers = (offer, applied = false) => {
    const transform = new Transform(templatePromotion.offer);
    let columns = [
        'promotion_id',
        'business_id',
        'promotion_offer_name',
        'promotion_offer_id',
        'is_fix_price',
        'is_percent_discount',
        'is_fixed_gift',
        'is_discount_by_set_price',
        'discount_value',
    ];
    if (applied) columns = [...columns, ...['is_picked', 'discount']];
    return transform.transform(offer, columns);
};

const productApplyPromotion = products => {
    const transform = new Transform(templatePromotion.product_apply);
    return transform.transform(products, ['promotion_id', 'product_id']);
};

const gift = (products, applied = false) => {
    const transform = new Transform(templatePromotion.gift);
    let columns = [
        'product_name',
        'product_id',
        'promotion_offer_id',
        'product_gift_id',
        'unit_name',
        'product_code',
        'product_unit_id',
    ];
    if (applied) columns = [...columns, ...['is_picked', 'quantity']];
    return transform.transform(products, columns);
};

//productCategoryApplyPromotion
const productCategoryApplyPromotion = products => {
    const transform = new Transform(templatePromotion.product_category_apply);
    return transform.transform(products, ['promotion_id', 'product_category_id']);
};

module.exports = {
    listConversation,
    listPageConnect,
    listMessage,
    listHashTag,
    listNote,
    listOrder,
    infoUser,
    listProduct,
    optionsSearchProduct,
    promotions,
    offers,
    productApplyPromotion,
    productCategoryApplyPromotion,
    gift,
    listAttachmentByConversationId,
};
