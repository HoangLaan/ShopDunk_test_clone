import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormItem from 'components/shared/BWFormControl/FormItem';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';

const CustomerWorkingStore = ({ disabled }) => {
  const storeOptions = useGetOptions(optionType.store, { valueAsString: true });

  return (
    <BWAccordion title='Thông tin cửa hàng' id='bw_info_cus'>
      <FormItem label='Cửa hàng' disabled={disabled}>
        <FormSelect field='store_id' list={storeOptions} />
      </FormItem>
    </BWAccordion>
  );
};

export default CustomerWorkingStore;
