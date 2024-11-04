import React from 'react';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { statusTypesOption } from 'utils/helpers';
import { couponTypes } from 'pages/Coupon/utils/helpers';

const CouponFilter = ({ onChange, onClear }) => {
  return (
    <FilterSearchBar
      title='Tìm kiếm'
      onSubmit={onChange}
      onClear={onClear}
      actions={[
        {
          title: 'Từ khóa',
          component: <FormInput field='search' placeholder='Nhập tên chương trình' />,
        },
        {
          title: 'Trạng thái',
          component: (
            <FormSelect allowClear field='coupon_type_status_id' placeholder='Chọn trạng thái' list={couponTypes} />
          ),
        },
        {
          title: 'Kích hoạt',
          component: <FormSelect field='is_active' id='bw_company' list={statusTypesOption} />,
        },
        {
          title: 'Ngày tạo',
          component: (
            <FormRangePicker
              fieldStart='from_date'
              fieldEnd='to_date'
              placeholder={['Từ ngày', 'Đến ngày']}
              format={'DD/MM/YYYY'}
              allowClear={true}
            />
          ),
        },
      ]}
    />
  );
};

export default CouponFilter;
