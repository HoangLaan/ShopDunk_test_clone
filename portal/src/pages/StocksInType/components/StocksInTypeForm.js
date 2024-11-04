/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from 'react';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext, useFieldArray } from 'react-hook-form';
import Review from './Review';
import { showToast } from 'utils/helpers';
import { getListStocksInReviewOptions } from '../helpers/call-api';
import { mapDataOptions4Select } from 'utils/helpers';
import ErrorMessage from '../../../components/shared/BWFormControl/ErrorMessage';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';

export function StocksInTypeInfo({ disabled }) {
  const stocksInTypeOptions = useMemo(
    () => [
      { label: 'Nhập điều chuyển', value: 0 },
      { label: 'Nhập hàng mới', value: 1 },
      { label: 'Nhập hàng thừa kiểm kê', value: 2 },
      { label: 'Nhập trả hàng lại', value: 3 },
      { label: 'Nhập bảo hành', value: 4 },
      { label: 'Nhập thu cũ', value: 5 },
      { label: 'Nhập nội bộ', value: 6 },
      { label: 'Nhập khác', value: 7 },
      { label: 'Hàng bán bị trả lại', value: 8 },
    ],
    [],
  );

  return (
    <BWAccordion title='Thông tin nhập kho' id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem label='Tên hình thức phiếu nhập' isRequired>
            <FormInput
              type='text'
              field='stocks_in_type_name'
              placeholder='Nhập tên hình thức phiếu'
              validation={{
                required: 'Tên hình thức phiếu là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>

        <div className='bw_col_12'>
          <FormItem label='Loại hình thức nhập kho' isRequired>
            <FormRadioGroup
              disabled={disabled}
              list={stocksInTypeOptions}
              field='stocks_in_type'
              content='Loại hình thức nhập kho'
              custom={true}
            />
          </FormItem>
        </div>

        <div className='bw_col_12'>
          <FormItem label='Mô tả'>
            <FormTextArea field='description' rows={2} disabled={disabled} placeholder='Mô tả hình thức nhập kho' />
          </FormItem>
          <div className='bw_mt_1'>
            <label className='bw_checkbox'>
              <FormInput type='checkbox' field='is_auto_review' disabled={disabled} />
              <span />
              Tự động duyệt
            </label>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
}

export function StocksInTypeReview({ disabled }) {
  const methods = useFormContext();
  const {
    watch,
    formState: { errors },
    control,
    setValue,
    clearErrors,
  } = methods;

  const validateReviews = (field) => {
    if (watch('is_auto_review')) {
      return '';
    }
    if (!field || field.length === 0) {
      return 'Vui lòng thêm mức duyệt';
    }
    const checkReviewLevelId = field.findIndex((item, index) => {
      return item.stocks_review_level_id == null;
    });
    if (checkReviewLevelId !== -1) {
      return `Vui lòng chọn mức duyệt dòng thứ ${checkReviewLevelId + 1}`;
    }
    const checkUsers = field.findIndex((item, index) => {
      return !item.users.length && !item.is_auto_reviewed;
    });
    if (checkUsers !== -1) {
      return `Vui lòng chọn người duyệt dòng thứ ${checkUsers + 1}`;
    }
    const checkCompleted = field.findIndex((x) => x.is_completed_reviewed);
    if (checkCompleted < 0) {
      return 'Mức duyệt cuối là bắt buộc.';
    }
    if (checkCompleted < field.length - 1) {
      return 'Mức duyệt cuối phải là dòng cuối cùng';
    }

    const checkExistUsers = field.filter((item) => item.users.length > 0);

    if (!checkExistUsers || checkExistUsers.length === 0) {
      return 'Vui lòng chọn 1 mức duyệt có người duyệt';
    }
    return '';
  };

  const { fields, update, remove, insert } = useFieldArray({
    control,
    name: 'stocks_in_review_level_list',
    rules: {
      required: false,
      validate: (field) => {
        let msg = validateReviews(field);

        if (msg) return msg;
        else {
          if (errors['stocks_in_review_level_list']) {
            clearErrors('stocks_in_review_level_list');
          }
        }
      },
    },
  });

  const handleAddReview = () => {
    let _reviews = [...(watch('stocks_in_review_level_list') || [])];
    let checkReview = (watch('stocks_in_review_level_list') || []).find(
      (p) => !p?.stocks_review_level_id || (!p?.is_auto_reviewed && !p?.users.length),
    );
    if (!checkReview || !_reviews.length) {
      resetIsCompleted();
      insert(_reviews.length + 1, {
        is_auto_reviewed: false,
        stocks_review_level_id: null,
        users: [],
        is_completed_reviewed: 1,
      });
    }
  };

  const resetIsCompleted = (index = 0) => {
    let _reviews = [...(watch('stocks_in_review_level_list') || [])];
    _reviews = _reviews.map((p, i) => {
      return {
        ...p,
        is_completed_reviewed: index ? (i != index ? false : p?.is_completed_reviewed) : false,
      };
    });
    setValue('stocks_in_review_level_list', _reviews);
  };

  const [stocksInReviewOpts, setStocksInReviewOpts] = useState([]);

  const getStocksInReviewOption = async () => {
    try {
      let data = await getListStocksInReviewOptions({ stocks_type: 1 });
      setStocksInReviewOpts(mapDataOptions4Select(data));
    } catch (error) {
      showToast.error('Có lỗi xảy ra!');
    }
  };

  useEffect(() => {
    getStocksInReviewOption();
  }, []);

  return (
    <BWAccordion title='Thông tin mức duyệt' id='bw_info_cus' isRequired>
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
            <th className='bw_text_center'>Mức duyệt</th>
            <th className='bw_text_center'>Người duyệt</th>
            <th className='bw_text_center'>Tự động duyệt</th>
            <th className='bw_text_center'>Mức duyệt cuối</th>
            <th className='bw_sticky bw_action_table'>Thao tác</th>
          </thead>
          <tbody>
            {fields && fields.length ? (
              fields.map((p, index) => {
                return (
                  <Review
                    key={p.id}
                    index={index}
                    disabled={disabled}
                    stocksInReviewOpts={stocksInReviewOpts}
                    item={p}
                    update={update}
                    insert={insert}
                    remove={remove}
                    resetIsCompleted={resetIsCompleted}
                    keyUser={`stocks_in_review_level_list.${index}`}
                  />
                );
              })
            ) : (
              <tr>
                <td colSpan={50} className='bw_text_center'>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {errors['stocks_in_review_level_list'] && (
        <ErrorMessage message={errors?.stocks_in_review_level_list?.root?.message} />
      )}

      {disabled ? null : (
        <a data-href className='bw_btn_outline bw_btn_outline_success bw_add_us' onClick={handleAddReview}>
          <span className='fi fi-rr-plus'></span> Thêm
        </a>
      )}
    </BWAccordion>
  );
}

export function StocksInTypeStatus({ disabled }) {
  return (
    <BWAccordion title='Trạng thái' id='bw_mores' isRequired={false}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_active' disabled={disabled} />
                <span />
                Kích hoạt
              </label>
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_system' disabled={disabled} />
                <span />
                Hệ thống
              </label>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
}
