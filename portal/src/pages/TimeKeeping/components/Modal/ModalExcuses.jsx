import { Alert, notification } from 'antd';
import BWAccordion from 'components/shared/BWAccordion';
import BWButton from 'components/shared/BWButton';

import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import BWImage from 'components/shared/BWImage';
import Modal from 'components/shared/Modal';
import { msgError } from 'pages/TimeKeeping/helpers/msgError';
import { ModalAddStyled } from 'pages/TimeKeeping/helpers/style';
import DepartmentModel from 'pages/UserSchedule/components/DepartmentModel/DepartmentModel';
import DepartmentTable from 'pages/UserSchedule/components/DepartmentTable';
import ShiftModel from 'pages/UserSchedule/components/ShiftModel/ShiftModel';
import ShiftTable from 'pages/UserSchedule/components/ShiftTable';
import { getCompanyOpts, getStoreOpts, getBusinessOpts, updateExplanation } from 'pages/UserSchedule/helpers/call-api';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { mapDataOptions4Select } from 'utils/helpers';
import TimeKeepingClaimInformation from '../../TimeKeepingClaim/components/TimeKeepingClaimInformation';
import {createTimeKeepingClaim, getDetailTimeKeepingClaimByScheduleId} from 'services/time-keeping-claim.service'


const ModalExcuses = ({ open, selected, onClose, onRefresh, item, timeKeeping, isLate }) => {
  const methods = useForm({
    defaultValues: {
      shift: null,
      user: null,
      is_explain: true
    },
  });
  const {
    formState: { isValid },
  } = methods;
  const [companyOpts, setCompanyOpts] = useState([]);
  const [businessOpts, setBusinessOpts] = useState([]);
  const [storeOpts, setStoreOpts] = useState([]);
  const [isModelShift, setIsModelShift] = useState(false);
  const [isModelDepartment, setIsModelDepartment] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const isExplain = methods.watch('is_explain');
  const [submitClicked, setSubmitClicked] = useState(false);

  const getExplanation = (isLate) => {
    switch (isLate) {
      case 1:
        return 'đi muộn';
      case 0:
        return 'về sớm';
      case 2:
        return 'không chấm ra';
      case 3:
        return 'không chấm công';
      default:
        return 'không xác định';
    }
  };

  const getInitData = useCallback(async () => {
    try { 
      // lấy danh sách công ty
      const companyOpts = await getCompanyOpts();
      setCompanyOpts(mapDataOptions4Select(companyOpts));

      // Check đã giải trình trước đó chưa ?
      const schedule_id = item[0].schedule_id;
      const timeKeepingClaimDetail = await getDetailTimeKeepingClaimByScheduleId(schedule_id, {is_late: isLate});
      if(timeKeepingClaimDetail?.time_keeping_claim_id){
          methods.reset({
            ...methods.getValues(),
            ...timeKeepingClaimDetail
          })
      }      
    } catch (error) {
      notification.error({
        message: 'Đã xảy ra lỗi vui lòng thử lại',
      });
    }
  }, []);

  useEffect(() => {
    getInitData();
  }, [getInitData]);

  const onSubmit = async () => {
    let values = methods.getValues();
    //validate data
    // setAlerts([]);
    // if (Object.keys(values.excuses || {}).length <= 0) {
    //   setAlerts([{ type: 'warning', msg: 'Vui lòng nhập lý do giải trình' }]);
    //   return;
    // }

    let formData = {
      ...values,
      ...item[0],
      shift: item[0].schedule_id,
      is_late: isLate, 
      // excuses: Object.values(methods.watch('excuses') || []),
    };
    try {
      // await updateExplanation(formData);
      //console.log('createTimeKeepingClaim',formData);
      //goi service tao moi
      await createTimeKeepingClaim(formData).then(() => onClose())
      //console.log('formData ===>>',formData);
      notification.success({
        message: 'Giải trình thành công',
      });
      methods.reset({ shift: null });
      setAlerts([]);
    } catch (error) {
      notification.error({
        message: error?.message || 'Đã xảy ra lỗi vui lòng thử lại',
      });
    }
  };

  return (
    <Modal
      open={open}
      witdh={'65%'}
      footer={
        isExplain ? <BWButton content={'Giải trình'} onClick={() => methods.handleSubmit(onSubmit)()}></BWButton>
        : <></>
      }
      onClose={onClose}
      lalbelClose={'Đóng'}
      header={`Giải trình ${getExplanation(isLate)}`}>
      <FormProvider {...methods}>
        <ModalAddStyled>
          {alerts.map(({ type, msg }, idx) => {
            return <Alert key={`alert-${idx}`} type={type} message={msg} showIcon />;
          })}
          <BWAccordion title='Thông tin nhân viên'>
            <div className='bw_row '>
              <div className='bw_col_6 bw_inf_pro'>
                <BWImage src={selected?.user?.user_picture_url} />
                <b>{item[0].user_fullname}</b>
              </div>
              <div className='bw_col_6 bw_tex_left'>
                <b className='bw_ml_2'>
                  <span> {item[0].shift_name}</span>{' '}
                </b>
                <p>Giờ chấm công:{timeKeeping(item[0])}</p>
                <p>Cửa hàng:{item[0].store_name}</p>
              </div>
            </div>
          </BWAccordion>
          {/* <BWAccordion title='Lý do giải trình' id='bw_info_cus' isRequired={true}>
            <div className='bw_row'>
              <FormItem className='bw_col_12'>
                <FormTextArea
                  row={4}
                  type='text'
                  field='excuses'
                  placeholder='Lý do giải trình'
                  values={item[0].explanation}
                />
              </FormItem>
            </div>
          </BWAccordion> */}

          <TimeKeepingClaimInformation 
          timeKeeping={item[0].time_keeping} 
          userName={item[0].user_name}
          disabled={!isExplain}
          isLate={isLate}
          />
        </ModalAddStyled>
      </FormProvider>
    </Modal>
  );
};

export default ModalExcuses;
