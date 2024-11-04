/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import CustomerLeadService from 'services/customer-lead.service';
import { useCustomerLeadContext } from 'pages/CustomerLead/utils/context';
import CustomerCompanyAdd from '../Sections/CustomerCompanyAdd';
import TableSelectCompany from '../Tables/TableSelectCompany';
import ModalPortal from './ModalPortal';
import { MODAL } from 'pages/CustomerLead/utils/constants';

function ModalAddCompany({ onConfirm, defaultCustomerCompany }) {
  const methods = useForm();
  const { onOpenModalAddCompany } = useCustomerLeadContext();

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
    CustomerLeadService.getListCustomerCompany(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);
  useEffect(loadData, [loadData]);

  return (
    <FormProvider {...methods}>
      <ModalPortal
        wrapperId={MODAL.ADD_COMPANY}
        title='Chọn công ty'
        onClose={() => onOpenModalAddCompany(false)}
        onConfirm={() => onConfirm(methods.getValues('customer_company'))}>
        <CustomerCompanyAdd refreshCompany={loadData} />
        <TableSelectCompany params={params} dataRows={dataRows} onChange={onChange} />
      </ModalPortal>
    </FormProvider>
  );
}

export default ModalAddCompany;
