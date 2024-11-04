import BWLoader from 'components/shared/BWLoader/index';
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { InputNumber } from 'antd';

const ModelTable = (
    {
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
    }

) => {
    
    const [currentPage, setCurrentPage] = useState(parseInt(page));

    const handleSelectedAll = ({ target: { checked } }) => {
        let _selected = {};
        if (checked) {
            _selected = { ...itemSelected };
            data.map((_item) => {
                _selected["key" + _item.news_id] = _item;
            });
        }
        setItemSelected(_selected);
    };

    const handleSelected = (valueRender, checked) => {
        let _selected = { ...itemSelected };
        if (checked) {
            _selected["key" + valueRender?.news_id] = valueRender;
        } else {
            delete _selected["key" + valueRender?.news_id];
        }

        setItemSelected(_selected);
    };

    // useEffect(() => {
    //     setCurrentPage(parseInt(page));
    //   }, [page]);

      useEffect(() => {
        setCurrentPage(totalPages ? parseInt(page) : totalPages);
      }, [page, totalPages]);
    

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

    const renderData = useCallback(
        (valueRender, keyRender) => (
            <tr>
                <td className='bw_sticky bw_check_sticky bw_text_center'>
                    <label className='bw_checkbox'>
                        <input
                            key={keyRender}
                            onChange={({ target: { checked } }) => handleSelected(valueRender, checked)}
                            type='checkbox'
                            checked={itemSelected["key" + valueRender?.news_id] ? true : false}
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

    const totalChecked = data.filter((_user) => itemSelected["key" + _user?.news_id]).length;

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
                    <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center bw_mb_1'>
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
                                controls={false}
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

    )
}

export default ModelTable