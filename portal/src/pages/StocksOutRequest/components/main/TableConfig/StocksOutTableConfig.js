import React, { useCallback, useMemo, useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import CheckAccess from 'navigation/CheckAccess';
import BWButton from 'components/shared/BWButton/index';
import { InputNumber } from 'antd';
import { showToast } from 'utils/helpers';
import { toast } from 'react-toastify';
import { Checkbox , Button as AntButton } from 'antd';
import styled from 'styled-components';

const StocksOutTableConfig = ({
  // show left
  title,
  columns,
  data,
  actions,

  noSelect,
  noPaging,
  defaultDataSelect,
  page,
  totalPages,
  totalItems,
  itemsPerPage,
  onChangeSelect,
  onChangePage,
  maxSelect,
  handleBulkAction,
}) => {

  const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #576CBC;
    border-color: #576CBC;
  }
`

  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(parseInt(page));
  const [dataSelect, setDataSelect] = useState(defaultDataSelect ?? []);
  const rowAction = useMemo(() => {
    return (actions ?? []).filter((p) => !p.globalAction && !Boolean(typeof p.hidden !== 'function' && p.hidden));
  }, [actions]);

  const renderRowAction = useCallback(
    (valueRender) => {
      return (rowAction ?? [])?.map((action) => {
        const { hidden, disabled, permission, onClick, color, icon } = action;
        return (
          <CheckAccess permission={permission}>
            <a
              disabled={typeof disabled === 'function' ? disabled?.(valueRender) : disabled}
              onClick={(_) => onClick?.(valueRender)}
              style={{
                marginRight: '2px',
                display: `${typeof hidden === 'function' && hidden(valueRender) ? 'none' : ''}`,
              }}
              className={`bw_btn_table bw_${color}`}>
              <i className={`fi ${icon}`}></i>
            </a>
          </CheckAccess>
        );
      });
    },
    [rowAction],
  );

  const handleSelectedAll = ({ target: { checked } }) => {
      const _dataSelect = dataSelect;
      const _removeItem = _dataSelect.filter(item => !data.find(i=> i.product_imei_code === item?.product_imei_code))
      if(checked && [..._dataSelect,...data]?.length > maxSelect){
          showToast.error('Số lượng sản phẩm đã tối đa!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
          return;
      }
      setDataSelect((prev) => checked ? [...prev,...data] : (dataSelect?.length > data?.length ? _removeItem : []))
  };


  const renderData = useCallback(
    (valueRender, keyRender) => {
      let _dataSelect = [...dataSelect];
      const findIndex = _dataSelect.findIndex((o) => {
        if (o?.product_imei_code) {
          return valueRender?.product_imei_code === o?.product_imei_code;
        } else if (o?.material_imei_code) {
          return valueRender?.material_imei_code === o?.material_imei_code;
        }
      });

      const flag = findIndex >= 0;
      return (
        <tr className={flag ? 'bw_checked' : ''}>
          {!noSelect && (
            <td className='bw_sticky bw_check_sticky bw_text_center'>
              <label className='bw_checkbox'>
                <input
                  key={keyRender}
                  onChange={() => {
                    if (flag) {
                      _dataSelect.splice(findIndex, 1);
                      setDataSelect(_dataSelect);
                    } else {
                      if (maxSelect === dataSelect.length) {
                        showToast.error('Số lượng sản phẩm đã tối đa!', {
                          position: 'top-right',
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: 'colored',
                        });
                        return;
                      }
                      setDataSelect([..._dataSelect, valueRender]);
                    }
                  }}
                  type='checkbox'
                  checked={flag}
                />
                <span></span>
              </label>
            </td>
          )}
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
          {Boolean(rowAction.length) && (
            <td className='bw_sticky bw_action_table bw_text_center'>{renderRowAction(valueRender)}</td>
          )}
        </tr>
      );
    },
    [columns, dataSelect],
  );

  useEffect(() => {
    onChangeSelect?.(dataSelect);
  }, [onChangeSelect, dataSelect]);

  useEffect(() => {
    setCurrentPage(parseInt(page));
  }, [page]);

  const totalShowRecord = useMemo(() => {
    if (data.length < itemsPerPage) {
      return data.length;
    } else if (itemsPerPage > totalItems) {
      return totalItems;
    } else {
      return itemsPerPage;
    }
  }, [data, itemsPerPage, totalItems]);

  const handeChangePage = useCallback(() => {
    if (parseInt(currentPage) !== parseInt(page)) onChangePage(currentPage);
  }, [currentPage, page]);

  const onCheckAllChange = (e) => {
    // let list = convertArrayToObjectShopeeOrder(data);
    setDataSelect(e.target.checked ? data : []);
  };

  const totalChecked = data.filter((_item) => dataSelect.find(i=> i.product_imei_code === _item?.product_imei_code)).length;


  return (
    <div className='bw_box_card bw_mt_2'>
      <div className='bw_row bw_mb_2 bw_align_items_center'>
        <div className='bw_col_6'>{title}</div>
        <div className='bw_col_6 bw_flex bw_justify_content_right'>
          {actions
            ?.filter((p) => p.globalAction && !p.hidden)
            .map((props, i) => (
              <BWButton
                style={{
                  marginLeft: '5px',
                }}
                key={i}
                {...props}
              />
            ))}
        </div>
      </div>
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <tr>
              {!noSelect && (
                <th className='bw_sticky bw_check_sticky bw_text_center'>
                <label className='bw_checkbox'>
                  <input
                    type='checkbox'
                    onChange={handleSelectedAll}
                    checked={totalChecked > 0 && totalChecked == data?.length ? true : false}
                  />
                  <span></span>
                </label>
              </th>
              )}

              {columns?.map((p) => (
                <th className={p?.classNameHeader}>{p?.header}</th>
              ))}
              {Boolean(rowAction.length) && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
            </tr>
          </thead>

          {false ? (
            <tbody>{/* <BWLoader isPage={false} /> */}</tbody>
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
                type='button'
                disabled={!(currentPage !== 1)}
                onClick={() => {
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
                type='button'
                disabled={parseInt(totalPages) === parseInt(currentPage)}
                onClick={() => {
                  onChangePage(parseInt(currentPage) + 1);
                }}
                className={!(parseInt(totalPages) === parseInt(currentPage)) ? 'bw_active' : ''}>
                <span className='fi fi-rr-angle-small-right'></span>
              </button>
            </div>
          </div>
        </div>
      )}
      <span
        id='trigger-add-stock-out'
        onClick={() => {
          handleBulkAction(dataSelect);
        }}></span>
    </div>
  );
};

StocksOutTableConfig.propTypes = {
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

  /** Table actions */
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
      icon: PropTypes.node,
      content: PropTypes.string,
      onClick: PropTypes.func,
      color: PropTypes.string,
      globalAction: PropTypes.bool,
      disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
      hidden: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
      permissions: PropTypes.string,
    }),
  ),

  /** on row click */
  onRowClick: PropTypes.func,

  /** number of pages (controlled pagination) */
  pageCount: PropTypes.number,

  /** number of rows (controlled pagination) */
  totalCounts: PropTypes.number,

  /** No Paging flag */
  noPaging: PropTypes.bool,
};

StocksOutTableConfig.defaultProps = {
  data: [],
};

export default StocksOutTableConfig;
