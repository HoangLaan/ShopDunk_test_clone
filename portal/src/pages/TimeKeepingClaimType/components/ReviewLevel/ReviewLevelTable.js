import DataTable from 'components/shared/DataTable/index';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getUserOptions } from 'services/time-keeping-claim-type.service';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import ReviewLevelModal from './Modal/ReviewLevelModal';
import BWAccordion from 'components/shared/BWAccordion';

const ReviewLevelTable = ({ loading, disabled, title }) => {
  const [isOpenReviewLevelModal, setIsOpenReviewLevelModal] = useState(false);

  const { setValue, watch, unregister, reset, getValues } = useFormContext();

  const listReviewLevelAdd = useMemo(() => watch('review_levels') ?? [], [watch('review_levels')]);

  const handleSelectDepartment = useCallback((positions = [], index) => {
    getUserOptions({position_ids: positions.map(item => item.id ?? item.value ?? item)?.join(",")}).then((data) => {
      setValue(`review_levels.${index}.users_review`, data)
    });
  }, [])

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (d, index) => index + 1,
      },
      {
        header: 'Tên mức duyệt',
        accessor: 'review_level_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Phòng ban',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (d, index) => {
          return <FormSelect
              disabled={disabled}
              field={`review_levels.${index}.department_id`}
              list={mapDataOptions4SelectCustom(d.departments)}
              validation={{
                required: 'Phòng ban là bắt buộc',
              }}
              onChange={(value) => {
                setValue(`review_levels.${index}.department_id`, value)
                handleSelectDepartment(d.departments.find(d => parseInt(d.value) === value)?.positions, index)
              }}
          />
        },
      },
      {
        header: 'Người duyệt',
        style: { minWidth: '12.5em' },
        classNameHeader: 'bw_text_center',
        formatter: (d, index) => {
          const users_review = watch(`review_levels.${index}.users_review`);
          if(!users_review){
            handleSelectDepartment(d.departments[0].positions, index)
          }
          return (
            <FormSelect
              mode={'multiple'}
              disabled={disabled}
              field={`review_levels.${index}.user_name`}
              list={ mapDataOptions4SelectCustom(users_review, 'id', 'name')}
              validation={{
                required: 'Người duyệt là bắt buộc',
              }}
            />
          );
        },
      },
    ],
    [disabled, listReviewLevelAdd],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới mức duyệt',
        disabled,
        permission: 'HR_TIMEKEEPINGTYPE_REVIEWLEVEL_ADD',
        onClick: () => setIsOpenReviewLevelModal(true),
      },
      {
        hidden: disabled,
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'HR_TIMEKEEPINGTYPE_REVIEWLEVEL_DEL',
        onClick: (d, index) => {
          reset({
            ...getValues(),
            review_levels: listReviewLevelAdd.filter((_, i) => i !== index)
          })
        },
      },
    ];
  }, [disabled, listReviewLevelAdd]);

  return (
    <>
     <BWAccordion title={title} isRequired >
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
          }}
          onApply={(d) => setValue('review_levels', d)}
          defaultDataSelect={listReviewLevelAdd}
        />
      )}
     </BWAccordion>
     </>
  );
};

export default ReviewLevelTable;
