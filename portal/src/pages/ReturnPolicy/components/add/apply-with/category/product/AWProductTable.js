import DataTable from 'components/shared/DataTable/index';
import React, { useEffect, useMemo, useState } from 'react';
import AWProductModal from './AWProductModal';
import { useFormContext } from 'react-hook-form';

const AWProductTable = ({ listCategory, isSubmit, listProductEdit, disabled }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [data, setData] = useState([]);
  const { setValue } = useFormContext();

  useEffect(() => {
    setValue(
      'product_ids',
      data.map((item) => +item.product_id),
    );
  }, [data]);

  useEffect(() => {
    setData(listProductEdit);
  }, [listProductEdit]);

  useEffect(() => {
    if (isSubmit) {
      setData([]);
      setValue('product_ids', []);
    }
  }, [isSubmit]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Tên sản phẩm',
        accessor: 'product_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Ngành hàng',
        accessor: 'category_name',
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
        content: 'Thêm sản phẩm',
        onClick: () => setIsOpenModal(true),
      },
      {
        hidden: disabled,
        icon: 'fi fi-rr-trash',
        color: 'red',
        onClick: (d) => {
          setData((prev) => prev.filter((item) => item.product_id !== d.product_id));
        },
      },
    ];
  }, [disabled]);

  return (
    <>
      <DataTable noSelect={true} noPaging={true} columns={columns} data={data} actions={actions} />

      {isOpenModal && (
        <AWProductModal
          listCategory={listCategory}
          open={isOpenModal}
          onClose={() => {
            setIsOpenModal(false);
          }}
          onApply={(d) => setData(d)}
          defaultDataSelect={[]}
        />
      )}
    </>
  );
};

export default AWProductTable;
