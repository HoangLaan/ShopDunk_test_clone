import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';

import { getOptionsDepartment } from 'services/department.service';
import { mapDataOptions4Select } from 'utils/helpers';
import { getUserOptions, getUser } from 'services/user-level-history.service';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import { getOptionsGlobal } from 'actions/global';

const UserLevelHistoryInfo = ({ disabled, title, ulhistoryId }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { setValue } = methods;
  const [optionsDepartment, setOptionsDepartment] = useState(null);
  const [optionsDepartmentOld, setOptionsDepartmentOld] = useState(null);
  const [optionsPositionOld, setOptionsPositionOld] = useState(null);
  const [optionsPositionLevelOld, setOptionsPositionLevelOld] = useState(null);
  const { positionByDepartmentData, positionLevelByPositionData } = useSelector((state) => state.global);

  const getOptions = useCallback(() => {
    getOptionsDepartment().then((res) => {
      setOptionsDepartment(mapDataOptions4Select(res));
    });
  }, []);

  useEffect(getOptions, [getOptions]);

  const department_new_id = methods.watch('department_new_id');
  useEffect(() => {
    if (department_new_id) {
      dispatch(getOptionsGlobal('positionByDepartment', { parent_id: department_new_id }));
    }
  }, [department_new_id, dispatch]);

  const position_new_id = methods.watch('position_new_id');
  useEffect(() => {
    if (position_new_id) {
      dispatch(getOptionsGlobal('positionLevelByPosition', { parent_id: position_new_id }));
    }
  }, [position_new_id, dispatch]);

  const username = methods.watch('username');

  const getDetailUser = useCallback(async () => {
    try {
      let position = [];
      let department = [];
      let positionlevel = [];
      let department_old_id = null;
      let position_old_id = null;
      let position_level_old_id = null;
      if (username) {
        const data = await getUser(username.value);
        department_old_id = data.department_old_id;
        position_old_id = data.position_old_id;
        position_level_old_id = data.position_level_old_id;

        position = data.position;
        department = data.department;
        positionlevel = data.position_level;
      }
      setValue('department_old_id', department_old_id);
      setValue('position_old_id', position_old_id);
      setValue('position_level_old_id', position_level_old_id);

      setOptionsDepartmentOld(department);
      setOptionsPositionOld(position);
      setOptionsPositionLevelOld(positionlevel);
    } catch (error) {
      showToast.error(window._$g._(error.message));
    }
  }, [setValue, username]);

  useEffect(() => {
    getDetailUser();
  }, [getDetailUser]);

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem label='Nhân viên' isRequired={true} disabled={disabled || ulhistoryId}>
            <FormDebouneSelect
              field='username'
              fetchOptions={getUserOptions}
              validation={{
                required: 'Nhân viên là bắt buộc',
              }}
              allowClear={true}
              placeholder='Chọn nhân viên'
            />
          </FormItem>

          <FormItem label='Phòng ban hiện tại' isRequired={true} disabled={true}>
            <FormSelect field='department_old_id' list={optionsDepartmentOld} />
          </FormItem>

          <FormItem label='Chức vụ hiện tại' isRequired={true} disabled={true}>
            <FormSelect field='position_old_id' list={optionsPositionOld} />
          </FormItem>

          <FormItem label='Cấp độ hiện tại' isRequired={true} disabled={true}>
            <FormSelect field='position_level_old_id' list={optionsPositionLevelOld} />
          </FormItem>
        </div>

        <div className='bw_col_4'>
          <FormItem label='Phòng ban mới' isRequired={true} disabled={disabled}>
            <FormSelect
              field='department_new_id'
              list={optionsDepartment}
              validation={{
                required: 'Phòng ban mới là bắt buộc.',
              }}
              onChange={(value) => {
                methods.clearErrors('department_new_id');
                methods.setValue('department_new_id', value);
                methods.setValue('position_new_id', null);
                methods.setValue('position_level_new_id', null);
              }}
            />
          </FormItem>

          <FormItem label='Chức vụ mới' isRequired={true} disabled={disabled || !department_new_id}>
            <FormSelect
              field='position_new_id'
              list={mapDataOptions4Select(positionByDepartmentData)}
              validation={{
                required: 'Chức vụ mới là bắt buộc.',
              }}
              onChange={(value) => {
                methods.clearErrors('position_new_id');
                methods.setValue('position_new_id', value);
                methods.setValue('position_level_new_id', null);
              }}
            />
          </FormItem>

          <FormItem label='Cấp độ mới' isRequired={true} disabled={disabled || !position_new_id}>
            <FormSelect
              field='position_level_new_id'
              list={mapDataOptions4Select(positionLevelByPositionData)}
              validation={{
                required: 'Cấp độ mới là bắt buộc.',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_col_4'>
          <FormItem label='Ngày áp dụng' isRequired={true} disabled={disabled}>
            <FormDatePicker
              format={'DD/MM/YYYY'}
              field='apply_date'
              validation={{
                required: 'Ngày áp dụng là bắt buộc.',
              }}
              placeholder={'dd/mm/yyyy'}
              style={{
                width: '100%',
              }}
              bordered={false}
              allowClear
            />
          </FormItem>
        </div>

        <div className='bw_col_12'>
          <FormItem label='Lý do chuyển' disabled={disabled}>
            <FormTextArea field='reason' placeholder='Mô tả' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};
export default UserLevelHistoryInfo;
