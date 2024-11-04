import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import BWLoader from 'components/shared/BWLoader/index';
import styled from 'styled-components';
import { InputNumber } from 'antd';

const InputNumberStyled = styled(InputNumber)`
  margin-right: 6px;
  .ant-input-number-handler-wrap {
    display: none !important;
  }
`;

const ModalTable = ({
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
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const handleSelectedAll = ({ target: { checked } }) => {
    let _selected = {};
    if (checked) {
      _selected = { ...itemSelected };
      data.map((_item) => {
        _selected[_item.imei] = _item;
      });
    }
    setItemSelected(_selected);
  };
  const handleSelected = (valueRender, checked) => {
    let _selected = { ...itemSelected };

    if (checked) {
      _selected[valueRender?.imei] = valueRender;
    } else {
      delete _selected[valueRender?.imei];
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
              checked={itemSelected[valueRender?.imei] ? true : false}
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

  const totalChecked = data.filter((_user) => itemSelected[_user?.imei]).length;

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
              Show {totalItems > 0 ? itemsPerPage : 0}/{totalItems} records
            </p>
          </div>
          <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center bw_mb_1'>
            <div className='bw_nav_table'>
              <button
                disabled={!(Boolean(currentPage) && parseInt(currentPage) !== 1)}
                onClick={() => {
                  onChangePage(parseInt(currentPage) - 1);
                }}
                className={Boolean(currentPage) && parseInt(currentPage) !== 1 && 'bw_active'}
                type='button'>
                <span className='fi fi-rr-angle-small-left'></span>
              </button>
              <InputNumberStyled
                min={1}
                onChange={(e) => {
                  setCurrentPage(e);
                }}
                onPressEnter={(e) => {
                  e.preventDefault();
                  onChangePage(currentPage);
                }}
                onBlur={() => onChangePage(currentPage)}
                value={currentPage}
                max={totalPages}
              />
              <span className='bw_all_page'>/ {totalPages}</span>
              <button
                disabled={parseInt(totalPages) === parseInt(currentPage)}
                onClick={() => {
                  onChangePage(parseInt(currentPage) + 1);
                }}
                className={!(parseInt(totalPages) === parseInt(currentPage)) && 'bw_active'}
                type='button'>
                <span className='fi fi-rr-angle-small-right'></span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ModalTable.propTypes = {
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

export default ModalTable;
