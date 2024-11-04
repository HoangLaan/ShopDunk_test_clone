import React, { useCallback, useEffect, useState } from 'react';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';

import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import { useFormContext } from 'react-hook-form';
import { mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';
import { getOutputTypeOpts } from 'services/output-type.service';
import { areaByOutputTypeOpts, getBusinessOfAreaOpts, readDetialOuputType } from 'pages/Prices/helpers/call-api';
import { showToast } from 'utils/helpers';
import { getErrorMessage } from 'utils/index';
import OutputTypeTable from './OutputTypeTable';
import FormNumber from 'components/shared/BWFormControl/FormNumber';

import { checkProductType } from '../contain/contain';
import { allArea, allBusiness, mapArrayRemoveKey } from './mathPrices';
import dayjs from 'dayjs';

const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().startOf('day');
};

const PricesInfor = ({ title, disabled, priceId, paramHidden }) => {
  const methods = useFormContext();

  const [outputTypeOpts, setOutputTypeOpts] = useState([]);
  const [areaOpts, setAreaOpts] = useState([]);
  const [areaOptsManyOutType, setAreaOptsManyOutType] = useState([]);
  const [businessOpts, setBusinessOpts] = useState([]);
  const [outputTypeDetail, setOutputTypeDetail] = useState(undefined);

  const getInit = useCallback(async () => {
    // Lấy danh sách hình thức xuất
    const _outputTypeOpts = await getOutputTypeOpts();

    setOutputTypeOpts(mapDataOptions4Select(_outputTypeOpts));
  }, []);

  useEffect(() => {
    // Load danh sách loại yêu cầu
    getInit();
  }, []);

  const handleChangeOutputType = async (value) => {
    methods.setValue('output_type_id', value);
    if (!priceId) {
      methods.setValue('areas', []);
    }

    // Lấy danh sách khu vực
    await getAreaByOutputTypeOpts(value);

    // lấy thông tin chi tiết của hình thức xuất
    const _outputTypeDetail = await readDetialOuputType(value);
    setOutputTypeDetail(_outputTypeDetail);
    methods.setValue('outputTypeDetail', _outputTypeDetail);

    // await handleChangeBasePrices(methods.watch('base_price'));

    if (_outputTypeDetail && _outputTypeDetail?.reviews.length) {
      let reviews = _outputTypeDetail?.reviews.map((_reviews) => {
        let review_detail = priceId
          ? methods
            .watch('review_list')
            .find((_review) => _review?.price_review_level_id == _reviews?.price_review_level_id)
          : {};
        return {
          ..._reviews,
          review_user: !priceId && _reviews?.users && _reviews?.users.length > 0 ? _reviews?.users[0].user_name : null,
          ...review_detail,
        };
      });
      // set lại giá trị review cho user lấy user đầu tiên

      methods.setValue('review_list', reviews);
    }

    if (methods.watch('is_many_outputs')) {
      await handelChangeManyOutput(methods.watch('is_many_outputs'));
    }
  };

  const getAreaByOutputTypeOpts = useCallback(
    async (output_type_id) => {
      // Lấy danh sách khu vực
      let cloneAllArea = structuredClone(allArea);
      const _areaOpts = await areaByOutputTypeOpts({ output_type_id: output_type_id });
      const dataCompare = mapDataOptions4SelectCustom(_areaOpts, 'area_id', 'area_name');
      const checkValue = methods.watch('is_many_outputs');
      const dataAreaReturn = checkIsManyOutType(checkValue, areaOptsManyOutType, dataCompare);
      if (dataAreaReturn) {
        dataAreaReturn.unshift(cloneAllArea);
      }
      setAreaOpts(dataAreaReturn);
    },
    [methods.watch('output_type_id')],
  );

  const checkIsManyOutType = (value, listCompare, listChange) => {
    let listPushArray = [];
    let cloneListCompare = structuredClone(listCompare);
    let cloneListChange = structuredClone(listChange);
    if (value) {
      if (cloneListCompare && cloneListCompare?.length) {
        cloneListCompare?.map((val) => {
          if (val?.area_id) {
            listPushArray.push(val?.area_id);
          }
        });
      }
      cloneListChange.filter((val) => listPushArray.includes(val?.area_id));
    }
    return cloneListChange;
  };

  useEffect(() => {
    if (priceId && methods.watch('output_type_id')) {
      handleChangeOutputType(methods.watch('output_type_id'));
    }
  }, [getAreaByOutputTypeOpts]);

  const handleChangeArea = async (value, opts) => {
    const cloneAreaOpts = structuredClone(areaOpts);
    let valueSet = opts;
    if (value) {
      let cloneAllArea = structuredClone(allArea);
      if (value[value.length - 1] == cloneAllArea.value) {
        valueSet = mapArrayRemoveKey(cloneAreaOpts, 'value', cloneAllArea.value)
      }
    }
    methods.setValue('areas', valueSet);
    methods.setValue('businesses', []);
    await handleGetBusiness();
  };

  const handleChangeBusinesses = async (value, opts) => {
    const cloneBusinessOpts = structuredClone(businessOpts);
    let valueSet = opts;
    if (value) {
      let cloneAllBusiness = structuredClone(allBusiness);
      if (value[value.length - 1] == cloneAllBusiness.value) {
        valueSet = mapArrayRemoveKey(cloneBusinessOpts, 'value', cloneAllBusiness.value)
      }
    }
    methods.setValue('businesses', valueSet);
  };

  const handleGetBusiness = useCallback(async () => {
    try {
      if (methods.watch('areas') && methods.watch('areas').length) {
        const area_id = methods
          .watch('areas')
          .map((_area) => _area.area_id)
          .join('|');
        // Lấy danh sách cửa hàng theo khu vực đa chọn
        let cloneAllBusiness = structuredClone(allBusiness);
        const _business = await getBusinessOfAreaOpts({ area_id: area_id });
        let businessOpts = mapDataOptions4SelectCustom(_business, 'business_id', 'business_name');
        if (businessOpts) {
          businessOpts.unshift(cloneAllBusiness);
        }
        setBusinessOpts(businessOpts);
      }
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  }, [methods.watch('areas')]);

  useEffect(() => {
    handleGetBusiness(methods.watch('areas'));
  }, [handleGetBusiness]);

  const handleChangeBasePrices = async (_prices = 0) => {
    const base_price = _prices;
    methods.setValue('price_vat', _prices);
    methods.setValue('change_price', _prices);
    if (outputTypeDetail) {
      // Kiểm tra xem nếu như giá hình thức xuất có VAT
      const vatValue = outputTypeDetail?.vat_value * 1;

      let price_vat = 0;
      let change_price = 0;

      if (vatValue) {
        let numberAbide = Number(base_price) / (100);
        price_vat = Math.round(Number(base_price) / ((100 + vatValue) / 100));
        change_price = Math.round(numberAbide * 100);
      } else {
        price_vat = base_price;
        change_price = base_price;
      }

      methods.setValue('base_price', price_vat);
      // methods.setValue('change_price', change_price);

      // lưu giá cho từng hình thức xuất nếu là làm giá nhiều hình thức
      // set danh sách duyệt theo hình thức xuất bán
      let list_output_type_submit = methods.watch('list_output_type_submit');

      if (methods.watch('is_many_outputs') && Object.values(list_output_type_submit).length) {
        Object.keys(list_output_type_submit).forEach((key) => {
          if (!list_output_type_submit[key].change_value) {
            list_output_type_submit[key].change_value = 0;
          }

          let vat_value = 0;
          if (list_output_type_submit[key].vat_value) {
            vat_value = list_output_type_submit[key].vat_value;
          }

          let numberAbide = (list_output_type_submit[key].change_value + Number(_prices)) * (100 + vat_value);
          let roundPrice = Math.round(numberAbide / 100);

          list_output_type_submit[key].price = methods.watch('price_vat');
          list_output_type_submit[key].change_price = roundPrice;
          list_output_type_submit[key].base_price = methods.watch('base_price');
        });

        methods.setValue('list_output_type_submit', list_output_type_submit);
      }
    } else {
      methods.setValue('base_price', _prices);
    }
  };

  const handelChangeManyOutput = async (checked) => {
    methods.setValue('is_many_outputs', checked);
    // lấy danh sách các hình thức xuất không có mức duyệt
    if (checked) {
      let list_output_type_submit = {};

      for (let i = 0; i < outputTypeOpts.length; i++) {
        let _items = outputTypeOpts[i];

        const _outputTypeDetail = await readDetialOuputType(_items?.value);

        // Lấy danh sách xem có bn acc duyệt tự động
        const base_price = methods.watch('base_price');
        const list_review_auto = (_outputTypeDetail?.reviews).filter((_review) => _review?.is_auto_reviewed === 1);
        if (
          list_review_auto.length === _outputTypeDetail?.reviews.length &&
          list_review_auto.length > 0 &&
          _outputTypeDetail?.output_type_id != methods.watch('output_type_id')
        ) {
          if (!_outputTypeDetail.change_value) {
            _outputTypeDetail.change_value = 0;
          }
          let vat_value = 0;
          if (_outputTypeDetail.vat_value) {
            vat_value = _outputTypeDetail.vat_value;
          }
          let numberAbide = (_outputTypeDetail.change_value + Number(base_price)) * (100 + vat_value);
          let roundPrice = Math.round(numberAbide / 100);
          _outputTypeDetail.price = methods.watch('price_vat');
          _outputTypeDetail.change_price = roundPrice;
          _outputTypeDetail.base_price = _outputTypeDetail.change_value + Number(base_price);
          list_output_type_submit[_outputTypeDetail?.output_type_id] = {
            ..._items,
            ..._outputTypeDetail,
          };
        }
      }
      let cloneListOutputTypSubmit = structuredClone(list_output_type_submit);
      let arrOutputTypeList = Object.values(cloneListOutputTypSubmit) ?? [];
      let pushArray = [];
      let areaArray = [];
      let checkArrayToPush = [];
      if (arrOutputTypeList) {
        arrOutputTypeList?.map((val, index) => {
          if (val) {
            if (val?.area_id) {
              areaArray = val?.area_id ?? [];
              if (index === 0) {
                pushArray = areaArray;
                checkArrayToPush = getValueListToArr(areaArray, 'area_id');
              } else {
                if (checkArrayToPush) {
                  let checkPush = getValueListToArr(areaArray, 'area_id');
                  if (checkPush) {
                    checkArrayToPush = checkReduce(checkArrayToPush, checkPush);
                  }
                }
              }
            }
          }
        });
      }

      let clonePushArray = structuredClone(pushArray);
      if (checkArrayToPush && checkArrayToPush?.length) {
        checkArrayToPush.map((val, index) => {
          if (val) {
            clonePushArray = removeItemArr(val, clonePushArray);
          }
        });
      }
      let outputTypeId = structuredClone(methods.watch('output_type_id'));
      const dataAreaReturn = checkIsManyOutType(outputTypeId, areaOpts, clonePushArray);
      let resultDataArea = [];
      if (dataAreaReturn) {
        resultDataArea = dataAreaReturn;
      }

      setAreaOpts(resultDataArea);
      setAreaOptsManyOutType(resultDataArea);
      //Click Làm giá nhiều hình thức không xóa khu vực đã chọn
      // methods.setValue('areas', []);
      methods.setValue('list_output_type_submit', list_output_type_submit);
    } else {
      methods.setValue('list_output_type_submit', {});
    }
  };

  const removeItemArr = (value, list) => {
    let cloneList = structuredClone(list);
    const index = cloneList.indexOf(value);
    if (index > -1) {
      // only splice array when item is found
      cloneList.splice(index, 1); // 2nd parameter means remove one item only
    }

    return cloneList;
  };

  const checkReduce = (listFirst, listSecond) => {
    let result = listFirst.filter((val) => listSecond.includes(val));
    return result;
  };

  const getValueListToArr = (list, field) => {
    let result = [];
    if (list && Array.isArray(list)) {
      list.map((val, index) => {
        if (val[field]) {
          result.push(val[field]);
        }
      });
    }
    return result;
  };

  const checkAreaInOutputType = (list = {}, field, value) => {
    if (list[field] == value) {
      return true;
    }
    return false;
  };

  return (
    <React.Fragment>
      <BWAccordion title={title} id='information' isRequired={true}>
        <div className='bw_row'>
          <FormItem label='Hình thức xuất' className='bw_col_4' disabled={disabled} isRequired={true}>
            <FormSelect
              id='output_type_id'
              field='output_type_id'
              placeholder='Hình thức xuất'
              list={outputTypeOpts}
              onChange={handleChangeOutputType}
              validation={{
                required: 'Hình thức xuất là bắt buộc',
              }}
            />
          </FormItem>

          <FormItem label='Thời gian áp dụng' className='bw_col_4' disabled={disabled} isRequired={true}>
            <FormRangePicker
              fieldStart={'start_date'}
              fieldEnd={'end_date'}
              placeholder={['Từ ngày', 'Đến ngày']}
              format={'DD/MM/YYYY'}
              allowClear={true}
              style={{ width: '100%' }}
              validation={{
                required: 'Thời gian áp dụng là bắt buộc',
              }}
              disabledDate={disabledDate}
            />
          </FormItem>

          <FormItem label='Khu vực áp dụng' className='bw_col_4' disabled={disabled} isRequired={true}>
            <FormSelect
              field='areas'
              placeholder='Khu vực áp dụng'
              list={areaOpts}
              mode={'multiple'}
              onChange={handleChangeArea}
              validation={{
                required: 'Khu vực áp dụng là bắt buộc',
              }}
            />
          </FormItem>

          {/* <FormItem label='Cửa hàng' className='bw_col_4' disabled={disabled ? disabled : !methods.watch('areas')?.length} isRequired={true}>
                  <FormSelect
                      id='stores'
                      field='stores'
                      placeholder='Cửa hàng'
                      list={storeOpts}
                      mode={"multiple"}
                      validation={{
                          required: 'Cửa hàng là bắt buộc',
                      }}
                  />
              </FormItem> */}
          <FormItem
            label='Chi nhánh'
            className='bw_col_4'
            disabled={disabled ? disabled : !methods.watch('areas')?.length}
            isRequired={true}>
            <FormSelect
              id='businesses'
              field='businesses'
              placeholder='Chọn chi nhánh'
              list={businessOpts}
              onChange={handleChangeBusinesses}
              mode={'multiple'}
              validation={{
                required: 'Chi nhánh làm giá là bắt buộc',
              }}
            />
          </FormItem>
          {paramHidden !== checkProductType['3'] ? (
            <FormItem label='Giá bán có VAT(đ)' className='bw_col_4' disabled={disabled} isRequired={true}>
              <FormNumber
                field='price_vat'
                placeholder='Giá bán có VAT'
                bordered={false}
                value={methods.watch('price_vat') ?? 0}
                onChange={(value) => handleChangeBasePrices(value)}
              // validation={{
              //   required: paramHidden !== checkProductType['3'],
              //   min: {
              //     value: 0,
              //     message: 'Giá bán phải lớn hơn 0',
              //   },
              // }}
              />
            </FormItem>
          ) : null}
          {paramHidden !== checkProductType['3'] ? (
            <FormItem label='Giá bán chưa có VAT (đ)' className='bw_col_4' disabled={true}>
              <FormNumber
                field='base_price'
                placeholder='Giá bán'
                bordered={false}
                value={methods.watch('base_price') ?? 0}
              // validation={{
              //   min: {
              //     value: 0,
              //     message: 'Giá bán có VAT phải lớn hơn 0',
              //   },
              // }}
              />
            </FormItem>
          ) : null}

          <div className='bw_col_12'>
            <div className='bw_frm_box'>
              <div className='bw_flex bw_align_items_center bw_lb_sex'>
                <label className='bw_checkbox'>
                  <FormInput disabled={disabled} type='checkbox' field='is_active' value={methods.watch('is_active')} />
                  <span />
                  Kích hoạt
                </label>
                {!disabled && !priceId ? (
                  <label className='bw_checkbox'>
                    <FormInput
                      disabled={disabled}
                      type='checkbox'
                      field='is_many_outputs'
                      onChange={({ target: { checked } }) => {
                        handelChangeManyOutput(checked);
                      }}
                    />
                    <span />
                    Làm giá cho nhiều hình thức xuất
                  </label>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {methods.watch('is_many_outputs') ? (
          <>
            <span className='bw_red'>
              <em>
                Lưu ý: Chỉ áp dụng điều chỉnh giá cho những hình thức xuất có tất cả mức duyệt đều là duyệt tự động và
                hình thức xuất có cùng khu vực!!
              </em>
            </span>
            <OutputTypeTable />
          </>
        ) : null}
      </BWAccordion>
    </React.Fragment>
  );
};

export default PricesInfor;
