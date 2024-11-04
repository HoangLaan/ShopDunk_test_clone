import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { isArray } from 'lodash';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';

import { mapDataOptions4Select, statusTypesOption } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';
import { DebitTypeOptions, tabOptions } from 'pages/DiscountProgram/ultils/constant';

const DiscountProgramFilter = ({ onChange, onClear, statiticData, loading }) => {
  const dispatch = useDispatch();
  const { manufacturerData } = useSelector((state) => state.global);
  const methods = useForm();
  const { reset, setValue, watch } = methods;

  const tab = watch('tab');

  useEffect(() => {
    reset({
      is_active: 1,
      is_debit: 0,
      apply_date_from: dayjs().subtract(30, 'day').format('DD/MM/YYYY'),
      apply_date_to: dayjs().format('DD/MM/YYYY'),
      tab: 0,
    });
  }, [reset]);

  useEffect(() => {
    dispatch(getOptionsGlobal('manufacturer'));
  }, []);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => {
          onClear({});
          reset({
            is_active: 1,
            is_debit: 0,
            apply_date_from: dayjs().subtract(30, 'day').format('DD/MM/YYYY'),
            apply_date_to: dayjs().format('DD/MM/YYYY'),
            tab: 0,
          });
        }}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập tên chương trình chiết khấu' />,
          },
          {
            title: 'Hãng',
            component: <FormSelect field='company_id' list={mapDataOptions4Select(manufacturerData ?? [])} />,
          },
          {
            title: 'Kích hoạt',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          },
          {
            title: 'Thời gian áp dụng CTCK',
            component: (
              <FormRangePicker
                fieldStart={'apply_date_from'}
                fieldEnd={'apply_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
          {
            title: 'Lưu công nợ',
            component: (
              <FormSelect
                field='is_debit'
                list={[
                  {
                    value: 0,
                    label: 'Tất cả',
                  },
                  ...DebitTypeOptions,
                ]}
              />
            ),
          },
          // {
          //   title: 'Trạng thái duyệt',
          //   component: <FormSelect field='is_active' list={reviewStatusOption} />,
          // },
          // {
          //   title: 'Ngày tạo',
          //   component: (
          //     <FormRangePicker
          //       fieldStart={'create_date_from'}
          //       fieldEnd={'create_date_to'}
          //       placeholder={['Từ ngày', 'Đến ngày']}
          //       format={'DD/MM/YYYY'}
          //       allowClear={true}
          //     />
          //   ),
          // },
        ]}
      />

      <ul className='bw_tabs'>
        {tabOptions.map((_tab) => {
          return (
            <li
              onClick={() => {
                if (!loading) {
                  setValue('tab', _tab?.value);
                  onChange({ tab: _tab?.value });
                }
              }}
              className={+tab === _tab?.value ? `bw_active` : ''}>
              <a
                href='/'
                className='bw_link'
                onClick={(e) => e.preventDefault()}
                style={{ color: 'rgb(51, 51, 51)' }}>{`${_tab?.label}${` (${
                (isArray(statiticData) ? statiticData : []).find((p) => +p.tab === _tab.value)?.total || 0
              })`}`}</a>
            </li>
          );
        })}
      </ul>
    </FormProvider>
  );
};

export default DiscountProgramFilter;
