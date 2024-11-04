import React, { useCallback, useMemo, useState } from 'react';
import _ from 'lodash';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { showConfirmModal } from 'actions/global';
import ICON_COMMON from 'utils/icons.common';
import { InstallmentType, InstallmentTypeOptions } from 'pages/DiscountProgram/ultils/constant';

import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWImage from 'components/shared/BWImage';
import DiscountProgramBankModal from './modals/DiscountProgramBankModal';
import DiscountProgramFinnanceCompanyModal from './modals/DiscountProgramFinnanceCompanyModal';

const DiscountProgramInstallmentProduct = ({ loading, disabled }) => {
  const methods = useFormContext();
  const { watch, reset, setValue } = methods;
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);

  const finance_company_list = watch('finance_company_list');
  const bank_list = watch('bank_list');
  const is_apply_installment_product = watch('is_apply_installment_product');
  const is_installment_finance_company = watch('is_installment_finance_company');
  const isValid = Object.values(InstallmentType).includes(+is_installment_finance_company || 0);

  const onChangeType = useCallback(() => {
    if (
      finance_company_list?.length > 0 ||
      (+is_installment_finance_company || 0) !== InstallmentType.FINANCE_COMPANY
    ) {
      setValue('bank_list', []);
    }

    if (bank_list?.length > 0 || (+is_installment_finance_company || 0) !== InstallmentType.BANK) {
      setValue('finance_company_list', []);
    }
  }, [finance_company_list, bank_list, is_installment_finance_company, setValue]);

  const columns = useMemo(() => {
    if ((+is_installment_finance_company || 0) === InstallmentType.FINANCE_COMPANY) {
      return [
        {
          header: 'Tên công ty tài chính',
          classNameHeader: 'bw_text_center',
          formatter: (p, idx) => p.finance_company_name,
        },
        {
          header: 'Tỷ lệ trả trước (%)',
          classNameHeader: 'bw_text_center',
          formatter: (p, idx) => (
            <FormNumber
              field={`finance_company_list.[${idx}].prepayment_rate`}
              bordered
              disabled={disabled}
              validation={{ required: 'Tỷ lệ trả trước là bắt buộc' }}
            />
          ),
        },
        {
          header: 'Thời gian trả góp',
          classNameHeader: 'bw_text_center',
          formatter: (p, idx) => (
            <div style={{ display: 'flex', gap: '5px' }}>
              <div>
                <FormNumber field={`finance_company_list.[${idx}].from_time`} bordered disabled={disabled} />
              </div>
              <div style={{ margin: '0 3px' }}>-</div>
              <div>
                <FormNumber field={`finance_company_list.[${idx}].to_time`} bordered disabled={disabled} />
              </div>
              <div>
                <FormSelect
                  field={`finance_company_list.[${idx}].time_type`}
                  bordered
                  list={[
                    { value: 0, label: 'Tháng' },
                    { value: 1, label: 'Năm' },
                  ]}
                  disabled={disabled}
                  style={{ minWidth: '80px' }}
                />
              </div>
            </div>
          ),
        },
      ];
    } else if ((+is_installment_finance_company || 0) === InstallmentType.BANK) {
      return [
        {
          header: 'Logo',
          classNameHeader: 'bw_text_center',
          formatter: (p, idx) => (
            <BWImage
              src={p?.bank_logo}
              key={`discount-program-bank-${idx}`}
              preview={false}
              style={{ maxHeight: '45px' }}
            />
          ),
          style: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
        },
        {
          header: 'Tên ngân hàng',
          classNameHeader: 'bw_text_center',
          formatter: (p, idx) => p.bank_name,
        },
      ];
    }
  }, [disabled, is_installment_finance_company]);

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content:
          (+is_installment_finance_company || 0) === InstallmentType.FINANCE_COMPANY
            ? 'Chọn công ty tài chính'
            : 'Chọn ngân hàng',
        permission: 'PO_DISCOUNT_PROGRAM_ADD',
        hidden: disabled,
        onClick: () => {
          setShowModal(true);
        },
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        hidden: disabled,
        permission: 'PO_DISCOUNT_PROGRAM_ADD',
        onClick: (value, idx) => {
          dispatch(
            showConfirmModal(
              [
                `Xoá ${
                  (+is_installment_finance_company || 0) === InstallmentType.FINANCE_COMPANY
                    ? value.finance_company_name
                    : value.bank_name
                } khỏi danh sách mã khuyến mại áp dụng ?`,
              ],
              () => {
                if ((+is_installment_finance_company || 0) === InstallmentType.FINANCE_COMPANY) {
                  let finance_company_list = _.cloneDeep(methods.watch('finance_company_list'));
                  finance_company_list?.splice(idx, 1);
                  methods.setValue('finance_company_list', finance_company_list);
                } else if ((+is_installment_finance_company || 0) === InstallmentType.BANK) {
                  let bank_list = _.cloneDeep(methods.watch('bank_list'));
                  bank_list?.splice(idx, 1);
                  methods.setValue('bank_list', bank_list);
                }
                return;
              },
            ),
          );
        },
      },
    ];
  }, [methods, dispatch, disabled, is_installment_finance_company]);

  return (
    <div className='bw_frm_box bw_mt_1 bw_col_12'>
      <FormRadioGroup field='is_installment_finance_company' list={InstallmentTypeOptions} onChange={onChangeType} />

      {Boolean(isValid) && (
        <DataTable
          hiddenActionRow
          noPaging
          noSelect
          loading={loading}
          data={
            (+is_installment_finance_company || 0) === InstallmentType.FINANCE_COMPANY
              ? finance_company_list
              : bank_list
          }
          columns={columns}
          actions={actions}
        />
      )}

      <FormInput
        hidden={true}
        disabled={disabled}
        type='text'
        field='check_installment_product'
        style={{ lineHeight: 1, display: 'none' }}
        validation={{
          validate: (value) => {
            if (is_apply_installment_product) {
              if (!isValid) {
                return 'Chọn ít nhất 1 tuỳ chọn';
              }

              if (
                (+is_installment_finance_company || 0) === InstallmentType.FINANCE_COMPANY &&
                !finance_company_list?.length
              ) {
                return 'Công ty tài chính là bắt buộc';
              }

              if ((+is_installment_finance_company || 0) === InstallmentType.BANK && !bank_list?.length) {
                return 'Ngân hàng là bắt buộc';
              }
            }

            return true;
          },
        }}
      />

      {showModal &&
        ((+is_installment_finance_company || 0) === InstallmentType.FINANCE_COMPANY ? (
          <DiscountProgramFinnanceCompanyModal
            open={showModal}
            onClose={() => {
              setShowModal(false);
              reset(watch());
            }}
          />
        ) : (
          <DiscountProgramBankModal
            open={showModal}
            onClose={() => {
              setShowModal(false);
              reset(watch());
            }}
          />
        ))}
    </div>
  );
};

DiscountProgramInstallmentProduct.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default DiscountProgramInstallmentProduct;
