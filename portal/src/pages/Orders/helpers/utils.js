import { showToast } from 'utils/helpers';
import { formatPrice } from 'utils';
import { paymentFormType } from './constans';
import { getDetail as getBusinessById } from 'services/business.service';
import moment from 'moment';

import {
  createInvoice,
  viewInvoice,
  dowloadInvoice,
  saveAndUpdateInvoice,
  viewDemo,
} from 'services/misa-invoice.service';
import { updateInvoiceLink } from './call-api';

const sumTotalMoney = (object = {}) => {
  let total = 0;

  for (const value of Object.values(object)) {
    total += value?.total_price_base ? value?.total_price_base + value?.vat_amount : value?.total_price;
  }

  return Math.round(total);
};

const sumTotalVat = (object = {}) => {
  let total = 0;

  for (const value of Object.values(object)) {
    total += value?.vat_amount;
  }

  return Math.round(total);
};

export const resetDataPayment = (data_payment, total_amount, setValue) => {
  let flag = true;
  setValue(
    'data_payment',
    data_payment.map((item) => {
      if (item.is_checked && item.payment_type === paymentFormType.CASH && flag) {
        flag = false;
        return { ...item, payment_value: total_amount };
      }
      return { ...item, payment_value: 0 };
    }),
  );

  setValue('return_money', 0);
};

export function resetMoneyAndPromotion(watch, setValue) {
  let products = watch('products') || {};
  const total_money = sumTotalMoney(products);
  const total_vat = sumTotalVat(products);
  const total_paid = watch('total_paid') || 0;

  setValue('total_money', total_money);
  setValue('sub_total_apply_discount', total_money);
  setValue('total_a_mount', total_money - total_paid);
  setValue('total_vat', total_vat);
  setValue('return_money', 0);
  setValue('total_discount', 0);
  setValue('discount_value', 0);
  setValue('discount_coupon', 0);

  // xoa khuyen mai khi thay doi danh sach san pham
  products = Object.values(products)
    .map((item) => ({ ...item, discount: 0 }))
    .reduce((r, e) => ({ ...r, [e.imei_code]: e }), {});

  setValue('products', products);
  setValue('promotion_offers', []);
  setValue('gifts', []);
  setValue('coupon', null);

  resetDataPayment(watch('data_payment') || [], total_money - total_paid, setValue);
}

export function resetProductList(watch, setValue) {
  setValue('products', {});

  resetMoneyAndPromotion(watch, setValue);
}

export function getVatRate(vatValue) {
  if (isNaN(vatValue)) {
    return 'KKKNT';
  }
  switch (vatValue) {
    case 0:
      return '0%';
    case 5:
      return '5%';
    case 8:
      return '8%';
    case 10:
      return '10%';
    default:
      return `KHAC:${vatValue?.toFixed(2)}%`;
  }
}

export function getPaymentMethodByPaymentList(paymentList) {
  const checkedPaymentList = paymentList.filter((payment) => payment.is_checked);

  if (checkedPaymentList.every((payment) => payment.payment_type === paymentFormType.CASH)) {
    return 'TM';
  } else if (checkedPaymentList.some((payment) => payment.payment_type === paymentFormType.CASH)) {
    return 'TM/CK';
  } else {
    return 'CK';
  }
}

