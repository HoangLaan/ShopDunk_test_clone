import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { notification, Pagination, Spin } from 'antd';

// Services
import { getListPrintBarcode } from 'services/product.service';
import { formatCurrency } from 'pages/Product/helpers/index';
import ProductModalFilter from './ProductModalFilter';

export default function ProductsModal({ onClose, onConfirm }) {
  const methods = useFormContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    query: {
      page: 1,
      itemsPerPage: 5,
      search: '',
      product_category_id: methods.getValues('product_category_id'),
      manufacturer_id: methods.getValues('manufacturer_id'),
      product_model_id: methods.getValues('model_id.value'),
    },
    productSelected: {},
    errors: {},
    dataProducts: {},
  });

  const [productSelected, setProductSelected] = useState({});
  const { items = [], itemsPerPage = 5, totalItems = 0, totalPages = 0 } = data?.dataProducts;

  const getData = async (query = {}) => {
    try {
      setLoading(true);
      query = {
        ...query,
        stocks_id: methods.getValues('stock'),
        output_type_id: methods.getValues('output_type'),
        area_id: methods.getValues('area'),
        business_id: methods.getValues('business'),
        from_date: methods.getValues('from_date'),
        to_date: methods.getValues('to_date'),
        stock_in_request_id: methods.getValues('stock_in_request'),
      };
      const res = await getListPrintBarcode(query);
      if (res) {
        setLoading(false);
      }
      setData((t) => ({ ...t, dataProducts: res }));
    } catch (error) {
      notification.error({ message: error.message || error || 'Lỗi lấy danh sách sản phẩm.' });
    }
  };

  const handleChangePage = async (page) => {
    let _query = { ...data.query };
    _query.page = page;
    setData((t) => ({ ...t, query: _query }));
    getData(_query);
  };

  const isCheckAll = () => {
    let findProductSelected = (items || []).filter((p) => productSelected[p?.product_id]);
    return findProductSelected.length === items.length && items.length;
  };

  const handleCheckAll = (e) => {
    let _productSelected = { ...productSelected };
    let { checked } = e.target;
    (items || []).forEach((e) => {
      if (checked) {
        _productSelected[e?.product_id] = e;
      } else {
        delete _productSelected[e?.product_id];
      }
    });
    setProductSelected(_productSelected);
  };

  const handleSelectedProduct = (e) => {
    let { checked, value: p } = e.target;
    let _productSelected = { ...productSelected };
    if (checked) {
      _productSelected[p] = items.find((x) => x.product_id == p);
    } else {
      if (_productSelected[p]) {
        delete _productSelected[p];
      }
    }
    setProductSelected(_productSelected);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='bw_modal bw_modal_open' id='bw_addattr'>
      <div className='bw_modal_container bw_w800'>
        <div className='bw_title_modal'>
          <h3>Chọn sản phẩm</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose}></span>
        </div>
        <div className='bw_main_modal'>
          <ProductModalFilter setData={setData} getData={getData} data={data} setProductSelected={setProductSelected} />
          <div className='bw_box_card bw_mt_1'>
            <div className='bw_table_responsive'>
              <table className='bw_table'>
                <thead>
                  <th className='bw_sticky bw_check_sticky'>
                    <label className='bw_checkbox'>
                      <input
                        type='checkbox'
                        name='checkAll'
                        checked={isCheckAll()}
                        onChange={handleCheckAll}
                        value={'all'}
                      />
                      <span></span>
                    </label>
                  </th>
                  <th className=''>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá</th>
                  <th>Ngành hàng</th>
                  <th>Hãng</th>
                  <th>Đơn vị tính</th>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={12} className='bw_text_center'>
                      <Spin />
                      </td>
                    </tr>
                  ) : items && items.length ? (
                    items.map((product, i) => (
                      <tr key={i}>
                        <td className='bw_sticky bw_check_sticky'>
                          <label className='bw_checkbox'>
                            <input
                              type='checkbox'
                              onChange={handleSelectedProduct}
                              checked={productSelected[product?.product_id] || false}
                              name={`checkBox_${product?.product_id}`}
                              value={product?.product_id}
                            />
                            <span></span>
                          </label>
                        </td>
                        <td className=''>
                          <b>{product.product_code}</b>
                        </td>
                        <td>
                          <div className='bw_inf_pro'>
                            <img alt='' src={product?.picture_url} /> {product?.product_name}
                          </div>
                        </td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>{product.category_name}</td>
                        <td>{product.manufacture_name}</td>
                        <td>{product.unit_name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className='bw_text_center'>
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className='bw_row bw_mt_2 bw_show_table_page'>
              <div className='bw_col_6'>
                <p>
                  {' '}
                  Show {itemsPerPage * (data?.query?.page - 1) + 1} -{' '}
                  {data?.query?.page == totalPages ? totalItems : itemsPerPage * data?.query?.page} of {totalItems}{' '}
                  records
                </p>
              </div>
              <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center'>
                <Pagination
                  simple
                  current={data?.query?.page}
                  total={totalItems}
                  pageSize={data?.query?.itemsPerPage}
                  onChange={handleChangePage}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='bw_footer_modal'>
          <button className='bw_btn bw_btn_success' onClick={() => onConfirm(productSelected)}>
            <span className='fi fi-rr-check'></span> Chọn sản phẩm
          </button>
          <button className='bw_btn_outline bw_close_modal' onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
