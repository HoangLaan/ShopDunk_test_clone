import React, { useEffect, useState, useCallback, useMemo } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { getListFunctionGroup } from 'services/function.service';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import { getOptionsUser } from 'services/users.service';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { getOptionsCustomer } from 'services/stocks-in-request.service';
import { DIRECTION_CALL, DURATION_CALL, ISRECORDING_CALL, IS_MISSED_CALL, STATUS_CALL, ISRATE } from '../utils/constants';
import { VOIP_EXT } from 'pages/User/components/InfoTab/utils';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { getVoipExt } from 'services/voip.services';

const initForm = {
  is_active: 1,
  start_date:null,
  end_date: null,
};

const CDRsFilter = ({ onChange, onClear, phoneNumber }) => {
  const methods = useForm();
  const [customerOptions, setCustomerOptions] = useState([]);
  const {
    watch,
    formState: { errors },
  } = methods;
  useEffect(() => {
    methods.reset(initForm);
  }, []);

  const getOptsCustomer = (value) => {
    return getOptionsCustomer({
      keyword: value,
    }).then((body) => {
      const _options = body.map((_) => ({
        label: _?.name,
        value: _?.id,
        phone_number: _?.phone_number,
      }));
      setCustomerOptions(_options);
      return _options;
    });
  };

  const [UserGroups, setUserGroups] = useState([]);
  const [listVoipExt, setListVoipExt] = useState([]);

  useEffect(() => {
    setUserGroups(
      (UserGroups || []).filter((x) => (watch('extension') || []).findIndex((k) => k.id == x.id) >= 0),
    );
  }, [watch('extension')]);

  useEffect(() => {
    getVoipExt({page: 1, itemsPerPage: 1000}).then((resp) => {
      setListVoipExt(resp?.items.map((item) => item.voip_ext))
    })
  }, [])
  
  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={(values) => {
          onChange({ ...values, phone: values?.phone?.phone_number || '' });
        }}
        onClear={() => {
          onClear();
          methods.reset(initForm);
        }}
        actions={[
          {
            title: 'Máy nhánh',
            component: (
              <FormSelect
                field='extension'
                list={listVoipExt.map((value) => {
                  return {
                    value: value.toString(),
                    label: value.toString(),
                  };
                }) || []}
                allowClear
                mode='multiple'
              />
            ),
          },
          {
            title: 'Ngày gọi',
            component: (
              <FormRangePicker
                fieldStart={'start_date'}
                fieldEnd={'end_date'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
          {
            title: 'Trạng thái cuộc gọi',
            component: (
              <FormSelect
                field='status'
                placeholder='--Chọn--'
                list={STATUS_CALL}
                style={{
                  width: '100%',
                }}
              />
            ),
          },
          {
            title: 'Cuộc gọi',
            component: (
              <FormSelect
                field='is_missed'
                placeholder='--Chọn--'
                list={IS_MISSED_CALL}
                style={{
                  width: '100%',
                }}
              />
            ),
          },
          {
            title: 'Khách hàng',
            hidden: phoneNumber,
            component: (
              <FormDebouneSelect
                field='phone'
                placeholder='--Chọn--'
                fetchOptions={getOptsCustomer}
                style={{
                  width: '100%',
                }}
              />
            ),
          },
          {
            title: 'Số điện thoại',
            hidden: phoneNumber,
            component: (
              <FormInput field='phone_search' placeholder='Nhập số điện thoại' />
            ),
          },
          {
            title: 'Hướng cuộc gọi',
            component: (
              <FormSelect
                field='direction'
                placeholder='--Chọn--'
                list={DIRECTION_CALL}
                style={{
                  width: '100%',
                }}
              />
            ),
          },
          {
            title: 'Thời gian gọi',
            component: (
              <FormSelect
                field='duration'
                placeholder='--Chọn--'
                list={DURATION_CALL}
                style={{
                  width: '100%',
                }}
              />
            ),
          },
          {
            title: 'Được ghi lại',
            component: (
              <FormSelect
                field='is_recording'
                placeholder='--Chọn--'
                list={ISRECORDING_CALL}
                style={{
                  width: '100%',
                }}
              />
            ),
          },
          {
            title: 'Đánh giá cuộc gọi',
            component: (
              <FormSelect
                field='rare'
                placeholder='--Chọn--'
                list={ISRATE ?? []}
                style={{
                  width: '100%',
                }}
                mode='multiple'
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default CDRsFilter;
