import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';

function Status({ title, disabled }) {
  const methods = useFormContext();
  const { watch } = methods;

  return (
    <BWAccordion title={title} id='bw_mores' isRequired={false}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_active' value={watch('is_active')} />
                <span />
                Kích hoạt
              </label>
              <label className='bw_checkbox'>
                <FormInput
                  disabled={disabled}
                  type='checkbox'
                  field='is_time_keeping'
                  value={watch('is_time_keeping')}
                />
                <span></span>
                Tham gia chấm công
              </label>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
}

export default Status;
