import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getList } from 'services/function.service';
import { Select } from 'antd';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import BWAccordion from 'components/shared/BWAccordion';
import styled from 'styled-components';

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

const PermissionTable = ({ disabled }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const { watch, register } = methods;
  useEffect(() => {
    register('functions_list');
  }, [register]);

  const [dataFunctionItems, setDataFunctionItems] = useState([]);

  const loadFunction = useCallback(() => {
    getList({
      itemsPerPage: 2147483647,
    }).then((p) => {
      setDataFunctionItems(
        p?.items.map((_) => {
          return {
            label: _.function_name,
            function_alias: _.function_alias,
            value: _.function_id,
          };
        }),
      );
    });
  }, []);
  useEffect(loadFunction, [loadFunction]);

  const optionsItem = useMemo(() => {
    return dataFunctionItems.filter((o) => !(watch('functions_list') ?? []).find((p) => p.value === o.value));
  }, [dataFunctionItems, watch('functions_list')]);

  return (
    <BWAccordion title='Quyền'>
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
            <th className='bw_text_center'>Tên quyền</th>
            <th className='bw_text_center'>Code</th>
            {!disabled && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
          </thead>
          <tbody>
            {watch('functions_list')?.map((p, key) => {
              return (
                <tr>
                  <td className='bw_sticky bw_text_center'>{key + 1}</td>
                  <td>
                    <SelectStyle
                      showSearch
                      bordered={false}
                      disabled={disabled}
                      value={watch('functions_list')[key]}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      onChange={(_, value) => {
                        const _cloneFuntionList = watch('functions_list');
                        _cloneFuntionList[key] = value;
                        methods.setValue('functions_list', _cloneFuntionList);
                      }}
                      options={optionsItem}
                    />
                  </td>
                  <td className='bw_text_center'>{p?.function_alias}</td>
                  {!disabled && (
                    <td className='bw_sticky bw_action_table bw_text_center'>
                      <a
                        onClick={() => {
                          dispatch(
                            showConfirmModal(
                              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
                              async () => {
                                methods.setValue(
                                  'functions_list',
                                  watch('functions_list').filter((e) => !(e.value === p.value)),
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
        <a
          onClick={() => {
            const _cloneFuntionList = watch('functions_list') ?? [];
            _cloneFuntionList.push({
              label: null,
              value: null,
            });
            methods.setValue('functions_list', _cloneFuntionList);
          }}
          className='bw_btn_outline bw_btn_outline_success bw_add_us'>
          <span className='fi fi-rr-plus'></span> Thêm quyền
        </a>
      )}
    </BWAccordion>
  );
};

export default PermissionTable;
