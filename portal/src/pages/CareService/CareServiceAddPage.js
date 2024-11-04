import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useLocation, useParams } from 'react-router-dom';
import Panel from 'components/shared/Panel/index';
import { createCareService, getCareServiceById, updateCareService } from './helpers/call-api';
import CareServiceParentInfo from './Components/CareServiceParentInfo';
import CareServiceParentInfoENG from './Components/CareServiceParentInfoENG';


const CareServiceAddPage = (loading) => {
  const { care_service_code } = useParams();
  const methods = useForm();

  const { pathname } = useLocation();
  const disabled = useMemo(() => pathname.includes('/view') || pathname.includes('/detail'), [pathname]);
  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.is_apply_work_day = payload.is_apply_work_day ? 1 : 0;
      payload.CareService_name = payload.CareService_name;
      payload.start_date = payload.start_date?.value;
      payload.end_date = payload.end_date?.value;

      let label;
      if (care_service_code) {
        console.log('Data before update:', payload);
        await updateCareService(care_service_code, { ...payload });
        //await updateCareService(care_service_code, { ...payload, care_service_code: `${care_service_code}` });
        label = 'Chỉnh sửa';
      } else {
        await createCareService(payload);
        label = 'Thêm mới';
        methods.reset({
        });
      }
      showToast.success(`${label} thành công!!!`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        // progress: true,
        theme: 'colored',
        progress: undefined,
      });
    } catch (error) {
      let { errors = {} } = error;
      let { message = 'Có lỗi xảy ra!' } = errors;
      showToast.error(`${message}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        // progress: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  const loadDetailCareService = useCallback(() => {
    if (care_service_code) {
      getCareServiceById(care_service_code).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset();
    }
  }, [care_service_code, methods]);
  useEffect(loadDetailCareService, [loadDetailCareService]);

  // const loadDetailCareService = useCallback(() => {
  //   if (care_service_code) {
  //     getCareServiceById(care_service_code)
  //       .then((value) => {
  //         console.log('Fetched data:', value); // Log fetched data
  //         // Set the fetched data into the form fields using methods.reset()
  //         methods.reset(value);
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching data:', error); // Log any errors
  //       });
  //   } else {
  //     // If care_service_code is not available, reset the form with default values
  //     methods.reset({
  //       // is_active: 1, // Default values for example
  //     });
  //   }
  // }, [care_service_code, methods]);

  // Trigger the loadDetailCareService function when the component mounts




  // console.log('care_service_code',care_service_code)

  // //useEffect(loadDetailCareService);
  // useEffect(loadDetailCareService, [loadDetailCareService]);
  useEffect(loadDetailCareService, [loadDetailCareService]);

  const panels = [
    {
      key: 'VietNamese',
      label: 'Tiếng Việt',
      noActions: true,
      component: CareServiceParentInfo,
      disabled: disabled,
      language_id: 1
      // loading: loading,
    },
    {
      key: 'English',
      label: 'Tiếng Anh',
      component: CareServiceParentInfoENG,
      disabled: disabled,
      language_id: 2
      // loading: loading,
    },
  ];

  return (
    <FormProvider {...methods}>
      <div className='bw_main_wrapp'>
        <Panel panes={panels} onSubmit={onSubmit} hasSubmit />
      </div>
    </FormProvider>
  );
};

export default CareServiceAddPage;
