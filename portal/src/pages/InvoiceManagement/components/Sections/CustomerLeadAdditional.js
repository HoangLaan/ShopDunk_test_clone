import React, { useState, useEffect, useCallback } from 'react';
import { getListCarrer } from 'services/customer.service';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import { mapDataOptions } from 'utils/helpers';

const CustomerLeadAdditional = ({ disabled }) => {
  const [optionsCareer, setOptionsCareer] = useState([]);
  const loadCareer = useCallback(() => {
    getListCarrer().then((p) => {
      setOptionsCareer(mapDataOptions(p?.data));
    });
  }, []);
  useEffect(loadCareer, [loadCareer]);

  return (
    <BWAccordion title='Thông tin bổ sung'>
      <div className='bw_row bw_customer_lead_additional'>
        <div className='bw_col_4'>
          <FormItem disabled={disabled} label='Số CMND/CCCD'>
            <FormInput type='text' placeholder='07009xxxxxx' field='id_card' />
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
        <div className='bw_col_4'>
          <FormItem disabled={disabled} label='Nghề nghiệp'>
            <FormSelect
              showSearch
              field='career_id'
              placeholder='Chọn nghề nghiệp'
              list={optionsCareer}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default CustomerLeadAdditional;
