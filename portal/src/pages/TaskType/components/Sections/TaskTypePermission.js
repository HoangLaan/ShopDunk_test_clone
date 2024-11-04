import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { getOptionsFunction } from 'services/function.service';
import { mapDataOptions } from 'utils/helpers';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

function TaskTypePermission({ disabled, title }) {
  const { watch, clearErrors, setValue } = useFormContext();
  const [addFuncOpts, setAddFuncOpts] = useState([]);
  const [editFuncOpts, setEditFuncOpts] = useState([]);
  const [deleteFuncOpts, setDeleteFuncOpts] = useState([]);

  const fetchAddFuncOptions = async (search, limit = 100) => {
    const _funcOpts = await getOptionsFunction({ search, limit });
    setAddFuncOpts(mapDataOptions(_funcOpts, { valueAsString: true }));
  };
  const fetchEditFuncOptions = async (search, limit = 100) => {
    const _funcOpts = await getOptionsFunction({ search, limit });
    setEditFuncOpts(mapDataOptions(_funcOpts, { valueAsString: true }));
  };
  const fetchDeleteFuncOptions = async (search, limit = 100) => {
    const _funcOpts = await getOptionsFunction({ search, limit });
    setDeleteFuncOpts(mapDataOptions(_funcOpts, { valueAsString: true }));
  };

  useEffect(() => {
    fetchAddFuncOptions();
    fetchEditFuncOptions();
    fetchDeleteFuncOptions();
  }, []);

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem label='Quyền thêm mới' disabled={disabled} isRequired={true}>
            <FormDebouneSelect
              field='add_function_id'
              options={addFuncOpts}
              fetchOptions={fetchAddFuncOptions}
              validation={{
                required: 'Quyền thêm mới là bắt buộc',
              }}
              disabled={disabled}
              placeholder={'--Chọn--'}
              defaultValue={watch('add_function_id')}
              onChange={(value) => {
                clearErrors('add_function_id');
                setValue('add_function_id', value.value || value.id);
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Quyền chỉnh sửa' disabled={disabled} isRequired={true}>
            <FormDebouneSelect
              field='edit_function_id'
              options={editFuncOpts}
              fetchOptions={fetchEditFuncOptions}
              validation={{
                required: 'Quyền thêm mới là bắt buộc',
              }}
              disabled={disabled}
              placeholder={'--Chọn--'}
              onChange={(value) => {
                clearErrors('edit_function_id');
                setValue('edit_function_id', value.value || value.id);
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Quyền xóa' disabled={disabled} isRequired={true}>
            <FormDebouneSelect
              field='delete_function_id'
              options={deleteFuncOpts}
              fetchOptions={fetchDeleteFuncOptions}
              validation={{
                required: 'Quyền thêm mới là bắt buộc',
              }}
              disabled={disabled}
              placeholder={'--Chọn--'}
              onChange={(value) => {
                clearErrors('delete_function_id');
                setValue('delete_function_id', value.value || value.id);
              }}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default TaskTypePermission;
