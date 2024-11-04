import FormItem from 'antd/es/form/FormItem';
import BWButton from 'components/shared/BWButton';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWImage from 'components/shared/BWImage';
import DataTable from 'components/shared/DataTable';
import LockShiftOpenContext from 'pages/LockShiftOpen/context/LockShiftOpenContext';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import ICON_COMMON from 'utils/icons.common';



export default function ConfirmEquipmentModal({setIsOpenConfirmEquipment, listEquipment, onConfirm }) {
  const context = useContext(LockShiftOpenContext);
  const [isDifferenceQuantity,setIsDifferenceQuantity] = useState(false)
  const methods = useFormContext();
  const {watch} = methods;
  useEffect(()=>{
    listEquipment?.forEach(item => {
        const actualInventory = parseInt(item.actual_inventory ?? 0);
        const parentInventory = item.parent_inventory !== null ? parseInt(item.parent_inventory) : 0;
      
        if (actualInventory != parentInventory) {
            setIsDifferenceQuantity(true)
        }
      });
  },[listEquipment])

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
      accessor: 'unit_name',
    },
    {
      header: 'Kho hàng',
      accessor: 'stocks_name',
    },
    {
      header: 'Số lượng kiểm đếm',
      formatter: (_, index) => (
        <FormItem>
          <FormInput
            className='bw_inp'
            disabled={true}
            type='number'
            field={`list_shift_equipment.${index}.actual_inventory`}
          />
        </FormItem>
      ),
    },
    {
      header: 'Tồn phần mềm',
      accessor: 'inventory_parent',
      formatter: (_, index) => {
        return _.parent_inventory || 0;
      },
    },
    {
      header: 'SL chênh lệch',
      accessor: '',
      formatter: (_, index) => {
        return (watch(`list_shift_equipment.${index}.actual_inventory`) || 0) - (_.parent_inventory || 0);
      },
    },
  ];


  return (
    <div className='bw_modal bw_modal_open'>
      <div className='bw_modal_container bw_w700'>
        <div className='bw_title_modal'>
            <h3>Xác nhận số lượng bàn giao</h3>
            <span className='fi fi-rr-cross-small bw_close_modal' onClick={()=>setIsOpenConfirmEquipment(false)}></span>
        </div>
        <div className='bw_main_modal'>
            <div className='bw_frm_box bw_readonly'>
            {isDifferenceQuantity && <div className='bw_note'>
                Có sự chênh lệch giữa số lượng bàn giao và số lượng kiểm đếm
                </div>}
             {!isDifferenceQuantity && 
             <DataTable noSelect noPaging actions={[]} columns={columns} data={listEquipment}/>}   
            </div>
          </div>
          <div className='bw_footer_modal'>
            <BWButton type='success' icon={ICON_COMMON.save} content={'Đồng ý'} onClick={()=>onConfirm()} />
            <BWButton type='danger' icon={ICON_COMMON.reject} content={'Cập nhật lại'} onClick={()=>setIsOpenConfirmEquipment(false)} />
        </div>
      </div>
    </div>
  );
}