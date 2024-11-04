import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { notification } from 'antd';
//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4Select } from 'utils/helpers';
import { getOptionsPosition } from 'services/position.service';
import { getOptionsDepartment } from 'services/department.service';
import { msgError } from 'pages/OffWorkReviewLevel/helpers/msgError';
import useGetOptions from 'hooks/useGetOptions';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';

const RequestPoRLInfor = ({ disabled }) => {
  const methods = useFormContext();
  const businessOptions = useGetOptions('business');
  const departmentOptions = useGetOptions('department');

  const [positionOpts, setPositionOpts] = useState([]);
  const [departmentOpts, setDepartmentOpts] = useState([]);

  const { watch, setValue } = methods;

  useEffect(() => {
    const getDataOptions = async () => {
      const _departmentOpts = await getOptionsDepartment();
      setDepartmentOpts(departmentOpts.concat(mapDataOptions4Select(_departmentOpts)));

      const _positionOpts = await getOptionsPosition();
      setPositionOpts(positionOpts.concat(mapDataOptions4Select(_positionOpts)));
    };
    getDataOptions();
  }, []);

  return (
    <BWAccordion title='Thông tin' id='bw_info_cus'>
      <div className='bw_row'>
        <FormItem label='Tên mức duyệt' className='bw_col_6' isRequired disabled={disabled}>
          <FormInput
            type='text'
            field='review_level_name'
            placeholder='Tên mức duyệt'
            validation={msgError['review_level_name']}
          />
        </FormItem>

        <FormItem label='Miền áp dụng' className='bw_col_6' isRequired disabled={disabled}>
          <FormSelect
            field='business_id'
            list={businessOptions}
            validation={{
              required: 'Miền là bắt buộc',
            }}
          />
        </FormItem>

        <FormItem label='Phòng ban duyệt' className='bw_col_6' isRequired disabled={disabled}>
          <label
            onClick={() => {
              if (watch('is_apply_all_department')) {
                setValue('departments', []);
              }
            }}
            className='bw_checkbox'>
            <FormInput
              disabled={disabled}
              type='checkbox'
              field='is_apply_all_department'
              value={watch('is_apply_all_department')}
            />
            <span />
            Tất cả phòng ban
          </label>
          {!watch('is_apply_all_department') && (
            <FormSelect field='departments' id='departments' list={departmentOptions} allowClear mode={'tags'} />
          )}
        </FormItem>

        <FormItem label='Vị trí duyệt' className='bw_col_6' isRequired disabled={disabled}>
          <label className='bw_checkbox'>
            <FormInput
              disabled={disabled}
              type='checkbox'
              field='is_apply_all_position'
              value={watch('is_apply_all_position')}
            />
            <span />
            Tất cả vị trí
          </label>
          {!watch('is_apply_all_position') && (
            <FormSelect allowClear mode='tags' field='positions' id='positions' list={positionOpts} />
          )}
        </FormItem>
        <div className='bw_col_12'>
          <FormItem disabled={disabled} label='Mô tả'>
            <FormTextArea type='text' field='description' placeholder='Nhập mô tả' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default RequestPoRLInfor;
