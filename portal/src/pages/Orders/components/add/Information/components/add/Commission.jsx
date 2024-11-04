import React, { useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

//components
import DataTable from 'components/shared/DataTable/index';
import { showConfirmModal } from 'actions/global';
import { msgError } from 'pages/Orders/helpers/msgError';
import { useDispatch } from 'react-redux';
import { Segmented } from 'antd';
import styled from 'styled-components';
import { typePromotionValues } from 'pages/Orders/helpers/constans';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { getUserCommissionOpts } from 'pages/Orders/helpers/call-api';

const SegmentedStyled = styled(Segmented)`
  .ant-segmented-item-selected {
    background-color: #1b3c40 !important;
    color: white !important;
    margin-bottom: 0px;
  }
`;

const Commission = ({ disabled }) => {
  const dispatch = useDispatch();
  const methods = useFormContext({});

  const {
    watch,
    // formState: { errors },
    setValue,
    trigger,
    reset,
    // clearErrors,
  } = methods;
  const [userOpst, setUserOpts] = useState([]);

  const fetchUserOpts = async (value) => {
    return getUserCommissionOpts({
      search: value,
    }).then((body) => {
      const _userOpts = body.data.map((_user) => ({
        label: _user.user_name + '-' + _user.full_name,
        value: _user.user_name,
        ..._user,
        disabled: (watch('commissions') || []).find((_commission) => _commission.user_commission == _user.user_name)
          ? true
          : false,
      }));

      setUserOpts(_userOpts);
    });
  };

  const handleAddUserCommission = () => {
    let _commissions = watch('commissions') || [];
    _commissions.push({
      commission_id: null,
      user_name: null,
      full_name: '',
      commission_value: 0,
      commission_type: 1,
    });

    setValue('commissions', _commissions);
  };

  const handleDelete = (idx) => {
    // lấy vị trí của user xoá
    let _commissions = watch('commissions') || [];

    _commissions.splice(idx, 1);

    setValue('commissions', _commissions);
    reset(watch());
  };

  const handleChangeCommission = (key, index, value) => {
    let _value = value;

    if (key === 'commission_value' && watch(`commissions.${index}.commission_type`) == 2) {
      if (_value >= 100) {
        _value = '100';
      }
    }

    setValue(`commissions.${index}.${key}`, _value);

    // set lại giá trị cho commission_value khi thay đổi commission_type
    if (key === 'commission_type') {
      setValue(`commissions.${index}.commission_value`, null);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center bw_w1',
        classNameBody: 'bw_text_center',

        formatter: (p, idx) => <b className='bw_sticky bw_name_sticky'>{idx + 1}</b>,
      },
      {
        header: 'Nhân viên bán hàng',
        accessor: 'user_name',

        formatter: (p, index) => (
          <FormDebouneSelect
            field={`commissions.${index}.user_commission`}
            id={`commissions.${index}.user_commission`}
            options={userOpst}
            allowClear={true}
            style={{ width: '100%' }}
            fetchOptions={fetchUserOpts}
            debounceTimeout={700}
            placeholder={'-- Chọn --'}
            validation={{
              required: 'Nhân viên nhận hoa hồng là bắt buộc',
            }}
            onChange={(e) => {
              setValue(`commissions.${index}.user_commission`, e?.value);
            }}
          />
        ),
      },
      {
        header: 'Giá trị hoa hồng',
        accessor: 'commission_value',
        classNameHeader: 'bw_w3',
        formatter: (p, index) => {
          return (
            <div className='bw_flex bw_justify_content_right bw_align_items_center'>
              <FormNumber
                type='text'
                field={`commissions.${index}.commission_value`}
                disabled={disabled}
                className='bw_inp'
                controls={false}
                style={{ padding: '2px 16px', width: '100%' }}
                validation={{
                  require: 'Giá trị hoa hồng là bắt buộc.',
                  min: {
                    value: 1,
                    message: 'Giá trị hoa hồng phải lớn hơn 0',
                  },
                }}
                bordered={true}
                min={0}
                onChange={(e) => {
                  handleChangeCommission('commission_value', index, e);
                }}
              />
            </div>
          );
        },
      },
      {
        header: '',
        classNameHeader: 'bw_text_center bw_w1',
        formatter: (p, index) => {
          return (
            <div className='bw_flex bw_justify_content_right bw_align_items_center'>
              <SegmentedStyled
                disabled={disabled}
                value={watch(`commissions.${index}.commission_type`)}
                options={typePromotionValues}
                onChange={(e) => {
                  handleChangeCommission('commission_type', index, e);
                }}
              />
            </div>
          );
        },
      },
    ],
    [userOpst],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm dòng',
        permission: ['SL_ORDER_EDIT', 'SL_ORDER_ADD'],
        hidden: disabled,
        onClick: async (p) => {
          const isValid = await trigger('commissions');
          if (isValid) {
            handleAddUserCommission();
          }
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'SL_ORDER_EDIT',
        disabled: disabled,
        onClick: (p, idx) =>
          !disabled
            ? dispatch(
                showConfirmModal(msgError['model_error'], async () => {
                  handleDelete(idx);
                }),
              )
            : null,
      },
    ];
  }, [disabled]);

  return (
    <React.Fragment>
      <div className='bw_row'>
        <div className='bw_col_6 bw_collapse_title'>
          <h3>Thông tin hoa hồng</h3>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={methods.watch('commissions') || []}
        actions={actions}
        noPaging={true}
        noSelect={true}
      />
    </React.Fragment>
  );
};

export default Commission;
