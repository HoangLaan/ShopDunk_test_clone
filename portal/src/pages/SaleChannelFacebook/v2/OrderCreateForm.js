import React from 'react';
import fanpage_image from 'assets/bw_image/fanpage.jpg';
import user_image from 'assets/bw_image/user.png';
import user_admin_image from 'assets/bw_image/user_admin.png';
import img_cate_1_image from 'assets/bw_image/img_cate_1.png';

function OrderCreateForm() {
  return (
    <div className='bw_formAddCart'>
      <h3>Sản phẩm</h3>
      <div className='bw_row bw_mt_2'>
        <div className='bw_col_8'>
          <select
            id='bw_stock'
            className='bw_select_hidden-accessible'
            data-bw_select_id='bw_select_data-bw_stock'
            tabIndex={-1}
            aria-hidden='true'>
            <option data-bw_select_id='bw_select_data-10-8wk4'>-- Chọn kho --</option>
            <option>Blackwind Software</option>
            <option>Công ty Cổ phần HESMAN</option>
            <option>Bigfox</option>
          </select>
          <span
            className='bw_select bw_select_container bw_select_container--default'
            dir='ltr'
            data-bw_select_id='bw_select_data-9-gm8n'
            style={{ width: '190.667px' }}>
            <span className='selection'>
              <span
                className='bw_select_selection bw_select_selection--single'
                role='combobox'
                aria-haspopup='true'
                aria-expanded='false'
                tabIndex={0}
                aria-disabled='false'
                aria-labelledby='bw_select_bw_stock-container'
                aria-controls='bw_select_bw_stock-container'>
                <span
                  className='bw_select_selection__rendered'
                  id='bw_select_bw_stock-container'
                  role='textbox'
                  aria-readonly='true'
                  title='-- Chọn kho --'>
                  -- Chọn kho --
                </span>
                <span className='bw_select_selection__arrow' role='presentation'>
                  <b role='presentation' />
                </span>
              </span>
            </span>
            <span className='dropdown-wrapper' aria-hidden='true' />
          </span>
        </div>
        <div className='bw_col_4'>
          <button data-href='#bw_addproduct' className='bw_btn bw_btn_default bw_open_modal'>
            Chọn SP
          </button>
        </div>
      </div>
      <div className='bw_list_product'>
        <div className='bw_pro_items'>
          <span className='bw_del_pro'>
            <i className='fi fi-rr-trash' />
          </span>
          <img src={img_cate_1_image} alt={2} />
          <h6>iPhone 14 Pro Max - 256GB - Deep Purple - I14PM256DP</h6>
          <p>Có thể bán 3</p>
          <div className='bw_flex bw_align_items_center bw_justify_content_between bw_choose_price'>
            <input type='number' defaultValue={1} min={1} className='bw_inp' />
            <p>
              <b>= 14.000.000đ</b>
            </p>
          </div>
        </div>
        <div className='bw_pro_items'>
          <span className='bw_del_pro'>
            <i className='fi fi-rr-trash' />
          </span>
          <img src={img_cate_1_image} alt={2} />
          <h6>iPhone 14 Pro Max - 256GB - Deep Purple - I14PM256DP</h6>
          <p>Có thể bán 3</p>
          <div className='bw_flex bw_align_items_center bw_justify_content_between bw_choose_price'>
            <input type='number' defaultValue={1} min={1} className='bw_inp' />
            <p>
              <b>= 14.000.000đ</b>
            </p>
          </div>
        </div>
      </div>
      <div className='bw_box_toal'>
        <p>
          Tạm tính(đ): <b>14.000.000 đ</b>
        </p>
        <p>
          VAT: <span>+ 1.400.000 đ</span>
        </p>
        <p>
          Khuyến mãi(đ):{' '}
          <a data-href='#bw_chooseSale' className='bw_btn_outline bw_btn_outline_danger'>
            + Chọn
          </a>
        </p>
        <div className='bw_flex bw_align_items_center bw_justify_content_between'>
          Đơn vị vận chuyển:
          <div className='bw_choose_transport'>
            <img src={fanpage_image} alt={2} />
            Giao hàng nhanh
            <span className='bw_select_selection__arrow' role='presentation'>
              <b role='presentation' />
            </span>
            <div className='bw_list_transport'>
              <a href='#!' className='bw_items_page'>
                <img src={fanpage_image} alt={2} />
                Giao hàng nhanh
              </a>
              <a href='#!' className='bw_items_page'>
                <img src={fanpage_image} alt={2} />
                VNExpress
              </a>
            </div>
          </div>
        </div>
        <p>
          Phí vận chuyển(đ): <input type='number' defaultValue={0} className='bw_inp' />
        </p>
        <p>
          Tổng đơn hàng: <b className='bw_p'>14.000.000 đ</b>
        </p>
        <p>
          Đặt cọc: <input type='number' defaultValue={0} className='bw_inp' />
        </p>
        <p>
          Chứng từ cọc:
          <label className='bw_choose_image_banner'>
            <input type='file' multiple />
            <span className='fi fi-rr-picture' />
          </label>
        </p>
        <p>
          Còn lại: <b className='bw_p'>14.000.000 đ</b>
        </p>
      </div>
      <h5>Ghi chú đơn hàng</h5>
      <textarea placeholder='Mô tả' className='bw_inp' style={{ minHeight: 80 }} defaultValue={''} />
      <div className='bw_text_center bw_mt_2 bw_pb_3'>
        <a href='#!' className='bw_btn bw_btn_primary bw_doneCart'>
          Tạo đơn hàng
        </a>
        <br />
        <a className='bw_btn bw_doneCart bw_mt_1'>Quay lại</a>
      </div>
    </div>
  );
}

export default OrderCreateForm;
