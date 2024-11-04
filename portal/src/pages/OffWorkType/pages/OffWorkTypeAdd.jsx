import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, notification } from 'antd';
import { update, create, getOffworkRLOptions, getUserReview, read } from '../helpers/call-api';

//compnents
import { getOptionsCompany } from 'services/company.service';
import { mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';
import { defaultValues } from '../helpers/const';
import OffWorkTypeinfor from '../components/add/OffWorkTypeinfor';
import FormSection from 'components/shared/FormSection/index';
import OffWorkTypeReview from '../components/add/OffWorkTypeReview';
import OffWorkTypeStatus from '../components/add/OffWorkTypeStatus';

const OffWorkTypeAdd = ({ offworkTypeId = null, isEdit = true }) => {
  const methods = useForm({ defaultValues: defaultValues });
  const [companyOpts, setCompanyOpts] = useState([]);

  const {
    register,
    reset,

    formState: { errors },
  } = methods;

  const [alerts, setAlerts] = useState([]);

  const getInitData = useCallback(async () => {
    let _companyOpts = await getOptionsCompany();
    setCompanyOpts(mapDataOptions4SelectCustom(_companyOpts));

    // Kiểm xem nếu chỉ có 1 công ty mặc định chọn 1
    if (_companyOpts && _companyOpts.length == 1) {
      methods.setValue('company_id', +_companyOpts[0].id);
    }

    if (offworkTypeId) {
      const offworkType = await read(offworkTypeId);

      reset({ ...offworkType });
    }
  }, []);

  useEffect(() => {
    getInitData();
  }, [getInitData]);

  useEffect(() => {
    register('is_active');
    register('is_sub_time_off');
    register('values_off');
  }, [register]);

  const onSubmit = async (values) => {
    let formData = { ...values };

    try {
      if (offworkTypeId) {
        await update(offworkTypeId, { ...formData });
        notification.success({
          message: 'Cập nhật loại nghỉ phép thành công',
        });
      } else {
        await create({ ...formData });
        notification.success({
          message: 'Thêm mới loại nghỉ phép thành công',
        });
        reset({ is_active: 1 });
        setAlerts([]);
      }
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`${statusText || message}`].concat(errors || []).join('<br/>');
      setAlerts([{ type: 'error', msg }]);
    }
  };

  const detailForm = [
    {
      id: 'information',
      title: 'Thông tin chính',
      component: OffWorkTypeinfor,
      fieldActive: ['off_work_name', 'before_day', 'company_id', 'is_sub_time_off'],
      companyOpts: companyOpts,
    },
    {
      id: '',
      title: 'Mức duyệt phép',
      component: OffWorkTypeReview,
      fieldActive: ['offwork_type_review_list'],
    },

    {
      id: 'status',
      title: 'Trạng thái',
      component: OffWorkTypeStatus,
      fieldActive: ['is_active'],
    },
  ];

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={!isEdit} />
      </FormProvider>
    </React.Fragment>
  );
};

export default OffWorkTypeAdd;
