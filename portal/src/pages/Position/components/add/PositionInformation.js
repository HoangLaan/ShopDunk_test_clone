import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { getOptionsDepartment } from 'services/position.service';

const PositionInformation = ({ disabled, title }) => {
  const [dataListDepartMent, setDataListDepartMent] = useState([]);

  const loadFunctionGroup = useCallback(() => {
    getOptionsDepartment().then((p) => setDataListDepartMent(p.items));
  }, []);
  useEffect(loadFunctionGroup, [loadFunctionGroup]);
  return (
    <BWAccordion title='Thông tin vị trí'>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Tên vị trí'>
              <FormInput
                disabled={disabled}
                type='text'
                field='position_name'
                placeholder='Nhập tên vị trí'
                validation={{
                  required: 'Tên vị trí là bắt buộc',
                }}
              />
            </FormItem>
          </div>

          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Phòng ban'>
              <FormSelect
                disabled={disabled}
                mode='multiple'
                showSearch
                type='text'
                field='department_list'
                placeholder='Chọn phòng ban'
                validation={{
                  required: 'Cần chọn phòng ban',
                }}
                list={(dataListDepartMent ?? []).map((_) => {
                  return {
                    label: _.department_name,
                    value: _.department_id,
                  };
                })}
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

PositionInformation.propTypes = {
  disabled: PropTypes.bool,
};

PositionInformation.defaultProps = {
  disabled: false,
};

export default PositionInformation;
