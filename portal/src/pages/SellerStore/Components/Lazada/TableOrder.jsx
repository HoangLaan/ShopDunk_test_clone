import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useState, useEffect , useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { deleteUnit } from 'services/unit.service';
import styled from 'styled-components';
import BWImage from 'components/shared/BWImage/index';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect'
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { Tooltip } from 'antd'
import { Checkbox } from 'antd';
import { formatPrice } from 'utils/index'
import moment from 'moment'
import OrderItems from './OrderItems';
import { InputNumber } from 'antd';

const convertArrayToObject = (array = []) => {
  return array.reduce((a, v) => ({ ...a, [v?.order_id]: v }), {});
};

const InputNumberStyled = styled(InputNumber)`
  margin-right: 6px;
  .ant-input-number-handler-wrap {
    display: none !important;
  }
`;

const TableOrderLazada = ({
  loading,
  data = [],
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  checkedList,
  setCheckedList,
  handleConfirmOrder,
  handlePrintShippingDocument,
  handleCancelOrder,
  isHidden,
  handleConfirmDelivery
}) => {
  const dispatch = useDispatch();
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(parseInt(page));

  const onChangeChecked = (e) => {
    let list = { ...checkedList };
    if (e.target.checked) {
      list[e.target.value?.order_id] = e.target.value;
    } else {
      delete list[e.target.value?.order_id];
    }
    setCheckedList(list);
    // setIndeterminate(!!Object.values(list).length && Object.values(list).length < data.length);
    // setCheckAll(Object.values(list).length == data.length);
  };
  const onCheckAllChange = (e) => {
    let list = convertArrayToObject(data);
    setCheckedList(e.target.checked ? list : {});
    // setIndeterminate(false);
    // setCheckAll(e.target.checked);
  };

  const convertISOtoDate = (date) => {
    if (date) {
      let mydate = new Date(date);
      return moment(mydate).format('MM/DD/YYYY  h:mm:ss');
    }
  }
  useEffect(() => {
    if (checkedList && Object.values(checkedList)?.length <= 0) {
      setIndeterminate(false);
      setCheckAll(false);
    }
  }, [checkedList]);

  const totalShowRecord = useMemo(() => {
    if (data.length < itemsPerPage) {
      return data.length;
    } else if (itemsPerPage > totalItems) {
      return totalItems;
    } else {
      return itemsPerPage;
    }
  }, [data, itemsPerPage, totalItems]);


  const renderHeader = () => {
    let isIndenterminate = !!Object.values(checkedList).length && Object.values(checkedList).length  < data.length ;
    let isCheckall = (Object.values(checkedList).length > 0 && data.length > 0 ) && (Object.values(checkedList).length == data.length);
    return (
      <thead>
        <th className="bw_sticky bw_check_sticky"
          style={{
            'display': 'flex',
            'width': 'auto'
          }}
        >
          <Checkbox indeterminate={isIndenterminate} 
                  onChange={(e) => onCheckAllChange(e)} 
                  checked={isCheckall}>
                  
          </Checkbox>
        </th>
        <th>Mã đơn hàng</th>
        <th className="bw_text_center">Người đặt hàng</th>
        <th className="bw_text_center">Tổng tiền</th>
        <th className="bw_text_center">Ngày đặt</th>
        <th className="bw_text_center">Trạng thái</th>
        <th className="bw_text_center">Vận chuyển</th>
        <th className="bw_sticky bw_action_table bw_text_center">Thao tác</th>
      </thead>)
  }

  const renderBody = () => {
    if (data && data.length > 0) {
      return (data || []).map((order, index) => {
        let { detail = {}, shipping_provider_type = null } = (order || {});
        let { order_items: item_list } = (detail || {});
        let checked = checkedList.hasOwnProperty(`${order?.order_id}`);
        return (
          <OrderItems
            order={order}
            formatPrice={formatPrice}
            handleConfirmOrder={handleConfirmOrder}
            convertISOtoDate={convertISOtoDate}
            onChange={onChangeChecked}
            checked={checked}
            item_list={item_list}
            shipping_provider_type={shipping_provider_type}
            handlePrintShippingDocument = {handlePrintShippingDocument}
            handleCancelOrder = {handleCancelOrder}
            isHidden = {isHidden}
            handleConfirmDelivery = {handleConfirmDelivery}
          />
        )
      })
    }
  }
  const handeChangePage = useCallback(() => {
    if (parseInt(currentPage) !== parseInt(page)) onChangePage(currentPage);
  }, [currentPage, page]);

  const renderPaging = () => {
    return (
      <>
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
      </>
    )
  }

  return (
    <>
      <div className="bw_table_responsive bw_mt_2">
        <table className="bw_table">
          {renderHeader()}
          {renderBody()}
        </table>
      </div>
      <div>
      {renderPaging()}
      </div>
      {/* <DataTable
        fieldCheck={'SkuId'}
        loading={loading}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        handleBulkAction={handleBulkAction}
      /> */}
    </>
  );
};

export default TableOrderLazada;
