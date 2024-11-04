import DataTable from 'components/shared/DataTable/index';
import { useMemo } from 'react';

function CustomerContactTable({
  defaultDataSelect = [],
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onChangeSelect,
  noPaging = false,
  deleteData,
  onOpenModal,
  noAction,
  noSelect,
}) {
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        accessor: '',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center ',
        formatter: (item, index) => index + 1,
      },
      {
        header: 'Tên  người liên hệ',
        accessor: 'partner_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center ',
        formatter: (item) => item.last_name + ' ' + item.first_name,
      },
      {
        header: 'SĐT',
        accessor: 'phone_number',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Email',
        accessor: 'email',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Chức vụ',
        accessor: 'position',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
    ],
    [],
  );
  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'CRM_PARTNER_DEL',
        disabled: noAction,
        onClick: () => onOpenModal(),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'CRM_PARTNER_DEL',
        disabled: noAction,
        onClick: (_, d) => deleteData(_),
      },
    ];
  }, [deleteData, noAction, onOpenModal]);
  return (
    <DataTable
      loading={loading}
      columns={columns}
      data={data}
      defaultDataSelect={defaultDataSelect}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      actions={actions}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      onChangeSelect={onChangeSelect}
      noPaging={noPaging}
      noSelect={noSelect}
    />
  );
}

export default CustomerContactTable;
