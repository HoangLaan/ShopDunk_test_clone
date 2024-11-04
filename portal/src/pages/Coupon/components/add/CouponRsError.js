import React, { useState, useMemo } from 'react';
import _ from 'lodash';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable/index';
import { useFormContext } from 'react-hook-form';
import { COUPON_PERMISSION, TYPE_ERROR } from 'pages/Coupon/utils/constants';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import CouponRsErrorModal from './modal/CouponRsErrorModal';
import ICON_COMMON from 'utils/icons.common';
import PropTypes from 'prop-types';

const CouponRsError = ({ loading, title, disabled }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const [modalError, setModalError] = useState(undefined);

  const columns = useMemo(
    () => [
      {
        header: 'Mã lỗi máy',
        accessor: 'error_code',
      },
      {
        header: 'Tên lỗi máy',
        accessor: 'error_name',
      },
      {
        header: 'Nhóm lỗi',
        accessor: 'error_group_name',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Chọn lỗi máy',
        permission: COUPON_PERMISSION.SELECT_RS_ERROR,
        hidden: disabled,
        onClick: () => {
          setModalError(true);
        },
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: COUPON_PERMISSION.SELECT_RS_ERROR,
        hidden: disabled,
        onClick: (value) => {
          dispatch(
            showConfirmModal([`Xoá ${value?.error_name} ra khỏi danh sách lỗi ?`], () => {
              const error_list = _.cloneDeep(methods.watch('error_list'));
              methods.setValue(
                'error_list',
                error_list.filter((err) => parseInt(err?.error_id) !== parseInt(value?.error_id)),
              );
              return;
            }),
          );
        },
      },
    ];
  }, []);

  return (
    <React.Fragment>
      <BWAccordion title={title}>
        <div className='bw_frm_box'>
          <div className='bw_col_12'>
            <div className='bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_all_error' />
                <span />
                Áp dụng cho tất cả lỗi máy
              </label>
            </div>
            {!Boolean(methods.watch('is_all_error')) && (
              <div className='bw_flex bw_align_items_center'>
                <label className='bw_radio'>
                  <input
                    disabled={disabled}
                    onChange={() => {
                      methods.setValue('is_type_error', TYPE_ERROR.ISAPPOINTERROR);
                    }}
                    checked={methods.watch('is_type_error') === TYPE_ERROR.ISAPPOINTERROR}
                    type='radio'
                    name='bw_type'
                  />
                  <span></span>Sửa chữa tất cả các lỗi máy trong DS dưới đây
                </label>
                <label className='bw_radio'>
                  <input
                    disabled={disabled}
                    onChange={() => {
                      methods.setValue('is_type_error', TYPE_ERROR.ISANYERROR);
                    }}
                    checked={methods.watch('is_type_error') === TYPE_ERROR.ISANYERROR}
                    type='radio'
                    name='bw_type'
                  />
                  <span></span>Sửa chữa bất kỳ lỗi máy trong DS dưới đây
                </label>
              </div>
            )}
          </div>
        </div>
        {!Boolean(methods.watch('is_all_error')) && (
          <DataTable
            hiddenActionRow
            noPaging
            noSelect
            data={methods.watch('error_list')}
            columns={columns}
            loading={loading}
            actions={actions}
          />
        )}
      </BWAccordion>
      {modalError && (
        <CouponRsErrorModal
          open={modalError}
          onClose={() => {
            setModalError(false);
            methods.unregister('search');
          }}
        />
      )}
    </React.Fragment>
  );
};

CouponRsError.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default CouponRsError;
