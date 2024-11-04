import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';

import { showConfirmModal } from 'actions/global';
import BWAccordion from 'components/shared/BWAccordion/index';
import DataTable from 'components/shared/DataTable/index';

import SelectProductModal from './modals/SelectPromotion/SelectProductModal';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import usePagination from 'hooks/usePagination';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { PURCHASE_REQUISITION_PERMISSION } from 'pages/PurchaseRequisition/utils/constants';

const PurchaseRequisitionProductListTable = ({ disabled }) => {
  const methods = useFormContext();
  const { control } = methods;
  const { remove } = useFieldArray({ control, name: 'promotion_list' });
  const dispatch = useDispatch();
  const [isShowSelectProductModal, setIsShowSelectProductModal] = useState(false);
  const pagination = usePagination({ data: methods.watch('promotion_list') });

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => p.dataIndex + 1,
      },
      {
        header: 'Mã khuyến mãi',
        formatter: (_, index) => methods.watch(`promotion_list.${_.dataIndex}.promotion_id`),
      },
      {
        header: 'Tên chương trình khuyến mãi',
        formatter: (_, index) => methods.watch(`promotion_list.${_.dataIndex}.promotion_name`),
      },
      {
        header: 'Ngày bắt đầu',
        formatter: (_, index) => methods.watch(`promotion_list.${_.dataIndex}.begin_date`),
      },

      {
        header: 'Ngày kết thúc',
        formatter: (_, index) => methods.watch(`promotion_list.${_.dataIndex}.end_date`),
      },

      {
        header: 'Thứ tự hiển thị',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => (
          <FormNumber
            style={{
              maxWidth: '100%',
            }}
            field={`promotion_list.${_.dataIndex}.orderindex`}
            // validation={{
            //   validate: (value, formValue) => value || 'Vui lòng nhập số lượng',
            // }}
            min={1}
            disabled={disabled}
            bordered={true}
          />
        ),
      },

    ],
    [methods, disabled],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Chọn CT Khuyến mãi',
        hidden: disabled,
        permission: PURCHASE_REQUISITION_PERMISSION.EDIT,
        onClick: () => setIsShowSelectProductModal(true),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: disabled,
        permission: PURCHASE_REQUISITION_PERMISSION.EDIT,
        onClick: (_, index) =>
          dispatch(
            showConfirmModal(['Xoá CT Khuyến mãi?'], () => {
              remove(index);
            }),
          ),
      },
    ];
  }, [remove, disabled, dispatch, setIsShowSelectProductModal]);

  return (
    <React.Fragment>
      <BWAccordion title='Thông tin khuyến mãi'>
        <DataTable
          style={{ marginTop: '0px' }}
          hiddenActionRow
          noSelect={true}
          actions={actions}
          columns={columns}
          key={pagination.page}
          data={pagination.rows}
          totalPages={pagination.totalPages}
          itemsPerPage={pagination.itemsPerPage}
          page={pagination.page}
          totalItems={pagination.totalItems}
          onChangePage={pagination.onChangePage}
        />
      </BWAccordion>
      {isShowSelectProductModal && (
        <SelectProductModal
          onClose={() => {
            setIsShowSelectProductModal(false);
          }}
        />
      )}
    </React.Fragment>
  );
};

PurchaseRequisitionProductListTable.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default PurchaseRequisitionProductListTable;
