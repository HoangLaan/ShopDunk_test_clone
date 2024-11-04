import React, { useCallback, useEffect, useState } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { getStocksOpts, getStocksTransferTypeOpts } from '../helpers/call-api';
import { mapDataOptions4Select } from 'utils/helpers';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { statusTransferOpts } from '../helpers/const';
import dayjs from 'dayjs';
import { getListOptionUser } from 'services/users.service';

const StocksTransferFilter = ({ onChange }) => {
  const methods = useForm({ defaultValues: { is_review: 4 } });
  const [stocksTransferTypeOpts, setStocksTransferTypeOpts] = useState([]);
  const [stocksOpts, setStocksOpts] = useState([]);
  const [userOpts, setOpts] = useState([]);
  const reviewStatusOption = [
    {
      label: 'Tất cả',
      value: 4,
    },
    {
      label: 'Đã duyệt',
      value: 1,
    },
    {
      label: 'Đang duyệt',
      value: 2,
    },
    {
      label: 'Chưa duyệt',
      value: 3,
    },
    {
      label: 'Không duyệt',
      value: 0,
    },
  ];

  const getIntOption = useCallback(async () => {
    // Lấy hình thức phiếu chuyển kho
    const _stocksTransferTypeOpts = await getStocksTransferTypeOpts();
    setStocksTransferTypeOpts(mapDataOptions4Select(_stocksTransferTypeOpts));

    // Lấy danh sách kho
    const _stocksOpts = await getStocksOpts();
    setStocksOpts(mapDataOptions4SelectCustom(_stocksOpts, 'stocks_id', 'stocks_name'));

    fetchUserOpts();
  }, []);

  useEffect(() => {
    getIntOption();
  }, [getIntOption]);

  const fetchUserOpts = (value) => {
    // value return tu input
    return getListOptionUser({
      keyword: value,
    }).then((body) => {
      const _setOpts = body.items.map((user) => ({
        label: user.full_name,
        value: user.user_name,
      }));

      setOpts(_setOpts);
    });
  };

  const returnMomentDateRange = (start, finish) => {
    return [dayjs(start, 'DD/MM/YYYY'), dayjs(finish, 'DD/MM/YYYY')];
  };

  const handleChangeDate = (date, dateString) => {
    if (Boolean(dateString[0] && dateString[1])) {
      // changeDateRange(returnMomentDateRange(dateString[0], dateString[1]));
      methods.setValue('date_from', dateString[0]);
      methods.setValue('date_to', dateString[1]);
    } else {
      // changeDateRange(null);
    }
  };

  const onClear = () => {
    methods.reset({
      keyword: '',
      is_active: 1,
    });
    // changeDateRange(null);
    onChange({
      keyword: '',
      is_active: 1,
      date_from: null,
      date_to: null,
      created_user: null,
      stocks_transfer_type_id: null,
      stocks_export_id: null,
      stocks_import_id: null,
      status_transfer: null,
      is_review: 4,
    });
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput field='keyword' placeholder={'Nhập số phiếu chuyển, CN chuyển, CN nhận, CH chuyển, CH nhận'} />
            ),
          },
          {
            title: 'Ngày lập phiếu',
            component: (
              <FormRangePicker
                onChange={handleChangeDate}
                style={{ width: '100%' }}
                fieldStart={'from_date'}
                fieldEnd={'to_date'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
          {
            title: 'Người lập phiếu',
            component: (
              <FormDebouneSelect
                style={{ width: '100%' }}
                field='created_user'
                id='created_user'
                placeholder={'Tìm kiếm người lập phiếu'}
                debounceTimeout={1000}
                fetchOptions={fetchUserOpts}
                options={userOpts}
              />
            ),
          },
          {
            title: 'Hình thức phiếu chuyển',
            component: (
              <FormSelect field='stocks_transfer_type_id' id='stocks_transfer_type_id' list={stocksTransferTypeOpts} />
            ),
          },
          {
            title: 'Kho chuyển',
            component: <FormSelect field='stocks_export_id' id='bw_company' list={stocksOpts} />,
          },
          {
            title: 'Kho nhận',
            component: <FormSelect field='stocks_import_id' id='bw_company' list={stocksOpts} />,
          },
          {
            title: 'Trạng thái phiếu chuyển',
            component: <FormSelect field='status_transfer' id='status_transfer' list={statusTransferOpts} />,
          },
          {
            title: 'Trạng thái duyệt',
            component: <FormSelect field='is_review' id='is_review' list={reviewStatusOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default StocksTransferFilter;
