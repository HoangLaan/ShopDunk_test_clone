import React, { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { InputNumber } from 'antd'
import { formatPrice } from '../../../../utils/index';


const OutputTypeTable = ({ disabled }) => {
    const methods = useFormContext();
    const { watch, setValue, } = methods
    // const [isModelProduct, setIsModelProduct] = useState(false);
    // const [isImportExcel, setIsImportExcel] = useState(false)
    const [page, setpage] = useState(1);
    // const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    // const [totalItems, setTotalItem] = useState(0)


    const changePriceBasic = (value, idx) => {
        value = Number(value)

        let list_output_type_submit = methods.watch('list_output_type_submit')
        const vat_value = list_output_type_submit[idx].vat_value * 1
        
        const _price_vat = methods.watch('price_vat') + value
        
        // công thức cũ tính change_price
        // const _prices = structuredClone(methods.watch('base_price'));
        // let numberAbide = (value + Number(_prices)) * (100 + vat_value);
        // let roundPrice = Math.round(numberAbide / 100);

        list_output_type_submit[idx].base_price =  Math.round(Number(_price_vat) / Number((100 + vat_value)/100));
        list_output_type_submit[idx].price = _price_vat
        list_output_type_submit[idx].change_value = value;
        list_output_type_submit[idx].change_price = _price_vat;

        methods.setValue("list_output_type_submit", list_output_type_submit);
    }





    const columns = useMemo(
        () => [
            {
                header: 'STT',
                classNameHeader: 'bw_sticky bw_check_sticky bw_text_center',
                classNameBody: 'bw_text_center',
                formatter: (p, idx) => <span className='bw_sticky bw_name_sticky'>{idx + 1}</span>,
            },
            {
                header: 'Hình thức xuất',
                formatter: (p) => <p>{p?.output_type_name}</p>,
            },
            {
                header: 'Giá chênh lệch (Đ)',
                formatter: (p, idx) => {
                    return (
                        <InputNumber
                            controls={false}
                            style={{ width: '100%', padding: '0px 8px' }}
                            value={p?.change_value}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={(value) => changePriceBasic(value, p?.output_type_id)}
                            placeholder="Giá chênh lệch"
                        />
                    )
                },
            },
            {
                header: 'Giá bán có VAT (Đ)',
                classNameHeader: 'bw_text_right',
                classNameBody: 'bw_text_right',
                formatter: (p) => <span className='bw_text_right'>{formatPrice(p?.price, true, ',')}</span>,
            },
            {
                header: 'Giá bán chưa có VAT (Đ)',
                classNameHeader: 'bw_text_right',
                classNameBody: 'bw_text_right',
                formatter: (p) => <span className='bw_text_right'>{formatPrice(p?.base_price, true, ',')}</span>,
            },

        ],
        [],
    );

    const renderData = useCallback(
        (valueRender, keyRender) => (
            <tr>
                {columns?.map((column, key) => {
                    if (column.formatter) {
                        return (
                            <td className={column?.classNameBody} key={`${keyRender}${key}`}>
                                {column?.formatter(valueRender, keyRender)}
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
        [columns],
    );
    return (
        <React.Fragment>
            <div className='bw_table_responsive bw_mt_2'>
                <table className='bw_table'>
                    <thead>
                        {columns?.map((p, idx) => (
                            <th key={idx} className={p?.classNameHeader}>{p?.header}</th>
                        ))}
                    </thead>

                    <tbody>
                        {watch('list_output_type_submit') && Object.values(watch('list_output_type_submit')).length ? (
                            Object.values(watch('list_output_type_submit'))?.map((value, key) => {
                                return Math.ceil((key + 1) / itemsPerPage) == page ? renderData(value, key) : null;
                            })
                        ) : (
                            <tr>
                                <td colSpan={10} className='bw_text_center'>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
{/*
            {watch('list_output_type_submit') && Object.values(watch('list_output_type_submit')).length > itemsPerPage ? (
                <div className='bw_row bw_mt_2 bw_show_table_page'>
                    <div className='bw_col_6'>
                        <p>
                            Show{' '}
                            {totalItems < 15 ? totalItems : itemsPerPage}/{totalItems} records
                        </p>
                    </div>

                    <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center'>
                        <div className='bw_nav_table'>
                            <button
                                disabled={!(Boolean(page) && parseInt(page) !== 1)}
                                onClick={() => {
                                    setpage(parseInt(page) - 1);
                                }}
                                className={Boolean(page) && parseInt(page) !== 1 && 'bw_active'}>
                                <span className='fi fi-rr-angle-small-left'></span>
                            </button>
                            <input type='number' value={parseInt(page)} step='1' max={totalPages} />
                            <span className='bw_all_page'>/ {totalPages}</span>
                            <button
                                disabled={parseInt(totalPages) === parseInt(page)}
                                onClick={() => {
                                    setpage(parseInt(page) + 1);
                                }}
                                className={!(parseInt(totalPages) === parseInt(page)) && 'bw_active'}>
                                <span className='fi fi-rr-angle-small-right'></span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : null} */}

        </React.Fragment>
    );
};

export default OutputTypeTable;
