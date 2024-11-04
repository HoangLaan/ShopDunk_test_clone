import React, { useEffect, useState } from 'react';
import { notification, Alert } from 'antd';
import { useFormContext, useFieldArray } from 'react-hook-form';
import styled from 'styled-components';

import { getOptionsUnit, getOptionsStore, getOptionsStock } from 'services/product.service';
import { mapDataOptions4Select } from 'utils/helpers';
import { validateStockInventory } from 'pages/Product/helpers/index';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import BWModal from 'components/shared/BWModal/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const ModalContent = styled.p`
  margin-bottom: 0;
`;

export default function StockInventory({ isEdit = true }) {
  const methods = useFormContext();
  const {
    watch,
    formState: { errors },
    control,
  } = methods;
  const [optionsUnit, setOptionsUnit] = useState(null);
  const [optionsStore, setOptionStore] = useState(null);
  const [isOpenModal, setOpenModal] = useState(false);
  const fetchOptionsUnit = (search) => getOptionsUnit({ search, limit: 100 });
  const fetchOptionsStore = (search) => getOptionsStore({ search, limit: 100 });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'stock_inventory',
    rules: {
      required: false,
      validate: (field) => {
        if (field?.length >= 0) {
          return validateStockInventory(field);
        }
      },
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get options store
      const stores = await fetchOptionsStore();
      setOptionStore(mapDataOptions4Select(stores));
      // Get options unit
      const units = await fetchOptionsUnit();
      setOptionsUnit(mapDataOptions4Select(units));
    } catch (error) {
      notification.error({ message: error.message || 'Lỗi tải dữ liệu.' });
    }
  };

  const handleChangeStore = async (store, idx) => {
    try {
      methods.clearErrors(`stock_inventory.${idx}.store`);
      methods.setValue(`stock_inventory.${idx}.store`, store);
      const stocks = await getOptionsStock({ store_id: store.value });
      methods.setValue(`stock_inventory.${idx}.options_stock`, mapDataOptions4Select(stocks));
    } catch (error) {
      notification.error({ message: error.message || 'Lỗi tải dữ liệu.' });
    }
  };

  const handleAddRow = () => {
    let inventories = methods.getValues('stock_inventory') ?? [];
    if (
      inventories.length &&
      inventories.filter(
        (x) =>
          !x.store && !x.stock && !x.min_inventory_value && !x.max_inventory_value && !x.stocks_duration && !x.unit,
      ).length
    ) {
      setOpenModal(true);
      return;
    }
    append({
      store: null,
      stock: null,
      min_inventory_value: '',
      max_inventory_value: '',
      stock_duration: '',
      unit: null,
    });
  };

  return (
    <>
      <h3 className='bw_mb_1 bw_mt_4'>Hạn mức tồn theo kho</h3>
      {errors['stock_inventory'] && (
        <Alert closable className='bw_mb_2' type='error' message={errors['stock_inventory']?.root?.message} />
      )}
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <tr>
              <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
              <th>Cửa hàng</th>
              <th>Mã kho</th>
              <th>Tên kho</th>
              <th>Định mức tồn (min - max)</th>
              <th>Thơi gian lưu kho</th>
              <th>ĐVT</th>
              {isEdit && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {watch('stock_inventory') ? (
              fields.map((inventory, i) => (
                <tr>
                  <td className='bw_text_center'>1</td>
                  <td>
                    <FormDebouneSelect
                      field={`stock_inventory.${i}.store`}
                      fetchOptions={fetchOptionsStore}
                      allowClear={true}
                      placeholder='--Chọn--'
                      list={optionsStore}
                      style={{ minWidth: 200, border: '1px solid #aaa', paddingLeft: 5 }}
                      onChange={(store) => handleChangeStore(store, i)}
                      disabled={!isEdit}
                    />
                  </td>
                  <td>
                    <FormSelect
                      field={`stock_inventory.${i}.stock`}
                      allowClear={true}
                      placeholder='--Chọn--'
                      list={(methods.getValues(`stock_inventory.${i}.options_stock`) || []).map((x) => ({
                        ...x,
                        label: x.code,
                      }))}
                      style={{ minWidth: 200, border: '1px solid #aaa', paddingLeft: 5 }}
                      disabled={!isEdit}
                    />
                  </td>
                  <td>
                    <FormSelect
                      field={`stock_inventory.${i}.stock`}
                      allowClear={true}
                      placeholder='--Chọn--'
                      list={
                        methods.watch(`stock_inventory.${i}.options_stock`) ?? [].map((x) => ({ ...x, label: x.name }))
                      }
                      style={{ minWidth: 200, border: '1px solid #aaa', paddingLeft: 5 }}
                      disabled={!isEdit}
                    />
                  </td>
                  <td>
                    <input
                      disabled={!isEdit}
                      type='number'
                      className='bw_inp bw_mw_1'
                      placeholder='Tồn dưới'
                      {...methods.register(`stock_inventory.${i}.min_inventory_value`)}
                    />
                    -
                    <input
                      disabled={!isEdit}
                      type='number'
                      className='bw_inp bw_mw_1'
                      placeholder='Tồn trên'
                      {...methods.register(`stock_inventory.${i}.max_inventory_value`)}
                    />
                  </td>
                  <td>
                    <input
                      disabled={!isEdit}
                      type='number'
                      className='bw_inp bw_mw_1'
                      placeholder='Thời gian lưu kho'
                      {...methods.register(`stock_inventory.${i}.stock_duration`)}
                    />{' '}
                    (Ngày)
                  </td>
                  <td>
                    <FormDebouneSelect
                      field={`stock_inventory.${i}.unit`}
                      fetchOptions={fetchOptionsUnit}
                      allowClear={true}
                      placeholder='--Chọn--'
                      list={optionsUnit}
                      style={{ minWidth: 120, border: '1px solid #aaa', paddingLeft: 5 }}
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
                <td colSpan={isEdit ? 8 : 7} className='bw_text_center'>
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
          <ModalContent>Vui lòng nhập đầy đủ thông tin `Hạn mức tồn theo kho`! </ModalContent>
        </BWModal>
      )}
    </>
  );
}
