import React, { useCallback, useMemo, useState, useEffect } from 'react';
import BWButton from '../BWButton';
import PropTypes from 'prop-types';
import CheckAccess from 'navigation/CheckAccess';
import _ from 'lodash';
import styled from 'styled-components';
import { InputNumber } from 'antd';
import { Empty } from 'antd';
import TrTable from './element/TrTable';
import { Tooltip } from 'antd';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

const DelListStyled = styled.span`
  display: ${(props) => (props?.hidden ? 'none' : '')};
  cursor: pointer;
  b {
    color: red;
  }
`;

const InputNumberStyled = styled(InputNumber)`
  margin-right: 6px;
  .ant-input-number-handler-wrap {
    display: none !important;
  }
`;

const Wrapper = styled.div`
  @keyframes loading {
    to {
      background-position-x: -30%;
    }
  }
  .loader {
    background-color: #ededed;
    height: 18px;
    border-radius: 7px;
    width: 100%;
  }
  td .loader {
    background-color: #ededed;
    background: linear-gradient(
        100deg,
        rgba(255, 255, 255, 0) 40%,
        rgba(255, 255, 255, 0.5) 50%,
        rgba(255, 255, 255, 0) 60%
      )
      #ededed;
    background-size: 200% 100%;
    background-position-x: 180%;
    animation: 1s loading ease-in-out infinite;
  }
`;

