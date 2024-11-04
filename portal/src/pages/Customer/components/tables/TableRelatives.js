import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';
import BWAccordion from 'components/shared/BWAccordion/index';
import ICON_COMMON from 'utils/icons.common';
import usePagination from 'hooks/usePagination';
import { showConfirmModal } from 'actions/global';

import { PERMISSION } from 'pages/Customer/utils/constants';
import { useCustomerContext } from 'pages/Customer/utils/context';
import ModalAddRelatives from '../modals/ModalAddRelatives';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions } from 'utils/helpers';
import { getOptionsRelationship } from 'services/customer.service';

const TableRelatives = ({ title, disabled }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { remove } = useFieldArray({
    control: methods.control,
    name: 'customer_relatives',
  });

  const { customerRelatives, isOpenModalRelatives, openModalRelatives } = useCustomerContext();
  const { rows, itemsPerPage, page, onChangePage, totalPages, totalItems } = usePagination({ data: methods.watch('customer_relatives') });

  const [optionsRelationship, setOptionsRelationship] = useState([]);

  useEffect(() => {
    const getDataOptions = async () => {
      const _optionsRelationship = await getOptionsRelationship();
      setOptionsRelationship(mapDataOptions(_optionsRelationship));
    };
    getDataOptions();
  }, []);

  useEffect(() => {
    methods.setValue('customer_relatives', customerRelatives);
  }, [customerRelatives]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        formatter: (p, index) => index + 1,
      },
      {
        header: 'Mã khách hàng',
        accessor: 'customer_code',
      },
      {
        header: 'Giới tính',
        formatter: (p) => (p?.gender === 1 ? 'Nam' : 'Nữ'),
      },
      {
        header: 'Họ tên',
        accessor: 'full_name',
      },
      {
        header: 'Mối quan hệ',
        formatter: (_, index) => {
          return (
            <FormSelect
              field={`customer_relatives.${index}.relationship_member_id`}
              list={optionsRelationship}
              validation={{
                required: 'Mối quan hệ là bắt buộc là bắt buộc',
              }}
            />
          );
        },
      },
      {
        header: 'Ngày sinh',
        accessor: 'birthday',
      },
      {
        header: 'Số điện thoại',
        accessor: 'phone_number',
      },
      {
        header: 'Email',
        accessor: 'email',
      },
    ],
    [optionsRelationship],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm mới người thân',
        permission: PERMISSION.ADD,
        hidden: disabled,
        onClick: () => openModalRelatives(true),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: PERMISSION.DEL,
        hidden: disabled,
        onClick: (p, index) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                remove(index)
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <BWAccordion title={title}>
      <DataTable
        noSelect={true}
        columns={columns}
        data={rows}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
      />
      {isOpenModalRelatives && <ModalAddRelatives />}
    </BWAccordion>
  );
};

export default TableRelatives;
