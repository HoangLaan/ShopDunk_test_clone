import React, { useCallback, useEffect } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import TimeKeepingClaimGroupImages from './TimeKeepingClaimGroupImages';
import ReviewLevelTable from './ReviewLevel/ReviewLevelTable';
import { getDetailTimeKeepingClaimType } from 'services/time-keeping-claim-type.service';
import { countTimesExplained } from 'services/time-keeping-claim.service';
import moment from 'moment';
import { showToast } from 'utils/helpers';
import { useAuth } from 'context/AuthProvider';

const TimeKeepingClaimInformation = ({ timeKeeping, disabled, userName, isLate }) => {
  const { watch, setValue } = useFormContext();

  const timeKeepingClaimTypeOptions = useGetOptions(optionType.timeKeepingClaimType);
  const time_keeping_claim_type_id = watch('time_keeping_claim_type_id')

  const isExpiredExplain = useCallback((claimDeadline) => {
    const timeKeepingDate = moment(new Date(moment(timeKeeping, "DD/MM/YYYY").toDate())).utc().format();
    const expirationDate = moment(timeKeepingDate).add(claimDeadline, 'd').format('YYYY-MM-DD');
    const duration = moment.duration(moment(expirationDate).diff(moment().format('YYYY-MM-DD'))).asDays();
    return duration > 0 ? false : true
  }, [])

  const handleSelectTimeKeepingClaimType = useCallback(async (time_keeping_claim_type_id, controlbyselect) => {
   
    setValue('time_keeping_claim_type_id', time_keeping_claim_type_id)
    getDetailTimeKeepingClaimType(time_keeping_claim_type_id).then(data => {
      setValue('review_levels', data?.review_levels?.map(d => {
        const reviewLevelPrev = watch('review_levels_of_time_keeping_claim')?.find(rl => rl.review_level_id === d.review_level_id);
        if (reviewLevelPrev) return { ...reviewLevelPrev, ...d }
       
        return d
      }))
      
      // Nếu đã giải trình 2 lần với trường hợp về sớm đi muộn rồi thì thôi
      if (watch('is_enough_explain')) {
        setValue('is_explain', false);
        return;
      }

      // Kiểm tra xem có quá thời hạn giải trình hay ko, nếu quá thì ko cho giải trình
      if (isExpiredExplain(parseInt(data.claim_deadline)) && controlbyselect) {
        showToast.error("Đã vượt quá thời gian giải trình cho phép !")
        // setValue('is_explain', false);
        return;
      }

      // Check xem có vượt quá số lần giải trình của loại giải trình này không, nếu vượt quá thì không cho giải trình
      countTimesExplained({ time_keeping_claim_type_id, user_name: userName }).then((dataCount) => {
        if (dataCount >= parseInt(data.claim_limits) && controlbyselect) {
          showToast.error(`Bạn chỉ được phép giải trình tối đa ${dataCount} lần ở loại giải trình này! Hiện tại đã vượt quá số lần`)
          setValue('is_explain', false)
        }
      })

      // Nếu đã giải trình muộn / sớm rồi và muốn giải trình muộn / sớm tiếp thì ko cho
      if (watch('is_late') === isLate) {
        setValue('is_explain', false);
        return;
      }
    })
  }, [])
  
  useEffect(() => {
    if (time_keeping_claim_type_id) handleSelectTimeKeepingClaimType(time_keeping_claim_type_id);
  }, [time_keeping_claim_type_id]);

  return (
    <BWAccordion title={'Lý do giải trình'} isRequired>
      <div className='bw_row'>
        {/* <FormItem  className='bw_col_12' label='Thông tin nhân viên' disabled={disabled}>
            <div className='bw_row'>
              <div style={{display: 'flex', gap: '15px', padding: '10px 0', justifyContent: 'center', alignItems: 'center'}} > 
                <i className='fi fi-rr-users' style={{border: '1px solid', padding: '15px', borderRadius: '50%'}} ></i>
                <p>20001 - Nhân viên A</p>
              </div>
             
               <div className={'bw_col_3'}></div>
              <div className={'bw_col_3'} >
                tên ca làm việc <br/>
                giờ <br/>
                cửa hàng
              </div>
            </div>
          </FormItem> */}
        <FormItem className='bw_col_12' isRequired label='Loại giải trình' disabled={disabled}>
          <FormSelect
            field='time_keeping_claim_type_id'
            validation={{ required: 'Loại giải trình là bắt buộc' }}
            list={timeKeepingClaimTypeOptions}
            onChange={(id) => handleSelectTimeKeepingClaimType(id,  true)}
          />
        </FormItem>
        <FormItem className='bw_col_12' isRequired label='Lý do giải trình' disabled={disabled}>
          <FormTextArea placeholder='Nhập lý do giải trình' field='claim_reason' />
        </FormItem>
        <FormItem className='bw_col_12' label='Hình ảnh bằng chứng'>
          <TimeKeepingClaimGroupImages />
        </FormItem>
      </div>
      <ReviewLevelTable />
    </BWAccordion>
  );
};

export default TimeKeepingClaimInformation;
