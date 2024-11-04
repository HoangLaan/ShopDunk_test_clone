import CheckAccess from 'navigation/CheckAccess';
import React, { useCallback, useEffect, useState } from 'react';
import { Empty } from 'antd';
import styled from 'styled-components';
const LabelCheckbox = styled.label``;
const ContentRender = styled.span`
  margin-left: ${(props) => props.levelRecursive};
  opacity: ${(props) => (props.disable ? '0.2' : '1')};
  cursor: ${(props) => (props.disable ? 'default' : 'pointer')};
`;

const TrTable = ({
  colSpan,
  keyRender,
  flag,
  noSelect,
  hiddenRowSelect,
  _dataSelect,
  setDataSelect,
  columns,
  valueRender,
  findIndex,
  rowAction,
  renderRowAction,
  getChildren,
  levelRecursive,
  parentField,
  onChangeSelect,
  uniqueSelect,
  detailTr
}) => {
  const [openExpaned, setOpenExpaned] = useState(false);
  const [dataExpaned, setDataExpaned] = useState(undefined);
  // const marginRecursive = levelRecursive ? `${levelRecursive * 5 + 10}px` : '10px';
  const [init, setInit] = useState(true);
  const marginRecursive = levelRecursive ? `${levelRecursive * 9 + 10}px` : '10px';
  const MIN_LENGTH_ACTION = 35;

  const jsx_render = () => {
    if (openExpaned) {
      if (Array.isArray(dataExpaned) && dataExpaned.length > 0) {
        return dataExpaned.map((valueR) => {
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
              valueRender={valueR}
              findIndex={findIndex}
              rowAction={rowAction}
              renderRowAction={renderRowAction}
              getChildren={getChildren}
              levelRecursive={(levelRecursive ? levelRecursive : 0) + 1}
              parentField={parentField}
            />
          );
        });
      } else {
        return (
          <tr>
            <td colSpan={colSpan}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
            </td>
          </tr>
        );
      }
    }
  };

  useEffect(() => {
    const expandColumn = columns.find((column) => column.expanded);
    if (expandColumn) {
      if (valueRender.child_count !== 0 && !openExpaned && init) {
        setOpenExpaned(true);
        if (!dataExpaned) {
          getChildren({
            parent_id: valueRender[`${parentField}`],
          }).then((data) => setDataExpaned(data?.items));
        }
      }
    }
  }, [columns, dataExpaned, getChildren, openExpaned, parentField, valueRender, init]);

  return (
    <>
      <tr key={keyRender} className={flag ? 'bw_checked' : ''} style={{cursor: detailTr ? 'pointer' : ''}} >
        {!noSelect && (
          <td className='bw_sticky bw_check_sticky'>
            <LabelCheckbox
              style={{
                marginRight: '2px',
                display: `${typeof hiddenRowSelect === 'function' && hiddenRowSelect(valueRender) ? 'none' : ''}`,
              }}
              className='bw_checkbox'>
              <input
                type='checkbox'
                checked={flag}
                key={keyRender}
                onChange={(e) => {
                  let dataCurrent;
                  if (flag) {
                    _dataSelect.splice(findIndex, 1);
                    setDataSelect(_dataSelect);
                    dataCurrent = _dataSelect;
                  } else {
                    if (uniqueSelect) {
                      setDataSelect([valueRender]);
                      dataCurrent = [valueRender];
                    } else {
                      setDataSelect([..._dataSelect, valueRender]);
                      dataCurrent = [..._dataSelect, valueRender];
                    }

                  }
                  onChangeSelect(dataCurrent, { ...valueRender, isChecked: e.target.checked ? 1 : 0 });
                }}
              />
              <span></span>
            </LabelCheckbox>
          </td>
        )}

        {columns
          ?.filter((value) => !value.hidden)
          .map((column, key) => {
            const className = column?.classNameBody ? column?.classNameBody : '';
            if (column.formatter) {
              return (
                <td
                  onClick={() =>(detailTr  && column?.accessor !== 'full_name') ?  window._$g.rdr(`/orders/detail/${valueRender?.order_id}`) : ''}
                  style={typeof column?.style === 'function' ? column?.style(valueRender) : column?.style}
                  className={className}
                  key={`${keyRender}${key}`}>
                  {column.expanded && (
                    <ContentRender
                      levelRecursive={marginRecursive}
                      disable={valueRender.child_count === 0}
                      onClick={() => {
                        // setOpenExpaned(!openExpaned);
                        // if (!dataExpaned) {
                        //   getChildren({
                        //     parent_id: valueRender[`${parentField}`],
                        //   }).then((data) => setDataExpaned(data?.items));
                        // }

                        if (valueRender.child_count !== 0) {
                          setOpenExpaned(!openExpaned);
                          setInit(false);
                          if (!dataExpaned) {
                            getChildren({
                              parent_id: valueRender[`${parentField}`],
                            }).then((data) => setDataExpaned(data?.items));
                          }
                        }
                      }}
                      className={`fi fi-rr-${openExpaned ? 'minus' : 'plus'}-small bw_show_child`}></ContentRender>
                  )}
                  <span>{column?.formatter(valueRender, keyRender)}</span>
                </td>
              );
            } else if (column.accessor) {
              return (
                <td
                  onClick={() => (detailTr  && column?.accessor !== 'full_name') ?  window._$g.rdr(`/orders/detail/${valueRender?.order_id}`) : ''}
                  style={typeof column?.style === 'function' ? column?.style(valueRender) : column?.style}
                  className={className}
                  key={`${keyRender}${key}`}>
                  {column.expanded && (
                    <ContentRender
                      levelRecursive={marginRecursive}
                      disable={valueRender.child_count === 0}
                      onClick={() => {
                        // setOpenExpaned(!openExpaned);
                        // if (!dataExpaned) {
                        //   getChildren({
                        //     parent_id: valueRender[`${parentField}`],
                        //   }).then((data) => setDataExpaned(data?.items));
                        // }

                        if (valueRender.child_count !== 0) {
                          setOpenExpaned(!openExpaned);
                          setInit(false);
                          if (!dataExpaned) {
                            getChildren({
                              parent_id: valueRender[`${parentField}`],
                            }).then((data) => setDataExpaned(data?.items));
                          }
                        }
                      }}
                      className={`fi fi-rr-${openExpaned ? 'minus' : 'plus'}-small bw_show_child`}></ContentRender>
                  )}
                  {valueRender[column.accessor]}
                </td>
              );
            } else {
              return (
                <td
                  onClick={() => (detailTr  && column?.accessor !== 'full_name') ?  window._$g.rdr(`/orders/detail/${valueRender?.order_id}`) : ''}
                  style={typeof column?.style === 'function' ? column?.style(valueRender) : column?.style}
                  className={className}
                  key={`${keyRender}${key}`}>
                  {column.expanded && (
                    <ContentRender
                      levelRecursive={marginRecursive}
                      disable={valueRender.child_count === 0}
                      onClick={() => {
                        // setOpenExpaned(!openExpaned);
                        // if (!dataExpaned) {
                        //   getChildren({
                        //     parent_id: valueRender[`${parentField}`],
                        //   }).then((data) => setDataExpaned(data?.items));
                        // }
                        if (valueRender.child_count !== 0) {
                          setOpenExpaned(!openExpaned);
                          setInit(false);
                          if (!dataExpaned) {
                            getChildren({
                              parent_id: valueRender[`${parentField}`],
                            }).then((data) => setDataExpaned(data?.items));
                          }
                        }
                      }}
                      className={`fi fi-rr-${openExpaned ? 'minus' : 'plus'}-small bw_show_child`}></ContentRender>
                  )}
                </td>
              );
            }
          })}
        {Boolean(rowAction?.length) && (
          <td
            style={{ minWidth: `${rowAction.length * MIN_LENGTH_ACTION}px`, zIndex: 999}}
            className='bw_sticky bw_action_table bw_text_center'>
            {renderRowAction(valueRender, keyRender)}
          </td>
        )}
      </tr>
      {jsx_render()}
    </>
  );
};

export default TrTable;
