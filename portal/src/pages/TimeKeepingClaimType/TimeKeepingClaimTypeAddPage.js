import React, { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { createTimeKeepingClaimType, getDetailTimeKeepingClaimType, updateTimeKeepingClaimType } from 'services/time-keeping-claim-type.service';
import { useLocation, useParams } from 'react-router-dom';
import FormSection from 'components/shared/FormSection';
import TimeKeepingClaimTypeInformation from './components/TimeKeepingClaimTypeInformation';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { showToast } from 'utils/helpers';
import ReviewLevelTable from './components/ReviewLevel/ReviewLevelTable';
const TimeKeepingClaimTypeAddPage = () => {
  const defaultValues = useMemo(() => ({
    is_active: 1,
    is_system: 0,
    users_qc: [],
    claim_limits: 1,
    limits_cycle: 1
  }), [])
  const methods = useForm({ defaultValues });
  const { pathname } = useLocation();
  const { id } = useParams();

  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const onSubmit = async (payload) => {
    const label = id ? 'Chỉnh sửa' : 'Thêm mới';
    try {
      const blocks_departments = [];
      const { block_id: block_ids = [], department_id: department_ids = [] } = payload;
      for (const block of block_ids) {
        for (const department of department_ids) {
          blocks_departments.push({
            block_id: block.id ?? block,
            department_id: department.id ?? department
          })
        }
      }
      payload.blocks_departments = blocks_departments
      delete payload.block_id
      delete payload.department_id

      payload.users_qc = payload.users_qc.map(item => item.user_name)
      payload.review_levels = payload.review_levels.map(item => ({
        review_level_id: item.review_level_id,
        department_id: item.department_id,
        user_review: item.user_name
      }))

      await (id ? updateTimeKeepingClaimType(payload) : createTimeKeepingClaimType(payload));
      if (!id) methods.reset(defaultValues);

      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error.message ?? `${label} thất bại`);
    }
  };

  const loadTimeKeepingClaimTypeDetailById = useCallback(() => {
    if (id) {
      getDetailTimeKeepingClaimType(id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    }
  }, [id]);

  useEffect(() => {
    loadTimeKeepingClaimTypeDetailById()
  }, [loadTimeKeepingClaimTypeDetailById]);

  const detailForm = [
    {
      title: 'Thông tin loại giải trình',
      id: 'information',
      disabled,
      component: TimeKeepingClaimTypeInformation,
      fieldActive: ['time_keeping_claim_type_name'],
    },
    {
      title: 'Mức duyệt',
      id: 'information',
      disabled,
      component: ReviewLevelTable,
      fieldActive: ['time_keeping_claim_type_name'],
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <FormSection disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
      </FormProvider>
    </React.Fragment>
  );
};

export default TimeKeepingClaimTypeAddPage;
