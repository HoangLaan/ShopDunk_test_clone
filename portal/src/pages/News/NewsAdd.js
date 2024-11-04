import React, { useCallback, useMemo, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import NewsInformationTab from './components/Tab/NewsInformationTab';
import NewsRelatedTab from './components/Tab/NewsRelatedTab';
import Panel from 'components/shared/Panel/index';
import { showToast } from 'utils/helpers';
import { createNews, updateNews, getDetail } from './helpers/call-api';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { urlToList } from 'utils';
import { useAuth } from 'context/AuthProvider';
import { defaultValues } from '../../../src/pages/News/helpers/const';

const NewsAdd = (isEdit = true) => {
  const methods = useForm({ defaultValues: defaultValues });
  const { user: userEnt } = useAuth();
  //const methods = useForm();
  const { id: news_id } = useParams();
  let disabled = false;
  if (methods.watch('is_system') === 1 && userEnt?.user_name !== 'administrator' && news_id) {
    disabled = true;
  }
  console.log('is_can_edit:', methods.watch('is_can_edit'));
  const panel = [
    {
      key: 'NEWS',
      label: 'Thông tin bài viết',
      component: NewsInformationTab,
      disabled: !methods.watch('is_can_edit') ? true : !isEdit,
    },
    {
      key: 'NEWS_RELATED',
      label: 'Danh sách bài viết liên quan',
      component: NewsRelatedTab,
      disabled: !methods.watch('is_can_edit') ? true : !isEdit,
    },
  ];
  const history = useHistory();
  const { pathname } = useLocation();
  const isView = useMemo(() => pathname.includes('/detail') || pathname.includes('/view'), [pathname]);
  const isAdd = useMemo(() => pathname.includes('/add'), [pathname]);
  // const isEdit = useMemo(() => pathname.includes('/edit'), [pathname]);
  const path = urlToList(useLocation().pathname)[0];
  const goToPreviousPath = () => {
    history.push(`${path}`);
  };

  const goToEditPath = (e) => {
    e.preventDefault();
    history.push(`${path}/edit/${news_id}`);
  };

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;

      let label;
      // if (!disabled) {
      if (news_id) {
        await updateNews(news_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createNews(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công!!!`);
      // }
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  const loadDetail = useCallback(() => {
    if (news_id) {
      getDetail(news_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    }
  }, [news_id]);

  const buttonFooter = useMemo(() => {
    if (isView) {
      return (
        <button type='button' className='bw_btn_outline bw_btn_outline_success' onClick={goToEditPath}>
          Chỉnh sửa
        </button>
      );
    } else if (!disabled && (isAdd || isEdit)) {
      return (
        <button type='submit' className='bw_btn bw_btn_success'>
          <span className='fi fi-rr-check'></span>Hoàn tất {isEdit ? 'chỉnh sửa' : 'thêm mới'}
        </button>
      );
    } else {
      return '';
    }
  }, [isView, isEdit, isAdd]);

  const buttonClose = useMemo(() => {
    return (
      <button type='button' className='bw_btn_outline' onClick={goToPreviousPath}>
        Đóng
      </button>
    );
  }, []);

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className='bw_main_wrapp'>
          <Panel panes={panel} />
          <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
            {buttonFooter}
            {buttonClose}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default NewsAdd;
