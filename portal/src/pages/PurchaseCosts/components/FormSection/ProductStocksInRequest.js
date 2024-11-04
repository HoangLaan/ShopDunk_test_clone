import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

import { mapDataOptions4SelectCustom } from 'utils/helpers';
import utilVar from '../../helpers/index';
import { optionAccounting, defendFieldMathProduct } from '../../utils/constants';
import servicePurchaseCost from 'services/purchase-cost.service';

import { DEFMATHTOTALPRODUCT } from '../../utils/constants';
import { handleChangePurchaseAccount } from './mathPurchaseCost';
import { formatQuantity } from 'utils/number';
import Utils from './utils';

const ProductStocksInRequest = ({ disabled, title }) => {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const [optionPurchaseOrder, setOptionPurchaseOrder] = useState([]);
  const [optionPurchaseOrderOrder, setOptionPurchaseOrderOrder] = useState([]);
  const defendOptionAccounting = utilVar.arrayToObjDefendByKey(optionAccounting, 'value');

  useEffect(() => {
    servicePurchaseCost.getOptionPurchaseStRequestImport({ supplier_id: watch('supplier_id') }).then((res) => {
      if (res) {
        setOptionPurchaseOrderOrder(mapDataOptions4SelectCustom(res, 'id', 'name'));
      }
    });
  }, [watch('supplier_id')]);

  const getOptionsDataPurchase = useCallback(() => {
    if (watch('purchase_order_order_id')) {
      const clonePurchase = structuredClone(watch('purchase_order_order_id'));
      getOptionPurchaseStRequest(clonePurchase);
    }
  }, [watch('purchase_order_order_id')]);
  useEffect(getOptionsDataPurchase, [getOptionsDataPurchase]);

  const getOptionPurchaseStRequest = async (value) => {
    const valueIn = Utils.arrayJoinToString(value);
    servicePurchaseCost.getOptionPurchaseStRequest(valueIn).then((res) => {
      if (res) {
        setOptionPurchaseOrder(mapDataOptions4SelectCustom(res, 'stocks_in_request_id', 'name'));
      }
    });
  };

  const setValueByCondition = (value, field, objFunction, setValueIn) => {
    setValue('purchase_order_id', value);
    if (objFunction) {
      objFunction(value, setValueIn);
    }
  };

  const setValueIn = (value, field, setValueIn, valueDefault = null) => {
    let returnValue = valueDefault;
    if (value[field]) {
      returnValue = value[field];
    }
    setValueIn(field, returnValue);
  };

  const setValueTopOneArray = (objOne = [], field, setValueIn, valueDefault = null) => {
    let checkArr = utilVar.checkArray(objOne);
    let returnValue = valueDefault;
    if (checkArr) {
      if (objOne[0][field]) {
        returnValue = objOne[0][field];
      }
    }
    setValueIn(field, returnValue);
  };

  const getProductPurchaseStRequest = (valueArr, setValueIn) => {
    let checkArrIsNotValue = true;
    if (!valueArr) {
      checkArrIsNotValue = false;
    }
    servicePurchaseCost.getProductPurchaseStRequest({ list_st_request: valueArr }).then((res) => {
      if (res) {
        handleChangePurchaseAccount(methods, null, null, null, res, checkArrIsNotValue);
      }
    });
  };

  const handleRemoveItemOrSetValue = (index, listValue, field) => {
    let cloneListValue = structuredClone(listValue);
    if (index > -1) {
      // only splice array when item is found
      cloneListValue.splice(index, 1); // 2nd parameter means remove one item only
    }
    if (field) {
      handleChangePurchaseAccount(methods, null, null, null, cloneListValue);
      // setValueIn(field, cloneListValue);
    }
  };

  return (
    <React.Fragment>
      <BWAccordion title={title}>
        <div className='bw_col_12'>
          <div className='bw_row'>
            <FormItem className='bw_col_6' label='Mã đơn mua hàng' disabled={disabled} isRequired>
              <FormSelect
                disabled={disabled}
                field='purchase_order_order_id'
                list={optionPurchaseOrderOrder}
                allowClear={true}
                mode='multiple'
                onChange={(e, opts) => {
                  setValue('purchase_order_order_id', e);
                  getOptionPurchaseStRequest(e);
                  setValue('purchase_order_id', []);
                }}
                validation={{
                  required: 'Mã đơn mua hàng là bắt buộc',
                }}
              />
            </FormItem>
            <FormItem className='bw_col_6' label='Mã đơn kho' disabled={disabled} isRequired>
              <FormSelect
                disabled={disabled}
                field='purchase_order_id'
                list={optionPurchaseOrder}
                allowClear={true}
                mode='multiple'
                onChange={(e, opts) => {
                  setValueTopOneArray(opts, 'order_status_id', setValue);
                  setValueByCondition(e, 'purchase_order_id', getProductPurchaseStRequest, setValue);
                }}
                validation={{
                  required: 'Mã đơn kho là bắt buộc',
                }}
              />
            </FormItem>
            <div id='products_list' className='bw_col_12'>
              <div className='bw_table_responsive bw_mt_2'>
                <table className='bw_table'>
                  <thead>
                    <tr>
                      <th className='bw_sticky bw_check_sticky'>STT</th>
                      <th>Mã phiếu nhập kho</th>
                      <th>Mã SP</th>
                      <th>Tên sản phẩm</th>
                      <th>Số lượng</th>
                      <th style={{ minWidth: '200px' }}>Đơn giá nhập</th>
                      <th style={{ minWidth: '200px' }}>Thành tiền</th>
                      <th>{defendOptionAccounting[`${watch('purchase_cost_account_id')}`]?.thNameCar ?? 'Phân bổ'}</th>
                      <th>
                        {defendOptionAccounting[`${watch('purchase_cost_account_id')}`]?.thNameImport ?? 'Giá trị nhập'}
                      </th>
                      <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {watch('products_list') && watch('products_list').length > 0 ? (
                      watch('products_list').map((item, index) => {
                        return (
                          item && (
                            <tr>
                              <td className='bw_sticky bw_check_sticky'>{index + 1}</td>
                              <td>{item?.stocks_in_code}</td>
                              <td>{item?.product_code}</td>
                              <td>{item?.product_name}</td>
                              <td className='bw_text_center'>{item?.quantity}</td>
                              <td className='bw_text_right'>{formatQuantity(item?.cost_price)}</td>
                              <td className='bw_text_right'>{formatQuantity(item?.total_price)}</td>
                              <td className='bw_text_right'>{formatQuantity(item?.total_cost_price)}</td>
                              <td className='bw_text_right'>{formatQuantity(item?.total_cost_st_request_price)}</td>
                              <td className='bw_action_table bw_text_center'>
                                {disabled ? null : (
                                  <a
                                    className='bw_btn_table bw_delete bw_red'
                                    onClick={() =>
                                      handleRemoveItemOrSetValue(index, watch('products_list'), 'products_list')
                                    }>
                                    <i className='fi fi-rr-trash' />
                                  </a>
                                )}
                              </td>
                            </tr>
                          )
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={12} className='bw_text_center'>
                          Chưa thêm sản phẩm
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan='4'>Tổng cộng</th>
                      {defendFieldMathProduct.map((val, index) => {
                        if (val) {
                          return (
                            <th className={`bw_th_border ${index !== 0 ? 'bw_text_right' : ''}`}>
                              {formatQuantity(watch(`${DEFMATHTOTALPRODUCT}_${val}`))}
                            </th>
                          );
                        }
                      })}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </BWAccordion>
    </React.Fragment>
  );
};

export default ProductStocksInRequest;
