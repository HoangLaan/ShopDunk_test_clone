import React, { useEffect, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { getOptionsBrand } from 'services/brand.service';
import { mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';

const BrandInfo = ({ disabled, title, id }) => {
  const [brandOptions, setBrandOptions] = useState([]);

  const dispatch = useDispatch();
  const { companyData } = useSelector((state) => state.global);

  useEffect(() => {
    if (!companyData) dispatch(getOptionsGlobal('company'));
  }, []);

  //Function
  const getData = async () => {
    try {
      const brand = await getOptionsBrand();
      setBrandOptions(mapDataOptions4SelectCustom(brand, 'id', 'name'));
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Tên thương hiệu' isRequired>
            <FormInput
              type='text'
              field='brand_name'
              placeholder='Nhập tên thương hiệu'
              validation={{
                required: 'Tên thương hiệu là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Mã thương hiệu' isRequired>
            <FormInput
              type='text'
              field='brand_code'
              placeholder='Nhập mã thương hiệu'
              disabled={disabled}
              validation={{
                required: 'Mã thương hiệu là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Thương hiệu cha'>
            <FormSelect disabled={disabled} field={'parent_id'} list={brandOptions} />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Trực thuộc công ty' isRequired>
            <FormSelect
              field='company_id'
              validation={{
                required: 'Trực thuộc công ty là bắt buộc',
              }}
              disabled={disabled}
              list={mapDataOptions4SelectCustom(companyData)}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả'>
            <FormTextArea field='description' rows={3} disabled={disabled} placeholder='Mô tả' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default BrandInfo;
