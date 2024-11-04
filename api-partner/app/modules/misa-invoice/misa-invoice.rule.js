const Joi = require('joi');
const moment = require('moment');
const { ITEM_TYPE } = require('./constants');

const RESPONSE_SCHEMA = {
    Success: Joi.boolean(),
    ErrorCode: Joi.any(),
    DescriptionErrorCode: Joi.any(),
    Errors: Joi.array(),
    Data: Joi.any(),
    CustomData: Joi.any(),
};

const SELLER_SCHEMA = {
    SellerLegalName: Joi.string().max(100),
    SellerTaxCode: Joi.string().max(14),
    SellerAddress: Joi.string().max(400),
    SellerPhoneNumber: Joi.string().max(20),
    SellerEmail: Joi.string().email(),
    SellerBankAccount: Joi.string().max(30),
    SellerBankName: Joi.string().max(400),
    SellerFax: Joi.string().max(20),
    SellerWebsite: Joi.string().max(100),
};

const BUYER_SCHEMA = {
    BuyerLegalName: Joi.string().max(100).allow([null, '']),
    BuyerTaxCode: Joi.string().max(14).allow([null, '']),
    BuyerAddress: Joi.string().max(400).allow([null, '']),
    BuyerCode: Joi.string().max(50).allow([null, '']),
    BuyerPhoneNumber: Joi.string().max(20).allow([null, '']),
    BuyerEmail: Joi.string().email().allow([null, '']),
    BuyerFullName: Joi.string().max(100).allow([null, '']),
    BuyerBankAccount: Joi.string().max(30).allow([null, '']),
    BuyerBankName: Joi.string().max(400).allow([null, '']),
};

