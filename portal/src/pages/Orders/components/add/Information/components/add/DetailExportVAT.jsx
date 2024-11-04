import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { InputNumber } from 'antd';
import { useLocation } from 'react-router-dom';

import { formatPrice } from 'utils';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWButton from 'components/shared/BWButton';
import FormNumber from 'components/shared/BWFormControl/FormNumber';

const OrderInfoFromStocksTransfer = () => {
  const { watch } = useFormContext();
  const vat_value = watch('vat_value');
  const TAX_INSTANCE = useMemo(
    () => ({
      5: 0,
      8: 0,
      10: 0,
    }),
    [],
  );

  useEffect(() => {
    if (vat_value) {
      TAX_INSTANCE[vat_value] = watch('total_vat');
    }
  }, [vat_value]);

  return (
    <>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_3'>
            <FormItem label='Thuế suất' disabled>
              <FormInput value={`5%`} />
            </FormItem>
          </div>
          <div className='bw_col_9'>
            <FormItem label='Giá trị thuế' disabled>
              <FormNumber value={TAX_INSTANCE[5]} />
            </FormItem>
          </div>
        </div>
        <div className='bw_row'>
          <div className='bw_col_3'>
            <FormItem label='Thuế suất' disabled>
              <FormInput value={`8%`} />
            </FormItem>
          </div>
          <div className='bw_col_9'>
            <FormItem label='Giá trị thuế' disabled>
              <FormNumber value={TAX_INSTANCE[8]} />
            </FormItem>
          </div>
        </div>
        <div className='bw_row'>
          <div className='bw_col_3'>
            <FormItem label='Thuế suất' disabled>
              <FormInput value={`10%`} />
            </FormItem>
          </div>
          <div className='bw_col_9'>
            <FormItem label='Giá trị thuế' disabled>
              <FormNumber value={TAX_INSTANCE[10]} />
            </FormItem>
          </div>
        </div>
      </div>
    </>
  );
};

