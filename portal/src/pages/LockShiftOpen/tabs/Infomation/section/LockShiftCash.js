import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useFormContext } from 'react-hook-form';
import DataTable from 'components/shared/DataTable/index';
import BWAccordion from 'components/shared/BWAccordion/index';
import styled from 'styled-components';
import {formatPrice} from 'utils/index';
import BWImage from "../../../../../components/shared/BWImage";
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import ConfirmCashModal from 'pages/LockShiftOpen/components/modals/ConfirmCashModal';
import { useLocation } from 'react-router-dom';

const TableWrapper = styled.div`
  .bw_mb_2 {
    margin-bottom: 0;
  }

  .bw_mt_2 {
    margin-top: 0;
  }

  .bw_inf_img {
    max-width: 140px;
  }

  .bw_btn_warning{
    margin-bottom: 15px;
  } 
`;

const LockShiftCash = ({ disabled, title }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const {watch, setValue} = methods;
  const { pathname } = useLocation();
  const isEdit = useMemo(() => pathname.includes('/edit') || pathname.includes('/detail'), [pathname]);
  const [isOpenConfirmCash, setIsOpenConfirmCash] = useState(false);
  const [isConfirm, setIsConfirm] = useState(isEdit ?? false);
  const onConfirm = ()=>{
    setIsConfirm(true);
    setIsOpenConfirmCash(false);
  }

  const setDefaultValue = useCallback(async () => {
    for(let i = 0 ; i < watch('list_shift_cash')?.length; i++){
     setValue(`list_shift_cash.${i}.actual_quantity`, 0)
    }
 }, [watch('list_shift_cash')]);

 useEffect(() => {
   setDefaultValue()
 }, [setDefaultValue,watch('list_shift_cash')]);

  const columns =useMemo (()=> [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Mệnh giá',
      disabled: disabled,
      formatter: (_, index) => {
        return formatPrice(_.denomination_value, true);
      },
    },
    {
      header: 'Hình ảnh',
      accessor: 'product_name',
      formatter: (p) => {
        return (
          <div>
            <BWImage src={p?.img_url} className='bw_inf_img' />
            {p?.product_name}
          </div>
        );
      },
    },

    {
      header: 'Số lượng kiểm đếm',
      style: { width: '20px' },
      disabled: disabled,
      formatter: (_, index) => (
        <FormItem>
          <FormInput disabled={disabled} type='number' field={`list_shift_cash.${index}.actual_quantity`} validation={{
                required: 'Cần nhập số lượng',
              }}/>
        </FormItem>
      ),
    },
    {
      header: 'Tổng tiền',
      classNameBody: 'bw_text_right',
      disabled: disabled,
      accessor: 'total_money',
      formatter: (_, index) => {
        return formatPrice(_.denomination_value * (_.actual_quantity || 0), true);
      },
    },
    {
      header: 'Số lượng bàn giao',
      disabled: disabled,
      classNameBody: 'bw_text_right',
      accessor: 'actual_quantity_parent',
      formatter: (_, index) => {
        return _.actual_quantity_parent || 0;
      },
    },
    {
      header: 'SL chênh lệch',
      disabled: disabled,
      accessor: '',
      formatter: (_, index) => {
        return (_.actual_quantity || 0) - (_.actual_quantity_parent || 0);
      },
    },
    {
      header: 'Ghi chú',
      disabled: disabled,
      formatter: (_, index) => (
        <FormItem>
          <FormInput className='bw_inp' disabled={disabled} field={`list_shift_cash.${index}.note`} />
        </FormItem>
      ),
    },
  ],[isConfirm] ) 

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-check',
        type: 'warning',
        content: 'Xác nhận',
        hidden : isConfirm || isEdit,
        onClick: () => {
          setIsOpenConfirmCash(true)
        }      
      },
    ]
  }, [isConfirm]);

  return (
    <BWAccordion title={title} id='bw_info_cus'>
      <div className='bw_col_12'>
        <TableWrapper>
          <DataTable noSelect noPaging actions={actions} columns={columns} data={watch('list_shift_cash')} />
        </TableWrapper>
        {isOpenConfirmCash && <ConfirmCashModal setIsOpenConfirmCash={setIsOpenConfirmCash} listCash={watch('list_shift_cash')} onConfirm={onConfirm}/>}
      </div>
    </BWAccordion>
  );
};

export default LockShiftCash;