const ORIGINAL_INVOICE_DATA_SCHEMA = {
    RefID: Joi.string().max(50).required(), // Mã Order
    InvSeries: Joi.string().max(10),
    InvoiceName: Joi.string().max(100).default('Hóa đơn giá trị gia tăng'), // Tên hóa đơn
    InvDate: Joi.string().default(moment().format('YYYY-MM-DD')), // ngày hóa đơn
    CurrencyCode: Joi.string().valid(['VND', 'USD']).default('VND'), // Đơn vị tiền tệ
    ExchangeRate: Joi.number().default(1.0).required(), // Tỷ số quy đổi
    PaymentMethodName: Joi.string().valid(['TM', 'CK', 'TM/CK']).default('TM'), // Phương thức thanh toán
    InvoiceNote: Joi.string().max(255),
    CompanyBranchBankName: Joi.string().max(400),
    CompanyBankNameWithBranch: Joi.string().max(400),
    DiscountRate: Joi.number().default(0),
    // TotalAmountWithoutVATOC: Joi.number(), // Tổng tiền chưa thuế VAT
    // TotalAmountWithoutVAT: Joi.number().required(), // Tổng tiền chưa thuế VAT
    // TotalVATAmountOC: Joi.number(), // Tổng tiền thuế,
    // TotalVATAmount: Joi.number().required(), // Tổng tiền thuế quy đổi
    TotalDiscountAmountOC: Joi.number().default(0), // Tổng tiền CKTM
    TotalDiscountAmount: Joi.number().default(0), // Tổng tiền CKTM quy đổi
    // TotalAmountOC: Joi.number(), // Tổng tiền bằng số
    // TotalAmount: Joi.number().required(), // Tổng tiền bằng số quy đổi
    // TotalSaleAmountOC: Joi.number(), // Tổng tiền hàng
    // TotalSaleAmount: Joi.number().required(), // Tổng tiền hàng quy đổi
    // TotalAmountInWords: Joi.string().max(255), // Tổng tiền bằng chữ theo field TotalAmount
    ...BUYER_SCHEMA,
    ...SELLER_SCHEMA,
    OriginalInvoiceDetail: Joi.array()
        .items({
            ItemType: Joi.number().integer().valid(Object.values(ITEM_TYPE)).default(ITEM_TYPE.PRODUCT), // Tính chất hàng hóa
            LineNumber: Joi.number().integer().min(1).max(100), // STT dòng mặt hàng
            ItemCode: Joi.string().max(50), // 	Mã mặt hàng
            ItemName: Joi.string().max(500).required(), // Tên mặt hàng
            UnitName: Joi.string().max(50), // Đơn vị tính
            Quantity: Joi.number(), // Số lượng
            UnitPrice: Joi.number(), // Đơn vị tính
            DiscountRate: Joi.number().allow([null]).default(0), // Tỷ lệ chiết khấu
            DiscountAmountOC: Joi.number().allow([null]).default(0),
            DiscountAmount: Joi.number().allow([null]).default(0),
            AmountOC: Joi.number(), // Thành tiền
            Amount: Joi.number(), // Thành tiền quy đổi
            AmountWithoutVATOC: Joi.number(), // Thành tiền chưa thuế
            UnitPriceAfterTax: Joi.number(), // Đơn giá sau thuế
            AmountAfterTax: Joi.number(), // Thành tiền sau thuế quy đổi
            VATRateName: Joi.alternatives().try(
                Joi.string().valid('0%', '5%', '8%', '10%', 'KCT', 'KKKNT'),
                Joi.string().regex(/^KHAC:\d{1,2}\.\d{1,2}%$/),
            ),
            VATAmountOC: Joi.number(), // Tiền thuế
            VATAmount: Joi.number(), // Tiền thuế quy đổi
            SortOrder: Joi.number(), // Thứ tự hiển thị
            InventoryItemNote: Joi.string(), // Diễn giải hàng hóa
            LotNo: Joi.string(), // Số lô
            ExpiryDate: Joi.date(), // Hạn sử dụng
            UnitCode: Joi.string(), // Mã đơn vị tính
            TaxReductionAmountOC: Joi.number(), // Tiền thuế đc giảm nguyên tệ
            TaxReductionAmount: Joi.number(), // 	Tiền thuế được giảm quy đổi
            InWards: Joi.number(), // Số lượng thực nhập
            ChassisNumber: Joi.string(), // Số khung
            EngineNumber: Joi.string(), // Số máy
        })
        .required(), // Chi tiết hóa đơn
    TaxRateInfo: Joi.array().items({
        VATRateName: Joi.alternatives().try(
            Joi.string().valid('0%', '5%', '8%', '10%', 'KCT', 'KKKNT'),
            Joi.string().regex(/^KHAC:\d{1,2}\.\d{1,2}%$/),
        ),
        AmountWithoutVAT: Joi.number().required(), // Tiền chưa thuế
        VATAmount: Joi.number().required(), // Tiền thuế
    }), // Danh sách các loại thuế suất
    FeeInfo: Joi.array().items({
        FeeName: Joi.string().max(100).required(),
        FeeAmountOC: Joi.number().required(),
    }), // Danh sách các loại phí
    OptionUserDefined: Joi.object({
        MainCurrency: Joi.string().valid(['VND', 'USD']).default('VND'), // Đồng tiền hạch toán
        AmountDecimalDigits: Joi.string().max(1).default('0'), //	Định dạng số tiền quy đổi Giá trị từ 0 - 6
        AmountOCDecimalDigits: Joi.string().max(1).default('0'), // Định dạng số tiền nguyên tệ Giá trị từ 0 - 6
        UnitPriceOCDecimalDigits: Joi.string().max(1).default('0'), // Định dạng đơn giá nguyên tệ Giá trị từ 0 - 6
        UnitPriceDecimalDigits: Joi.string().max(1).default('0'), // Định dạng đơn giá quy đổi Giá trị từ 0 - 6
        QuantityDecimalDigits: Joi.string().max(1).default('0'), // Định dạng số lượng Giá trị từ 0 - 6
        CoefficientDecimalDigits: Joi.string().max(1).default('2'), // Định dạng tỷ lệ Giá trị từ 0 - 4
        ExchangRateDecimalDigits: Joi.string().max(1).default('0'), // Định dạng tỷ giá Giá trị từ 0 - 2
        ClockDecimalDigits: Joi.string(),
    }), // Định dạng số để hiển thị hóa đơn
    IsTaxReduction: Joi.boolean(),
};

