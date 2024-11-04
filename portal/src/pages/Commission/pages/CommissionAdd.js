/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSection from 'components/shared/FormSection/index';

import { createCommission, getCommissionDetail, stopCommission, updateCommission } from 'services/commission.service';

import { StyledCommission } from 'pages/Commission/helpers/styles';
import { CommissionProvider } from 'pages/Commission/helpers/context';
import { toastSuccess, toastError } from 'pages/Commission/helpers/utils';
import { DIVIDE_BY, INIT_COMMISSION } from 'pages/Commission/helpers/constants';
import { validateCommissionValues } from 'pages/Commission/helpers/formRules';

import CommissionTypeApply from 'pages/Commission/components/Sections/CommissionTypeApply';
import CommissionInformation from 'pages/Commission/components/Sections/CommissionInformation';
import CommissionDepartment from 'pages/Commission/components/Sections/CommissionDepartment';
import CommissionStatus from 'pages/Commission/components/Sections/CommissionStatus';
import CommissionReview from 'pages/Commission/components/Sections/CommissionReview';
import CommissionMore from 'pages/Commission/components/Sections/ComissionMore';
import ModalStop from 'pages/Commission/components/Modals/ModalStop';

function CommissionAdd({ commissionId = null, disabled = false }) {
  const methods = useForm();
  const { watch, reset, handleSubmit } = methods;
  const watchAutoRenew = watch('is_auto_renew');

  // console.log('~ CommissionAdd errors >>>', methods.formState.errors);
  // console.log('~ CommissionAdd values >>>', methods.getValues());

  const [isShowModalStop, setIsShowModalStop] = useState(false);

  const getData = useCallback(() => {
    try {
      if (commissionId) {
        getCommissionDetail(commissionId).then((data) => reset(data));
      } else {
        reset(INIT_COMMISSION);
      }
    } catch (error) {
      toastError(window._$g._(error.message));
    }
  }, [reset, commissionId]);

  useEffect(getData, [getData]);

  const onSubmit = async (values) => {
    try {
      let dataSubmit = { ...values };
      dataSubmit.commission_name = dataSubmit.commission_name?.trim()
      if(dataSubmit.commission_name?.length === 0) {
        toastError("Tên chương trình không được để trống");
         return
      }
      dataSubmit.positions = (values.position_list || []).map((item) => ({
        ...item,
        commission_value: item.commission_value ? Number(item.commission_value) : null,
      }));
      dataSubmit.departments = values.departments || [];
      dataSubmit.is_auto_renew = values.is_auto_renew ? 1 : 0;
      delete dataSubmit.position_list;

      // Kiểm tra giá trị hoa hồng nhập: nhóm lỗi, phòng ban, vị trí
      validateCommissionValues(dataSubmit);

      dataSubmit = {
        ...dataSubmit,
        is_divide_to_position: parseInt(values.is_divide_to_position) === 1 ? 1 : 0,
        is_divide_by_department: parseInt(values.is_divide) === DIVIDE_BY.BY_DEPARTMENT ? 1 : 0,
        is_divide_by_shift: parseInt(values.is_divide) === DIVIDE_BY.BY_SHIFT ? 1 : 0,
        is_divide_to_sale_employee: parseInt(values.is_divide) === DIVIDE_BY.TO_SALE_EMPLOYEE ? 1 : 0,
        is_active: values.is_active ? 1 : 0,
        stores: values.stores || [],
      };

      // Miền áp dụng chưa chọn cửa hàng
      for (let i = 0; i < dataSubmit.business_apply.length; i++) {
        const businessItem = dataSubmit.business_apply[i];
        const index = dataSubmit.stores.findIndex((item) => parseInt(item.business_id) === parseInt(businessItem.id));
        if (index === -1) {
          dataSubmit.stores.push({
            business_id: businessItem.id,
            store_id: null,
          });
        }
      }

      if (commissionId) {
        await updateCommission(commissionId, dataSubmit);
        toastSuccess('Chỉnh sửa thành công');
      } else {
        await createCommission(dataSubmit);
        toastSuccess('Thêm mới thành công');
        reset(INIT_COMMISSION);
      }
    } catch (error) {
      toastError(error?.message);
    }
  };

  const onSubmitStop = async () => {
    const { stopped_reason, is_stopped } = methods.getValues();
    try {
      const dataSubmit = {
        stopped_reason,
        is_stopped,
      };
      await stopCommission(commissionId, dataSubmit);
      toastSuccess('Dừng chương trình hoa hồng thành công');
    } catch (error) {
      toastError(error.message);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin chương trình',
      id: 'bw_info',
      component: CommissionInformation,
      fieldActive: ['commission_name', 'start_date', 'end_date', 'company_id', 'business_apply', 'stores'],
    },
    {
      title: 'Loại hoa hồng áp dụng',
      id: 'bw_type_apply',
      component: CommissionTypeApply,
      fieldActive: ['commission_type_id', 'type_value', 'commission_value', 'order_types'],
    },
    {
      title: 'Phòng ban áp dụng',
      id: 'bw_department',
      component: CommissionDepartment,
      fieldActive: ['is_divide', 'departments'],
    },
    {
      title: 'Thông tin áp dụng',
      id: 'bw_more',
      component: CommissionMore,
      fieldActive: watchAutoRenew ? ['renew_day_in_month'] : undefined,
    },
    {
      title: 'Thông tin duyệt',
      id: 'bw_review',
      component: CommissionReview,
      commissionId,
      fieldActive: ['reviewed_user_department', 'reviewed_user', 'reviewed_note'],
    },
    {
      title: 'Trạng thái',
      id: 'bw_status',
      component: CommissionStatus,
      isRequired: ['is_active'],
    },
  ];

  const actions = [
    {
      globalAction: true,
      icon: 'fa fa-stop',
      type: 'warning',
      outline: false,
      content: 'Dừng chương trình',
      hidden: disabled || !commissionId,
      onClick: () => {
        setIsShowModalStop(true);
      },
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-check',
      type: 'success',
      submit: true,
      content: disabled ? 'Chỉnh sửa' : commissionId ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới',
      onClick: () => {
        if (disabled) window._$g.rdr('/commission/edit/' + commissionId);
        else handleSubmit(onSubmit);
      },
    },
  ];

  return (
    <StyledCommission>
      <CommissionProvider>
        <FormProvider {...methods}>
          <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} actions={actions} />
          <ModalStop
            onClose={() => setIsShowModalStop(false)}
            onSubmit={() => {
              setIsShowModalStop(false);
              onSubmitStop();
            }}
            isShow={isShowModalStop}
          />
        </FormProvider>
        <div id='bw_modal_commission_error_group'></div>
        <div id='bw_modal_commission_department'></div>
        <div id='bw_modal_commission_store'></div>
      </CommissionProvider>
    </StyledCommission>
  );
}

export default CommissionAdd;
