import React, { useEffect, useCallback, useState } from 'react';

import { getTaskOptions, getTaskTypeOptions } from 'services/task.service';
import { mapDataOptions4Select } from 'utils/helpers';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import { Button } from 'antd';
import { CloseOutlined, ArrowRightOutlined } from '@ant-design/icons';
import moment from 'moment';

const TaskForVoidIp = ({ onCancel, onNextAssign }) => {
  const methods = useFormContext();
  const [taskTypeOptions, setTaskTypeOptions] = useState([]);
  const [taskOptions, setTaskOptions] = useState([]);

  const getOptions = useCallback(() => {
    getTaskTypeOptions()
      .then((res) => {
        methods.setValue('task_type_id', res[0]?.id)
        setTaskTypeOptions(mapDataOptions4Select(res));
      })
      .catch((err) => { });
    getTaskOptions()
      .then((res) => {
        //methods.setValue('parent_id', res[0]?.id)
        setTaskOptions(mapDataOptions4Select(res));
      })
      .catch((err) => { });

    methods.setValue('start_date', moment(new Date()).format('DD/MM/YYYY'))
    methods.setValue('end_date', moment(new Date()).format('DD/MM/YYYY'))
    methods.setValue('task_name', `Chăm sóc Khách hàng qua điện thoại`)

  }, []);

  useEffect(getOptions, [getOptions]);

  return <div style={{
    border: '1px solid #ccc'
  }} className='bw_col_12'>
    <div className='bw_row'>
      <FormItem className='bw_col_12' label='Loại công việc' isRequired>
        <FormSelect
          bordered
          field='task_type_id'
          list={taskTypeOptions}
          validation={{
            required: 'Loại công việc là bắt buộc',
          }}
        />
      </FormItem>

      <FormItem className='bw_col_12' label='Thời hạn' isRequired>
        <FormDateRange
          bordered
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
      <FormItem className='bw_col_12' label='Tên công việc' isRequired>
        <FormInput
          bordered
          type='text'
          field='task_name'
          placeholder='Nhập tên công việc'
          validation={{
            required: 'Tên công việc là bắt buộc',
          }}
        />
      </FormItem>

      <FormItem className='bw_col_12' label='Thuộc công việc'>
        <FormSelect bordered field='parent_id' list={taskOptions} allowClear />
      </FormItem>
    </div>

    <div className='bw_row'>
      <FormItem className='bw_col_12' label='Mô tả'>
        <FormTextArea field='description' rows={3} placeholder='Mô tả' />
      </FormItem>
    </div>
    <span
      className='bw_flex'
      style={{
        justifyContent: 'space-evenly'
      }}
    >
      <Button
        onClick={onCancel}
        danger
        type="primary"
        icon={<CloseOutlined />}
        size='small'
      >Huỷ bỏ
      </Button>
      <Button
        onClick={onNextAssign}
        type="primary"
        icon={<ArrowRightOutlined />}
        size='small'
      >Kế tiếp
      </Button>
    </span>
    <br />
  </div>
};

export default TaskForVoidIp;
