import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import { FORM_RULES } from 'utils/constants';

const CustomerAdditional = ({ disabled }) => {
  return (
    <BWAccordion title='Thông tin căn cước'>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem disabled={disabled} label='Số CMND/CCCD'>
            <FormInput type='text' placeholder='07009xxxxxx' field='id_card' validation={FORM_RULES.number('Số CMND/CCCD không hợp lệ')} />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem disabled={disabled} label='Ngày cấp'>
            <FormDatePicker
              style={{
                width: '100%',
                padding: '2px 0px',
              }}
              field='id_card_date'
              bordered={false}
              type='date'
              format='DD/MM/YYYY'
              placeholder='DD/MM/YYYY'
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem disabled={disabled} label='Nơi cấp'>
            <FormInput type='text' field='id_card_place' placeholder='Cục CSQL' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default CustomerAdditional;
