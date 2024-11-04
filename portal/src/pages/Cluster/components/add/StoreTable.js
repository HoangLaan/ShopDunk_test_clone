import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { Select } from 'antd';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { getListStore } from 'services/cluster.service';

const SelectStyle = styled(Select)`
  display: flex;
  .ant-select-selector {
    font-size: 15px !important;
    width: 100%;
    padding: 0 !important;
  }
  .ant-select-arrow .anticon:not(.ant-select-suffix) {
    pointer-events: none;
  }
  .ant-select-selection-search {
    width: 100%;
    inset-inline-start: 0 !important;
    inset-inline-end: 0 !important;
  }
`;

const StoreTable = ({ disabled, title }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const { watch, register } = methods;
  useEffect(() => {
    register('store_list');
  }, [register]);

  const [dataStoreItems, setDataFunctionItems] = useState([]);
  const [disabledAddStore, setDisabledAddStore] = useState(false);

  const loadStore = useCallback(() => {
    getListStore({}).then((p) => {
      setDataFunctionItems(
        (p?.items || []).map((store) => ({
          ...store,
          value: +store.store_id,
          label: store.store_name,
        })),
      );
    });
  }, []);
  useEffect(loadStore, [loadStore]);

  const optionsItem = useMemo(() => {
    return dataStoreItems.filter((o) => !(watch('store_list') ?? []).find((p) => p.value === o.value));
  }, [dataStoreItems, watch('store_list')]);
  const handleAddStore = () => {
    const _cloneFuntionList = watch('store_list') ?? [];
    _cloneFuntionList.push({
      label: null,
      value: null,
    });
    setDisabledAddStore(true);
    methods.setValue('store_list', _cloneFuntionList);
  };
  return (
    <BWAccordion title={title}>
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
            <th className='bw_text_center'>Tên cửa hàng</th>
            <th className='bw_text_center'>Mã cửa hàng</th>
            <th className='bw_text_center'>Địa chỉ</th>
            {!disabled && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
          </thead>
          <tbody>
            {watch('store_list')?.map((p, key) => {
              return (
                <tr key={key}>
                  <td className='bw_sticky bw_text_center'>{key + 1}</td>
                  <td>
                    <SelectStyle
                      showSearch
                      bordered={false}
                      disabled={disabled}
                      value={watch('store_list')[key]}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      onChange={(_, value) => {
                        const _cloneFuntionList = watch('store_list');
                        _cloneFuntionList[key] = value;
                        methods.setValue('store_list', _cloneFuntionList);
                        setDisabledAddStore(false);
                      }}
                      options={optionsItem}
                    />
                  </td>
                  <td className='bw_text_center'>{p?.store_code}</td>
                  <td className='bw_text_center'>{p?.address}</td>
                  {!disabled && (
                    <td className='bw_sticky bw_action_table bw_text_center'>
                      <a
                        onClick={() => {
                          dispatch(
                            showConfirmModal(
                              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
                              async () => {
                                methods.setValue(
                                  'store_list',
                                  watch('store_list').filter((e) => !(e.value === p.value)),
                                );
                              },
                            ),
                          );
                        }}
                        className='bw_btn_table bw_delete bw_red'>
                        <i className='fi fi-rr-trash'></i>
                      </a>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!disabled && (
        <button
          disabled={disabledAddStore}
          onClick={handleAddStore}
          className='bw_btn_outline bw_btn_outline_success bw_add_us'>
          <span className='fi fi-rr-plus'></span> Thêm cửa hàng
        </button>
      )}
    </BWAccordion>
  );
};

export default StoreTable;
