import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PermissionSection from './componentes/PermissionSection';
import { createPermission, getOptionsUserGroup, getOptionsUserGroupFunction } from 'services/permission.service';
import { useForm, FormProvider } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import Loading from 'components/shared/Loading';
import { Empty } from 'antd';
import debounce from 'lodash/debounce';

const PermissionsPage = () => {
  const methods = useForm();
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(undefined);
  const [dataUserGroup, setDataUserGroup] = useState([]);
  const [dataFunctionGroup, setDataFunctionGroup] = useState({
    items: [],
  });

  const loadUserGroup = useCallback(() => {
    getOptionsUserGroup().then((p) => {
      setDataUserGroup(
        p?.map((_) => {
          return {
            ..._,
            id: _?.id,
            user_group_id: _?.id,
            function_group_ids: [],
          };
        }),
      );
    });
  }, []);
  useEffect(loadUserGroup, [loadUserGroup]);

  const loadListUserFunctionGroup = useCallback(() => {
    setLoading(true);
    getOptionsUserGroupFunction({
      search: keyword,
      itemsPerPage: 2147483647,
    })
      .then((data) => {
        for (let i of data?.items) {
          for (let m of i?.user_groups ?? []) {
            if (m?.has_permission) {
              methods.setValue(`user_group_array.${m?.user_group_id}.${i?.function_group_id}`, {
                has_permission: true,
              });
            }
          }
        }
        setDataFunctionGroup(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [keyword]);
  useEffect(loadListUserFunctionGroup, [loadListUserFunctionGroup]);

  const onSubmit = async (payload) => {
    try {
      const _payload = {
        ...payload,
      };

      delete _payload.user_group_array;
      const valuePayload = Object.values(_payload).filter(Boolean);
      const _cloneDataUserGroup = [...dataUserGroup].map((o) => {
        return {
          ...o,
          function_group_ids: [],
        };
      });

      for (let i of valuePayload) {
        const user_groups = i?.user_groups ?? []; // lay user group dc quyen

        for (let user of _cloneDataUserGroup) {
          // for vong user
          const find = user_groups.find((p) => p?.user_group_id === user?.id); // tin trong xem co user ko
          let function_group_ids = user?.function_group_ids;
          if (find) {
            const findGroupIds = function_group_ids.findIndex((o) => o?.function_group_id === i?.function_group_id);
            if (find?.has_permission) {
              if (findGroupIds >= 0) {
                if (Array.isArray(function_group_ids[findGroupIds]?.function_ids)) {
                  function_group_ids[findGroupIds].function_ids.push(i?.function_id);
                } else {
                  function_group_ids[findGroupIds].function_ids = [i?.function_ids];
                }

                const has_permission = methods.watch(
                  `user_group_array.${user?.user_group_id}.${function_group_ids[findGroupIds]?.function_group_id}`,
                )?.has_permission;
                if (has_permission !== undefined) {
                  function_group_ids[findGroupIds].has_permission = has_permission ? true : false;
                } else {
                  const user_groups =
                    dataFunctionGroup?.items.find(
                      (o) => o?.function_group_id == function_group_ids[findGroupIds]?.function_group_id,
                    )?.user_groups ?? [];
                  function_group_ids[findGroupIds].has_permission = user_groups.find(
                    (_) => _.user_group_id === user?.id,
                  )?.has_permission
                    ? true
                    : false;
                }
              } else {
                function_group_ids.push({
                  function_group_id: i?.function_group_id,
                  function_ids: [i?.function_id],
                  has_permission: false,
                });
              }
            } else {
              if (findGroupIds >= 0) {
              } else {
                function_group_ids.push({
                  function_group_id: i?.function_group_id,
                  function_ids: [],
                  has_permission: false,
                });
              }
            }
          }
        }
      }

      await createPermission(_cloneDataUserGroup);
      showToast.success('Cập nhật phân quyền thành công');
    } catch (error) {
      showToast.error('Có lỗi xảy ra!');
    }
  };

  // const handleSearch = async (event) => {
  //   if (1 * event.keyCode === 13) {
  //     setKeyword(event.target.value);
  //     event.preventDefault();
  //   }
  // };
  const jsx_section = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={dataUserGroup.length + 1}>
            <Loading />
          </td>
        </tr>
      );
    } else {
      if ((dataFunctionGroup?.items ?? []).length) {
        return (dataFunctionGroup ?? [])?.items.map((p) => (
          <PermissionSection dataDetail={p} dataUserGroup={dataUserGroup} />
        ));
      } else {
        return (
          <tr>
            <td colSpan={dataUserGroup.length + 1}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
            </td>
          </tr>
        );
      }
    }
  };

  const handleSearch = useMemo(() => {
    const loadKeyWord = (event) => {
      setKeyword(event.target.value);
    };
    return debounce(loadKeyWord, 700);
  }, [keyword]);

  return (
    <FormProvider {...methods}>
      <div className='bw_main_wrapp'>
        <div className='bw_row'>
          <div className='bw_col_12 bw_flex bw_align_items_center bw_justify_content_right bw_btn_group'>
            <div className='bw_search'>
              <input className='bw_inp bw_inp_success' placeholder='Tìm kiếm ' onChange={handleSearch} />
              {/* <button
                style={{
                  marginRight: '0px',
                  marginTop: '2px',
                }}
                onClick={() => handleSearch()}
                className='bw_btn bw_btn_success'>
                <span className='fi fi-rr-search'></span>
              </button> */}
            </div>
          </div>
        </div>
        <div className='bw_box_card bw_mt_2'>
          <div
            style={{
              height: '80vh',
            }}
            className='bw_table_responsive'>
            <table className='bw_table bw_table_role'>
              <thead
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 5,
                }}>
                <th
                  style={{
                    width: '20%',
                    maxWidth: '20%',
                    position: 'sticky',
                    left: 0,
                  }}>
                  Tính năng
                </th>
                {(dataUserGroup ?? [])?.map((p) => (
                  <th style={{ maxWidth: `calc(70%/${dataUserGroup.length})` }}>{p?.name}</th>
                ))}
              </thead>
              <tbody>{jsx_section()}</tbody>
            </table>
          </div>
          <div className='bw_row bw_mt_2 bw_show_table_page'>
            <div className='bw_col_6'></div>
            <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center'>
              <button onClick={methods.handleSubmit(onSubmit)} className='bw_btn bw_btn_success'>
                <span className='fi fi-rr-folder-download'></span>
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default PermissionsPage;
