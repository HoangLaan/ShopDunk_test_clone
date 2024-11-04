import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { showConfirmModal } from 'actions/global';
import { BORROW_TYPE_PERMISSION } from 'pages/BorrowRequestType/helper/constants';
import { getOptionsReviewUser } from 'services/borrow-request-rl.service';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable/index';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import ReviewLevelModal from './ReviewModal/ReviewLevelModal';

const reviewLevelUserListField = 'borrow_type_review_list';

const ReviewLevelUserSection = ({ disabled, loading, title }) => {
  const methods = useFormContext();
  const { control, setValue, watch } = methods;
  const { remove } = useFieldArray({
    control,
    name: reviewLevelUserListField,
  });
  const dispatch = useDispatch();
  const [isShowReviewLevelModal, setIsShowReviewLevelModal] = useState(false);

  const is_auto_review = watch('is_auto_review');

  const fetchUserOptions = (keyword, review_lv_id) => getOptionsReviewUser({ keyword, review_lv_id });

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
                field={`${reviewLevelUserListField}.${index}.review_level_name`}
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
                disabled={disabled || methods.watch(`${reviewLevelUserListField}.${index}.is_auto_review`)}
                type='text'
                field={`${reviewLevelUserListField}.${index}.user_review`}
                placeholder='Chọn người duyệt'
                fetchOptions={(keyword) =>
                  fetchUserOptions(keyword, methods.watch(`${reviewLevelUserListField}.${index}.review_level_id`))
                }
                validation={{
                  required:
                    !Boolean(methods.watch(`${reviewLevelUserListField}.${index}.is_auto_review`)) &&
                    'Người duyệt là bắt buộc',
                }}
                preLoad={true}
              />
            </React.Fragment>
          );
        },
      },
      {
        header: 'Mức duyệt cuối',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <React.Fragment>
              <label className='bw_checkbox' style={{ margin: 0 }}>
                <FormInput
                  className={'bw_checkbox'}
                  disabled={disabled}
                  type='checkbox'
                  field={`${reviewLevelUserListField}.${index}.is_complete`}
                  onChange={(e) => {
                    setValue(
                      `${reviewLevelUserListField}`,
                      [...watch(reviewLevelUserListField)].map((o) => {
                        return { ...o, is_complete: 0 };
                      }),
                    );
                    setValue(`${reviewLevelUserListField}.${index}.is_complete`, 1);
                  }}
                />
                <span></span>
              </label>
            </React.Fragment>
          );
        },
      },
      {
        header: 'Tự động duyệt',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <React.Fragment>
              <label className='bw_checkbox' style={{ margin: 0 }}>
                <FormInput
                  className={'bw_checkbox'}
                  disabled={disabled}
                  type='checkbox'
                  field={`${reviewLevelUserListField}.${index}.is_auto_review`}
                  onChange={(e) => {
                    methods.clearErrors(`${reviewLevelUserListField}.${index}.is_auto_review`);
                    methods.clearErrors(`${reviewLevelUserListField}.${index}.user_review`);
                    methods.setValue(`${reviewLevelUserListField}.${index}.is_auto_review`, e.target.checked ? 1 : 0);
                    if (e.target.checked) {
                      setValue(`${reviewLevelUserListField}.${index}.user_review`, null);
                    }
                  }}
                />
                <span></span>
              </label>
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
        permission: BORROW_TYPE_PERMISSION.EDIT,
        onClick: () => setIsShowReviewLevelModal(true),
        hidden: disabled,
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        title: 'Xóa',
        permission: BORROW_TYPE_PERMISSION.EDIT,
        onClick: (_, index) =>
          dispatch(
            showConfirmModal(['Xoá mức duyệt này?'], () => {
              remove(index);
              const newList = methods.watch(reviewLevelUserListField)?.map((e, idx) => ({ ...e, order_index: idx }));
              methods.setValue(reviewLevelUserListField, newList);
            }),
          ),
      },
    ];
  }, [remove, dispatch, methods, disabled]);

  const review_level_user_list = useMemo(() => {
    return methods.watch(reviewLevelUserListField);
  }, [methods]);

  useEffect(() => {
    if (is_auto_review) {
      setValue(reviewLevelUserListField, []);
    }
  }, [is_auto_review, setValue]);

  return (
    <React.Fragment>
      <BWAccordion title={title}>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <div className='bw_frm_box'>
              <label className='bw_checkbox bw_auto_confirm'>
                <FormInput type='checkbox' field='is_auto_review' value={watch('is_auto_review')} disabled={disabled} />
                <span></span>
                Tự động duyệt
              </label>
            </div>
          </div>
        </div>

        {!watch('is_auto_review') && (
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
        )}
      </BWAccordion>

      {isShowReviewLevelModal && (
        <ReviewLevelModal
          onClose={() => {
            setIsShowReviewLevelModal(false);
          }}
          reviewLevelUserListField={reviewLevelUserListField}
        />
      )}
    </React.Fragment>
  );
};

export default ReviewLevelUserSection;
