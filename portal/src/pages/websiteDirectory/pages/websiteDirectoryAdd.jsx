import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { cancelOrder, create, createOrderNo, read, update } from 'pages/websiteDirectory/helpers/call-api';
import { useAuth } from 'context/AuthProvider';
import { getErrorMessage, urlToList } from 'utils/index';
import { defaultValueAdd, orderType, paymentStatus } from 'pages/websiteDirectory/helpers/constans';
import { Modal, Button } from 'antd';
import { updateChangeStatus } from 'pages/websiteDirectory/helpers/call-api';
import BWButton from 'components/shared/BWButton/index';

import { showConfirmModal } from 'actions/global';
import { showToast } from 'utils/helpers';

import Information from 'pages/websiteDirectory/components/add/Information/Information';
import InformationEG from 'pages/websiteDirectory/components/add/Information/InformationEG';
import BWLoader from 'components/shared/BWLoader/index';
import Panel from 'components/shared/Panel/index';
//import { Popconfirm } from 'antd';

dayjs.extend(customParseFormat);

const WebsiteDirectoryA = ({ website_category_id = null, isEdit = true }) => {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const location = useLocation();

  const methods = useForm({
    defaultValues: {},
  });
  const {
    handleSubmit,
    reset,
    // formState: { errors },
  } = methods;
  const [loadingPage, setLoadingPage] = useState(false);

  const [tabLanguage, setTabLanguage] = useState('');

  const history = useHistory();
  const goToPreviousPath = () => {
    history.push(`/menu-website`);
  };

  useEffect(() => {
    // Tạo một đối tượng URLSearchParams từ chuỗi truy vấn
    const queryParams = new URLSearchParams(location.search);
    // Lấy giá trị của tham số 'tab_active'
    const tabActive = queryParams.get('tab_active');
    setTabLanguage(tabActive);
    // Bạn có thể sử dụng giá trị tabActive ở đây
  }, [location]); // Phụ thuộc vào đối tượng location để biết khi nào URL thay đổi

  const handleConfirmAppointment = () => {
    try {
      updateChangeStatus(website_category_id, {
        is_approved: 1,
      });
      showToast.success('Đồng ý duyệt thành công !');
    } catch {
      showToast.error('Đồng ý duyệt thất bại !');
    } finally {
      setIsConfirmModalVisible(false);
    }
  };

  const handleCancel = () => {
    try {
      updateChangeStatus(website_category_id, {
        is_approved: 0,
      });
      showToast.success('Từ chối duyệt thành công !');
    } catch (e) {
      showToast.error('Từ chối duyệt thất bại!');
    } finally {
      setIsConfirmModalVisible(false);
    }
  };
  const onSubmit = async (values) => {
    if (tabLanguage === 'eg') {
      console.log(tabLanguage);
      await create({
        ...values,
        website_category_code: values.website_category_code || '1',
        language_id: 2,
        website_category_name: values.website_category_name,
      })
        .then((res) => {
          if (res) {
            showToast.success('Thêm mới thành công.!');
            history.push(`/menu-website`);
          }
        })
        .catch((err) => {
          console.log('err', err);
          showToast.success('Thêm mới thất bại.!');
        })
        .finally(() => {
          setLoadingPage(false);
        });
      return;
    }
    if (!website_category_id) {
      // thêm mới
      setLoadingPage(true);

      await create({
        ...values,
        website_category_code: values.website_category_code || '1',
      })
        .then((res) => {
          if (res) {
            showToast.success('Thêm mới thành công.!');
            history.push(`/menu-website`);
          }
        })
        .catch((err) => {
          console.log('err', err);
          showToast.success('Thêm mới thất bại.!');
        })
        .finally(() => {
          setLoadingPage(false);
        });

      return;
    }
    console.log('website_category_id', website_category_id);
    await update(website_category_id, {
      ...values,
    })
      .then((res) => {
        if (res) {
          showToast.success('Sửa thành công.!');
          history.push(`/menu-website`);
        }
      })
      .catch((err) => {
        console.log('err', err);
        showToast.success('Sửa thất bại.!');
      })
      .finally(() => {
        setLoadingPage(false);
      });
  };

  const loadOrdersDetail = useCallback(() => {
    if (website_category_id) {
      setLoadingPage(true);

      read(website_category_id)
        .then((res) => {
          console.log(res);
          reset({
            ...res,
            promotion_offers: res?.promotion_apply?.reduce((acc, curr) => {
              return acc.concat(curr?.offers);
            }, []),
          });
        })
        .catch((error) => {
          showToast.error(
            getErrorMessage({
              message: error?.message || 'Đã xảy ra lỗi vui lòng kiểm tra lại.',
            }),
          );
        })
        .finally(() => {
          setLoadingPage(false);
        });
    }
  }, [website_category_id, reset]);

  useEffect(() => {
    loadOrdersDetail();
  }, [loadOrdersDetail]);

  const panel = [
    {
      key: 'VN',
      label: 'Tiếng việt',
      component: Information,
      disabled: !isEdit,
      website_category_id: website_category_id,
      loading: loadingPage,
      // userSchedule: userSchedule,
      onSubmit: onSubmit,
    },
    {
      key: 'EG',
      label: 'Tiếng anh',
      component: InformationEG,
      disabled: false,
      website_category_id: website_category_id,
      loading: loadingPage,
      // userSchedule: userSchedule,
      onSubmit: onSubmit,
    },
  ];

  const handleSave = async (_type, e) => {
    handleSubmit(onSubmit)(e);
  };

  return (
    <FormProvider {...methods}>
      <div className='bw_main_wrapp'>
        <Panel panes={panel} loading={true} />

        <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
          {/* <button type='submit' style={{ marginRight: 0 }} className='bw_btn bw_btn_primary'>
            Hoàn tất thêm mới
          </button> */}
          {/* <button type='submit' style={{ marginRight: 0 }} className='bw_btn bw_btn_success'>
            <span className='fi fi-rr-check'></span>
            {Boolean(website_category_id) ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới'}
          </button> */}
          <button
            type='button'
            style={{ marginRight: 0 }}
            className='bw_btn bw_btn_success'
            onClick={(e) => handleSave('save', e)}>
            <span className='fi fi-rr-check'></span>
            {Boolean(website_category_id) ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới'}
          </button>

          <button type='button' className='bw_btn_outline' onClick={goToPreviousPath}>
            Đóng
          </button>
        </div>
      </div>
      <Modal
        title='
        Duyệt đánh giá'
        class='ttt-popup'
        visible={isConfirmModalVisible} // Replace this line
        open={isConfirmModalVisible}
        onCancel={() => setIsConfirmModalVisible(false)}
        footer={[
          <Button key='cancel' onClick={handleCancel}>
            Từ chối
          </Button>,
          <Button key='confirm' type='primary' onClick={handleConfirmAppointment}>
            Xác nhận
          </Button>,
        ]}>
        Bạn có đồng ý duyệt đánh giá này không?
      </Modal>
    </FormProvider>
  );
};

export default WebsiteDirectoryA;
