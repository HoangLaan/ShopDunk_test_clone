import React, {useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import FormSection from 'components/shared/FormSection/index';
import {STATUS_TYPES} from 'utils/constants';
import ICON_COMMON from 'utils/icons.common';
import {showToast} from 'utils/helpers';
import MaterialGroupInfo from "../components/Section/MaterialGroupInfo";
import MaterialGroupStatus from "../components/Section/MaterialGroupStatus";
import {createMaterialGroup, getById, updateMaterialGroup} from "services/material-group.service";

function MaterialGroupAdd({id = null, disabled = false}) {
  const methods = useForm();
  const {reset, handleSubmit} = methods;

  const [loading, setLoading] = useState(false);

  const initData = async () => {
    try {
      setLoading(true);
      if (id) {
        const data = await getById(id)
        reset(data);
      } else {
        reset({
            is_active: STATUS_TYPES.ACTIVE,
            is_system: STATUS_TYPES.HIDDEN,
          }
        );
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const onSubmit = async (dataSubmit) => {
    try {
      setLoading(true);
      if (id) {
        await updateMaterialGroup(id, dataSubmit);
        showToast.success('Chỉnh sửa thành công');
      } else {
        await createMaterialGroup(dataSubmit);
        showToast.success('Thêm mới thành công');
        await initData();
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin nhóm nguyên liệu',
      component: MaterialGroupInfo,
      id:id,
      fieldActive: ['material_group_name', 'material_group_code'],
    },
    {
      title: 'Trạng thái',
      component: MaterialGroupStatus,
      fieldActive: ['is_active', 'is_system'],
    },
  ];

  const actions = [
    {
      globalAction: true,
      icon: ICON_COMMON.save,
      type: 'success',
      submit: true,
      content: disabled ? 'Chỉnh sửa' : id ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới',
      onClick: () => {
        if (disabled) window._$g.rdr('/material-group/edit/' + id);
        else handleSubmit(onSubmit);
      },
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection
        loading={loading}
        detailForm={detailForm}
        onSubmit={onSubmit}
        disabled={disabled}
        actions={actions}
      />
    </FormProvider>
  );
}

export default MaterialGroupAdd;
