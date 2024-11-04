import React, { useCallback, useEffect } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import useGetOptions, {optionType} from 'hooks/useGetOptions';
import TimeKeepingClaimGroupImages from './TimeKeepingClaimGroupImages';
import { getDetailTimeKeepingClaimType } from 'services/time-keeping-claim-type.service';
import BWImage from 'components/shared/BWImage';

const TimeKeepingClaimInformation = ({ disabled, title }) => {
  const {watch, setValue, reset} = useFormContext();

  const timeKeepingClaimTypeOptions = useGetOptions(optionType.timeKeepingClaimType);
  const time_keeping_claim_type_id = watch('time_keeping_claim_type_id')

  const handleSelectTimeKeepingClaimType = useCallback(async (time_keeping_type_claim_id) => {
    setValue('time_keeping_claim_type_id', time_keeping_type_claim_id)
    getDetailTimeKeepingClaimType(time_keeping_type_claim_id).then(data => {
      setValue('review_levels', data.review_levels?.map(d => {
        const reviewLevelPrev = watch('review_levels_of_time_keeping_claim')?.find(rl => rl.review_level_id === d.review_level_id);
        if(reviewLevelPrev) return {...reviewLevelPrev, ...d}
        return d
      }))
    })
  }, [])

  useEffect(() => {
    if(time_keeping_claim_type_id) handleSelectTimeKeepingClaimType(time_keeping_claim_type_id);
  }, [time_keeping_claim_type_id]);
  

  let timeKeeping 
  if (watch('confirm_time_start') && watch('confirm_time_end')) {
    timeKeeping = `${watch('confirm_time_start')} - ${watch('confirm_time_end')}`;
  } else {
    timeKeeping= `${watch('time_keeping_start')} - ${watch('time_keeping_end')}`;
  }
  const userInfo = `${watch('user_name')} - ${watch('full_name')}`;

  return (
    <BWAccordion title={title} isRequired>
      <div className='bw_row'>
          <FormItem  className='bw_col_12' label='Thông tin nhân viên' disabled={disabled}>
            <div className='bw_row'>
              <div className='bw_col_3'>
                <div className='bw_row' >
                    <div className='bw_col_2' >
                    <BWImage style={{borderRadius: '50%'}} src={watch('avatar_image')} />
                    </div>
                    <div className='bw_col_10 bw_flex bw_align_items_center' >
                      {userInfo}
                    </div>
                  </div>
              </div>
               
             
              <div className={'bw_col_3'}></div>
              <div className={'bw_col_6'} >
                {watch('shift_name')} <br/>
                Giờ chấm công: {timeKeeping} <br/>
                Cửa hàng: {watch('store_name')}
              </div>
            </div>
          </FormItem>
          <FormItem className='bw_col_12' isRequired label='Loại giải trình' disabled={disabled}>
            <FormSelect
             field='time_keeping_claim_type_id'
             validation={{ required: 'Loại giải trình là bắt buộc' }}
             list={timeKeepingClaimTypeOptions}
             onChange={handleSelectTimeKeepingClaimType}
            />
          </FormItem>
          <FormItem className='bw_col_12' isRequired label='Lý do giải trình' disabled={disabled}>
            <FormTextArea  placeholder='Nhập lý do giải trình' field='claim_reason' />
          </FormItem>
          <FormItem className='bw_col_12' label='Hình ảnh bằng chứng' disabled={disabled}>
            <TimeKeepingClaimGroupImages/>
          </FormItem>
      </div>
    </BWAccordion>
  );
};

export default TimeKeepingClaimInformation;
