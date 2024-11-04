import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useState, useEffect } from 'react';
import AWProductTable from './product/AWProductTable';
import AWCategoryModal from './AWCategoryModal';
import { useFormContext } from 'react-hook-form';

const AWCategoryTable = ({ isSubmit, disabled, listCategoryEdit, listProductEdit }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [data, setData] = useState([]);
  const { setValue, watch } = useFormContext();

  useEffect(() => {
    setData(listCategoryEdit);
  }, [listCategoryEdit]);

  useEffect(() => {
    if (isSubmit) {
      setData([]);
      setValue('category_ids', []);
    }
  }, [isSubmit]);

  useEffect(() => {
    setValue(
      'category_ids',
      data.map((item) => item.product_category_id ?? item.category_id),
    );
  }, [data]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Ngành hàng',
        accessor: 'category_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Thuộc ngành hàng',
        accessor: 'parent_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
    ],
    [disabled],
  );

  const actions = useMemo(() => {
    return [
      {
        hidden: disabled,
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm ngành hàng',
        onClick: () => setIsOpenModal(true),
      },
      {
        hidden: disabled,
        icon: 'fi fi-rr-trash',
        color: 'red',
        onClick: (d) => {
          setData((prev) =>
            prev.filter(
              (item) => (item.product_category_id ?? item.category_id) !== (d.product_category_id ?? d.category_id),
            ),
          );
        },
      },
    ];
  }, [data, disabled]);

  return (
    <>
      <DataTable noSelect={true} noPaging={true} columns={columns} data={data} actions={actions} />

      {isOpenModal && (
        <AWCategoryModal
          open={isOpenModal}
          onClose={() => {
            setIsOpenModal(false);
          }}
          onApply={(d) => setData(d)}
          defaultDataSelect={[]}
        />
      )}

      {data.length > 0 && (
        <AWProductTable isSubmit={isSubmit} listCategory={data} listProductEdit={listProductEdit} disabled={disabled} />
      )}
    </>
  );
};

export default AWCategoryTable;
