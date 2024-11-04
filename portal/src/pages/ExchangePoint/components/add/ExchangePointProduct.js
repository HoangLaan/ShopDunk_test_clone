import React, { Fragment, useState } from 'react';
// components
import DataTable from 'components/shared/DataTable/index';
import { useFormContext } from 'react-hook-form';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import ICON_COMMON from 'utils/icons.common';
import _ from 'lodash';
import ProductModal from '../Modal/ProductModal';

export default function ExchangePointProduct({ disabled }) {
  const methods = useFormContext();
  const [openModalProduct, setOpenModalProduct] = useState(false);
  const dispatch = useDispatch();
  const columns = React.useMemo(
    () => [
      {
        header:'STT',
        formatter: (_,index) => index + 1
      },
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.product_code}</b>,
      },
      {
        header: 'Tên sản phẩm',
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
    ],
    [],
  );

  const actions = [
    {
      globalAction: true,
      icon: ICON_COMMON.add,
      color: 'orange',
      content: 'Thêm sản phẩm',
      hidden: disabled,
      onClick: () => setOpenModalProduct(true),
    },
    {
      icon: ICON_COMMON.trash,
      color: 'red',
      hidden: disabled,
      onClick: (item, index) =>
        dispatch(
          showConfirmModal([`Xoá ${item?.product_name} ra khỏi danh sách sản phẩm áp dụng ?`], () => {
            const list_product = _.cloneDeep(methods.watch('list_product'));
            methods.setValue(
              'list_product',
              list_product.filter((o) => parseInt(o?.product_id) !== parseInt(item?.product_id)),
            );
            return;
          }),
        ),
    },
  ];

  return (
    <Fragment>
      <div className='bw_frm_box'>
        <DataTable
          hiddenDeleteClick
          noSelect
          noPaging
          fieldCheck='product_id'
          columns={columns}
          data={methods.watch('list_product')}
          actions={actions}
        />
      </div>
      {openModalProduct && (
        <ProductModal
          open={openModalProduct}
          columns={columns}
          onClose={() => {
            methods.unregister('keyword');
            setOpenModalProduct(false);
          }}
        />
      )}
    </Fragment>
  );
}
