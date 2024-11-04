import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Empty } from 'antd';
import { getListHistoryPurchase } from "services/customer.service";
import { useSelector } from "react-redux";
import DataTable from "components/shared/DataTable";
import { FormProvider, useForm } from "react-hook-form";
import FilterSearchBar from "components/shared/FilterSearchBar";
import FormInput from "components/shared/BWFormControl/FormInput";
import { formatPrice } from "utils";
import { orderStatus } from "../utils/helpers";

const defaultParam = {
  is_active: 1,
  page: 1,
  itemsPerPage: 15,
};

const HistoryOrders = ({ member_id, data_leads_id, createOrder }) => {
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5
  });

  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const methods = useForm();
  
  const { items, itemsPerPage, page, totalItems, totalPages, statitics } = dataList;

  const loadData = useCallback(() => {
    // if (member_id) {
      getListHistoryPurchase({ ...params, member_id: member_id, data_leads_id })
        .then((value) => {
          setDataList(value);
        })
    // }
  }, [params, member_id]);
  useEffect(loadData, [loadData]);

  const columns = useMemo(
    () => [
      {
        header: 'Ngày mua',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Mã đơn hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'order_no',
        formatter: (p) => <a target="_blank" href={`/orders/detail/${p?.order_id}`}>
          {p?.order_no}
        </a>
      },
      {
        header: 'Sản phẩm',
        accessor: 'product_name',
        classNameHeader: 'bw_text_center',
        
      },
      {
        header: 'Tổng giá trị',
        classNameHeader: 'bw_text_right',
        accessor: 'total_money',
        formatter: (p) => (
          <div style={{ width: '100%' }} className='bw_flex bw_align_items_center bw_justify_content_right'>
            <b className='bw_sticky bw_name_sticky'>{formatPrice(
              p?.total_money,
              false,
              ',',
            )}</b>
          </div>
        ),
      },
      {
        header: 'Cửa hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'store_name',
      },
      {
        header: 'Trạng thái đơn hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'order_status',
        // formatter: (p) => (
        //   orderStatus(p?.order_status)
        // )
      },
      {
        header: 'Nhân viên bán hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'sale_sasistant',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        type: 'success',
        content: 'Tạo đơn hàng',
        onClick: () => window.open('/orders/add', '_blank')
      }
    ]
  })

  return <>
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={setParams}
        onClear={() => setParams(defaultParam)}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='keyword' placeholder={'Nhập tên sản phẩm, seri, mã đơn hàng'} />,
          },
        ]}
        colSize={6}
      />
      <div className='bw_care_actions_count bw_mt_1' style={{display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <div style={{fontWeight: 'bold'}}>
            Tổng đơn hàng: {statitics?.total_orders && statitics?.total_orders?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
          </div>
          <div style={{fontWeight: 'bold'}}>
            Tổng giá trị: {formatPrice(statitics?.total_money, false, '.')}
          </div>
        </div>
      </div>
    </FormProvider>
    
    <DataTable
      noSelect
      hiddenDeleteClick
      columns={columns}
      data={items}
      // actions={actions}
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
    />


    {/* <ul>
      {items.length > 0 ? (items ?? [])?.map((value, index) => {
        return <li key={index}>
          <span>{value?.created_date}<span>
            <a target="_blank" href={`/orders/detail/${value?.order_id}`}>#{value?.order_no}</a>
          </span></span></li>
      }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </ul>
    <div style={{
      margin: '0 auto'
    }} className="bw_col_6">
      <div className="bw_nav_table">
        <button
          disabled={page === 1}
          onClick={(e) => {
            if (params !== 1) {
              setParams((prev) => ({
                ...prev,
                page: parseInt(page) - 1
              }))
            }
          }}
          className={parseInt(page) > 1 ? "bw_active" : ""}
        ><span className="fi fi-rr-angle-small-left">
          </span>
        </button>
        <button
          className={params?.page == totalPages ? '' : "bw_active"}
          onClick={(e) => {
            if (params?.page != totalPages) {
              setParams((prev) => ({
                ...prev,
                page: parseInt(page) + 1
              }))
            }
          }}><span className="fi fi-rr-angle-small-right"></span></button>
      </div>
    </div > */}
  </>
}

export default HistoryOrders