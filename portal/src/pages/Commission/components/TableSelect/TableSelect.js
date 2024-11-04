import React from 'react';
import { Pagination } from 'antd';

function TableSelect({
  isCheckAll,
  handleCheckAll,
  items,
  initValues,
  selectId,
  handleSelectedItem,
  itemSelected,
  itemsPerPage,
  data,
  totalPages,
  totalItems,
  handleChangePage,

  columns,
}) {
  return (
    <div className='bw_box_card bw_mt_1'>
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <tr>
              <th className='bw_sticky bw_check_sticky'>
                <label className='bw_checkbox'>
                  <input
                    type='checkbox'
                    name='checkAll'
                    checked={isCheckAll()}
                    onChange={handleCheckAll}
                    value={'all'}
                  />
                  <span></span>
                </label>
              </th>
              {columns.map((column) => (
                <th key={column.key}>{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length > 0 &&
              items.map((item, i) => {
                const index = initValues?.findIndex((x) => parseInt(x?.[selectId]) === parseInt(item?.[selectId]));
                const isAcceptSelect = index === -1 || !initValues;
                return (
                  <tr key={item?.[selectId]}>
                    <td className='bw_sticky bw_check_sticky'>
                      {isAcceptSelect && (
                        <label className='bw_checkbox'>
                          <input
                            type='checkbox'
                            onChange={handleSelectedItem}
                            checked={itemSelected[item?.[selectId]]}
                            name={`checkBox_${item?.[selectId]}`}
                            value={item?.[selectId]}
                          />
                          <span></span>
                        </label>
                      )}
                    </td>
                    {columns.map((column, index) =>
                      index === 0 ? (
                        <td key={column.key}>
                          <b>{item?.[column.key]}</b>
                        </td>
                      ) : (
                        <td key={column.key}>{item?.[column.key]}</td>
                      ),
                    )}
                  </tr>
                );
              })}
            {!items.length && (
              <tr>
                <td colSpan={columns.length + 1} className='bw_text_center'>
                  Không tìm thấy dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className='bw_row bw_mt_2 bw_show_table_page'>
        <div className='bw_col_6'>
          <p>
            {' '}
            Show {itemsPerPage * (data?.query?.page - 1) + 1} -{' '}
            {parseInt(data?.query?.page) === parseInt(totalPages) ? totalItems : itemsPerPage * data?.query?.page} of{' '}
            {totalItems} records
          </p>
        </div>
        <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center'>
          <Pagination
            simple
            current={data?.query?.page}
            total={totalItems}
            pageSize={data?.query?.itemsPerPage}
            onChange={handleChangePage}
          />
        </div>
      </div>
    </div>
  );
}

export default TableSelect;
