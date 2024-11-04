import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

import FormSection from 'components/shared/FormSection/index';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import DiscountProgramInformation from './components/add/DiscountProgramInformation';
import DiscountProgramCondition from './components/add/DiscountProgramCondition';
import DiscountProgramProduct from './components/add/DiscountProgramProduct';
import DiscountProgramStore from './components/add/DiscountProgramStore';
import DiscountProgramReview from './components/add/DiscountProgramReview';

import { showToast } from 'utils/helpers';
import { createDiscountProgram, getDetail, update } from 'services/discount-program.service';
import { ResetStyle } from './ultils/styles';
import { PromotionCodeType, ReviewStatus } from './ultils/constant';

const defaultValues = {
  is_active: 1,
  // debit_type: DebitType.RECEIVE,
  supplier_promotion_code: PromotionCodeType.SUPPLIER,
  is_apply_all_store: 1,
  // is_apply_all_product: 1,
  // is_free_service_package: ServicePackageType.FREE,
  // is_installment_finance_company: InstallmentType.FINANCE_COMPANY,
};

const DiscountProgramAddPage = () => {
  const params = useParams();
  const { discount_program_id } = params || {};
  const { pathname } = useLocation();

  const disabled = React.useMemo(() => pathname.includes('/detail'), [pathname]);
  const isView = useMemo(() => pathname.includes('/detail') || pathname.includes('/view'), [pathname]);
  const isAdd = useMemo(() => pathname.includes('/add'), [pathname]);
  const isEdit = useMemo(() => pathname.includes('/edit'), [pathname]);

  const methods = useForm({
    defaultValues: defaultValues,
  });
  const { reset, watch } = methods;

  const [loading, setLoading] = useState(false);

  const is_review = watch('is_review');
  const is_apply_all_store = watch('is_apply_all_store');
  const store_apply_list = watch('store_apply_list');
  const is_apply_all_product = watch('is_apply_all_product');
  const product_list = watch('product_list');
  const is_apply_with_trade_in_program = watch('is_apply_with_trade_in_program');
  const is_apply_direct_discount = watch('is_apply_direct_discount');
  const is_apply_quantity_discount = watch('is_apply_quantity_discount');
  const is_apply_gift = watch('is_apply_gift');
  const is_apply_service_pack = watch('is_apply_service_pack');
  const is_apply_installment_product = watch('is_apply_installment_product');

  const loadDetail = useCallback(() => {
    if (discount_program_id) {
      setLoading(true);
      getDetail(discount_program_id)
        .then((o) => {
          if (isEdit && o.is_review !== ReviewStatus.PENDING) {
            window._$g.rdr(`/discount-program/detail/${discount_program_id}`);
          }

          reset(o);
        })
        .finally(() => setLoading(false));
    } else {
      reset();
    }
  }, [discount_program_id, reset, isEdit]);

  useEffect(loadDetail, [loadDetail]);

  const onSubmit = async (payload) => {
    try {
      const is_apply_with_trade_in_program = payload.is_apply_with_trade_in_program;
      const is_apply_direct_discount = payload.is_apply_direct_discount;
      const is_apply_quantity_discount = payload.is_apply_quantity_discount;
      const is_apply_gift = payload.is_apply_gift;
      const is_apply_service_pack = payload.is_apply_service_pack;
      const is_apply_installment_product = payload.is_apply_installment_product;

      if (
        !is_apply_with_trade_in_program &&
        !is_apply_direct_discount &&
        !is_apply_quantity_discount &&
        !is_apply_gift &&
        !is_apply_service_pack &&
        !is_apply_installment_product
      ) {
        showToast.warning('Điều kiện chiết khấu là bắt buộc');
        return;
      }
      payload.area_list = payload?.area_list?.map((o) => o?.id ?? o);
      payload.store_apply_list = payload?.store_apply_list?.map((o) => o?.store_id);
      let label;

      if (discount_program_id) {
        await update(discount_program_id, payload);
        loadDetail();
        label = 'Chỉnh sửa';
      } else {
        await createDiscountProgram(payload);
        label = 'Thêm mới';
        reset(defaultValues);
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    }
  };

  const detailForm = [
    {
      id: 'information_detail',
      title: 'Thông tin chương trình chiết khấu',
      component: DiscountProgramInformation,
      fieldActive: ['discount_program_name', 'manufacture_id', 'from_date', 'to_date'],
    },
    {
      id: 'discount_store',
      title: 'Danh sách cửa hàng áp dụng',
      component: DiscountProgramStore,
      fieldActive: is_apply_all_store ? null : Boolean(store_apply_list?.length) ? null : [],
    },
    {
      id: 'discount_product',
      title: 'Danh sách sản phẩm áp dụng',
      component: DiscountProgramProduct,
      fieldActive: is_apply_all_product ? null : Boolean(product_list?.length) ? null : [],
    },
    {
      id: 'discount_condition',
      title: 'Điều kiện chiết khấu',
      component: DiscountProgramCondition,
      fieldActive:
        is_apply_with_trade_in_program ||
        is_apply_direct_discount ||
        is_apply_quantity_discount ||
        is_apply_gift ||
        is_apply_service_pack ||
        is_apply_installment_product
          ? null
          : [],
    },
    {
      id: 'form_status_review',
      title: 'Mức duyệt',
      component: DiscountProgramReview,
      loadDetail: loadDetail,
      fieldActive: ['reviewed_user'],
    },
    {
      id: 'form_status',
      title: 'Trạng thái',
      hiddenSystem: true,
      component: FormStatus,
    },
  ];

  const actions = useMemo(() => {
    if (isView) {
      return [
        {
          type: 'success',
          hidden: is_review !== ReviewStatus.PENDING,
          content: 'Chỉnh sửa',
          onClick: () => window._$g.rdr(`/discount-program/edit/${discount_program_id}`),
          outline: true,
        },
      ];
    } else if (isAdd || isEdit) {
      return [
        {
          type: 'success',
          content: 'Hoàn tất ' + (isEdit ? 'chỉnh sửa' : 'thêm mới'),
          submit: true,
        },
      ];
    }
  }, [isView, isEdit, isAdd, is_review, discount_program_id]);

  return (
    <FormProvider {...methods}>
      <ResetStyle>
        <FormSection
          disabled={disabled}
          detailForm={detailForm}
          onSubmit={onSubmit}
          loading={loading}
          actions={actions}
        />
      </ResetStyle>
    </FormProvider>
  );
};

export default DiscountProgramAddPage;
