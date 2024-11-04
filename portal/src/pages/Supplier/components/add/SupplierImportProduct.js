import React, { useEffect, useState, useCallback } from 'react';
// service
import { getDetailImportSupplier } from 'services/supplier.service';
// components
import DataTable from 'components/shared/DataTable/index';

import BWAccordion from 'components/shared/BWAccordion/index';

export default function SupplierImportProduct({
  supplierId,
  title
}) {
  const [loading, setLoading] = useState(false);
  const [dataProduct, setDataProduct] = useState([]);

  const getProductList = useCallback(() => {
    if(supplierId) {
      setLoading(true)
      getDetailImportSupplier(supplierId).then((data) => {
        setDataProduct(data);
        setLoading(false)
      });
    }
  }, []);

  useEffect(getProductList, [getProductList]);

  const columns = React.useMemo(
    () => [
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.product_code}</b>,
      },
      {
        header: 'Sản phẩm',
        formatter: (p) => (
          <div className='bw_inf_pro'>
            <img
              alt=''
              src={/[/.](gif|jpg|jpeg|tiff|png)$/i.test(p?.product_picture_url) ? p.product_picture_url : 'bw_image/img_cate_1.png'}
            />
            {p?.product_name}
          </div>
        ),
      },
      {
        header: 'Số lượng nhập',
        formatter: (p) => p?.quantity,
      },
      {
        header: 'Giá nhập trung bình (đ)',
        formatter: (p) => p?.total_price_cost,
      },
      {
        header: 'Ngày nhập',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => p?.stocks_in_date,
      },
      {
        header: 'Đơn mua hàng',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => p?.stocks_in_code,
      },
    ],
    [],
  );

  return (
    <React.Fragment>
      <BWAccordion title={title}>
        <div className='bw_frm_box'>
          <div className='bw_col_12'>
              <DataTable
                hiddenDeleteClick
                noSelect
                noPaging={true}
                fieldCheck='product_id'
                loading={loading}
                columns={columns}
                data={dataProduct ?? []}
                onChangePage={null}
              />
            </div>
        </div>
      </BWAccordion>
    </React.Fragment>
  );
};
