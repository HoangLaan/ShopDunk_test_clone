import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useFormContext, useFieldArray } from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';
import BWAccordion from 'components/shared/BWAccordion/index';

import { PERMISSION } from 'pages/Customer/utils/constants';
import { getListAddressBook } from 'services/customer.service';
import usePagination from 'hooks/usePagination';
import { useCustomerContext } from 'pages/Customer/utils/context';
import ModalAddAddressBook from '../modals/ModalAddAddressBook';
import FormInput from 'components/shared/BWFormControl/FormInput';

const TableAddressBook = ({ title }) => {
  const methods = useFormContext();
  const { remove } = useFieldArray({
    control: methods.control,
    name: 'address_book_list',
  });
  const dispatch = useDispatch();
  const { isOpenModalAddressBook, openModalAddressBook, setCustomerState } = useCustomerContext();

  const { account_id: member_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [dataRows, setDataRows] = useState([]);

  const watchAddressBookList = methods.watch('address_book_list');
  const { rows, itemsPerPage, page, onChangePage, totalPages, totalItems } = usePagination({
    data: watchAddressBookList,
  });

  const loadData = useCallback(() => {
    if (member_id) {
      setLoading(true);
      getListAddressBook(member_id)
        .then(setDataRows)
        .finally(() => setLoading(false));
    }
  }, [member_id]);

  useEffect(() => {
    setCustomerState((prev) => ({ ...prev, refreshTableAddressBook: loadData }));
    loadData();
  }, [loadData]);

  useEffect(() => {
    methods.setValue('address_book_list', dataRows);
  }, [dataRows]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        formatter: (p, index) => index + 1,
      },
      {
        header: 'Giới tính',
        formatter: (p) => (p?.gender === 1 ? 'Nam' : 'Nữ'),
      },
      {
        header: 'Họ và tên',
        accessor: 'full_name',
      },
      {
        header: 'Địa chỉ',
        accessor: 'address_full',
      },
      {
        header: 'Số điện thoại',
        accessor: 'phone_number',
      },
      {
        header: 'Ghi chú',
        accessor: 'note',
      },
      {
        header: 'Địa chỉ mặc định',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => (
          <FormInput
            type='checkbox'
            field={`address_book_list.${index}.is_default`}
            onChange={(e) => {
              methods.clearErrors(`address_book_list.${index}.is_default`);
              (watchAddressBookList || []).forEach((_, index) =>
                methods.setValue(`address_book_list.${index}.is_default`, 0),
              );
              methods.setValue(`address_book_list.${index}.is_default`, e.target.checked ? 1 : 0);
            }}
          />
        ),
      },
    ],
    [watchAddressBookList],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm địa chỉ',
        permission: PERMISSION.ADD,
        onClick: () => openModalAddressBook(true),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: PERMISSION.DEL,
        onClick: (p, index) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                remove(index);
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
        loading={loading}
      />
      {isOpenModalAddressBook && <ModalAddAddressBook />}
    </BWAccordion>
  );
};

export default TableAddressBook;
