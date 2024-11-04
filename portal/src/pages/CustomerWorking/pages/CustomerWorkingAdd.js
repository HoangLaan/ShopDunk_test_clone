import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSection from 'components/shared/FormSection/index';
import { STATUS_TYPES } from 'utils/constants';
import { showToast } from 'utils/helpers';
import CustomerWorkingService from 'services/customer-working.service';
import ICON_COMMON from 'utils/icons.common';

import CustomerWorkingInformation from '../components/Sections/CustomerWorkingInformation';
import FormStatusActive from '../components/Sections/FormStatusActive';
import { GENDER, PERMISSION } from '../utils/constants';
import CustomerWorkingProduct from '../components/Sections/CustomerWorkingProduct';
import CustomerWorkingStore from '../components/Sections/CustomerWorkingStore';
import PageProvider from '../components/PageProvider/PageProvider';

function CustomerWorkingAdd({ customer_working_id = null, disabled = false }) {
  const methods = useForm();
  const { reset, handleSubmit } = methods;

  const [isReady, setIsReady] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const initData = async () => {
    try {
      if (customer_working_id) {
        const data = await CustomerWorkingService.detail(customer_working_id);
        reset(data);
      } else {
        let dataStore = {};
         dataStore = await CustomerWorkingService.getStoreByUser();
        reset({
          is_active: STATUS_TYPES.ACTIVE,
          gender: GENDER.MALE,
          store_id: dataStore?.store_id ?? null,
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
    // eslint-disable-next-line
  }, []);

  const onSubmit = async (payload) => {
    try {
      setLoadingSubmit(true);
      if (customer_working_id) {
        await CustomerWorkingService.update(customer_working_id, payload);
        showToast.success('Chỉnh sửa thành công');
      } else {
        await CustomerWorkingService.create(payload);
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
      component: CustomerWorkingInformation,
      customer_working_id,
      fieldActive: [
        'gender',
        'full_name',
        'phone_number',
      ],
    },
    {
      title: 'Thông tin cửa hàng',
      component: CustomerWorkingStore,
      fieldActive: ['store'],
    },
    {
      title: 'Sản phẩm',
      component: CustomerWorkingProduct,
      fieldActive: ['products'],
    },
    {
      title: 'Trạng thái',
      component: FormStatusActive,
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
      content: disabled ? 'Chỉnh sửa' : customer_working_id ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới',
      onClick: () => {
        if (disabled) window._$g.rdr('/customer-working/edit/' + customer_working_id);
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
    </PageProvider>
  );
}

export default CustomerWorkingAdd;
