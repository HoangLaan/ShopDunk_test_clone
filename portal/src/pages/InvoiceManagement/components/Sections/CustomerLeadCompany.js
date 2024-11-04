import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import ICON_COMMON from 'utils/icons.common';
import DataTable from 'components/shared/DataTable/index';
import BWAccordion from 'components/shared/BWAccordion/index';

import { PERMISSION } from 'pages/CustomerLead/utils/constants';
import { useCustomerLeadContext } from 'pages/CustomerLead/utils/context';
import ModalAddCompany from '../Modals/ModalAddCompany';

function CustomerLeadCompany({ disabled, title, loading }) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const watchCustomerCompany = methods.watch('customer_company');
  const { openModalAddCompany, onOpenModalAddCompany } = useCustomerLeadContext();

  const columns = useMemo(
    () => [
      {
        header: 'Tên công ty',
        accessor: 'customer_company_name',
      },
      {
        header: 'Tên người đại diện',
        accessor: 'representative_name',
      },
      {
        header: 'Mã số thuế',
        accessor: 'tax_code',
      },
      {
        header: 'SĐT',
        accessor: 'phone_number',
      },
      {
        header: 'Email',
        accessor: 'email',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm công ty',
        permission: PERMISSION.SELECT_COMPANY,
        hidden: disabled,
        onClick: () => onOpenModalAddCompany(true),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: PERMISSION.SELECT_COMPANY,
        hidden: disabled,
        onClick: (value) => {
          dispatch(
            showConfirmModal([`Xoá ${value?.customer_company_name} ra khỏi danh sách công ty ?`], () => {
              methods.setValue('customer_company', null);
              return;
            }),
          );
        },
      },
    ];
  }, []);

  const onConfirm = (customer_company) => {
    methods.setValue('customer_company', customer_company);
    methods.setValue('customer_company_id', customer_company.customer_company_id);
    onOpenModalAddCompany(false)
  }

  return (
    <BWAccordion title={title}>
      <DataTable
        hiddenActionRow
        noPaging
        noSelect
        data={watchCustomerCompany ? [watchCustomerCompany] : []}
        columns={columns}
        loading={loading}
        actions={actions}
      />
      {openModalAddCompany && <ModalAddCompany onConfirm={onConfirm} defaultCustomerCompany={methods.watch('customer_company')} />}
    </BWAccordion>
  );
}

export default CustomerLeadCompany;
