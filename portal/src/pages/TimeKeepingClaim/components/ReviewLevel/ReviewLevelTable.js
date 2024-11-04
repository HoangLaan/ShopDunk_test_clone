import DataTable from 'components/shared/DataTable/index';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getUserOptions, getUserReviewByTypeId } from 'services/time-keeping-claim-type.service';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormItem from 'components/shared/BWFormControl/FormItem';
import BWAccordion from 'components/shared/BWAccordion';
import BWButton from 'components/shared/BWButton';
import { useAuth } from 'context/AuthProvider';

const ReviewLevelTable = ({ loading, disabled, title, setIsShowModalReview, setIndexReviewLevel }) => {
  const { setValue, watch, unregister, reset, getValues } = useFormContext();
  const { user } = useAuth();

  const listReviewLevelAdd = useMemo(() => watch('review_levels') ?? [], [watch('review_levels')]);

  const handleSelectDepartment = useCallback((positions = [], index) => {
    getUserOptions({ position_ids: positions.map((item) => item.id ?? item.value ?? item)?.join(',') }).then((data) => {
      setValue(`review_levels.${index}.users_review`, data);
    });
    getUserReviewByTypeId({
      time_keeping_claim_type_id: watch(`time_keeping_claim_type_id`),
      time_keeping_claim_id: watch(`time_keeping_claim_id`)
    }).then((data) => {
      setValue(`review_levels.${index}.reviewed_username`, data[index]?.name);
    });
  }, [getUserReviewByTypeId]);

  function findReviewedUsernames(array1, array2, index) {
    let timeKeepingClaimIds = {};
    array2.forEach(item => {
        timeKeepingClaimIds[item.time_keeping_claim_review_level_id] = item.reviewed_username;
    });
    let result = array1.map(item => {
        if (timeKeepingClaimIds[item.time_keeping_claim_review_level_id] !== undefined) {
            return timeKeepingClaimIds[item.time_keeping_claim_review_level_id];
        } else {
            return null; // Hoặc giá trị mặc định phù hợp với logic của bạn
        }
    });
    return result[index] || null; // Trả về theo index hoặc giá trị mặc định nếu index không hợp lệ
}

  const hanldeSelectReviewLevel = (index) => {
    setIndexReviewLevel(index)
    setIsShowModalReview(true)
  }

  const pending = 2;
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
        header: 'Phòng Ban Mức Duyệt',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (d, index) => {
          return (
            <FormSelect
              disabled={false}
              field={`review_levels.${index}.department_id`}
              list={mapDataOptions4SelectCustom(d.departments)}
              validation={{
                required: 'Phòng ban là bắt buộc',
              }}
              onChange={(value) => {
                //   setValue(`review_levels.${index}.department_id`, value);
                handleSelectDepartment(d.departments.find((d) => parseInt(d.value) === value)?.positions, index);
              }}
            />
          );
        },
      },
      {
        header: 'PB Của Người Duyệt',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => watch(`review_levels.${index}.user_department_name`),
      },
      {
        header: 'Người duyệt',
        style: { minWidth: '12.5em' },
        classNameHeader: 'bw_text_center',
        formatter: (d, index) => {
          const data = watch(`review_levels_of_time_keeping_claim`)
          if (d?.is_reviewed === 2 && (user?.isAdministrator === 1 || d.user_name?.includes(parseInt(user.user_name)))) {
            return `${user?.user_name} - ${user?.full_name}`
          } else if (d?.is_reviewed === 1 || d?.is_reviewed === 0){
            let reviewedUsernames = findReviewedUsernames(watch('review_levels'), data, index);
            return `${reviewedUsernames} - ${d?.full_name}`
          }else {
            return 'Bạn không trong danh sách duyệt'
          }
        },
      },
      // {
      //   header: 'Người duyệt',
      //   style: { minWidth: '12.5em' },
      //   classNameHeader: 'bw_text_center',
      //   formatter: (d, index) => {
      //     const users_review = watch(`review_levels.${index}.users_review`);
      //     if (!users_review) {
      //       handleSelectDepartment(d.departments[0].positions, index);
      //     }
      //     let checkReview = watch(`review_levels.${index}.is_reviewed`);
      //     return (
      //       <FormSelect
      //         disabled={!checkReview}
      //         field={`review_levels.${index}.reviewed_username`}
      //         list={mapDataOptions4SelectCustom(users_review, 'id', 'name')}
      //         validation={{
      //           required: 'Người duyệt là bắt buộc',
      //         }}
      //       />
      //     );
      //   },
      // },
      {
        header: 'Ghi Chú ',
        classNameHeader: 'bw_text_center',
        formatter: (d, index) => {
          return (
            <FormItem disabled={true}>
              <FormTextArea field={`review_levels.${index}.note`} placeholder={'Nhập ghi chú'} rows={'0'} />
            </FormItem>
          );
        },
      },
      {
        header: 'Trạng thái duyệt',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        // User nào duyệt thì chỉ hiện button duyệt của user đó
        formatter: (d, index) => {
          let userCheckReview = user.isAdministrator === 1 ? false : String(d.user_name) !== user.user_name
          // const value = getValues()
          // Điều kiện cũ: d.is_reviewed === 2 && (user.isAdministrator || String(d.reviewed_username) === user.user_name)
          if (d.is_reviewed === 2 && (user.isAdministrator === 1 || d.user_name?.includes(parseInt(user.user_name)))) {
            return (
              <BWButton
                // disabled={false}
                content={'Duyệt'}
                onClick={() => hanldeSelectReviewLevel(index)}
              />
            );
          } else if (d.is_reviewed === 1) {
            return (<span class='bw_label_outline bw_label_outline_success bw_mw_2 text-center mt-10'>Đã Duyệt</span>);
          } else if  (d.is_reviewed === 0) {
            return (<span class='bw_label_outline bw_label_outline_fail bw_mw_2 text-center mt-10' style={{color: 'red', borderColor: 'red'}}>
                    Duyệt Từ Chối
                    </span>);
          } else {
            return (<span class='bw_label_outline bw_label_outline_success bw_mw_2 text-center mt-10'>Chưa Duyệt</span>);
          }
        },
      },
    ],
    [disabled, listReviewLevelAdd, watch('review_levels'), watch(`review_levels_of_time_keeping_claim`)],
  );
  return (
    <>
      <BWAccordion isRequired title={title}>
        <DataTable noSelect={true} noPaging={true} loading={loading} columns={columns} data={listReviewLevelAdd} />
      </BWAccordion>
    </>
  );
};

export default ReviewLevelTable;
