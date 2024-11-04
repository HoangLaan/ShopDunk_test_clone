import React , {useEffect , useState} from 'react';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';

// Utils
import { mapDataOptions4Select } from 'utils/helpers';
// Compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
// Services
import { getOptionsTreeview, getOptionsAttribute } from 'services/product-category.service';
import {getOptionsCategory} from 'services/stocks-detail.service';

const AddAttributeStyle = styled.span`
  position: absolute;
  bottom: 25px;
  height: 34px;
  width: 34px;
  right: 20px;
`;

export default function InfoProduct({
  title,
  disabled,
  setOpenModalAttributeAdd,
  categoryAttributes,
  setCategoryAttributes,
}) {
  const methods = useFormContext();
  const [listCategory , setListCategory] = useState([]);

  const handleChangeCategory = (productCategoryId) => {
    methods.clearErrors('product_category_id');
    methods.setValue('product_category_id', productCategoryId);
    if (productCategoryId) {
      getOptionsAttribute(productCategoryId).then((res) => setCategoryAttributes(mapDataOptions4Select(res)));
    }
    methods.setValue('attributes', []);
  };

  const getlistCategory = async () =>{
    try{
      let result = await getOptionsCategory();
      setListCategory(mapDataOptions4Select(result))
    }catch(error){
      console.error(error);
    }
  }

  useEffect(()=>{
    getlistCategory();
  },[])

  return (
    <BWAccordion title={title} isRequired={true}>
      <div className='bw_row'>
        <FormItem className='bw_col_4' label='Mã model' isRequired={true} disabled={disabled}>
          <FormInput
            type='text'
            field='model_code'
            placeholder='Mã model'
            validation={{
              required: 'Mã model là bắt buộc',
            }}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Tên model' isRequired={true} disabled={disabled}>
          <FormInput
            type='text'
            field='model_name'
            placeholder='Tên model'
            validation={{
              required: 'Tên model là bắt buộc',
            }}
            onChange={(e) => {
              methods.clearErrors('model_name');

              if (methods.watch('model_name') === methods.watch('display_name')) {
                methods.setValue('display_name', e.target.value);
              }

              methods.setValue('model_name', e.target.value);
            }}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Thứ tự hiển thị' disabled={disabled}>
          <FormNumber
            field='order_index'
            placeholder='Thự thự hiển thị'
            min={1}
            max={9999}
            style={{
              width: '100%',
              padding: '2px 0px',
            }}
            bordered={0}
            validation={{
              min: {
                value: 0,
                message: 'Thự thự hiển thị phải lớn hơn 0',
              },
            }}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Thuộc ngành hàng' isRequired disabled={disabled}>
          <FormDebouneTreeSelect
            field='product_category_id'
            treeDataSimpleMode
            value = {(listCategory || []).find(item => item.id == Number(methods.watch('product_category_id')))}
            fetchOptions={getOptionsTreeview}
            onChange={handleChangeCategory}
            validation={{
              required: 'Ngành hàng là bắt buộc',
            }}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Tên hiển thị' isRequired={true} disabled={disabled}>
          <FormInput
            type='text'
            field='display_name'
            placeholder='Tên hiển thị'
            validation={{
              required: 'Tên hiển thị là bắt buộc',
            }}
          />
        </FormItem>
        <div className='bw_col_12 bw_relative'>
          <FormItem isRequired={true} label='Thuộc tính model sản phẩm' disabled={disabled}>
            <FormSelect
              field='attributes'
              list={categoryAttributes}
              mode='multiple'
              onChange={(value) => {
                methods.clearErrors('attributes');
                methods.setValue(
                  'attributes',
                  value.map((item) => ({
                    value: item,
                    label: categoryAttributes.find((i) => i.value === item)?.label,
                  })),
                );

                if (!value?.includes(methods.watch('attribute_value_1.attibute_id'))) {
                  methods.setValue('attribute_value_1.attibute_id', null);
                  methods.setValue('attribute_value_1.unit_name', null);
                  methods.setValue('attribute_value_1.value', []);

                  methods.setValue('attribute_value_2.attibute_id', null);
                  methods.setValue('attribute_value_2.unit_name', null);
                  methods.setValue('attribute_value_2.value', []);
                }

                if (!value?.includes(methods.watch('attribute_value_2.attibute_id'))) {
                  methods.setValue('attribute_value_2.attibute_id', null);
                  methods.setValue('attribute_value_2.unit_name', null);
                  methods.setValue('attribute_value_2.value', []);
                }
              }}
              validation={{
                validate: (value) => {
                  if (!value || value.length === 0) {
                    return 'Thuộc tính model sản phẩm là bắt buộc';
                  }

                  return true;
                },
              }}
            />
          </FormItem>
          {!disabled && methods.watch('product_category_id') && (
            <AddAttributeStyle
              onClick={() => setOpenModalAttributeAdd(true)}
              className='bw_btn bw_btn_success bw_change_password bw_open_modal'>
              <i class='fi fi-rr-plus'></i>
            </AddAttributeStyle>
          )}
        </div>
      </div>
    </BWAccordion>
  );
}
