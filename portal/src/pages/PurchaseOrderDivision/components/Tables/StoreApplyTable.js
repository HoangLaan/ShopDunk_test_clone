import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import usePagination from 'hooks/usePagination';
import DataTable from 'components/shared/DataTable';
import ICON_COMMON from 'utils/icons.common';

import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getOptionSelected, mapDataOptions } from 'utils/helpers';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { PURCHASE_ORDER_DIVISION_PERMISSION } from 'pages/PurchaseOrderDivision/utils/constants';
import StoreApplyModal from '../Modals/StoreApplyModal';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import moment from 'moment';

const FIELD_LIST = 'store_apply_list';

const StoreApplyTable = ({ disabled , stockOption = []}) => {
  const methods = useFormContext();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalDataSelect, setModalDataSelect] = useState(methods.watch(FIELD_LIST));

  const pagination = usePagination({ data: methods.watch(FIELD_LIST), itemsPerPage: 10 });
  const { remove } = useFieldArray({ control: methods.control, name: FIELD_LIST });

  const product_list = methods.watch('product_list');

  const productOptions = useMemo(
    () => mapDataOptions(product_list, { labelName: 'product_name', valueName: 'product_id', valueAsString: true }),
    [product_list],
  );

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => p?.dataIndex + 1,
      },
      {
        header: 'Cửa hàng',
        accessor: 'store_name',
      },
      {
        header: 'Sản phẩm',
        formatter: (p) => (
          <FormSelect
            field={`store_apply_list.${p?.dataIndex}.product_id`}
            disabled={disabled}
            list={productOptions}
            onChange={(value) => {
              methods.clearErrors(`store_apply_list.${p?.dataIndex}.product_id`);
              methods.setValue(`store_apply_list.${p?.dataIndex}.product_id`, value);

              const product = getOptionSelected(
                productOptions,
                methods.watch(`store_apply_list.${p?.dataIndex}.product_id`),
              );

              methods.setValue(`store_apply_list.${p?.dataIndex}.unit_id`, product.unit_id);
              methods.setValue(`store_apply_list.${p?.dataIndex}.unit_name`, product.unit_name);
              methods.setValue(`store_apply_list.${p?.dataIndex}.quantity`, product.quantity);
            }}
          />
        ),
      },
      {
        header: 'ĐVT',
        formatter: (p) => methods.watch(`store_apply_list.${p?.dataIndex}.unit_name`),
      },
      {
        header: 'Số lượng yêu cầu',
        formatter: (p) => methods.watch(`store_apply_list.${p?.dataIndex}.quantity`),
      },
      {
        header: 'Số lượng chia',
        formatter: (p) => (
          <FormNumber
            min={0}
            className='bw_store_apply_table__division_quantity'
            field={`store_apply_list.${p?.dataIndex}.division_quantity`}
            disabled={disabled}
            bordered={true}
            validation={{
              required: 'Số lượng chia là bắt buộc',
            }}
          />
        ),
      },
      {
        header: 'Kho',
        formatter: (p) => (
          <FormSelect
            field={`store_apply_list.${p?.dataIndex}.stocks_id`}
            disabled={disabled}
            list={(stockOption || []).filter(item => item?.type != 9 && item?.store_id == methods.watch(`store_apply_list.${p?.dataIndex}.store_id`))}
            validation={{
              required: 'Kho chia của cửa hàng là bắt buộc',
            }}
          />
        ),
      },
      {
        header: 'Ngày dự kiến hàng về',
        formatter: (p) => (
          <FormDatePicker
          field={`store_apply_list.${p?.dataIndex}.expected_date`}
          placeholder={'dd/mm/yyyy'}
          style={{ width: '100%' }}
          format='DD/MM/YYYY'
          bordered={false}
          validation={methods.watch('division_type') === 2 ? {} : { required: `Ngày dự kiến hàng về là bắt buộc` }}
          disabledDate={(current) => {
            const customDate = moment().format("YYYY-MM-DD");
            return current && current < moment(customDate, "YYYY-MM-DD");
          }}
        />
        ),
      },
      {
        header: 'Ghi chú',
        formatter: (p) => (
          <FormInput
            className='bw_inp'
            field={`store_apply_list.${p?.dataIndex}.note`}
            placeholder='Nhập ghi chú'
            disabled={disabled}
          />
        ),
      },
    ],
    [productOptions],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Chọn cửa hàng',
        permission: PURCHASE_ORDER_DIVISION_PERMISSION.ADD,
        hidden: disabled,
        onClick: () => setIsOpenModal(true),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: PURCHASE_ORDER_DIVISION_PERMISSION.DEL,
        hidden: disabled,
        onClick: (p, index) => remove(index),
      },
    ];
  }, []);

  return (
    <Fragment>
      <DataTable
        key={pagination.page}
        noSelect={true}
        columns={columns}
        data={pagination.rows}
        actions={actions}
        totalPages={pagination.totalPages}
        itemsPerPage={pagination.itemsPerPage}
        page={pagination.page}
        totalItems={pagination.totalItems}
        onChangePage={pagination.onChangePage}
      />
      {isOpenModal && (
        <StoreApplyModal
          title={'Chọn cửa hàng'}
          area_list={methods.watch('area_list')}
          defaultDataSelect={modalDataSelect}
          setModalDataSelect={setModalDataSelect}
          onClose={() => setIsOpenModal(false)}
          onConfirm={() => {
            methods.setValue(FIELD_LIST, modalDataSelect || []);
            setIsOpenModal(false);
          }}
        />
      )}
    </Fragment>
  );
};

export default StoreApplyTable;
