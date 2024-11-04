import React from 'react';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import { generateNextCode } from 'pages/websiteDirectory/helpers/call-api';
import { useEffect } from 'react';
import useQueryString from 'hooks/use-query-string';

//components
const ChangeLanguage = [
  { value: 1, label: 'Tiếng việt' },
  { value: 2, label: 'Tiếng Anh' },
];
const OrderInforEG = () => {

  const methods = useFormContext({});
  const { setValue } = methods;
  const [query] = useQueryString();
  const tabActive = query.tab_active;
  useEffect(() => {
    if(tabActive === 'eg') {
      setValue('language_id', 2);
console.log('tabActive',tabActive)
    }

    generateNextCode()
      .then((res) => {
        setValue('website_category_code', res?.next_code || '1');
      })
      .finally(() => {});
  }, [setValue, tabActive]);
  return (
    <BWAccordion title='Thông tin danh mục website' id='bw_info_cus'>
      <div className='bw_row'>
        <FormItem label='Mã danh mục' disabled className='bw_col_6'>
          <FormInput type='text' field='website_category_code' placeholder='' />
        </FormItem>

        <FormItem label='Ngôn ngữ' className='bw_col_6'>
          <FormSelect field='language_id' list={ChangeLanguage.filter((_) => _.value !== 0)} />
        </FormItem>

        <FormItem label='Tên danh mục' className='bw_col_6' isRequired>
          <FormInput type='text' field='website_category_name' placeholder='' />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default OrderInforEG;
