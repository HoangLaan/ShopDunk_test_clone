import { useMemo, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import BWButton from 'components/shared/BWButton/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import DataTable from 'components/shared/DataTable/index';
import CheckAccess from 'navigation/CheckAccess';
import ICON_COMMON from 'utils/icons.common';
import useGetOptions, { optionType } from 'hooks/useGetOptions';

import ConfirmReviewModal from '../Modals/ConfirmReviewModal';
import { PURCHASE_ORDER_DIVISION_PERMISSION } from 'pages/PurchaseOrderDivision/utils/constants';
import usePageInformation from 'hooks/usePageInformation';
import ReviewLevelModal from '../ModalReview/ReviewLevelModal';
import { useAuth } from 'context/AuthProvider';

const UserReviewListForm = () => {
  const methods = useFormContext();
  const [openModalReview, setOpenModalReview] = useState(false);
  const [openModalReviewLevel, setOpenModalReviewLevel] = useState(false);

  const poDivisionReviewLevelOptions = useGetOptions(optionType.poDivisionReviewLevel);
  const userOptions = useGetOptions(optionType.user, { valueAsString: true });

  const { disabled, isAdd, isEdit } = usePageInformation();
  const { user } = useAuth();

  const { remove, append } = useFieldArray({ control: methods.control, name: 'review_list' });
  const review_list = methods.watch('review_list');

  const renderStatus = (reviewItem, index) => {
    if (reviewItem.review_user === user.user_name) {
      switch (reviewItem.is_reviewed) {
        case 1:
          return 'Đồng ý duyệt';
        case 0:
          return 'Không đồng ý';
        default:
          return (
            <CheckAccess permission={PURCHASE_ORDER_DIVISION_PERMISSION.REVIEW}>
              <BWButton
                disabled={isAdd || disabled}
                content='Duyệt'
                type='success'
                onClick={() => {
                  setOpenModalReview(true);
                  methods.setValue('modal_note', reviewItem.note);
                  methods.setValue('modal_review_index', index);
                }}
              />
            </CheckAccess>
          );
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (item, index) => index + 1,
      },
      {
        header: 'Mức duyệt',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (_, index) => (
          <FormSelect
            validation={{ required: 'Mức duyệt là bắt buộc' }}
            field={`review_list.${index}.review_level_id`}
            list={poDivisionReviewLevelOptions}
            disabled={disabled || isEdit}
          />
        ),
      },
      {
        header: 'Người duyệt',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (_, index) => (
          <FormSelect
            validation={{ required: 'Người duyệt chọn là bắt buộc' }}
            list={userOptions}
            field={`review_list.${index}.review_user`}
            disabled={disabled || isEdit}
          />
        ),
      },
      {
        header: 'Mức duyệt cuối',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (_, index) => (
          <label className='bw_checkbox' style={{ margin: 'auto' }}>
            <FormInput disabled={disabled || isEdit} type='checkbox' field={`review_list.${index}.is_completed`} />
            <span />
          </label>
        ),
      },
      {
        header: 'Thao tác',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (rowItem, index) => renderStatus(rowItem, index),
        hidden: isAdd || disabled,
      },
      {
        header: 'Ghi chú',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (_, index) => methods.watch(`review_list.${index}.note`),
        hidden: isAdd || disabled,
      },
    ],
    [review_list, isAdd, disabled, user],
  );

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'primary',
        outline: true,
        content: 'Thêm mức duyệt',
        permission: PURCHASE_ORDER_DIVISION_PERMISSION.ADD_NEW_REVIEW,
        hidden: disabled || isEdit,
        onClick: () => setOpenModalReviewLevel(true),
      },
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm',
        permission: PURCHASE_ORDER_DIVISION_PERMISSION.ADD_USER_REVIEW,
        hidden: disabled || isEdit,
        onClick: () => append({}),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        hidden: disabled || isEdit,
        onClick: (_, index) => remove(index),
      },
    ],
    [],
  );
  return (
    <BWAccordion title='Thông tin duyệt'>
      <DataTable data={review_list} columns={columns} noSelect noPaging actions={actions}></DataTable>
      {openModalReview && <ConfirmReviewModal onClose={() => setOpenModalReview(false)} onConfirm={() => {}} />}
      {openModalReviewLevel && <ReviewLevelModal onClose={() => setOpenModalReviewLevel(false)} />}
    </BWAccordion>
  );
};

export default UserReviewListForm;
