import DataTable from 'components/shared/DataTable/index';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { getUserOptions } from 'services/work-schedule-type.service';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFieldArray, useFormContext } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';
import ReviewLevelModal from './modal/ReviewLevelModal';
import { mapDataOptions4Select } from 'utils/helpers';

const WorkScheduleTypeTableAdd = ({ loading, disabled }) => {
  const [isOpenReviewLevelModal, setIsOpenReviewLevelModal] = useState(false);

  const [userOptions, setUserOptions] = useState([]);
  const { setValue, watch, unregister } = useFormContext();

  const listReviewLevelAdd = useMemo(() => {
    const listReviewLevel = watch('review_levels') ?? [];
    return listReviewLevel.map((item) => ({ ...item, user_review: userOptions }));
  }, [watch('review_levels'), userOptions]);

  useEffect(() => {
    getUserOptions().then(({ items: user }) => setUserOptions(mapDataOptions4Select(user, 'id', 'name')));
  }, []);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: '',
        classNameBody: '',
        formatter: (d, index) => index + 1,
      },
      {
        header: 'Tên mức duyệt',
        accessor: 'work_schedule_review_level_name',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Người duyệt',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (d, index) => {
          return (
            <FormSelect
              disabled={disabled}
              allowClear={true}
              field={`review_levels.${index}.user_name`}
              list={d.user_review}
              validation={{
                required: 'Người duyệt là bắt buộc',
              }}
            />
          );
        },
      },
      {
        header: 'Tự động duyệt',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (d, index) => {
          return (
            <FormInput
              disabled={disabled || watch(`review_levels.${index}.is_complete`)}
              type='checkbox'
              field={`review_levels.${index}.is_auto_review`}
            />
          );
        },
      },
      {
        header: 'Mức duyệt cuối',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (d, index) => {
          return (
            <FormInput
              disabled={disabled || watch(`review_levels.${index}.is_auto_review`)}
              type='checkbox'
              field={`review_levels.${index}.is_complete`}
            />
          );
        },
      },
    ],
    [disabled],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới mức duyệt',
        permission: 'CRM_TASKWORKFLOW_ADD',
        onClick: () => setIsOpenReviewLevelModal(true),
      },
      {
        hidden: disabled,
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'CRM_TASKWORKFLOW_DEL',
        onClick: (d, i) => {
          unregister(`review_levels.${i}.user_name`);
          setValue(
            'review_levels',
            watch('review_levels').filter((i) => i.work_schedule_review_level_id !== d.work_schedule_review_level_id),
          );
        },
      },
    ];
  }, [disabled]);

  return (
    <>
      <DataTable
        actions={actions}
        noSelect={true}
        noPaging={true}
        loading={loading}
        columns={columns}
        data={listReviewLevelAdd}
      />

      {isOpenReviewLevelModal && (
        <ReviewLevelModal
          open={isOpenReviewLevelModal}
          onClose={() => {
            setIsOpenReviewLevelModal(false);
            setValue('departments', []);
          }}
          onApply={(d) => setValue('review_levels', d)}
          defaultDataSelect={[]}
        />
      )}
    </>
  );
};

export default WorkScheduleTypeTableAdd;
