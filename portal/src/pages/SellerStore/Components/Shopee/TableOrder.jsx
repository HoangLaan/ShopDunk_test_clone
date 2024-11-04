import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { deleteUnit } from 'services/unit.service';
import styled from 'styled-components';
import BWImage from 'components/shared/BWImage/index';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect'
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { Tooltip } from 'antd'
import { Checkbox , Button as AntButton } from 'antd';
import { formatPrice } from 'utils/index'
import moment from 'moment'
import OrderItems from './OrderItems';
import { InputNumber } from 'antd';
import { Empty } from 'antd';
import { convertArrayToObjectShopeeOrder } from 'pages/SellerStore/helpers/constaint';
import '../../styles.scss';

const InputNumberStyled = styled(InputNumber)`
  margin-right: 6px;
  .ant-input-number-handler-wrap {
    display: none !important;
  }
`;


const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #576CBC;
    border-color: #576CBC;
  }
`

const TableOrderShopee = ({
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
  handleConfirmDelivery,
  onLoadMore,
  initLoading
}) => {
  const dispatch = useDispatch();
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(parseInt(page));


  const onChangeChecked = (e) => {
    let list = { ...checkedList };
    if (e.target.checked) {
      list[e.target.value?.order_sn] = e.target.value;
    } else {
      delete list[e.target.value?.order_sn];
    }
    setCheckedList(list);
  };
  const onCheckAllChange = (e) => {
    let list = convertArrayToObjectShopeeOrder(data);
    setCheckedList(e.target.checked ? list : {});
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
    let isIndenterminate = !!Object.values(checkedList).length && Object.values(checkedList).length < data.length;
    let isCheckall = (Object.values(checkedList).length > 0 && data.length > 0) && (Object.values(checkedList).length == data.length);
    return (
      <thead>
        <th className="bw_sticky bw_check_sticky"
          style={{
            'display': 'flex',
            'width': 'auto'
          }}
        >
          <StyledCheckbox className="bw_checkbox_order" indeterminate={isIndenterminate}
            onChange={(e) => onCheckAllChange(e)}
            checked={isCheckall}>

          </StyledCheckbox>
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
        let { item_list = [] } = order || {};
        let checked = checkedList.hasOwnProperty(`${order?.order_sn}`);
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
            handlePrintShippingDocument={handlePrintShippingDocument}
            handleCancelOrder={handleCancelOrder}
            isHidden={isHidden}
            handleConfirmDelivery={handleConfirmDelivery}
          />
        )
      })
    }else{
      return <tr ><td colSpan={8}><Empty /></td></tr>
    }
  }
  const handeChangePage = useCallback(() => {
    if (parseInt(currentPage) !== parseInt(page)) onChangePage(currentPage);
  }, [currentPage, page]);

  const renderPaging = () => {
    return (
      <>
        {!initLoading && !loading ? (
          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              height: 32,
              lineHeight: '32px',
            }}>
            <AntButton
              onClick={onLoadMore}
              disabled={loading}>
              Loading more
            </AntButton>
          </div>
        ) : null}
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
    </>
  );
};

export default TableOrderShopee;
