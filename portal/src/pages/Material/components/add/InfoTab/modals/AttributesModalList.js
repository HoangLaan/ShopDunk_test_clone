import React, { useEffect, useState } from 'react';
import { notification, Pagination } from 'antd';

import { useProductAdd } from 'pages/Material/helpers/context';
import { getListAttributes } from 'services/material.service';

export default function AttributesModal(props) {
  const { setOpenModalAttribute, setOpenModalAttributeAdd, isOpenModalAttributeAdd } = useProductAdd();
  const [data, setData] = useState({
    query: {
      page: 1,
      itemsPerPage: 5,
      search: '',
    },
    attributeSelected: {},
    errors: {},
    dataAttributes: {},
  });

  const [attributeSelected, setAttributeSelected] = useState({});

  const { items = [], itemsPerPage = 5, totalItems = 0, totalPages = 0 } = data?.dataAttributes;

  useEffect(() => {
    setAttributeSelected(props.attributes);
  }, []);

  useEffect(() => {
    getData({ ...data.query, page: 1 });
  }, [isOpenModalAttributeAdd]);

  const getData = async (query) => {
    try {
      const res = await getListAttributes(query);
      setData((t) => ({ ...t, dataAttributes: res }));
    } catch (error) {
      notification.error({ message: error.message || error || 'Lỗi lấy danh sách thuộc tính.' });
    }
  };

  const handleChangePage = async (page) => {
    let _query = { ...data.query };
    _query.page = page;
    setData((t) => ({ ...t, query: _query }));
    getData(_query);
  };

  const handleKeyDownSearch = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      getData(data.query);
    }
  };

  const isCheckAll = () => {
    let findAttributeSelected = (items || []).filter((p) => attributeSelected[p?.attribute_id]);
    return findAttributeSelected.length === items.length;
  };

  const handleCheckAll = (e) => {
    let _attributeSelected = { ...attributeSelected };
    let { checked } = e.target;
    (items || []).forEach((e) => {
      if (checked) {
        _attributeSelected[e?.attribute_id] = e;
      } else {
        delete _attributeSelected[e?.attribute_id];
      }
    });
    setAttributeSelected(_attributeSelected);
  };

  const handleSelectedAttribute = (e) => {
    let { checked, value: p } = e.target;
    let _attributeSelected = { ...attributeSelected };
    if (checked) {
      _attributeSelected[p] = items.find((x) => x.attribute_id == p);
    } else {
      if (_attributeSelected[p]) {
        delete _attributeSelected[p];
      }
    }
    setAttributeSelected(_attributeSelected);
  };

  const styleModal = { marginLeft: '300px' };

  return (
    <div className='bw_modal bw_modal_open' id='bw_addattr'>
      <div className='bw_modal_container bw_w800' style={styleModal}>
        <div className='bw_title_modal'>
          <h3>Chọn thuộc tính</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={() => setOpenModalAttribute(false)}></span>
        </div>
        <div className='bw_main_modal'>
          <div className='bw_search'>
            <div className='bw_row'>
              <div className='bw_col_8'>
                <div className='bw_frm_box bw_readonly'>
                  <label>Tìm kiếm </label>
                  <input
                    onKeyDown={handleKeyDownSearch}
                    placeholder='Nhập tên thuộc tính'
                    onChange={(e) => setData((t) => ({ ...t, query: { ...t.query, search: e.target.value, page: 1 } }))}
                  />
                </div>
              </div>
              <div className='bw_col_4'>
                <div className='bw_frm_box'>
                  <label>&nbsp;</label>
                  <a
                    role={'button'}
                    onClick={() => setOpenModalAttributeAdd(true)}
                    data-href='#bw_formAdd'
                    className='bw_btn bw_btn_success bw_open_modal'>
                    Thêm mới
                  </a>
                </div>
              </div>
            </div>
          </div>
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
                  <th className=''>Tên thuộc tính</th>
                  <th>Loại thuộc tính</th>
                  <th>ĐVT</th>
                  <th>Mô tả</th>
                </thead>
                <tbody>
                  {items.length ? (
                    items.map((item, i) => (
                      <tr key={i}>
                        <td className='bw_sticky bw_check_sticky'>
                          <label className='bw_checkbox'>
                            <input
                              type='checkbox'
                              onChange={handleSelectedAttribute}
                              checked={attributeSelected[item?.attribute_id] || false}
                              name={`checkBox_${item?.attribute_id}`}
                              value={item?.attribute_id}
                            />
                            <span></span>
                          </label>
                        </td>
                        <td className=''>
                          <b>{item.attribute_name}</b>
                        </td>
                        <td>{item?.attribute_type}</td>
                        <td>{item?.unit_name}</td>
                        <td>{item?.description}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className='bw_text_center'>
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
          <button className='bw_btn bw_btn_success' onClick={() => props.onConfirm(attributeSelected)}>
            <span className='fi fi-rr-check'></span> Đồng ý
          </button>
          <button className='bw_btn_outline bw_close_modal' onClick={() => setOpenModalAttribute(false)}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
