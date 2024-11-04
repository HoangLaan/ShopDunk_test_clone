import React, { useCallback, useEffect, useState } from 'react';
import PermissionFunctionChild from './PermissionFunctionChild';
import Loading from 'components/shared/Loading';
import { getOptionsUserGroupFunctionDetail } from 'services/permission.service';
import { useFormContext } from 'react-hook-form';
import { Empty } from 'antd';

const PermissionSection = ({ dataDetail, dataUserGroup }) => {
  const methods = useFormContext();
  useEffect(() => {
    methods.register('user_group_array');
  }, []);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataFunctionGroup, setDataFunctionGroup] = useState(dataDetail ?? {});

  const [functionByFunctionGroup, setFunctionByFunctionGroup] = useState(undefined);

  const loadFunctionByFunctionGroup = useCallback(() => {
    try {
      setLoading(true);
      getOptionsUserGroupFunctionDetail(dataFunctionGroup?.function_group_id)
        .then((p) => setFunctionByFunctionGroup(p?.items))
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {}
  }, [dataFunctionGroup]);

  const jsx_header = dataUserGroup?.map((p) => {
    const user_group_id = p?.id;
    //let user_groups = dataFunctionGroup?.user_groups ?? [];
    let _group = methods.watch(`user_group_array.${p?.id}.${dataDetail?.function_group_id}`);
    let checkAll = _group?.has_permission;

    return (
      <td>
        <label className='bw_checkbox'>
          <input
            checked={checkAll ? true : false}
            onChange={() => {
              if (!open && !functionByFunctionGroup) {
                loadFunctionByFunctionGroup();
                setOpen(true);
              }
              if (checkAll) {
                for (let i of functionByFunctionGroup) {
                  const valueForm = { ...(methods.watch(i?.function_id) ?? {}) };
                  let user_groups = [...valueForm?.user_groups];
                  delete valueForm.user_groups;
                  let findUserGroup = user_groups.findIndex((o) => o.user_group_id == user_group_id);
                  user_groups[findUserGroup] = {
                    ...user_groups[findUserGroup],
                    has_permission: 0,
                  };

                  if (findUserGroup >= 0) {
                    //user_groups.splice(findUserGroup, 1);
                    //user_groups.push({ user_group_id: user_group_id, has_permission: 0, function_id: i?.function_id });
                    methods.setValue(i?.function_id, {
                      ...valueForm,
                      user_groups,
                    });
                  }
                }
              } else {
                for (let i of functionByFunctionGroup) {
                  const valueForm = { ...(methods.watch(i?.function_id) ?? {}) };
                  let user_groups = [...(valueForm?.user_groups ?? [])];
                  delete valueForm.user_groups;
                  let findUserGroup = user_groups.findIndex((o) => o.user_group_id == user_group_id);

                  if (findUserGroup < 0) {
                    user_groups.push({ user_group_id: user_group_id, has_permission: 1, function_id: i?.function_id });
                  } else {
                    user_groups[findUserGroup] = {
                      ...user_groups[findUserGroup],
                      has_permission: 1,
                    };
                  }

                  methods.setValue(i?.function_id, {
                    ...valueForm,
                    user_groups,
                  });
                }
              }

              const user_groups_checkall = [...(dataFunctionGroup?.user_groups ?? [])];
              const findData = user_groups_checkall?.findIndex((o) => o?.user_group_id == p?.id);
              user_groups_checkall.splice(findData, 1);
              user_groups_checkall.push({
                user_group_id: p?.id,
                has_permission: checkAll ? 0 : 1,
              });
              setDataFunctionGroup((params) => {
                return {
                  ...params,
                  user_groups: user_groups_checkall,
                };
              });

              methods.setValue(`user_group_array.${user_group_id}.${dataDetail?.function_group_id}`, {
                has_permission: !checkAll,
              });
            }}
            type='checkbox'
          />
          <span></span>
        </label>
      </td>
    );
  });

  const jsx_section =
    Array.isArray(functionByFunctionGroup) && functionByFunctionGroup?.length > 0 ? (
      (functionByFunctionGroup ?? []).map((p, key) => (
        <PermissionFunctionChild
          key={key}
          data={p}
          dataFunctionGroup={dataFunctionGroup}
          dataUserGroup={dataUserGroup}
        />
      ))
    ) : (
      <tr>
        <td colSpan={dataUserGroup.length + 1}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
        </td>
      </tr>
    );

  return (
    <React.Fragment>
      <tr>
        <td style={{ left: 0, zIndex: 1 }} className='bw_sticky bw_name_sticky'>
          <b>
            <span
              className={`fi ${open ? 'fi-rr-minus-small' : 'fi-rr-plus-small'} bw_show_child`}
              onClick={() => {
                if (!open && !functionByFunctionGroup) {
                  loadFunctionByFunctionGroup();
                }
                setOpen((prev) => !prev);
              }}
            />
            {dataFunctionGroup?.function_group_name}
          </b>
        </td>
        {jsx_header}
      </tr>

      {open &&
        (loading ? (
          <tr>
            <td colSpan={dataUserGroup?.length}>
              <Loading />
            </td>
          </tr>
        ) : (
          jsx_section
        ))}
    </React.Fragment>
  );
};

export default PermissionSection;
