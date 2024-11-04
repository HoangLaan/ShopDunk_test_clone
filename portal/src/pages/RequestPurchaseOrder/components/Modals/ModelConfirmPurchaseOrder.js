import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { purchaseSamSung } from 'services/request-purchase-order.service';
import BWAccordion from 'components/shared/BWAccordion';
import DataTable from 'components/shared/DataTable';
import styled from 'styled-components';
import { showToast } from 'utils/helpers';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { InputNumber, Spin } from 'antd';
import { formatPrice } from 'utils';
import moment from 'moment';
import { useAuth } from 'context/AuthProvider';

const ModelStyled = styled.div`
  .bw_row.bw_mt_2.bw_mb_2.bw_align_items_center {
    display: none;
  }
`;

const PRODUCT_FIELD_NAME = 'product_list';

function ConfirmPurchaseOrder({ disabled, setShowModal, purchaseOrder, savedPurchaseOrder }) {
  const methods = useForm();
  const { handleSubmit, reset, setValue, watch, clearErrors } = methods;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let initValue = {};

    if (savedPurchaseOrder) {
      initValue = savedPurchaseOrder;
    } else {
      initValue = {
        purchase_order_number: purchaseOrder.request_purchase_code,
        purchase_date: moment().format('DD/MM/YYYY'),
        delivery_expected_date: moment().add(3, 'days').format('DD/MM/YYYY'),
        purchase_creator: user.full_name,
        contact_name: user.full_name,
        contact_email: user.email,
        [PRODUCT_FIELD_NAME]: purchaseOrder?.pr_product_list.map((product) => ({
          product_id: product.product_id,
          product_code: product.product_code,
          product_name: product.product_name,
          product_quantity: product.quantity_reality,
          product_price: product.cost_price,
        })),
      };
    }
    reset(initValue);
  }, [purchaseOrder, savedPurchaseOrder, user, reset]);

  const onSubmit = async (values) => {
    setLoading(true);
    purchaseSamSung({
      origin_data: purchaseOrder,
      confirmed_data: values,
    })
      .then(() => {
        showToast.success('Tạo đơn đặt hàng Samsung thành công !');
        setShowModal(false);
      })
      .catch((err) => showToast.error(err?.message || 'Tạo đơn đặt hàng samsung xảy ra lỗi !'))
      .finally(() => setLoading(false));
  };

  const columns = useMemo(() => {
    return [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Mã sản phẩm',
        classNameHeader: 'bw_text_center',
        formatter: (item, index) => {
          const field = `${PRODUCT_FIELD_NAME}.${index}.product_code`;
          return (
            <FormInput
              bordred='true'
              className='bw_inp'
              type='text'
              disabled={disabled}
              placeholder='Nhập mã sản phẩm'
              field={field}
              validation={{
                required: 'Mã sản phẩm là bắt buộc !',
              }}
            />
          );
        },
      },
      {
        header: 'Tên sản phẩm',
        accessor: 'product_name',
      },
      {
        header: 'Số lượng',
        accessor: 'product_quantity',
        formatter: (item, index) => {
          const field = `${PRODUCT_FIELD_NAME}.${index}.product_quantity`;
          return (
            <FormNumber
              style={{ minWidth: '100px' }}
              bordered
              disabled={disabled}
              field={field}
              validation={{
                required: 'Số lượng là bắt buộc',
                min: {
                  value: 0,
                  message: 'Số lượng phải lớn hơn 0',
                },
                max: {
                  value: 100000,
                  message: 'Số lượng phải nhỏ hơn 100000',
                },
              }}
            />
          );
        },
      },
      {
        header: 'Giá nhập',
        accessor: 'price',
        formatter: (item, index) => {
          const field = `${PRODUCT_FIELD_NAME}.${index}.product_price`;
          const value = watch(field) || 0;
          return (
            <>
              <InputNumber
                disabled={disabled}
                style={{ width: '200px' }}
                min={1}
                value={value}
                addonAfter='đ'
                formatter={(value) => formatPrice(value, false, ',')}
                onChange={(value) => {
                  clearErrors(field);
                  setValue(field, value);
                }}
              />
            </>
          );
        },
      },
    ];
  }, [watch(PRODUCT_FIELD_NAME)]);

  return (
    <FormProvider {...methods}>
      <ModelStyled>
        <div className='bw_modal bw_modal_open ' id='bw_calculate_modal'>
          <div className='bw_modal_container bw_w900'>
            <div className='bw_title_modal'>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {loading && <Spin />}
                <h3>Xác nhận đặt hàng</h3>
              </div>
              <span className='bw_close_modal fi fi-rr-cross-small' onClick={() => setShowModal(false)} />
            </div>
            <div className='bw_main_modal'>
              <BWAccordion title={'Thông tin chung'} style={{ background: 'var(--grayColor)' }}>
                <div className='bw_row'>
                  <FormItem label='Mã đơn đặt hàng' disabled isRequired className='bw_col_6'>
                    <FormInput
                      field={'purchase_order_number'}
                      placeholder='Mã đơn đặt hàng'
                      validation={{ required: `Mã đơn đặt hàng là bắt buộc !` }}
                    />
                  </FormItem>
                  <FormItem disabled={true} label='Ngày đặt hàng' isRequired className='bw_col_6'>
                    <FormDatePicker
                      field={'purchase_date'}
                      placeholder={'dd/mm/yyyy'}
                      format='DD/MM/YYYY'
                      bordered={false}
                      style={{ width: '100%' }}
                      validation={{ required: `Ngày tạo là bắt buộc !` }}
                    />
                  </FormItem>
                  <FormItem disabled={disabled} label='Ngày yêu cầu giao hàng đến' isRequired className='bw_col_6'>
                    <FormDatePicker
                      field={'delivery_expected_date'}
                      placeholder={'dd/mm/yyyy'}
                      format='DD/MM/YYYY'
                      bordered={false}
                      style={{ width: '100%' }}
                      validation={{ required: `Ngày yêu cầu giao hàng đến là bắt buộc !` }}
                    />
                  </FormItem>
                  <FormItem disabled={disabled} label='Tên người đặt đơn hàng' isRequired className='bw_col_6'>
                    <FormInput
                      field={'purchase_creator'}
                      placeholder='Tên người đặt đơn hàng'
                      validation={{ required: `Tên người đặt đơn hàng là bắt buộc !` }}
                    />
                  </FormItem>
                  <FormItem disabled={disabled} label='Tên người liên hệ' isRequired className='bw_col_6'>
                    <FormInput
                      field={'contact_name'}
                      placeholder='Tên người liên hệ'
                      validation={{ required: `Tên người liên hệ là bắt buộc !` }}
                    />
                  </FormItem>
                  <FormItem disabled={disabled} label='Email người liên hệ' isRequired className='bw_col_6'>
                    <FormInput
                      field={'contact_email'}
                      placeholder='Email người liên hệ'
                      validation={{ required: `Email người liện hệ là bắt buộc !` }}
                    />
                  </FormItem>
                  <FormItem disabled={disabled} label='Mã địa chỉ giao hàng' isRequired className='bw_col_6'>
                    <FormInput
                      field={'delivery_address'}
                      placeholder='Nhập mã địa chỉ giao hàng'
                      validation={{ required: `Mã địa chỉ giao hàng là bắt buộc !` }}
                    />
                  </FormItem>
                </div>
              </BWAccordion>
              <BWAccordion title={'Sản phẩm đặt hàng'} style={{ background: 'var(--grayColor)' }}>
                <div className='bw_row'>
                  <div className='bw_col_12'>
                    <DataTable columns={columns} data={watch(PRODUCT_FIELD_NAME) || []} noPaging noSelect />
                  </div>
                </div>
              </BWAccordion>
            </div>
            {!savedPurchaseOrder ? (
              <div className='bw_footer_modal bw_flex bw_justify_content_right bw_align_items_center'>
                <button type='button' className='bw_btn bw_btn_danger' onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button
                  type='button'
                  className='bw_btn  bw_btn_success'
                  onClick={(...event) => {
                    if (!loading) {
                      return handleSubmit(onSubmit)(...event);
                    }
                  }}>
                  <span className='fi fi-rr-check' /> Đặt hàng
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </ModelStyled>
    </FormProvider>
  );
}

export default ConfirmPurchaseOrder;
