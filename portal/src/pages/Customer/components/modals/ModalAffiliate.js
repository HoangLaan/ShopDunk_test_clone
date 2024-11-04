/* eslint-disable react/style-prop-object */
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSection from 'components/shared/FormSection/index';
import AddressSelectAccordion from 'components/shared/AddressSelectAccordion/index';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';

import { useCustomerContext } from 'pages/Customer/utils/context';
import FormAffiliateInformation from '../forms/FormAffiliateInformation';
import { GENDER, MODAL } from 'pages/Customer/utils/constants';
import { showToast } from 'utils/helpers';

const INIT_FORM = {
  is_active: 1,
  gender: GENDER.MALE,
};

const ModalAffiliate = ({ disabled }) => {
  const methods = useForm();
  const { reset } = methods;

  // console.log('ModalAffiliate', methods.getValues())

  const { openModalAffiliate } = useCustomerContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    reset(INIT_FORM);
  }, [reset]);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      // await createSupplier(payload);
      showToast.success('Thêm mới thành công');
      openModalAffiliate(false)
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin người giới thiệu',
      component: FormAffiliateInformation,
    },
    {
      title: 'Địa chỉ',
      component: AddressSelectAccordion,
    },
  ];

  return (
    <FormProvider {...methods}>
      <ModalPortal
        wrapperId={MODAL.AFFILIATE}
        title='Thêm mới người giới thiệu'
        width={800}
        onClose={() => openModalAffiliate(false)}
        onConfirm={methods.handleSubmit(onSubmit)}>
        <FormSection loading={loading} detailForm={detailForm} disabled={disabled} noSideBar={true} />
      </ModalPortal>
    </FormProvider>
  );
};

export default ModalAffiliate;