const ruleTransport = {
    RefID: Joi.string().required(),
    ExchangeRate: Joi.number().integer().min(0).max(1).default(1),
    InvDate: Joi.string().default(moment().format('YYYY-MM-DD')),
    CurrencyCode: Joi.string().valid(['VND', 'USD']).default('VND'),
    InvSeries: Joi.string().default('6C23NYY'),
    InvoiceTemplateID: Joi.string(), // 'e22420d8-9b8a-4178-a3fc-aeda87ffc021'
    InternalCommand: Joi.string(), // lệnh điều động
    StockOutAddress: Joi.string(), // địa chỉ kho xuất
    TransporterName: Joi.string(), // người vận chuyển
    StockInAddress: Joi.string(), // địa chỉ kho nhận
    ContractDate: Joi.string(), // ngày hợp đồng
    InternalCommandNo: Joi.string().allow([null, '']), // lệnh điều động số 'LDD001111'
    InternalCommandDate: Joi.string().default(moment().format('YYYY-MM-DD')), // lệnh điều động ngày
    TransportContractCode: Joi.string().allow([null, '']), // hợp động số
    JournalMemo: Joi.string(), // Về việc
    Transport: Joi.string(), // phương tiện vận chuyển
    InternalCommandOwner: Joi.string(), // của
    StockTotalAmountOC: Joi.number(),
    StockTotalAmount: Joi.number(),
    OriginalInvoiceDetail: Joi.array().items({
        ItemCode: Joi.string().required(),
        ItemName: Joi.string().required(),
        UnitName: Joi.string(),
        Quantity: Joi.number().integer(),
        UnitPrice: Joi.number(),
        ItemType: Joi.number().integer().default(1),
        LineNumber: Joi.number().integer(),
        SortOrder: Joi.number().integer(),
        Amount: Joi.number(),
        AmountOC: Joi.number(),
        AmountWithoutVATOC: Joi.number(),
        InWards: Joi.number().integer(),
    }),
    TotalAmount: Joi.number(),
    TotalAmountOC: Joi.number(),
};

const rulePublishTransportHSM = Joi.object({
    RefID: Joi.string().required(),
    OriginalInvoiceData: Joi.object(ruleTransport).required(),
    IsSendEmail: Joi.boolean().default(false),
    ReceiverName: Joi.string(),
    ReceiverEmail: Joi.string().email(),
    IsInvoiceSummary: Joi.boolean().default(false),
});

const rulePublishHSM = Joi.object({
    RefID: Joi.string().required(),
    OriginalInvoiceData: Joi.object(ORIGINAL_INVOICE_DATA_SCHEMA).required(),
    IsSendEmail: Joi.boolean().default(true),
    ReceiverName: Joi.string(),
    ReceiverEmail: Joi.string().email(),
    IsInvoiceSummary: Joi.boolean().default(false),
});

const ruleSendMail = {
    SendEmailDatas: Joi.array().items({
        TransactionID: Joi.string().required(),
        ReceiverName: Joi.string(),
        ReceiverEmail: Joi.string().email().required(),
        CCEmail: Joi.string(),
        BCCEmail: Joi.string(),
        CallbackUrl: Joi.string(),
        ReplyEmail: Joi.string().email(),
    }),
    IsInvoiceCode: Joi.boolean().default(true), // đánh dấu hóa đơn có mã hay không mã
    IsInvoiceCalculatingMachine: Joi.boolean().default(false), // nếu là hóa đơn máy tính tiền
};

const cancelInvoice = {
    TransactionID: Joi.string().required(),
    InvNo: Joi.string().required(),
    RefDate: Joi.string().default(moment().format('YYYY-MM-DD')),
    CancelReason: Joi.string().default('Cancel throw API'),
};

const validateRules = {
    publishHsm: {
        body: rulePublishHSM,
    },
    sendMail: {
        body: ruleSendMail,
    },
    cancelInvoice: {
        body: cancelInvoice,
    },
    viewDemo: {
        body: ORIGINAL_INVOICE_DATA_SCHEMA,
    },
    viewDemoTransport: {
        body: ruleTransport,
    },
    publishTransportHSM: {
        body: rulePublishTransportHSM,
    },
};

module.exports = validateRules;

// TotalAmountWithoutVATOC: Tổng tiền chưa thuế  = TotalAmountOC - TotalVATAmountOC
// TotalVATAmountOC: Tổng tiền thuế = sum(VATAmountOC, itemType = 1) - sum(VATAmountOC, itemType = 3)
// TotalDiscountAmountOC: Tổng tiền CKTM  = sum(DiscountAmountOC) + sum(AmountOC, itemType = 3)
// TotalSaleAmountOC: Tổng tiền hàng = sum(AmountOC, itemType = 1) - sum(AmountOC, itemType = 3)
// TotalAmountOC: Tổng tiền bằng số = TotalAmountWithoutVATOC  + TotalVATAmountOC
// TotalAmountInWords: Tổng tiền thực phải trả
