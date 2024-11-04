import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext } from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';
import usePagination from 'hooks/usePagination';

import { PERMISSION } from 'pages/Customer/utils/constants';
import { useCustomerContext } from 'pages/Customer/utils/context';
import ModalAddHobbies from '../modals/ModalAddHobbies';
import BWAccordion from 'components/shared/BWAccordion/index';
import { deleteHobbiesRelatives } from 'services/customer.service';
import { showToast } from 'utils/helpers';

const TableHobbies = ({ title, disabled, onRefresh }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();

  const { isOpenModalHobbies, openModalHobbies, customerHobbies, setCustomerState } = useCustomerContext();

  const { rows, itemsPerPage, page, onChangePage, totalPages, totalItems } = usePagination({ data: methods.watch('customer_hobbies') });

  useEffect(() => {
    methods.setValue('customer_hobbies', customerHobbies);
  }, [customerHobbies]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        formatter: (p, index) => index + 1,
      },
      {
        header: 'Sở thích',
        accessor: 'hobbies_name'
      },
      {
        header: 'Giá trị',
        accessor: 'hobbies_value_list',
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
        content: 'Thêm sở thích',
        permission: PERMISSION.ADD,
        hidden: disabled,
        onClick: () => openModalHobbies(true),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: PERMISSION.DEL,
        hidden: disabled,
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                // setCustomerState(prev => ({ ...prev, customerHobbies: prev.customerHobbies.filter(_ => _.hobbies_id !== p.hobbies_id) }))
                await deleteHobbiesRelatives(p?.account_hobbies_id).then(() => {
                  showToast.success('Xóa thành công');
                  onRefresh();
                }).catch((e) => {
                  showToast.error(e.message || 'Xóa thất bại, vui lòng kiểm tra lại!');
                })
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
      {isOpenModalHobbies && <ModalAddHobbies />}
    </BWAccordion>
  );
};

export default TableHobbies;
