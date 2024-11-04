import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import BWImage from 'components/shared/BWImage/index';
import styled from 'styled-components';
import { Tooltip } from 'antd';

const StyledDetailOrder = styled.div`
  display : flex;
  justify-content: space-between;
  padding : 10px
`
const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #576CBC;
    border-color: #576CBC;
  }  
`

const StyledInforProduct = styled.div`
  display : flex
`

const OrderItems = ({
  handleConfirmOrder,
  formatPrice,
  convertISOtoDate,
  order,
  onChange,
  checked,
  item_list = [],
  handlePrintShippingDocument,
  isHidden = false,
  handleCancelOrder,
  handleConfirmDelivery
}) => {
  const [isShowDetail, setIsShowDetail] = useState(false);
  return (
    <>
      <tr key={`infor_${order?.order_sn}`}>
        <td style={{ width: '5vh' }}>
          <StyledCheckbox className="bw_checkbox_order" onChange={onChange} checked={checked} value={order} />
        </td>
        <td><b>{order?.order_sn}</b></td>
        <td className="bw_text_center">{order?.buyer_username}</td>
        <td className="bw_text_center">{formatPrice(order?.total_amount || 0)}đ</td>
        <td className="bw_text_center">{order?.create_time}</td>
        <td className="bw_text_center">{order?.order_status}</td>
        <td className="bw_text_center">{order?.shipping_carrier}</td>
        <td className="bw_sticky bw_action_table bw_text_center" >
          {
            order?.order_status_code == 'READY_TO_SHIP' && !isHidden
              ? (
                <>
                  <Tooltip placement="bottom" title={'Xác nhận đơn hàng'}>
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      handleConfirmOrder(order)
                    }} className="bw_btn_table bw_green bw_open_modal" style={{ marginRight: '5px' }}>
                      <i className="fi fi-rr-check"></i>
                    </a>
                  </Tooltip>
                </>
              ):
              null
          }
          {
            order?.order_status_code == 'PROCESSED' && !isHidden ? (
              <Tooltip placement="bottom" title={'In đơn hàng'}>
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  handlePrintShippingDocument(order)
                }} className="bw_btn_table bw_green bw_open_modal" style={{ marginRight: '5px' }}>
                  <i className="fi fi-rr-print"></i>
                </a>
              </Tooltip>
            ) : null
          }
          {
              order?.order_status_code !== 'CANCELLED' &&
              order?.order_status_code !== 'IN_CANCEL' &&
              order?.order_status_code !== 'SHIPPED' &&
              order?.order_status_code !== 'COMPLETED' ?
              <Tooltip placement="bottom" title={'Hủy đơn hàng'}>
                <a href="#" className="bw_btn_table bw_delete bw_red" style={{ marginRight: '5px' }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCancelOrder(order);
                  }}
                >
                  <i className="fi fi-rr-cross-small"></i>
                </a>
              </Tooltip>
              : null
          }
          <Tooltip placement="bottom" title={'Chi tiết đơn hàng'}>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              setIsShowDetail(!isShowDetail)
            }} className="bw_btn_table bw_blue bw_show_detail">
              {isShowDetail ? <i className="fi fi-rr-caret-up"></i> : <i className="fi fi-rr-caret-down"></i>} 
            </a>
          </Tooltip>
        </td>
      </tr>
      {
        isShowDetail ?
          <>
            {
              item_list && item_list.length > 0 && (item_list || []).map((detail, indexdetail) => {
                let { image_info = {} } = detail || {};
                return (
                  <>
                    <tr className="bw_detailS" key={`infor_bw_detailS_${image_info?.item_id}`}>
                      <td colspan="8">
                        <StyledDetailOrder>
                          <StyledInforProduct>
                            <div className="bw_inf_pro">
                              <BWImage className='img-product-thirty' src={image_info?.image_url} alt='avatar' />
                            </div>
                            <div>
                              <h4 style={{
                                fontSize: '14px',
                                fontWeight: '500'
                              }}>{detail?.item_name}</h4>
                              <ul>
                                <li>Mã sản phẩm : {detail?.item_id}</li>
                                <li>ID sản phẩm : {detail?.item_sku} </li>
                                <li>Số lượng : {detail?.model_quantity_purchased} </li>
                              </ul>
                            </div>
                          </StyledInforProduct>
                          <div><span>{formatPrice(detail?.model_discounted_price)} đ</span></div>
                        </StyledDetailOrder>
                      </td>
                    </tr>
                  </>
                )
              })
            }
          </>
          : null
      }

    </>
  )
}

export default OrderItems