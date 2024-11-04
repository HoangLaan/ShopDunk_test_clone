import React, {useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import FormSection from 'components/shared/FormSection';
import {STATUS_TYPES} from 'utils/constants';
import ICON_COMMON from 'utils/icons.common';
import {showToast} from 'utils/helpers';
import BorrowRequestInfo from "../components/Section/BorrowRequestInfo";
import BorrowRequestStatus from "../components/Section/BorrowRequestStatus";
import BudgetTypeReview from "../components/Section/BudgetTypeReview";
import {createBorrowType,updateBorrowType,getDetailBorrowType} from "services/borrow-type.service"
import {listTypeBorrow} from "../utils/utils";

function BorrowRequestTypeAdd({id = null, disabled = false}) {
  const methods = useForm();
  const {reset, handleSubmit} = methods;

  const [loading, setLoading] = useState(false);

  const initData = async () => {
    try {
      setLoading(true);
      if (id) {
        const data = await getDetailBorrowType(id);
        data.borrow_type=data.is_for_sale?0:data.is_borrow_partner?1:2
        reset({...data});
      } else {
        reset({
            borrow_type:2,
            is_active: STATUS_TYPES.ACTIVE,
            is_system: STATUS_TYPES.HIDDEN,
            is_auto_review: true
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
    const body = {...dataSubmit, review_users: []}
    try {
      setLoading(true);
      if (id) {
        await updateBorrowType(id, body);
        showToast.success('Chỉnh sửa thành công');
      } else {
        await createBorrowType(body);
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
      title: 'Thông tin hình thức mượn hàng',
      component: BorrowRequestInfo,
      fieldActive: ['borrow_type_name','description'],
    },
    {
      title: 'Thông tin mức duyệt',
      component: BudgetTypeReview,
      fieldActive: null,
    },
    {
      title: 'Trạng thái',
      component: BorrowRequestStatus,
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
        if (disabled) window._$g.rdr('/borrow-request-type/edit/' + id);
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

export default BorrowRequestTypeAdd;
