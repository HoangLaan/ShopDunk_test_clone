import React, { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { showConfirmModal } from 'actions/global';
import ICON_COMMON from 'utils/icons.common';
import { ServicePackageType, ServicePackageTypeOptions } from 'pages/DiscountProgram/ultils/constant';

import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import DiscountProgramModal from './product/DiscountProgramModal';

const DiscountProgramServicePackage = ({ loading, disabled }) => {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);

  const service_package_list = watch('service_package_list');
  const is_free_service_package = watch('is_free_service_package');
  const is_apply_service_pack = watch('is_apply_service_pack');
  const product_list = watch('product_list');
  const isValid = Object.values(ServicePackageType).includes(+is_free_service_package || 0);

  useEffect(() => {
    if ((+is_free_service_package || 0) === ServicePackageType.FREE) {
      setValue('service_package_list', product_list);
    }
  }, [is_free_service_package, product_list, setValue]);

  const onChangeType = useCallback(
    (value) => {
      if ((+value || 0) === ServicePackageType.FREE) {
        setValue('service_package_list', product_list);
      } else if ((+value || 0) === ServicePackageType.ADD_TIME) {
        setValue('service_package_list', []);
      }
    },
    [product_list, setValue],
  );

  const columns = useMemo(
    () => [
      {
        header: 'Tên gói dịch vụ được ưu đãi kèm',
        classNameHeader: 'bw_text_center',
        formatter: (p, idx) => p.product_name,
      },
      {
        header: 'Hãng',
        classNameHeader: 'bw_text_center',
        formatter: (p, idx) => p.manufacture_name,
      },
      {
        header: 'Thời gian hưởng ưu đãi thêm',
        classNameHeader: 'bw_text_center',
        formatter: (p, idx) => (
          <div style={{ display: 'flex', gap: '5px' }}>
            <div>
              <FormNumber field={`service_package_list.[${idx}].time`} bordered disabled={disabled} />
            </div>
            <div>
              <FormSelect
                field={`service_package_list.[${idx}].time_type`}
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
        hidden: (+is_free_service_package || 0) !== ServicePackageType.ADD_TIME,
      },
    ],
    [disabled, is_free_service_package],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Chọn sản phẩm',
        permission: 'PO_DISCOUNT_PROGRAM_ADD',
        hidden: disabled || (+is_free_service_package || 0) !== ServicePackageType.ADD_TIME,
        onClick: () => {
          setShowModal(true);
        },
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        hidden: disabled || (+is_free_service_package || 0) !== ServicePackageType.ADD_TIME,
        permission: 'PO_DISCOUNT_PROGRAM_ADD',
        onClick: (value, idx) => {
          dispatch(
            showConfirmModal([`Xoá ${value?.product_name} khỏi danh sách mã khuyến mại áp dụng ?`], () => {
              let service_package_list = _.cloneDeep(methods.watch('service_package_list'));
              service_package_list?.splice(idx, 1);
              methods.setValue('service_package_list', service_package_list);
              return;
            }),
          );
        },
      },
    ];
  }, [methods, dispatch, disabled, is_free_service_package]);

  return (
    <div className='bw_frm_box bw_mt_1 bw_col_12'>
      <FormRadioGroup field='is_free_service_package' list={ServicePackageTypeOptions} onChange={onChangeType} />

      {Boolean(isValid) && (
        <DataTable
          hiddenActionRow
          noPaging
          noSelect
          loading={loading}
          data={service_package_list}
          columns={columns}
          actions={actions}
        />
      )}

      <FormInput
        hidden={true}
        disabled={disabled}
        type='text'
        field='check_service_package_list'
        style={{ lineHeight: 1, display: 'none' }}
        validation={{
          validate: (value) => {
            if (is_apply_service_pack) {
              if (!isValid) {
                return 'Chọn ít nhất 1 tuỳ chọn';
              }
              if (!service_package_list?.length) {
                return 'Gói dịch vụ là bắt buộc';
              }
            }

            return true;
          },
        }}
      />

      {showModal && (
        <DiscountProgramModal
          fieldProduct='service_package_list'
          onClose={() => {
            setShowModal(false);
            setValue(
              'service_package_list',
              (watch('service_package_list') || []).map((o) => ({
                ...o,
                time: o.time || 0,
                time_type: o.time_type || 0,
              })),
            );
          }}
        />
      )}
    </div>
  );
};

DiscountProgramServicePackage.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default DiscountProgramServicePackage;
