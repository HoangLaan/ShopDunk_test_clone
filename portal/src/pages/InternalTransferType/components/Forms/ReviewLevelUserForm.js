import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { showConfirmModal } from 'actions/global';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable/index';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

import internalTransferTypeService from 'services/internalTransferType.service';
import ReviewLevelModal from '../ReviewModal/ReviewLevelModal';
import { INTERNAL_TRANSFER_TYPE_PERMISSION } from 'pages/InternalTransferType/utils/constants';

const ReviewLevelUserForm = ({ disabled, loading, title }) => {
  const methods = useFormContext();
  const { control, setValue, watch } = methods;
  const { remove } = useFieldArray({
    control,
    name: 'review_level_user_list',
  });
  const dispatch = useDispatch();
  const [isShowReviewLevelModal, setIsShowReviewLevelModal] = useState(false);

  const fetchUserOptions = (keyword, review_level_id) =>
    internalTransferTypeService.getUserOptions({ keyword, limit: 20, review_level_id });

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Tên mức duyệt',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <React.Fragment>
              <FormInput
                className={'bw_inp bw_mw_2'}
                style={{
                  maxWidth: '100%',
                }}
                disabled={true}
                type='text'
                field={`review_level_user_list.${index}.review_level_name`}
                validation={{
                  required: 'Tên mức duyệt là bắt buộc',
                }}
              />
            </React.Fragment>
          );
        },
      },
      {
        header: 'Người duyệt',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <React.Fragment>
              <FormDebouneSelect
                className={'bw_inp bw_mw_2'}
                style={{
                  maxWidth: '100%',
                }}
                disabled={disabled || methods.watch(`review_level_user_list.${index}.is_auto_review`)}
                type='text'
                field={`review_level_user_list.${index}.user_review`}
                placeholder='Chọn người duyệt'
                fetchOptions={(keyword) =>
                  fetchUserOptions(keyword, methods.watch(`review_level_user_list.${index}.review_level_id`))
                }
                validation={{
                  required:
                    !Boolean(methods.watch(`review_level_user_list.${index}.is_auto_review`)) &&
                    'Người duyệt là bắt buộc',
                }}
              />
            </React.Fragment>
          );
        },
      },
    ],
    [disabled, setValue, watch, methods],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Chọn mức duyệt',
        permission: INTERNAL_TRANSFER_TYPE_PERMISSION.EDIT,
        onClick: () => setIsShowReviewLevelModal(true),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        title: 'Xóa',
        permission: INTERNAL_TRANSFER_TYPE_PERMISSION.EDIT,
        onClick: (_, index) =>
          dispatch(
            showConfirmModal(['Xoá mức duyệt này?'], () => {
              remove(index);
              const newList = methods.watch('review_level_user_list')?.map((e, idx) => ({ ...e, order_index: idx }));
              methods.setValue('review_level_user_list', newList);
            }),
          ),
      },
    ];
  }, [remove, disabled, dispatch, methods]);

  const review_level_user_list = useMemo(() => {
    return methods.watch('review_level_user_list');
  }, [methods]);

  return (
    <React.Fragment>
      <BWAccordion title={title}>
        <DataTable
          style={{
            marginTop: '0px',
          }}
          hiddenActionRow
          noPaging
          noSelect
          data={review_level_user_list}
          columns={columns}
          loading={loading}
          actions={actions}
        />
      </BWAccordion>

      {isShowReviewLevelModal && (
        <ReviewLevelModal
          onClose={() => {
            setIsShowReviewLevelModal(false);
          }}
        />
      )}
    </React.Fragment>
  );
};

export default ReviewLevelUserForm;
