import { useState } from 'react';

export function useModalSelect({ data, setData, getData, items, itemSelected, selectId, setItemSelected }) {
  const handleChangePage = async (page) => {
    let _query = { ...data.query };
    _query.page = page;
    setData((t) => ({ ...t, query: _query }));
    getData(_query);
  };

  const isCheckAll = () => {
    let findItemSelected = (items || []).filter((p) => itemSelected[p?.[selectId]]);
    return findItemSelected.length === items.length;
  };

  const handleCheckAll = (e) => {
    let _itemSelected = { ...itemSelected };
    let { checked } = e.target;
    (items || []).forEach((e) => {
      if (checked) {
        _itemSelected[e?.[selectId]] = e;
      } else {
        delete _itemSelected[e?.[selectId]];
      }
    });
    setItemSelected(_itemSelected);
  };

  const handleSelectedItem = (e) => {
    let { checked, value: p } = e.target;
    let _itemSelected = { ...itemSelected };
    if (checked) {
      _itemSelected[p] = items.find((x) => parseInt(x?.[selectId]) === parseInt(p));
    } else {
      if (_itemSelected[p]) {
        delete _itemSelected[p];
      }
    }
    setItemSelected(_itemSelected);
  };

  const onChangeFilter = (filterParams) => {
    const _query = { ...data.query, ...filterParams };
    setData((t) => ({ ...t, query: _query }));
    getData(_query);
  };

  return {
    handleChangePage,
    isCheckAll,
    handleCheckAll,
    handleSelectedItem,
    onChangeFilter,
  };
}

export const usePagination = ({ data, itemsPerPage = 5 }) => {
  const [page, setPage] = useState(1);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const rows = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const onChangePage = (page) => {
    setPage(page);
  };

  return {
    rows,
    itemsPerPage,
    page,
    onChangePage,
    totalPages,
    totalItems,
  };
};
