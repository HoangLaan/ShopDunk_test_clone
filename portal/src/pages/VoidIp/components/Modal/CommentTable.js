import React, { useMemo } from 'react';
import styled from 'styled-components';
import BWImage from 'components/shared/BWImage/index';
import DataTable from 'components/shared/DataTable';

const CustomStyle = styled.div`
  border: 1px dashed var(--borderColor);
  border-radius: 5px;
  padding: 10px;
  background: var(--whiteColor);
  margin-top: 10px;

  span {
    font-size: 12px;
    color: var(--mainColor);
  }

  .bw_change_items h4 {
    font-size: 15px;
    margin-bottom: 3px;
  }

  p {
    margin-top: 7px;
  }
`;

const StrollStyled = styled.div`
    height: 500px;
    overflow-y: scroll;
`

function CommentTable({ items, page, totalPages, setParams, totalItems, params, itemsPerPage }) {

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        formatter: (item, index) => index + 1,
      },
      {
        header: 'Ngày quan tâm',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên sản phẩm',
        accessor: 'product_name',
        classNameHeader: 'bw_text_center',
      }
    ],
    [],
  ); 

  return (
    <React.Fragment>

      <DataTable
        noSelect
        hiddenDeleteClick
        columns={columns}
        data={items}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={(page) => {
          setParams({
            ...params,
            page,
          });
        }}
      />
    </React.Fragment>
  );
}

export default CommentTable;
