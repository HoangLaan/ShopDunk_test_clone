import React, {useCallback, useEffect, useMemo} from 'react';
import { useLocation } from 'react-router-dom';
import LockshiftCommonInfo from 'pages/LockShiftOpen/components/LockshiftCommonInfo';
import InfomationTab from '../tabs/Infomation';
import ProductListTab from '../tabs/ProductList';
import Panel from 'components/shared/Panel/index';
import {FormProvider, useForm} from "react-hook-form";
import {createOrUpdateLockShift} from "services/lockshift-open.service";
import {showToast} from "utils/helpers";
import { LockShiftOpenProvider } from "../context/LockShiftOpenContext"
import { getHasPermission,getIsAllowOpenShift } from "services/lockshift-open.service"
const AddLockShiftPage = ({id = null, disable = false  }) => {
  const methods = useForm();
  const {getValues,setValue, reset} = methods
  const initForm = useCallback(async () => {
    reset({lock_shift_id: id});
  }, []);

  useEffect(() => {
    initForm()
  }, [initForm]);
  const { pathname } = useLocation();
  const isAdd = useMemo(() => pathname.toLowerCase().includes('/add'), [pathname]);

  useEffect(() => {
    (async () => {
      try {
          const res1 = await getHasPermission();
          const res2 =await getIsAllowOpenShift();
        if(!isAdd){
          return
        }
        if (!Boolean(res1?.isTrue)) {
          showToast.warning('Bạn không có quyền truy cập trang này.');
          window._$g.rdr(`/lockshift-open`);
          return;
        }
        if (!Boolean(res2?.isAllow)) {
          showToast.warning('Bạn không có ca ngày hôm nay.');
          window._$g.rdr(`/lockshift-open`);
          return;
        }  
      } catch (error) {
        console.error('Error:', error);
      }
    })()    
  }, []);
  

  const onSubmit = (data) => {
    try {
      createOrUpdateLockShift(data)
        .then((res) => {
          if(res.lockShiftId)
            setValue("lock_shift_id",res.lockShiftId)
          showToast.success("Cập nhật thông tin ca thành công")
        })
    } catch (error) {
      showToast.error("Cập nhật thông tin ca thất bại")
    }
  };
  const panel = [
    {
      key: 'information',
      label: 'Thông tin chung',
      component: InfomationTab,
      disabled: disable,
      lockShiftId:id,
      onSubmit: onSubmit
    },
    {
      key: 'products',
      label: 'Danh sách hàng hóa',
      component: ProductListTab,
      disabled: disable,
      lockShiftId:id,
      onSubmit: onSubmit
    },
  ];


  return (
    <div className='bw_main_wrapp'>
      <LockShiftOpenProvider>
      <FormProvider {...methods} >
        <LockshiftCommonInfo lockShiftId={id}/>
        <Panel panes={panel}/>
      </FormProvider>
      </LockShiftOpenProvider>
    </div>
  );
};

export default AddLockShiftPage;
