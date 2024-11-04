import React, { useState, useMemo, useEffect } from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import _ from 'lodash';
import { useFormContext } from 'react-hook-form';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import ICON_COMMON from 'utils/icons.common';
import PropTypes from 'prop-types';
import PromotionProductCategoryModal from '../modal/PromotionProductCategoryModal';

const PromotionProductCategory = ({ loading, title, disabled }) => {
  const methods = useFormContext();
  const { watch } = methods;
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(undefined);

  useEffect(() => {
    methods.clearErrors('check_product_category');
    if (watch('is_apply_product_category') || watch('product_category_apply_list')?.length > 0) {
      methods.unregister('check_product_category', {});
    } else {
      methods.register('check_product_category', { required: 'Ngành hàng áp dụng là bắt buộc' });
    }
  }, [watch('is_apply_product_category'), watch('product_category_apply_list')]);

  const columns = useMemo(
    () => [
      {
        header: 'Tên ngành hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'category_name',
      },
      {
        header: 'Thuộc ngành hàng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => {
          const parentList = `${p?.parent_name}`.split('|');
          if (!parentList.length || parentList.length == 1) return <b>--</b>;
          // Remove last item
          parentList.pop();
          let parentName = parentList.map((x, i) => (i < parentList.length - 1 ? ' -- ' : x)).join(' ');
          return <b>{`|-- ${parentName}`}</b>;
        },
      },
      {
        header: 'Công ty áp dụng',
        classNameHeader: 'bw_text_center',
        accessor: 'company_name',
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <div class='bw_inf_pro'>
            <img
              src={/[\/.](gif|jpg|jpeg|tiff|png)$/i.test(p?.created_user_avatar) ? p.created_user_avatar : ''}
              onError={(e) => (e.target.src = 'bw_image/img_cate_default.png')}
            />
            {p?.created_user}
          </div>
        ),
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        formatter: (p) => p?.created_date,
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Chọn ngành hàng',
        permission: 'PROMOTION_ADD',
        hidden: disabled,
        onClick: () => {
          setModalOpen(true);
        },
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        hidden: disabled,
        permission: 'PROMOTION_ADD',
        onClick: (value) => {
          dispatch(
            showConfirmModal([`Xoá ${value?.category_name} ra khỏi danh sách khách hàng áp dụng ?`], () => {
              const product_category_apply_list = _.cloneDeep(methods.watch('product_category_apply_list'));
              methods.setValue(
                'product_category_apply_list',
                product_category_apply_list.filter(
                  (o) => parseInt(o?.product_category_id) !== parseInt(value?.product_category_id),
                ),
              );
              return;
            }),
          );
        },
      },
    ];
  }, []);

  return (
    <React.Fragment>
      <BWAccordion title={title}>
        <div className='bw_frm_box'>
          <div className='bw_col_12'>
            <div className='bw_col_12'>
              <label className='bw_checkbox bw_col_12'>
                <FormInput disabled={disabled} type='checkbox' field='is_apply_product_category' />
                <span />
                Áp dụng với tất cả ngành hàng
              </label>
            </div>
            {!Boolean(methods.watch('is_apply_product_category')) && (
              <DataTable
                hiddenActionRow
                noPaging
                noSelect
                loading={loading}
                data={methods.watch('product_category_apply_list')}
                columns={columns}
                actions={actions}
              />
            )}
            <FormInput hidden={true} disabled={disabled} type='text' field='check_product_category' />
          </div>
        </div>
      </BWAccordion>
      {modalOpen && (
        <PromotionProductCategoryModal
          open={modalOpen}
          columns={columns}
          onClose={() => {
            methods.unregister('keyword');
            setModalOpen(false);
          }}
        />
      )}
    </React.Fragment>
  );
};

PromotionProductCategory.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default PromotionProductCategory;
