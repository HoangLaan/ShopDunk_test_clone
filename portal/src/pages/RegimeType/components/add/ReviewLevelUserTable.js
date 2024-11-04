import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';

import { showConfirmModal } from 'actions/global';
import { getUserOptions } from 'services/regime-type.service';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable/index';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import ReviewLevelModal from './modals/ReviewLevelModal';

const ReviewLevelUserTable = ({ disabled, loading, title }) => {
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
        let tmp = value[index];
        value[index] = value[index - 1];
        value[index - 1] = tmp;
        value[index].order_index = index;
        value[index - 1].order_index = index - 1;
      }

      if (type === 'down') {
        let tmp = value[index];
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
                className={'bw_inp bw_mw_2'}
                style={{
                  maxWidth: '100%',
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
                  onChange={(e) => {
                    methods.clearErrors(`review_level_user_list.${index}.is_auto_review`);
                    methods.clearErrors(`review_level_user_list.${index}.user_review_list`);
                    methods.setValue(`review_level_user_list.${index}.is_auto_review`, e.target.checked ? 1 : 0);
                  }}
                />
                <span></span>
              </label>
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
                  field={`review_level_user_list.${index}.is_complete_review`}
                  onChange={(e) => {
                    setValue(
                      `review_level_user_list`,
                      [...watch('review_level_user_list')].map((o) => {
                        return { ...o, is_complete_review: 0 };
                      }),
                    );
                    setValue(`review_level_user_list.${index}.is_complete_review`, 1);
                  }}
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
        content: 'Thêm mới mức duyệt',
        hidden: disabled,
        onClick: () => {
          setIsShowReviewLevelModal(true);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: disabled,
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

  const is_auto_review = methods.watch('is_auto_review') ?? 0;

  return (
    <React.Fragment>
      <BWAccordion title={title}>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <div className='bw_frm_box'>
              <div className='bw_flex bw_align_items_center bw_lb_sex'>
                <label className='bw_checkbox'>
                  <FormInput disabled={disabled} type='checkbox' field='is_auto_review' />
                  <span />
                  Tự động duyệt
                </label>
              </div>
            </div>
          </div>
        </div>
        {is_auto_review === 0 && (
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
