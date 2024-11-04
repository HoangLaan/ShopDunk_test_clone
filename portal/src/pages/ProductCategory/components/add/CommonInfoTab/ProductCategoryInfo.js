import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { mapDataOptions4Select } from 'utils/helpers';
import { categoryTypeRadioOptions } from 'pages/ProductCategory/helpers/index';
import { getOptionsTreeview } from 'services/product-category.service';
import { getOptionsCompany } from 'services/company.service';
import { getOptionsGlobal } from 'actions/global';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import FormDebouneTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';

const DivStyled = styled.div`
  .bw_lb_sex.bw_sex_group label {
    width: 33%;
  }
`;

const ProductCategoryInfo = ({ disabled, title }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const [optionsCompany, setOptionsCompany] = useState(null);
  const { vatData } = useSelector((state) => state.global);

  const getDataOptions = async () => {
    let _company = await getOptionsCompany();
    setOptionsCompany(mapDataOptions4Select(_company));

    dispatch(getOptionsGlobal('vat'));
  };

  useEffect(() => {
    getDataOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BWAccordion title={title} isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Tên ngành hàng' isRequired={true}>
            <FormInput
              type='text'
              field='category_name'
              placeholder='Tên ngành hàng'
              validation={{
                required: 'Tên ngành hàng là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Công ty' isRequired={true}>
            <FormSelect
              field='company_id'
              value = {(optionsCompany || []).find(item => item.id == methods.watch('company_id'))}
              list={optionsCompany}
              validation={{
                required: 'Công ty là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Thuộc ngành hàng'>
            <FormDebouneTreeSelect
              field='parent_id'
              treeDataSimpleMode
              fetchOptions={getOptionsTreeview}
              disabled={disabled}
              allowClear={true}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Mức VAT' isRequired={true}>
            <FormSelect
              field='vat_id'
              value = {(mapDataOptions4Select(vatData) || [] ).find(item => item.id == methods.watch('vat_id'))}
              list={mapDataOptions4Select(vatData)}
              validation={{
                required: 'Mức VAT là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <DivStyled className='bw_col_12'>
          <FormItem label='Loại'>
            <FormRadioGroup field='category_type' list={categoryTypeRadioOptions} disabled={disabled} />
          </FormItem>
        </DivStyled>
      </div>
    </BWAccordion>
  );
};

export default ProductCategoryInfo;
