import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { deleteUnit } from 'services/unit.service';
import styled from 'styled-components';
import BWImage from 'components/shared/BWImage/index';
// import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect'
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { Tooltip } from 'antd';

const TableProductShopee = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  productOption = [],
  fetchProductOpts,
  handleChangeProduct,
  handleDeleteProduct,
  handelUpdateProductToShopee
}) => {
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


  const columns = useMemo(
    () =>  [
    {
      header: 'Sản phẩm Shopee',
      accessor: 'product_thirty',
      formatter: (_) => {
        let { image = {} } = (_ || {});
        let { image_url_list = [] } = (image || {});
        let { seller_stock = [] } = (_ || {});
        let { stock = 0 } = (seller_stock && seller_stock.length && seller_stock[0] ? seller_stock[0] : {});
        return <React.Fragment>
          <div className="bw_inf_pro" style={{ width: '13vw' }}>
            <BWImage className='img-product-thirty' src={image_url_list && image_url_list.length > 0 && image_url_list[0] ? image_url_list[0] : null} alt='avatar' />
            <StyleInforProduct>
              <Tooltip placement="bottom" title={`${_?.item_name}`}>
                <NameProduct>{_?.item_name}</NameProduct>
              </Tooltip>
              <p>Mã sản phẩm: {_?.product_code}</p>
              <p>Lượt bán: {_?.sale}</p>
              <p>ID sản phẩm: {_?.item_id}</p>
              <p>Tồn kho: {stock}</p>
            </StyleInforProduct>
          </div>
        </React.Fragment>;
      },
    },
    {
      header: 'Sản phẩm Portal',
      accessor: 'product_in_portal',
      formatter: (_) => {
        let { product_portal = null } = (_ || {});
        if (product_portal && Object.keys(product_portal).length > 0) {
          let { picture_url = '' } = (product_portal || {});
          return <React.Fragment>
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
                  onClick={() => handleDeleteProduct(_)} size='sm'>
                  Xóa sản phẩm
                </ButtonCustom>
              </div>
            </StyleContainerProductProtal>

          </React.Fragment>;
        } else {
          return <React.Fragment>
            <div className="bw_inf_pro">
              {/* <FormDebouneSelect
                  field='product_id'
                  id='product_id'
                  options={productOption}
                  allowClear={true}
                  style={{ width: '100%' }}
                  fetchOptions={fetchProductOpts}
                  debounceTimeout={500}
                  placeholder={"-- Chọn sản phẩm --"}
                  onChange={(e) => handleChangeProduct(e, _)}
                /> */}

              <FormSelect
                field='product_id'
                placeholder='Chọn sản phẩm'
                style={{ width: '100%' }}
                list={productOption}
                onChange={(e) => handleChangeProduct(e, _)}
              />
            </div>
          </React.Fragment>;
        }

      },
    },
  ], [])

  const actions = [
    {
      icon: 'fi fi-rr-refresh',
      color: 'red',
      permission: '',
      onClick: (p) => {
        handelUpdateProductToShopee(p)
      },
    },
  ]

  const handleDelete = async (id) => {
    await deleteUnit(id);
    onRefresh();
  };

  const handleBulkAction = (items, action) => {
    if (action === 'delete') {
      if (Array.isArray(items)) {
        (items || []).forEach((item) => {
          handleDelete(item.unit_id);
        });
      }
    }
  };

  return (
    <React.Fragment>
      <DataTable
        fieldCheck={'item_id'}
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
      />
    </React.Fragment>
  );
};

export default TableProductShopee;
