import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const PermissionFunctionChild = ({ data, dataUserGroup, dataFunctionGroup }) => {
  const [dataFunction, setDataFunction] = useState(data);
  const methods = useFormContext();
  useEffect(() => {
    methods.register(data?.function_id);
  }, []);

  useEffect(() => {
    methods.setValue(data?.function_id, {
      ...dataFunction,
      function_group_id: dataFunctionGroup?.function_group_id,
    });
  }, [dataFunction]);

  return (
    <tr className={`bw_child_tr bw_tr_1 bw_active ${methods.watch(data?.function_id) ? 'bw_checked' : ''}`}>
      <td style={{position: 'sticky', left: 0, zIndex: 1, }} >{dataFunction?.function_name}</td>
      {dataUserGroup?.map((q, key) => {
        let user_groups = [...(methods.watch(data?.function_id)?.user_groups ?? [])];
        const findIndex = user_groups?.findIndex(
          (p) => parseInt(p?.user_group_id) === parseInt(q?.id) && p?.has_permission,
        );

        return (
          <td key={key}>
            <label className='bw_checkbox'>
              <input
                type='checkbox'
                readOnly
                defaultChecked
                checked={Boolean(findIndex >= 0)}
                onChange={(_) => {
                  if (findIndex >= 0) {
                    methods.setValue(`user_group_array.${q?.id}.${dataFunctionGroup?.function_group_id}`, {
                      has_permission: false,
                    });
                    user_groups.splice(findIndex, 1);
                    setDataFunction({
                      ...dataFunction,
                      user_groups,
                    });
                    methods.setValue(data?.function_id, {
                      ...dataFunction,
                      function_group_id: dataFunctionGroup?.function_group_id,
                    });
                  } else {
                    const object = {
                      function_id: data?.function_id,
                      has_permission: 1,
                      user_group_id: q?.id,
                    };
                    user_groups.push(object);
                    setDataFunction({
                      ...dataFunction,
                      user_groups,
                    });
                  }
                }}
              />
              <span></span>
            </label>
          </td>
        );
      })}
    </tr>
  );
};

export default PermissionFunctionChild;
