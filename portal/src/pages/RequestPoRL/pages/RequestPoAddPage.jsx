import React, { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { notification } from 'antd';
import { update, create, read } from '../helpers/call-api';
import { useLocation } from 'react-router';
//compnents

import { showToast } from 'utils/helpers';
import { defaultValues } from '../helpers/const';
import RequestPoStatus from '../components/add/RequestPoStatus';
import FormSection from 'components/shared/FormSection/index';
import RequestPoRLInfor from '../components/add/RequestPoRLInfor';
import { useParams } from 'react-router-dom';

const RequestPoAddPage = () => {
  const { id } = useParams();
  const methods = useForm({ defaultValues: defaultValues });
  const { pathname } = useLocation();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const { register, reset } = methods;

  const getInitData = useCallback(() => {
    const getData = async () => {
      try {
        if (id) {
          const requestPoRl = await read(id);
          reset(requestPoRl);
        }
      } catch (error) {
        notification.error({
          message: 'Đã xảy ra lỗi vui lòng thử lại',
        });
      }
    };
    getData();
  }, []);

  useEffect(getInitData, [getInitData]);

  useEffect(() => {
    register('is_active');
  }, [register]);

  const onSubmit = async (values) => {
    values.departments = values.departments.map((o) => o?.value ?? o);
    values.positions = values.positions.map((o) => o?.value ?? o);
    let formData = { ...values };
    try {
      formData.positions = formData.positions.map((o) => {
        return {
          position_id: o,
          is_apply_all_department: values?.is_apply_all_department,
          is_apply_all_position: values?.is_apply_all_position,
          departments: values.departments,
        };
      });

      if (id) {
        await update(id, formData);
        showToast.success('Cập nhật mức duyệt mua hàng thành công');
      } else {
        await create(formData);
        showToast.success('Thêm mới mức duyệt mua hàng thành công');
        reset(defaultValues);
      }
    } catch (error) {
      let { message } = error;
      showToast.error({
        message: message ? message : 'Lỗi thêm mới mức duyệt.',
      });
    }
  };

  const detailForm = [
    {
      id: 'information',
      title: 'Thông tin chính',
      component: RequestPoRLInfor,
      fieldActive: ['review_level_name']
    },
    {
      id: 'status',
      title: 'Trạng thái',
      component: RequestPoStatus,
      fieldActive: ['is_active'],
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection
        detailForm={detailForm}
        onSubmit={onSubmit}
        disabled={disabled}
        //disabled={!methods.watch('is_can_edit') ? true : !isEdit}
      />
    </FormProvider>
  );
};

export default RequestPoAddPage;
