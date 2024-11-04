import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import BWLoader from 'components/shared/BWLoader/index';

const TableOrderStatusTable = ({
  // show left
  loading,
  columns,
  data,

  noPaging,
  page,
  totalPages,
  totalItems,
  itemsPerPage,
  onChangePage,
  itemSelected,
  setItemSelected,
}) => {
  const handleSelectedAll = ({ target: { checked } }) => {
    let _selected = {};
    if (checked) {
      _selected = { ...itemSelected };
      data.map((_item) => {
        _selected['key' + _item.order_status_id] = _item;
      });
    }
    setItemSelected(_selected);
  };

  const handleSelected = useCallback(
    (valueRender, checked) => {
      let _selected = { ...itemSelected };
      if (checked) {
        _selected['key' + valueRender?.order_status_id] = valueRender;
      } else {
        delete _selected['key' + valueRender?.order_status_id];
      }

      setItemSelected(_selected);
    },
    [itemSelected, setItemSelected],
  );

  const renderData = useCallback(
    (valueRender, keyRender) => (
      <tr>
        <td className='bw_sticky bw_check_sticky bw_text_center'>
          <label className='bw_checkbox'>
            <input
              key={keyRender}
              onChange={({ target: { checked } }) => handleSelected(valueRender, checked)}
              type='checkbox'
              checked={itemSelected['key' + valueRender?.order_status_id] ? true : false}
            />
            <span></span>
          </label>
        </td>
        {columns?.map((column, key) => {
          if (column.formatter) {
            return (
              <td className={column?.classNameBody} key={`${keyRender}${key}`}>
                {column?.formatter(valueRender)}
              </td>
            );
          } else if (column.accessor) {
            return (
              <td className={column?.classNameBody} key={`${keyRender}${key}`}>
                {valueRender[column.accessor]}
              </td>
            );
          } else {
            return <td className={column?.classNameBody} key={`${keyRender}${key}`}></td>;
          }
        })}
      </tr>
    ),
    [columns, itemSelected, handleSelected],
  );

  const totalChecked = data.filter((_user) => itemSelected['key' + _user?.order_status_id]).length;

  return (
    <>
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <th className='bw_sticky bw_check_sticky bw_text_center'>
              <label className='bw_checkbox'>
                <input
                  type='checkbox'
                  onChange={handleSelectedAll}
                  checked={totalChecked > 0 && totalChecked == data.length ? true : false}
                />
                <span></span>
              </label>
            </th>
            {columns?.map((p) => (
              <th className={p?.classNameHeader}>{p?.header}</th>
            ))}
          </thead>

          {loading ? (
            <tbody>
              <BWLoader isPage={false} />
            </tbody>
          ) : (
            <tbody>
              {data.length ? (
                data?.map((value, key) => {
                  return renderData(value, key);
                })
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className='bw_text_center'>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
      {!noPaging && (
        <div className='bw_row bw_mt_2 bw_show_table_page'>
          <div className='bw_col_6'>
            <p>
              Show {itemsPerPage}/{totalItems} records
            </p>
          </div>
          <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center bw_mb_1'>
            <div className='bw_nav_table'>
              <button
                type='button'
                disabled={!(Boolean(page) && parseInt(page) !== 1)}
                onClick={() => {
                  onChangePage(parseInt(page) - 1);
                }}
                className={Boolean(page) && parseInt(page) !== 1 && 'bw_active'}>
                <span className='fi fi-rr-angle-small-left'></span>
              </button>
              <input type='number' value={parseInt(page)} step='1' max={totalPages} />
              <span className='bw_all_page'>/ {totalPages}</span>
              <button
                type='button'
                disabled={parseInt(totalPages) === parseInt(page)}
                onClick={() => {
                  onChangePage(parseInt(page) + 1);
                }}
                className={!(parseInt(totalPages) === parseInt(page)) && 'bw_active'}>
                <span className='fi fi-rr-angle-small-right'></span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

TableOrderStatusTable.propTypes = {
  /** Title of table */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

  /** Array of table's columns */
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,

  /** Array of table's data */
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,

  /** Decide if table is selectable */
  selectable: PropTypes.bool,
  selectedHidden: PropTypes.bool,
  onSelectionChange: PropTypes.func,

  /** Indicate table's loading state */
  loading: PropTypes.bool,
};

export default TableOrderStatusTable;
