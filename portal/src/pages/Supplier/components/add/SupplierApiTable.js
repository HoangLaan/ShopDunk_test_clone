import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';

import { showConfirmModal } from 'actions/global';
import { SupplierApiSchema } from 'pages/Supplier/utils/contructors';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable/index';
import { SUPPLIER_PERMISSION } from 'pages/Supplier/utils/constants';

const SuppierApiTable = ({ disabled, loading }) => {
  const methods = useFormContext();
  const { control, setValue, watch } = methods;
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'supplier_api_list',
  });
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Link API',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <React.Fragment>
              <FormInput
                className={'bw_inp bw_mw_2'}
                style={{
                  maxWidth: '100%',
                }}
                disabled={disabled}
                type='text'
                field={`supplier_api_list.${index}.api_url`}
                placeholder='Link API'
                validation={{
                  required: 'Link API là bắt buộc',
                }}
                onChange={(e) => {
                  setValue(`supplier_api_list.${index}.api_url`, e.target.value);
                }}
              />
            </React.Fragment>
          );
        },
      },
      {
        header: 'Tài khoản',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <React.Fragment>
              <FormInput
                className={'bw_inp bw_mw_2'}
                style={{
                  maxWidth: '100%',
                }}
                disabled={disabled}
                type='text'
                field={`supplier_api_list.${index}.account`}
                placeholder='Tài khoản'
                onChange={(e) => {
                  setValue(`supplier_api_list.${index}.account`, e.target.value);
                }}
              />
            </React.Fragment>
          );
        },
      },
      {
        header: 'Mật khẩu',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_relative',
        formatter: (_, index) => {
          return (
            <React.Fragment>
              <FormInput
                className={'bw_inp bw_mw_2'}
                style={{
                  maxWidth: '100%',
                }}
                disabled={disabled}
                type={watch(`supplier_api_list.${index}.is_show_password`) ? 'text' : 'password'}
                field={`supplier_api_list.${index}.password`}
                placeholder='*****************'
                onChange={(e) => {
                  setValue(`supplier_api_list.${index}.password`, e.target.value);
                }}
              />
              <span
                className='bw_btn bw_change_password'
                style={{ top: 11, right: 11, height: 33 }}
                onClick={() => {
                  setValue(
                    `supplier_api_list.${index}.is_show_password`,
                    !watch(`supplier_api_list.${index}.is_show_password`),
                  );
                }}>
                <i
                  className={
                    !watch(`supplier_api_list.${index}.is_show_password`) ? 'fi fi-rr-eye' : 'fi fi-rr-eye-crossed'
                  }></i>
              </span>
            </React.Fragment>
          );
        },
      },
      {
        header: 'Mặc định',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <React.Fragment>
              <label className='bw_checkbox'>
                <FormInput
                  className={'bw_checkbox'}
                  disabled={disabled}
                  type='checkbox'
                  field={`supplier_api_list.${index}.is_default`}
                  onChange={(e) => {
                    setValue(
                      `supplier_api_list`,
                      [...watch('supplier_api_list')].map((o) => {
                        return { ...o, is_default: 0 };
                      }),
                    );
                    setValue(`supplier_api_list.${index}.is_default`, 1);
                  }}
                />
                <span></span>
              </label>
            </React.Fragment>
          );
        },
      },
    ],
    [disabled, setValue, watch],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm dòng',
        hidden: disabled,
        permission: SUPPLIER_PERMISSION.ADD,
        onClick: () => {
          const supplier_api_list = watch('supplier_api_list');
          if (supplier_api_list) {
            const l = supplier_api_list?.length;
            if (l && !supplier_api_list[l - 1]['api_url']) return;
          }
          append(new SupplierApiSchema());
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: disabled,
        permission: SUPPLIER_PERMISSION.DEL,
        onClick: (_, index) =>
          dispatch(
            showConfirmModal(['Xoá API này?'], async () => {
              await remove(index);
            }),
          ),
      },
    ];
  }, [append, dispatch, remove, watch, disabled]);

  return (
    <React.Fragment>
      <BWAccordion title='Thông tin API'>
        <DataTable
          style={{
            marginTop: '0px',
          }}
          hiddenActionRow
          noPaging
          noSelect
          data={fields}
          columns={columns}
          loading={loading}
          actions={actions}
        />
      </BWAccordion>
    </React.Fragment>
  );
};

SuppierApiTable.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default SuppierApiTable;
