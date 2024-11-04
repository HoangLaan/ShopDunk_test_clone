import { getListNews } from 'pages/News/helpers/call-api';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ModelFilter from './ModelFilter';
import ModelTable from './ModelTable';

const ModelAddNews = ({ open, onClose, onConfirm, selected }) => {
    const [itemSelected, setItemSelected] = useState({});

    const { id: news_id } = useParams()
    const [params, setParams] = useState({
        page: 1,
        itemsPerPage: 6,
        is_active: 1,
        exclude_id: news_id
    });

    const [data, setData] = useState({
        items: [],
        itemsPerPage: 0,
        page: 0,
        totalItems: 0,
        totalPages: 0,
    });

    const columns = useMemo(
        () => [
            {
                header: 'Tên bài viết',
                accessor: 'news_title',
                classNameHeader: 'bw_sticky bw_name_sticky',
                classNameBody: 'bw_sticky bw_name_sticky',
                formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.news_title}</b>,
            },
            // {
            //     header: 'Loại bài viết',
            //     accessor: 'news_type',

            // },
            {
                header: 'Ngày tạo',
                accessor: 'created_date',
            },
        ], [])

    const { items = [], itemsPerPage, page, totalItems, totalPages } = data;

    // Lấy danh sách
    const loadData = useCallback(() => {
        getListNews({ ...params }).then(setData);
    }, [params]);
    useEffect(loadData, [loadData]);

    useEffect(() => {
        let obj
        if (Array.isArray(selected)) {
            obj = selected.reduce((a, v) => ({ ...a, ["key" + v.news_id]: { ...v, is_complete: false } }), {})
        } else {
            obj = selected
        }
        setItemSelected(obj);
    }, [selected]);

    return (
        <React.Fragment>
            <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_chooseStatus'>
                <div className='bw_modal_container bw_w900'>
                    <div class="bw_title_modal">
                        <h3>Chọn bài viết liên quan</h3>
                        <span class="fi fi-rr-cross-small bw_close_modal"
                            onClick={onClose}
                        ></span>
                    </div>

                    <div class="bw_main_modal">
                        <div className='bw_row'>
                            <ModelFilter
                                onChange={(p) => {
                                    setParams({
                                        ...params,
                                        ...p,
                                    });
                                }}

                            />
                            <div className='bw_col_12 bw_mt_1' style={{ overflowX: 'auto', maxHeight: '45vh' }}>
                                <ModelTable
                                    itemSelected={itemSelected}
                                    setItemSelected={setItemSelected}
                                    data={items}
                                    totalPages={totalPages}
                                    itemsPerPage={itemsPerPage}
                                    page={page}
                                    totalItems={totalItems}
                                    columns={columns}
                                    onChangePage={(page) => {
                                        setParams({
                                            ...params,
                                            page,
                                        });
                                    }}
                                />

                            </div>
                        </div>
                    </div>

                    <div className='bw_footer_modal'>
                        <button type='button' className='bw_btn bw_btn_success' onClick={() => onConfirm('news_related_list', itemSelected)}>
                            <span className='fi fi-rr-check'></span>
                            Cập nhật
                        </button>
                        <button type='button' onClick={onClose} className='bw_btn_outline bw_btn_outline_danger'>
                            Đóng
                        </button>
                    </div>

                </div>
            </div>
        </React.Fragment>

    )
}

export default ModelAddNews