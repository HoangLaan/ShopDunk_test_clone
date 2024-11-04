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
      <tr key={`infor_${order?.order_id}`}>
        <td style={{ width: '5vh' }}>
          <Checkbox onChange={onChange} checked={checked} value={order} />
        </td>
        <td><b>{order?.order_id}</b></td>
        <td className="bw_text_center">{order?.customer_first_name}</td>
        <td className="bw_text_center">{formatPrice(order?.price || 0)}đ</td>
        <td className="bw_text_center">{convertISOtoDate(order?.updated_at)}</td>
        <td className="bw_text_center">{order?.order_status}</td>
        <td className="bw_text_center">{order?.shipment_provider_label}</td>
        <td className="bw_sticky bw_action_table bw_text_center" >
          {
            order?.status == 'pending' && !isHidden  &&
            order?.status !== 'confirmed' ? (
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
            )
              : order?.shipping_provider_type == 'seller_own_fleet' && 
                order?.status != "shipped_back_success" &&
                order?.status !== 'confirmed' && 
                order?.status !== 'delivered'?
                <>
                  <Tooltip placement="bottom" title={'Xác nhận giao hàng thành công'}>
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      handleConfirmDelivery({key: 'success',order})
                    }} className="bw_btn_table bw_green bw_open_modal" style={{ marginRight: '5px' }}>
                      <i className="fi fi-rr-check"></i>
                    </a>
                  </Tooltip>
                  <Tooltip placement="bottom" title={'Xác nhận giao hàng thất bại'}>
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      handleConfirmDelivery({key : 'fail',order})
                    }} className="bw_btn_table bw_green bw_open_modal bw_red" style={{ marginRight: '5px' }}>
                      <i className="fi fi-rr-cross-small"></i>
                    </a>
                  </Tooltip>
                </>
                :
                null
          }
          {
            order?.status == 'ready_to_ship' && order?.package_id && !isHidden  && order?.shipping_provider_type != 'seller_own_fleet' ? (
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
              order?.status !== 'canceled' &&
              order?.status !== 'shipped' &&
              order?.status !== 'delivered' &&
              order?.status !== 'confirmed' &&
              order?.status !== 'failed' &&
              order?.status !== 'ready_to_ship' ?
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
                return (
                  <>
                    <tr className="bw_detailS" key={`infor_bw_detailS_${order?.order_id}`}>
                      <td colspan="8">
                        <StyledDetailOrder>
                          <StyledInforProduct>
                            <div className="bw_inf_pro">
                              <BWImage className='img-product-thirty' src={detail?.product_main_image} alt='avatar' />
                            </div>
                            <div>
                              <h4 style={{
                                fontSize: '14px',
                                fontWeight: '500'
                              }}>{detail?.name}</h4>
                              <ul>
                                <li>Mã sản phẩm : {detail?.shop_sku}</li>
                                <li>ID sản phẩm : {detail?.sku_id} </li>
                                <li>Số lượng : {detail?.count} </li>
                              </ul>
                            </div>
                          </StyledInforProduct>
                          <div><span>{formatPrice(detail?.item_price)} đ</span></div>
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