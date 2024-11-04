import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';

import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

import { msgError } from 'pages/OutputType/helpers/msgError';
import { useFormContext } from 'react-hook-form';
import { mapDataOptions4Select } from 'utils/helpers';
import { getOptionsCompany } from 'services/company.service';
import { getOptionsArea } from 'services/area.service';
import { getVatOpts } from 'pages/OutputType/helpers/call-api';
import { getOptionsGlobal } from 'actions/global';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';

const OutputTypeInfor = ({ id, title, disabled }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();

  const [companyOpts, setCompanyOpts] = useState([]);
  const [areaOpts, setAreaOpts] = useState([]);
  const [vatOpts, setVatOpts] = useState([]);

  const getInit = useCallback(async () => {
    // Lấy danh sách công ty áp dụng
    const _companyOpts = await getOptionsCompany();
    setCompanyOpts(mapDataOptions4Select(_companyOpts));
    //.end _companyOpts

    // Lấy danh sách khu vực
    const _areaOpts = await getOptionsArea();
    setAreaOpts(mapDataOptions4Select(_areaOpts));
    //.end getOptionsArea

    //Lấy danh sách thuế VAT
    const _vatOpts = await getVatOpts();
    setVatOpts(mapDataOptions4Select(_vatOpts));
    //.end getVatOpts
  }, []);

  useEffect(() => {
    getInit();
  }, [getInit]);

  return (
    <React.Fragment>
      <BWAccordion title={title} id={id}>
        <div className='bw_row'>
          <FormItem label='Tên hình thức xuất bán' className='bw_col_12' disabled={disabled} isRequired={true}>
            <FormInput
              type='text'
              field='output_type_name'
              placeholder='Tên hình thức xuất bán'
              validation={msgError['output_type_name']}
            />
          </FormItem>
          <div style={{ marginBottom: '1em' }} className='bw_col_12'>
            <label className='bw_checkbox'>
              <FormInput
                disabled={disabled}
                type='checkbox'
                field='is_vat'
                onChange={({ target: { checked } }) => {
                  methods.setValue('vat_id', '');
                  methods.setValue('is_vat', checked);
                }}
              />
              <span />
              Có VAT
            </label>
          </div>
          <FormItem label='Công ty áp dụng' className='bw_col_4' disabled={disabled} isRequired={true}>
            <FormSelect
              type='text'
              field='company_id'
              placeholder='--Chọn--'
              list={companyOpts}
              validation={msgError['company_id']}
            />
          </FormItem>
          <FormItem label='Khu vực áp dụng' className='bw_col_4' disabled={disabled} isRequired={true}>
            <FormSelect
              type='text'
              field='area_id'
              placeholder='--Chọn--'
              list={areaOpts}
              mode={'multiple'}
              validation={msgError['area_id']}
            />
          </FormItem>
          {methods.watch('is_vat') ? (
            <FormItem label='Mức VAT' className='bw_col_4' disabled={disabled} isRequired={true}>
              <FormSelect
                type='text'
                field='vat_id'
                placeholder='--Chọn--'
                list={vatOpts}
                validation={{
                  validate: (e) => {
                    console.log(e);
                    if (methods.watch('is_vat') && !e) {
                      return 'Mức VAT là bắt buộc.';
                    }
                  },
                }}
              />
            </FormItem>
          ) : null}

          {/* <FormItem label='Ngành hành' className='bw_col_12' disabled={disabled} isRequired={true}>
                        <FormSelect
                            type='text'
                            field='product_cate_list'
                            placeholder='--Chọn--'
                            list={productCategoryOpts}
                            mode={"multiple"}
                            validation={msgError['product_cate_list']}

                        />
                    </FormItem> */}

          <div className='bw_col_12'>
            <FormItem label='Loại đơn hàng' isRequired={true} disabled={disabled}>
              <FormDebouneSelect
                placeholder='--Chọn--'
                field='order_types'
                mode='multiple'
                fetchOptions={(keyword) => dispatch(getOptionsGlobal('orderType', { keyword }))}
              />
            </FormItem>
          </div>

          <FormItem label='Mô tả' className='bw_col_12' disabled={disabled}>
            <FormTextArea field='description' placeholder='Mô tả hình thức xuất bán' />
          </FormItem>
        </div>
      </BWAccordion>
    </React.Fragment>
  );
};

export default OutputTypeInfor;
