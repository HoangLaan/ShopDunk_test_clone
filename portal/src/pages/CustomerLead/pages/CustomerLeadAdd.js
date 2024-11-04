import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSection from 'components/shared/FormSection/index';
import { STATUS_TYPES } from 'utils/constants';
import { showToast } from 'utils/helpers';
import CustomerLeadService from 'services/customer-lead.service';
import ICON_COMMON from 'utils/icons.common';

import CustomerLeadInformation from '../components/Sections/CustomerLeadInformation';
import FormStatusActive from '../components/Sections/FormStatusActive';
import { GENDER, MODAL, PERMISSION } from '../utils/constants';
import CustomerLeadAdditional from '../components/Sections/CustomerLeadAdditional';
import PageProvider from '../components/PageProvider/PageProvider';
import FormAddressSelect from '../components/Sections/FormAddressSelect';
import usePageInformation from 'hooks/usePageInformation';
import FormStatus from 'components/shared/FormCommon/FormStatus';

function CustomerLeadAdd() {
  const methods = useForm();
  const { reset, handleSubmit } = methods;
  const { id: data_leads_id, disabled } = usePageInformation()

  const [isReady, setIsReady] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const initData = async () => {
    try {
      if (data_leads_id) {
        const data = await CustomerLeadService.detail(data_leads_id);
        reset(data);
      } else {
        reset({
          is_active: STATUS_TYPES.ACTIVE,
          gender: GENDER.MALE,
          password: 'SDxinchao',
          province_id: 66 // Hà Nội
        });
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const onSubmit = async (payload) => {
    payload.full_name_customer = payload.full_name
    if (payload.phone_number == payload.phone_number_secondary) {
      methods.setError('phone_number_secondary', {
        type: 'manual',
        message: 'Số điện thoại phụ không được trùng với số điện thoại chính'
      })
      return;
    }
    try {
      setLoadingSubmit(true);
      if (data_leads_id) {
        await CustomerLeadService.update(data_leads_id, payload);
        showToast.success('Chỉnh sửa thành công');
      } else {
        await CustomerLeadService.create(payload);
        showToast.success('Thêm mới thành công');
        await initData();
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin khách hàng',
      component: CustomerLeadInformation,
      data_leads_id,
      fieldActive: [
        'data_leads_code',
        'gender',
        'customer_type_id',
        'source_id',
        'presenter_id',
        'full_name',
        'birthday',
        'email',
        'phone_number',
        'zalo_id',
        'facebook_id',
      ],
    },
    {
      id: 'address',
      title: 'Địa chỉ',
      component: FormAddressSelect,
      fieldActive: ['country_id', 'province_id', 'district_id', 'ward_id', 'postal_code', 'address'],
    },
    {
      title: 'Thông tin bổ sung',
      component: CustomerLeadAdditional,
      fieldActive: ['id_card', 'id_card_date', 'id_card_place', 'career_id'],
    },
    {
      title: 'Trạng thái',
      component: FormStatus,
      fieldActive: ['is_active'],
    },
  ];

  const actions = [
    {
      globalAction: true,
      icon: ICON_COMMON.save,
      permission: PERMISSION.EDIT,
      type: 'success',
      submit: true,
      content: disabled ? 'Chỉnh sửa' : data_leads_id ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới',
      onClick: () => {
        if (disabled) window._$g.rdr('/customer-lead/edit/' + data_leads_id);
        else handleSubmit(onSubmit);
      },
    },
  ];

  return (
    <PageProvider>
      <FormProvider {...methods}>
        {isReady && (
          <FormSection
            loading={loadingSubmit}
            detailForm={detailForm}
            onSubmit={onSubmit}
            disabled={disabled}
            actions={actions}
          />
        )}
      </FormProvider>

      <div id={MODAL.ADD_COMPANY}></div>
      <div id={MODAL.RESET_PASSWORD}></div>
      <div id={MODAL.AFFILIATE}></div>
    </PageProvider>
  );
}

export default CustomerLeadAdd;
