import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';
// import { showToast } from 'utils/helpers';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { getUserOptions } from 'services/expend-type.service';
import ReviewLevelModal from './modals/ReviewLevelModal';
import { PERMISSION_EXPEND_TYPE } from 'pages/ExpendType/utils/constants';
import { mapDataOptions4Select, showToast } from 'utils/helpers';

const ReviewLevelUserTable = ({ disabled, loading }) => {
  const methods = useFormContext();
  const { control, setValue, watch } = methods;
  const { remove } = useFieldArray({
    control,
    name: 'review_level_user_list',
  });
  const dispatch = useDispatch();
  const [isShowReviewLevelModal, setIsShowReviewLevelModal] = useState(false);

  const fetchUserOptions = (keyword, review_level_id) => getUserOptions({ keyword, limit: 20, review_level_id });

  const handleSort = useCallback(
    (type, index) => {
      let value = Object.values(methods.watch(`review_level_user_list`) || {});

      if (type === 'up') {
        if (value.length === index + 1) {
          value[index].is_complete_review = 0;
          value[index - 1].is_complete_review = 1;
        }

        let tmp = value[index];
        value[index] = value[index - 1];
        value[index - 1] = tmp;
        value[index].order_index = index;
        value[index - 1].order_index = index - 1;
      }

      if (type === 'down') {
        let tmp = value[index];
        if (value.length - 1 === index + 1) {
          value[index].is_complete_review = 1;
          value[index + 1].is_complete_review = 0;
        }
        value[index] = value[index + 1];
        value[index + 1] = tmp;
        value[index].order_index = index;
        value[index + 1].order_index = index + 1;
      }

      methods.setValue(`review_level_user_list`, value);
    },
    [methods],
  );

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => methods.watch(`review_level_user_list.${index}.order_index`) + 1,
      },
      {
        header: '',
        formatter: (p, index) => {
          if (index === 0 && Object.values(methods.watch(`review_level_user_list`)).length > 1) {
            return (
              <div className='bw_btn_table bw_red' disabled={disabled}>
                <i
                  className='fi fi-rr-angle-small-down'
                  onClick={() => (!disabled ? handleSort('down', index) : null)}></i>
              </div>
            );
          } else if (
            index + 1 === Object.values(methods.watch(`review_level_user_list`)).length &&
            Object.values(methods.watch(`review_level_user_list`)).length > 1
          ) {
            return (
              <div className='bw_btn_table bw_blue' disabled={disabled}>
                <i className='fi fi-rr-angle-small-up' onClick={() => (!disabled ? handleSort('up', index) : null)}></i>
              </div>
            );
          } else if (index > 0) {
            return (
              <>
                <div className='bw_btn_table bw_red' disabled={disabled}>
                  <i
                    className='fi fi-rr-angle-small-down'
                    onClick={() => (!disabled ? handleSort('down', index) : null)}></i>
                </div>
                <div className='bw_btn_table bw_blue' style={{ marginLeft: 4 }} disabled={disabled}>
                  <i
                    className='fi fi-rr-angle-small-up'
                    onClick={() => (!disabled ? handleSort('up', index) : null)}></i>
                </div>
              </>
            );
          }
        },
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
                className={'bw_inp'}
                style={{
                  maxWidth: '100%',
                  padding: 0,
                }}
                disabled={disabled || methods.watch(`review_level_user_list.${index}.is_auto_review`)}
                type='text'
                field={`review_level_user_list.${index}.user_review_list`}
                placeholder='Chọn người duyệt'
                fetchOptions={(keyword) =>
                  fetchUserOptions(keyword, methods.watch(`review_level_user_list.${index}.review_level_id`))
                }
                validation={{
                  required:
                    !Boolean(methods.watch(`review_level_user_list.${index}.is_auto_review`)) &&
                    'Người duyệt là bắt buộc',
                }}
                mode={'multiple'}
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
                  disabled={true}
                  type='checkbox'
                  field={`review_level_user_list.${index}.is_complete_review`}
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
                  field={`review_level_user_list.${index}.is_auto_review`}
                />
                <span></span>
              </label>
            </React.Fragment>
          );
        },
      },
    ],
    [disabled, setValue, watch, handleSort, methods],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mức duyệt',
        hidden: disabled,
        permission: [PERMISSION_EXPEND_TYPE.ADD, PERMISSION_EXPEND_TYPE.EDIT],
        onClick: () => {
          setIsShowReviewLevelModal(true);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: disabled,
        permission: [PERMISSION_EXPEND_TYPE.ADD, PERMISSION_EXPEND_TYPE.EDIT],
        onClick: (_, index) =>
          dispatch(
            showConfirmModal(['Xoá mức duyệt này?'], () => {
              remove(index);

              //update order index
              methods.setValue(
                'review_level_user_list',
                methods.watch('review_level_user_list')?.map((e, idx) => {
                  return { ...e, order_index: idx };
                }),
              );
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
      <BWAccordion title='Thông tin mức duyệt'>
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
          setReviewLevelModalData={() => {}}
        />
      )}
    </React.Fragment>
  );
};

ReviewLevelUserTable.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ReviewLevelUserTable;
