/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import ItemOrderTypeStatus from './ItemOrderTypeStatus';
import OrderStatusModel from './Model/OrderStatusModel';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import OrderStatusAddModel from './Model/OrderStatusAddModel';

const OrderTypeStatus = ({ disabled, title, id, functionOpts }) => {
  const methods = useFormContext();
  const {
    watch,
    formState: { errors },
    control,
    setValue,
    clearErrors,
  } = methods;

  const [isOpenModelOrderStatus, setIsOpenModelOrderStatus] = useState(false);
  const [isOpenModelAddOrderStatus, setIsOpenModelAddOrderStatus] = useState(false);

  const validateReviews = (field) => {
    if (!field || field.length === 0) {
      return 'Vui lòng thêm trạng thái đơn hàng';
    }

    const checkCompleted = field.findIndex((x) => x.is_completed);
    if (checkCompleted < field.length - 1) {
      return 'Trạng thái hoàn thành là dòng cuối cùng';
    }
    return '';
  };

  const { update, remove, insert } = useFieldArray({
    control,
    name: 'order_status_list',
    rules: {
      required: false,
      validate: (field) => {
        let msg = validateReviews(field);

        if (msg) return msg;
        else {
          if (errors['order_status_list']) {
            clearErrors('order_status_list');
          }
        }
      },
    },
  });

  const handleSelect = (key, values = {}) => {
    if (values && Object.values(values).length) {
      clearErrors('order_status_list');
      // xét toàn bộ giá trị hoàn thành về false
      let newValue = Object.values(values).reduce(
        (a, v) => ({ ...a, ['key' + v.order_status_id]: { ...v, is_completed: false } }),
        {},
      );

      // Lấy phần tử cuối cùng
      let lastValue = Object.values(newValue).pop();
      const { order_status_id } = lastValue;
      newValue['key' + order_status_id].is_completed = true;

      let newData = Object.values(newValue);

      // lưu giá trị thay đổi
      methods.setValue(`${key}`, newData);
      setIsOpenModelOrderStatus(false);
    }
  };

  const handleSort = (type, idx) => {
    let value = watch('order_status_list') || [];
    if (type === 'up') {
      let tmp = value[idx];
      value[idx] = value[idx - 1];
      value[idx - 1] = tmp;
      value[idx].order_index = idx + 1;
      tmp.order_index = idx - 1;
    }
    if (type === 'down') {
      let tmp = value[idx];
      value[idx] = value[idx + 1];
      value[idx + 1] = tmp;
      value[idx].order_index = idx - 1;
      tmp.order_index = idx + 1;
    }
    setValue('order_status_list', value);
  };

  return (
    <BWAccordion title={title} id={id} isRequired>
      <div className='bw_flex bw_align_items_center bw_justify_content_right bw_btn_group'>
        <a
          data-href='#bw_addStatus'
          className='bw_btn_outline bw_btn_outline_success bw_open_modal'
          onClick={() => setIsOpenModelAddOrderStatus(true)}>
          Thêm mới trạng thái
        </a>
        <span className='bw_btn bw_btn_success bw_open_modal' onClick={() => setIsOpenModelOrderStatus(true)}>
          Chọn trạng thái
        </span>
      </div>
      <div className='bw_table_responsive bw_mt_2'>
        <table className='bw_table'>
          <thead>
            <th className='bw_text_center'>STT</th>
            <th></th>
            <th>Tên trạng thái</th>
            <th>Mô tả</th>
            <th className='bw_text_center'>Trạng thái hoàn thành</th>
            <th className='bw_text_center'>Gửi SMS</th>
            <th className='bw_text_center'>Gửi tin nhắn ZaloOA</th>
            <th className='bw_text_center'>Gửi Email</th>
            <th className='bw_text_center'>Thao tác</th>
          </thead>
          <tbody>
            {watch('order_status_list') &&
            watch('order_status_list').length &&
            watch('order_status_list').length > 0 ? (
              watch('order_status_list').map((p, index) => {
                return (
                  <ItemOrderTypeStatus
                    key={p.id}
                    index={index}
                    disabled={disabled}
                    item={p}
                    update={update}
                    insert={insert}
                    remove={remove}
                    keyStatus={`order_status_list.${index}`}
                    handleSort={handleSort}
                  />
                );
              })
            ) : (
              <tr>
                <td colSpan={50} className='bw_text_center'>
                  Chưa chọn trạng thái
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {errors['order_status_list'] && <ErrorMessage message={errors?.order_status_list?.root?.message} />}

      {isOpenModelOrderStatus && !disabled ? (
        <OrderStatusModel
          open={isOpenModelOrderStatus}
          onClose={() => setIsOpenModelOrderStatus(false)}
          selected={methods.watch('order_status_list') || {}}
          onConfirm={handleSelect}
        />
      ) : null}

      {isOpenModelAddOrderStatus && !disabled ? (
        <OrderStatusAddModel
          open={isOpenModelAddOrderStatus}
          onClose={() => setIsOpenModelAddOrderStatus(false)}
          functionOpts={functionOpts}
        />
      ) : null}
    </BWAccordion>
  );
};

export default OrderTypeStatus;
