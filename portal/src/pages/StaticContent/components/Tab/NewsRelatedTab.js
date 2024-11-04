/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo, useState } from 'react';
import ModelAddNews from '../Model/ModelAddNews';
import { useFormContext } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

const NewsRelated = ({ disabled }) => {
  const methods = useFormContext();
  const {
    watch,
    formState: { errors },
    control,
    setValue,
  } = methods;
  const { pathname } = useLocation();
  const isView = useMemo(() => pathname.includes('/detail') || pathname.includes('/view'), [pathname]);
  const [isOpenModel, setIsOpenModel] = useState(false);
  const handleSelect = (key, values = {}) => {
    if (values && Object.values(values).length) {
      let newData = Object.values(values);
      // lưu giá trị thay đổi
      setValue(`${key}`, newData);
      setIsOpenModel(false);
    }
  };

  const handleDeleteItem = (index) => {
    let value = [...(watch('news_related_list') || [])];
    value.splice(index, 1);
    setValue('news_related_list', value);
  };

  return (
    <React.Fragment>
      <div className='bw_col_12 bw_flex bw_justify_content_right bw_btn_group'>
        <button 
            type='button'
            className='bw_btn_outline bw_btn_outline_success bw_add_us'
            disabled={disabled || isView}
            onClick={() => (disabled || isView ? null : setIsOpenModel(true))}>
            <span className='fi fi-rr-plus'></span> Thêm bài viết
        </button>
        </div>
      <div class='bw_mt_3'>
        <div class='bw_table_responsive bw_mt_1'>
          <table class='bw_table'>
            <thead>
              <th>STT</th>
              <th>Tên bài viết</th>
              {/* <th>Loại bài viết</th> */}
              <th>Người tạo</th>
              <th>Ngày tạo</th>
              <th>Lượt xem</th>
              <th>Bình luận</th>
              <th>Trạng thái</th>
              <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>
            </thead>
            <tbody>
              {watch('news_related_list') &&
              watch('news_related_list').length &&
              watch('news_related_list').length > 0 ? (
                watch('news_related_list').map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.news_title}</td>
                      {/* <td>{item.news_type}</td> */}
                      <td>{item.created_user}</td>
                      <td className='bw_text_center'>{item.created_date}</td>
                      <td className='bw_text_center'>{item.view_count}</td>
                      <td className='bw_text_center'>
                        <span className='fi fi-rr-comments'> {item.total_comment}</span>
                      </td>
                      <td>
                        {item.is_active ? (
                          <span class='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
                        ) : (
                          <span class='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
                        )}
                      </td>
                      <td className='bw_sticky bw_action_table bw_text_center'>
                        <a
                          className='bw_btn_table bw_delete bw_red'
                          onClick={() => (disabled || isView ? null : handleDeleteItem(index))}
                          disabled={disabled || isView}>
                          <i class='fi fi-rr-trash'></i>
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={50} className='bw_text_center'>
                    Chưa chọn bài viết liên quan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isOpenModel ? (
          <ModelAddNews
            open={isOpenModel}
            onClose={() => setIsOpenModel(false)}
            selected={methods.watch('news_related_list') || {}}
            onConfirm={handleSelect}
          />
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default NewsRelated;
