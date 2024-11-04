import { getOptionsGlobal } from 'actions/global';
import { DatePicker } from 'antd';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useAuth } from 'context/AuthProvider';
import dayjs from 'dayjs';
import moment from 'moment';
import { render_review } from 'pages/Proposal/utils/constants';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInformation } from 'services/proposal.service';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
const GeneralInformation = ({ title, isAdd, isDetail }) => {
  const { user } = useAuth();
  const [information, setInformation] = useState({});
  const { userData } = useSelector((state) => state.global);
  const { watch, setValue } = useFormContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAdd) setValue('created_user', user?.user_name);
  }, [isAdd, user]);

  useEffect(() => {
    if (!userData) dispatch(getOptionsGlobal('user'));
  }, [dispatch, userData]);

  useEffect(() => {
    if (isDetail) {
      getUserInformation({ user_name: watch('created_user') }).then(setInformation);
    } else {
      getUserInformation({ user_name: user?.user_name }).then(setInformation);
    }
  }, [user, isDetail, watch, watch('created_user')]);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          {!isAdd && (
            <div className='bw_col_12 bw_mb_2'>
              <label style={{ fontWeight: 'bold' }}>Trạng thái : </label>{' '}
              <span className={`bw_label_outline ${render_review(watch('is_review')).status} text-center`}>
                {render_review(watch('is_review')).title}
              </span>
            </div>
          )}
          <div className='bw_col_6'>
            <FormItem isRequired disabled={true} label='Ngày đề xuất'>
              {!isDetail ? (
                <DatePicker
                  className='bw_inp'
                  format={'DD/MM/YYYY'}
                  defaultValue={
                    watch('create_date')
                      ? watch('create_date')
                      : dayjs(moment(new Date()).format('DD/MM/YYYY'), 'DD/MM/YYYY')
                  }
                />
              ) : (
                <input
                  className='bw_inp'
                  defaultValue={
                    watch('create_date')
                      ? watch('create_date')
                      : moment(new Date()).format('DD/MM/YYYY')
                  }
                />
              )}
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={true} isRequired label='Người đề xuất'>
              {user && isAdd ? (
                <input className='bw_inp' defaultValue={user?.full_name} />
              ) : (
                <FormSelect
                  value={information?.full_name}
                  list={mapDataOptions4SelectCustom(userData, 'id', 'name')}></FormSelect>
              )}
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={true} label='Phòng ban'>
              <input defaultValue={information?.department_name} />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={true} label='Vị trí'>
              <input defaultValue={information?.position_name} />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={true} label='Cấp bậc'>
              <input defaultValue={information?.level_name} />
            </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default GeneralInformation;
