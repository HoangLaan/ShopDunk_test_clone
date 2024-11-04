import React from 'react';

const ProductListTable = () => {
  const columns = [
    {
      header: 'Mã sản phẩm',
      formatter: (_, index) => index + 1,
    },
    {
      header: 'Model',
      accessor: 'stocks_review_level_name',
    },
    {
      header: 'Tên sản phẩm',
      accessor: 'stocks_review_level_name',
    },
    {
      header: 'Ngành hàng',
      accessor: 'stocks_review_level_name',
    },
    {
      header: 'Đơn vị tính',
      accessor: 'stocks_review_level_name',
    },
  ];
  return <DataTable loading={false} noSelect noActions columns={columns ?? []} data={[12]} />;
};

export default ProductListTable;
