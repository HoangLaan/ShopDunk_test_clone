import React, { useCallback, useEffect, useMemo } from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { showConfirmModal } from 'actions/global';
import { FIELD_STOCKSTAKEREQUEST, STOCKS_TAKE_REQUEST_PERMISSION } from 'pages/StocksTakeRequest/utils/constants';
import { showToast } from 'utils/helpers';
import { getOptionsUser } from 'services/stocks-take-request.service';

import DataTable from 'components/shared/DataTable';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import { UserSchema } from 'pages/StocksTakeRequest/utils/contructor';

const StocksTakeRequestPersonal = ({ title, disabled }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { watch, reset, formState, getFieldState, setValue } = methods;
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: FIELD_STOCKSTAKEREQUEST.stocks_take_users,
  });
  const { error } = getFieldState(FIELD_STOCKSTAKEREQUEST.stocks_take_users, formState) ?? {};

  useEffect(() => {
    methods.register(FIELD_STOCKSTAKEREQUEST.stocks_take_users, {
      validate: (value) => {
        if (!value?.length) {
          return 'Vui lòng nhập ít nhất một nhận sự kiểm kê';
        }
        return true;
      },
    });
  }, [methods]);

  const { departmentList } = useSelector((o) => o.stocksTakeRequest);

  const departmentOptions = useMemo(() => {
    return departmentList.map((value) => {
      return {
        label: value?.name,
        value: value?.id,
      };
    });
  }, [departmentList]);

  const loadUserOfDepartmentOptions = (deparment_id, value) => {
    // value return tu input
    return getOptionsUser(deparment_id, {
      key_word: value,
    });
  };

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Phòng ban',
      classNameHeader: 'bw_text_center',
      disabled: disabled,
      formatter: (_, index) => (
        <FormSelect
          bordered
          disabled={disabled}
          field={`${FIELD_STOCKSTAKEREQUEST.stocks_take_users}.${index}.department_id`}
          list={departmentOptions}
          validation={{
            required: 'Phòng ban là bắt buộc',
          }}
        />
      ),
    },
    {
      header: 'Tên người kiểm kê',
      classNameHeader: 'bw_text_center',
      disabled: disabled,
      formatter: (_, index) => (
        <FormDebouneSelect
          bordered
          disabled={disabled}
          fetchOptions={(value) =>
            loadUserOfDepartmentOptions(
              watch(`${FIELD_STOCKSTAKEREQUEST.stocks_take_users}.${index}.department_id`),
              value,
            )
          }
          field={`${FIELD_STOCKSTAKEREQUEST.stocks_take_users}.${index}.user_name`}
          validation={{
            required: 'Người kiểm kê là bắt buộc',
          }}
        />
      ),
    },
    {
      header: 'Chức vụ',
      classNameHeader: 'bw_text_center',
      disabled: disabled,
      formatter: (p, index) =>
        p?.position_name ?? watch(`${FIELD_STOCKSTAKEREQUEST.stocks_take_users}.${index}.position_name`),
    },
    {
      header: 'Chịu trách nhiệm chính',
      disabled: disabled,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
      formatter: (_, index) => (
        <label
          className='bw_radio'
          style={{
            marginLeft: '24px',
          }}>
          <input
            disabled={disabled}
            checked={watch(`${FIELD_STOCKSTAKEREQUEST.stocks_take_users}.${index}.is_main_responsibility`)}
            name='is_main_responsibility'
            type='checkbox'
            onChange={(e) => {
              methods.setValue(
                `${FIELD_STOCKSTAKEREQUEST.stocks_take_users}.${index}.is_main_responsibility`,
                e.target.checked ? 1 : 0,
              );
            }}
          />
          <span></span>
        </label>
      ),
    },
  ];

  const actions = useMemo(
    () => [
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        disabled: disabled,
        onClick: (_, index) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                remove(index);
                reset(watch());
              },
            ),
          ),
        permission: [STOCKS_TAKE_REQUEST_PERMISSION.EDIT, STOCKS_TAKE_REQUEST_PERMISSION.ADD],
      },
    ],
    [dispatch, disabled, remove, reset, watch],
  );

  const stocks_take_users = useMemo(
    () => watch(FIELD_STOCKSTAKEREQUEST.stocks_take_users) ?? [],
    [watch(FIELD_STOCKSTAKEREQUEST.stocks_take_users)],
  );

  const handleAdd = useCallback(() => {
    for (const item of stocks_take_users) {
      if (!item?.department_id || !item?.user_name) {
        showToast.error('Vui lòng nhập đầy đủ thông tin, trước khi thêm nhân sự khác');
        return;
      }
    }
    setValue(FIELD_STOCKSTAKEREQUEST.stocks_take_users, [...stocks_take_users, new UserSchema()]);
  }, [stocks_take_users, append]);

  return (
    <BWAccordion title={title}>
      {error && error?.root && error.root?.message && <ErrorMessage message={error.root?.message} />}

      <div className='bw_col_12'>
        <DataTable noSelect noPaging columns={columns} actions={actions} data={fields} />
        {!disabled && (
          <a onClick={handleAdd} className='bw_btn_outline bw_btn_outline_success bw_add_us'>
            <span className='fi fi-rr-plus'></span> Thêm
          </a>
        )}
      </div>
    </BWAccordion>
  );
};

export default StocksTakeRequestPersonal;
