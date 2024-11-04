import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

import FormSection from 'components/shared/FormSection';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import BlockInformation from './components/add/BlockInformation';
import DepartmentListTable from './components/add/DepartmentListTable';
import { createBlock, getBlockDetail, updateBlock } from 'services/block.service';
import { showToast } from 'utils/helpers';

const BlockAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { block_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const [loading, setLoading] = useState(false);

  const clearInput = useCallback((value = '') => value.trim(), []);
  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.block_code = clearInput(payload.block_code);
      payload.block_name = clearInput(payload.block_name);

      let label;
      if (block_id) {
        await updateBlock(payload);
        label = 'Chỉnh sửa';
      } else {
        await createBlock(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const loadData = useCallback(() => {
    if (block_id) {
      setLoading(true);
      getBlockDetail(block_id)
        .then((value) => {
          methods.reset({ ...value, company_id: String(value?.company_id) });
        })
        .catch((error) => {
          showToast.error(error?.message ?? 'Có lỗi xảy ra');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [block_id, methods]);

  useEffect(loadData, [loadData]);

  const hiddenDepartmentList = useMemo(() => {
    return block_id ? false : true;
  }, [block_id]);

  const detailForm = [
    {
      title: 'Thông tin khối',
      isRequired: true,
      id: 'information',
      component: BlockInformation,
      fieldActive: ['block_code', 'block_name', 'company_id'],
    },
    {
      title: 'Danh sách phòng ban thuộc khối',
      id: 'department_list',
      hidden: hiddenDepartmentList,
      component: DepartmentListTable,
      fieldActive: [],
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default BlockAddPage;
