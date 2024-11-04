import React, { useCallback, useEffect } from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useFormContext } from 'react-hook-form';
import DataTable from 'components/shared/DataTable/index';
import BWAccordion from 'components/shared/BWAccordion/index';
import styled from 'styled-components';
import BWImage from "../../../../../components/shared/BWImage";
import { useMemo,useState } from 'react';
import { useLocation } from 'react-router-dom';
import ConfirmProductModal from 'pages/LockShiftOpen/components/modals/ConfirmProductModal';
import BWButton from 'components/shared/BWButton';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deleteProductInShift } from 'services/lockshift-open.service';

const TableWrapper = styled.div`
  .bw_mb_2 {
    margin-bottom: 0;
  }

  .bw_mt_2 {
    margin-top: 0;
  }

  .bw_btn_warning{
    margin-bottom: 15px;
  } 
`;

const LockShiftProduct = ({ disabled, title, onRefresh }) => {
  const methods = useFormContext();
  const {watch,setValue} = methods;
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isEdit = useMemo(() => pathname.includes('/edit') || pathname.includes('/detail'), [pathname]);
  const [isOpenConfirmProduct, setIsOpenConfirmProduct] = useState(false);
  const [isConfirm, setIsConfirm] = useState( false);

  const setDefaultValue = useCallback(async () => {
     for(let i = 0 ; i < watch('list_shift_product')?.length; i++){
      setValue(`list_shift_product.${i}.actual_inventory`,watch(`list_shift_product.${i}.parent_inventory`) ?? 0)
     }
  }, [watch('list_shift_product')]);

  useEffect(() => {
    setDefaultValue()
  }, [setDefaultValue,watch('list_shift_product')]);
  const onConfirm = ()=>{
    setIsConfirm(true);
    setIsOpenConfirmProduct(false);
  }
  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Sản phẩm',
      accessor: 'product_name',
      classNameHeader: 'bw_sticky bw_name_sticky',
      classNameBody: 'bw_sticky bw_name_sticky',
      formatter: (p) => {
        return (
          <div className='bw_inf_pro'>
            <BWImage src={p?.product_img} />
            {p?.product_name}
          </div>
        );
      },
    },
    ,
    {
      header: 'ĐVT',
      disabled: disabled,
      accessor: 'unit_name',
    },
    {
      header: 'Số lượng kiểm đếm',
      disabled: disabled,
      formatter: (_, index) => (
        <FormItem>
          <FormInput
            className='bw_inp'
            disabled={disabled || isEdit || isConfirm}
            type='number'
            field={`list_shift_product.${index}.actual_inventory`}
          />
        </FormItem>
      ),
    },
    {
      header: 'Số lượng bàn giao',
      disabled: disabled,
      formatter: (_, index) => {
        return _.parent_inventory || 0;
      },
    },
    {
      header: 'SL chênh lệch',
      disabled: disabled,
      accessor: '',
      formatter: (_, index) => {
        return (watch(`list_shift_product.${index}.actual_inventory`) || 0) - (_.parent_inventory || 0);
      },
    },
    {
      header: 'Ghi chú',
      disabled: disabled,
      formatter: (_, index) => (
        <FormItem>
          <FormInput
            className='bw_inp'
            disabled={disabled}
            field={`list_shift_product.${index}.note`}
          />
        </FormItem>
      ),
    },
  ];
  
  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-check',
        type: 'warning',
        content: 'Xác nhận',
        hidden : isConfirm || isEdit,
        onClick: () => {
          setIsOpenConfirmProduct(true)
        }      
      },
    ]
  }, [isConfirm]);

  return (
    <BWAccordion title={title} id='bw_info_cus'>
      <div className='bw_col_12'>
        <TableWrapper>
          <DataTable noSelect noPaging actions={actions} columns={columns} data={watch('list_shift_product')}/>
        </TableWrapper>
      </div>
      {isOpenConfirmProduct && <ConfirmProductModal setIsOpenConfirmProduct={setIsOpenConfirmProduct} listProduct={watch('list_shift_product')} onConfirm={onConfirm}/>}
    </BWAccordion>
  );
};

export default LockShiftProduct;
