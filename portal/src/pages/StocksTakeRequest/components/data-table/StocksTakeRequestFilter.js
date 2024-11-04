import React, { useMemo } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import { FIELD_STOCKSTAKEREQUEST } from 'pages/StocksTakeRequest/utils/constants';
import { processStepTypes } from 'pages/StocksTakeRequest/utils/helpers';
import { useSelector } from 'react-redux';

const StocksTakeRequestFilter = ({ onChange, onClear }) => {
  const defaultValues = useMemo(
    () => ({
      is_active: 1,
      is_processed: 2,
    }),
    [],
  );
  const methods = useForm({
    defaultValues,
  });

  const { stocksTakeTypeList, getStocksTakeTypeLoading } = useSelector((o) => o.stocksTakeRequest);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear(defaultValues)}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder='Nhập số phiếu kiểm kê, tên kỳ kiểm kê' field='search' />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={FIELD_STOCKSTAKEREQUEST.create_date_from}
                fieldEnd={FIELD_STOCKSTAKEREQUEST.create_date_to}
                placeholder={['Từ ngày', 'Đến ngày']}
                format='DD/MM/YYYY'
              />
            ),
          },
          {
            title: 'Hình thức kiểm kê',
            component: (
              <FormSelect
                loading={getStocksTakeTypeLoading}
                field={FIELD_STOCKSTAKEREQUEST.stocks_take_type_id}
                placeholder='Hình thức kiểm kê'
                list={(stocksTakeTypeList ?? [])?.map((o) => {
                  return {
                    label: o?.stocks_take_type_name,
                    value: parseInt(o?.stocks_take_type_id),
                  };
                })}
              />
            ),
          },
          {
            title: 'Trạng thái xử lí',
            component: <FormSelect field='is_processed' id='bw_company' list={processStepTypes} />,
          },
        ]}
      />
    </FormProvider>
  );
};

StocksTakeRequestFilter.propTypes = {
  onChange: PropTypes.func,
  onClear: PropTypes.func,
};

StocksTakeRequestFilter.defaultPropTypes = {
  onChange: () => {},
  onClear: () => {},
};

export default StocksTakeRequestFilter;
