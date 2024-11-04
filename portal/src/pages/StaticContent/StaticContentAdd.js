import React, { useCallback, useMemo, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import NewsInformationTab from './components/Tab/NewsInformationTab';
import NewsInformationTabENG from './components/Tab/NewsInformationTabENG';
import NewsRelatedTab from './components/Tab/NewsRelatedTab';
import Panel from 'components/shared/Panel/index';
import { showToast } from 'utils/helpers';
import { createNews, updateNews, getDetail } from './helpers/call-api';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { urlToList } from 'utils';
import { useAuth } from 'context/AuthProvider';
import { defaultValues } from '../News/helpers/const';

const NewsAdd = (isEdit = true) => {
  const methods = useForm({ defaultValues: defaultValues });
  const { user: userEnt } = useAuth();

  const {
    handleSubmit,
  } = methods;
  
  //const methods = useForm();
  const { id: static_code } = useParams();
  let disabled = false;
  if (methods.watch('is_system') === 1 && userEnt?.user_name !== 'administrator' && static_code) {
    disabled = true;
  }
  //console.log('is_can_edit:', methods.watch('is_can_edit'));
  const panel = [
    {
      key: 'VIE',
      label: 'Tiếng việt',
      component: NewsInformationTab,
      language_id: 1
    },
    {
      key: 'ENG',
      label: 'Tiếng anh',
      component: NewsInformationTabENG,
      language_id: 2
    },
  ];
  const history = useHistory();
  const { pathname } = useLocation();
  const isView = useMemo(() => pathname.includes('/detail') || pathname.includes('/view'), [pathname]);
  const isAdd = useMemo(() => pathname.includes('/add'), [pathname]);
  const path = urlToList(useLocation().pathname)[0];

  const goToPreviousPath = () => {
    history.push(`/list-staticcontent`);
  };


  const goToEditPath = (e) => {
    e.preventDefault();
    history.push(`${path}/edit/${static_code}`);
  };

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;

      let label;
      // if (!disabled) {
      if (static_code) {
        await updateNews(static_code, payload);
        label = 'Chỉnh sửa';
      } else {
        await createNews(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
      window._$g.rdr(`/list-staticcontent`);
      // }
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  const loadDetail = useCallback(() => {
    if (static_code) {
      getDetail(static_code).then((value) => {
        methods.reset({
          ...value,
        });
      });
    }
  }, [static_code]);
  useEffect(loadDetail, [loadDetail]);

  // const buttonFooter = useMemo(() => {
  //   if (isView) {
  //     return (
  //       <button type='button' className='bw_btn_outline bw_btn_outline_success' onClick={goToEditPath}>
  //         Chỉnh sửa
  //       </button>
  //     );
  //   } else if (!disabled && (isAdd || isEdit)) {
  //     return (
  //       <button type='submit' className='bw_btn bw_btn_success'>
  //         <span className='fi fi-rr-check'></span>Hoàn tất {isAdd ? 'thêm mới' : 'chỉnh sửa'}
  //       </button>
  //     );
  //   } else {
  //     return '';
  //   }
  // }, [isView, isEdit, isAdd]);

  // const buttonClose = useMemo(() => {
  //   return (
  //     <button type='button' className='bw_btn_outline' onClick={goToPreviousPath}>
  //       Đóng
  //     </button>
  //   );
  // }, []);

  const handleSave = async (_type, e) => {
    handleSubmit(onSubmit)(e);
  };



  useEffect(loadDetail, [loadDetail]);

  return (
    // <FormProvider {...methods}>
    //   <form onSubmit={methods.handleSubmit(onSubmit)}>
    //     <div className='bw_main_wrapp'>
    //       <Panel panes={panel} />
    //       <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
    //         {buttonFooter}
    //         {buttonClose}
    //       </div>
    //     </div>
    //   </form>
    // </FormProvider>

    <FormProvider {...methods}>
    <div className='bw_main_wrapp'>
      <Panel panes={panel} loading={true} />

      <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
        <button
          type='button'
          style={{ marginRight: 0 }}
          className='bw_btn bw_btn_success'
          onClick={(e) => handleSave('save', e)}>
          <span className='fi fi-rr-check'></span>
          {Boolean(static_code) ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới'}
        </button>

        <button type='button' className='bw_btn_outline' onClick={goToPreviousPath}>
          Đóng
        </button>
      </div>
    </div>

    </FormProvider>
  );
};

export default NewsAdd;
