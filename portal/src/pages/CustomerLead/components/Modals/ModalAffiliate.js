/* eslint-disable react/style-prop-object */
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSection from 'components/shared/FormSection/index';
import AddressSelectAccordion from 'components/shared/AddressSelectAccordion/index';

import { useCustomerLeadContext } from 'pages/CustomerLead/utils/context';
import ModalAffiliateInformation from '../Sections/ModalAffiliateInformation';
import { GENDER, MODAL } from 'pages/CustomerLead/utils/constants';
import ModalPortal from './ModalPortal';
import { showToast } from 'utils/helpers';

const INIT_FORM = {
  is_active: 1,
  gender: GENDER.MALE,
};

const ModalAffiliate = ({ disabled }) => {
  const methods = useForm();
  const { reset } = methods;

  const { onOpenModalAffiliate } = useCustomerLeadContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    reset(INIT_FORM);
  }, [reset]);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      // await createSupplier(payload);
      showToast.success('Thêm mới thành công');
      onOpenModalAffiliate(false)
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin người giới thiệu',
      component: ModalAffiliateInformation,
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
        onClose={() => onOpenModalAffiliate(false)}
        onConfirm={methods.handleSubmit(onSubmit)}>
        <FormSection loading={loading} detailForm={detailForm} disabled={disabled} noSideBar={true} />
      </ModalPortal>
    </FormProvider>
  );
};

export default ModalAffiliate;
