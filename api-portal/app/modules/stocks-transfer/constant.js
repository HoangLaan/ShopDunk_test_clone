const DELIVERY_STATUS = {
    NOT_YET: 1,
    IN_PROGRESS: 2,
    LATE: 3,
    COMPLETED_LATE: 4,
    COMPLETED_ON_TIME: 5,
};

module.exports = {
    DELIVERY_STATUS,
};

const a = {
    order_id: null,
    payment_status: 0,
    is_delivery_type: 1,
    order_source: 1,
    total_discount: 0,
    is_discount_percent: 0,
    is_active: 1,

    total_vat: 45455, // Tổng VAT
    is_cash_money: 0,
    commissions: [],
    button_type: 'save',
    is_can_stockout: 1,
    is_can_collect_money: 1,
    is_can_create_receiveslip: 1,
    is_can_edit: 1,
    is_plus_point: 1,

    receiving_date: '15/11/2023',

    data_payment: [
        {
            payment_form_id: 22,
            payment_form_name: 'Tiền Mặt',
            payment_type: 1,
            pay_partner_id: null,
            pay_partner_name: null,
            pay_partner_full_name: null,
            pay_partner_code: null,
            pay_partner_logo: null,
            payment_value: 0, // Mặc định là 0 khi chưa thanh toán
            is_checked: true,
        },
        {
            payment_form_id: 23,
            payment_form_name: 'Chuyển khoản',
            payment_type: 2,
            pay_partner_id: null,
            pay_partner_name: null,
            pay_partner_full_name: null,
            pay_partner_code: null,
            pay_partner_logo: null,
            bank_list: [
                {
                    bank_logo: 'https://shopdunk-test.blackwind.vn//file/0aa7e214-5573-4e81-8ba0-6e756735ffc4.jpeg',
                    bank_name: 'Ngân hàng TMCP Công Thương Việt Nam',
                    bank_number: '111002669084',
                    bank_account_name: 'CÔNG TY CỔ PHẦN HESMAN VIỆT NAM SHOPDUNK 143 THÁI HÀ',
                    bank_branch: null,
                    payment_type: 2,
                    bank_id: '52',
                    bank_account_id: 18,
                },
            ],
            payment_value: 0,
            is_checked: false,
        },
        {
            payment_form_id: 25,
            payment_form_name: 'ZaloPay',
            payment_type: 3,
            pay_partner_id: 44,
            pay_partner_name: 'ZALOPAY',
            pay_partner_full_name: 'Công ty Cổ phần Zion',
            pay_partner_code: 'ZION',
            pay_partner_logo: null,
            payment_value: 0,
            is_checked: false,
        },
        {
            payment_form_id: 26,
            payment_form_name: 'OnePay',
            payment_type: 3,
            pay_partner_id: 50,
            pay_partner_name: 'ONEPAY',
            pay_partner_full_name: 'CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ TRỰC TUYẾN ONEPAY',
            pay_partner_code: 'ONEPAY',
            pay_partner_logo: null,
            payment_value: 0,
            is_checked: false,
        },
        {
            payment_form_id: 28,
            payment_form_name: 'Payoo',
            payment_type: 3,
            pay_partner_id: 49,
            pay_partner_name: 'PAYOO',
            pay_partner_full_name: 'CÔNG TY CP DỊCH VỤ TRỰC TUYẾN CỘNG ĐỒNG VIỆT',
            pay_partner_code: 'PAYOO',
            pay_partner_logo: null,
            payment_value: 0,
            is_checked: false,
        },
        {
            payment_form_id: 31,
            payment_form_name: 'Thanh toán ShopeePay',
            payment_type: 3,
            pay_partner_id: 47,
            pay_partner_name: 'SHOPEEPAY',
            pay_partner_full_name: 'CÔNG TY CỔ PHẦN SHOPEEPAY',
            pay_partner_code: 'SHOPEEPAY',
            pay_partner_logo: null,
            payment_value: 0,
            is_checked: false,
        },
        {
            payment_form_id: 35,
            payment_form_name: 'MOMO',
            payment_type: 3,
            pay_partner_id: 45,
            pay_partner_name: 'MOMO',
            pay_partner_full_name: 'Công ty Cổ phần Dịch vụ Di động Trực Tuyến(M_SERVICE)',
            pay_partner_code: 'MOMO',
            pay_partner_logo: null,
            payment_value: 0,
            is_checked: false,
        },
        {
            payment_form_id: 38,
            payment_form_name: 'VNPAY',
            payment_type: 3,
            pay_partner_id: 45,
            pay_partner_name: 'MOMO',
            pay_partner_full_name: 'Công ty Cổ phần Dịch vụ Di động Trực Tuyến(M_SERVICE)',
            pay_partner_code: 'MOMO',
            pay_partner_logo: null,
            payment_value: 0,
            is_checked: false,
        },
    ],

    return_money: 0,

    order_type_id: 39, // Mặc định là đơn hàng nội bộ, về sau get từ type = 11 trong SL_ORDERTYPE
    order_no: 'DH23111500003', // Lấy từ orderService.createOrderNo()
    created_date: '15/11/2023',
    order_status_id: 22,
    created_user: 'SD TEST', // Lấy người xuất ở phiếu xuất kho

    // Thay thế customer bằng thông tin của chi nhánh nhận
    business_receive_id: 1,
    business_transfer_id: 1,

    // customer: {
    //     label: 'KH0000076-KHHHH DEMO ',
    //     value: 'KH232205',
    //     key: 'KH232205',
    //     member_id: '232205',
    //     dataleads_id: null,
    //     customer_code: 'KH0000076',
    //     full_name: 'KHHHH DEMO ',
    //     gender: 1,
    //     birthday: '01/01/2000',
    //     phone_number: '0795660196',
    //     customer_type_name: 'Khách hàng phổ thông ',
    //     customer_type_id: 83,
    //     total_point: null,
    //     current_point: null,
    //     address_full: 'Thành phố Hà Nội',
    //     email: null,
    // },
    // phone_number: '0795660196',
    // current_point: null,
    // customer_type_name: 'Khách hàng phổ thông ',
    // address_full: 'Thành phố Hà Nội',

    // Thông tin xuất hàng (Giống thông tin khách hàng)
    store_id: 1, // id cửa hàng chuyển
    store_address: '143 Thái Hà, Phường Trung Liệt, Quận Đống Đa, Thành phố Hà Nội',

    // Có mateial và sẽ xử lí sau
    materials: [],
    description: `Đơn hàng chuyển nội bộ theo ${'...'}`,

    // Thông tin khác (Lấy thông tin từ chi nhánh nhận)
    is_invoice: 1,
    invoice_full_name: 'KHHHH DEMO ',
    invoice_tax: 'zzz',
    invoice_company_name: 'hehe', // = invoice_full_name
    invoice_email: 'hehe@gmail.com',
    invoice_address: 'Thành phố Hà Nội',

    _total_money_without_vat: 454545, // sum tổng thành tiền chưa bao gồm vat (Cột `Đơn giá bán (chưa bao gồm VAT)` ở mockup)
    _total_vat: 45455, // Sum cột tiền thuế ở mockup

    // _products: [
    //     {
    //         product_code: '23083021',
    //         product_name:
    //             'Miếng dán cường lực Mipow Kingbull Anti-Spy Premium for iPhone 15 Pro Max 6.7" - Chống nhìn trộm 23083021',
    //         product_id: '2780',
    //         price: 500000,
    //         unit_name: 'Chiếc ',
    //         supplier_name: null,
    //         unit_id: 105,
    //         imei_code: 'URAKEJOQM7',
    //         category_name: 'Miếng dán cường lực',
    //         product_category_id: 47,
    //         model_name: 'Kingbull Anti-Spy Premium ',
    //         price_id: 3185,
    //         base_price: 454545,
    //         value_vat: 10,
    //         product_output_type_id: 7,
    //         stock_id: 322,
    //         stock_date: '25/09/2023',
    //         is_hot: 0,
    //         product_output_type: [
    //             {
    //                 id: 7,
    //                 name: 'Xuất bán lẻ',
    //                 value: 7,
    //                 label: 'Xuất bán lẻ',
    //                 product_id: 2780,
    //                 imei_code: null,
    //                 base_price: 454545,
    //                 value_vat: 10,
    //                 price_id: 3185,
    //                 price: 500000,
    //             },
    //         ],
    //         total_price: 500000,
    //         total_price_base: 454545,
    //         vat_amount: 45455,
    //         discount: 0,
    //         quantity: 1,
    //         _price_ratio: 1,
    //         _total_discount: 0,
    //         _discount_percent: 0,
    //         _total_money_without_vat: 454545,
    //         _vat_percent: 0.1000011000011,
    //         _vat_amount: 45455,
    //     },
    // ],
    products: {
        URAKEJOQM7: {
            // product_code: '23083021', // ok
            // product_name:
            //     'Miếng dán cường lực Mipow Kingbull Anti-Spy Premium for iPhone 15 Pro Max 6.7" - Chống nhìn trộm 23083021', // ok
            product_id: '2780', // ok
            price: 500000, // ok
            unit_name: 'Chiếc ', // ok
            supplier_name: null,
            unit_id: 105, // ok
            imei_code: 'URAKEJOQM7', // product_imei
            // category_name: 'Miếng dán cường lực',
            // product_category_id: 47,
            // model_name: 'Kingbull Anti-Spy Premium ',
            price_id: 3185,
            // base_price: 454545,
            value_vat: 10, // Đang mặc định là 10, Sẽ lấy ra từ OUTPUTTYPE với hình thức xuất là `xuất bán hàng nội bộ`
            product_output_type_id: 17, // Hình thức xuất: mặc định là xuất bán hàng nội bộ
            stock_id: 322,
            // stock_date: '25/09/2023',
            is_hot: 0,
            // product_output_type: [
            //     {
            //         id: 7,
            //         name: 'Xuất bán lẻ',
            //         value: 7,
            //         label: 'Xuất bán lẻ',
            //         product_id: 2780,
            //         imei_code: null,
            //         base_price: 454545,
            //         value_vat: 10,
            //         price_id: 3185,
            //         price: 500000,
            //     },
            // ],
            total_price: 500000,
            total_price_base: 454545,
            vat_amount: 45455,
            discount: 0,
            quantity: 1,
            _price_ratio: 1,
            _total_discount: 0,
            _discount_percent: 0,
            _total_money_without_vat: 454545,
            _vat_percent: 0.1000011000011,
            _vat_amount: 45455,

            revenue_account_id: 25, // TK Doanh thu: 131
            debt_account_id: 21, // TK: 136
            tax_account_id: 116, // TK Thuế: 3331
        },
    },

    presenter_id: null,
    order_type: 1,
    total_money: 500000, // Sum thành tiền ở mockup
    sub_total_apply_discount: 500000, // Tổng tiền phải thanh toán
    total_a_mount: 500000, // = total_money
    discount_value: 0,
    discount_coupon: 0,
    promotion_offers: [],
    gifts: [],
    coupon: null,

    // member_id: '232205',
    // dataleads_id: null,
    // customer_type_id: 83,
    // address_id: '404',
    // business_id: '3',
    // business_name: 'CÔNG TY CỔ PHẦN HESMAN VIỆT NAM',
    // store_name: 'HNI03-143TH',
    // acpoint_id: 30,
    // accumulate_point: 0,
};
