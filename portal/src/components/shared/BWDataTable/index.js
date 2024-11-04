import React from 'react';
import styled from 'styled-components';
import { Pagination, Table } from 'antd';

const PaginationStyled = styled(Pagination)`
  display: flex;
  justify-content: right;

  margin-top: 20px;
  .ant-pagination-item-link {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ant-pagination-total-text {
    width: 80%;
  }
  .ant-pagination-simple-pager {
    height: 35px !important;
    width: 10%;
  }
  .ant-pagination-prev,
  .ant-pagination-next {
    height: auto !important;
    line-height: 3 !important;
    width: 5%;
  }
`;

const TableStyle = styled(Table)`
  .ant-table-thead th.ant-table-cell {
    padding: 10px 16px;
    text-align: center;
  }

  .ant-table-tbody td.ant-table-cell {
    padding: 10px 16px;
  }

  .table-row-light {
    background-color: #ffffff;
  }
  .table-row-dark {
    background-color: #f8f8f8;
  }
  .ant-table-tbody .ant-table-row .table-row-dark::hover {
    background-color: #f2f2f2;
  }
  .ant-table-thead .ant-table-cell {
    background-color: #0b2447;
    color: white;
    font-size: 0.85rem;
    font-weight: 700;
    line-height: 1.3125rem;
  }
  .ant-table-thead th.ant-table-cell:first-child {
    border-start-start-radius: 0px !important;
  }
  .ant-table-thead th.ant-table-cell:last-child {
    border-start-end-radius: 0px !important;
  }
  .ant-table-thead .ant-table-cell {
    border: none !important;
  }
`;

function BWDataTable({
  data,
  total,
  pageIndex,
  pageSize,
  columns,
  loading,
  rowKey,
  handleChangePage,
  pagination = true,
}) {
  return (
    <React.Fragment>
      <TableStyle
        columns={columns}
        dataSource={data}
        bordered
        rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
        loading={loading}
        rowKey={(record) => record[rowKey]}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />

      {pagination && data && data.length > 0 ? (
        <PaginationStyled
          simple
          showSizeChanger
          total={total}
          defaultCurrent={pageIndex ?? 1}
          current={pageIndex ?? 1}
          defaultPageSize={pageSize ?? 25}
          //locale={{ items_per_page: 'dòng' }}
          showTotal={(total) => (
            <div className='bw_show_table_page'>
              <p style={{ paddingTop: '5px' }}>
                Show {data ? data.length : pageIndex}/{total} records
              </p>
            </div>
          )}
          onChange={(current, size) => {
            handleChangePage(current, size);
          }}
          onShowSizeChange={(current, size) => handleChangePage(current, size)}
        />
      ) : null}
    </React.Fragment>
  );
}

export default BWDataTable;
