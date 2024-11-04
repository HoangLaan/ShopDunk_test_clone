import React, { useCallback, useEffect, useState, Fragment } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSection from 'components/shared/FormSection';
import { createCustomer, getDetailCustomer, updateCustomer } from 'services/customer.service';
import CustomerInformation from 'pages/Customer/components/add/CustomerInformation';
import CustomerAdditional from 'pages/Customer/components/add/CustomerAdditional';
import CustomerStatus from 'pages/Customer/components/add/CustomerStatus';
import { showToast } from 'utils/helpers';
import { MODAL } from 'pages/Customer/utils/constants';
import FormAddressSelect from '../forms/FormAddressSelect';
import usePageInformation from 'hooks/usePageInformation';

const INIT_FORM_INFORMATION = {
  is_active: 1,
  is_system: 0,
  gender: 1,
  password: 'SDxinchao',
  // birth_day: '01/01/2000',
  province_id: 66 // Hà Nội
};

const Information = ({ setPhoneNumber }) => {
  const methods = useForm();
  const { disabled, id: account_id } = usePageInformation();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.fullNameCustomer = payload.full_name
      if (account_id) {
        await updateCustomer(account_id, payload);
        showToast.success(`Chỉnh sửa thành công`);
      } else {
        await createCustomer(payload);
        showToast.success(`Thêm mới thành công`);
        methods.reset(INIT_FORM_INFORMATION);
      }
    } catch (error) {
      showToast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDetailCustomer = useCallback(() => {
    if (account_id) {
      setLoading(true);
      getDetailCustomer(account_id).then((value) => {
        setPhoneNumber(value?.phone_number);
        methods.reset({ ...value });
        setLoading(false);
      });
    } else {
      methods.reset(INIT_FORM_INFORMATION);
    }
  }, [account_id]);

  useEffect(loadDetailCustomer, [loadDetailCustomer]);

  const detailForm = [
    {
      title: 'Thông tin khách hàng',
      id: 'information',
      component: CustomerInformation,
      fieldActive: ['phone_number', 'full_name', 'birth_day', 'gender', 'address'],
    },
    {
      id: 'customer_additional',
      title: 'Thông tin bổ sung',
      component: CustomerAdditional,
      fieldActive: ['id_card', 'id_card_date', 'id_card_place'],
    },
    {
      id: 'address',
      title: 'Địa chỉ',
      component: FormAddressSelect,
      fieldActive: ['country_id', 'province_id', 'district_id', 'ward_id', 'postal_code', 'address'],
    },
    { id: 'status', title: 'Trạng thái', component: CustomerStatus },
  ];

  return (
    <Fragment>
      <FormProvider {...methods}>
        <FormSection loading={loading} detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
      </FormProvider>
      <div id={MODAL.ADD_COMPANY}></div>
    </Fragment>
  );
};

export default Information;
