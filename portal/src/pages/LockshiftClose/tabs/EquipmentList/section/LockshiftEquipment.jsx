import React, { useState, useMemo, useEffect } from 'react';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useFormContext, useFieldArray } from 'react-hook-form';
import DataTable from 'components/shared/DataTable/index';
import BWAccordion from 'components/shared/BWAccordion/index';
import ModalAddProduct from '../modal/ModalAddEquipment';

import { useDispatch } from 'react-redux';
import { checkProductInventory } from 'services/lockshift-close.service';

import styled from 'styled-components';
import { showToast } from 'utils/helpers';

const TableWrapper = styled.div`
  .bw_mt_2 {
    margin-top: 0;
  }
  .bw_image {
    width: 140px;
  }
`;

const LockshiftEquipments = ({ disabled, title }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const [isOpenChooseModel, setIsOpenChooseModel] = useState(false);
  const { control } = methods;
  const { remove } = useFieldArray({
    control,
    name: 'equipment_list',
  });

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Mã thiết bị',
      disabled: disabled,
      accessor: 'product_id',
    },
    {
      header: 'Tên thiết bị',
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
      header: 'Kho hàng',
      disabled: disabled,
      accessor: 'stocks_name',
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
            field={`equipment_list.${index}.actual_inventory`}
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
          <FormInput className='bw_input' disabled={disabled} type='text' field={`equipment_list.${index}.note`} />
        </FormItem>
      ),
    },
  ];

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        type: 'warning',
        content: 'Đối chiếu tồn phần mềm',
        permission: 'MD_LOCKSHIFT_ADD',
        onClick: () => {
          let equipmentList = methods.getValues('equipment_list');
          if (equipmentList && equipmentList.length > 0) {
            const products = equipmentList.map((equipment) => ({
              product_id: Number(equipment.product_id),
              stock_id: Number(equipment.stocks_id),
            }));

            checkProductInventory(products)
              .then((data) => {
                equipmentList = equipmentList.map((equipment) => {
                  const targetProductInventory = data.find((product) => {
                    if (product.product_id == equipment.product_id && product.stock_id == equipment.stocks_id) {
                      return true;
                    }
                    return false;
                  });

                  if (targetProductInventory) {
                    equipment.total_inventory = Number(targetProductInventory.inventory);
                    return equipment;
                  } else {
                    return equipment;
                  }
                });

                methods.setValue('equipment_list', equipmentList);
              })
              .catch((err) => {
                showToast(err?.message);
              });
          }
        },
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Chọn thiết bị',
        permission: 'MD_LOCKSHIFT_ADD',
        onClick: () => {
          setIsOpenChooseModel(true);
        },
      },
    ],
    [],
  );

  return (
    <BWAccordion title={title} id='bw_info_cus'>
      <div className='bw_col_12'>
        <FormItem disabled={disabled} label='Barcode' className='bw_col_1' isRequired>
          <FormInput type='number' field='bar_code' />
        </FormItem>
        <TableWrapper>
          <DataTable noSelect noPaging actions={actions} columns={columns} data={methods.watch('equipment_list')} />
        </TableWrapper>
      </div>
      {isOpenChooseModel && !disabled ? (
        <ModalAddProduct open={isOpenChooseModel} onClose={() => setIsOpenChooseModel(false)} />
      ) : null}
    </BWAccordion>
  );
};

export default LockshiftEquipments;
