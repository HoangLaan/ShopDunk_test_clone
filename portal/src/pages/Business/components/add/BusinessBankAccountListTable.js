import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';

import { showConfirmModal } from 'actions/global';
import BWAccordion from 'components/shared/BWAccordion/index';
import DataTable from 'components/shared/DataTable/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getOptionsBanks } from 'services/bank.service';
import { mapDataOptions4Select } from 'utils/helpers';

const BusinessBankAccountListTable = ({ disabled, loading }) => {
  const methods = useFormContext();
  const { control } = methods;
  const { remove, append } = useFieldArray({
    control,
    name: 'bank_account_list',
  });
  const dispatch = useDispatch();
  const [bankOptions, setBankOptions] = useState([]);

  const getOptions = useCallback(() => {
    getOptionsBanks().then((res) => {
      setBankOptions(mapDataOptions4Select(res));
    });
  }, []);

  useEffect(getOptions, [getOptions]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: (
          <>
            Chủ tài khoản<span className='bw_red'>*</span>
          </>
        ),
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => (
          <React.Fragment>
            <FormInput
              className='bw_inp bw_mw_2'
              field={`bank_account_list.${index}.bank_account_name`}
              validation={{
                required: 'Vui lòng nhập chủ tài khoản',
              }}
              disabled={disabled}
            />
          </React.Fragment>
        ),
      },
      {
        header: (
          <>
            Số tài khoản<span className='bw_red'>*</span>
          </>
        ),
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => (
          <React.Fragment>
            <FormInput
              className='bw_inp bw_mw_2'
              field={`bank_account_list.${index}.bank_number`}
              validation={{
                required: 'Vui lòng nhập số tài khoản',
              }}
              disabled={disabled}
            />
          </React.Fragment>
        ),
      },
      {
        header: (
          <>
            Ngân hàng<span className='bw_red'>*</span>
          </>
        ),
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => (
          <React.Fragment>
            <FormSelect
              className='bw_inp bw_mw_2'
              field={`bank_account_list.${index}.bank_id`}
              validation={{
                required: 'Vui lòng chọn ngân hàng',
              }}
              disabled={disabled}
              list={bankOptions}
            />
          </React.Fragment>
        ),
      },
      {
        header: (
          <>
            Chi nhánh<span className='bw_red'>*</span>
          </>
        ),
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => (
          <React.Fragment>
            <FormInput
              className='bw_inp bw_mw_2'
              field={`bank_account_list.${index}.bank_branch`}
              validation={{
                required: 'Vui lòng nhập chi nhánh',
              }}
              disabled={disabled}
            />
          </React.Fragment>
        ),
      },
      {
        header: 'SwiftCode',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <React.Fragment>
              <FormInput
                className='bw_inp bw_mw_2'
                field={`bank_account_list.${index}.bank_code`}
                disabled={disabled}
              />
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
              <label className='bw_checkbox' style={{ margin: 0 }}>
                <FormInput
                  className={'bw_checkbox'}
                  disabled={disabled}
                  type='checkbox'
                  field={`bank_account_list.${index}.is_default`}
                  onChange={(e) => {
                    methods.setValue(
                      `bank_account_list`,
                      [...methods.watch('bank_account_list')].map((o) => {
                        return { ...o, is_default: 0 };
                      }),
                    );
                    methods.setValue(`bank_account_list.${index}.is_default`, 1);
                  }}
                />
                <span></span>
              </label>
            </React.Fragment>
          );
        },
      },
    ],
    [disabled, methods, bankOptions],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        permission: 'AM_BUSINESS_BANKACCOUNT_ADD',
        content: 'Thêm',
        hidden: disabled,
        onClick: async () => {
          // check validate all current rows before add new row
          const result = await methods.trigger('bank_account_list');

          if (result) {
            if (methods.watch('bank_account_list')?.find((o) => o.is_default === 1) === undefined) {
              append({ is_default: 1 });
            } else {
              append({});
            }
          }
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: disabled,
        onClick: (_, index) =>
          dispatch(
            showConfirmModal(['Xoá tài khoản này?'], () => {
              const is_default = methods.watch(`bank_account_list.${index}.is_default`);
              remove(index);

              if (is_default && methods.watch('bank_account_list').length > 0) {
                methods.setValue(`bank_account_list.0.is_default`, 1);
              }
            }),
          ),
      },
    ];
  }, [remove, methods, append, disabled, dispatch]);

  const bank_account_list = useMemo(() => {
    return methods.watch('bank_account_list');
  }, [methods]);

  return (
    <>
      <React.Fragment>
        <BWAccordion title='Tài khoản ngân hàng'>
          <DataTable
            style={{
              marginTop: '0px',
            }}
            hiddenActionRow
            noPaging
            noSelect
            data={bank_account_list}
            columns={columns}
            loading={loading}
            actions={actions}
          />
        </BWAccordion>
      </React.Fragment>
    </>
  );
};

BusinessBankAccountListTable.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default BusinessBankAccountListTable;
