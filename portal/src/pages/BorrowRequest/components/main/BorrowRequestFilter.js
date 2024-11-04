import React, { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWButton from 'components/shared/BWButton';

import { mapDataOptions4Select, defaultParams } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';
import { STATUS_TYPES } from 'utils/constants';
import { borrowStatus, borrowStatusOptions } from 'pages/BorrowRequest/helper/constants';
import ICON_COMMON from 'utils/icons.common';
import CheckAccess from 'navigation/CheckAccess';

const FilterBorrowRequest = ({ onChange, loading, statiticData }) => {
  const methods = useForm();
  const { reset, watch, setValue } = methods;
  const dispatch = useDispatch();

  const borrow_status = watch('borrow_status');

  const { borrowTypeData, stocksData, storeBorrowData } = useSelector((state) => state.global);

  useEffect(() => {
    reset({
      ...defaultParams,
      borrow_status: borrowStatus.ALL,
      borrow_stock_id: -1,
      borrow_type_id: -1,
      store_id: -1,
    });
  }, [reset]);

  const getOptions1Time = useCallback(() => {
    dispatch(getOptionsGlobal('borrowType'));
    dispatch(getOptionsGlobal('stocks'));
    dispatch(getOptionsGlobal('storeBorrow'));
  }, [dispatch]);
  useEffect(getOptions1Time, [getOptions1Time]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        colSize={4}
        onSubmit={onChange}
        onClear={() => {
          onChange({
            search: undefined,
            is_active: STATUS_TYPES.ACTIVE,
            borrow_date_from: undefined,
            borrow_date_to: undefined,
            borrow_stock_id: -1,
            borrow_type_id: -1,
            store_id: -1,
            borrow_status: borrowStatus.ALL,
          });

          reset({
            search: undefined,
            is_active: STATUS_TYPES.ACTIVE,
            borrow_date_from: undefined,
            borrow_date_to: undefined,
            borrow_stock_id: -1,
            borrow_type_id: -1,
            store_id: -1,
            borrow_status: borrowStatus.ALL,
          });
        }}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập số phiếu mượn, đối tác mượn, nhân viên mượn' />,
          },
          {
            title: 'Kho mượn',
            component: (
              <FormSelect
                field='borrow_stock_id'
                list={mapDataOptions4Select([
                  {
                    id: -1,
                    value: -1,
                    name: 'Tất cả',
                    label: 'Tất cả',
                  },
                  ...(stocksData || []),
                ])}
              />
            ),
          },
          {
            title: 'Hình thức mượn hàng',
            component: (
              <FormSelect
                field='borrow_type_id'
                list={mapDataOptions4Select([
                  {
                    id: -1,
                    name: 'Tất cả',
                  },
                  ...(borrowTypeData || []),
                ])}
              />
            ),
          },
          {
            title: 'Ngày mượn',
            component: (
              <FormRangePicker
                style={{ width: '100%' }}
                fieldStart='borrow_date_from'
                fieldEnd='borrow_date_to'
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
          {
            title: 'Ngày hẹn trả',
            component: (
              <FormRangePicker
                style={{ width: '100%' }}
                fieldStart='return_date_from'
                fieldEnd='return_date_to'
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
          {
            title: 'Cửa hàng',
            component: (
              <FormSelect
                field='store_id'
                list={mapDataOptions4Select([
                  {
                    id: -1,
                    name: 'Tất cả',
                  },
                  ...(storeBorrowData || []),
                ])}
              />
            ),
          },
        ]}
      />

      <div className='bw_row bw_mt_2 bw_align_items_center'>
        <div className='bw_col_12 bw_flex bw_justify_content_right bw_btn_group'>
          <CheckAccess permission='SL_BORROWREQUEST_ADD'>
            <BWButton
              icon={ICON_COMMON.add}
              type='success'
              content='Thêm mới'
              onClick={() => window._$g.rdr('/borrow-request/add')}
            />
          </CheckAccess>
        </div>
      </div>

      <ul className='bw_tabs'>
        {borrowStatusOptions.map((borrowStatus) => {
          return (
            <li
              onClick={() => {
                if (!loading) {
                  setValue('borrow_status', borrowStatus?.value);
                  onChange({ borrow_status: borrowStatus?.value });
                }
              }}
              className={+borrow_status === borrowStatus?.value ? `bw_active` : ''}>
              <a
                href='/'
                className='bw_link'
                onClick={(e) => e.preventDefault()}
                style={{ color: 'rgb(51, 51, 51)' }}>{`${borrowStatus?.label}${` (${
                (statiticData || []).find((p) => +p.borrow_status === borrowStatus.value)?.total || 0
              })`}`}</a>
            </li>
          );
        })}
      </ul>
    </FormProvider>
  );
};

export default FilterBorrowRequest;