const DataTable = ({
  // show left
  loading,
  title,
  columns,
  data,
  styleAction,
  actions,
  fieldCheck,
  noSelect,
  noPaging,
  defaultDataSelect,
  showBulkButton,
  styleTitle,
  page,
  totalPages,
  totalItems,
  itemsPerPage,
  onChangeSelect,
  onChangePage,
  hiddenRowSelect,
  handleBulkAction = () => { },
  hiddenDeleteClick,
  getChildren,
  parentField,
  customSumRow = null,
  secondaryAction = undefined,
  uniqueSelect = false,
  ownId = '',
  isOrderProductList,
  refreshFlag,
  detailTr
}) => {
  const [currentPage, setCurrentPage] = useState(parseInt(page));
  const [dataSelect, setDataSelect] = useState(defaultDataSelect ?? []);
  //data first
  const queryPatch = new URLSearchParams(useLocation().search);
  const search = queryPatch.get('search');
  
  useEffect(() => {
    if(refreshFlag){
      setDataSelect([])
    }
  },[refreshFlag])
  
  const totalChecked = useMemo(() => {
    if (
      (Array.isArray(data) && data).filter((o) => {
        if (typeof hiddenRowSelect === 'function') {
          return !hiddenRowSelect(o);
        } else {
          return true;
        }
      }).length === 0
    ) {
      return false;
    }
    const dataFilter = dataSelect.filter((o) =>
      (data ?? []).some((p) => {
        if (fieldCheck) {
          return String(o[fieldCheck]) === String(p[fieldCheck]);
        } else {
          return _.isEqual(o, p);
        }
      }),
    );
    if (dataFilter.length === (data ?? []).filter((o) => !hiddenRowSelect?.(o)).length) {
      return true;
    }
    return false;
  }, [data, dataSelect]);

  const rowAction = useMemo(() => {
    return (actions ?? []).filter((p) => !p.globalAction && !Boolean(typeof p.hidden !== 'function' && p.hidden));
  }, [actions]);

  const colSpan = useMemo(() => {
    const spanSelect = noSelect ? 0 : 1;
    const spanRowAction = Boolean(rowAction.length) ? 1 : 0;
    return spanSelect + spanRowAction + (columns ?? []).length;
  }, [noSelect, rowAction]);

  const renderRowAction = useCallback(
    (valueRender, keyRender) => {
      return (rowAction ?? [])?.map((action) => {
        const { hidden, disabled, permission, onClick, color, icon, title } = action;
        const isHidden = typeof hidden === 'function' && hidden(valueRender);
        const isDisabled = isHidden ? true : typeof disabled === 'function' ? disabled?.(valueRender) : disabled;
        return action.tips ? (
          <CheckAccess permission={typeof permission === 'function' ? permission(valueRender) : permission}>
            {
              <Tooltip title={isHidden ? '' : action.tips}>
                <a
                  disabled={isDisabled}
                  onClick={(_) => (isDisabled ? {} : onClick?.(valueRender, keyRender))}
                  style={{
                    marginRight: '2px',
                    opacity: `${isHidden ? '0.25' : '1'}`,
                    cursor: `${isHidden ? 'default' : 'pointer'}`,
                  }}
                  title={title}
                  className={`bw_btn_table bw_${color}`}>
                  <i className={`fi ${typeof icon === 'function' ? icon(valueRender) : icon}`}></i>
                </a>
              </Tooltip>
            }
          </CheckAccess>
        ) : (
          <CheckAccess permission={typeof permission === 'function' ? permission(valueRender) : permission}>
            {
              <a
                disabled={isDisabled}
                onClick={(_) => (isDisabled ? {} : onClick?.(valueRender, keyRender))}
                style={{
                  marginRight: '2px',
                  opacity: `${isHidden ? '0.25' : '1'}`,
                  cursor: `${isHidden ? 'default' : 'pointer'}`,
                }}
                title={title}
                className={`bw_btn_table bw_${color}`}>
                <i className={`fi ${typeof icon === 'function' ? icon(valueRender) : icon}`}></i>
              </a>
            }
          </CheckAccess>
        );
      });
    },
    [rowAction],
  );

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
    (valueRender, keyRender) => {
      let _dataSelect = [...dataSelect];
      const findIndex = _dataSelect.findIndex((o) => {
        if (fieldCheck) {
          return String(o[fieldCheck]) === String(valueRender[fieldCheck]);
        } else {
          return _.isEqual(o, valueRender);
        }
      });

      const flag = findIndex >= 0;
      return (
        <TrTable
          colSpan={colSpan}
          keyRender={keyRender}
          flag={flag}
          noSelect={noSelect}
          hiddenRowSelect={hiddenRowSelect}
          _dataSelect={_dataSelect}
          setDataSelect={setDataSelect}
          columns={columns}
          valueRender={valueRender}
          findIndex={findIndex}
          rowAction={rowAction}
          renderRowAction={renderRowAction}
          getChildren={getChildren}
          parentField={parentField}
          onChangeSelect={onChangeSelect}
          uniqueSelect={uniqueSelect}
          detailTr={detailTr}
        />
      );
    },
    [columns, dataSelect, search],
  );

  const handleCheckAll = useCallback(() => {
    const _dataSelect = [...dataSelect];
    if (totalChecked) {
      for (let i of data) {
        const findIndex = _dataSelect.findIndex((o) => {
          if (fieldCheck) {
            return String(o[fieldCheck]) === String(i[fieldCheck]);
          } else {
            return _.isEqual(o, i);
          }
        });
        if (findIndex >= 0) {
          _dataSelect.splice(findIndex, 1);
        }
        setDataSelect(_dataSelect);
      }
    } else {
      for (let i of data) {
        if (!hiddenRowSelect?.(i)) {
          const findIndex = _dataSelect.findIndex((o) => {
            if (fieldCheck) {
              return String(o[fieldCheck]) === String(i[fieldCheck]);
            } else {
              return _.isEqual(o, i);
            }
          });
          if (findIndex < 0) {
            _dataSelect.push(i);
          }
          setDataSelect(_dataSelect);
        }
      }
    }
  }, [totalChecked, dataSelect, data]);

  useEffect(() => {
    onChangeSelect?.(dataSelect);
  }, [onChangeSelect, dataSelect]);

  useEffect(() => {
    setCurrentPage(totalPages ? parseInt(page) : totalPages);
  }, [page, totalPages]);

  const handeChangePage = useCallback(() => {
    if (parseInt(currentPage) !== parseInt(page)) onChangePage(currentPage);
  }, [currentPage, page]);

  const jsx_tbody = () => {
    const sumColumnIndexs = customSumRow?.reduce((acc, item) => {
      return acc.concat(
        item.colSpan > 1 ? Array.from({ length: item.colSpan }, (_, index) => index + item.index) : [item.index],
      );
    }, []);

    const jsx =
      data?.length > 0 ? (
        <tbody>
          {data?.map((value, key) => renderData(value, key))}
          {customSumRow ? (
            <tr>
              {columns
                ?.filter((item) => !item.hidden)
                ?.reduce((acc, item, _index) => {
                  const sumRecord = customSumRow.find((_) => _.index === _index + 1);
                  let currentValue = [];
                  if (sumRecord) {
                    currentValue.push(
                      <td colspan={sumRecord.colSpan ?? 1}>
                        <div
                          style={sumRecord.style ? { ...sumRecord.style, fontWeight: 'bold' } : { fontWeight: 'bold' }}>
                          {sumRecord?.value ?? sumRecord?.formatter(data)}
                        </div>
                      </td>,
                    );
                  } else if (!sumColumnIndexs?.includes(_index + 1)) {
                    currentValue.push(<td></td>);
                  }
                  return acc.concat(currentValue);
                }, [])}
            </tr>
          ) : null}
        </tbody>
      ) : (
        <tbody>
          <tr>
            <td colSpan={colSpan}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
            </td>
          </tr>
        </tbody>
      );

    return jsx;
  };

  return (
    <React.Fragment>
      <Wrapper className='bw_box_card'>
        <div className={isOrderProductList ? 'bw_row bw_align_items_center' : 'bw_row bw_mt_2 bw_mb_2 bw_align_items_center'}>
          <div className='bw_col_6' style={styleTitle}>
            {title}
            {Boolean(dataSelect.length) > 0 && (
              <div className='bw_show_record'>
                <p className='bw_choose_record'>
                  {showBulkButton && (
                    <button
                      className='bw_btn bw_btn_success'
                      style={{ marginRight: '8px' }}
                      type='button'
                      onClick={() => {
                        handleBulkAction(dataSelect);
                      }}>
                      <span className='fi fi-rr-add'></span> Chọn
                    </button>
                  )}
                  <b>{dataSelect.length}</b> đang chọn{' '}
                  <a id={`data-table-select${ownId ? `-${ownId}` : ''}`} onClick={() => {
                    setDataSelect([])
                  }}>
                    Bỏ chọn
                  </a>{' '}
                  {
                   !isOrderProductList &&
                      <DelListStyled
                        id='trigger-delete'
                        hidden={hiddenDeleteClick}
                        className='bw_red bw_delete'
                        onClick={() => {
                          handleBulkAction && handleBulkAction(dataSelect, 'delete');
                        }}>
                        | <b>Xoá tất cả</b>
                      </DelListStyled>
                  }
                </p>
              </div>
            )}
          </div>
          <div className='bw_col_6 bw_flex bw_justify_content_right bw_btn_group' style={styleAction}>
            {actions
              ?.filter((p) => p.globalAction && !p.hidden)
              .map((props, i) => (
                <CheckAccess permission={props?.permission}>
                  <BWButton
                    style={{
                      marginLeft: '3px',
                    }}
                    {...props}
                  />
                </CheckAccess>
              ))}
          </div>
        </div>
        <div className='bw_table_responsive'>
          <table className='bw_table'>
            <thead>
              <tr>
                {!noSelect && (
                  <th className='bw_sticky bw_check_sticky'>
                    {Boolean(data.filter((o) => !hiddenRowSelect?.(o)).length) && (
                      <label className='bw_checkbox'>
                        {!uniqueSelect
                          ? <>
                            <input type='checkbox' onChange={() => handleCheckAll()} checked={totalChecked} />
                            <span></span>
                          </>
                          : null
                        }

                      </label>
                    )}
                  </th>
                )}

                {columns
                  ?.filter((value) => !value.hidden)
                  .map((p, o) => (
                    <th style={p?.styleHeader} key={o} className={p?.classNameHeader ? p?.classNameHeader : ''}>
                      {p?.header}
                    </th>
                  ))}
                {Boolean(rowAction.length) && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
              </tr>
            </thead>

            {loading ? (
              <tbody>
                {Array.from(Array(10).keys())?.map(() => {
                  return (
                    <tr className='tr'>
                      {Array.from(Array(colSpan).keys())?.map(() => {
                        return (
                          <td className='td'>
                            <div className='loader'></div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              jsx_tbody()
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
                  disabled={!(currentPage !== 1) || !totalPages}
                  onClick={() => {
                    onChangePage(parseInt(currentPage) - 1);
                  }}
                  className={totalPages && currentPage !== 1 ? 'bw_active' : ''}>
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
      </Wrapper>
    </React.Fragment>
  );
};

DataTable.propTypes = {
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

DataTable.defaultProps = {
  data: [],
  onChangeSelect: () => { },
};

export default DataTable;
