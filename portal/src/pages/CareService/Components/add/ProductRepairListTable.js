import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';

import { showConfirmModal } from 'actions/global';
import BWAccordion from 'components/shared/BWAccordion/index';
import DataTable from 'components/shared/DataTable/index';

import SelectProductRepair from './modals/SelectProductRepair/SelectProductModal';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import usePagination from 'hooks/usePagination';
import { PURCHASE_REQUISITION_PERMISSION } from 'pages/PurchaseRequisition/utils/constants';
import { formatPrice } from 'utils/index';

const PurchaseRequisitionProductListTable = ({ disabled }) => {
  const methods = useFormContext();
  const {
    watch,
    setValue,
    control
  } = methods;

  const { remove } = useFieldArray({ control, name: 'product_list' });
  const dispatch = useDispatch();
  const [isShowSelectProductModal, setIsShowSelectProductModal] = useState(false);
  const pagination = usePagination({ data: methods.watch('product_list') });

  const updateTotalMoney = useCallback(() => {
    const product_list = watch('product_list');
    //Tổng giá trị
    const total_money = product_list?.reduce((acc, cur) => acc + cur.total_money, 0) || 0;
    setValue('total_money', total_money);
  },
    [setValue, watch],
  );

  useEffect(() => {
    const productList = methods.getValues('product_list');
    if (productList) {
      updateTotalMoney();
    }
  }, [methods, setValue]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => p.dataIndex + 1,
      },
      {
        header: 'Mã sản phẩm',
        formatter: (_, index) => methods.watch(`product_list.${_.dataIndex}.product_id`),
      },
      {
        header: 'Tên sản phẩm',
        formatter: (_, index) => methods.watch(`product_list.${_.dataIndex}.product_name`),
      },
      {
        header: 'Giá sản phẩm',
        formatter: (_, index) => {
          const price = methods.watch(`product_list.${_.dataIndex}.price`);
          return formatPrice(price, false, ',');
        }
      },

      {
        header: 'Số lượng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => (
          <FormNumber
            style={{
              maxWidth: '100%',
            }}
            field={`product_list.${_.dataIndex}.quantity`}
            disabled={disabled}
            bordered={true}
            onChange={(value) => {
              setValue(`product_list.${_.dataIndex}.total_money`, value * methods.watch(`product_list.${_.dataIndex}.price`));
              setValue(`product_list.${_.dataIndex}.quantity`, value)
              updateTotalMoney();
            }}
          />
        ),
      },
      {
        header: 'Tổng thành tiền',
        formatter: (_, index) => {
          const totalMoney = methods.watch(`product_list.${_.dataIndex}.total_money`);
          return formatPrice(totalMoney, false, ',');
        }
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
        content: 'Chọn sản phẩm',
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
            showConfirmModal(['Xoá sản phẩm này?'], () => {
              remove(index);
              updateTotalMoney()
            }),
          ),
      },
    ];
  }, [remove, disabled, dispatch, setIsShowSelectProductModal]);

  return (
    <React.Fragment>
      <BWAccordion title='Sản phẩm sửa chữa'>
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
        <SelectProductRepair
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
