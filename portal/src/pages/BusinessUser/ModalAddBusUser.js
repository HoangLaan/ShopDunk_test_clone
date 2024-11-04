import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from 'context/AuthProvider';
import { getOptionsForUser } from 'services/company.service';
import { mapDataOptions4Select, showToast } from 'utils/helpers';
import { getOptionsBusiness } from 'services/business.service';
import { Select, Pagination } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { createBusinessUser, getListAllUser, getOptionsStore, getUserOfBus } from 'services/business-user.service';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import { Empty } from 'antd';
const SelectStyle = styled(Select)`
  display: flex;
  .ant-select-selector {
    font-size: 15px !important;
    width: 100%;
    padding: 0 !important;
  }
  .ant-select-arrow .anticon:not(.ant-select-suffix) {
    pointer-events: none;
  }
  .ant-select-selection-search {
    width: 100%;
    inset-inline-start: 0 !important;
    inset-inline-end: 0 !important;
  }
`;

function ModalAddBusUser({ handleCloseModal }) {
  const { user } = useAuth();
  const [data, setData] = useState({
    company_id: null,
    business_id: null,
    store_id: null,
    page: 1,
    itemsPerPage: 5,
    userSelected: {},
    optionsCompany: [],
    optionsBus: [],
    optionsStore: [],
    dataAllUser: {},
    errors: {},
    search: '',
  });

  const { items = [], itemsPerPage = 5, totalItems = 0, totalPages = 0 } = data?.dataAllUser;

  useEffect(() => {
    getData();
    getUsers(data);
  }, []);

  useEffect(() => {
    if (data?.optionsCompany?.length === 1) {
      data.company_id = data.optionsCompany[0].id;
      handleChangeCompany(data.company_id);
    }
  }, [data.optionsCompany]);
  const getData = async () => {
    let _companys = await getOptionsForUser(user.user_name);
    setData((t) => ({ ...t, optionsCompany: mapDataOptions4Select(_companys) }));
  };


  const getUsers = async (_query) => {
    try {
      let dataAllUser = await getListAllUser(_query);
      setData((t) => ({ ...t, dataAllUser }));
    } catch (error) { }
  };

  const handleChangeCompany = async (company_id) => {
    let _business = [];
    if (company_id) _business = await getOptionsBusiness({ company_id });
    setData((t) => ({
      ...t,
      optionsBus: mapDataOptions4Select(_business),
      company_id,
      business_id: !company_id ? null : t.business_id,
      userSelected: {},
      errors: {},
    }));
  };

  const handleChangeBusiness = async (business_id) => {
    try {
      //let userSelected = {};
      let optionsStore = [];
      if (business_id) {
        //userSelected = await getUserOfBus(business_id);
        optionsStore = await getOptionsStore({
          business_id: business_id,
          company_id: data?.company_id,
        });
      }
      setData((t) => ({ ...t, business_id, optionsStore, errors: {} }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePage = async (page) => {
    let _query = { ...data, page };
    getUsers(_query);
    setData(_query);
  };

  const handleSearch = async (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      await getUsers(data);
    }
  };
  const handleSelectedUser = (e) => {
    let { checked, value: p } = e.target;
    let _userSelected = { ...data.userSelected };
    if (checked) {
      _userSelected[p] = p;
    } else {
      if (_userSelected[p]) {
        delete _userSelected[p];
      }
    }
    setData((t) => ({ ...t, userSelected: _userSelected }));
  };

  const _renderTableUser = () => {
    if (items && items.length > 0) {
      return items.map((p) => {
        return (
          <tr key={p?.user_id}>
            <td className='bw_sticky bw_check_sticky bw_text_center'>
              <label className='bw_checkbox'>
                <input
                  type='checkbox'
                  onChange={handleSelectedUser}
                  checked={data?.userSelected[p?.user_id] || false}
                  name={`checkBox_${p?.user_id}`}
                  value={p?.user_id}
                />
                <span></span>
              </label>
            </td>
            <td>
              <b>
                {p?.user_name} - {p?.full_name}
              </b>
            </td>
            <td>{p?.department_name}</td>
            <td className='bw_text_center'>{p?.phone_number}</td>
            <td>{p?.email}</td>
          </tr>
        );
      });
    }
    return (
      <tr>
        <td colSpan={50}>
          {' '}
          <Empty description={'Không có dữ liệu'} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </td>
      </tr>
    );
  };

  const isCheckAll = () => {
    let findUserSelected = (items || []).filter((p) => data?.userSelected[p?.user_id]);
    return findUserSelected.length === items.length && items.length !== 0;
  };

  const handleCheckAll = (e) => {
    let _userSelected = { ...data?.userSelected };
    let { checked } = e.target;
    (items || []).forEach((e) => {
      if (checked) {
        _userSelected[e?.user_id] = e;
      } else {
        delete _userSelected[e?.user_id];
      }
    });
    setData((t) => ({ ...t, userSelected: _userSelected }));
  };

  const validate = () => {
    let errors = {};
    if (!data?.company_id) {
      errors['company_id'] = 'Công ty là bắt buộc.';
    }
    if (!data?.business_id) {
      errors['business_id'] = 'Miền là bắt buộc.';
    }
    if (!data?.store_id) {
      errors['store_id'] = 'Cửa hàng là bắt buộc.';
    }

    return errors;
  };
  const handleSubmit = async () => {
    try {
      //Validate
      let errors = validate();
      if (Object.keys(errors).length) {
        setData((t) => ({ ...t, errors }));
        return;
      }
      let values = {
        business_id: data?.business_id,
        company_id: data?.company_id,
        store_id: data?.store_id,
        items: Object.keys(data?.userSelected || {}).map((p) => p),
      };
      await createBusinessUser(values);
      showToast.success('Phân nhân viên cửa hàng thành công');

      handleCloseModal(true);
      return;
    } catch (error) {
      showToast.error('Phân nhân viên cửa hàng thất bại');
    }
  };

  //style to set up position for modal
  const styleModal = { marginLeft: '300px' };

  return (
    <div class='bw_modal bw_modal_open' id='bw_add_nv'>
      <div class='bw_modal_container bw_w900' style={styleModal}>
        <div class='bw_title_modal'>
          <h3>Phân nhân viên cửa hàng</h3>
          <span class='bw_close_modal fi fi-rr-cross-small' onClick={handleCloseModal}></span>
        </div>
        <div className='bw_main_modal bw_border_top'>
          <div className='bw_row'>
            <div className='bw_col_3'>
              <div className='bw_frm_box bw_readonly' style={{ height: '70px' }}>
                <label>Tên, Mã nhân viên</label>
                <input
                  type='text'
                  placeholder='Tên, mã, email nhân viên'
                  onKeyDown={handleSearch}
                  onChange={(e) => setData((t) => ({ ...t, search: e.target.value }))}
                />
              </div>
            </div>
            <div className='bw_col_3'>
              <div className='bw_frm_box bw_readonly'>
                <label>
                  Công ty <span className='bw_red'>*</span>
                </label>
                <SelectStyle
                  suffixIcon={<CaretDownOutlined />}
                  bordered={false}
                  showSearch={true}
                  allowClear={true}
                  placeholder={'--Chọn--'}
                  optionFilterProp='children'
                  disabled={false}
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  defaultValue={data?.optionsCompany?.length === 1 ? data?.optionsCompany[0] : data?.company_id}
                  value={data?.company_id}
                  options={data?.optionsCompany}
                  onChange={handleChangeCompany}
                />
                {data?.errors['company_id'] && <ErrorMessage message={data?.errors['company_id']} />}
              </div>
            </div>
            <div className='bw_col_3'>
              <div className='bw_frm_box bw_readonly'>
                <label>
                  Miền <span className='bw_red'>*</span>
                </label>
                <SelectStyle
                  suffixIcon={<CaretDownOutlined />}
                  bordered={false}
                  showSearch={true}
                  allowClear={true}
                  disabled={!data?.company_id}
                  placeholder={'--Chọn--'}
                  optionFilterProp='children'
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  defaultValue={data?.business_id}
                  value={data?.business_id}
                  options={data?.optionsBus}
                  onChange={handleChangeBusiness}
                />
                {data?.errors['business_id'] && <ErrorMessage message={data?.errors['business_id']} />}
              </div>
            </div>
            <div className='bw_col_3'>
              <div className='bw_frm_box bw_readonly'>
                <label>
                  Cửa hàng <span class='bw_red'>*</span>
                </label>
                <SelectStyle
                  suffixIcon={<CaretDownOutlined />}
                  bordered={false}
                  showSearch={true}
                  allowClear={true}
                  disabled={!data?.business_id}
                  placeholder={'--Chọn--'}
                  optionFilterProp='children'
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  defaultValue={data?.store_id}
                  value={data?.store_id}
                  options={data?.optionsStore}
                  onChange={async (value) => {
                    const userSelected = await getUserOfBus(value);
                    setData((prev) => ({
                      ...prev,
                      userSelected,
                      store_id: value,
                    }));
                  }}
                />
                {data?.errors['store_id'] && <ErrorMessage message={data?.errors['store_id']} />}
              </div>
            </div>
            <div className='bw_col_12'>
              <h3 style={{ marginBottom: 7, fontWeight: 700 }}>Danh sách nhân viên</h3>
              <div className='bw_table_responsive'>
                <table className='bw_table'>
                  <thead>
                    <tr>
                      <th className='bw_sticky bw_check_sticky bw_text_center'>
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
                      <th className='bw_text_center'>Nhân viên</th>
                      <th className='bw_text_center'>Phòng ban</th>
                      <th className='bw_text_center'>Điện thoại</th>
                      <th className='bw_text_center'>Mail</th>
                    </tr>
                  </thead>
                  <tbody>{_renderTableUser()}</tbody>
                </table>
              </div>
            </div>
            <div className='bw_col_12 bw_mt_2 bw_flex'>
              <div className='bw_col_6'>
                <p>
                  {' '}
                  Show {totalItems == 0 ? itemsPerPage * 0 : itemsPerPage * (data?.page - 1) + 1} -{' '}
                  {data?.page !== totalPages && totalItems == 0 ? 0 : itemsPerPage * data?.page} of {totalItems} records
                </p>
              </div>
              <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center'>
                <Pagination
                  simple
                  current={data?.page}
                  total={totalItems}
                  pageSize={data?.itemsPerPage}
                  onChange={handleChangePage}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='bw_footer_modal'>
          <button className='bw_btn bw_btn_success' onClick={handleSubmit}>
            <span className='fi fi-rr-check'></span> Cập nhật
          </button>
          <button type='button' className='bw_btn_outline bw_btn_outline_success' onClick={handleCloseModal}>
            <span className='fi fi-rr-refresh'></span>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalAddBusUser;
