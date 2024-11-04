import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { showToast } from 'utils/helpers';
import { getDetailHobbiesRelatives, updateCustomerHobbiesRelatives } from 'services/customer.service';
import FormSection from 'components/shared/FormSection';
import TableHobbies from '../tables/TableHobbies';
import TableRelatives from '../tables/TableRelatives';
import _ from 'lodash';
import { useCustomerContext } from 'pages/Customer/utils/context';
import { usePageInformation } from 'pages/Customer/utils/hooks';

function HobbiesRelatives() {
  const methods = useForm();
  const { setCustomerState } = useCustomerContext();
  const { account_id } = useParams();
  const { disabled } = usePageInformation()

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCustomerState((prev) => ({ ...prev, hobbiesRelativesMethods: methods }));
  }, []);

  const loadHobbiesRelatives = useCallback(() => {
    if (account_id) {
      setLoading(true);
      getDetailHobbiesRelatives(account_id)
        .then((value) => methods.reset({ ...value }))
        .finally(() => setLoading(false));
    }
  }, [account_id]);

  useEffect(loadHobbiesRelatives, [loadHobbiesRelatives]);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.customer_hobbies = (payload.customer_hobbies || []).map((item) => item.hobbies_id);
      payload.customer_relatives = (payload.customer_relatives || []).map((item) =>
        _.pick(item, ['member_ref_id', 'relationship_member_id']),
      );
      await updateCustomerHobbiesRelatives(account_id, payload).then(() => {
        loadHobbiesRelatives()
      });
      showToast.success();
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Sở thích',
      id: 'customer_hobbies',
      component: TableHobbies,
      fieldActive: methods.watch('customer_hobbies')?.length ? ['customer_hobbies'] : ['-_-'],
      onRefresh: loadHobbiesRelatives
    },
    {
      title: 'Người thân',
      id: 'customer_relatives',
      component: TableRelatives,
      fieldActive: methods.watch('customer_relatives')?.length ? ['customer_relatives'] : ['-_-'],
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
}

export default HobbiesRelatives;
