import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

// Utils
import { mapDataOptions4Select } from 'utils/helpers';
// Compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';
// Services
import { getOptionsManufacture, getOptionsOrigin, getOptionsUnit } from 'services/product.service';
import { getOptionsTreeview, getOptionsModel } from 'services/product-category.service';
import { getOptionsGlobal } from 'actions/global';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

export default function InfoProduct({ title, disabled, autoGenName }) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const [optionsUnit, setOptionsUnit] = useState([]);
  const [optionsOrigin, setOptionsOrigin] = useState([]);
  const [optionsManufacture, setOptionsManufacture] = useState([]);
  const [optionsModel, setOptionsModel] = useState([]);
  const { warrantyPeriodData } = useSelector((state) => state.global);
  const [isShowModelSelect, setIsShowModelSelect] = useState(true);

  const fetchOptionsUnit = (search) => getOptionsUnit({ search, limit: 100 });
  const fetchOptionsOrigin = (search) => getOptionsOrigin({ search, limit: 100 });
  const fetchOptionsManufacture = (search) => getOptionsManufacture({ search, limit: 100 });

  const loadData = useCallback(async () => {
    try {
      const units = await fetchOptionsUnit();
      const origins = await fetchOptionsOrigin();
      const manufactures = await fetchOptionsManufacture();

      setOptionsUnit(mapDataOptions4Select(units));
      setOptionsOrigin(mapDataOptions4Select(origins));
      setOptionsManufacture(mapDataOptions4Select(manufactures));
      dispatch(getOptionsGlobal('warrantyPeriod'));
    } catch (error) {
      notification.error({ message: error.message || 'Lỗi lấy dữ liệu.' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const product_category_id = methods.watch('product_category_id')?.value || methods.watch('product_category_id');

  const getProductModel = useCallback(
    async (search = '') => {
      try {
        let models = [];
        if (product_category_id) {
          const res = await getOptionsModel({ search, limit: 100, productCategoryId: product_category_id });
          models = mapDataOptions4Select(res);
        }
        return models;
      } catch (error) {
        notification.error({ message: error.message || 'Lỗi lấy model sản phẩm.' });
      }
    },
    [product_category_id],
  );

  const resetModelOptions = useCallback(() => {
    methods.setValue('product_model_name', '');
    getProductModel().then((res) => setOptionsModel(res));
    setIsShowModelSelect(false);
    setTimeout(() => setIsShowModelSelect(true), 1);
  }, [getProductModel, methods.setValue]);

  useEffect(resetModelOptions, [resetModelOptions]);

  const handleChangeCategory = (value, label) => {
    methods.clearErrors('product_category_id');
    methods.setValue('product_category_id', value);
    methods.setValue('product_category_name', label?.[0] || label);

    resetModelOptions();
    methods.setValue('model_id', null);
    methods.setValue('attributes', null);
    autoGenName();
  };

  return (
    <BWAccordion title={title} isRequired={true}>
      <div className='bw_row'>
        <FormItem className='bw_col_6' label='Mã hàng hóa - vật tư' isRequired={true}>
          <FormInput
            field='product_code'
            placeholder='Mã hàng hóa - vật tư'
            validation={{
              required: 'Mã hàng hóa - vật tư là bắt buộc',
              maxLength: {
                value: 20,
                message: 'Mã hàng hóa - vật tư tối đa 20 ký tự.',
              },
            }}
            disabled={disabled}
            onChange={(e) => {
              methods.setValue('product_code', e.target.value);
              autoGenName();
            }}
          />
        </FormItem>
        <FormItem className='bw_col_6' label='Tên hàng hóa - vật tư trên hóa đơn' isRequired={true}>
          <FormInput
            type='text'
            field='product_display_name'
            placeholder='Tên hàng hóa - vật tư trên hóa đơn'
            validation={{
              required: 'Tên hàng hóa - vật tư trên hóa đơn là bắt buộc',
              maxLength: {
                value: 250,
                message: 'Tên hàng hóa - vật tư trên hóa đơn tối đa 250 ký tự.',
              },
            }}
            disabled={disabled}
          />
        </FormItem>
        <FormItem className='bw_col_12' label='Tên hàng hóa - vật tư' isRequired={true}>
          <FormInput
            type='text'
            field='product_name'
            placeholder='Tên hàng hóa - vật tư'
            validation={{
              required: 'Tên hàng hóa - vật tư là bắt buộc',
              maxLength: {
                value: 250,
                message: 'Tên hàng hóa - vật tư tối đa 250 ký tự.',
              },
            }}
            disabled={disabled}
          />
        </FormItem>

        <FormItem className='bw_col_4' label='Thuộc ngành hàng' isRequired={true}>
          <FormTreeSelect
            field='product_category_id'
            allowClear={true}
            treeDataSimpleMode
            fetchOptions={getOptionsTreeview}
            placeholder='--Chọn--'
            validation={{
              required: 'Ngành hàng là bắt buộc.',
            }}
            onChange={handleChangeCategory}
            disabled={disabled}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Hãng' isRequired={true}>
          <FormDebouneSelect
            field='manufacture_id'
            fetchOptions={fetchOptionsManufacture}
            allowClear={true}
            placeholder='--Chọn--'
            list={optionsManufacture}
            validation={{
              required: 'Hãng là bắt buộc là bắt buộc.',
            }}
            disabled={disabled}
            onChange={(e, options) => {
              methods.clearErrors('manufacture_id');
              methods.setValue('manufacture_id', Object.assign(e, options));
              methods.setValue('manufacture_name', e.label);
              autoGenName();
            }}
          />
        </FormItem>
        {isShowModelSelect && (
          <FormItem className='bw_col_4' label='Model hàng hóa - vật tư' isRequired={true}>
            <FormDebouneSelect
              field='model_id'
              fetchOptions={getProductModel}
              allowClear={true}
              placeholder='--Chọn--'
              list={optionsModel}
              validation={{
                required: 'Model hàng hóa - vật tư là bắt buộc.',
              }}
              disabled={disabled}
              onChange={(e, options) => {
                methods.clearErrors('model_id');
                methods.setValue('model_id', Object.assign(e, options));
                methods.setValue('product_model_name', e.label);
                methods.setValue('attributes', null);
                autoGenName();
              }}
            />
          </FormItem>
        )}
        <FormItem className='bw_col_4' label='Xuất xứ'>
          <FormDebouneSelect
            field='origin_id'
            fetchOptions={fetchOptionsOrigin}
            allowClear={true}
            placeholder='--Chọn--'
            list={optionsOrigin}
            // validation={{
            //   required: 'Xuất xứ là bắt buộc.',
            // }}
            disabled={disabled}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Đơn vị tính' isRequired={true}>
          <FormDebouneSelect
            field='unit_id'
            fetchOptions={fetchOptionsUnit}
            allowClear={true}
            placeholder='--Chọn--'
            list={optionsUnit}
            validation={{
              required: 'Đơn vị tính là bắt buộc.',
            }}
            disabled={disabled}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Thời hạn bảo hành'>
          <FormSelect
            field={'warranty_period_id'}
            list={mapDataOptions4Select(mapDataOptions4Select(warrantyPeriodData))}
            disabled={disabled}
            allowClear
          />
        </FormItem>

        <FormItem className='bw_col_4' label='Link sản phẩm website'>
          <FormInput
            type='text'
            field='product_link'
            placeholder='Link sản phẩm website'           
            disabled={disabled}
          />
        </FormItem>

      </div>
    </BWAccordion>
  );
}
