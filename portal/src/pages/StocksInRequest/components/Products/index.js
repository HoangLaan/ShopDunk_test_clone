import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

import { mapDataOptions4SelectCustom } from 'utils/helpers';

import { getOptionsUnit } from 'services/unit.service';
import { getProductOptions } from 'services/stocks-in-request.service';

import ProductItem from './ProductItem';
import CostApply from './CostApply';
import Sku from './Sku';
import '../../styles.scss';
import ModalImport from './ModalImport';
import { objTotalProductStRequest } from '../utils/constants';
import { formatQuantity } from 'utils/number';
import { getCreditAccountOpts, getDeptAccountOpts } from 'services/receive-slip.service';
import { formatPrice } from 'utils';

function Products({ disabled, setTabActive, autoGenImeiDisable }) {
  const methods = useFormContext();
  const { watch, setValue, formState, control, clearErrors } = methods;
  const [isModalCostApply, setIsModalCostApply] = useState(false);
  const [isModalSku, setIsModalSku] = useState(false);

  const [productItem, setProductItem] = useState({});
  const [showModalImport, setShowModalImport] = useState(false);
  const isReturnedGoods = watch('stocks_in_type')?.stocks_in_type === 8;

  const [deptAccountingAccountOpts, setDeptAccountingAccountOpts] = useState([]);
  const [creditAccountingAccountOpts, setCreditAccountingAccountOpts] = useState([]);

  const borrow_request_id = watch('borrow_request_id');

  const handelAddRowProducts = async () => {
    let value = watch('products_list') ?? [];
    value.push({});
    clearErrors('products_list');
    setValue('products_list', value);
  };
  const handelRemoveProducts = (index) => {
    let value = watch('products_list');
    value.splice(index, 1);
    setValue('products_list', value);
  };

  // Show modal cost
  const showModalCost = (keyProduct) => {
    setProductItem(keyProduct);
    setTimeout(() => setIsModalCostApply(true), 500);
  };
  // Show modal sku
  const showModalSku = (keyProduct) => {
    if (watch(`${keyProduct}.quantity`)) {
      setProductItem(keyProduct);
      setTimeout(() => setIsModalSku(true), 500);
    } else {
      showToast.warning('Vui lòng nhập số lượng sản phẩm!');
    }
  };
  const { fields } = useFieldArray({
    control,
    name: 'products_list',
    rules: {
      required: 'Sản phẩm nhập kho là bắt buộc',
      validate: (field) => {
        if (field?.length === 0) {
          return 'Sản phẩm nhập kho là bắt buộc';
        }
        if (field?.length > 0 && field.findIndex((_) => !_.product_name || !_.product_code) !== -1) {
          return `Chọn mã và tên sản phẩm dòng số ${field.findIndex((_) => !_.product_name || !_.product_code) + 1}`;
        }
        if (field?.length > 0 && field.findIndex((_) => !_.quantity) !== -1) {
          return `Nhập số lượng sản phẩm dòng số ${field.findIndex((_) => !_.quantity) + 1}`;
        }
        // if (
        //   field?.length > 0 &&
        //   !watch('stocks_in_type')?.is_internal &&
        //   !watch('stocks_in_type')?.is_warranty &&
        //   !watch('stocks_in_type')?.is_disassemble_component &&
        //   // Cho phép đơn giá 0đ với Hàng bán bị trả lại
        //   !isReturnedGoods &&
        //   field.findIndex((_) => !_.cost_price || !_.total_price) !== -1
        // ) {
        //   return `Nhập đơn giá và thành tiền sản phẩm dòng số ${field.findIndex((_) => !_.cost_price || !_.total_price) + 1
        //     }`;
        // }
        
        // if (field?.length > 0 && field.findIndex((_) => _.skus.findIndex((v) => !v.sku) !== -1) !== -1) {
        //   return `Nhập mã Imei cho sản phẩm ${field.find((_) => _.skus.findIndex((v) => !v.sku) !== -1).product_name}`;
        // }
        // record not have imei -> save into scan table
        //return false
      },
    },
  });

  useEffect(() => {
    getDeptAccountOpts().then((data) => {
      setDeptAccountingAccountOpts(mapDataOptions4SelectCustom(data));
    });
    getCreditAccountOpts().then((data) => {
      setCreditAccountingAccountOpts(mapDataOptions4SelectCustom(data));
    });
  }, []);

  return (
    <React.Fragment>
      <div className='bw_tab_items bw_no_pt bw_mt_2 bw_active' id='bw_cate'>
        <div className='bw_btn_group bw_btn_grp bw_flex bw_align_items_center bw_justify_content_right'>
          <a
            data-href='#bw_importExcel'
            className='bw_btn_outline bw_btn_outline_success bw_open_modal '
            onClick={() => setShowModalImport(true)}>
            <span className='fi fi-rr-inbox-in' /> Import
          </a>
          <a data-href className='bw_btn bw_btn_success' onClick={handelAddRowProducts}>
            <span className='fi fi-rr-plus' /> Thêm
          </a>
        </div>
        <div id='products_list'>
          <div className='bw_table_responsive bw_mt_2'>
            <table className='bw_table'>
              <thead>
                <tr>
                  <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
                  <th className='bw_text_center' style={{ width: '100px' }}>
                    Mã SP
                  </th>
                  <th className='bw_text_center'>Tên sản phẩm</th>
                  <th className='bw_text_center'>IMEI</th>
                  {!borrow_request_id && <th className='bw_text_center'>Tự động imei</th>}
                  <th className='bw_text_center'>TK Nợ</th>
                  <th className='bw_text_center'>TK Có</th>
                  <th className='bw_text_center'>ĐVT</th>
                  {/* <th>Chi phí</th> */}
                  <th className='bw_text_center'>Số lượng</th>
                  {!borrow_request_id && (
                    <th className='bw_text_center' style={{ minWidth: '200px' }}>
                      Đơn giá mua
                    </th>
                  )}
                  {!borrow_request_id && (
                    <th className='bw_text_center' style={{ minWidth: '200px' }}>
                      Thành tiền
                    </th>
                  )}
                  <th className='bw_text_center'>TK Thuế</th>
                  <th className='bw_text_center'>% Thuế suất</th>
                  <th className='bw_text_center'>Tiền thuế VAT</th>
                  {!borrow_request_id && <th className='bw_text_center'>Chi phí mua hàng</th>}
                  {!borrow_request_id && <th className='bw_text_center'>Tổng giá trị nhập kho</th>}
                  {watch('stocks_in_type_id') == 1 && !watch('request_code')?.includes('PCK') && (
                    <th>Ngày dự kiến hàng về</th>
                  )}
                  <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {fields && fields.length > 0 ? (
                  fields.map((item, index) => {
                    return (
                      item && (
                        <ProductItem
                          key={index}
                          keyProduct={`products_list.${index}`}
                          index={index}
                          disabled={disabled}
                          setTabActive={setTabActive}
                          handelRemoveProducts={handelRemoveProducts}
                          showModalCost={showModalCost}
                          showModalSku={showModalSku}
                          autoGenImeiDisable={autoGenImeiDisable}
                          deptAccountingAccountOpts={deptAccountingAccountOpts}
                          creditAccountingAccountOpts={creditAccountingAccountOpts}
                        />
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
                <tr>
                  <th colSpan={!borrow_request_id ? '8' : '7'}>
                    <b>Tổng cộng</b>
                  </th>
                  {Object.keys(objTotalProductStRequest)?.map((val, index) => {
                    // console.log(watch('products_list'));
                    const keyValNotSum = ['total_vat_value', 'tax_account'];
                    const valCustom = {
                      total_vat_money: watch('products_list').reduce(
                        (sum, product) => +(sum + (product.total_price * ((product.vat_value ?? 0) / 100))).toFixed(3),
                        0,
                      ),
                    };
                    if (val && (!borrow_request_id || val === 'total_quantity')) {
                      return (
                        <td className={index === 0 ? 'bw_text_center' : 'bw_text_right'}>
                          <b>{keyValNotSum.includes(val) ? '' : formatPrice(valCustom[val] ?? watch(`${val}`), false, ',')}</b>
                        </td>
                      );
                    }
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {formState.errors['products_list'] && <ErrorMessage message={formState.errors?.products_list?.root?.message} />}

      {/* Popup bang chi phi */}
      {/* {isModalCostApply ? (
        <CostApply keyProduct={productItem} disabled={disabled} showModal={setIsModalCostApply} />
      ) : null} */}
      {/* Pop danh sach ma san pham */}
      {isModalSku ? <Sku keyProduct={productItem} disabled={disabled} showModal={setIsModalSku} /> : null}
      {/* Pop import san pham */}
      {showModalImport ? <ModalImport setShowModalImport={setShowModalImport} /> : null}
    </React.Fragment>
  );
}

export default Products;
