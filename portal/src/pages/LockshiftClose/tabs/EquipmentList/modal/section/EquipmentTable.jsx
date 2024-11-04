import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';

const ProductTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, loading, closeModal }) => {
  const methods = useFormContext();

  const columns = useMemo(
    () => [
      {
        header: 'Mã hàng hóa - vật tư',
        accessor: 'product_code',
      },
      {
        header: 'Tên hàng hóa - vật tư',
        formatter: (p) => (
          <div className='bw_inf_pro'>
            <img
              alt=''
              src={/[/.](gif|jpg|jpeg|tiff|png)$/i.test(p?.picture_url) ? p.picture_url : 'bw_image/img_cate_1.png'}
            />
            {p?.product_name}
          </div>
        ),
      },
      {
        header: 'Ngành hàng',
        accessor: 'category_name',
      },
      {
        header: 'Hãng',
        accessor: 'manufacture_name',
      },
      {
        header: 'kho',
        accessor: 'stocks_name',
      },
    ],
    [],
  );

  const handleBulkAction = (dataSelect = []) => {
    const selectedProducts = dataSelect.map((product) => ({
      stocks_id: product.stocks_id,
      product_id: product.product_id,
      lockshift_id: null,
      actual_inventory: null,
      unit_name: product.unit_name,
      product_name: product.product_name,
      stocks_name: product.stocks_name,
      category_name: product.category_name,
      total_inventory: product.total_inventory,
    }));

    const previousProducts = methods.getValues('equipment_list') || [];

    const mergedProducts = previousProducts.concat(selectedProducts).filter((item, index, self) => {
      return index === self.findIndex((t) => t.product_id === item.product_id && t.stocks_id === item.stocks_id);
    });

    methods.setValue('equipment_list', mergedProducts);

    closeModal();
  };

  return (
    <DataTable
      hiddenDeleteClick
      showBulkButton
      columns={columns}
      data={data}
      actions={[]}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      loading={loading}
      handleBulkAction={handleBulkAction}
    />
  );
};

export default ProductTable;
