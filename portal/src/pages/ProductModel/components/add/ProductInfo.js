import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions4Select } from 'utils/helpers';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { getAttributeDetail } from 'services/product-model.service';

function ProductInfo({ title, disabled, productModelId }) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { setValue, watch } = methods;
  const attributes = methods.watch('attributes');
  const [attributeOptions, setAttributeOptions] = useState([]);
  const [valueOptions1, setValueOptions1] = useState([]);
  const [valueOptions2, setValueOptions2] = useState([]);
  const attibute_id_1 = watch('attribute_value_1.attibute_id');
  const attibute_id_2 = methods.watch('attribute_value_2.attibute_id');

  useEffect(() => {
    setAttributeOptions(
      (attributes || []).map((item) => ({
        ...item,
        disabled: item.value === attibute_id_1 || item.value === attibute_id_2,
      })),
    );
  }, [attibute_id_1, attibute_id_2, attributes, setAttributeOptions]);

  useEffect(() => {
    if (attibute_id_1) {
      dispatch(getOptionsGlobal('proAttributeValues', { parent_id: attibute_id_1 })).then((res) => {
        setValueOptions1(mapDataOptions4Select(res));
      });

      getAttributeDetail(attibute_id_1).then((res) => {
        setValue('attribute_value_1.unit_name', res.unit_name);
      });
    }
  }, [attibute_id_1, dispatch, setValue]);

  useEffect(() => {
    if (attibute_id_2) {
      dispatch(getOptionsGlobal('proAttributeValues', { parent_id: attibute_id_2 })).then((res) => {
        setValueOptions2(mapDataOptions4Select(res));
      });

      getAttributeDetail(attibute_id_2).then((res) => {
        setValue('attribute_value_2.unit_name', res.unit_name);
      });
    }
  }, [attibute_id_2, dispatch, setValue]);

  return (
    <BWAccordion title={title} isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_1'>Phân loại 1</div>

        <FormItem className='bw_col_4' label='Thuộc tính 1' disabled={disabled || productModelId}>
          <FormSelect
            list={attributeOptions}
            field='attribute_value_1.attibute_id'
            onChange={(value) => {
              methods.clearErrors('attribute_value_1.attibute_id');
              methods.setValue('attribute_value_1.attibute_id', value);
              methods.setValue(
                'attribute_value_1.attibute_name',
                attributeOptions.find((item) => item.value === value)?.label,
              );
              methods.setValue('attribute_value_1.values', []);
            }}
            allowClear
          />
        </FormItem>

        <FormItem className='bw_col_5' label='Giá trị 1' disabled={disabled || productModelId || !attibute_id_1}>
          <FormSelect
            list={valueOptions1}
            field='attribute_value_1.values'
            mode='multiple'
            onChange={(value) => {
              methods.clearErrors('attribute_value_1.values');
              methods.setValue(
                'attribute_value_1.values',
                value.map((item) => ({
                  value: item,
                  label: valueOptions1.find((i) => i.value === item)?.label,
                })),
              );
            }}
            allowClear
          />
        </FormItem>

        <FormItem className='bw_col_2' label='Đơn vị' disabled>
          <FormInput field='attribute_value_1.unit_name' />
        </FormItem>
      </div>

      <div className='bw_row'>
        <div className='bw_col_1'>Phân loại 2</div>

        <FormItem className='bw_col_4' label='Thuộc tính 2' disabled={disabled || productModelId || !attibute_id_1}>
          <FormSelect
            list={attributeOptions}
            field='attribute_value_2.attibute_id'
            onChange={(value) => {
              methods.clearErrors('attribute_value_2.attibute_id');
              methods.setValue('attribute_value_2.attibute_id', value);
              methods.setValue(
                'attribute_value_2.attibute_name',
                attributeOptions.find((item) => item.value === value)?.label,
              );
              methods.setValue('attribute_value_2.values', []);
            }}
            allowClear
          />
        </FormItem>

        <FormItem className='bw_col_5' label='Giá trị 2' disabled={disabled || productModelId || !attibute_id_2}>
          <FormSelect
            list={valueOptions2}
            field='attribute_value_2.values'
            mode='multiple'
            onChange={(value) => {
              methods.clearErrors('attribute_value_2.values');
              methods.setValue(
                'attribute_value_2.values',
                value.map((item) => ({
                  value: item,
                  label: valueOptions2.find((i) => i.value === item)?.label,
                })),
              );
            }}
            allowClear
          />
        </FormItem>

        <FormItem className='bw_col_2' label='Đơn vị' disabled>
          <FormInput field='attribute_value_2.unit_name' />
        </FormItem>
      </div>
    </BWAccordion>
  );
}

export default ProductInfo;
