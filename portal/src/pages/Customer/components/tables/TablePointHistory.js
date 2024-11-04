import DataTable from 'components/shared/DataTable/index';
import { POINT_TYPE } from 'pages/Customer/utils/constants';
import { useMemo } from 'react';


const TablePointHistory = ({ type , dataRows , onChange}) => {
  
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        formatter: (p, index) => index + 1,
      },
      {
        header: `Lý do ${type === POINT_TYPE.CUMULATE ? 'tích' : 'tiêu'} điểm`,
        accessor: 'title',
      },
      {
        header: `Điểm ${type === POINT_TYPE.CUMULATE ? 'tích' : 'tiêu'} `,
        accessor: `${type === POINT_TYPE.CUMULATE ? 'plus_point' : 'sub_point'}`,
      },
      {
        header: 'Điểm  hiện tại',
        accessor: 'current_point',
      },
      {
        header: 'Tổng điểm',
        accessor: 'total_point',
      },
      {
        header: `Ngày ${type === POINT_TYPE.CUMULATE ? 'tích' : 'tiêu'} điểm`,
        accessor: 'created_date',
      },
    ],
    [type],
  );
  return (
    <DataTable
      noSelect
      columns={columns}
      loading={dataRows.loading}
      data={dataRows.items}
      totalPages={dataRows.totalPages}
      itemsPerPage={dataRows.itemsPerPage}
      page={dataRows.page}
      totalItems={dataRows.totalItems}
      onChangePage={(page) => onChange({ page })}
    />
  );
};

export default TablePointHistory;
