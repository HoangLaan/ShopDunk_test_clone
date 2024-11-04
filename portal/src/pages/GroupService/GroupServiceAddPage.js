import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useHistory , useLocation, useParams } from 'react-router-dom';
import Panel from 'components/shared/Panel/index';
import GroupServiceParentInfoVn from './Components/tabVnComponents/GroupServiceParentInfoVn';
import GroupServiceParentInfoEn from './Components/tabEnComponents/GroupServiceParentInfoEn';

// Services
import { createGroupService, getGroupServiceById, updateGroupService } from './helpers/call-api';

const GroupServiceAddPage = () => {
  const methods = useForm();
  
  const {
    handleSubmit,
  } = methods;

  const { pathname } = useLocation();
  const { group_service_code } = useParams();
  const disabled = useMemo(() => pathname.includes('/view') || pathname.includes('/detail'), [pathname]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;
      //en
      let label;
      if (group_service_code) {
        await updateGroupService(group_service_code, { ...payload });
        label = 'Chỉnh sửa';
      } else {
        await createGroupService(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }



      console.log(payload,'payload')
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
      setLoading(false);
       //window.location.reload();
    } catch (error) {
      setLoading(false);
      let { message } = error;
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
  const loadDetailGroupService = useCallback(() => {
    if (group_service_code) {
      getGroupServiceById(group_service_code).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset();
    }
  }, [group_service_code, methods]);

  useEffect(loadDetailGroupService, [loadDetailGroupService]);

  const panels = [
    {
      key: 'VietNamese',
      label: 'Tiếng Việt',
      noActions: true,
      component: GroupServiceParentInfoVn,
      disabled: disabled,
      loading: loading,
      onSubmit: onSubmit,
      language_id: 1
    },
    {
      key: 'English',
      label: 'Tiếng Anh',
      component: GroupServiceParentInfoEn,
      disabled: disabled,
      loading: loading,
      onSubmit: onSubmit,
      language_id: 2
    },
  ];

  useEffect(loadDetailGroupService, [loadDetailGroupService]);
  const handleSave = async (_type, e) => {
    handleSubmit(onSubmit)(e);
  };

  const history = useHistory();
  const goToPreviousPath = () => {
    history.push(`/group-service`);
  };

  return (
    // <FormProvider {...methods}>
    //   <div className='bw_main_wrapp'>
    //     <Panel panes={panels} onSubmit={onSubmit} hasSubmit />
    //   </div>
    // </FormProvider>

    <FormProvider {...methods}>
    <div className='bw_main_wrapp'>
      <Panel panes={panels} loading={true} />

      <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
        <button
          type='button'
          style={{ marginRight: 0 }}
          className='bw_btn bw_btn_success'
          onClick={(e) => handleSave('save', e)}>
          <span className='fi fi-rr-check'></span>
          {Boolean(group_service_code) ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới'}
        </button>

        <button type='button' className='bw_btn_outline' onClick={goToPreviousPath}>
          Đóng
        </button>
      </div>
    </div>
   
    </FormProvider>
  );
};

export default GroupServiceAddPage;
