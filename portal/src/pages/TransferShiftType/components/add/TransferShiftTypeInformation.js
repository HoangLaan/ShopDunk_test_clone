import React, { useEffect, useMemo, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { useFormContext } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import WSTReviewLevelTableAdd from './TSTReviewLevelTableAdd';
import { mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';
import { getCompanyOptions } from 'services/transfer-shift-type.service';

const TransferShiftTypeInformation = ({ disabled, title, isEdit }) => {
  const { unregister, watch, setValue } = useFormContext();

  const isAutoReview = useMemo(() => watch('is_auto_review') ?? false, [watch('is_auto_review')]);
  const [companyOptions, setCompanyOptions] = useState([]);

  const DEFAULT_COMPANY = 1;
  useEffect(() => {
    getCompanyOptions().then(({ items: data }) => setCompanyOptions(data));
  }, []);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <div className='bw_row'>
              <FormItem className='bw_col_6' disabled={disabled} isRequired label='Công ty'>
                <FormSelect
                  field='company_id'
                  list={mapDataOptions4SelectCustom(companyOptions, 'id', 'name')}
                  validation={{
                    required: 'Công ty là bắt buộc',
                  }}
                />
              </FormItem>
              <FormItem className='bw_col_6' disabled={disabled} isRequired label='Tên loại yêu cầu chuyển ca'>
                <FormInput
                  type='text'
                  field='transfer_shift_type_name'
                  placeholder='Tên loại yêu cầu chuyển ca'
                  validation={{
                    validate: (value) => {
                      if (!value || value === '') return 'Tên loại yêu cầu chuyển ca là bắt buộc';
                      const regexSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                      if (regexSpecial.test(value)) return 'Tên loại yêu cầu chuyển ca không được chứa ký tự đặc biệt';

                      return true;
                    },
                  }}
                />
              </FormItem>
            </div>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Mô tả'>
              <FormTextArea type='text' field='description' placeholder='Mô tả' />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Hình thức chuyển ca'>
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_another_business' />
                <span />
                Khác miền
              </label>
            </FormItem>
          </div>

          <FormItem className='bw_col_12' disabled={disabled} label='Thông tin mức duyệt'>
            <label className='bw_checkbox'>
              <FormInput
                checked={isAutoReview}
                type='checkbox'
                field='is_auto_review'
                onClick={() => {
                  if (!isEdit) unregister('review_levels');
                  setValue('is_auto_review', isAutoReview);
                }}
              />
              <span />
              Tự động duyệt
            </label>
            {!isAutoReview && <WSTReviewLevelTableAdd disabled={disabled} />}
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default TransferShiftTypeInformation;
