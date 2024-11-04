import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { ExchangePointInformationStyle } from 'pages/ExchangePoint/utils/style';

const ExchangePointInformation = ({ disabled, title }) => {
  return (
    <BWAccordion title={title}>
      <ExchangePointInformationStyle>
        <div className='bw_col_12'>
          <div className='bw_row'>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} label='Tên chương trình tiêu điểm' isRequired>
                <FormInput
                  placeholder={'Nhận tên chương trình tiêu điểm'}
                  field={'ex_point_name'}
                  validation={{
                    required: 'Tên chương trình tiêu điểm là bắt buộc',
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_12'>
              <label className='bw_checkbox '>
                <FormInput disabled={disabled} type='checkbox' field='is_exchange_point_to_money' />
                <span />
                Dùng điểm để thanh toán
              </label>
            </div>

            <div className='bw_col_12 '>
              <div className='bw_row'>
                <div className='bw_col_6 bw_collapse_title'>
                  <h3>Tỷ lệ tiêu điểm </h3>
                </div>
                <div className='bw_col_3'>
                  <FormNumber disabled={disabled} field={'point'} addonAfter='Điểm thưởng' bordered />
                </div>
                <div className='bw_col_1 bw_text_center bw_icon_transfer'>
                  <i class='fa fa-arrows-h' aria-hidden='true'></i>
                </div>
                <div className='bw_col_2'>
                  <FormNumber disabled={disabled} field={'value'} addonAfter='VNĐ' bordered />
                </div>
              </div>
              <div className='bw_row bw_mt_2'>
                <div className='bw_col_10 bw_collapse_title'>
                  <h3>Được sử dụng tối đa </h3>
                </div>
                <div className='bw_col_2'>
                  <FormNumber max={100} disabled={disabled} field={'max_ex_point'} addonAfter='% Điểm' bordered />
                </div>
              </div>
              <div className='bw_row bw_mt_2'>
                <div className='bw_col_10 bw_collapse_title'>
                  {' '}
                  <h3>Thanh toán bằng điểm sau </h3>
                </div>
                <div className='bw_col_2'>
                  <FormNumber disabled={disabled} field={'applied_after'} addonAfter='Lần mua' bordered />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ExchangePointInformationStyle>
    </BWAccordion>
  );
};

export default ExchangePointInformation;
