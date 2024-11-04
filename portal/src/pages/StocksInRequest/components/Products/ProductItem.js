/* eslint-disable react-hooks/exhaustive-deps */
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { makeId, mapDataOptions4SelectCustom } from 'utils/helpers';
import { getProductOptions } from 'services/stocks-in-request.service';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import '../../styles.scss';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { getTotalCostApply, renderTotalCostApply, renderCostApply, renderCost, checkNumber } from '../utils/helper';
import { getCreditAccountOpts, getDeptAccountOpts } from 'services/receive-slip.service';
import { objTotalProductStRequest, DEFENDKEYSUM } from '../utils/constants';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import useQueryString from 'hooks/use-query-string';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { formatPrice } from 'utils';

function ProductItem({
  keyProduct,
  index,
  disabled,
  handelRemoveProducts,
  showModalCost,
  setTabActive,
  showModalSku,
  autoGenImeiDisable,
  deptAccountingAccountOpts,
  creditAccountingAccountOpts
}) {
  const methods = useFormContext();
  const { watch, setValue, clearErrors } = methods;
  const currentURL = window.location.href;
  const borrow_request_id = watch('borrow_request_id');
  // const [deptAccountingAccountOpts, setDeptAccountingAccountOpts] = useState(deptAccountingAccountOpts || []);
  // const [creditAccountingAccountOpts, setCreditAccountingAccountOpts] = useState(creditAccountingAccountOpts || []);
  const getOptionsProductCode = async (value) => {
    const data = await getProductOptions({ product_code: value, product_name: null });
    return data;
  };
  const getOptionsProductName = async (value) => {
    const data = await getProductOptions({ product_name: value, product_code: null });
    return data;
  };
  const isReturnedGoods = watch('stocks_in_type')?.stocks_in_type === 8;

  const watchTotalPrice = watch(`${keyProduct}.total_price`) ?? 0;
  const watchVatValue = watch(`${keyProduct}.vat_value`) ?? 0;
  const cal = watchTotalPrice * ((watchVatValue ?? 0) / 100)

  useEffect(() => {
    if (watch('cost_type_list') && watch('is_apply_unit_price')) {
      setValue(`${keyProduct}.cost_apply_list`, watch('cost_type_list'));
    }
  }, [watch('cost_type_list')]);

  // useEffect(() => {
  //   console.log('render==========>>>>>');
  //   getDeptAccountOpts().then((data) => {
  //     setDeptAccountingAccountOpts(mapDataOptions4SelectCustom(data));
  //   });
  //   getCreditAccountOpts().then((data) => {
  //     setCreditAccountingAccountOpts(mapDataOptions4SelectCustom(data));
  //   });
  // }, []);

  useEffect(() => {
    const accId = isReturnedGoods
      ? creditAccountingAccountOpts?.find((_) => _.label === '632')?.id
      : currentURL.includes('/add')
        ? creditAccountingAccountOpts?.find((_) => _.label === '331')?.id
        : creditAccountingAccountOpts?.find((_) => _.label === '1561')?.id;

    methods.setValue(`${keyProduct}.credit_account_id`, watch(`${keyProduct}.credit_account_id`) || accId);

    const acc1331 = creditAccountingAccountOpts?.find((_) => _.label === '1331');
    methods.setValue(`${keyProduct}.tax_account_id`, watch(`${keyProduct}.tax_account_id`) || acc1331?.id);

    const acc1561 = deptAccountingAccountOpts?.find((_) => _.label === '1561');
    methods.setValue(`${keyProduct}.debt_account_id`, watch(`${keyProduct}.debt_account_id`) || acc1561?.id);
  }, [creditAccountingAccountOpts, deptAccountingAccountOpts, isReturnedGoods]);

  useEffect(() => {
    updateProductPrice();
    handleChangeTotalByUpdateProduct();
  }, [
    watch(`${keyProduct}.cost_apply_list`),
    watch('cost_type_list'),
    watch(`${keyProduct}.quantity`),
    watch(`${keyProduct}.cost_price`),
    watch(`${keyProduct}.total_price`),
  ]);

  const query = useQueryString();
  const [maxQuantity, setMaxQuantity] = useState();
  useEffect(() => {
    setMaxQuantity(methods.watch(`${keyProduct}.quantity`) || 10000);
    // Set lại thành tiền khi map từ đơn mua hàng qua
    if (query[0].purchase_order_id) {
      methods.setValue(
        `${keyProduct}.skus`,
        watch(`${keyProduct}`)?.imeis?.map((item) => ({ sku: item.value })),
      );
      methods.setValue(
        `${keyProduct}.total_price`,
        Math.round(watch(`${keyProduct}.quantity`) * watch(`${keyProduct}.cost_price` || 0)),
      );
    }
  }, []);
  const checkEmptyNumber = (value) => {
    let result = 0;
    const checkValue = parseInt(value) ?? 0;
    if (checkValue) {
      result = checkValue;
    }
    return result;
  };

  const isRealValue = (obj) => {
    return obj && obj !== 'null' && obj !== 'undefined';
  };

  const toStringOfReplace = (val, key, valDefault = '') => {
    let result = valDefault;
    if (val) {
      let cloneValT = val.toString();
      let checkValInclude = cloneValT.includes(key);
      if (checkValInclude) {
        result = cloneValT.replace(key, '');
      }
    }
    return result;
  };

  const checkAndAssignObj = (methods, valObj) => {
    let checkObj = isRealValue(valObj);
    if (checkObj) {
      Object.keys(valObj)?.map((val, index) => {
        if (val) {
          let valToStr = val.toString();
          methods.setValue(valToStr, valObj[val]);
        }
      });
    }
  };

  const handleChangeTotalByUpdateProduct = () => {
    let cloneObjTotalProductStRequest = structuredClone(objTotalProductStRequest);
    const getKeyClone = Object.keys(cloneObjTotalProductStRequest);
    let listProduct = structuredClone([...watch('products_list')]);
    listProduct?.map((val, index) => {
      if (val) {
        getKeyClone.map((valT, indT) => {
          if (valT) {
            let replCloneValT = toStringOfReplace(valT, DEFENDKEYSUM, '');
            if (val[replCloneValT]) {
              let checkNumberValT = checkEmptyNumber(val[replCloneValT]);
              cloneObjTotalProductStRequest[valT] += checkNumberValT;
            }
          }
        });
      }
    });
    checkAndAssignObj(methods, cloneObjTotalProductStRequest);
  };

  // tính giá vốn và thành tiền vốn của sản phẩm
  const updateProductPrice = () => {
    let objectCost = {};
    if (!watch('cost_type_list') || watch('cost_type_list').length === 0) {
      objectCost = renderCost(watch(keyProduct));
    }
    if (watch('is_apply_unit_price')) {
      objectCost = renderCostApply(watch(keyProduct));
    } else {
      const { total_cost_apply } = getTotalCostApply(
        watch('products_list'),
        watch('cost_type_list'),
        watch('is_apply_unit_price'),
      );
      let list = [...watch('products_list')];
      // Chi filter cac dong da chon san pham co gia , va don vi
      list = (list || []).filter((p) => (p.total_price || p.cost_price) && p.quantity);
      // Neu co danh sach san pham dang ap dung chi phi thi tinh kiem tra lai
      let product_apply_cost_clone = [];
      if (!watch('product_apply_cost') || watch('product_apply_cost').length === 0) {
        product_apply_cost_clone = (list || []).reduce((l, v) => {
          const idx = l.findIndex((x) => x.product_id == v.product_id);
          if (idx < 0) l.push(v);
          return l;
        }, []);
      } else {
        // Xoa dong thong ke di
        let current_product_apply_cost = {};

        (list || []).forEach((product) => {
          const idx = (watch('product_apply_cost') || []).findIndex((v) => v.product_id == product.product_id);
          if (idx >= 0) {
            current_product_apply_cost[product.product_id] = watch('product_apply_cost')[idx];
          } else
            current_product_apply_cost[product.product_id] = {
              ...product,
            };
        });
        product_apply_cost_clone = Object.values(current_product_apply_cost);
      }
      // Tinh lai chi phi tren so luong
      let total_quantity = 0;
      (product_apply_cost_clone || []).forEach((p) => {
        // Cap nhat lai tong so luong cua nhap kho
        total_quantity += p.quantity;
      });
      // Tính tổng tiền phan bo trên từng loại sản phẩm chi phí / số lượng
      const cost_per_quantity = ((total_cost_apply || 0) / (total_quantity || 1)).toFixed(2);

      if (cost_per_quantity) {
        objectCost = renderTotalCostApply(watch(keyProduct), cost_per_quantity);
      }
      setValue('product_apply_cost', product_apply_cost_clone);
      setValue('total_quantity', total_quantity);
      setValue('cost_per_quantity', cost_per_quantity);
      setValue('total_cost_apply', total_cost_apply);
    }

    setValue(`${keyProduct}.cost_basic_imei_code`, objectCost.cost_basic_imei_code);
    setValue(`${keyProduct}.total_cost_basic_imei`, objectCost.total_cost_basic_imei);
    setValue(`${keyProduct}.total_price_cost`, objectCost.total_price_cost);
  };

  // build mã skus products
  const updateProductSku = () => {
    let product = watch(keyProduct);
    if (product.quantity) {
      let skus = (product.skus || []).filter((item) => item.sku);
      for (let i = 0; i < product.quantity; i++) {
        if (!skus[i] || !skus[i].sku) {
          // let cloneSku = makeId(10);
          let cloneSku = '';
          if (watch(`${keyProduct}.is_auto_gen_imei`) === true) {
            cloneSku = makeId(10);
            skus.push({ id: i, sku: cloneSku });
            if (skus.length > product.quantity) skus = skus.slice(0, product.quantity);
            setValue(`${keyProduct}.skus`, skus);
          } else {
            skus.push({ id: i, sku: '' });
            if (skus.length > product.quantity) skus = skus.slice(0, product.quantity);
            setValue(`${keyProduct}.skus`, skus);
          }
          // skus.push({ id: i, sku: cloneSku });
        }
      }
      // Kiểm tra xem số lượng skus có đang lớn hơn số lượng không . Nếu lơn hơn thi xóa bớt đi
      // if (skus.length > product.quantity) skus = skus.slice(0, product.quantity);
      // setValue(`${keyProduct}.skus`, skus);
    }
  };

  const updateProductSkuDebounce = useCallback(debounce(updateProductSku, 1000), []);
  // lấy mã sku của sp
  useEffect(() => {
    if (watch(`${keyProduct}.quantity`)) {
      updateProductSkuDebounce();
    }
  }, [watch(`${keyProduct}.quantity`), watch(`${keyProduct}.is_auto_gen_imei`)]);

  // console.log('total', watch(`${keyProduct}.total_cost_basic_imei`));
  // console.log('total', Math.round(watch(`${keyProduct}.total_cost_basic_imei`)));

  const [textContent, setTextContent] = useState('');
  const myElementRef = useRef(null);

  useEffect(() => {
    if (myElementRef.current) {
      const text = myElementRef.current.textContent;
      setTextContent(text);
    }
  }, []);

  return (
    <React.Fragment>
      <tr>
        <td style={{ zIndex: 1 }} className='bw_sticky bw_check_sticky'>
          {index + 1}
        </td>
        <td style={{ width: '100px' }}>
          <FormDebouneSelect
            bordered
            field={`${keyProduct}.product_code`}
            disabled={disabled}
            placeholder='Nhập mã sản phẩm'
            fetchOptions={getOptionsProductCode}
            onChange={(_, q) => {
              try {
                clearErrors('products_list');
                setValue(keyProduct, {
                  ...watch(keyProduct),
                  ...q,
                  product_id: q.id,
                });
              } catch (error) { }
            }}
          />
        </td>
        <td ref={myElementRef} className='hover-custom_tooltip'>
          <FormDebouneSelect
            field={`${keyProduct}.product_name`}
            bordered
            disabled={disabled}
            placeholder='Nhập tên sản phẩm'
            fetchOptions={getOptionsProductName}
            onChange={(_, q) => {
              clearErrors('products_list');
              setValue(keyProduct, {
                ...watch(keyProduct),
                ...q,
                product_id: q.id,
              });
            }}
       
          />
          <div className='custom_tooltip'>
            {textContent}
          </div>
        </td>
        <td>
          <a data-href className='bw_btn_outline bw_btn_add_imei' onClick={() => showModalSku(keyProduct)}>
            <span className='fi fi-rr-barcode' />
          </a>
        </td>
        {!borrow_request_id && (
          <td>
            <div className='bw_flex bw_align_items_center bw_lb_sex bw_justify_content_center'>
              <FormInput
                type='checkbox'
                field={`${keyProduct}.is_auto_gen_imei`}
                disabled={Boolean(autoGenImeiDisable)}
                onChange={(e, value) => {
                  clearErrors(`${keyProduct}.is_auto_gen_imei`);
                  if (!e.target.checked) {
                    setValue(`${keyProduct}.skus`, null);
                  }
                  setValue(`${keyProduct}.is_auto_gen_imei`, e.target.checked);
                }}
              />
            </div>
          </td>
        )}
        <td>
          <FormSelect
            style={{ minWidth: '140px' }}
            field={`${keyProduct}.debt_account_id`}
            bordered
            disabled={disabled}
            list={deptAccountingAccountOpts}
          />
        </td>
        <td>
          <FormSelect
            style={{ minWidth: '140px' }}
            field={`${keyProduct}.credit_account_id`}
            bordered
            disabled={disabled}
            list={creditAccountingAccountOpts}
          />
        </td>
        <td>
          <>{watch(`${keyProduct}`)?.unit_name}</>
        </td>
        {/* <td className='bw_text_center disabled'>
          <button
            type='button'
            disabled={!(watch('cost_type_list')?.length > 0 && Boolean(watch(`${keyProduct}.product_id`)))}
            className={`bw_btn bw_btn_warning bw_open_modal ${!(watch('cost_type_list')?.length > 0 && Boolean(watch(`${keyProduct}.product_id`))) ? 'btn_disabled' : ''
              }`}
            onClick={() => {
              if (watch('is_apply_unit_price')) {
                showModalCost(keyProduct);
              } else {
                setTabActive('bw_pay');
              }
            }}>
            <i className='fi fi-rr-plus' />
          </button>
        </td> */}

        {/* Đơn giá mua */}
        <td>
          {/* <FormNumberQuatity
            min={0}
            style={{
              width: '100%',
            }}
            field={`${keyProduct}.quantity`}
            className=' bw_mw_2 bw_text_right'
            controls={false}
            disabled={disabled}
            funcParam={formatNumber}
            handleParse={(value) => value.replace(/\$\s?|(,*)/g, '')}
            onChange={(e) => {
              setValue(`${keyProduct}.quantity`, e);
              if (watch(`${keyProduct}.cost_price`)) {
                setValue(`${keyProduct}.total_price`, e * watch(`${keyProduct}.cost_price`));
              }
            }}
          /> */}
          <FormNumber
            min={0}
            max={maxQuantity}
            field={`${keyProduct}.quantity`}
            className=' bw_mw_2 bw_input_center bw_inp'
            controls={false}
            disabled={disabled}
            onChange={(e) => {
              setValue(`${keyProduct}.quantity`, e);
              if (watch(`${keyProduct}.cost_price`)) {
                const cal_price_vat = e * watch(`${keyProduct}.cost_price`)
                setValue(`${keyProduct}.total_price`, cal_price_vat.toFixed(3) || 0);
              }
            }}
          />
        </td>

        {/* Thành tiền */}
        <td>
          <FormNumber
            bordered
            min={0}
            defaultValue={0}
            field={`${keyProduct}.cost_price`}
            className=' bw_mw_2 bw_text_right bw_inp bw_input_right'
            // addonAfter='đ'
            controls={false}
            disabled={
              disabled ||
              !Boolean(watch(`${keyProduct}.quantity`)) ||
              watch('stocks_in_type')?.is_internal ||
              watch('stocks_in_type')?.is_warranty
            }
            onChange={(e) => {
              setValue(`${keyProduct}.cost_price`, e);
              if (watch(`${keyProduct}.quantity`)) {
                const cal_price_vat = e * watch(`${keyProduct}.quantity`)
                setValue(`${keyProduct}.total_price`, cal_price_vat.toFixed(3));
              }
            }}
          />
        </td>
        <td>
          <FormNumber
            min={0}
            defaultValue={0}
            field={`${keyProduct}.total_price`}
            className=' bw_mw_2 bw_text_right bw_inp bw_input_right'
            // addonAfter='đ'
            controls={false}
            disabled={
              disabled ||
              !Boolean(watch(`${keyProduct}.quantity`)) ||
              watch('stocks_in_type')?.is_internal ||
              watch('stocks_in_type')?.is_warranty
            }
            onChange={(e) => {
              setValue(`${keyProduct}.total_price`, e);
              if (watch(`${keyProduct}.quantity`) && watch(`${keyProduct}.quantity`) > 0) {
                setValue(`${keyProduct}.cost_price`, e / watch(`${keyProduct}.quantity`));
              }
            }}
          />
        </td>
        {!borrow_request_id && (
          <>
            <td>
              <FormSelect
                style={{ minWidth: '140px' }}
                field={`${keyProduct}.tax_account_id`}
                bordered
                disabled={disabled}
                list={creditAccountingAccountOpts}
              />
            </td>
            <td className='price_text_right bw_text_right'>{`${watch(`${keyProduct}.vat_value`) ?? 0} %`}</td>
          </>
        )}

        {/* Tiền thuế VAT */}
        <td className='price_text_right bw_text_right'>
          <FormNumber
            min={0}
            defaultValue={0}
            field={`${keyProduct}.vat_money`}
            className=' bw_mw_2 bw_text_right bw_inp bw_input_right'
            controls={false}
            disabled={true}
            value={cal.toFixed(3)}
          />
        </td>

        {/* Chi phí mua hàng */}
        <td className='price_text_right bw_text_right'>
          {/* <FormNumber
            min={0}
            field={`${keyProduct}.cost_basic_imei_code`}
            className='product_inp_num bw_mw_2 bw_text_right '
            addonAfter='đ'
            disabled={true}
          /> */}
          {new Intl.NumberFormat().format(checkNumber(watch(`${keyProduct}.total_cost_price`)))}
        </td>

        {/* Tổng giá trị nhập kho */}
        {!borrow_request_id && (
          <td className='price_text_right bw_text_right'>
            {formatPrice(watch(`${keyProduct}.total_cost_basic_imei`), false, ',')}
          </td>
        )}
        {watch('stocks_in_type_id') == 1 && !watch('request_code')?.includes('PCK') && (
          <td>
            <FormDatePicker
              field={`${keyProduct}.expected_date`}
              placeholder={'dd/mm/yyyy'}
              style={{ width: '100%' }}
              format='DD/MM/YYYY'
              bordered={false}
              validation={{ required: `Ngày dự kiến hàng về là bắt buộc` }}
            />
          </td>
        )}
        {/* <td style={{ lineHeight: 1 }}>
          <FormTextArea
            className='bw_inp bw_mw_3'
            field={`${keyProduct}.note`}
            rows={2}
            disabled={disabled}
            placeholder='Ghi chú'
          />
        </td> */}
        <td className='bw_sticky bw_action_table bw_text_center'>
          {disabled ? null : (
            <a className='bw_btn_table bw_delete bw_red' onClick={() => handelRemoveProducts(index)}>
              <i className='fi fi-rr-trash' />
            </a>
          )}
        </td>
      </tr>
    </React.Fragment>
  );
}
export default ProductItem;
