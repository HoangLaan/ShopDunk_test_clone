import React, { useMemo, useEffect } from 'react';

import DataTable from 'components/shared/DataTable/index';
import { useFormContext } from 'react-hook-form';
import usePagination from 'hooks/usePagination';
import { getOptionSelected, mapDataOptions } from 'utils/helpers';
import useDeepMemo from 'hooks/useDeepMemo';

const ProductDivisionTable = () => {
  const methods = useFormContext();
  const store_apply_list = methods.watch('store_apply_list') || [];
  const product_list = methods.watch('product_list');
  const productOptions = useMemo(
    () => mapDataOptions(product_list, { labelName: 'product_name', valueName: 'product_id', valueAsString: true }),
    [product_list],
  );

  const product_division = useDeepMemo(() => {
    const list = [];
    store_apply_list
      .filter((x) => !!x.product_id)
      .forEach((item) => {
        const product = getOptionSelected(productOptions, item.product_id);
        const index = list.findIndex((i) => +i.product_id === +item.product_id);
        if (index === -1) {
          list.push({ ...product, division_quantity: +item.division_quantity || 0 });
        } else {
          list[index].division_quantity += +item.division_quantity || 0;
        }
      });
    return list;
  }, [store_apply_list, productOptions]);

  useEffect(() => methods.setValue('product_division', product_division), [product_division])

  const pagination = usePagination({ data: product_division });

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => p?.dataIndex + 1,
      },
      {
        header: 'Sản phẩm',
        accessor: 'product_name',
      },
      {
        header: 'ĐVT',
        accessor: 'unit_name',
      },
      {
        header: 'Số lượng đã mua',
        accessor: 'quantity',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Số lượng đã chia',
        formatter: (p) => p?.division_quantity,
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Số lượng còn lại',
        formatter: (p) => +p?.quantity - p?.division_quantity,
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
    ],
    [],
  );

  return (
    <DataTable
      loading={pagination.loading}
      columns={columns}
      data={pagination.items}
      totalPages={pagination.totalPages}
      itemsPerPage={pagination.itemsPerPage}
      page={pagination.page}
      totalItems={pagination.totalItems}
      onChangePage={pagination.onChangePage}
      noSelect={true}
    />
  );
};

export default ProductDivisionTable;
