import React, { useState, useMemo } from 'react';
import _ from 'lodash';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { showConfirmModal } from 'actions/global';
import ICON_COMMON from 'utils/icons.common';

import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import DiscountProgramModal from './product/DiscountProgramModal';

const DiscountProgramGift = ({ loading, disabled }) => {
  const methods = useFormContext();
  const { watch, reset } = methods;
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(undefined);

  const gift_list = watch('gift_list');
  const is_apply_gift = watch('is_apply_gift');

  const columns = useMemo(
    () => [
      {
        header: 'Mã quà tặng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.product_code}</b>,
      },
      {
        header: 'Tên quà tặng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => p.product_name,
      },
      {
        header: 'Số lượng quà được tặng khi mua 1 sản phẩm',
        classNameHeader: 'bw_text_center',
        formatter: (p, idx) => (
          <FormNumber
            field={`gift_list.[${idx}].quantity_gift`}
            validation={{
              required: 'Số lượng là bắt buộc',
              min: {
                value: 0.00000001,
                message: 'Giá trị phải lớn hơn 0',
              },
            }}
            bordered
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
        content: 'Sản phẩm',
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
            showConfirmModal([`Xoá ${value?.product_name} khỏi danh sách quà tặng ?`], () => {
              let gift_list = _.cloneDeep(methods.watch('gift_list'));
              methods.setValue(
                'gift_list',
                gift_list.filter((o) => parseInt(o?.product_id) !== parseInt(value?.product_id)),
              );
              return;
            }),
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
        data={gift_list}
        columns={columns}
        actions={actions}
      />
      <FormInput
        hidden={true}
        disabled={disabled}
        type='text'
        field='check_gift_list'
        style={{ lineHeight: 1, display: 'none' }}
        validation={{
          validate: (value) => {
            if (is_apply_gift && !gift_list?.length) {
              return 'Quà tặng là bắt buộc';
            }

            return true;
          },
        }}
      />
      {modalOpen && (
        <DiscountProgramModal
          fieldProduct='gift_list'
          onClose={() => {
            setModalOpen(false);
            reset(watch());
          }}
        />
      )}
    </div>
  );
};

DiscountProgramGift.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default DiscountProgramGift;
