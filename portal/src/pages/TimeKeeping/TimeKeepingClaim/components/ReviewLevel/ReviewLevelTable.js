import DataTable from 'components/shared/DataTable/index';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getUserOptions, getUserReviewByTypeId } from 'services/time-keeping-claim-type.service';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useAuth } from 'context/AuthProvider';

const ReviewLevelTable = ({ loading, disabled, title }) => {
  const { setValue, watch, unregister, reset, getValues } = useFormContext();
  const listReviewLevelAdd = useMemo(() => watch('review_levels') ?? [], [watch('review_levels')]);
  const { user } = useAuth();

  const handleSelectDepartment = useCallback((positions = [], index) => {
    //chỗ này lấy lên bị sai nếu khai báo thiếu phòng ban.
    getUserOptions({ position_ids: positions.map(item => item.id ?? item.value ?? item)?.join(",") })
      .then((data) => { setValue(`review_levels.${index}.users_review`, data) }
      );

    if (watch(`time_keeping_claim_type_id`) && watch(`time_keeping_claim_id`)) {
      getUserReviewByTypeId({
        time_keeping_claim_type_id: watch(`time_keeping_claim_type_id`),
        time_keeping_claim_id: watch(`time_keeping_claim_id`)
      }).then((data) => {
        setValue(`review_levels.${index}.reviewed_username`, data[index]?.name);
        setValue(`review_levels.${index}.note`, data[index]?.note);
        setValue(`review_levels.${index}.is_reviewed`, data[index]?.is_reviewed);
        setValue(`review_levels.${index}.full_name`, data[index]?.full_name);
        setValue(`review_levels.${index}.user_name`, data[index]?.user_name);
      });
    }
  }, []);

  function findReviewedUsernames(array1, array2, index) {
    let timeKeepingClaimIds = {};
    array2?.forEach(item => {
      timeKeepingClaimIds[item.time_keeping_claim_review_level_id] = item.reviewed_username;
    });
    let result = array1?.map(item => {
      if (timeKeepingClaimIds[item.time_keeping_claim_review_level_id] !== undefined) {
        return timeKeepingClaimIds[item.time_keeping_claim_review_level_id];
      } else {
        return null; // Hoặc giá trị mặc định phù hợp với logic của bạn
      }
    });
    return result[index] || null; // Trả về theo index hoặc giá trị mặc định nếu index không hợp lệ
  }
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (d, index) => index + 1,
      },
      {
        header: 'Tên mức duyệt',
        accessor: 'review_level_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Phòng ban người duyệt',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => watch(`review_levels.${index}.user_department_name`)
      },
      {
        header: 'Người duyệt',
        style: { minWidth: '12.5em' },
        classNameHeader: 'bw_text_center',
        formatter: (d, index) => {
          const users_review = watch(`review_levels.${index}.users_review`);
          
          if (!users_review) {
            handleSelectDepartment(d.departments[0].positions, index)
          }

          return (
            <FormSelect
              disabled={watch('review_levels_of_time_keeping_claim')}
              field={`review_levels.${index}.reviewed_username`}
              list={mapDataOptions4SelectCustom(users_review, 'id', 'name')}
              validation={{
                required: 'Người duyệt là bắt buộc',
              }}
            />
          );
        },
      },
      {
        header: 'Ghi chú duyệt',
        classNameHeader: 'bw_text_center',
        // Nếu là tạo mới giải trình thì ẩn đi
        hidden: !watch('review_levels_of_time_keeping_claim'),
        formatter: (d, index) => {
          return (
            <FormItem disabled={true} >
              <FormTextArea
                field={`review_levels.${index}.note`}
                placeholder={'Nhập ghi chú'}
              />
            </FormItem>
          )
        }
      },
      {
        header: 'Trạng thái duyệt',
        hidden: !watch('review_levels_of_time_keeping_claim'),
        classNameHeader: 'bw_text_center',
        formatter: (d, index) => {
          return d.is_reviewed === 2 ? 'Đang duyệt' : (d.is_reviewed ? 'Đã duyệt' : 'Không duyệt')
        }
      },
    ],
    [disabled, listReviewLevelAdd],
  );
  return (
    <>
      <DataTable
        title={'Mức duyệt'}
        noSelect={true}
        noPaging={true}
        loading={loading}
        columns={columns}
        data={listReviewLevelAdd}
      />
    </>
  );
};

export default ReviewLevelTable;
