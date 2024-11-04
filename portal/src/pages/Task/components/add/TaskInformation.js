import React, { useEffect, useCallback, useState } from 'react';

import { getTaskOptions, getTaskTypeOptions } from 'services/task.service';
import { mapDataOptions4Select } from 'utils/helpers';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const TaskInformation = ({ disabled, title }) => {
  const [taskTypeOptions, setTaskTypeOptions] = useState([]);
  const [taskOptions, setTaskOptions] = useState([]);

  const getOptions = useCallback(() => {
    getTaskTypeOptions()
      .then((res) => {
        setTaskTypeOptions(mapDataOptions4Select(res));
      })
      .catch((err) => {});

    getTaskOptions()
      .then((res) => {
        setTaskOptions(mapDataOptions4Select(res));
      })
      .catch((err) => {});
  }, []);

  useEffect(getOptions, [getOptions]);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <FormItem className='bw_col_6' label='Loại công việc' isRequired disabled={disabled}>
            <FormSelect
              field='task_type_id'
              list={taskTypeOptions}
              validation={{
                required: 'Loại hợp là bắt buộc',
              }}
            />
          </FormItem>

          <FormItem className='bw_col_6' label='Thời hạn' isRequired disabled={disabled}>
            <FormDateRange
              allowClear={true}
              fieldStart={'start_date'}
              fieldEnd={'end_date'}
              placeholder={['Từ ngày', 'Đến ngày']}
              format={'DD/MM/YYYY'}
              validation={{
                required: 'Thời hạn là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_row'>
          <FormItem className='bw_col_6' label='Tên công việc' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='task_name'
              placeholder='Nhập tên công việc'
              validation={{
                required: 'Tên công việc là bắt buộc',
              }}
            />
          </FormItem>

          <FormItem className='bw_col_6' label='Thuộc công việc' disabled={disabled}>
            <FormSelect field='parent_id' list={taskOptions} allowClear />
          </FormItem>
        </div>

        <div className='bw_row'>
          <FormItem className='bw_col_12' label='Mô tả'>
            <FormTextArea field='description' rows={3} placeholder='Mô tả' disabled={disabled} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default TaskInformation;
