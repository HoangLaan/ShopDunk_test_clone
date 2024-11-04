import React, { useState, useMemo, useEffect } from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import _ from 'lodash';
import { useFormContext } from 'react-hook-form';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import ICON_COMMON from 'utils/icons.common';
import PropTypes from 'prop-types';
import ProductCategoryModal from '../Modal/ProductCategoryModal';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

const ExchangePointProductCategory = ({ loading, disabled }) => {
  const { watch, unregister, setValue, register, getFieldState, formState, clearErrors } = useFormContext();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(undefined);
  const { error } = getFieldState('list_product_category', formState);
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Tên ngành hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'category_name',
      },
      {
        header: 'Công ty áp dụng',
        classNameHeader: 'bw_text_center',
        accessor: 'company_name',
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
        hidden: disabled,
        onClick: () => {
          setModalOpen(true);
        },
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        hidden: disabled,
        onClick: (value) => {
          dispatch(
            showConfirmModal([`Xoá ${value?.category_name} ra khỏi danh sách ngành hàng áp dụng ?`], () => {
              const list_product_category = _.cloneDeep(watch('list_product_category'));
              setValue(
                'list_product_category',
                list_product_category.filter(
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

  useEffect(() => {
    register('list_product_category', {
      required: watch('is_apply_all_category') ? false : 'Bắt buộc chọn ngành hàng',
    });
  }, [watch('is_apply_all_category')]);

  const handleChangeAll = (e) => {
    clearErrors('is_apply_all_category');
    setValue('is_apply_all_category', e.target.checked ? 1 : 0);
    setValue('list_product_category', []);
  };

  return (
    <React.Fragment>
      <div className='bw_frm_box bw_mt_2'>
        <div className='bw_col_12'>
          <div className='bw_col_12'>
            <label className='bw_checkbox '>
              <FormInput
                disabled={disabled}
                type='checkbox'
                field='is_apply_all_category'
                onChange={(e) => handleChangeAll(e)}
              />
              <span />
              Áp dụng với tất cả ngành hàng
            </label>
          </div>
          {!Boolean(watch('is_apply_all_category')) && (
            <DataTable
              hiddenActionRow
              noPaging
              noSelect
              loading={loading}
              data={watch('list_product_category')}
              columns={columns}
              actions={actions}
              title={error && <ErrorMessage message={error?.message} />}
            />
          )}
        </div>
      </div>
      {modalOpen && (
        <ProductCategoryModal
          open={modalOpen}
          columns={columns}
          onClose={() => {
            unregister('keyword');
            setModalOpen(false);
          }}
        />
      )}
    </React.Fragment>
  );
};

ExchangePointProductCategory.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ExchangePointProductCategory;
