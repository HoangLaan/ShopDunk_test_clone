import React, { useEffect, useState } from 'react';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { useFormContext } from 'react-hook-form';
import { getListSupplier } from 'services/supplier.service';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const CustomerInfor = ({ id, title, disabled }) => {
  const [customerOpts, setCustomerOpts] = useState([]);
  const methods = useFormContext();
  const { watch, setValue } = methods;

  const fetchCustomer = async (value) => {
    return getListSupplier({
      search: value,
      is_active: 1,
      itemsPerPage: 50,
    }).then((body) => {
      const _customerOpts = body.items.map((_res) => ({
        label: _res.customer_code + '-' + _res.full_name,
        value: Boolean(+_res.member_id) ? `KH${_res.member_id}` : `TN${_res.dataleads_id}`,
        ..._res,
      }));
      setCustomerOpts(_customerOpts);
    });
  };

  const supplier_id = watch('supplier_id');
  useEffect(() => {
    if (supplier_id) {
      setValue('invoice_full_name', watch('supplier_name'));
      setValue('phone_number', watch('supplier_phone_number'));
      setValue('address_full', watch('supplier_address'));
      setValue('invoice_tax', watch('supplier_tax_code'));
    }
  }, [supplier_id]);

  const supplierOptions = useGetOptions(optionType.supplier);

  return (
    <BWAccordion title={title} id={id} isRequired>
      <div className='bw_row bw_mt_1'>
        <FormItem label='Nhà cung cấp' className='bw_col_4' disabled isRequired>
          <FormSelect field='supplier_id' list={supplierOptions} />
        </FormItem>
        <FormItem label='Số điện thoại' className='bw_col_4' disabled>
          <FormInput type='text' field='phone_number' disabled placeholder='0346******' />
        </FormItem>
        <FormItem label='Địa chỉ' className='bw_col_4' disabled>
          <FormInput type='text' field='address_full' disabled placeholder='Địa chỉ' />
        </FormItem>
        <FormItem label='Mã số thuế' className='bw_col_4' disabled>
          <FormInput type='text' field='invoice_tax' disabled placeholder='Mã số thuế' />
        </FormItem>
        <FormItem label='Tên nhà cung cấp' className='bw_col_4' disabled>
          <FormInput type='text' field='invoice_full_name' disabled placeholder='Tên nhà cung cấp' />
        </FormItem>
        {/* <FormItem label='Tên đơn vị' className='bw_col_4' disabled>
          <FormInput type='text' field='invoice_company_name' disabled placeholder='Tên đơn vị' />
        </FormItem> */}
      </div>
    </BWAccordion>
  );
};

export default CustomerInfor;
