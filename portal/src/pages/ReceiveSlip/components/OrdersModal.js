import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useFormContext } from 'react-hook-form';
import DataTable from 'components/shared/DataTable/index';
import { formatPrice } from 'utils/index';

const OrdersModal = ({ setShowModal, params, setParams }) => {
  const methods = useFormContext();
  const { ordersList, getOrdersLoading } = useSelector((state) => state.receiveSlip);
  const { items, itemsPerPage, page, totalItems, totalPages } = ordersList;
  const [dataSelect, setDataSelect] = useState([]);

  const handleSortColumn = (column) => {
    let { sort_column = '', sort_direction = '' } = params;

    if (sort_column === column) {
      sort_direction = sort_direction === 'asc' ? 'desc' : 'asc';
    } else {
      sort_column = column;
    }
    setParams({
      ...params,
      sort_direction,
      sort_column,
    });
  };
  const columns = useMemo(
    () => [
      {
        header: 'Mã đơn hàng',
        accessor: 'order_no',
        classNameBody: 'bw_text_left',
        classNameHeader: 'bw_text_left',
      },
      {
        header: (
          <div onClick={(e) => handleSortColumn('created_date')}>
            <span style={{ paddingRight: '10px' }}>Ngày tạo đơn</span>
            {params.sort_column === 'created_date' ? (
              params.sort_direction === 'asc' ? (
                <i className={`fa fa-sort-desc`} />
              ) : (
                <i className={`fa fa-sort-asc`} />
              )
            ) : null}
          </div>
        ),
        accessor: 'created_date',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày nợ',
        accessor: 'debit_date',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: (
          <div onClick={(e) => handleSortColumn('total_amount')}>
            <span style={{ paddingRight: '10px' }}>Tổng nợ</span>
            <span
              className={`position-absolute receiveslip-sort-r-0 ${params?.sort_column === 'total_amount'
                ? params?.sort_direction === 'asc'
                  ? 'receiveslip-sort-down'
                  : 'receiveslip-sort-up'
                : ''
                }`}>
              <i
                className={`fa ${params?.sort_column === 'total_amount'
                  ? params?.sort_direction === 'asc'
                    ? 'fa-sort-desc'
                    : 'fa-sort-asc'
                  : 'fa-sort'
                  }`}
                aria-hidden='true'></i>
            </span>
          </div>
        ),
        accessor: 'total_amount',
        classNameHeader: 'bw_text_center',
        formatter: (p, i) => <div className='bw_text_right'>{formatPrice(p.total_amount)} đ</div>,
      },
    ],
    [],
  );

  return (
    <React.Fragment>
      <div className='bw_modal bw_modal_open' id='bw_addattr'>
        <div className='bw_modal_container bw_w800'>
          <div className='bw_title_modal' style={{ paddingBottom: '0' }}>
            <h3>Danh sách đơn hàng của khách hàng: {items[0]?.customer_name}</h3>
            <span className='fi fi-rr-cross-small bw_close_modal' onClick={() => setShowModal(false)} />
          </div>
          <div className='bw_main_modal' style={{ paddingTop: '0' }}>
            <div className='bw_search'>
              <div className='bw_row'>
                {/* <FormItem className='bw_col_6' label='Tìm kiếm'>
                  <FormInput field='search' placeholder='Mã sản phẩm, tên sản phẩm' />
                </FormItem> */}
                <div className='bw_col_6'>
                  <div className='bw_frm_box'>
                    <label>Tìm kiếm</label>
                    <input
                      placeholder='Mã đơn hàng'
                      onChange={(e) => {
                        console.log(e.target.value);
                        setParams({ ...params, search: e.target.value });
                      }}
                    />
                  </div>
                </div>
                <div className='bw_col_6'></div>

                <div className='bw_col_12 bw_flex bw_justify_content_right bw_btn_group'>
                  <button style={{ marginRight: '10px' }} type='button' className='bw_btn bw_btn_success'>
                    <span className='fi fi-rr-filter'></span> Tìm kiếm
                  </button>
                  <button type='button' onClick={() => { }} className='bw_btn_outline'>
                    Làm mới
                  </button>
                </div>
              </div>
            </div>

            {/* <FilterSearchBar
              title='Từ khóa'
              onSubmit={onChange}
              onClear={() => onChange({})}
              actions={[
                {
                  title: 'Từ khóa',
                  component: <FormInput field='search' placeholder='Mã sản phẩm, tên sản phẩm' />,
                },
              ]}
            /> */}

            <DataTable
              hiddenDeleteClick={true}
              loading={getOrdersLoading}
              columns={columns}
              data={items ?? {}}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              page={page}
              totalItems={totalItems}
              onChangePage={(page) => {
                setParams({
                  ...params,
                  page,
                });
              }}
              onChangeSelect={setDataSelect}
              defaultDataSelect={Object.values(methods.watch('order_list') ?? {})}
            />
          </div>
          <div className='bw_footer_modal'>
            <button
              type='button'
              className='bw_btn bw_btn_success'
              onClick={() => {
                methods.setValue('order_list', dataSelect);
                methods.setValue(
                  'total_money',
                  dataSelect.reduce((total, current) => total + current.total_amount, 0),
                );
                setShowModal(false);
              }}>
              <span className='fi fi-rr-check' /> Đồng ý
            </button>
            <button className='bw_btn_outline bw_close_modal' onClick={() => setShowModal(false)}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default OrdersModal;