export const calculateProductDiscount = (orderDetail) => {
  const product_list = Object.values(orderDetail.products || {}) || [];

  const product_discount = product_list.reduce((acc, cur) => acc + +cur.total_discount, 0) || 0;
  // tổng giảm giá đơn hàng
  const order_discount = orderDetail.total_discount - product_discount;

  for (let i = 0; i < product_list.length; i++) {
    // tỉ lệ % giá sản phẩm trên tổng đơn hàng
    product_list[i]._price_ratio =
      (product_list[i].total_price - product_list[i].total_discount) / (orderDetail.total_money - product_discount) ||
      0;

    // tổng giảm giá sản phẩm
    product_list[i]._total_discount =
      order_discount * product_list[i]._price_ratio + product_list[i].total_discount || 0;

    // tổng tỉ lệ giảm giá sản phẩm
    product_list[i]._discount_percent = product_list[i]._total_discount / product_list[i].total_price || 0;

    // tính tổng giá trị sản phẩm sau khi giảm giá và trước khi tính vat
    product_list[i]._total_money_without_vat =
      product_list[i].total_price_base * (1 - product_list[i]._discount_percent) || 0;

    // tính % vat sản phẩm
    product_list[i]._vat_percent = product_list[i].vat_amount / product_list[i].total_price_base || 0;

    // tính giá trị vat sản phẩm
    product_list[i]._vat_amount = product_list[i]._total_money_without_vat * product_list[i]._vat_percent || 0;
  }

  // tính tổng giá trị sản phẩm sau khi giảm giá và trước khi tính vat
  const _total_money_without_vat = product_list.reduce((acc, cur) => acc + cur._total_money_without_vat, 0) || 0;

  // tính tổng giá trị vat
  const _total_vat = product_list.reduce((acc, cur) => acc + cur._vat_amount, 0) || 0;

  orderDetail._total_money_without_vat = _total_money_without_vat;
  orderDetail._total_vat = _total_vat;

  return orderDetail;
};

export async function exportInvoice(order, setLoadingPage, successCallback = () => {}) {
  try {
    const invoiceData = await _getDataInvoiceFromOrder(order);
    if (!invoiceData) return;

    if (typeof setLoadingPage === 'function') {
      setLoadingPage(true);
    }
    const invoiceRes = await createInvoice(invoiceData);

    if (invoiceRes?.TransactionID) {
      showToast.success('Xuất hóa đơn thành công !');
      const viewLink = await viewInvoice(invoiceRes?.TransactionID);
      if (viewLink) {
        window.open(viewLink, '_blank');
      }

      // save invoicee
      const pdfData = await dowloadInvoice(invoiceRes?.TransactionID);
      await saveAndUpdateInvoice({
        base64: pdfData?.Data,
        transactionId: invoiceRes?.TransactionID,
        orderId: order?.order_id,
      });

      successCallback && successCallback(invoiceRes?.TransactionID);
    } else if (invoiceRes.ErrorCode === 'DuplicateInvoiceRefID') {
      showToast.warning(
        `Hóa đơn cho đơn hàng ${invoiceRes?.RefID} đã được xuất hóa đơn, vui lòng kiểm tra và thử lại !`,
      );
    } else {
      showToast.error('Xuất hóa đơn thất bại !');
    }

    if (typeof setLoadingPage === 'function') {
      setLoadingPage(false);
    }
  } catch (error) {
    if (typeof setLoadingPage === 'function') {
      setLoadingPage(false);
    }
    if (error?.message) {
      showToast.warning(error?.message);
    } else {
      showToast.error('Xuất hóa đơn xảy ra lỗi !');
    }
  }
}

