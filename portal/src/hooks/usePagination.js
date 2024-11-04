import { useState } from 'react';

const usePagination = ({ data, itemsPerPage = 5 }) => {
  const _data = data?.length ? data.map((item, index) => ({ ...item, dataIndex: index })) : [];
  const [page, setPage] = useState(1);

  const totalItems = _data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const rows = _data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const onChangePage = (page) => {
    setPage(page);
  };

  return {
    items: rows,
    rows,
    itemsPerPage,
    page,
    onChangePage,
    totalPages,
    totalItems,
  };
};

export default usePagination;
