import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import usePagination from 'hooks/usePagination';
import ICON_COMMON from 'utils/icons.common';

import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions } from 'utils/helpers';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWButton from 'components/shared/BWButton';

import StoreApplyModal from '../Modals/StoreApplyModal';
import { usePurchaseOrderDivisionContext } from 'pages/PurchaseOrderDivision/utils/context';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import { useCallback } from 'react';
import moment from 'moment';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { ToolTip } from 'pages/PurchaseOrderDivision/utils/styles';

const FIELD_LIST = 'store_apply_list';

const StoreApplyTable = ({ disabled, stockOption }) => {
  const methods = useFormContext();
  const { watch } = methods;
  const { setProductOptions } = usePurchaseOrderDivisionContext();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalDataSelect, setModalDataSelect] = useState(methods.watch(FIELD_LIST));
  const store_apply_list = methods.watch('store_apply_list') || [];
  const pagination = usePagination({
    data: methods.watch(FIELD_LIST),
    itemsPerPage: methods.watch(FIELD_LIST)?.length ?? 10,
  });
  const { product_list = [] } = methods.watch();
  const productOptions = useMemo(
    () => mapDataOptions(product_list, { labelName: 'product_name', valueName: 'product_id', valueAsString: true }),
    [product_list],
  );
  useEffect(() => setProductOptions(productOptions), [productOptions]);
  useEffect(() => {
    const setExpectedDateDefault = () => {
      if (store_apply_list?.length > 0) {
        store_apply_list?.forEach((item, indexStore) => {
          if (store_apply_list[indexStore]?.product_division) {
            const defaultExpectedDate = store_apply_list[indexStore]?.product_division[0]?.expected_date;
            if (defaultExpectedDate) {
              store_apply_list[indexStore]?.product_division?.forEach((item, index) => {
                if (!store_apply_list[indexStore]?.product_division[index]?.expected_date)
                  methods.setValue(`store_apply_list.${indexStore}.product_division.${index}.expected_date`, defaultExpectedDate);
              });
            }
          }
        })
      }
    };
    setExpectedDateDefault();
  }, [store_apply_list, methods]);

  const renderHeader = () => {
    let { rows = [] } = pagination || {};
    return (
      <thead>
        <th className='bw_text_center'>STT</th>
        <th className='bw_text_center'>Tên sản phẩm</th>
        <th className='bw_text_center'>
          <ToolTip title={`Số lượng có thể chia`}>SL</ToolTip>
        </th>
        {rows &&
          rows.length > 0 &&
          (rows || []).map((r, index) => {
            return (
              <th className='bw_text_center'>
                <ToolTip title={`${r?.store_name}`}>{r?.store_code}</ToolTip>
              </th>
            );
          })}
      </thead>
    );
  };

  // Hàm này được dùng để tính tổng của 1 thuộc tính của mảng các object
  const calcTotal = (product_id) => {
    let sum = 0;
    (store_apply_list || []).map((item) => {
      let { product_division = [] } = item || {};
      (product_division || []).map((pro) => {
        if (pro?.product_id == product_id) {
          sum += pro?.division_quantity;
          // if(sum > pro?.quantity){
          //   sum = pro?.quantity
          // }
        }
      });
    });
    return sum;
  };

  const handleBlurNumber = (key, event, division_quantity = 0, total = 0) => {
    if (total <= 0 || division_quantity > total) return;

    // let {store_apply_list = []} = methods.watch('store_apply_list')
    if (store_apply_list && store_apply_list.length > 1) {
      if (parseFloat(total || 0) - parseFloat(division_quantity || 0) < 0) {
        let result =
          parseFloat(total || 0) - parseFloat(division_quantity || 0) >= 0
            ? event
            : parseFloat(total || 0) - parseFloat(division_quantity || 0) + parseFloat(event || 0);
        methods.setValue(`${key}`, result);
      }
    } else {
      if (parseFloat(total || 0) - parseFloat(division_quantity || 0) < 0) {
        let result =
          parseFloat(total || 0) - parseFloat(division_quantity || 0) >= 0
            ? event
            : parseFloat(total || 0) - parseFloat(division_quantity || 0) + parseFloat(division_quantity || 0);
        methods.setValue(`${key}`, result);
      }
    }
  };

  const calcQuantityProduct = (product, division_quantity) =>
    (product?.quantity - (product?.divided_quantity || 0) || 0) - (division_quantity || 0);

  const calcMaxQuantityDivisionTotal = (productDivision) => {
    //  Chia từ kho tổng => Số lượng chia tối đa = tồn kho
    if (methods.watch('division_type') !== 0) return productDivision?.total_in ?? 0 - productDivision?.total_in ?? 0;
    return (productDivision?.quantity ?? 0) - (productDivision?.divided_quantity ?? 0);
  };

  const renderBody = () => {
    let { rows = [] } = pagination || {};
    return (
      <tbody>
        <>
          {rows && rows.length > 0 ? (
            <tr>
              <td className='bw_text_center' colSpan={3}></td>
              {rows &&
                rows.length > 0 &&
                (rows || []).map((r, index) => {
                  return (
                    <td>
                      <div className='bw_row'>
                        <FormSelect
                          // defaultValue={(stockOption || []).find(item => (item?.type != 9 && item.name?.includes('CỌC') && item?.store_id ==methods.watch(`store_apply_list.${index}.store_id`) ))}
                          placeholder='-- Chọn kho --'
                          field={`store_apply_list.${index}.stocks_id`}
                          disabled={disabled}
                          list={(stockOption || []).filter(
                            (item) =>
                              item?.type != 9 && item?.store_id == methods.watch(`store_apply_list.${index}.store_id`),
                          )}
                          className={'bw_col_12'}
                        />
                        {watch('division_type') === 2 && (
                          <FormItem className='bw_col_12' disabled={disabled} label='Ngày dự kiến hàng về'>
                            <FormDatePicker
                              style={{ width: '100%' }}
                              type='text'
                              field={`store_apply_list.${index}.stocks_expected_date`}
                              placeholder='dd/mm/yyyy'
                              bordered={false}
                              format={'DD/MM/YYYY'}
                              validation={{
                                required: 'Ngày dự kiến là bắt buộc',
                              }}
                              disabledDate={(current) => {
                                const customDate = moment().format('YYYY-MM-DD');
                                return current && current < moment(customDate, 'YYYY-MM-DD');
                              }}
                            />
                          </FormItem>
                        )}
                      </div>
                    </td>
                  );
                })}
            </tr>
          ) : null}
        </>
        {(productOptions || [])?.map((pro, idxPro) => {
          let stt = idxPro + 1;
          let division_quantity = calcTotal(pro?.product_id) || 0;
          let quantity = (pro?.quantity || 0) - (division_quantity || 0);
          return (
            <>
              <tr key={`${pro?.product_id}`}>
                <td>{stt}</td>
                <td>{pro?.product_name}</td>
                <td className='bw_text_center'>
                  {methods.watch(`stocks_id`)
                    ? methods.watch('division_type') === 1
                      ? // Nếu chia hàng từ kho tổng thì lấy SL từ tồn kho
                      (pro?.total_in ?? 0) - (pro?.total_out ?? 0) // total_inventory
                      : calcQuantityProduct(pro, division_quantity)
                    : ''}
                </td>
                {(store_apply_list || []).map((store, idxStore) => {
                  return (
                    <td>
                      <div>
                        {watch('is_condition_plans') && (
                          <FormItem>
                            <FormInput
                              style={{ width: '100%' }}
                              min={0}
                              type='number'
                              field={`store_apply_list.${idxStore}.product_division.${idxPro}.condition_plan`}
                              placeholder='Kế hoạch bán hàng'
                              disabled={disabled}
                            />
                          </FormItem>
                        )}
                        <div className='bw_row' style={{ minWidth: '100px' }}>
                          <p className='bw_col_4'>Số lượng: </p>
                          <FormNumber
                            style={{ width: '100%' }}
                            min={0}
                            max={calcMaxQuantityDivisionTotal(
                              watch(`store_apply_list.${idxStore}.product_division.${idxPro}`),
                            )}
                            className='bw_store_apply_table__division_quantity bw_col_8'
                            field={`store_apply_list.${idxStore}.product_division.${idxPro}.division_quantity`}
                            disabled={disabled}
                            bordered={true}
                            defaultValue={0}
                            onBlur={({ target: { value } }) => {
                              handleBlurNumber(
                                `store_apply_list.${idxStore}.product_division.${idxPro}.division_quantity`,
                                value || 0,
                                division_quantity,
                                pro?.quantity,
                              );
                            }}
                            onChange={(e) => {
                              methods.setValue(`store_apply_list.${idxStore}.product_division.${idxPro}`, {
                                ...pro,
                                division_quantity: e,
                              });
                            }}
                          />
                        </div>
                      </div>
                      {methods.watch('division_type') !== 2 ? (
                        <div className='bw_row bw_justify_content_between' style={{ minWidth: '300px' }}>
                          <p className='bw_col_4' style={{ marginRight: '50px' }}>Ngày dự kiến hàng về:</p>
                          <FormDatePicker
                            field={`store_apply_list.${idxStore}.product_division.${idxPro}.expected_date`}
                            placeholder={'dd/mm/yyyy'}
                            style={{ width: '100%' }}
                            className='bw_col_6'
                            format='DD/MM/YYYY'
                            bordered={false}
                            validation={{ required: `Ngày dự kiến hàng về là bắt buộc` }}
                            disabledDate={(current) => {
                              const customDate = moment().format('YYYY-MM-DD');
                              return current && current < moment(customDate, 'YYYY-MM-DD');
                            }}
                          />
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            </>
          );
        })}
      </tbody>
    );
  };

  const handleClickDivisionPreorder = useCallback(() => {
    const product_list = methods.watch('product_list');
    const orders = methods.watch('orders');
    const stores = methods.watch('stores');
    let listStoreExists = [];
    const allStores = stores.map((store) => ({
      ...store,
      business_id: methods.watch('business_id'),
      product_division: product_list.map((item) => {
        // list các order ứng với sản phẩm phẩm
        const _orders = orders.filter((o) => {
          return o.product_id === item.product_id;
        });
        // số lượng sản phẩm để chia cho các cửa hàng la:
        const product_quantity = item.quantity || 0;
        const _order_able_divide = _orders.slice(0, product_quantity);
        const _store = _order_able_divide.map((o) => o.store_id);
        listStoreExists = [...listStoreExists, ..._store];
        const decide_number = _order_able_divide.filter((o) => o.store_id === store.store_id).length || 0;
        return {
          ...item,
          division_quantity: decide_number,
        };
      }),
    }));

    const storesApply = allStores.filter((store) => listStoreExists.includes(store.store_id));

    methods.setValue(FIELD_LIST, storesApply);
  }, []);

  return (
    <Fragment>
      <div className='bw_col_12 bw_flex bw_justify_content_right bw_btn_group'>
        {methods.watch('division_type') === 2 && methods.watch('stocks_id') ? (
          <BWButton
            style={{
              marginLeft: '3px',
            }}
            content={'Tiến hành chia hàng'}
            type={'success'}
            icon={ICON_COMMON.edit}
            hidden={disabled}
            onClick={(e) => handleClickDivisionPreorder()}
          />
        ) : null}

        <BWButton
          style={{
            marginLeft: '3px',
          }}
          content={'Chọn cửa hàng'}
          type={'success'}
          icon={ICON_COMMON.add}
          hidden={disabled}
          onClick={(e) => setIsOpenModal(true)}
        />
      </div>
      <div className='bw_table_responsive bw_mt_2'>
        <table className='bw_table'>
          {renderHeader()}
          {renderBody()}
        </table>
      </div>
      {isOpenModal && (
        <StoreApplyModal
          title={'Chọn cửa hàng'}
          area_list={methods.watch('area_list')}
          defaultDataSelect={modalDataSelect}
          setModalDataSelect={setModalDataSelect}
          onClose={() => setIsOpenModal(false)}
          onConfirm={() => {
            methods.setValue(FIELD_LIST, modalDataSelect || []);
            setIsOpenModal(false);
          }}
        />
      )}
    </Fragment>
  );
};

export default StoreApplyTable;
