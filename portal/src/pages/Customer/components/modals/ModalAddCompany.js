/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import TableSelectCompany from '../tables/TableSelectCompany';
import { MODAL } from 'pages/Customer/utils/constants';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import { useCustomerContext } from 'pages/Customer/utils/context';
import { getListCustomerCompany } from 'services/customer.service';
import FormCustomerCompanyAdd from '../forms/FormCustomerCompanyAdd';

function ModalAddCompany({ onConfirm, defaultCustomerCompany }) {
  const methods = useForm();
  const { openModalAddCompany } = useCustomerContext();

  useEffect(() => {
    if (defaultCustomerCompany) {
      methods.setValue('customer_company', defaultCustomerCompany);
    }
  }, [defaultCustomerCompany])


  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
  });

  const [dataRows, setDataRows] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
    loading: false,
  });

  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));

  const loadData = useCallback(() => {
    setDataRows((prev) => ({ ...prev, loading: true }));
    getListCustomerCompany(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);
  useEffect(loadData, [loadData]);

  return (
    <FormProvider {...methods}>
      <ModalPortal
        wrapperId={MODAL.ADD_COMPANY}
        width={800}
        title='Chọn công ty'
        onClose={() => openModalAddCompany(false)}
        onConfirm={() => onConfirm(methods.getValues('customer_company'))}>
        <FormCustomerCompanyAdd refreshCompany={loadData} />
        <TableSelectCompany params={params} dataRows={dataRows} onChange={onChange} />
      </ModalPortal>
    </FormProvider>
  );
}

export default ModalAddCompany;
