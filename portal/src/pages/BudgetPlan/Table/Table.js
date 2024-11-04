import React, { useCallback, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CheckAccess from 'navigation/CheckAccess';
import _ from 'lodash';
import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';
import { InputNumber } from 'antd';
import { Empty } from 'antd';
import BWButton from 'components/shared/BWButton/index';
import BudgetPlanModalAdd from './Modal/BudgetPlanModalAdd';
import ItemBudgetPlan from './ItemBudgetPlan';

const LoadingOutlinedStyled = styled(LoadingOutlined)`
  color: var(--blueColor);
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 30px;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const LabelCheckbox = styled.label``;

const Delelist = styled.span`
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

const Table = ({
    // show left
    loading,
    title,
    columns,
    data,
    actions,

    fieldCheck,
    noSelect,
    noPaging,
    defaultDataSelect,

    page,
    totalPages,
    totalItems,
    itemsPerPage,
    onChangeSelect,
    onChangePage,
    hiddenRowSelect,
    handleBulkAction = () => { },
    hiddenDeleteClick,
    deleteBudgetPlan,
    onRefresh,
    methods,
    totalNotYetReview
}) => {
    const [currentPage, setCurrentPage] = useState(parseInt(page));
    const [dataSelect, setDataSelect] = useState(defaultDataSelect ?? []);
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [dataDetail, setDataDetail] = useState({})

    //data first
    const totalChecked = useMemo(() => {
        if (
            data.filter((o) => {
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
            data.some((p) => {
                if (fieldCheck) {
                    return String(o[fieldCheck]) === String(p[fieldCheck]);
                } else {
                    return _.isEqual(o, p);
                }
            }),
        );
        if (dataFilter.length === data.filter((o) => !hiddenRowSelect?.(o)).length) {
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
        return spanSelect + spanRowAction + columns.length;
    }, [noSelect, rowAction]);

    const renderRowAction = useCallback(
        (valueRender, keyRender) => {
            return (rowAction ?? [])?.map((action) => {
                const { hidden, disabled, permission, onClick, color, icon, title } = action;
                return (
                    <CheckAccess permission={permission}>
                        <a
                            disabled={typeof disabled === 'function' ? disabled?.(valueRender) : disabled}
                            onClick={(_) => onClick?.(valueRender, keyRender)}
                            style={{
                                marginRight: '2px',
                                display: `${typeof hidden === 'function' && hidden(valueRender) ? 'none' : ''}`,
                            }}
                            title={title}
                            className={`bw_btn_table bw_${color}`}>
                            <i className={`fi ${icon}`}></i>
                        </a>
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
                <tr key={keyRender} className={flag ? 'bw_checked' : ''}>
                    {!noSelect && (
                        <td className='bw_sticky bw_check_sticky bw_text_center'>
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
                                    onChange={() => {
                                        if (flag) {
                                            _dataSelect.splice(findIndex, 1);
                                            setDataSelect(_dataSelect);
                                        } else {
                                            setDataSelect([..._dataSelect, valueRender]);
                                        }
                                    }}
                                />
                                <span></span>
                            </LabelCheckbox>
                        </td>
                    )}
                    {columns
                        ?.filter((value) => !value.hidden && value.default === 1)
                        .map((column, key) => {
                            const className = column?.classNameBody ? column?.classNameBody : '';
                            if (column.accessor) {
                                return (
                                    <React.Fragment>
                                        {valueRender.row_span === 1 &&
                                            (
                                                <>
                                                    <td style={column?.style} className={className} key={`${keyRender}${key}`} rowSpan={key === 0 ? valueRender.row_span_total : null}>
                                                        {
                                                            column.buttonDelete ?
                                                                (<div
                                                                    style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'flex-end',
                                                                        marginBottom: '5px',
                                                                        position: 'relative',
                                                                        top: '-3px',
                                                                        right: '-8px',

                                                                    }}

                                                                >
                                                                    <button
                                                                        style={{
                                                                            backgroundColor: '#ec2d41',
                                                                            border: 'none',
                                                                            color: 'white',
                                                                            borderRadius: '5px',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                        onClick={() => deleteBudgetPlan(valueRender?.budget_plan_distribution_id)}
                                                                    >
                                                                        <i className="fa fa-minus" aria-hidden="true"></i>
                                                                    </button>
                                                                </div>)
                                                                : null
                                                        }
                                                        {valueRender[column.accessor]}
                                                        {
                                                            valueRender.row_span === 1 && column.buttonAdd ?
                                                                (<div
                                                                    style={{
                                                                        position: 'absolute',
                                                                        bottom: '3px',
                                                                        right: '3px',

                                                                    }}
                                                                >
                                                                    <button
                                                                        style={{
                                                                            backgroundColor: '#31be94',
                                                                            border: 'none',
                                                                            color: 'white',
                                                                            borderRadius: '5px',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                        onClick={() => handleOpenModalAdd(valueRender)}
                                                                    >
                                                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                                                    </button>
                                                                </div>)
                                                                :
                                                                null
                                                        }
                                                    </td>
                                                </>
                                            )
                                        }
                                        {valueRender.row_span === 0 && column.accessor !== 'department_name' ?
                                            (<td style={column?.style} className={className} key={`${keyRender}${key}`}>
                                                {
                                                    column.buttonDelete ?
                                                        (<div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'flex-end',
                                                                marginBottom: '5px',
                                                                position: 'relative',
                                                                top: '-3px',
                                                                right: '-8px',
                                                            }}

                                                        >
                                                            <button
                                                                style={{
                                                                    backgroundColor: '#ec2d41',
                                                                    border: 'none',
                                                                    color: 'white',
                                                                    borderRadius: '5px',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => deleteBudgetPlan(valueRender?.budget_plan_distribution_id)}
                                                            >
                                                                <i className="fa fa-minus" aria-hidden="true"></i>
                                                            </button>
                                                        </div>)
                                                        : null
                                                }
                                                {valueRender[column.accessor]}
                                            </td>)
                                            : null
                                        }
                                    </React.Fragment>

                                );
                            } else {
                                return <td style={column?.style} className={className} key={`${keyRender}${key}`}></td >;
                            }
                        })}
                    <ItemBudgetPlan
                        valueRender={valueRender}
                        methods={methods}
                        keyValue={`data.${keyRender}`}
                    />
                    {
                        Boolean(rowAction.length) && (
                            <td className='bw_sticky bw_action_table bw_text_center'>{renderRowAction(valueRender, keyRender)}</td>
                        )
                    }
                </tr >
            );
        },
        [columns, dataSelect],
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

    const jsx_tbody =
        data?.length > 0 ? (
            <tbody>
                {data?.map((value, key) => renderData(value, key))}
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

    const handleOpenModalAdd = (item) => {
        setIsOpenModal(true)
        setDataDetail(item)
    }

    return (
        <React.Fragment>
            <div className='bw_box_card bw_mt_2'>
                <div className='bw_row bw_mb_2 bw_align_items_center'>
                    <div className='bw_col_6 bw_flex bw_justify_content_left bw_btn_group'>
                        {actions
                            ?.filter((p) => p.globalAction && !p.hidden && !p.right)
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
                    <div className='bw_col_6 bw_flex bw_justify_content_right bw_btn_group'>
                        {actions
                            ?.filter((p) => p.globalAction && !p.hidden && p.right)
                            .map((props, i) => (
                                <CheckAccess permission={props?.permission}>
                                    <span {...props} >{props?.content}
                                        <span style={props?.styleCustom}>
                                            {props?.isReviewList && props?.totalNotYetReview > 0 ? ` (${props?.totalNotYetReview} ${props?.title})` : null}
                                        </span>
                                    </span>
                                </CheckAccess>
                            ))}
                    </div>
                </div>
                <div className='bw_row bw_mb_2 bw_align_items_center'>
                    <div className='bw_col_6'>
                        {title}
                        {Boolean(dataSelect.length) > 0 ? (
                            <div className='bw_show_record'>
                                <p className='bw_choose_record'>
                                    <b>{dataSelect.length}</b> đang chọn{' '}
                                    <a id='data-table-select' onClick={() => setDataSelect([])}>
                                        Bỏ chọn
                                    </a>{' '}
                                    <Delelist
                                        id='trigger-delete'
                                        hidden={hiddenDeleteClick}
                                        className='bw_red bw_delete'
                                        onClick={() => {
                                            handleBulkAction(dataSelect, 'delete');
                                        }}>
                                        | <b>Xoá tất cả</b>
                                    </Delelist>
                                </p>
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className='bw_table_responsive'>
                    <table className='bw_table'>
                        <thead>
                            <tr>
                                {!noSelect && (
                                    <th className='bw_sticky bw_check_sticky bw_text_center'>
                                        {Boolean(data.filter((o) => !hiddenRowSelect?.(o)).length) && (
                                            <label className='bw_checkbox'>
                                                <input type='checkbox' onChange={() => handleCheckAll()} checked={totalChecked} />
                                                <span></span>
                                            </label>
                                        )}
                                    </th>
                                )}

                                {columns
                                    ?.filter((value) => !value.hidden)
                                    .map((p, o) => (
                                        <th key={o} className={p?.classNameHeader ? p?.classNameHeader : ''}>
                                            {p?.header}
                                        </th>
                                    ))}
                                {Boolean(rowAction.length) && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
                            </tr>
                        </thead>

                        {loading ? (
                            <tbody>
                                <tr>
                                    <td colSpan={colSpan}>
                                        <LoadingOutlinedStyled />
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            jsx_tbody
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
            </div>
            {isOpenModal ? (
                <BudgetPlanModalAdd
                    isOpenModal={isOpenModal}
                    dataDetail={dataDetail}
                    setIsOpenModal={setIsOpenModal}
                    onRefresh={onRefresh}
                />) : null}
        </React.Fragment>
    );
};

Table.propTypes = {
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

Table.defaultProps = {
    data: [],
    onChangeSelect: () => { },
};

export default Table;
