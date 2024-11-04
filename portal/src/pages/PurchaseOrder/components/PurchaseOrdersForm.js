import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import pick from 'lodash/pick';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import {
  getListCompanyOptions,
  getListRequestPurchaseOrderOptions,
  getOrderOptions,
  getProductsOfOrder,
} from '../helpers/call-api';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import { mapDataOptions, mapDataOptions4Select, mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import { PAYMENT_TYPE_OPTIONS, statusPaymentFormOption, statusPurchaseOrdersFormOption } from '../utils/constants';

import SupplierAddModal from './modal/SupplierAddModal';
import CustomerAddModal from './modal/CustomerAddModal';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { detailRequestPurchaseByCode, detailRequestPurchaseByMulti } from 'services/request-purchase-order.service';
import usePageInformation from 'hooks/usePageInformation';
import purchaseOrderDivisionService from 'services/purchaseOrderDivision.service';
import { CALCULATE_METHODS, InvoiceStatusOptions, cogsOptions } from '../helpers/constants';
import { getBusinessOptions } from 'services/business.service';
import styled from 'styled-components';
import CustomerInformation from './CustomerInformation';

const DisableSelect = styled.div`
  .ant-select-arrow {
    display: none;
  }
`;

function PurchaseOrdersInfo({ disabled, isShowPaymentDetail, isReturned }) {
  const methods = useFormContext();
  const { watch, setValue, unregister, reset, getValues } = methods;
  const optionsSupplier = useGetOptions(optionType.supplier);
  const [stockOption, setStockOption] = useState();
  const { isEdit, isAdd } = usePageInformation();
  const [dataListCompany, setDataListCompany] = useState([]);
  const [requestPurchaseOrderOptions, setRequestPurchaseOrderOptions] = useState([]);
  const [showModalAddSupplier, setShowModalAddSupplier] = useState(false);
  const [showModalAddCustomer, setShowModalAddCustomer] = useState(false);
  const [businessOptions, setBusinessOptions] = useState([]);
  const discountProgramOptions = useGetOptions(optionType.discountProgram);
  const [keyword, setKeyword] = useState(undefined);
  const is_returned_goods = watch('is_returned_goods');
  const searchParams = new URLSearchParams(window.location.search);

  const getListCompany = async () => {
    try {
      let data = await getListCompanyOptions();
      data = data.items.map(({ company_id, company_name }) => ({
        value: company_id,
        label: company_name,
      }));
      if (data && data.length === 1) methods.setValue('company_id', data[0]?.value);
      setDataListCompany(data);
    } catch (error) {
      showToast.error('Có lỗi xảy ra');
    }
  };
  const getRequestPurchaseOrder = async (params) => {
    try {
      let data = await getListRequestPurchaseOrderOptions({ supplier_id: params?.supplier_id });
      data = data.items.map(({ id, name }) => ({
        value: id,
        label: name,
      }));
      // if (data && data.length === 1) methods.setValue('request_purchase_code', data[0]?.value);
      setRequestPurchaseOrderOptions(data);
    } catch (error) {
      showToast.error('Có lỗi xảy ra');
    }
  };

  const prTypeOptions = useGetOptions(optionType.purchaseRequisitionType);

  useEffect(() => {
    // Là thêm mới hàng bán trả lại
    if (isReturned && !watch('purchase_requisition_type_id')) {
      setValue('purchase_requisition_type_id', prTypeOptions.find((item) => item.isreturnedgoods)?.id);
    }
  }, [isReturned, prTypeOptions]);

  const isReturnedGoods = prTypeOptions.find((item) => item.id === watch('purchase_requisition_type_id'))
    ?.isreturnedgoods
    ? 1
    : 0;

  useEffect(() => {
    setValue('is_returned_goods', isReturnedGoods);
    if (isReturnedGoods) {
      setValue('cogs_option', CALCULATE_METHODS.FROM_SELLING_PRICE);
      unregister('supplier_id');
      unregister('request_purchase_code');
    }
  }, [isReturnedGoods]);

  useEffect(() => {
    getListCompany();
    getRequestPurchaseOrder();
    getBusinessOptions().then((data) => {
      setBusinessOptions(mapDataOptions4Select(data));
    });
  }, []);

  useEffect(() => {
    if (watch('company_id')) {
      getBusinessOptions({
        company_id: watch('company_id'),
      }).then((data) => {
        setBusinessOptions(mapDataOptions4Select(data));
        const initialValue = data.find((_) => _.name.toUpperCase() === 'CÔNG TY CỔ PHẦN HESMAN VIỆT NAM');
        if (initialValue && !watch('business_id') && !watch('purchase_order_id')) {
          methods.setValue('business_id', String(initialValue?.id));
        }
      });
    }
  }, [watch('company_id')]);

  const fetchSearchRequestPurchase = useCallback(() => {
    if (keyword) {
      detailRequestPurchaseByCode(keyword).then((response) => {
        if (response.request_purchase_id) {
          methods.reset({
            ...methods.watch(),
            ...pick(response, ['supplier_id', 'discount_program_id']),
            company_id: String(response.company_id),
            product_list: response.product_list.map((x) => ({ ...x, cost_price: x.rpo_price })),
          });
        }
      });
    }
  }, [keyword]);

  useEffect(fetchSearchRequestPurchase, [fetchSearchRequestPurchase]);

  useEffect(() => {
    const reload = async () => {
      if (methods.watch('request_purchase_code')?.length > 1) {
        let res = await detailRequestPurchaseByMulti(methods.watch('request_purchase_code'));
        methods.reset({
          ...methods.watch(),
          company_id: String(res?.company_id),
          product_list: res?.product_list.map((x) => ({ ...x, cost_price: x.rpo_price })),
          supplier_id: res.supplier_id,
          discount_program_id: res.discount_program_id,
        });
      }
    };
    reload();
  }, []);

  const getOptionStocks = async () => {
    try {
      let result = await purchaseOrderDivisionService.getListStocksOrderDivison({
        company_id: methods.watch('company_id'),
      });
      setStockOption(mapDataOptions(result));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOptionStocks();
  }, [watch('expected_imported_stock_id')]);

  const member_id = watch('member_id');
  const [orderOptions, setOrderOptions] = useState([]);
  const fetchOrderOptions = useCallback(() => {
    getOrderOptions({ member_id }).then(setOrderOptions);
  }, [member_id]);

  useEffect(() => {
    if (isReturnedGoods) {
      fetchOrderOptions();
    }
  }, [fetchOrderOptions, isReturnedGoods]);

  const order_id = watch('order_id');
  const cogs_option = watch('cogs_option');
  const tabActive = searchParams.get('tab_active');
  const fetchProductsOfOrder = useCallback(() => {
    if (!isReturnedGoods || tabActive !== 'stocks_in_request') {

      getProductsOfOrder({ order_id, cogs_option }).then((data = {}) => {
        if (data?.length > 0) {
          setValue('product_list', data);
        }
      });
    }
  }, [order_id, cogs_option, isReturnedGoods]);

  useEffect(fetchProductsOfOrder, [fetchProductsOfOrder]);

  return (
    <>
      <BWAccordion title='Thông tin đơn mua hàng' id='bw_info_cus' isRequired>
        <div className='bw_row'>
          <div className='bw_col_4 purchase_order_code'>
            <FormItem label='Mã đơn mua hàng' isRequired disabled>
              <FormInput type='text' field='purchase_order_code' disabled={true} />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem label='Loại yêu cầu nhập hàng' disabled={disabled || isReturned}>
              <FormSelect
                type='text'
                field='purchase_requisition_type_id'
                placeholder='Loại yêu cầu nhập hàng'
                disabled={disabled}
                list={is_returned_goods ? prTypeOptions : prTypeOptions.filter((item) => !item.isreturnedgoods)}
                allowClear
              // validation={{
              //   required: 'Loại yêu cầu nhập hàng là bắt buộc',
              // }}
              />
            </FormItem>
          </div>

          {isReturnedGoods ? (
            <>
              <CustomerInformation disabled={disabled} />
            </>
          ) : (
            <>
              <div className='bw_col_4 bw_relative'>
                <FormItem label='Nhà cung cấp' isRequired={true} disabled={disabled}>
                  <FormSelect
                    field='supplier_id'
                    list={optionsSupplier}
                    validation={{
                      required: 'Nhà cung cấp là bắt buộc',
                    }}
                    disabled={disabled}
                    onChange={async (value) => {
                      setValue('supplier_id', value);
                      await getRequestPurchaseOrder({ supplier_id: watch('supplier_id') });
                    }}
                  />
                </FormItem>
              </div>
            </>
          )}

          <div className='bw_col_4'>
            <FormItem label='Công ty' isRequired disabled={disabled}>
              <FormSelect
                field='company_id'
                list={dataListCompany}
                validation={{
                  required: 'Công ty là bắt buộc',
                }}
                disabled={disabled}
              />
            </FormItem>
          </div>

          <div className='bw_col_4'>
            <FormItem label='Người tạo' disabled>
              <FormInput type='text' field='created_user' disabled />
            </FormItem>
          </div>

          {!isReturnedGoods ? (
            <>
              <div className='bw_col_4'>
                <FormItem label='Mã đơn đặt hàng' disabled={disabled} isRequired={true}>
                  <FormSelect
                    type='text'
                    field='request_purchase_code'
                    mode='multiple'
                    placeholder='Nhập mã đơn đặt hàng'
                    validation={{
                      required: 'Mã đơn đặt hàng là bắt buộc',
                    }}
                    disabled={disabled}
                    list={requestPurchaseOrderOptions}
                    allowClear
                    onChange={async (value, e) => {
                      methods.clearErrors('request_purchase_code');
                      const res = await detailRequestPurchaseByMulti(e);
                      methods.reset({
                        ...methods.getValues(),
                        company_id: e?.length === 0 ? methods.getValues()?.company_id : String(res?.company_id),
                        product_list: res?.product_list.map((x) => ({
                          ...x,
                          cost_price: x.rpo_price,
                          quantity:
                            (x.quantity_reality ?? 0) === 0 ? x.quantity_expected ?? 0 : x.quantity_reality ?? 0,
                          manufacture_name: x.manufacturer_name,
                        })),
                        supplier_id: res?.supplier_id,
                        discount_program_id: res?.discount_program_id,
                        request_purchase_code: e,
                      });
                      // methods.setValue('request_purchase_code', value);
                    }}
                  />
                </FormItem>
              </div>
            </>
          ) : (
            <></>
          )}
          <div className='bw_col_4'>
            <FormItem label='Chi nhánh' isRequired disabled={disabled}>
              <FormSelect
                field='business_id'
                list={businessOptions}
                validation={{
                  required: 'Chi nhánh là bắt buộc',
                }}
                disabled={disabled}
              />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem label='Ngày tạo' isRequired={true} disabled={disabled || isEdit}>
              <FormDatePicker
                field='created_date'
                validation={{ required: 'Ngày tạo là bắt buộc' }}
                placeholder={'dd/mm/yyyy'}
                style={{
                  width: '100%',
                }}
                format='DD/MM/YYYY'
                bordered={false}
                allowClear
              />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem label='Trạng thái đơn hàng' isRequired disabled={disabled}>
              <FormSelect
                field='order_status'
                list={statusPurchaseOrdersFormOption}
                validation={{
                  required: 'Trạng thái đơn hàng là bắt buộc',
                }}
                disabled={disabled}
              />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem label='Trạng thái thanh toán' disabled>
              <DisableSelect>
                <FormSelect field='is_payments_status_id' list={statusPaymentFormOption} disabled />
              </DisableSelect>
            </FormItem>
          </div>
          {/* {methods.watch('is_payments_status_id') > 0 && (
            <div className='bw_col_4'>
              <FormItem label='Hình thức thanh toán' disabled={disabled && isShowPaymentDetail}>
              <FormSelect field='payment_type' list={PAYMENT_TYPE_OPTIONS} />
              </FormItem>
            </div>
          )} */}
          <div className='bw_col_4 bw_relative'>
            <FormItem label='Kho tổng dự kiến nhập' disabled={disabled}>
              <FormSelect
                field='expected_imported_stock_id'
                list={(stockOption || []).filter((stocks) => stocks?.type == 9)}
                disabled={disabled}
              />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem label='Trạng thái hóa đơn' disabled>
              <DisableSelect>
                <FormSelect field='invoice_status' list={InvoiceStatusOptions} disabled />
              </DisableSelect>
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem label='Chương trình chiết khấu' disabled={disabled}>
              <FormSelect
                field='discount_program_id'
                list={discountProgramOptions}
                disabled={disabled}
                allowClear
                onChange={(value) => {
                  methods.clearErrors('discount_program_id');
                  methods.setValue('discount_program_id', value);
                  (methods.getValues('product_list') || []).forEach((product, index) => {
                    methods.setValue(`product_list[${index}].discount_percent`, 0);
                    const currentTotalPrice = methods.watch(`product_list[${index}].total_price`);
                    methods.setValue(`product_list[${index}].discount_total_price`, currentTotalPrice);
                  });
                }}
              />
            </FormItem>
          </div>
          {isReturnedGoods ? (
            <>
              <div className='bw_col_12'>
                <FormItem label='Đơn hàng' disabled={disabled}>
                  <FormSelect field='order_id' list={orderOptions} disabled={disabled} allowClear />
                </FormItem>
              </div>
              <div className='bw_col_12'>
                <FormItem label='Đơn giá nhập kho' disabled={disabled}>
                  <FormSelect field='cogs_option' list={cogsOptions} disabled={disabled} allowClear />
                </FormItem>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </BWAccordion>
      {showModalAddSupplier && (
        <SupplierAddModal setValueSupplier={methods.setValue} onClose={() => setShowModalAddSupplier(false)} />
      )}
      {showModalAddCustomer && (
        <CustomerAddModal
          onClose={() => setShowModalAddCustomer(false)}
          getOptsCustomer={() => { }}
          setValueCustomer={(customer) => {
            methods.setValue('customer_id', customer?.member_id);
          }}
        />
      )}
    </>
  );
}

export default PurchaseOrdersInfo;