const DetailExportVAT = ({ id, title, disabled, onSubmit }) => {
  const methods = useFormContext({});
  const { watch, setValue, handleSubmit } = methods;
  const location = useLocation();
  const { pathname } = location;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isDetail = pathname.includes('/detail');

  const products = watch('products');
  const _products = watch('_products');
  const total_money = watch('total_money');
  const total_discount = (parseFloat(watch('total_discount')) || 0) + (parseFloat(watch('expoint_value')) || 0);

  const [isEditInvoice, setIsEditInvoice] = React.useState(false);

  const calculateVAT = useCallback(() => {
    const product_list = Object.values(products || {}) || [];
    // tổng giảm giá sản phẩm
    const product_discount = product_list.reduce((acc, cur) => acc + +cur.discount_value, 0) || 0;
    // tổng giảm giá đơn hàng
    const order_discount = total_discount - product_discount;
    for (let i = 0; i < product_list.length; i++) {
      // tỉ lệ % giá sản phẩm trên tổng đơn hàng
      product_list[i]._price_ratio =
        (product_list[i].total_price - (product_list[i].discount_value || 0)) / (total_money - product_discount) || 0;

      // tổng giảm giá sản phẩm
      product_list[i]._total_discount =
        order_discount * product_list[i]._price_ratio + (product_list[i].discount_value || 0) || 0;

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
    setValue('_total_money_without_vat', _total_money_without_vat);

    // tính tổng giá trị vat
    const _total_vat = product_list.reduce((acc, cur) => acc + cur._vat_amount, 0) || 0;
    setValue('_total_vat', _total_vat);

    // set lại products
    setValue('_products', product_list);

    // console.log(product_list, 'product_list');
    // console.log(total_money, 'total_money');
    // console.log(total_discount, 'total_discount');
    // console.log(product_discount, 'product_discount');
    // console.log(order_discount, 'order_discount');
    // console.log(_total_money_without_vat, '_total_money_without_vat');
    // console.log(_total_vat, '_total_vat');
    // console.log(_total_money_without_vat + _total_vat, '_total_money_without_vat + _total_vat');
  }, [products, total_money, total_discount, setValue]);

  useEffect(calculateVAT, [calculateVAT]);

  const percentageStatisticsVAT = useMemo(() => {
    const product_list = Object.values(_products || {}) || [];
    const vat_percent_list = product_list.reduce((acc, cur) => {
      const _vat_percent = Math.round(cur._vat_percent * 1000) / 10;
      if (acc[_vat_percent]) {
        acc[_vat_percent] = acc[_vat_percent] + cur._vat_amount;
      } else {
        acc[_vat_percent] = cur._vat_amount;
      }
      return acc;
    }, {});

    return vat_percent_list;
  }, [_products]);

  const invoice_tax = watch('invoice_tax')
  useEffect(() => {
  if (invoice_tax) {
    const apiUrl = `https://api.vietqr.io/v2/business/${invoice_tax}`;
    fetch(apiUrl)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok!!!');
    })
    .then(data => {
      if(data?.data?.address ){
        setValue('invoice_address', data?.data?.address || '');
      }
      if(data?.data?.name) {
        setValue('invoice_company_name', data?.data?.name || '');
      }
    })
    .catch(error => {
        console.error('Lỗi Tìm Mã Số Thuế:', error);
    });
  }
  },[invoice_tax, setValue])

  return (
    <BWAccordion title={title} id={id} defaultOpen={disabled ? false : true}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className={`bw_frm_box ${disabled ? 'bw_disable' : ''}`}>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className={`bw_checkbox  `}>
                <FormInput type='checkbox' field='is_invoice' value={watch('is_invoice')} disabled={disabled} />
                <span />
                Xuất hoá đơn VAT
              </label>
            </div>
          </div>
        </div>

        {watch('is_invoice') ? (
          <>
            <div className='bw_col_6'>
              <FormItem
                label='Tên người mua hàng'
                className='bw_col_12'
                disabled={disabled && !isEditInvoice}
                isRequired>
                <FormInput
                  type='text'
                  field='invoice_full_name'
                  placeholder='Nhập tên người mua hàng'
                  validation={{
                    validate: (value) => {
                      if (watch('is_invoice') && !value) {
                        return 'Tên người mua hàng là bắt buộc.';
                      }
                      return true;
                    },
                  }}
                />
              </FormItem>

              <FormItem
                label={
                  <>
                    Mã số thuế (
                    <a href='https://tracuunnt.gdt.gov.vn/tcnnt/mstdn.jsp' target='_blank' rel='noopener noreferrer'>
                      Tra cứu mã số thuế
                    </a>
                    )
                  </>
                }
                className='bw_col_12'
                disabled={disabled && !isEditInvoice}>
                <FormInput
                  type='text'
                  field='invoice_tax'
                  placeholder='Nhập mã số thuế'
                // validation={{
                //   validate: (value) => {
                //     if (watch('is_invoice') && !value) {
                //       return 'Mã số thuế là bắt buộc.';
                //     }
                //     return true;
                //   },
                // }}
                />
              </FormItem>

              <FormItem label='Tên đơn vị' className='bw_col_12' disabled={disabled && !isEditInvoice}>
                <FormInput
                  type='text'
                  field='invoice_company_name'
                  placeholder='Nhập tên đơn vị'
                // validation={{
                //   validate: (value) => {
                //     if (watch('is_invoice') && !value) {
                //       return 'Tên đơn vị là bắt buộc.';
                //     }
                //     return true;
                //   },
                // }}
                />
              </FormItem>

              <FormItem label='Email nhận hoá đơn' className='bw_col_12' disabled={disabled && !isEditInvoice}>
                <FormInput
                  type='text'
                  field='invoice_email'
                  placeholder={'Nhập email nhận hoá đơn'}
                  validation={{
                    validate: (value) => {
                      if (!value) {
                        return true;
                      } else if (!emailRegex.test(value) && !value.includes('@gmail')) {
                        return 'Sai định dạng email.';
                      } else if (value.includes('@gmail') && !value.includes('@gmail.com')) {
                        return 'Gmail phải là gmail.com';
                      } else {
                        return true;
                      }
                    },
                  }}
                // validation={{
                //   validate: (value) => {
                //     if (watch('is_invoice') && !value) {
                //       return 'Email nhận hoá đơn là bắt buộc.';
                //     }
                //     return true;
                //   },
                // }}
                />
              </FormItem>

              <FormItem label='Địa chỉ' className='bw_col_12' disabled={disabled && !isEditInvoice} isRequired>
                <FormInput
                  type='text'
                  field='invoice_address'
                  placeholder='Địa chỉ'
                  validation={{
                    validate: (value) => {
                      if (watch('is_invoice') && !value) {
                        return 'Địa chỉ là bắt buộc.';
                      }
                      return true;
                    },
                  }}
                />
              </FormItem>
            </div>

            <div className='bw_col_6'>
              <FormItem label='Tổng tiền hàng' className='bw_col_12' disabled>
                <InputNumber
                  style={{
                    width: '100%',
                  }}
                  formatter={(val) => {
                    if (!val) return '';
                    return formatPrice(Math.round(val), true, ',');
                  }}
                  value={methods.watch('_total_money_without_vat')}
                  placeholder='0'
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  controls={false}
                  bordered={false}
                />
              </FormItem>

              {/* <OrderInfoFromStocksTransfer disabled={disabled} /> */}

              {Object.keys(percentageStatisticsVAT || {}).map((key) => (
                <div className='bw_col_12'>
                  <div className='bw_row'>
                    <FormItem label={`Thuế suất`} className='bw_col_4' disabled>
                      <InputNumber
                        style={{
                          width: '100%',
                        }}
                        formatter={(val) => {
                          if (!val) return '';
                          return formatPrice(Math.round(val), false, ',') + '%';
                        }}
                        value={key}
                        placeholder='0'
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        controls={false}
                        bordered={false}
                      />
                    </FormItem>
                    <FormItem label={`Giá trị thuế`} className='bw_col_8' disabled>
                      <InputNumber
                        style={{
                          width: '100%',
                        }}
                        formatter={(val) => {
                          if (!val) return '';
                          return formatPrice(Math.round(val), true, ',');
                        }}
                        value={percentageStatisticsVAT[key]}
                        placeholder='0'
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        controls={false}
                        bordered={false}
                      />
                    </FormItem>
                  </div>
                </div>
              ))}

              <FormItem label='Tổng giá trị thuế' className='bw_col_12' disabled>
                <InputNumber
                  style={{
                    width: '100%',
                  }}
                  formatter={(val) => {
                    if (!val) return '';
                    return formatPrice(Math.round(val), true, ',');
                  }}
                  value={methods.watch('_total_vat')}
                  placeholder='0'
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  controls={false}
                  bordered={false}
                />
              </FormItem>

              <FormItem label='Tổng giá trị thanh toán' className='bw_col_12' disabled>
                <InputNumber
                  style={{
                    width: '100%',
                  }}
                  formatter={(val) => {
                    if (!val) return '';
                    return formatPrice(Math.round(val), true, ',');
                  }}
                  value={methods.watch('_total_money_without_vat') + methods.watch('_total_vat')}
                  placeholder='0'
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  controls={false}
                  bordered={false}
                />
              </FormItem>
            </div>

            {isDetail && (
              <div className='bw_col_12'>
                <div className='bw_col_12'>
                  <BWButton
                    content={isEditInvoice ? 'Lưu' : 'Chỉnh sửa thông tin hoá đơn'}
                    onClick={() => {
                      setIsEditInvoice((pre) => !pre);
                      if (isEditInvoice) {
                        handleSubmit(onSubmit)();
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </BWAccordion>
  );
};

export default DetailExportVAT;
