import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { getUserOptions, getDepartmentOptions } from 'services/announce-type.service';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import ReviewLevelModal from './modals/ReviewLevelModal';
import { showToast } from 'utils/helpers';

const AnnounceTypeReviewLevelUserTable = ({ disabled, loading }) => {
  const methods = useFormContext();
  const { control, setValue, watch } = methods;
  const { remove } = useFieldArray({
    control,
    name: 'review_level_user_list',
  });
  const dispatch = useDispatch();
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isShowReviewLevelModal, setIsShowReviewLevelModal] = useState(false);

  const fetchUserOptions = useCallback((keyword, department_id) => getUserOptions({ keyword, department_id }), []);

  const is_auto_review = useMemo(() => Boolean(methods.watch('is_auto_review')), [methods]);

  const company_id = useMemo(() => methods.watch('company_id'), [methods]);

  useEffect(() => {
    if (company_id) {
      getDepartmentOptions({ company_id }).then((res) => {
        setDepartmentOptions(res);
      });
    }
  }, [company_id, setDepartmentOptions]);

  const updateOrderIndex = useCallback(() => {
    methods.setValue(
      'review_level_user_list',
      methods.watch('review_level_user_list')?.map((e, idx) => {
        return { ...e, order_index: idx };
      }),
    );
  }, [methods]);

  const removeEmptyRow = useCallback(() => {
    let value = Object.values(watch(`review_level_user_list`) || {});
    value = value.filter((item) => item.review_level_id && (item.user_review_list?.length || item.is_auto_review));
    setValue(`review_level_user_list`, value);
  }, [watch, setValue]);

  useEffect(removeEmptyRow, [is_auto_review, removeEmptyRow]);

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
              <div
                className='bw_btn_table bw_red'
                disabled={disabled}
                onClick={() => (!disabled ? handleSort('down', index) : null)}>
                <i className='fi fi-rr-angle-small-down'></i>
              </div>
            );
          } else if (
            index + 1 === Object.values(methods.watch(`review_level_user_list`)).length &&
            Object.values(methods.watch(`review_level_user_list`)).length > 1
          ) {
            return (
              <div
                className='bw_btn_table bw_blue'
                disabled={disabled}
                onClick={() => (!disabled ? handleSort('up', index) : null)}>
                <i className='fi fi-rr-angle-small-up'></i>
              </div>
            );
          } else if (index > 0) {
            return (
              <>
                <div
                  className='bw_btn_table bw_red'
                  disabled={disabled}
                  onClick={() => (!disabled ? handleSort('down', index) : null)}>
                  <i className='fi fi-rr-angle-small-down'></i>
                </div>
                <div
                  className='bw_btn_table bw_blue'
                  style={{ marginLeft: 4 }}
                  disabled={disabled}
                  onClick={() => (!disabled ? handleSort('up', index) : null)}>
                  <i className='fi fi-rr-angle-small-up'></i>
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
        header: 'Phòng ban',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <React.Fragment>
              <FormSelect
                className={'bw_inp bw_mw_2'}
                style={{
                  maxWidth: '100%',
                }}
                disabled={disabled || methods.watch(`review_level_user_list.${index}.is_auto_review`)}
                type='text'
                field={`review_level_user_list.${index}.department_id`}
                list={departmentOptions.map((e) => ({ value: e.id, label: e.name })) || []}
                placeholder='Chọn phòng ban'
                validation={{
                  required:
                    !Boolean(methods.watch(`review_level_user_list.${index}.is_auto_review`)) &&
                    'Phòng ban là bắt buộc',
                }}
                onSelect={(e) => {
                  methods.unregister(`review_level_user_list.${index}.department_id`);
                  setValue(`review_level_user_list.${index}.user_review_list`, []);
                  setTimeout(() => {
                    methods.setValue(`review_level_user_list.${index}.department_id`, e);
                  }, 1);
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
              {methods.watch(`review_level_user_list.${index}.department_id`) ? (
                <FormDebouneSelect
                  className={'bw_inp bw_mw_2'}
                  style={{
                    maxWidth: '100%',
                  }}
                  disabled={disabled || methods.watch(`review_level_user_list.${index}.is_auto_review`)}
                  type='text'
                  field={`review_level_user_list.${index}.user_review_list`}
                  list={methods.watch(`review_level_user_list.${index}.user_review_options_list`) || []}
                  placeholder='Chọn người duyệt'
                  fetchOptions={(keyword) =>
                    fetchUserOptions(keyword, methods.watch(`review_level_user_list.${index}.department_id`))
                  }
                  validation={{
                    required:
                      !Boolean(methods.watch(`review_level_user_list.${index}.is_auto_review`)) &&
                      'Người duyệt là bắt buộc',
                  }}
                  mode={'multiple'}
                />
              ) : (
                ''
              )}
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
                  // disabled={disabled || watch(`review_level_user_list.${index}.is_auto_review`)}
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
    [disabled, setValue, watch, handleSort, methods, fetchUserOptions, departmentOptions],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mức duyệt',
        hidden: disabled,
        onClick: () => {
          if (Boolean(methods.watch('company_id'))) setIsShowReviewLevelModal(true);
          else {
            showToast.error('Vui lòng chọn công ty!');
          }
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
              updateOrderIndex();
            }),
          ),
      },
    ];
  }, [remove, disabled, dispatch, updateOrderIndex, setIsShowReviewLevelModal, methods]);

  const review_level_user_list = useMemo(() => {
    return methods.watch('review_level_user_list');
  }, [methods]);

  return (
    <>
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
    </>
  );
};

AnnounceTypeReviewLevelUserTable.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default AnnounceTypeReviewLevelUserTable;
