import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import BWLoader from 'components/shared/BWLoader/index';
import { InputNumber } from 'antd';

const ModelTable = ({
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
  itemSelected = {},
  setItemSelected,
}) => {

  const [currentPage, setCurrentPage] = useState(parseInt(page));

  const handleSelectedAll = ({ target: { checked } }) => {
    let _selected = {};
    if (checked) {
      _selected = { ...itemSelected };
      data.map((_item) => {
        _selected[_item.product_id] = { ..._item, quantity: 1, total_money: _item.price };
      });
    }
    setItemSelected(_selected);
  };
  const handleSelected = (valueRender, checked) => {
    let _selected = { ...itemSelected };
    if (checked) {
      _selected[valueRender?.product_id] = valueRender;
    } else {
      delete _selected[valueRender?.product_id];
    }

    setItemSelected(_selected);
  };

  const renderData = useCallback(
    (valueRender, keyRender) => (
      <tr>
        <td className='bw_sticky bw_check_sticky bw_text_center'>
          <label className='bw_checkbox'>
            <input
              key={keyRender}
              onChange={({ target: { checked } }) => handleSelected(valueRender, checked)}
              type='checkbox'
              checked={itemSelected[valueRender?.product_id] ? true : false}
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
    [columns, itemSelected],
  );

  useEffect(() => {
    setCurrentPage(parseInt(page));
  }, [page]);

  const handeChangePage = useCallback(() => {
    if (parseInt(currentPage) !== parseInt(page)) onChangePage(currentPage);
  }, [currentPage, page]);

  const totalShowRecord = useMemo(() => {
    if (data.length < itemsPerPage) {
      return data.length;
    } else if (itemsPerPage > totalItems) {
      return totalItems;
    } else {
      return itemsPerPage;
    }
  }, [data, itemsPerPage, totalItems]);

  const totalChecked = data.filter((_product) => itemSelected[_product?.product_id]).length;

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
              Show {totalShowRecord}/{totalItems} records
            </p>
          </div>
          <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center'>
            <div className='bw_nav_table'>
              <button
                disabled={!(currentPage !== 1)}
                onClick={(e) => {
                  e.preventDefault()
                  onChangePage(parseInt(currentPage) - 1);
                }}
                className={currentPage !== 1 ? 'bw_active' : ''}>
                <span className='fi fi-rr-angle-small-left'></span>
              </button>
              <InputNumber
                min={1}
                style={{
                  marginRight: '6px',
                }}
                onChange={(e) => {
                  setCurrentPage(e);
                }}
                onPressEnter={() => onChangePage(currentPage)}
                onBlur={() => handeChangePage()}
                value={currentPage}
                max={totalPages}
              />
              <span className='bw_all_page'>/ {totalPages}</span>
              <button
                disabled={parseInt(totalPages) === parseInt(currentPage)}
                onClick={(e) => {
                  e.preventDefault()
                  onChangePage(parseInt(currentPage) + 1);
                }}
                className={!(parseInt(totalPages) === parseInt(currentPage)) ? 'bw_active' : ''}>
                <span className='fi fi-rr-angle-small-right'></span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ModelTable.propTypes = {
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

export default ModelTable;
