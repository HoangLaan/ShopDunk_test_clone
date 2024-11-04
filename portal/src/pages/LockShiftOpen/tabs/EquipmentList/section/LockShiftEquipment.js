import React from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import {useFormContext} from 'react-hook-form';
import DataTable from 'components/shared/DataTable/index';
import BWAccordion from 'components/shared/BWAccordion/index';
import styled from 'styled-components';
import BWImage from "../../../../../components/shared/BWImage";
import { useLocation } from 'react-router-dom';
import ConfirmEquipmentModal from 'pages/LockShiftOpen/components/modals/ConfirmEquipmentModal';
import { useMemo,useState } from 'react';
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

const LockShiftEquipment = ({disabled, title}) => {
  const methods = useFormContext();
  const {watch} = methods;

  const { pathname } = useLocation();
  const isEdit = useMemo(() => pathname.includes('/edit') || pathname.includes('/detail'), [pathname]);
  const [isOpenConfirmEquipment, setIsOpenConfirmEquipment] = useState(false);
  const [isConfirm, setIsConfirm] = useState( false);
  const onConfirm = ()=>{
    setIsConfirm(true);
    setIsOpenConfirmEquipment(false);
  }

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Mã thiết bị',
      accessor: 'equipment_id',
      classNameBody: 'bw_text_center',
    },
    {
      header: 'Sản phẩm',
      accessor: 'product_name',
      classNameHeader: 'bw_sticky bw_name_sticky',
      classNameBody: 'bw_sticky bw_name_sticky',
      formatter: (p) => {
        return (
          <div className='bw_inf_pro'>
            <BWImage src={p?.equipment_img}/>
            {p?.equipment_name}
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
      header: 'Kho hàng',
      disabled: disabled,
      accessor: 'stocks_name',
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
            field={`list_shift_equipment.${index}.actual_inventory`}
          />
        </FormItem>
      ),
    },
    {
      header: 'Tồn phần mềm',
      disabled: disabled,
      accessor: 'inventory_parent',
      formatter: (_, index) => {
        return _.parent_inventory || 0;
      },
    },
    {
      header: 'SL chênh lệch',
      disabled: disabled,
      accessor: '',
      formatter: (_, index) => {
        return (watch(`list_shift_equipment.${index}.actual_inventory`) || 0) - (_.parent_inventory || 0);
      },
    },
    {
      header: 'Ghi chú',
      disabled: disabled,
      formatter: (_, index) => (
        <FormItem>
          <FormInput
            className='bw_inp'
            disabled={disabled || isEdit || isConfirm}
            field={`list_shift_equipment.${index}.note`}
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
          setIsOpenConfirmEquipment(true)
        }      
      },
    ]
  }, [isConfirm]);

  return (
    <BWAccordion title={title} id='bw_info_cus'>
      <div className='bw_col_12'>
        <TableWrapper>
          <DataTable noSelect noPaging actions={actions} columns={columns} data={watch('list_shift_equipment')}/>
        </TableWrapper>
      </div>
      {isOpenConfirmEquipment && <ConfirmEquipmentModal setIsOpenConfirmEquipment={setIsOpenConfirmEquipment} listEquipment={watch('list_shift_equipment')} onConfirm={onConfirm}/>}
    </BWAccordion>
  );
};

export default LockShiftEquipment;
