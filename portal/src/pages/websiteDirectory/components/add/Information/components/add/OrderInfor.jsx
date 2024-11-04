import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { generateNextCode } from 'pages/websiteDirectory/helpers/call-api';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import useQueryString from 'hooks/use-query-string';

import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
//components
const ChangeLanguage = [
  { value: 1, label: 'Tiếng việt' },
  { value: 2, label: 'Tiếng Anh' },
];

const Information = () => {
  const methods = useFormContext({});
  const [query] = useQueryString();
  const tabActive = query.tab_active;
  const { setValue } = methods;
  useEffect(() => {
    if(tabActive === 'vn') {
      setValue('language_id', 1);
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
          <FormSelect allowClear={true}  field='language_id' list={ChangeLanguage.filter((_) => _.value !== 0)} />
        </FormItem>

        <FormItem label='Website' className='bw_col_6' disabled={false}>
          <FormSelect allowClear={true}  field='website_id' list={ChangeLanguage.filter((_) => _.value !== 0)} />
        </FormItem>

        <FormItem label='Tên danh mục' className='bw_col_6' isRequired>
          <FormInput type='text' field='website_category_name' placeholder='' />
        </FormItem>

        <FormItem label='Ngành hàng' className='bw_col_6' disabled={false}>
          <FormSelect
            field='product_category_id'
            list={[
              { value: 1, label: 'Iphone' },
              { value: 2, label: 'Watch' },
              { value: 3, label: 'Ipad' },
              { value: 4, label: 'Macbook' },
            ].filter((_) => _.value !== 0)}
            allowClear={true}
          />
        </FormItem>
        <FormItem label='URL' className='bw_col_6' disabled={false}>
          <FormInput field='url' />
        </FormItem>
        {/*
         */}
        <FormItem label='Trang tĩnh' className='bw_col_6' disabled={false}>
          <FormSelect
          allowClear={true}
            field='static_content_id'
            list={[
              { value: 1, label: 'giới thiệu' },
              { value: 2, label: 'Chính sách bảo mật' },
              { value: 3, label: 'Chính sách bảo hành' },
              { value: 4, label: 'Tra cứu' },
            ].filter((_) => _.value !== 0)}
          />
        </FormItem>
        <FormItem label='Thứ tự hiển thị' className='bw_col_6' disabled={false}>
          <FormInput field='order_index' />
        </FormItem>

        <FormItem label='Danh mục cha' className='bw_col_6' disabled={false}>
          <FormSelect
          allowClear={true}
            field='parent_id'
            list={[
              { value: 1, label: 'Thông tin' },
              { value: 2, label: 'Tra cứu' },
              { value: 3, label: 'Liên hệ' },
              { value: 4, label: 'Dịch vụ' },
            ].filter((_) => _.value !== 0)}
          />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default Information;