const _getDataInvoiceFromOrder = async (order) => {
  if (!order.business_id) return showToast.error('Không có thông tin chi nhánh !');

  const business = await getBusinessById(order.business_id);
  if (!business) return showToast.error('Lấy thông tin chi nhánh xảy ra lỗi !');
  if (!business?.business_tax_code) return showToast.error('Chi nhánh chưa khai báo mã số thuế !');

  const invoiceData = {
    RefID: order.order_no.trim(),
    OriginalInvoiceData: {
      RefID: order.order_no.trim(),
      ExchangeRate: 1,
      PaymentMethodName: getPaymentMethodByPaymentList(order.data_payment),
      BuyerLegalName: order.invoice_company_name || null,
      BuyerTaxCode: order.invoice_tax || null,
      BuyerCode: order.customer_code || null,
      BuyerAddress: order.invoice_address || null,
      BuyerPhoneNumber: order.phone_number || null,
      BuyerEmail: order.invoice_email || null,
      BuyerFullName: order.invoice_full_name || ' ',
      TotalDiscountAmount: 0,
      OriginalInvoiceDetail: Object.values(order.products)
        .map((product) => {
          return {
            ItemCode: product.product_code,
            ItemName: `${product.product_display_name || product.product_name} - ${product.imei_code}`,
            UnitName: product.product_unit_name || 'chiếc',
            Quantity: product.quantity,
            UnitPrice: (product._total_money_without_vat || 0) / product.quantity,
            VATRateName: getVatRate(product.value_vat || 0),
          };
        })
        ?.concat(
          order?.gifts?.map((gift) => ({
            ItemCode: gift.product_code,
            ItemName: `${gift.product_display_name || gift.product_name} - ${gift.imei_code}`,
            UnitName: gift.product_unit_name,
            Quantity: gift.quantity,
            UnitPrice: 0,
            VATRateName: 'KCT',
            ItemType: 2,
          })),
        ),
      OptionUserDefined: {},
      IsSendEmail: true, //true send email
      ReceiverName: order.invoice_full_name || '',
      ReceiverEmail: order.invoice_email || '',
    },
    //Add field: misa auto send email to ReceiverEmail
    // IsSendEmail: false,
    // ReceiverName: order.invoice_full_name || '',
    // ReceiverEmail: order.invoice_email || ''
  };

  return invoiceData;
};

export async function viewDemoInvoice(order, setLoadingPage) {
  try {
    const invoiceData = await _getDataInvoiceFromOrder(order);
    if (!invoiceData) return;

    if (typeof setLoadingPage === 'function') {
      setLoadingPage(true);
    }
    const OriginalInvoiceData = invoiceData?.OriginalInvoiceData;
    const viewLink = await viewDemo(OriginalInvoiceData, order.store_id);

    if (viewLink) {
      //Save link (viewLink.data) to ORDERLINK of table SL_ORDER
      await updateInvoiceLink(order.order_id, {
        invoice_url: viewLink,
      });
      window.open(viewLink, '_blank');
    } else {
      showToast.error('Xem hóa đơn xảy ra lỗi !');
    }

    if (typeof setLoadingPage === 'function') {
      setLoadingPage(false);
    }
  } catch (error) {
    if (typeof setLoadingPage === 'function') {
      setLoadingPage(false);
    }
    if (error?.message) {
      showToast.warning(error?.message);
    } else {
      showToast.error('Xem hóa đơn xảy ra lỗi !');
    }
  }
}

// get same element in 2 array
export const intersect = (a, b) => {
  const setB = new Set(b);
  return a.filter((el) => setB.has(el));
};

export const handleChangeMoneyPaymentCommon = (paymentFormIndex, paymentValue, bankIndex, methods) => {
  const { watch, setValue, clearErrors } = methods;

  const total_a_mount = watch('total_a_mount') || 0;
  const data_payment = watch('data_payment') || [];
  const payment_form = data_payment?.[paymentFormIndex];
  const payment_type = payment_form?.payment_type;
  const bank_list = payment_type === paymentFormType.BANK ? payment_form?.bank_list || [] : [];
  const bank = payment_type === paymentFormType.BANK ? bank_list?.[bankIndex] : null;
  // làm tròn nếu là tiền mặt
  // paymentValue = payment_type === paymentFormType.CASH ? Math.round(paymentValue / 1000) * 1000 : paymentValue;
  let _value = paymentValue;

  // Tính tổng tiền đã nhập
  let total_payment = data_payment.reduce((total, item, i) => {
    if (+item.payment_type === paymentFormType.BANK) {
      total +=
        (item.bank_list || [])
          .filter((v) => v.is_checked)
          .reduce((acc, curr) => {
            if (
              //khác vị trí
              +paymentFormIndex !== i ||
              //cùng vị trí nhưng khác ngân hàng
              (+paymentFormIndex === i && +curr.bank_id !== +bank?.bank_id) ||
              //cùng vị trí, cùng ngân hàng nhưng khác số tài khoản
              (+paymentFormIndex === i && +curr.bank_id === +bank?.bank_id && +curr.bank_number !== +bank?.bank_number)
            ) {
              acc += +curr.payment_value || 0;
            }
            return acc;
          }, 0) || 0;
    } else if (+paymentFormIndex !== i) {
      total += +item.payment_value || 0;
    }
    return total;
  }, 0);

  // Kiểm tra xem giá trị nếu lớn hơn với tổng tiền nhâp thì set lại giá trị tiền bằng:
  // total_money - giá trị đã nhập trước đó
  if (total_payment + paymentValue > total_a_mount || paymentValue > total_a_mount) {
    _value = total_a_mount - total_payment;
  }

  if (payment_type === paymentFormType.CASH) {
    clearErrors(`data_payment.${paymentFormIndex}.payment_value`);
    setValue(`data_payment.${paymentFormIndex}.payment_value`, _value);
  } else if (payment_type === paymentFormType.BANK) {
    const _bank_list = bank_list?.map((item, i) => {
      if (item.bank_id === bank?.bank_id && item.bank_number === bank?.bank_number) {
        return {
          ...item,
          payment_value: _value,
        };
      }
      return item;
    });
    setValue(`data_payment.${paymentFormIndex}.bank_list`, _bank_list);
  } else {
    clearErrors(`data_payment.${paymentFormIndex}.payment_value`);
    setValue(`data_payment.${paymentFormIndex}.payment_value`, _value);
  }
};

