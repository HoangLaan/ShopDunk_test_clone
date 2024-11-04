import React, { useEffect, useState, useCallback } from 'react';
// components
import DataTable from 'components/shared/DataTable/index';
import { defaultPaging, defaultParams } from 'utils/helpers';
import { useFormContext } from 'react-hook-form'

export default function SelectTable({
  hiddenFilter,
  noLoadData,
  hiddenSelect,
  fieldCheck,
  fieldList,
  noPaging,
  columns,
  actionsFilter,
  actionsTable,
  getList,
  hiddenDeleteClick
}) {
  const methods = useFormContext();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState(defaultPaging);

  const [query, setQuery] = useState({
    ...defaultParams,
    itemsPerPage: 5
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const handleChangePage = (page) => {
    setQuery({ ...query, page });
  };
  const getListData = useCallback(() => {
    setLoading(true)
    getList(query).then((data) => {
      setDataList(data);
      setLoading(false)
    });
  }, [query]);
  useEffect(getListData, [getListData]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        {!hiddenFilter && <SelectFilter
          actions={actionsFilter}
          onChange={(value) => {
            setQuery({
              ...query,
              ...value,
            })
          }} />}
        <DataTable
          hiddenDeleteClick={hiddenDeleteClick}
          noSelect={hiddenSelect}
          noPaging={noPaging}
          fieldCheck={fieldCheck}
          defaultDataSelect={!noLoadData ? methods.watch(fieldList) : []}
          loading={loading}
          columns={columns}
          data={noLoadData ? methods.watch(fieldList) : items}
          actions={actionsTable}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onChangePage={handleChangePage}
          handleBulkAction={(e) => {
            methods.setValue(fieldList, e);
          }}
        />
      </div>
    </React.Fragment>
  );
}
