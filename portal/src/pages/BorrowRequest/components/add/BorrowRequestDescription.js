import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';

import { mapDataOptions4SelectCustomByType } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
// import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';

function BorrowRequestDescription({ disabled, title }) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { watch } = methods;

  const { userData } = useSelector((state) => state.global);

  const company_id = watch('company_id');
  const getUserOptions = useCallback(() => {
    if (company_id) {
      dispatch(getOptionsGlobal('user', { company_id: company_id }));
    }
  }, [company_id, dispatch]);
  useEffect(getUserOptions, [getUserOptions]);

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Nhân viên giao' disabled>
            <FormSelect field='delivery_user' list={mapDataOptions4SelectCustomByType(userData)} />
          </FormItem>
        </div>

        <div className='bw_col_6'>
          <FormItem label='Nhân viên nhận' disabled>
            <FormSelect field='receive_user' list={mapDataOptions4SelectCustomByType(userData)} />
          </FormItem>
        </div>

        <div className='bw_col_6'>
          <FormItem label='Ngày mượn' disabled>
            <FormDatePicker field='borrow_date' format={'DD/MM/YYYY'} allowClear={true} bordered={false} />
          </FormItem>
        </div>

        {/* <div className='bw_col_12'>
          <FormItem label='Ghi chú' disabled={disabled}>
            <FormTextArea field='note' placeholder='Nhập ghi chú' />
          </FormItem>
        </div> */}
      </div>
    </BWAccordion>
  );
}

export default BorrowRequestDescription;
