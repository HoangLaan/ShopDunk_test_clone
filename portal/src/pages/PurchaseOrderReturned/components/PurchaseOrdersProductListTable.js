import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';

import BWAccordion from 'components/shared/BWAccordion/index';
import DataTable from 'components/shared/DataTable/index';

import SelectProductModal from './modal/SelectProduct/SelectProductModal';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { formatPrice } from 'utils/index';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import useDetectHookFormChange from 'hooks/useDetectHookFormChange';
import { CALCULATE_METHODS, PURCHASE_ORDER_PERMISSIONS } from '../helpers/constants';
import { formatQuantity } from 'utils/number';
import moment from 'moment';
import useDeepMemo from 'hooks/useDeepMemo';
import { isNumber } from 'lodash';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const PurchaseOrdersProductListTable = ({ disabled, loading }) => {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const { remove } = useFieldArray({ control: methods.control, name: 'product_list' });
  const product_list = methods.watch('product_list') || [];
  const discount_program_id = methods.watch('discount_program_id');
  const isReturnedGoods = watch('is_returned_goods');

  // useDetectHookFormChange(methods);
  // console.log('PurchaseOrdersProductListTable', methods.formState.errors)

  const dispatch = useDispatch();
  const [isShowSelectProductModal, setIsShowSelectProductModal] = useState(false);

  const calcTotalPrice = (prodIndex) => {
    // const vatValue = methods.watch(`product_list.${prodIndex}.vat_value`) || 0;
    const costPrice = methods.watch(`product_list.${prodIndex}.cost_price`) || 0;
    const quantity = methods.watch(`product_list.${prodIndex}.quantity`) || 0;
    // const vatPrice = (vatValue * costPrice) / 100;
    const price = costPrice * quantity;
    return price;
  };

  const calcDiscountPrice = (prodIndex, percent) => {
    const percentDiscount = percent || methods.watch(`product_list.${prodIndex}.discount_percent`) || 0;
    if (percentDiscount > 0) {
      const discountPrice = (methods.watch(`product_list.${prodIndex}.total_price`) * percentDiscount) / 100;

      const price = methods.watch(`product_list.${prodIndex}.total_price`) - discountPrice;
      return { discountPrice, price };
    } else {
      const price = methods.watch(`product_list.${prodIndex}.total_price`);
      return { discountPrice: 0, price };
    }
  };

  const calTotalMoney = (index) => {
    const vatValue = methods.watch(`product_list.${index}.vat_value`) || 0;
    const discountTotalPrice = methods.watch(`product_list.${index}.discount_total_price`) || 0;
    let totalMoney = Math.floor(discountTotalPrice + (discountTotalPrice * vatValue) / 100);
    // Trường hợp chưa có chiết khấu
    if (discountTotalPrice === 0) {
      const totalPrice =
        methods.watch(`product_list.${index}.total_price`) ||
        methods.watch(`product_list.${index}.quantity`) * methods.watch(`product_list.${index}.rpo_price`);
      totalMoney = Math.floor(totalPrice + (totalPrice * vatValue) / 100);
    }
    return Math.round(totalMoney || 0);
  };

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Mã sản phẩm',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => methods.watch(`product_list.${index}.product_code`),
      },
      {
        header: 'Tên sản phẩm',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => methods.watch(`product_list.${index}.product_name`),
      },
      {
        header: 'ĐVT',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => methods.watch(`product_list.${index}.unit_name`),
      },
      {
        header: 'Tổng số lượng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        hidden: isReturnedGoods,
        formatter: (_, index) => (
          <FormNumber
            style={{ maxWidth: '100%' }}
            className='bw_mw_2 bw_input_center'
            bordered={true}
            field={`product_list.${index}.quantity`}
            validation={{
              validate: (value, formValue) => value || 'Vui lòng nhập số lượng',
            }}
            defaultValue={0}
            min={0}
            disabled={disabled}
            // formatter={(val) => {
            //   if (!val) return '';
            //   return (+val).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            // }}
            onChange={(e) => {
              const productItem = methods.watch(`product_list.${index}`);
              if (
                e &&
                productItem.origin_quantity &&
                methods.watch('editable') === 0 &&
                e > productItem.origin_quantity
              ) {
                e = productItem.origin_quantity;
              }
              methods.setValue(`product_list.${index}.quantity`, e);
              methods.setValue(`product_list.${index}.total_price`, calcTotalPrice(index));
              if (methods.watch(`product_list.${index}.discount_price`)) {
                methods.setValue(
                  `product_list.${index}.discount_total_price`,
                  e * methods.watch(`product_list.${index}.discount_price`),
                );
              }
              const { discountPrice, price } = calcDiscountPrice(index);
              methods.setValue(`product_list.${index}.discount_price`, discountPrice);
              methods.setValue(`product_list.${index}.discount_total_price`, price);
            }}
          />
        ),
      },
      {
        header: 'Số lượng đã nhập kho',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        hidden: isReturnedGoods,
        formatter: (_, index) => (
          <FormNumber
            style={{ maxWidth: '100%' }}
            className='bw_mw_2 bw_input_center'
            bordered={true}
            field={`product_list.${index}.warehoused_quantity`}
            defaultValue={0}
            min={0}
            disabled={true}
            // formatter={(val) => {
            //   if (!val) return '';
            //   return (+val).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            // }}
            onChange={(e) => {
              methods.setValue(`product_list.${index}.quantity`, e);
              methods.setValue(`product_list.${index}.total_price`, calcTotalPrice(index));
              if (methods.watch(`product_list.${index}.discount_price`)) {
                methods.setValue(
                  `product_list.${index}.discount_total_price`,
                  e * methods.watch(`product_list.${index}.discount_price`),
                );
              }
              const { discountPrice, price } = calcDiscountPrice(index);
              methods.setValue(`product_list.${index}.discount_price`, discountPrice);
              methods.setValue(`product_list.${index}.discount_total_price`, price);
            }}
          />
        ),
      },
      {
        header: 'IMEI',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        hidden: !isReturnedGoods,
        formatter: (_, index) => {
          return (
            <FormSelect
              mode={'multiple'}
              field={`product_list.${index}.imeis`}
              list={watch(`product_list.${index}.imei_options`) ?? []}
              onChange={(value) => {
                const total_quantity_product_begin = (watch(`product_list.${index}.imei_options`) ?? []).length;
                setValue(`product_list.${index}.imeis`, value);
                const total_quantity_product = value.length ?? 0;
                setValue(`product_list.${index}.returned_quantity`, total_quantity_product);
                setValue(`product_list.${index}.quantity`, total_quantity_product);
                setValue(
                  `product_list.${index}.total_price`,
                  (watch(`product_list.${index}.total_price`) / total_quantity_product_begin) * total_quantity_product,
                );
              }}
            />
          );
        },
      },
      {
        header: 'Số lượng trả lại',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        hidden: !isReturnedGoods,
        formatter: (_, index) => {
          return (
            <FormNumber
              style={{ maxWidth: '100%' }}
              className='bw_mw_2 bw_input_center'
              bordered={true}
              field={`product_list.${index}.returned_quantity`}
              min={0}
              disabled={true}
            />
          );
        },
      },
      {
        header: 'Số lượng đã chia',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        hidden: isReturnedGoods,
        formatter: (_, index) => (
          <FormNumber
            style={{ maxWidth: '100%' }}
            className='bw_mw_2 bw_input_center'
            bordered={true}
            field={`product_list.${index}.divided_quantity`}
            defaultValue={0}
            min={0}
            disabled={true}
            // formatter={(val) => {
            //   if (!val) return '';
            //   return (+val).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            // }}
            onChange={(e) => {
              methods.setValue(`product_list.${index}.quantity`, e);
              methods.setValue(`product_list.${index}.total_price`, calcTotalPrice(index));
              if (methods.watch(`product_list.${index}.discount_price`)) {
                methods.setValue(
                  `product_list.${index}.discount_total_price`,
                  e * methods.watch(`product_list.${index}.discount_price`),
                );
              }
              const { discountPrice, price } = calcDiscountPrice(index);
              methods.setValue(`product_list.${index}.discount_price`, discountPrice);
              methods.setValue(`product_list.${index}.discount_total_price`, price);
            }}
          />
        ),
      },
      {
        header: 'Đơn giá nhập',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => (
          <FormNumber
            style={{
              maxWidth: '100%',
              minWidth: 150,
            }}
            bordered={true}
            className='bw_mw_2 bw_input_right'
            field={`product_list.${index}.cost_price`}
            validation={{
              validate: (value, formValue) => {
                // Nhập hàng mua trả lại thì cho phép đơn giá 0 đ
                if (isReturnedGoods) return true;
                return value || 'Vui lòng nhập đơn giá';
              },
            }}
            defaultValue={0}
            min={0}
            disabled={
              disabled ||
              methods.watch('editable') === 0 ||
              methods.watch('cogs_option') !== CALCULATE_METHODS.HANDLE_INPUT
            }
            onChange={(value) => {
              methods.setValue(`product_list.${index}.cost_price`, value);
              methods.setValue(`product_list.${index}.total_price`, calcTotalPrice(index));

              const { discountPrice, price } = calcDiscountPrice(index);
              methods.setValue(`product_list.${index}.discount_price`, discountPrice);
              methods.setValue(`product_list.${index}.discount_total_price`, price);
            }}
          />
        ),
      },
      {
        header: 'Thành tiền',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right bw_text_total_price',
        formatter: (_, index) => formatPrice(methods.watch(`product_list.${index}.total_price`), false, ','),
      },
      {
        header: '% Chiết khấu',
        hidden: !discount_program_id,
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => (
          <FormNumber
            style={{ maxWidth: '100%' }}
            bordered={true}
            addonAfter='%'
            field={`product_list.${index}.discount_percent`}
            min={0}
            disabled={disabled}
            validation={{
              required: 'Vui lòng nhập % chiết khấu',
            }}
            onChange={(value) => {
              methods.clearErrors(`product_list.${index}.discount_percent`);
              methods.setValue(`product_list.${index}.discount_percent`, value);

              const { discountPrice, price } = calcDiscountPrice(index);
              methods.setValue(`product_list.${index}.discount_price`, discountPrice);
              methods.setValue(`product_list.${index}.discount_total_price`, price);
            }}
          />
        ),
      },
      {
        header: 'Tiền chiết khấu',
        hidden: !discount_program_id,
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (_, index) => formatPrice(methods.watch(`product_list.${index}.discount_price`), false, ','),
      },
      {
        header: 'Thành tiền sau CK',
        hidden: !discount_program_id,
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (_, index) => formatPrice(methods.watch(`product_list.${index}.discount_total_price`), false, ','),
      },
      {
        header: '% Thuế suất',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => `${methods.watch(`product_list.${index}.vat_value`) || 0} %`,
      },
      {
        header: 'Tiền thuế VAT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (_, index) => {
          const vatValue = methods.watch(`product_list.${index}.vat_value`) || 0;
          let discountTotalPrice = methods.watch(`product_list.${index}.discount_total_price`) || 0;
          // Trường hợp chưa có chiết khấu
          if (!discountTotalPrice) {
            const totalPrice = methods.watch(`product_list.${index}.total_price`);
            discountTotalPrice = totalPrice;
          }
          const vatPrice = Math.floor((discountTotalPrice * vatValue) / 100);
          return formatPrice(vatPrice, false, ',');
        },
      },
      {
        header: 'Tổng thành tiền',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (_, index) => {
          return formatPrice(calTotalMoney(index), false, ',');
        },
      },
      {
        header: 'Ngày dự kiến hàng về',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        hidden: isReturnedGoods,
        formatter: (_, index) => (
          <FormDatePicker
            style={{ width: '100%', paddingLeft: 5, paddingRight: 5 }}
            type='text'
            field={`product_list.${index}.expected_date`}
            placeholder='dd/mm/yyyy'
            bordered={true}
            format={'DD/MM/YYYY'}
            // validation={{ required: 'Ngày dự kiến hàng về là bắt buộc' }}
            disabledDate={(current) => {
              const customDate = moment().format('YYYY-MM-DD');
              return current && current < moment(customDate, 'YYYY-MM-DD');
            }}
          />
        ),
      },
      {
        header: 'Ngành hàng',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => methods.watch(`product_list.${index}.category_name`),
      },
      {
        header: 'Hãng',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => methods.watch(`product_list.${index}.manufacture_name`),
      },
    ],
    [
      product_list,
      disabled,
      discount_program_id,
      calcTotalPrice,
      calcDiscountPrice,
      methods.watch('editable'),
      isReturnedGoods,
    ],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Chọn sản phẩm',
        permission: PURCHASE_ORDER_PERMISSIONS.VIEW,
        hidden: disabled || methods.watch('editable') === 0 || methods.watch('is_returned_goods'),
        onClick: () => {
          setIsShowSelectProductModal(true);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: disabled,
        permission: PURCHASE_ORDER_PERMISSIONS.VIEW,
        onClick: (_, index) => remove(index),
      },
    ];
  }, [
    remove,
    disabled,
    dispatch,
    setIsShowSelectProductModal,
    methods.watch('editable'),
    methods.watch('is_returned_goods'),
  ]);

  const [total_quantity, totalPriceAll] = useDeepMemo(() => {
    const _total_quantity = product_list.reduce((total, item) => total + (item.quantity || 0), 0);
    const _totalPriceAll = product_list.reduce((total, item, index) => total + calTotalMoney(index), 0).toFixed(2);
    return [_total_quantity, _totalPriceAll];
  }, [product_list]);

  useEffect(() => {
    methods.setValue('total_price_all', totalPriceAll);
  }, [totalPriceAll]);

  return (
    <Fragment>
      <BWAccordion title='Thông tin sản phẩm'>
        <DataTable
          style={{
            marginTop: '0px',
          }}
          hiddenActionRow
          noPaging
          noSelect
          data={product_list}
          columns={columns}
          loading={loading}
          actions={actions}
        />
        <p className='bw_text_right bw_mt_2'>
          <span style={{ marginRight: 50 }}>
            Tổng số lượng sản phẩm: <b style={{ fontSize: 20, color: '#02A7F0' }}>{formatQuantity(total_quantity)}</b>
          </span>
          Giá trị đơn hàng:{' '}
          <b className='bw_red' style={{ fontSize: 20 }}>
            {formatQuantity(Math.round(totalPriceAll))}
            {' VNĐ'}
          </b>
        </p>
      </BWAccordion>
      {isShowSelectProductModal && (
        <SelectProductModal
          onClose={() => {
            setIsShowSelectProductModal(false);
          }}
        />
      )}
    </Fragment>
  );
};

PurchaseOrdersProductListTable.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default PurchaseOrdersProductListTable;
