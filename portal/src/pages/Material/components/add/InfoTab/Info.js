import React, { useCallback, useEffect, useState } from 'react';
import { notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

// Utils
import { mapDataOptions4Select } from 'utils/helpers';
// Compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
// Services
import { getOptionsManufacture, getOptionsOrigin, getOptionsUnit } from 'services/product.service';
import { getOptionsGlobal } from 'actions/global';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import { genCode } from 'services/material.service';

export default function InfoProduct({ title, disabled, isEdit }) {
  const dispatch = useDispatch();
  const [optionsUnit, setOptionsUnit] = useState([]);
  const [optionsOrigin, setOptionsOrigin] = useState([]);
  const [optionsManufacture, setOptionsManufacture] = useState([]);
  const { materialGroupData } = useSelector((state) => state.global);
  const { setValue } = useFormContext();

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
      dispatch(getOptionsGlobal('materialGroup'));
      if(!isEdit)
      genCode().then((res) => {
        setValue('material_code', res ?? '');
      });
    } catch (error) {
      notification.error({ message: error.message || 'Lỗi lấy dữ liệu.' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <BWAccordion title={title} isRequired={true}>
      <div className='bw_row'>
        <FormItem className='bw_col_4' label='Mã túi bao bì' isRequired={true}>
          <FormInput
            type='text'
            field='material_code'
            placeholder='Mã túi bao bì'
            validation={{
              required: 'Mã túi bao bì là bắt buộc',
              maxLength: {
                value: 20,
                message: 'Mã túi bao bì tối đa 20 ký tự.',
              },
            }}
            disabled={disabled}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Tên túi bao bì' isRequired={true}>
          <FormInput
            type='text'
            field='material_name'
            placeholder='Tên túi bao bì'
            validation={{
              required: 'Tên túi bao bì là bắt buộc',
              maxLength: {
                value: 250,
                message: 'Tên túi bao bì tối đa 250 ký tự.',
              },
            }}
            disabled={disabled}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Nhóm túi bao bì' isRequired={true}>
          <FormSelect
            field={'material_group_id'}
            list={mapDataOptions4Select(materialGroupData)}
            disabled={disabled}
            validation={{
              required: 'Nhóm túi bao bì là bắt buộc',
            }}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Hãng'>
          <FormDebouneSelect
            field='manufacturer_id'
            fetchOptions={fetchOptionsManufacture}
            allowClear={true}
            placeholder='--Chọn--'
            list={optionsManufacture}
            disabled={disabled}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Xuất xứ'>
          <FormDebouneSelect
            field='origin_id'
            fetchOptions={fetchOptionsOrigin}
            allowClear={true}
            placeholder='--Chọn--'
            list={optionsOrigin}
            disabled={disabled}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Đơn vị tính'>
          <FormDebouneSelect
            field='unit_id'
            fetchOptions={fetchOptionsUnit}
            allowClear={true}
            placeholder='--Chọn--'
            list={optionsUnit}
            disabled={disabled}
          />
        </FormItem>
      </div>
    </BWAccordion>
  );
}
