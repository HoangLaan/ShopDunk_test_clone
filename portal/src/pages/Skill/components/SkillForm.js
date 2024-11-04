import React, { useEffect, useState } from 'react';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getListGroupSkillOption, getListSkillLevelOption } from '../helpers/call-api';
import { mapDataOptions4Select } from 'utils/helpers';
import { showToast } from 'utils/helpers';

export function SkillInfo({ disabled }) {
  const [groupSkillOpts, setGroupSkillOpts] = useState([]);
  const [skillLevelOpts, setSkillLevelOpts] = useState([]);

  useEffect(() => {
    getDataAddSkill();
  }, []);

  const getDataAddSkill = async () => {
    try {
      let groupSkillOpts = await getListGroupSkillOption();
      let skillLevelOpts = await getListSkillLevelOption();

      setGroupSkillOpts(mapDataOptions4Select(groupSkillOpts));
      setSkillLevelOpts(mapDataOptions4Select(skillLevelOpts));
    } catch (error) {
      showToast.error('Có lỗi xảy ra!');
    }
  };
  return (
    <BWAccordion title='Thông tin kỹ năng' id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem label='Tên kỹ năng' isRequired>
            <FormInput
              type='text'
              field='skill_name'
              placeholder='Nhập tên kỹ năng'
              validation={{
                required: 'Tên kỹ năng là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả'>
            <FormTextArea field='description' rows={3} disabled={disabled} placeholder='Mô tả' />
          </FormItem>
        </div>

        <div className='bw_col_12'>
          <FormItem
            label='Nhóm kỹ năng'
            // isRequired={true}
          >
            <FormSelect
              field='skill_group_list'
              id='skill_group_list'
              disabled={disabled}
              mode='multiple'
              list={groupSkillOpts}
              // validation={{
              //     required: 'Nhóm kỹ năng là bắt buộc',
              // }}
            />
          </FormItem>
        </div>

        <div className='bw_col_12'>
          <FormItem label='Trình độ kỹ năng'>
            <FormSelect field='level_list' id='level_list' disabled={disabled} mode='multiple' list={skillLevelOpts} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export function SkillStatus({ disabled }) {
  return (
    <BWAccordion title='Trạng thái' id='bw_mores' isRequired={false}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_active' disabled={disabled} />
                <span />
                Kích hoạt
              </label>
              {/* <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_system' disabled={disabled} />
                <span />
                Hệ thống
              </label> */}
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
}
