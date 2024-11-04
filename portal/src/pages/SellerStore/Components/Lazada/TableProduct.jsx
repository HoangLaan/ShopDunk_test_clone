import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteUnit } from 'services/unit.service';
import styled from 'styled-components';
import BWImage from 'components/shared/BWImage/index';
// import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect'
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { Tooltip } from 'antd';
import { convertArrayToObjectLazadaProduct } from '../../helpers/constaint';
import moment from 'moment';
import { Checkbox } from 'antd';

const TableProductLazada = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  productOption,
  fetchProductOpts,
  handleChangeProduct,
  handleDeleteProduct,
  handelUpdateProductToLazada,
  checkedListProduct = {},
  setCheckedListProduct,
  isHidden
}) => {

  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(parseInt(page));


  const StyleInforProduct = styled.div`

  `;

  const StyleNameProduct = styled.p`
    font-weight: bold;
  `

  const StyleInforChild = styled.p`
    font-size: 10px;
    font-weight: 700;
    color: #808080;
  `

  const ButtonCustom = styled.button`
    background: none !important;
    border: none;
    padding: 0 !important;
    text-decoration: underline;
    cursor: pointer;
    color: #069;
    font-family: arial, sans-serif;
  `;

  const StyleContainerProductProtal = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `

  const NameProduct = styled.h4`
    text-overflow: ellipsis;
    overflow: hidden; 
    width: 330px; 
    white-space: nowrap;
    font-size: 14px;
    font-weight: 500;
  `


  const onChangeChecked = (e) => {
    let list = { ...checkedListProduct };
    if (e.target.checked) {
      list[e.target.value?.SkuId] = e.target.value;
    } else {
      delete list[e.target.value?.SkuId];
    }
    setCheckedListProduct(list);
  };

  const onCheckAllChange = (e) => {
    let list = convertArrayToObjectLazadaProduct(data);
    setCheckedListProduct(e.target.checked ? list : {});
  };

  const convertISOtoDate = (date) => {
    if (date) {
      let mydate = new Date(date);
      return moment(mydate).format('MM/DD/YYYY  h:mm:ss');
    }
  }
  useEffect(() => {
    if (checkedListProduct && Object.values(checkedListProduct)?.length <= 0) {
      setIndeterminate(false);
      setCheckAll(false);
    }
  }, [checkedListProduct]);

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
    let isIndenterminate = !!Object.values(checkedListProduct).length && Object.values(checkedListProduct).length < data.length;
    let isCheckall = (Object.values(checkedListProduct).length > 0 && data.length > 0) && (Object.values(checkedListProduct).length == data.length);
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
        <th className="bw_text_center">Sản phẩm Lazada</th>
        <th className="bw_text_center">Sản phẩm portal</th>
        <th className="bw_sticky bw_action_table bw_text_center">Thao tác</th>
      </thead>)
  }

  const renderBody = () => {
    if (data && data.length > 0) {
      return (data || []).map((product, index) => {
        let { image_url_list = [], skus = [] } = (product || {});
        let { product_portal = null } = (product || {});
        let { picture_url = '' } = (product_portal || {});
        let checked = checkedListProduct.hasOwnProperty(`${product?.SkuId}`);
        return (
          <tr key={`product_${product?.SkuId}`}>
            <td>
              <Checkbox onChange={onChangeChecked} checked={checked} value={product} />
            </td>
            <td>
              <React.Fragment>
                <div className="bw_inf_pro" style={{ width: '13vw' }}>
                  <BWImage className='img-product-thirty' src={image_url_list && image_url_list.length > 0 && image_url_list[0] ? image_url_list[0] : null} alt='avatar' />
                  <StyleInforProduct>
                    <Tooltip placement="bottom" title={`${product?.item_name}`}>
                      <NameProduct>{product?.item_name}</NameProduct>
                    </Tooltip>
                    <p>Mã sản phẩm: {product?.product_code}</p>
                    <p>ID sản phẩm: {product?.SkuId}</p>
                    <p>Tồn kho: {product?.quantity}</p>
                  </StyleInforProduct>
                </div>
              </React.Fragment>
            </td>
            <td>
              {(product_portal && Object.keys(product_portal).length > 0) ?
                <React.Fragment>
                  <StyleContainerProductProtal>
                    <div className="bw_inf_pro" style={{ width: '10vw' }}>
                      <BWImage className='img-product-in-portal' src={picture_url} alt='avatar' />
                      <StyleInforProduct>
                        <Tooltip placement="bottom" title={`${product_portal?.product_name}`}>
                          <NameProduct>{product_portal?.product_name}</NameProduct>
                        </Tooltip>
                        <p>Mã sản phẩm : {product_portal?.product_code}</p>
                        <p>ID sản phẩm : {product_portal?.product_id}</p>
                        <p>Tồn kho : {product_portal?.total_inventory}</p>
                      </StyleInforProduct>
                    </div>
                    <div>
                      <ButtonCustom
                        title='Xóa sản phẩm'
                        onClick={() => handleDeleteProduct(product)} size='sm'>
                        Xóa sản phẩm
                      </ButtonCustom>
                    </div>
                  </StyleContainerProductProtal>
                </React.Fragment> :

                <React.Fragment>
                  <div className="bw_inf_pro">
                    <FormSelect
                      field='product_id'
                      placeholder='Chọn sản phẩm'
                      style={{ width: '100%' }}
                      list={productOption}
                      onChange={(e) => handleChangeProduct(e, product)}
                    />
                  </div>
                </React.Fragment>
              }
            </td>
            <td className='bw_sticky bw_action_table bw_text_center'>
              {
                !isHidden ? 
                <Tooltip placement="bottom" title={'Đồng bộ tồn kho lên sàn'}>
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    handelUpdateProductToLazada(product)
                  }} className="bw_btn_table bw_green bw_open_modal bw_red" style={{ marginRight: '5px' }}>
                    <i className="fi fi-rr-refresh"></i>
                  </a>
                </Tooltip> : null
              }

            </td>
          </tr>
        )
      })
    }
  }


  return (
    <React.Fragment>
      <div className="bw_table_responsive bw_mt_2">
        <table className="bw_table">
          {renderHeader()}
          {renderBody()}
        </table>
      </div>
    </React.Fragment>
  );
};

export default TableProductLazada;
