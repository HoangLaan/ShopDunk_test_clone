import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import BWLoader from 'components/shared/BWLoader/index';

const ShiftModelTable = ({
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
        _selected[_item.user_name] = _item;
      });
    }
    setItemSelected(_selected);
  };
  const handleSelected = (valueRender, checked) => {
    let _selected = { ...itemSelected };

    if (checked) {
      _selected[valueRender?.user_name] = valueRender;
    } else {
      delete _selected[valueRender?.user_name];
    }

    setItemSelected(_selected);
  };

  const totalShowRecord = useMemo(() => {
    if (data.length < itemsPerPage) {
      return data.length;
    } else if (itemsPerPage > totalItems) {
      return totalItems;
    } else {
      return itemsPerPage;
    }
  }, [data, itemsPerPage, totalItems]);

  const renderData = useCallback(
    (valueRender, keyRender) => (
      <tr>
        <td className='bw_sticky bw_check_sticky bw_text_center'>
          <label className='bw_checkbox'>
            <input
              key={keyRender}
              onChange={({ target: { checked } }) => handleSelected(valueRender, checked)}
              type='checkbox'
              checked={itemSelected[valueRender?.user_name] ? true : false}
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

  const totalChecked = data.filter((_user) => itemSelected[_user?.user_name]).length;

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
              {data?.map((value, key) => {
                return renderData(value, key);
              })}
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

ShiftModelTable.propTypes = {
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

export default ShiftModelTable;
