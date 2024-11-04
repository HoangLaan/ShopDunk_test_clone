import React, { useState, useMemo, useEffect, useCallback } from 'react';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useFormContext, useFieldArray } from 'react-hook-form';
import DataTable from 'components/shared/DataTable/index';
import BWAccordion from 'components/shared/BWAccordion/index';
import ModalAddProduct from '../modal/ModalAddProduct';
import { useDispatch } from 'react-redux';
import { getListLockshiftProducts, checkProductInventory } from 'services/lockshift-close.service';
import { showToast } from 'utils/helpers';

import styled from 'styled-components';
import { showConfirmModal } from 'actions/global';

const TableWrapper = styled.div`
  .bw_mt_2 {
    margin-top: 0;
  }
  .bw_image {
    width: 140px;
  }
`;

const LockshiftProducts = ({ lockshiftId, disabled, title }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const [isOpenModelAddProduct, setIsOpenModelAddProduct] = useState(false);
  const { control } = methods;
  const { remove } = useFieldArray({
    control,
    name: 'product_list',
  });
  const init = useCallback(() => {
    getListLockshiftProducts(lockshiftId)
      .then((data) => {
        data.forEach(obj => {
          obj.actual_inventory = obj.total_inventory;
      });
        methods.setValue('product_list', data);
      })
      .catch((err) => {
        showToast(err?.message);
      });
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Ngành hàng',
      disabled: disabled,
      accessor: 'category_name',
    },
    {
      header: 'Sản phẩm',
      disabled: disabled,
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
      header: 'Đơn vị tính',
      disabled: disabled,
      accessor: 'unit_name',
    },
    {
      header: 'SL kiểm đếm',
      disabled: disabled,
      formatter: (_, index) => (
        <FormItem>
          <FormInput
            disabled={disabled}
            className='bw_input'
            type='number'
            field={`product_list.${index}.actual_inventory`}
          />
        </FormItem>
      ),
    },
    {
      header: 'Tồn phần mềm',
      disabled: disabled,
      accessor: 'total_inventory',
    },
    {
      header: 'Chênh lệch',
      disabled: disabled,
      formatter: (item, index) => {
        return item.actual_inventory - item.total_inventory;
      },
    },
    {
      header: 'Ghi chú',
      disabled: disabled,
      formatter: (_, index) => (
        <FormItem>
          <FormInput className='bw_input' disabled={disabled} type='text' field={`product_list.${index}.note`} />
        </FormItem>
      ),
    },
  ];

  // const actions = useMemo(
  //   () => [
  //     {
  //       globalAction: true,
  //       type: 'warning',
  //       content: 'Đối chiều tồn phần mềm',
  //       permission: 'MD_LOCKSHIFT_ADD',
  //       onClick: () => {
  //         let productList = methods.getValues('product_list');
  //         if (productList && productList.length > 0) {
  //           const products = productList.map((product) => ({
  //             product_id: Number(product.product_id),
  //             stock_id: Number(product.stocks_id),
  //           }));

  //           checkProductInventory(products)
  //             .then((data) => {
  //               productList = productList.map((product) => {
  //                 const targetProductInventory = data.find((product) => {
  //                   if (product.product_id == product.product_id && product.stock_id == product.stocks_id) {
  //                     return true;
  //                   }
  //                   return false;
  //                 });

  //                 if (targetProductInventory) {
  //                   product.total_inventory = Number(targetProductInventory.inventory);
  //                   return product;
  //                 } else {
  //                   return product;
  //                 }
  //               });

  //               methods.setValue('product_list', productList);
  //             })
  //             .catch((err) => {
  //               showToast(err?.message);
  //             });
  //         }
  //       },
  //     },
  //     {
  //       globalAction: true,
  //       icon: 'fi fi-rr-add',
  //       type: 'success',
  //       content: 'Thêm sản phẩm',
  //       permission: 'MD_LOCKSHIFT_ADD',
  //       onClick: () => {
  //         setIsOpenModelAddProduct(true);
  //       },
  //     },
  //   ],
  //   [],
  // );

  return (
    <BWAccordion title={title} id='bw_info_cus'>
      <div className='bw_col_12'>
        <TableWrapper>
          <DataTable noSelect noPaging  columns={columns} data={methods.watch('product_list')} />
        </TableWrapper>
      </div>
      {isOpenModelAddProduct && !disabled ? (
        <ModalAddProduct open={isOpenModelAddProduct} onClose={() => setIsOpenModelAddProduct(false)} />
      ) : null}
    </BWAccordion>
  );
};

export default LockshiftProducts;
