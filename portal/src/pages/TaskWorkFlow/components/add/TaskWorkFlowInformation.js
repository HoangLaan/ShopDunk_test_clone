import React, { useEffect } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { useFormContext } from 'react-hook-form';
import { ColorPicker } from 'antd';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

const TaskWorkFlowInformation = ({ color, disabled, title, disabledEdit }) => {
  const methods = useFormContext();
  const errors = methods.formState.errors;

  useEffect(() => {
    methods.register('color', {
      required: 'Mã màu là bắt buộc',
    });
  }, []);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Tên bước '>
              <FormInput
                type='text'
                field='work_flow_name'
                placeholder='Nhập tên bước'
                validation={{
                  required: 'Tên bước cần nhập là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled || disabledEdit} isRequired label='Mã bước '>
              <FormInput
                type='text'
                field='work_flow_code'
                placeholder='Mã bước'
                validation={{
                  required: 'Mã bước cần nhập là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Màu'>
              <div
                style={{
                  display: 'flex',
                }}>
                <input disabled className='bw_col_4' type='text' value={methods.watch('color')} placeholder='Màu' />
                <ColorPicker
                  format='hex'
                  value={methods.watch('color')}
                  onChange={(value, hex) => {
                    methods.setValue('color', hex);
                  }}
                  presets={[
                    {
                      label: 'Hay dùng',
                      colors: [
                        '#000000',
                        '#000000E0',
                        '#000000A6',
                        '#00000073',
                        '#00000040',
                        '#00000026',
                        '#0000001A',
                        '#00000012',
                        '#0000000A',
                        '#00000005',
                        '#F5222D',
                        '#FA8C16',
                        '#FADB14',
                        '#8BBB11',
                        '#52C41A',
                        '#13A8A8',
                        '#1677FF',
                        '#2F54EB',
                        '#722ED1',
                        '#EB2F96',
                        '#F5222D4D',
                        '#FA8C164D',
                        '#FADB144D',
                        '#8BBB114D',
                        '#52C41A4D',
                        '#13A8A84D',
                        '#1677FF4D',
                        '#2F54EB4D',
                        '#722ED14D',
                        '#EB2F964D',
                      ],
                    },
                  ]}
                />
              </div>
              {errors?.color && <ErrorMessage message={errors?.color?.message} />}

            </FormItem>
          </div>
          <div className='bw_col_3'>
            <label className='bw_checkbox'>
              <input
                disabled={disabled}
                type='checkbox'
                checked={methods.watch('type_purchase') === 1}
                onChange={(e) => methods.setValue('type_purchase', e.target.checked ? 1 : null)}
              />
              <span />
              Đồng ý mua
            </label>
          </div>
          <div className='bw_col_3'>
            <label className='bw_checkbox'>
              <input
                type='checkbox'
                disabled={disabled}
                checked={methods.watch('type_purchase') === 0}
                onChange={(e) => methods.setValue('type_purchase', e.target.checked ? 0 : null)}></input>
              <span />
              Không đồng ý mua
            </label>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Mô tả'>
              <FormTextArea type='text' field='description' placeholder='Nhập mô tả' />
            </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default TaskWorkFlowInformation;
