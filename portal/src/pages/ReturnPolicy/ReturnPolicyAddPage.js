import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import FormSection from 'components/shared/FormSection';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import ReturnPolicyInformation from './components/add/ReturnPolicyInformation';
import { createReturnPolicy, getReturnPolicyDetail, updateReturnPolicy } from 'services/return-policy.service';
import ApplyCondition from './components/add/ApplyCondition';
import ApplyWith from './components/add/ApplyWith';
import { showToast } from 'utils/helpers';

const ReturnPolicyAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname, search } = useLocation();
  const { id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isReturn, setIsReturn] = useState(!search.includes('?r=1') ? 0 : 1);
  const nameType = isReturn === 0 ? 'trả' : 'đổi';

  const clearInput = useCallback((value = '') => value?.trim(), []);

  const onSubmit = async (payload) => {
    const label = id ? 'Chỉnh sửa' : 'Thêm mới';
    try {
      payload.return_policy_code = clearInput(payload.return_policy_code);
      payload.return_policy_name = clearInput(payload.return_policy_name);
      payload.description = clearInput(payload.description);

      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload[isReturn === 0 ? 'is_return' : 'is_exchange'] = 1;
      payload.condition_ids = payload.condition_ids.map((c) => c.id);

      if (!payload.is_apply_all_customer_type && payload.customertype_ids[0] === undefined) {
        return showToast.error(`Hạng khách hàng là bắt buộc`);
      }

      if (!payload.is_apply_all_category && payload.category_ids.length === 0) {
        return showToast.error(`Ngành hàng là bắt buộc`);
      }

      if (!id) {
        if (payload.is_apply_all_customer_type) payload.customertype_ids = [];
        if (payload.is_apply_all_category) {
          payload.category_ids = [];
          payload.product_ids = [];
        }
      }

      const result = await (id ? updateReturnPolicy(payload) : createReturnPolicy(payload));

      if (!id) {
        methods.reset({
          is_active: 1,
        });
        setIsSubmit(true);
      }

      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? `${label} thất bại`);
    } finally {
      setLoading(false);
    }
  };

  const [listConditionEdit, setListConditionEdit] = useState([]);
  const [listCategoryEdit, setListCategoryEdit] = useState([]);
  const [listProductEdit, setListProductEdit] = useState([]);
  const loadData = useCallback(() => {
    if (id) {
      setLoading(true);
      getReturnPolicyDetail(id)
        .then((value) => {
          // fill toàn bộ
          setIsReturn(value.is_return === 1 ? 0 : 1);
          setListConditionEdit(value.condition_ids);
          setListCategoryEdit(value.category_ids);
          setListProductEdit(value.product_ids);
          const tables = ['condition', 'category', 'product', 'customertype'];
          methods.reset({
            ...value,
            list_id_remove: {
              ...tables.reduce(
                (a, t) => ({
                  ...a,
                  [`return_policy_${t}_ids`]: value[`${t}_ids`].map((it) => it[`return_policy_${t}_id`]),
                }),
                {},
              ),
            },
            customertype_ids: value.customertype_ids.map((c) => c.customertype_id),
          });
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
  }, [id, methods]);

  useEffect(loadData, [loadData]);

  const detailForm = [
    {
      title: `Thông tin chính sách ${nameType} hàng`,
      id: 'information',
      component: ReturnPolicyInformation,
      fieldActive: ['return_policy_name'],
      isReturn,
      nameType,
      isSubmit,
      listConditionEdit,
    },
    {
      title: 'Điều kiện áp dụng',
      id: 'condition',
      component: ApplyCondition,
      fieldActive: ['is_apply_discount_product', 'is_apply_discount_order', 'is_other_condition'],
      isReturn,
    },
    {
      title: `Áp dụng ${nameType} hàng với`,
      id: 'with',
      component: ApplyWith,
      fieldActive: ['is_apply_all_customer_type', 'is_apply_all_category'],
      isSubmit,
      listCategoryEdit,
      listProductEdit,
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default ReturnPolicyAddPage;
