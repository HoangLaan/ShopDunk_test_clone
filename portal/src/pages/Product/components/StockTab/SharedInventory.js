import React, { useEffect, useState } from 'react';
import { notification, Alert } from 'antd';
import { useFormContext, useFieldArray } from 'react-hook-form';
import styled from 'styled-components';

import { getOptionsStockType, getOptionsUnit } from 'services/product.service';
import { validateSharedInventory } from 'pages/Product/helpers/index';
import { mapDataOptions4Select } from 'utils/helpers';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import BWModal from 'components/shared/BWModal/index';

const ModalContent = styled.p`
  margin-bottom: 0;
`;

export default function SharedInventory({ isEdit = true }) {
  const methods = useFormContext();
  const {
    watch,
    formState: { errors },
    control,
  } = methods;
  const [optionsStockType, setOptionsStockType] = useState(null);
  const [optionsUnit, setOptionsUnit] = useState(null);
  const [isOpenModal, setOpenModal] = useState(false);
  const fetchOptionsStockType = (search) => getOptionsStockType({ search, limit: 100 });
  const fetchOptionsUnit = (search) => getOptionsUnit({ search, limit: 100 });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'shared_inventory',
    rules: {
      required: false,
      validate: (field) => {
        if (field?.length >= 0) {
          return validateSharedInventory(field);
        }
      },
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get options stocktype
      const stockTypes = await fetchOptionsStockType();
      setOptionsStockType(mapDataOptions4Select(stockTypes));
      // Get options unit
      const units = await fetchOptionsUnit();
      setOptionsUnit(mapDataOptions4Select(units));
    } catch (error) {
      notification.error({ message: error.message || 'Lỗi tải dữ liệu.' });
    }
  };

  const handleAddRow = () => {
    let inventories = methods.getValues('shared_inventory') ?? [];
    if (
      inventories.length &&
      inventories.filter(
        (x) => !x.stock_type && !x.min_inventory_value && !x.max_inventory_value && !x.stocks_duration && !x.unit,
      ).length
    ) {
      setOpenModal(true);
      return;
    }
    append({
      stock_type: null,
      min_inventory_value: '',
      max_inventory_value: '',
      stock_duration: '',
      unit: null,
    });
  };

  return (
    <>
      <h3 className='bw_mb_1'>Hạn mức tồn kho dùng chung</h3>
      {errors['shared_inventory'] && (
        <Alert closable className='bw_mb_2' type='error' message={errors['shared_inventory']?.root?.message} />
      )}
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <tr>
              <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
              <th>Loại kho</th>
              <th className='bw_text_center'>Định mức tồn (min - max)</th>
              <th className='bw_text_center'>Thơi gian lưu kho</th>
              <th className='bw_text_center'>ĐVT</th>
              {isEdit && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {watch('shared_inventory') ? (
              fields.map((inventory, i) => (
                <tr key={i}>
                  <td className='bw_text_center'>{i + 1}</td>
                  <td>
                    <FormDebouneSelect
                      field={`shared_inventory.${i}.stock_type`}
                      fetchOptions={fetchOptionsStockType}
                      allowClear={true}
                      placeholder='--Chọn--'
                      list={optionsStockType}
                      style={{ minWidth: 200, border: '1px solid #aaa', paddingLeft: 5 }}
                      disabled={!isEdit}
                    />
                  </td>
                  <td className='bw_text_center'>
                    <input
                      disabled={!isEdit}
                      type='number'
                      className='bw_inp bw_mw_1'
                      placeholder='Tồn dưới'
                      {...methods.register(`shared_inventory.${i}.min_inventory_value`)}
                    />
                    -
                    <input
                      disabled={!isEdit}
                      type='number'
                      className='bw_inp bw_mw_1'
                      placeholder='Tồn trên'
                      {...methods.register(`shared_inventory.${i}.max_inventory_value`)}
                    />
                  </td>
                  <td className='bw_text_center'>
                    <input
                      disabled={!isEdit}
                      type='number'
                      className='bw_inp bw_mw_1'
                      placeholder='Thời gian lưu kho'
                      {...methods.register(`shared_inventory.${i}.stock_duration`)}
                    />{' '}
                    (Ngày)
                  </td>
                  <td className='bw_text_center' data-bw_select_id='bw_select_data-28-4lbn'>
                    <FormDebouneSelect
                      field={`shared_inventory.${i}.unit`}
                      fetchOptions={fetchOptionsUnit}
                      allowClear={true}
                      placeholder='--Chọn--'
                      list={optionsUnit}
                      style={{ minWidth: 80, border: '1px solid #aaa', paddingLeft: 5 }}
                      disabled={!isEdit}
                    />
                  </td>
                  {isEdit && (
                    <td className='bw_sticky bw_action_table bw_text_center'>
                      <a href='javascript:void(0)' onClick={() => remove(i)} className='bw_btn_table bw_delete bw_red'>
                        <i className='fi fi-rr-trash'></i>
                      </a>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isEdit ? 6 : 5} className='bw_text_center'>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isEdit && (
        <a data-href='' onClick={handleAddRow} className='bw_btn_outline bw_btn_outline_success bw_add_us'>
          <span className='fi fi-rr-plus'></span> Thêm dòng
        </a>
      )}
      {isOpenModal && (
        <BWModal
          onClose={() => setOpenModal(false)}
          open={isOpenModal}
          header={
            <>
              <span className='bw_icon_notice'>
                <i className='fi fi-rr-bell'></i>
              </span>{' '}
              Thông báo
            </>
          }>
          <ModalContent>Vui lòng nhập đầy đủ thông tin `Hạn mức tồn kho dùng chung`! </ModalContent>
        </BWModal>
      )}
    </>
  );
}
