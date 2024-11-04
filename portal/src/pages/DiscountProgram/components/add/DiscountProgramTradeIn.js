import React, { useState, useMemo } from 'react';
import _ from 'lodash';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { showConfirmModal } from 'actions/global';
import ICON_COMMON from 'utils/icons.common';

import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import DiscountProgramTradeInModal from 'pages/DiscountProgram/components/add/modals/DiscountProgramTradeInModal';
import FormCurrency from 'pages/DiscountProgram/components/shared/FormCurrency';

const DiscountProgramTradeIn = ({ loading, disabled }) => {
  const methods = useFormContext();
  const { watch, reset } = methods;
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(undefined);

  const trade_in_program_list = watch('trade_in_program_list');
  const is_apply_with_trade_in_program = watch('is_apply_with_trade_in_program');

  const columns = useMemo(
    () => [
      {
        header: 'Chương trình thu cũ đổi mới',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.trade_in_program_name}</b>,
      },
      {
        header: 'Thời gian áp dụng CT thu cũ đổi mới',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <b>
            {p?.begin_date} - {p.end_date}
          </b>
        ),
      },
      {
        header: 'NCC chịu khoản giảm trừ (gồm VAT)',
        classNameHeader: 'bw_text_center',
        formatter: (p, idx) => (
          <FormCurrency
            fieldValue={`trade_in_program_list.[${idx}].supplier_deductible`}
            fieldType={`trade_in_program_list.[${idx}].supplier_deductible_type`}
            disabled={disabled}
          />
        ),
      },
      {
        header: 'Bên mua chịu khoản giảm trừ (gồm VAT)',
        classNameHeader: 'bw_text_center',
        formatter: (p, idx) => (
          <FormCurrency
            fieldValue={`trade_in_program_list.[${idx}].buyer_deductible`}
            fieldType={`trade_in_program_list.[${idx}].buyer_deductible_type`}
            disabled={disabled}
          />
        ),
      },
    ],
    [disabled],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Chọn chương trình thu cũ đổi mới',
        permission: 'PO_DISCOUNT_PROGRAM_ADD',
        hidden: disabled,
        onClick: () => {
          setModalOpen(true);
        },
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        hidden: disabled,
        permission: 'PO_DISCOUNT_PROGRAM_ADD',
        onClick: (value) => {
          dispatch(
            showConfirmModal(
              [`Xoá ${value?.trade_in_program_name} khỏi danh sách chương trình thu cũ đổi mới áp dụng ?`],
              () => {
                let trade_in_program_list = _.cloneDeep(methods.watch('trade_in_program_list'));
                methods.setValue(
                  'trade_in_program_list',
                  trade_in_program_list.filter(
                    (o) => parseInt(o?.trade_in_program_id) !== parseInt(value?.trade_in_program_id),
                  ),
                );
                return;
              },
            ),
          );
        },
      },
    ];
  }, [methods, dispatch, disabled]);

  return (
    <div className='bw_frm_box bw_mt_1 bw_col_12'>
      <DataTable
        hiddenActionRow
        noPaging
        noSelect
        loading={loading}
        data={trade_in_program_list}
        columns={columns}
        actions={actions}
      />
      <FormInput
        hidden={true}
        disabled={disabled}
        type='text'
        field='check_trade_in_program_list'
        style={{ lineHeight: 1, display: 'none' }}
        validation={{
          validate: (value) => {
            if (is_apply_with_trade_in_program && !trade_in_program_list?.length) {
              return 'Chương trình thu cũ đổi mới là bắt buộc';
            }

            return true;
          },
        }}
      />
      {modalOpen && (
        <DiscountProgramTradeInModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            reset(watch());
          }}
        />
      )}
    </div>
  );
};

DiscountProgramTradeIn.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default DiscountProgramTradeIn;
