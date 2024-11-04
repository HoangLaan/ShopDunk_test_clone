var $ = require('jquery');
var dateFormat = require('dateformat');
const logger = require('../classes/logger.class');
const ServiceResponse = require('../responses/service.response');
var querystring = require('qs');
var sha256 = require('sha256');
var crypto = require("crypto");
const { sortObject } = require('../helpers/object.helper');


const createUrlVNPAY = (params = {}) => {
    try {
        let {
            ipAddr,
            orderId,
            amount,
            bankCode,
            orderInfo,
            orderType,
        } = params;

        var tmnCode = process.env.VNP_vnp_TmnCode;
        var secretKey = process.env.VNP_vnp_HashSecret;
        var vnpUrl = process.env.VNP_vnp_Url;
        var returnUrl = process.env.VNP_vnp_ReturnUrl;

        var date = new Date();
        var createDate = dateFormat(date, 'yyyymmddHHmmss');

        var locale = 'vn';
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        var signData = querystring.stringify(vnp_Params, { encode: false });
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        return new ServiceResponse(true, "", { vnpUrl, vnp_Params })
    } catch (error) {
        logger.error(`[VNP.SERVICEV2.createUrlVNPAY]: ${error}`);
        return new ServiceResponse(false, '', 'Can not creat Url VNPAY.');
    }
}

// function sortObject(obj) {
// 	var sorted = {};
// 	var str = [];
// 	var key;
// 	for (key in obj){
// 		if (obj.hasOwnProperty(key)) {
// 		str.push(encodeURIComponent(key));
// 		}
// 	}
// 	str.sort();
//     for (key = 0; key < str.length; key++) {
//         sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
//     }
//     return sorted;
// }


module.exports = {
    createUrlVNPAY
}

//http://sandbox.vnpayment.vn/paymentv2/vpcpay.html?
//vnp_Amount=10000000&
//vnp_BankCode=NCB&
//vnp_Command=pay&
//vnp_CreateDate=20170829103111&
//vnp_CurrCode=VND&
//vnp_IpAddr=172.16.68.68&
//vnp_Locale=vn&
//vnp_Merchant=DEMO&
//vnp_OrderInfo=Nap+tien+cho+thue+bao+0123456789.+So+tien+100%2c000&
//vnp_OrderType=topup&
//vnp_ReturnUrl=http%3a%2f%2fsandbox.vnpayment.vn%2ftryitnow%2fHome%2fVnPayReturn&
//vnp_TmnCode=2QXUI4J4&
//vnp_TxnRef=23554&
//vnp_Version=2&
//vnp_SecureHashType=SHA256&
//vnp_SecureHash=e6ce09ae6695ad034f8b6e6aadf2726f
