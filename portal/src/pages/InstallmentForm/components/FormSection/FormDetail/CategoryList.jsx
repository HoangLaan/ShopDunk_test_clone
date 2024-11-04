import React, { useState, useMemo } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import DataTable from 'components/shared/DataTable/index';
import ModalAddCategory from '../../Modal/ModalAddCategory/index';

const CategoryList = ({ disabled }) => {
  const dispatch = useDispatch();

  const methods = useFormContext();
  const [openModalAddCategory, setOpenModalAddCategory] = useState(false);
  const { control } = methods;

  const { remove } = useFieldArray({
    control,
    name: 'category_list',
  });

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Tên ngành hàng',
      disabled: disabled,
      accessor: 'category_name',
    },
    {
      header: 'Thuộc ngành hàng',
      disabled: disabled,
      accessor: 'parent_name',
    },
  ];

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm ngành hàng',
        permission: 'CRM_EMAILLIST_CUSTOMER_ADD',
        onClick: () => {
          setOpenModalAddCategory(true);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        disabled: disabled,
        permission: 'CRM_EMAILLIST_CUSTOMER_DEL',
        onClick: (_, index) => {
          if (!disabled) {
            dispatch(
              showConfirmModal(
                ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
                async () => {
                  remove(index);
                },
              ),
            );
          }
        },
      },
    ],
    [],
  );

  return (
    <div className='bw_row'>
      <div className='bw_col_12'>
        <DataTable noSelect noPaging actions={actions} columns={columns} data={methods.watch('category_list') || []} />
      </div>
      {openModalAddCategory && !disabled ? (
        <ModalAddCategory
          open={openModalAddCategory}
          onClose={() => setOpenModalAddCategory(false)}
          title={'Danh sách ngàng hàng'}
        />
      ) : null}
    </div>
  );
};

export default CategoryList;
