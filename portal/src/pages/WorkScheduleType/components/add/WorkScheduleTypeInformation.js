import React, { useEffect, useMemo, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { useFormContext, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import WSTReviewLevelTableAdd from './WSTReviewLevelTableAdd';
import { mapDataOptions4Select } from 'utils/helpers';
import WSTReasonTable from './WSTReasonTable';
import { useFieldArray } from 'react-hook-form';

const WorkScheduleTypeInformation = ({ disabled, title, isEdit }) => {
  const { setValue, watch, control, unregister } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'reasons',
  });

  const isAutoReview = useMemo(() => watch('is_auto_review') ?? true, [watch('is_auto_review')]);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} isRequired label='Tên loại lịch công tác'>
              <FormInput
                type='text'
                field='work_schedule_type_name'
                placeholder='Tên loại lịch công tác'
                validation={{
                  validate: (value) => {
                    if (!value || value === '') return 'Tên loại lịch công tác là bắt buộc';
                    const regexSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                    if (regexSpecial.test(value)) return 'Tên loại lịch công tác không được chứa ký tự đặc biệt';

                    return true;
                  },
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Mô tả'>
              <FormTextArea type='text' field='description' placeholder='Mô tả' />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <WSTReasonTable
              onRemove={(index) => {
                setValue(
                  'reasons',
                  watch('reasons').filter((item, i) => item && i !== index),
                );
              }}
              onClickAddNew={() => {
                append({ name: '', description: '' });
              }}
              disabled={disabled}
              data={fields}
            />
          </div>
          <div style={{ marginTop: '0.5em' }} className='bw_col_12'>
            <label className='bw_checkbox'>
              <FormInput
                checked={isAutoReview}
                disabled={disabled}
                type='checkbox'
                field='is_auto_review'
                onClick={() => {
                  if (!isEdit) unregister('review_levels');
                  setValue('is_auto_review', isAutoReview);
                }}
              />
              <span />
              tự động duyệt
            </label>
          </div>
          {!isAutoReview && (
            <div className='bw_col_12'>
              <WSTReviewLevelTableAdd disabled={disabled} />
            </div>
          )}
        </div>
      </div>
    </BWAccordion>
  );
};

export default WorkScheduleTypeInformation;
