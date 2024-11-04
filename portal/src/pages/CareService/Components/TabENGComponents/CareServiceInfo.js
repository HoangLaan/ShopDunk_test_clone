import React, { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
//until
import { mapDataOptions4Select } from 'utils/helpers';
import moment from 'moment';

//service
// import { getOptionsSolutionGroup, getOptionsStocksOutType } from 'services/solution.service';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { generateCareCode } from '../../helpers/call-api'
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { LANGUAGE_OPTIONS } from 'utils/constants';
import { TypetimepairOpts } from 'pages/CareService/helpers/constans';
export default function CareServiceInfor({ disabled }) {
  const methods = useFormContext();
  const { watch, setValue, clearErrors } = methods;

  const [optionsGroupService, setOptionsCompany] = useState(null);
  const [optionsErrorType, setOptionsErrorType] = useState(null);
  const [optionsLanguage, setOptionsLanguage] = useState(null);


  useEffect(() => {
    changeSelectDate();
  }, [watch('date_from'), watch('date_to')]);

  const changeSelectDate = () => {
    let startDate = watch('date_from');
    let endDate = watch('date_to');
    let date_from = moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    let date_to = moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    let count = TotalDay(date_from, date_to) || 0;
    setValue('total_day', count);
  };

  const TotalDay = (startDate, endDate) => {
    let start = moment(startDate, 'YYYY-MM-DD');
    let end = moment(endDate, 'YYYY-MM-DD');
    if (start.isSame(end)) {
      return 1;
    }
    return moment.duration(end.diff(start)).asDays() + 1;
  };



  const initGroupService = useCallback(() => {
    if (!watch('care_service_code')) {
      generateCareCode()
        .then((data) => {
          methods.reset({
            care_service_code: data
          });
        })
    }
  }, []);
  useEffect(initGroupService, [initGroupService]);

  return (
    <BWAccordion title='Thông tin dịch vụ' id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <FormItem label='Mã dịch vụ' className='bw_col_6' disabled>
          <FormInput
            type='text'
            field='care_service_code'
            placeholder='Nhập mã dịch vụ'
            maxlength='250'
           
            disabled
          />
        </FormItem>
        <FormItem label='Ngôn ngữ' className='bw_col_6' disabled>
          <FormSelect 
                field='language_id'
                disabled
                list={LANGUAGE_OPTIONS} 
                value={2}
            />
        </FormItem>
        <FormItem label='Tên dịch vụ' className='bw_col_6' isRequired disabled={disabled}>
          <FormInput
            type='text'
            field='care_service_name_en'
            placeholder='Nhập tên dịch vụ'
            maxlength='250'
            validation={{
              required: 'Tên dịch vụ không được bỏ trống!',
            }}
            disabled={disabled}
          />
        </FormItem>

      </div>
    </BWAccordion>
  );
}
