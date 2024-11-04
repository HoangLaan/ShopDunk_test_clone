import React, { useEffect, useState } from 'react';
import PurchaseOrdersTab from 'pages/OtherAccVoucher/components/FormSection/Tabs/Accountings';
import InvoicesTab from 'pages/OtherAccVoucher/components/FormSection/Tabs/Invoices';
import Panel from 'components/shared/Panel/index';
import BWAccordion from 'components/shared/BWAccordion';
import { OBJECT_TYPE } from 'pages/OtherAccVoucher/utils/constant';
import { getObjectOptions } from 'services/other-acc-voucher.service';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { convertValueToString } from 'pages/OtherAccVoucher/utils/helper';

const AccoungtingInvoice = ({ disabled, title, id }) => {
  const [customerOptions, setCustomerOptions] = useState([]);
  const [optionLoading, setOptionLoading] = useState(false);

  useEffect(() => {
    setOptionLoading(true);
    getObjectOptions({ query_type: OBJECT_TYPE.INDIVIDUAL_CUSTOMER })
      .then((data) => {
        setCustomerOptions(convertValueToString(data));
      })
      .finally(() => {
        setOptionLoading(false);
      });
  }, []);

  const panel = [
    {
      key: 'accountings',
      label: 'Hạch toán',
      component: PurchaseOrdersTab,
      disabled: disabled,
      customerOptions: customerOptions,
      loading: optionLoading,
    },
    {
      key: 'invoices',
      label: 'Thuế',
      component: InvoicesTab,
      disabled: disabled,
      customerOptions: customerOptions,
      loading: optionLoading,
    },
  ];

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_12'>
          <Panel panes={panel} noActions={true} />
        </div>
      </div>

      <div class='bw_col_12 bw_mt_1'>
        <label className='bw_checkbox'>
          <FormInput type='checkbox' field='not_declare_tax' disabled={disabled} />
          <span />
          Không lên bảng kê thuế GTGT
        </label>
      </div>
    </BWAccordion>
  );
};

export default AccoungtingInvoice;
