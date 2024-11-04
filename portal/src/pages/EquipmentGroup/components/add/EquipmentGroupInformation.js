import React, { useCallback, useEffect, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4Select } from 'utils/helpers';
import { getOptionsEquipmentGroup } from 'services/equipment-group.service';

const EquipmentGroupInformation = ({ disabled, title, equipmentGroupId }) => {
  const [equipmentGroupOptions, setEquipmentGroupOptions] = useState([]);

  const loadGroupOptions = useCallback(() => {
    getOptionsEquipmentGroup().then((data) => {
      const dataGroup = data.items
        .filter((item) => +item.equipment_group_id !== +equipmentGroupId)
        .concat({
          equipment_group_id: 0,
          equipment_group_name: 'Chưa có nhóm thiết bị',
        });
      setEquipmentGroupOptions(dataGroup);
    });
  }, []);
  useEffect(loadGroupOptions, [loadGroupOptions]);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} isRequired label='Tên nhóm thiết bị '>
              <FormInput
                type='text'
                field='equipment_group_name'
                placeholder='Nhập tên nhóm thiết bị'
                validation={{
                  required: 'Tên nhóm thiết bị là bắt buộc',
                }}
              />
            </FormItem>
          </div>

          <div className='bw_col_12'>
            <FormItem disabled={disabled} isRequired label='Mã nhóm thiết bị '>
              <FormInput
                type='text'
                field='equipment_group_code'
                placeholder='Nhập mã nhóm thiết bị'
                validation={{
                  required: 'Mã nhóm thiết bị là bắt buộc',
                }}
              />
            </FormItem>
          </div>

          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Nhóm thiết bị'>
              <FormSelect
                defaultValue={0}
                field='parent_id'
                list={mapDataOptions4Select(equipmentGroupOptions, 'equipment_group_id', 'equipment_group_name')}
              />
            </FormItem>
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

export default EquipmentGroupInformation;