export const renderDiscountValue = (p) => {
  if (p.is_discount_by_set_price || p.is_fix_price || p.is_percent_discount) {
    // áp dụng trên sp
    if (p.offer_product?.length > 0) {
      return (
        <div style={{ width: '100%' }} className='bw_flex bw_align_items_center bw_justify_content_right'>
          <b className='bw_sticky bw_name_sticky'>
            {formatPrice(
              p?.offer_product.reduce((acc, curr) => acc + (curr.discount || 0), 0),
              true,
              ',',
            )}
          </b>
        </div>
      );
    }
    // áp dụng trên đơn hàng
    else {
      return (
        <div style={{ width: '100%' }} className='bw_flex bw_align_items_center bw_justify_content_right'>
          <b className='bw_sticky bw_name_sticky'>{formatPrice(p?.discount, true, ',')}</b>
        </div>
      );
    }
  }

  if (p.is_transport) {
    return (
      <div style={{ width: '100%' }} className='bw_flex bw_align_items_center bw_justify_content_right'>
        <b className='bw_sticky bw_name_sticky'>{formatPrice(p?.shipping_discount, true, ',')}</b>
      </div>
    );
  }
  if (p.is_payment_form) {
    return (
      <div style={{ width: '100%' }} className='bw_flex bw_align_items_center bw_justify_content_right'>
        <b className='bw_sticky bw_name_sticky'>{formatPrice(p?.discount_value, true, ',')}</b>
      </div>
    );
  }
};

export const getCurrentUserShift = (userSchedule = []) => {
  const hours = moment().hours();
  const minutes = moment().minutes();
  const currentMinutes = hours * 60 + minutes;

  return userSchedule.find((shift) => currentMinutes >= shift.minutes_start && currentMinutes <= shift.minutes_end);
};

export const checkEmptyArray = (value) => {
  if (value && Array.isArray(value) && value.length > 0) {
    return true;
  }
  return false;
};

export const handleCheckValueArrayAndToString = (
  arr,
  field,
  obj = ',',
  valueDefault = '',
  fieldGet = '',
  valueAssign = 1,
) => {
  let result = valueDefault;
  const checkArray = checkEmptyArray(arr);
  if (checkArray) {
    arr.map((val, index) => {
      if (val) {
        if (val[field] == valueAssign) {
          if (val[fieldGet]) {
            if (result) {
              result = result + obj + val[fieldGet];
            } else {
              result = result + val[fieldGet];
            }
          }
        }
      }
    });
  }

  return result;
};

export const checkValueByFunction = (value, key, func) => {
  if (value) {
    if (value[key]) {
      if (func) {
        const checkFunc = func(value[key]);
        if (checkFunc) {
          return true;
        }
      } else {
        return true;
      }
    }
  }
  return false;
};
